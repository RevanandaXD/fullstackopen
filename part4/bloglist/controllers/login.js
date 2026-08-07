const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../models/users");
const loginRouter = require("express").Router();

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  const passwordCorrect =
    user === null ? false : await bcryptjs.compare(password, user.passwordHash);

  if(!(user && passwordCorrect)) {
    return res.status(401).send({
      error: "imvalid username or password",
    })
  }

  const newTokenUser = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(newTokenUser, process.env.SECRET);

  res.status(200).send({
    token,
    username: user.username,
    name: user.name,
  })

});

module.exports = loginRouter;