const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.createUser = (req, res, next) => {
  let { email, password } = req.body;
  bcrypt.hash(password, 10).then((hashedPassword) => {
    const newUser = new User({
      email,
      password: hashedPassword,
    });
    newUser
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result,
        });
      })
      .catch(() => {
        res.status(500).json({
          message: "Invalid authentication credentials!",
        });
      });
  });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  let { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    fetchedUser = user;
    return bcrypt
      .compare(password, user.password)
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          process.env.SECRET,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token,
          expiresIn: 3600,
          userId: fetchedUser._id,
        });
      })
      .catch(() => {
        return res.status(401).json({
          message: "Invalid authentication credentials!",
        });
      });
  });
};
