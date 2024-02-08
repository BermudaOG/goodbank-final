const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin:root@goodbank-cluster.d2xakbd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function connect() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB database");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

// Call the connect function when the file is imported to connect to the database
connect();

// create user account
async function create(name, email, role) {
  try {
    const database = client.db("goodbank-cluster"); // Specify your database name
    const collection = database.collection("users");
    const doc = { name, email, role, balance: 0 }; // Include the role field in the document
    const result = await collection.insertOne(doc);
    console.log("User created:", result.ops[0]); // Log the created user
    return result.ops[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

// find user account
async function find(email) {
  try {
    const database = client.db("goodbank-cluster"); // Specify your database name
    const collection = database.collection("users");
    return await collection.find({ email: email }).toArray();
  } catch (error) {
    console.error("Error finding user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

// find user account
async function findOne(email) {
  try {
    const database = client.db("goodbank-cluster"); // Specify your database name
    const collection = database.collection("users");
    return await collection.findOne({ email: email });
  } catch (error) {
    console.error("Error finding one user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

// update - deposit/withdraw amount
async function update(email, amount) {
  try {
    const database = client.db("goodbank-cluster"); // Specify your database name
    const collection = database.collection("users");
    return await collection.findOneAndUpdate(
      { email: email },
      { $inc: { balance: amount } },
      { returnOriginal: false }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

// all users
async function all() {
  try {
    const database = client.db("goodbank-cluster"); // Specify your database name
    const collection = database.collection("users");
    return await collection.find({}).toArray();
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

// find balance for a user by email
async function findBalance(email) {
  try {
    const database = client.db("goodbank-cluster"); // Specify your database name
    const collection = database.collection("users");
    const user = await collection.findOne({ email: email });
    return user ? user.balance : null;
  } catch (error) {
    console.error("Error finding balance:", error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

module.exports = { create, findOne, find, update, all, findBalance };
