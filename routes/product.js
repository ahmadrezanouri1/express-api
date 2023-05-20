const Product = require("../models/product");

const express = require("express");
const Category = require("../models/category");
const route = express.Router();

route.get("/api/products", async (req, res) => {
  let products = await Product.find({}).populate("category", "title -_id");

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
