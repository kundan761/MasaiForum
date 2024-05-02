const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");

const userRouter = express.Router();

// Register route
userRouter.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(201).json({ err });
      } else {
        const user = new UserModel({
          username,
          email,
          password: hash,
        });
        await user.save();
        res.status(201).json({ msg: "User registered Succesfully!" });
      }
    });
  } catch (err) {
    res.status(400).json({ err });
  }
});

// Login route
userRouter.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ user }, "masai", { expiresIn: 30 });
        res.status(200).json({ msg: "Login Successful!", token });
      } else {
        res.status(200).json({ msg: "Password does not match" });
      }
    });
  } catch (err) {
    res.status(400).json({ err });
  }
});

module.exports = {
  userRouter,
};
