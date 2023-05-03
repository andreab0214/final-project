const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// create user in db "users" and usercredentials
const deleteManager = async (req, res) => {
  const user = req.user;
  const _id = user._id;
  const { managerId } = req.params;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    //find admin user
    const loggedUser = await db.collection("users").findOne({
      _id: _id,
      managers: { $elemMatch: { _id: managerId } },
    });

    if (!loggedUser) {
      res.status(400).json({
        status: 400,
        message: "Oops something went wrong",
      });
    } else {
      if (loggedUser.role !== "admin") {
        res.status(400).json({
          status: 400,
          message: "You do not have permission to delete a manager",
        });
      } else {
        //remove manager from users in Mongo
        await db.collection("users").deleteOne({
          _id: managerId,
        });
        //remove manager from user-credentials in Mongo
        await db.collection("user-credentials").deleteOne({
          _id: managerId,
        });

        //remove manager from admin object
        const result = await db.collection("users").updateOne(
          {
            _id: _id,
          },
          { $pull: { managers: { _id: managerId } } }
        );

        res.status(200).json({ status: 200, message: "success" });
      }
    }

    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = deleteManager;
