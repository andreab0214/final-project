const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const jobDetails = async (req, res) => {
  //logged in admin/manager
  const user = req.user;
  const _id = user._id;
  const { userName, jobId } = req.params;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    const loggedUser = await db.collection("users").findOne({ _id: _id });

    //get user
    const userDb = await db.collection("users").findOne({
      company_id: loggedUser.company_id,
      name: userName,
      "jobs.jobId": jobId,
    });
    //return job info
    const jobData = userDb.jobs.find((job) => job.jobId === jobId);

    if (!userDb) {
      res
        .status(400)
        .json({ status: 400, message: "oops something went wrong" });
    } else {
      res.status(200).json({ status: 200, data: jobData, message: "success" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = jobDetails;
