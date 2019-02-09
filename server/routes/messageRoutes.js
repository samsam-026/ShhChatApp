"use strict";

var cors = require("cors");
const express = require("express");
const messageRoute = express.Router();
const validate = require('express-validation');
const messageCtrl = require('../controllers/message');
const messageValidations = require('./validation/message');

messageRoute.all("*", cors());

//get all chats of one user
messageRoute.route("/getChats").post(validate(messageValidations.allChats), messageCtrl.allChats);

// get all messages in one chat
messageRoute.route("/getMessages").post(validate(messageValidations.getMessages), messageCtrl.getMessages);

// register a new user
messageRoute.route("/addMessage").post(validate(messageValidations.addMessage), messageCtrl.addMessage);

// perform update on todo item
messageRoute.route("/startChat").post(validate(messageValidations.startChat), messageCtrl.startChat);

module.exports = messageRoute;
