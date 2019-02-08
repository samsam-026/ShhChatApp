"use strict";

var cors = require("cors");
const express = require("express");
const messageRoute = express.Router();
const db = require("../dbConnection");
const Chat = db.Chat;
const Message = db.Message;
const User = db.User;

messageRoute.all("*", cors());

messageRoute.post("/getChats", function (req, res) {
  try {
    let currentUser = req.body.currentUser;
    if (currentUser) {
      Chat.find({ participants: currentUser })
        .select('_id participants')
        .populate('participants', "username")
        .exec(function (err, chats) {
          if (err) {
            res.status(212).send({ error: err });
          }
          if (chats.length > 0) {
            let fullChats = [];
            chats.forEach(function (chat) {
              Message.find({ 'chatId': chat._id })
                .sort('-createdAt')
                .limit(1)
                .exec(function (err, message) {
                  if (err) {
                    res.status(212).send({ error: err });
                  }
                  let participants = chat.participants.toObject();
                  let recipient = participants[0];
                  if (participants[0]._id.equals(currentUser)) {
                    recipient = participants[1];
                  }
                  let chatObject = message[0].toObject();
                  chatObject.recipient = recipient;
                  fullChats.push(chatObject);
                  if (fullChats.length === chats.length) {
                    return res.status(200).json({ chats: fullChats });
                  }
                });
            });
          } else {
            return res.status(200).json({ chats });
          }
        });
    } else {
      res.status(212).send({ error: "Incomplete data" });
    }
  } catch (err) {
    res.status(212).send({ error: "An error occured. Please try again." });
  }
});

// get all messages in one chat
messageRoute.post("/getMessages", function (req, res) {
  try {
    let chatId = req.body.chatId;
    if (chatId) {
      Message.find({ chatId })
        .select('createdAt body author')
        .sort({ createdAt: -1 })
        .exec(function (err, messages) {
          if (err) {
            res.status(212).send({ error: err });
          }
          res.status(200).json({ allMessages: messages.reverse() });
        });
    } else {
      res.status(212).send({ error: "Incomplete data" });
    }
  } catch (err) {
    res.status(212).send({ error: "An error occured. Please try again." });
  }
});

// register a new user
messageRoute.post("/addMessage", function (req, res) {
  try {
    let currentUser = req.body.currentUser;
    let composedMessage = req.body.composedMessage;
    let chatId = req.body.chatId;
    if (currentUser && composedMessage && chatId) {
      const reply = new Message({
        chatId: chatId,
        body: composedMessage,
        author: currentUser
      });

      reply.save(function (err, sentReply) {
        if (err) {
          res.status(212).send({ error: err });
        }
        Message.find({ chatId })
          .select('createdAt body author')
          .sort({ createdAt: -1 })
          .exec(function (err, messages) {
            if (err) {
              res.status(212).send({ error: err });
            }
            res.status(200).json({ fullChat: messages.reverse() });
          });
      });
    } else {
      res.status(212).send({ error: "Incomplete data" });
    }
  } catch (err) {
    res.status(212).send({ error: "An error occured. Please try again." });
  }
});

// perform update on todo item
messageRoute.post("/startChat", function (req, res) {
  try {
    let currentUser = req.body.currentUser;
    let receiver = req.body.receiver;
    let composedMessage = req.body.composedMessage;
    if (currentUser && receiver && composedMessage) {
      const chat = new Chat({
        participants: [currentUser, receiver]
      });

      chat.save(function (err, newChat) {
        if (err) {
          res.status(212).send({ error: err });
        }

        const message = new Message({
          chatId: newChat._id,
          body: composedMessage,
          author: currentUser
        });

        message.save(function (err, newMessage) {
          if (err) {
            res.status(212).send({ error: err });
          }
          let chatObject = newChat.toObject();
          chatObject.body = composedMessage;
          chatObject.chatId = newChat._id;
          chatObject.author = currentUser;
          delete chatObject.participants;
          User.findById(receiver)
            .exec(function (err, user) {
              if (err) {
                res.status(212).send({ error: err });
              }
              if (user) {
                let recipient = { id: user._id, username: user.username };
                chatObject.recipient = recipient
                res.status(200).json({ newChat: chatObject });
              } else {
                res.status(212).send({ error: "no user" });
              }
            });
        });
      });
    } else {
      res.status(212).send({ error: "Incomplete data" });
    }
  } catch (err) {
    res.status(212).send({ error: "An error occured. Please try again." });
  }
});

module.exports = messageRoute;
