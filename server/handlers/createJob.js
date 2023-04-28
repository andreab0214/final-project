const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { cloudinary } = require("../utils/cloudinary");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const createJob = async (req, res) => {
  //logged in admin/manager
  const user = req.user;
  const _id = user._id;
  //form from create job, userId for user under manager/admin
  const { jobId, type, clientName, address, forms, drawings, notes } =
    req.body.formData;
  const { userId } = req.params;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    const loggedUser = await db.collection("users").findOne({ _id: _id });
    const userDb = await db.collection("users").findOne({ _id: userId });

    //see if jobId already exists
    const isJobId = await db.collection("users").findOne({
      _id: userId,
      "jobs.jobId": jobId,
    });

    if (isJobId) {
      res.status(400).json({
        status: 400,
        message: "Job Id already exists, please choose a new one",
      });
    } else if (!userDb) {
      res
        .status(400)
        .json({ status: 400, message: "oops something went wrong" });
    } else if (loggedUser.role === "user") {
      res.status(400).json({
        status: 400,
        message: "Looks like you don't have permission for this",
      });
    } else {
      const uploads = await Promise.all(
        drawings.map((drawing) => {
          return cloudinary.uploader.upload(drawing, {
            upload_preset: "onSite",
          });
        })
      );

      const drawingUrls = uploads;

      const job = {
        _id: jobId,
        jobId: jobId,
        type: type,
        client: clientName,
        address: address,
        forms: forms,
        drawings: drawings.length >= 0 ? drawingUrls : null,
        notes: notes,
        completed: false,
        approved: false,
      };

      await db
        .collection("users")
        .updateOne(
          { _id: userId },
          { $push: { jobs: { $each: [job], $position: 0 } } }
        );

      const updatedUser = await db.collection("users").findOne({ _id: userId });

      res
        .status(200)
        .json({ status: 200, data: updatedUser, message: "success" });
    }
    client.close();
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = createJob;
