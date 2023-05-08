const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const swagger = require("../swagger");

const route = express.Router();

// JWT secret key
const secretKey = "my-secret-key";

// Access Token expiration time
const accessTokenExpirationTime = "1h";

// Refresh Token expiration time
const refreshTokenExpirationTime = "7d";

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      data: null,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      data: null,
      message: "Invalid token",
    });
  }
};

// Generate Access Token and Refresh Token
const generateTokens = (user) => {
  const accessToken = jwt.sign({ email: user.email, id: user._id }, secretKey, {
    expiresIn: accessTokenExpirationTime,
  });

  const refreshToken = jwt.sign(
    { email: user.email, id: user._id },
    secretKey,
    {
      expiresIn: refreshTokenExpirationTime,
    }
  );

  return { accessToken, refreshToken };
};

// get all users
route.get("/api/users", verifyToken, async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// get a user with params
route.get("/api/users/:id", verifyToken, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      data: null,
      message: "User not found",
    });
  }

  res.json({
    data: user,
    message: "ok",
  });
});

// post add a user in api or database
route.post("/api/users", bodyParser.json(), async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  let user = await new User({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  user = await user.save();

  const { accessToken, refreshToken } = generateTokens(user);

  res.json({
    data: { user, accessToken, refreshToken },
    message: "ok",
  });
});

// put update user
route.put(
  "/api/users/:id",
  bodyParser.json(),
  verifyToken,
  async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        data: null,
        message: "User not found",
      });
    }

    // Hash the new password if provided
    let hashedPassword = user.password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.password = hashedPassword;

    await user.save();

    res.json({
      data: user,
      message: "ok",
    });
  }
);

// user login
route.post("/api/users/login", bodyParser.json(), async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      data: null,
      message: "User not found",
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({
      data: null,
      message: "Invalid email or password",
    });
  }

  const { accessToken, refreshToken } = generateTokens(user);

  res.json({
    data: { user, accessToken, refreshToken },
    message: "ok",
  });
});

// refresh access token
route.post("/api/users/refresh-token", bodyParser.json(), async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({
      data: null,
      message: "Invalid token",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, secretKey);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        data: null,
        message: "User not found",
      });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    res.json({
      data: { accessToken, refreshToken: newRefreshToken },
      message: "ok",
    });
  } catch (err) {
    return res.status(401).json({
      data: null,
      message: "Invalid token",
    });
  }
});
swagger(route);

module.exports = route;
