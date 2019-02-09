"use strict";

var cors = require("cors");
const express = require("express");
const userRoutes = express.Router();
const validate = require('express-validation');
const userCtrl = require('../controllers/user');
const userValidations = require('./validation/user');

userRoutes.all("*", cors());

//get list of all users
userRoutes.route("/all").post(validate(userValidations.allUsers), userCtrl.allUsers);

// register a new user
userRoutes.route("/register").post(validate(userValidations.register), userCtrl.register);

// signin to app
userRoutes.route("/signin").post(validate(userValidations.signin), userCtrl.signin);

module.exports = userRoutes;
