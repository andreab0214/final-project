const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

module.exports = getUserId;
