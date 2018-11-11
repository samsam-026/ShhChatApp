const config = require("./config.js");
const mongoose = require("mongoose");

let database = config.DB;

if (process.env.NODE_ENV === "test") {
  database = config.TEST_DB;
}

mongoose
  .connect(database)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch(err => {
    console.error("Database connection error");
  });

mongoose.Promise = global.Promise;

module.exports = {
  User: require("./models/User")
};
