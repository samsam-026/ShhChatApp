'use strict'

const express = require('express');
const userRoutes = express.Router();
const db = require('../dbConnection');
const User = db.User;
const bcrypt = require('bcryptjs');

// register a new user
userRoutes.post('/register', function (req, res) {
    var username = req.body.username;
    User.findOne({ username }, function (error, user) {
        if (user) {
            res.status(400).send("This user name has already been taken");
        } else {
            var hash = bcrypt.hashSync(req.body.password, 10);
            console.log(hash);
            User.create(
                {
                    username: req.body.username,
                    hash: hash,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    createdDate: new Date()
                },
                function (error, user) {
                    if (error) {
                        res.status(400).send(error)
                    }
                    res.status(200).send("New user registered successfully")
                }
            )
        }
    });
})

// perform update on todo item
userRoutes.post('/signin', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({ username }, function (error, user) {
        if (error) {
            res.status(400).send("This user is not registered");
        }
        if (user && bcrypt.compareSync(password, user.hash)) {
            res.status(200).send("User logged in");
        } else {
            res.status(400).send("Password or Email is incorrect");
        }
    });
})

module.exports = userRoutes