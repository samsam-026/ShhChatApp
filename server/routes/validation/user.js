const Joi = require('joi');

module.exports = {
    // POST /api/all
    allUsers: {
        body: {
            currentUser: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        }
    },
    // POST /api/register
    register: {
        body: {
            username: Joi.string().regex(/^[0-9a-zA-z]{5,25}$/).required(),
            firstName: Joi.string().regex(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,40}$/).required(),
            lastName: Joi.string().regex(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,40}$/).required(),
            password: Joi.string().required()
        }
    },
    // POST /api/signin
    signin: {
        body: {
            username: Joi.string().regex(/^[0-9a-zA-z]{5,25}$/).required(),
            password: Joi.string().required()
        }
    },
};