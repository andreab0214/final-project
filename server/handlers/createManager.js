const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// create user in db "users" and usercredentials
const createManager = async (req, res) => {
  const user = req.user;
  const _id = user._id;
  const { name, email, password } = req.body.formData;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    //find admin user
    const loggedUser = await db.collection("users").findOne({ _id: _id });

    //does manager email already exist
    const managerUser = await db.collection("users").findOne({ email: email });

    const hashedPassword = await bcrypt.hash(password, 10);

    //if logged in user is not an admin do not allow them to proceed
    if (loggedUser.role !== "admin") {
      res.status(400).json({
        status: 400,
        message: "You do not have permission to add a manager",
      });
    } else {
      if (!managerUser) {
        //create manager
        const newManager = {
          _id: uuidv4(),
          company_id: loggedUser.company_id,
          name: name,
          email: email,
          usersId: loggedUser.usersId,
          role: "manager",
        };
        //create credentials user
        const userCredentials = {
          _id: newManager._id,
          email: email,
          password: hashedPassword,
        };

        //add manager to users
        await db.collection("users").insertOne(newManager);
        //add manager credentials
        await db.collection("user-credentials").insertOne(userCredentials);

        //need to add manager in admin object
        const adminDb = await db
          .collection("users")
          .updateOne(
            { _id: _id },
            { $push: { managers: { $each: [newManager] } } }
          );

        //add manager id to companies array
        const company = await db
          .collection("companies")
          .updateOne(
            { _id: loggedUser.company_id },
            { $push: { managersId: [newManager._id] } }
          );

        res
          .status(200)
          .json({ status: 200, data: newManager, message: "success" });
      } else {
        res
          .status(400)
          .json({ status: 400, message: "manager already exists" });
      }
    }

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = createManager;
