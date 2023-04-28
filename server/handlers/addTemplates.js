const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { v4: uuidv4 } = require("uuid");
const templates = require("../templates");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const templateArray = [];
for (let i = 0; i < templates.length; i++) {
  const template = templates[i];
  const newTemplate = {
    _id: uuidv4(),
    ...template,
  };
  templateArray.push(newTemplate);
}

//add templates from templates.json

const addTemplates = async (res, req) => {
  console.log(templates);
  const client = new MongoClient(MONGO_URI, options);

  try {
    await client.connect();
    const db = client.db("onSite");

    const result = await db.collection("templates").insertMany(templateArray);
    if (result.acknowledged) {
      console.log("success");
    } else {
      console.log("Failed");
    }
  } catch (err) {
    console.log(err.message);
  }

  client.close();
};

module.exports = addTemplates;
