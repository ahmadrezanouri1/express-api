const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  title: String,
  childCategory: [String],
  parentOf: Boolean,
  post: [Object],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
