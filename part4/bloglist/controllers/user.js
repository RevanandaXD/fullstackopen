const bcryptjs = require("bcryptjs");
const usersRouter = require("express").Router();
const User = require("../models/users");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", "title author url likes");

  res.status(200).json(users);
});

usersRouter.post("/", async (req, res) => {
  try {
    const { username, name, password } = req.body;

    if (!password || password.length < 3) {
      return res
        .status(400)
        .json({
          message: "password must be at least 3 characters long",
        })
        .end();
    }

    const saltRoundes = 10;
    const passwordHash = await bcryptjs.hash(password, saltRoundes);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const saveUser = await user.save();

    res.status(201).json(saveUser);
  } catch (err) {
    console.error(err.message)
    res.status(400).json({
      error: err.message
    })
  }
});

module.exports = usersRouter;
