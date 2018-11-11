"use strict";

var cors = require("cors");
const express = require("express");
const userRoutes = express.Router();
const db = require("../dbConnection");
const User = db.User;
const bcrypt = require("bcryptjs");
userRoutes.all("*", cors());

userRoutes.post("/all", function(req, res) {
  try {
    let currentUser = req.body.username;
    if (currentUser) {
      User.find({}, function(error, users) {
        let userList = [];
        if (users === null) {
          res.status(212).send("No other users.");
        } else {
          users.forEach(user => {
            if (user.username !== currentUser) {
              userList.push(user.username);
            }
          });
          if (userList.length !== 0) {
            res.status(200).send(userList);
          }
        }
      });
    } else {
      res.status(212).send("Incomplete data");
    }
  } catch (err) {
    res.status(212).send("An error occured. Please try again.");
  }
});

// register a new user
userRoutes.post("/register", function(req, res) {
  try {
    var username = req.body.username;
    var firstName = req.body.firstName;
    var password = req.body.password;
    var lastName = req.body.lastName;
    if (firstName && lastName && username && password) {
      User.findOne({ username }, function(error, user) {
        if (user) {
          res.status(212).send("This user name has already been taken");
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
            function(error, user) {
              if (error) {
                res.status(212).send(error);
              }
              res.status(200).send("New user registered successfully");
            }
          );
        }
      });
    } else {
      res.status(212).send("Incomplete credentials");
    }
  } catch (err) {
    res.status(212).send("An error occured. Please try again.");
  }
});

// perform update on todo item
userRoutes.post("/signin", function(req, res) {
  try {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
      User.findOne({ username }, function(error, user) {
        if (user === null) {
          res.status(212).send("This user is not registered");
        } else if (user && bcrypt.compareSync(password, user.hash)) {
          res.status(200).send("User logged in");
        } else {
          res.status(212).send("Email or Password is incorrect");
        }
      });
    } else {
      res.status(212).send("Incomplete credentials");
    }
  } catch (err) {
    res.status(212).send("An error occured. Please try again.");
  }
});

module.exports = userRoutes;
