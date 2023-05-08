const express = require("express");
const route = express.Router();
const Category = require("../models/category");

route.get("/api/category", async (req, res) => {
  const categorys = await Category.find();
  res.send({
    data: categorys,
    message: "this is all category",
  });
});

module.exports = route;
