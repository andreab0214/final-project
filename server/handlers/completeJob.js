const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const completeJob = async (req, res) => {
  //logged in user
  const user = req.user;
  const _id = user._id;
  //job info
  const { jobCompleted } = req.body;
  const { userName, jobId } = req.params;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");

    //update completed to true in db
    const updateUser = await db.collection("users").findOneAndUpdate(
      {
        _id: _id,
        name: userName,
        jobs: { $elemMatch: { jobId: jobId } },
      },
      { $set: { "jobs.$.completed": jobCompleted } },
      { returnOriginal: false }
    );

    if (!updateUser) {
      res
        .status(400)
        .json({ status: 400, message: "oops something went wrong" });
    } else {
      res
        .status(200)
        .json({ status: 200, data: updateUser.value, message: "success" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = completeJob;
