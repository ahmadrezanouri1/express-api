const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  frist_name: String,
  last_name: String,
  emai: String,
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
