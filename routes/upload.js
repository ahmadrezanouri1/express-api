const multer = require("multer");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const route = express.Router();
const Photo = require("../models/photo");
const fileUpload = require("express-fileupload");
const path = require("path");

// تنظیمات `multer` برای آپلود فایل

// روت اکسپرس برای آپلود فایل
const publicPath = path.join(__dirname, "public");

// اضافه کردن middleware express-fileupload
route.use(fileUpload());

route.post("/api/upload", function (req, res) {
  //   if (!req.file) {
  //     return res.status(400).send("No file was uploaded.");
  //   }

  //   const file = req.file;
  //   file.mv(path.join(publicPath, file.name), function (err) {
  //     if (err) {
  //       return res.status(500).send(err);
  //     }

  //     console.log(req.file); // اطلاعات فایل دریافت شده
  //     res.send({
  //       data: req.file,
  //       message: "tick green",
  //     });
  res.json(req.file);
  //   });
});

module.exports = route;
