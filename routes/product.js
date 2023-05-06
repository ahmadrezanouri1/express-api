const Product = require("../models/product");

const { body, validationResult } = require("express-validator");

const express = require("express");
const route = express.Router();

route.get("/api/products", async (req, res) => {
  const products = await Product.find();
  if (!products) {
    return res.json({
      message: "could not found products",
    });
  }
  res.send({
    data: products,
    message: "this is products",
  });
});

module.exports = route;
