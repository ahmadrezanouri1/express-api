const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  frist_name: String,
  last_name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  admin: Boolean,
});

// تولید توکن احراز هویت با استفاده از JWT
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
};

// رمزنگاری رمز عبور قبل از ذخیره در دیتابیس
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// متد احراز هویت کاربر با رمز عبور و ایمیل
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }
  return user;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
