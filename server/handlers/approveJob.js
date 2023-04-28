const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const approveJob = async (req, res) => {
  //logged in admin/manager
  const user = req.user;
  const _id = user._id;
  //job info
  const { jobApproval } = req.body;
  const { userName, jobId } = req.params;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    const loggedUser = await db.collection("users").findOne({ _id: _id });

    //update approved to true in db
    const updateUser = await db.collection("users").findOneAndUpdate(
      {
        company_id: loggedUser.company_id,
        name: userName,
        jobs: { $elemMatch: { jobId: jobId } },
      },
      { $set: { "jobs.$.approved": jobApproval } },
      { returnOriginal: false }
    );

    if (!updateUser) {
      res
        .status(400)
        .json({ status: 400, message: "oops something went wrong" });
    } else {
      res.status(200).json({ status: 200, message: "success" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = approveJob;
