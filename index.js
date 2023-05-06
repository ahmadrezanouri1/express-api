const AdminBroExpress = require("@admin-bro/express");
const AdminBro = require("admin-bro");
const AdminBroMongoose = require("@admin-bro/mongoose");
const express = require("express");
const User = require("./models/user");
const Product = require("./models/product");
const product = require("./routes/product");
// let users = require("./users");
const { body, validationResult } = require("express-validator");
const app = express();
const mongoose = require("mongoose");
const user = require("./routes/user");
AdminBro.registerAdapter(AdminBroMongoose);
const AdminBroOptions = {
  resources: [User, Product],
  branding: {
    companyName: "فروشگاه اینترنتی دیجیتالی شو",
  },
};
const AdminBro2 = new AdminBro(AdminBroOptions);

const adminBro = new AdminBro({
  databases: [mongoose],

  rootPath: "/admin",
});

const router = AdminBroExpress.buildRouter(adminBro);

app.use(adminBro.options.rootPath, router);

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

//parse body with coding
app.use(express.urlencoded({ extended: true }));

app.listen(8999, () => {
  console.log(`new connet in port 8999`);
});
