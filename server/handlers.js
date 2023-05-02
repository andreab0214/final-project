"use strict";
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const { createToken, createRefreshToken } = require("./utils/JWT");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//get all users
const getUsers = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    const users = await db.collection("users").find().toArray();

    res.status(200).json({ status: 200, data: users, message: "success" });
    if (!users) {
      res.status(404).json({ status: 404, message: "no data found" });
    }

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

//get user Id from cookie and send user data to frontend
const getUserId = async (req, res) => {
  const user = req.user;
  const _id = user._id;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    const userDb = await db.collection("users").findOne({ _id: _id });

    if (!userDb) {
      res.status(400).json({ status: 400, message: "user does not exist" });
    } else {
      res.status(200).json({ status: 200, data: userDb, message: "success" });
    }

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

//get user profile from manager/admin
const getUserProfile = async (req, res) => {
  const user = req.user;
  const _id = user._id;
  const { userName } = req.params;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    const adminDb = await db.collection("users").findOne({ _id: _id });
    const userDb = await db.collection("users").findOne({
      company_id: adminDb.company_id,
      name: userName,
    });

    if (!userDb) {
      res.status(400).json({ status: 400, message: "user does not exist" });
    } else {
      res.status(200).json({ status: 200, data: userDb, message: "success" });
    }

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

// create user in db "users" and usercredentials
const createUser = async (req, res) => {
  const user = req.user;
  const _id = user._id;
  const { userId } = req.params;
  const { name, email, password } = req.body.formData;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    //find admin user
    const adminUser = await db.collection("users").findOne({ _id: _id });

    const userDb = await db.collection("users").findOne({ _id: userId });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!userDb) {
      //create user
      const newUser = {
        _id: userId,
        company_id: adminUser.company_id,
        name: name,
        email: email,
        jobs: [],
        role: "user",
      };
      //create credentials user
      const userCredentials = {
        _id: userId,
        email: email,
        password: hashedPassword,
      };

      await db.collection("users").insertOne(newUser);
      await db.collection("user-credentials").insertOne(userCredentials);

      //need to update user name in admin/managers object
      const adminDb = await db
        .collection("users")
        .updateOne(
          { usersId: { $elemMatch: { _id: userId } } },
          { $set: { "usersId.$.name": name } }
        );

      res.status(200).json({ status: 200, data: newUser, message: "success" });
    } else {
      res
        .status(400)
        .json({ status: 400, data: userDb, message: "user already exists" });
    }

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

//create a user account in Credentials collection and store in users collection without password and create company collection
const createNewCompany = async (req, res) => {
  const { company, fname, lname, email, password, users } = req.body.formData;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    const user = await db.collection("users").findOne({ email: email });
    //see if user already exists
    if (user) {
      res.status(400).json({ status: 400, message: "user already exists" });
    } else {
      //hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      //create objects for users purchased
      const usersAr = [];
      for (let i = 1; i <= users; i++) {
        const createUser = {
          _id: uuidv4(),
          name: `user ${i}`,
        };
        usersAr.push(createUser);
      }

      //create id's
      const companyId = uuidv4();
      const adminId = uuidv4();

      //user to be added
      const newAdmin = {
        _id: adminId,
        company_id: companyId,
        fname: fname,
        lname: lname,
        email: email,
        usersId: usersAr,
        role: "admin",
      };

      //newUser credentials
      const credentials = {
        _id: adminId,
        email: email,
        password: hashedPassword,
      };

      //create company
      const newCompany = {
        _id: companyId,
        company_name: company,
        role: "company",
        adminId: newAdmin._id,
        managersId: [],
      };

      //add user to credentials collection
      const addManagerCredentials = await db
        .collection("user-credentials")
        .insertOne(credentials);

      // add non-credentials admin info to user collection
      await db.collection("users").insertOne(newAdmin);

      //create company
      const addCompany = await db.collection("companies").insertOne(newCompany);

      /* await db
          .collection("companies")
          .updateOne(
            { _id: companyExist._id },
            { $push: { managers: newManager } } */

      res.status(200).json({
        status: 200,
        data: { newAdmin, newCompany },
        message: "user added!",
      });
    }

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

const loginJWT = async (req, res) => {
  const { email, password } = req.body.formData;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    const userCred = await db
      .collection("user-credentials")
      .findOne({ email: email });

    if (!userCred) {
      return res.status(400).json({ status: 400, message: "No user found" });
    } else {
      const dbPassword = userCred.password;
      const match = await bcrypt.compare(password, dbPassword);
      if (match) {
        //find user in users collection
        const user = await db
          .collection("users")
          .findOne({ _id: userCred._id });

        const accessToken = createToken(user);
        // const refreshToken = createRefreshToken(user);

        //store access-token in cookies
        res.cookie("access-token", accessToken, {
          maxAge: 600000,
          httpOnly: true,
        });

        /*  //stretch-goal
        res.cookie("refresh-token", refreshToken, {
          maxAge: 3.154e10,
          httpOnly: true,
        }); */

        res.status(200).json({ status: 200, data: user, message: "logged in" });
      } else {
        res.status(400).json({ status: 400, message: "incorrect password" });
      }
    }

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = {
  getUsers,
  getUserId,
  createNewCompany,
  loginJWT,
  getUserProfile,
  createUser,
};
