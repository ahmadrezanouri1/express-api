const express = require("express");
const route = express.Router();
const Category = require("../models/category");

route.get("/api/category", (req, res) => {
  const categorys = Category.find();
  res.json({
    data: categorys,
    message: "this is all category",
  });
});

module.exports = route;
