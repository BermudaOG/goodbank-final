const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/goodbank-cluster';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log("Connected successfully to MongoDB database");
});

// create user account
function create(name, email, role) {
  return new Promise((resolve, reject) => {
    const collection = db.collection("users");
    const doc = { name, email, role, balance: 0 }; // Include the role field in the document
    collection.insertOne(doc, function (err, result) {
      if (err) {
        reject(err);
      } else {
        console.log("User created:", result.ops[0]); // Log the created user
        resolve(result.ops[0]);
      }
    });
  });
}


// find user account
function find(email) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .find({ email: email })
      .toArray(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
  });
}

// find user account
function findOne(email) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .findOne({ email: email })
      .then((doc) => resolve(doc))
      .catch((err) => reject(err));
  });
}

// update - deposit/withdraw amount
function update(email, amount) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .findOneAndUpdate(
        { email: email },
        { $inc: { balance: amount } },
        { returnOriginal: false },
        function (err, documents) {
          err ? reject(err) : resolve(documents);
        }
      );
  });
}

// all users
function all() {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .find({})
      .toArray(function (err, docs) {
        err ? reject(err) : resolve(docs);
      });
  });
}

// find balance for a user by email
function findBalance(email) {
  return new Promise((resolve, reject) => {
    const customers = db
      .collection("users")
      .findOne({ email: email })
      .then((user) => {
        if (user) {
          resolve(user.balance);
        } else {
          resolve(null); // Return null if user not found
        }
      })
      .catch((err) => reject(err));
  });
}

module.exports = { create, findOne, find, update, all, findBalance };