const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("./config.js");
const PORT = config.APP_PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// api routes
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/messageRoutes"));

app.get("/", function(req, res) {
  res.send("Welcome to Shhh Chat App");
});

let server = app.listen(PORT);

module.exports = {
  server: server,
  app: app
};
