const express = require("express");
const { User } = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const userList = await User.find().select("name email");

  if (!userList) res.status(500).json({ success: false });
  res.send(userList);
});

//for regular registration
router.post("/register", async (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
  });
  const user = await newUser.save();
  if (!newUser) return res.status(404).send("the user cannot be created");

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.SECRET
  );

  //set cookie
  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite:
        process.env.NODE_ENV === "development"
          ? "lax"
          : process.env.NODE_ENV === "production" && "none",
      secure:
        process.env.NODE_ENV === "development"
          ? false
          : process.env.NODE_ENV === "production" && true,
    })
    .send({ userEmail: user.email, userName: user.name, token: token });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET;

  if (!user) return res.status(400).send("User not found");

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        id: user._id,
        userName: user.name,
      },
      secret,
      {
        expiresIn: "1d", //one day is "1d" /"1w"...
      }
    );
    // res
    //   .status(200)
    //   .send({ userEmail: user.email, userName: user.name, token: token });
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite:
          process.env.NODE_ENV === "development"
            ? "lax"
            : process.env.NODE_ENV === "production" && "none",
        secure:
          process.env.NODE_ENV === "development"
            ? false
            : process.env.NODE_ENV === "production" && true,
      })
      .status(200)
      .send({ userEmail: user.email, userName: user.name, token: token });
  } else {
    res.status(400).send("Password is wrong");
  }
});

router.delete("/:id", (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "The user is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;