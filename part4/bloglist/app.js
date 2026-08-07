const express = require("express");
const mongoose = require("mongoose");
const config = require('./utils/config')
require("dotenv").config();

// Router
const usersRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const blogRouter = require("./controllers/blog");
const middleware = require("./middleware/token")

const app = express();

app.use(express.json());
app.use(middleware.tokenExtractor);

const mongoUrl = config.MONGODB_URI
mongoose
  .connect(mongoUrl, { family: 4 })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error to connecting to MongolDB", error.message);
  });

// ============LOGIN====================
app.use("/api/login", loginRouter);

// =============USERS====================
app.use("/api/users", usersRouter);

// ==============BLOG====================
app.use('/api/blogs', blogRouter);

module.exports = app;
