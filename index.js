const express = require("express");
const User = require("./models/user");
const Product = require("./models/product");
const category = require("./routes/Category");
const product = require("./routes/product");
// let users = require("./users");
const { body, validationResult } = require("express-validator");
const app = express();
const mongoose = require("mongoose");
const user = require("./routes/user");
const { router, adminBro } = require("./routes/admin");

app.use(adminBro.options.rootPath, router);
app.use(express.static(__dirname + "/public"));

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
app.use("/", product);
app.use("/", category);

//parse body with coding
app.use(express.urlencoded({ extended: true }));

app.listen(8999, () => {
  console.log(`new connet in port 8999`);
});
