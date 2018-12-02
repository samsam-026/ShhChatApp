"use strict";

var cors = require("cors");
const express = require("express");
const userRoutes = express.Router();
const db = require("../dbConnection");
const User = db.User;
const bcrypt = require("bcryptjs");
userRoutes.all("*", cors());

//get list of all users
userRoutes.post("/all", function (req, res) {
  try {
    let currentUser = req.body.username;
    if (currentUser) {
      User.find({}, function (error, users) {
        let userList = [];
        if (users === null) {
          res.status(212).send({ error: "No other users." });
        } else {
          users.forEach(user => {
            if (user.username !== currentUser) {
              userList.push({ username: user.username, id: user._id });
            }
          });
          if (userList.length !== 0) {
            res.status(200).send(userList);
          }
        }
      });
    } else {
      res.status(212).send({ error: "Incomplete data" });
    }
  } catch (err) {
    res.status(212).send({ error: "An error occured. Please try again." });
  }
});

// register a new user
userRoutes.post("/register", function (req, res) {
  try {
    var username = req.body.username;
    var firstName = req.body.firstName;
    var password = req.body.password;
    var lastName = req.body.lastName;
    if (firstName && lastName && username && password) {
      User.findOne({ username }, function (error, user) {
        if (user) {
          res.status(212).send({ error: "This user name has already been taken" });
        } else {
          var hash = bcrypt.hashSync(password, 10);
          User.create(
            {
              username,
              hash,
              firstName,
              lastName,
              createdDate: new Date()
            },
            function (err, user) {
              if (err) {
                res.status(212).send({ error: err });
              }
              res.status(200).send({ currentUser: user );
            }
          );
        }
      });
    } else {
      res.status(212).send({ error: "Incomplete data" });
    }
  } catch (err) {
    res.status(212).send({ error: "An error occured. Please try again." });
  }
});

// signin to app
userRoutes.post("/signin", function (req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
      User.findOne({ username }, function (err, user) {
        if (err) {
          res.status(212).send({ error: err });
        }
        if (user && bcrypt.compareSync(password, user.hash)) {
          res.status(200).send({ currentUser: user });
        } else {
          res.status(212).send({ error: "Email or Password is incorrect" });
        }
      });
    } else {
      res.status(212).send({ error: "Incomplete data" });
    }
  } catch (err) {
    res.status(212).send({ error: "An error occured. Please try again." });
  }
});

module.exports = userRoutes;
