const multer = require("multer");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// تعریف ساختار دیتابیس
const photoSchema = new Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

// تعریف مدل
const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
