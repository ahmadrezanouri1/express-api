const express = require("express");
// let users = require("./users");
const { body, validationResult } = require("express-validator");
const app = express();
const mongoose = require("mongoose");
const user = require("./routes/user");

mongoose
  .connect("mongodb://localhost:8000/aliiiiiiiii")
  .then(() => {
    console.log("mongodb connect");
  })
  .catch((err) => {
    console.log("could not connect to mongodb");
  });

//parse to json file
app.use(express.json());
app.use("/", user);

//parse body with coding
app.use(express.urlencoded({ extended: true }));

app.listen(8999, () => {
  console.log(`new connet in port 8999`);
});
