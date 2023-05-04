const express = require("express");

const { body, validationResult } = require("express-validator");

const mongoose = require("mongoose");

const route = express.Router();

const userSchema = mongoose.Schema({
  frist_name: String,
  last_name: String,
  emai: String,
});

const User = new mongoose.model("User", userSchema);

// get all users
route.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json({
    data: users,
    massage: "ok",
  });
  res.end();
});

// get a user with params

route.get("/api/users/:id", async (req, res) => {
  const user = await User.find({ _id: req.params.id });
  console.log(req.params.id);

  res.json({
    data: user,
    massage: "ok",
  });
});

// post  add a user in api or database
route.post(
  "/api/users",
  [
    // body("email", "email must be valid").isEmail(),
    body("frist_name", "first name cant be empty").notEmpty(),
    body("last_name", "last name cant be empty").notEmpty(),
  ],
  async (req, res) => {
    let user = await new User({
      frist_name: req.body.frist_name,
      last_name: req.body.last_name,
      email: req.body.email,
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        data: null,
        errors: errors.array(),
        message: "validation error",
      });
    }
    user = user.save();
    res.json({
      data: user,
      message: "ok",
    });
  }
);

// put update user

route.put(
  "/api/users/:id",
  [
    body("email", "email must be valid").isEmail(),
    body("first_name", "first name cant be empty").notEmpty(),
    body("last_name", "last name cant be empty").notEmpty(),
  ],
  async (req, res) => {
    console.log(req.body);

    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        last_name: req.body.last_name,
        frist_name: req.body.frist_name,
        email: req.body.email,
      }
    );
    if (!user) {
      return res.status(404).json({
        data: null,
        message: "the user with the given id was not found",
      });
    }

    res.json({
      data: user,
      message: "ok",
    });
  }
);

module.exports = route;
