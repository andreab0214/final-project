const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const bcrypt = require("bcrypt");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

module.exports = createUser;
