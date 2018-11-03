const config = require('./config.js');
const mongoose = require('mongoose');

mongoose.connect(config.DB)
    .then(() => {
        console.log('Database connection successful')
    })
    .catch(err => {
        console.error('Database connection error')
    })

mongoose.Promise = global.Promise;

module.exports = {
    User: require('./models/User')
};