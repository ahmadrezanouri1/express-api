const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
