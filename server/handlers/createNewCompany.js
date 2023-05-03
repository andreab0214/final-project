const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//create a user account in Credentials collection and store in users collection without password and create company collection
const createNewCompany = async (req, res) => {
  const { company, fname, lname, email, password, users, creditCard, expiry } =
    req.body.formData;

  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("onSite");
    const user = await db.collection("users").findOne({ email: email });

    //check expiry date
    const year = Number("20" + expiry.slice(2));
    const month = Number(expiry.slice(0, 2));
    const expiryDate = new Date(year, month);
    const currentDate = new Date();

    //see if user already exists
    if (user) {
      res.status(400).json({ status: 400, message: "user already exists" });
    } else {
      //check credit card info
      if (month > 12) {
        res.status(400).json({ status: 400, message: "invalid expiry date" });
      } else if (creditCard.length < 16) {
        res.status(400).json({ status: 400, message: "invalid credit card" });
      } else if (expiryDate < currentDate) {
        res.status(400).json({ status: 400, message: "invalid expiry date" });
      } else {
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create objects for users purchased
        const usersAr = [];
        for (let i = 1; i <= users; i++) {
          const createUser = {
            _id: uuidv4(),
            name: `user ${i}`,
          };
          usersAr.push(createUser);
        }

        //create id's
        const companyId = uuidv4();
        const adminId = uuidv4();

        //user to be added
        const newAdmin = {
          _id: adminId,
          company_id: companyId,
          fname: fname,
          lname: lname,
          email: email,
          managers: [],
          usersId: usersAr,
          role: "admin",
        };

        //newUser credentials
        const credentials = {
          _id: adminId,
          email: email,
          password: hashedPassword,
        };

        //create company
        const newCompany = {
          _id: companyId,
          company_name: company,
          role: "company",
          adminId: newAdmin._id,
          managersId: [],
        };

        //add user to credentials collection
        const addManagerCredentials = await db
          .collection("user-credentials")
          .insertOne(credentials);

        // add non-credentials admin info to user collection
        await db.collection("users").insertOne(newAdmin);

        //create company
        const addCompany = await db
          .collection("companies")
          .insertOne(newCompany);

        /* await db
      .collection("companies")
      .updateOne(
        { _id: companyExist._id },
        { $push: { managers: newManager } } */

        res.status(200).json({
          status: 200,
          data: { newAdmin, newCompany },
          message: "user added!",
        });
      }

      client.close();
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};

module.exports = createNewCompany;
