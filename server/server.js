const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("./config.js");
const PORT = config.APP_PORT;
const expressValidation = require('express-validation');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// api routes
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/messageRoutes"));

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    res.status(500).json(err);
  } else {
    res.status(500)
      .json({
        status: err.status,
        message: err.message
      });
  }
});

app.use((err, req, res, next) => {
  if (!err) {
    return next();
  }

  res.status(500).json({ err: err });
});

app.get("/", function (req, res) {
  res.send("Welcome to Shhh Chat App");
});

let server = app.listen(PORT);

module.exports = {
  server: server,
  app: app
};
