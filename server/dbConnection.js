const mongoose = require('mongoose');
const config = require('./config');

let database = config.DB;

if (process.env.NODE_ENV === 'test') {
  database = config.TEST_DB;
}

mongoose
  .connect(database, {
    useCreateIndex: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Database connection successful');
  })
  .catch(err => {
    console.error('Database connection error');
  });

mongoose.Promise = global.Promise;

module.exports = {
  User: require('./models/User'),
  Chat: require('./models/Chat'),
  Message: require('./models/Message')
};
