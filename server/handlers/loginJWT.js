const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const bcrypt = require("bcrypt");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const { createToken, createRefreshToken } = require("../utils/JWT");

//handle login and create a JWT in cookies
const loginJWT = async (req, res) => {
  const { email, password } = req.body.formData;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    //find user credentials
    const userCred = await db
      .collection("user-credentials")
      .findOne({ email: email });

    if (!userCred) {
      return res.status(400).json({ status: 400, message: "No user found" });
    } else {
      //compare passwords and confirm they match
      const dbPassword = userCred.password;
      const match = await bcrypt.compare(password, dbPassword);
      if (match) {
        //find user in users collection
        const user = await db
          .collection("users")
          .findOne({ _id: userCred._id });

        const accessToken = createToken(user);

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

module.exports = loginJWT;
