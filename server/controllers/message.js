const db = require("../dbConnection");
const Chat = db.Chat;
const Message = db.Message;
const User = db.User;

module.exports = {
    // POST /api/getChats
    allChats: function (req, res) {
        try {
            let currentUser = req.body.currentUser;
            Chat.find({ participants: currentUser })
                .select('_id participants')
                .populate('participants', "username")
                .exec(function (err, chats) {
                    if (err) {
                        return res.status(500).send({ error: err });
                    }
                    if (chats.length > 0) {
                        let fullChats = [];
                        chats.forEach(function (chat) {
                            Message.find({ 'chatId': chat._id })
                                .sort('-createdAt')
                                .limit(1)
                                .exec(function (err, message) {
                                    if (err) {
                                        return res.status(500).send({ error: err });
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
        } catch (err) {
            return res.status(500).send({ error: "An error occured. Please try again." });
        }
    },
    // POST /api/getMessages
    getMessages: function (req, res) {
        try {
            let chatId = req.body.chatId;
            Message.find({ chatId })
                .select('createdAt body author')
                .sort({ createdAt: -1 })
                .exec(function (err, messages) {
                    if (err) {
                        return res.status(500).send({ error: err });
                    }
                    return res.status(200).json({ allMessages: messages.reverse() });
                });
        } catch (err) {
            return res.status(500).send({ error: "An error occured. Please try again." });
        }
    },
    // POST /api/addMessage
    addMessage: function (req, res) {
        try {
            let currentUser = req.body.currentUser;
            let composedMessage = req.body.composedMessage;
            let chatId = req.body.chatId;
            const reply = new Message({
                chatId: chatId,
                body: composedMessage,
                author: currentUser
            });

            reply.save(function (err, sentReply) {
                if (err) {
                    return res.status(500).send({ error: err });
                }
                Message.find({ chatId })
                    .select('createdAt body author')
                    .sort({ createdAt: -1 })
                    .exec(function (err, messages) {
                        if (err) {
                            return res.status(500).send({ error: err });
                        }
                        return res.status(200).json({ fullChat: messages.reverse() });
                    });
            });
        } catch (err) {
            return res.status(500).send({ error: "An error occured. Please try again." });
        }
    },
    // POST /api/startChat
    startChat: function (req, res) {
        try {
            let currentUser = req.body.currentUser;
            let receiver = req.body.receiver;
            let composedMessage = req.body.composedMessage;
            const chat = new Chat({
                participants: [currentUser, receiver]
            });

            chat.save(function (err, newChat) {
                if (err) {
                    return res.status(500).send({ error: err });
                }

                const message = new Message({
                    chatId: newChat._id,
                    body: composedMessage,
                    author: currentUser
                });

                message.save(function (err, newMessage) {
                    if (err) {
                        return res.status(500).send({ error: err });
                    }
                    let chatObject = newChat.toObject();
                    chatObject.body = composedMessage;
                    chatObject.chatId = newChat._id;
                    chatObject.author = currentUser;
                    chatObject.body = newMessage.body;
                    delete chatObject.participants;
                    User.findById(receiver)
                        .exec(function (err, user) {
                            if (err) {
                                return res.status(500).send({ error: err });
                            }
                            if (user) {
                                let recipient = { id: user._id, username: user.username };
                                chatObject.recipient = recipient
                                return res.status(200).json({ newChat: chatObject });
                            } else {
                                return res.status(500).send({ error: "no user" });
                            }
                        });
                });
            });
        } catch (err) {
            return res.status(500).send({ error: "An error occured. Please try again." });
        }
    }
};