//jshint esversion:6
require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption')
const port = 3000;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://127.0.0.1/userDB");


const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const secret = (process.env.SECRET);
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);
app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save()
    .then((savedUser) => {
      res.render("secrets");
      // Perform additional actions (e.g., send a success response)
    })
    .catch((err) => {
      console.error(err);
      // Handle error (e.g., send an error response)
    });
});

app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username })
    .then((foundUser) => { // Add an arrow function here
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        } else {
          res.send("Incorrect password"); // Password doesn't match
        }
      } else {
        res.send("User not found"); // User with the provided email doesn't exist
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Internal Server Error"); // Handle other errors
    });
});


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

