const Joi = require('joi');

module.exports = {
    // POST /api/getChats
    allChats: {
        body: {
            currentUser: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    },
    // POST /api/getMessages
    getMessages: {
        body: {
            chatId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    },
    // POST /api/addMessage
    addMessage: {
        body: {
            currentUser: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            composedMessage: Joi.string().required(),
            chatId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    },
    // POST /api/startChat
    startChat: {
        body: {
            currentUser: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            composedMessage: Joi.string().required(),
            receiver: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    }
};