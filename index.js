const express = require("express");
let users = require("./users");
const { body, validationResult } = require("express-validator");
const app = express();

//parse to json file
app.use(express.json());

//parse body with coding
app.use(express.urlencoded({ extended: true }));

// get all users
app.get("/api/users", (req, res) => {
  res.json({
    data: users,
    massage: "ok",
  });
  res.end();
});

// get a user with params

app.get("/api/users/:id", (req, res) => {
  console.log(req.params.id);

  res.json({
    data: user,
    massage: "ok",
  });
});

// post  add a user in api or database
app.post(
  "/api/users",
  [
    body("email", "email must be valid").isEmail(),
    body("first_name", "first name cant be empty").notEmpty(),
    body("last_name", "last name cant be empty").notEmpty(),
  ],
  (req, res) => {
    console.log(req.body);
    users.push({
      ...req.body,
      id: users.length + 1,
    });
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        data: null,
        errors: errors.array(),
        message: "validation error",
      });
    }
    res.json({
      data: users,
      message: "ok",
    });
  }
);

// put update user

app.put(
  "/api/users/:id",
  [
    body("email", "email must be valid").isEmail(),
    body("first_name", "first name cant be empty").notEmpty(),
    body("last_name", "last name cant be empty").notEmpty(),
  ],
  (req, res) => {
    console.log(req.body);

    const user = users.find((u) => u.id == req.params.id);
    if (!user) {
      return res.status(404).json({
        data: null,
        message: "the user with the given id was not found",
      });
    }

    users = users.map((user) => {
      if (user.id == req.params.id) {
        return { ...user, ...req.body };
      }
      return user;
    });
    res.json({
      data: users,
      message: "ok",
    });
  }
);

app.listen(8000, () => {
  console.log(`new connet in port 8000`);
});
