const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const answerForm = async (req, res) => {
  //logged in user
  const user = req.user;
  const _id = user._id;
  //job info
  const { formData } = req.body;
  const { userName, jobId } = req.params;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");

    //find user
    const loggedUser = await db.collection("users").findOne({ _id: _id });

    const job = loggedUser.jobs.find((job) => job.jobId === jobId);
    const formIndex = job.forms.findIndex((form) => form._id === formData._id);

    if (formIndex === -1) {
      res
        .status(400)
        .json({ status: 400, message: "oops something went wrong" });
    }

    const newForm = { ...formData, isAnswered: true };

    const updatedUser = await db.collection("users").findOneAndUpdate(
      {
        _id: _id,
        name: userName,
        jobs: { $elemMatch: { jobId: jobId } },
      },
      {
        $set: {
          [`jobs.$.forms.${formIndex}`]: newForm,
        },
      },
      { returnOriginal: false }
    );

    if (!updatedUser) {
      res
        .status(400)
        .json({ status: 400, message: "oops something went wrong" });
    } else {
      res
        .status(200)
        .json({ status: 200, data: updatedUser.value, message: "success" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = answerForm;
