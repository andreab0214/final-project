const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getTemplates = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    const templates = await db.collection("templates").find().toArray();

    if (!templates) {
      res.status(404).json({ status: 404, message: "no data found" });
    } else {
      res
        .status(200)
        .json({ status: 200, data: templates, message: "success" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = getTemplates;
