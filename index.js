const { initializeApp } = require("firebase/app");
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require("firebase/auth");
const express = require("express");
const app = express();
const cors = require("cors");
const dal = require("./dal.js");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://goodbank-cap-default-rtdb.firebaseio.com",
});

const firebaseConfig = {
  apiKey: "AIzaSyDt2WSgCuDIb6_TkT874TA4NrkT5jyTDgM",
  authDomain: "goodbank-cap.firebaseapp.com",
  projectId: "goodbank-cap",
  storageBucket: "goodbank-cap.appspot.com",
  messagingSenderId: "1013177808154",
  appId: "1:1013177808154:web:aa27a2a7777bd9d729a8a3",
  measurementId: "G-NLRYG21DXF",
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);
const auth = getAuth();

// used to serve static files from public directory
app.use(express.static("public"));
app.use(cors());

// create user account
app.get("/account/create/:name/:email/:password", function (req, res) {
  // Sign up the user with email and password
  createUserWithEmailAndPassword(auth, req.params.email, req.params.password)
    .then((userCredential) => {
      // User signed up successfully
      const user = userCredential.user;
      console.log("createUserWithEmailAndPassword: user from Firebase:", user);

      // Check if account already exists
      dal.find(req.params.email).then((users) => {
        if (users.length > 0) {
          console.log("User already exists");
          res.send("User already exists");
        } else {
          // Assign role based on email domain
          const role = req.params.email.endsWith("@goodbank.com")
            ? "Employee"
            : "Customer";

          // Create user in your database
          dal.create(req.params.name, user.email, role).then((user) => {
            console.log("User created in database");

            // Set custom claims for the user
            admin
              .auth()
              .setCustomUserClaims(userCredential.user.uid, {
                admin: role === "Employee",
              })
              .then(() => {
                console.log(
                  "Custom claims set for user:",
                  userCredential.user.uid
                );
                console.log("Role:", role);

                // Fetch user record to verify custom claims
                admin
                  .auth()
                  .getUser(userCredential.user.uid)
                  .then((userRecord) => {
                    console.log("User custom claims:", userRecord.customClaims);
                    res.send(user);
                  })
                  .catch((error) => {
                    console.error("Error fetching user:", error);
                    res.send("Error fetching user");
                  });
              })
              .catch((error) => {
                console.error("Error setting custom claims:", error);
                res.send("Error setting custom claims");
              });
          });
        }
      });
    })
    .catch((error) => {
      console.log(
        "createUserWithEmailAndPassword: Firebase Error",
        error.code,
        error.message
      );
      res.send("Firebase Error");
    });
});

// login user
app.get("/account/login/:email/:password", function (req, res) {
  // Inside your login route or wherever appropriate
  signInWithEmailAndPassword(auth, req.params.email, req.params.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("signInWithEmailAndPassword: user from Firebase:", user);
      dal.find(user.email).then((mongoUser) => {
        // if user exists, check password
        if (mongoUser.length === 1) {
          // Fetch the ID token result to check custom claims
          user
            .getIdTokenResult()
            .then((idTokenResult) => {
              // Confirm the user is an Employee.
              const isEmployee = !!idTokenResult.claims.admin;
              console.log(idTokenResult);
              console.log("Is employee:", isEmployee);
              console.log(user);
              console.log(mongoUser);
              res.send(mongoUser[0]);
            })
            .catch((error) => {
              console.error("Error getting ID token result:", error);
              res.send("Error getting ID token result");
            });
        }
      });
    })
    .catch((error) => {
      console.log(
        "signInWithEmailAndPassword: Firebase Error",
        error.code,
        error.message
      );
      res.send("Firebase Error");
    });
});

// find user account
app.get("/account/find/:email", function (req, res) {
  dal.find(req.params.email).then((user) => {
    console.log(user);
    res.send(user);
  });
});

// find one user by email - alternative to find
app.get("/account/findOne/:email", function (req, res) {
  dal.findOne(req.params.email).then((user) => {
    console.log(user);
    res.send(user);
  });
});

// update - deposit/withdraw amount
app.get("/account/update/:email/:amount", function (req, res) {
  var amount = Number(req.params.amount);

  dal.update(req.params.email, amount).then((response) => {
    console.log(response);
    res.send(response);
  });
});

// all accounts
app.get("/account/all", function (req, res) {
  dal.all().then((docs) => {
    console.log(docs);
    res.send(docs);
  });
});

// fetch balance for a user
app.get("/account/balance/:email", function (req, res) {
  dal
    .findBalance(req.params.email)
    .then((balance) => {
      if (balance !== null) {
        res.json({ balance: balance });
      } else {
        res.status(404).json({ error: "Balance not found for the user" });
      }
    })
    .catch((error) => {
      console.error("Error fetching balance:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

// transfer money between accounts
app.get("/account/transfer", function (req, res) {
  const senderEmail = req.query.senderEmail;
  const recipientEmail = req.query.recipientEmail;
  const amount = Number(req.query.amount);

  // check if sender has sufficient balance
  dal.findBalance(senderEmail).then((senderBalance) => {
    if (senderBalance >= amount) {
      // Deduct amount from sender's balance
      dal.update(senderEmail, -amount).then(() => {
        // Add amount to recipient's balance
        dal.update(recipientEmail, amount).then(() => {
          res.json({ message: "Transfer successful" });
        }).catch((error) => {
          console.error("Error updating recipient's balance:", error);
          res.status(500).json({ error: "Internal server error" });
        });
      }).catch((error) => {
        console.error("Error updating sender's balance:", error);
        res.status(500).json({ error: "Internal server error" });
      });
    } else {
      res.status(400).json({ error: "Insufficient balance" });
    }
  }).catch((error) => {
    console.error("Error fetching sender's balance:", error);
    res.status(500).json({ error: "Internal server error" });
  });
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Running on port: " + port);
});