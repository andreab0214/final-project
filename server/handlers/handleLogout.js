const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const handleLogout = async (req, res) => {
  //logged in user
  const user = req.user;
  const _id = user._id;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");

    //find user
    const loggedUser = await db.collection("users").findOne({ _id: _id });

    if (!loggedUser) {
      res
        .status(400)
        .json({ status: 400, message: "oops something went wrong" });
    } else {
      res.clearCookie("access-token");
      res.status(200).json({ status: 200, message: "success" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = handleLogout;
