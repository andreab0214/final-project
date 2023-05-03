const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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

module.exports = getUserProfile;
