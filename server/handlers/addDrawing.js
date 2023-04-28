const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { cloudinary } = require("../utils/cloudinary");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addDrawing = async (req, res) => {
  //logged in admin/manager
  const user = req.user;
  const _id = user._id;
  //job info
  const { drawings } = req.body;
  const { userName, jobId } = req.params;
  console.log(drawings);
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    const loggedUser = await db.collection("users").findOne({ _id: _id });
    console.log("hi");
    const uploads = await Promise.all(
      drawings.map((drawing) => {
        return cloudinary.uploader.upload(drawing, {
          upload_preset: "onSite",
        });
      })
    );
    console.log("hi2");
    console.log(uploads);

    const uploadingDrawings = await Promise.all(
      uploads.map((upload) => {
        db.collection("users").updateOne(
          {
            company_id: loggedUser.company_id,
            name: userName,
            jobs: { $elemMatch: { jobId: jobId } },
          },
          { $push: { "jobs.$.drawings": upload ? upload : null } }
        );
      })
    );

    const updatedUser = await db.collection("users").findOne({
      company_id: loggedUser.company_id,
      name: userName,
      jobs: { $elemMatch: { jobId: jobId } },
    });

    const jobData = updatedUser.jobs.find((job) => job.jobId === jobId);

    if (!uploads) {
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

module.exports = addDrawing;
