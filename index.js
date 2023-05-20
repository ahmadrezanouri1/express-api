const express = require("express");
const User = require("./models/user");
const Product = require("./models/product");
const category = require("./routes/Category");
const product = require("./routes/product");
const upload = require("./routes/upload");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// let users = require("./users");
const { body, validationResult } = require("express-validator");
const app = express();
const mongoose = require("mongoose");
const user = require("./routes/user");
const { router, adminBro, adminRouter } = require("./routes/admin");

const swagger = require("./swagger");

app.use(adminBro.options.rootPath, adminRouter);
app.use(express.static(__dirname + "/public"));
mongoose
  .connect("mongodb://127.0.0.1:8000/myapp")
  .then(() => {
    console.log("mongodb connect");
  })
  .catch((err) => {
    console.log("could not connect to mongodb");
  });

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "My API documentation",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:8999",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to the API files
};

// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//parse to json file
app.use(express.json());
app.use("/", user);

app.use("/", product);
app.use("/", category);
app.use("/", upload);

//parse body with coding
app.use(express.urlencoded({ extended: true }));

app.listen(8999, () => {
  console.log(`new connet in port 8999`);
});
