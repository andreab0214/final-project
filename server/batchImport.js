console.log("Starting script...");

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { v4: uuidv4 } = require("uuid");
const templates = require("./templates.json");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const templateArray = [];
console.log(templates);
for (let i = 0; i < templates.length; i++) {
  const template = templates[i];
  const newTemplate = {
    _id: uuidv4(),
    ...template,
  };
  templateArray.push(newTemplate);
}

const batchImport = async () => {
  console.log(templates);
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("onSite");

    const result = await db.collection("templates").insertMany(templateArray);

    console.log("success");
    //res.status(200).json({ status: 200, message: "success" });
  } catch (err) {
    console.log(err.message);
  }

  client.close();
};

batchImport();

module.exports = batchImport;
