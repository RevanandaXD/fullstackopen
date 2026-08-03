const express = require("express");
const Blog = require("./models/blog");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/api/users", usersRouter)

const mongoUrl = process.env.MONGODB_URI;
mongoose
  .connect(mongoUrl, { family: 4 })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error to connecting to MongolDB", error.message);
  });

app.get("/api/blogs", async (req, res) => {
  const blog = await Blog.find({});
  res.status(200).json(blog);
});

app.post("/api/blogs", async (req, res) => {
  const blog = Blog(req.body);

  try {
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).send({
      message: `error due to ${error.message}`,
    });
  }
});

app.put("/api/blogs/:id", async (req, res) => {
  const id = req.params.id;
  const { likes } = req.body;

  try {
    const findId = await Blog.findByIdAndUpdate(
      id,
      {
        likes: likes,
      },
      {
        new: true,
      },
    );
    res.status(200).json(findId);
  } catch (err) {
    res.status(400).send({
      message: `error due ${err.message}`,
    });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  const id = req.params.id;

  try {
    await Blog.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    res.status(400).send({
      message: `error due to ${err.message}`,
    });
  }
});

module.exports = app;
