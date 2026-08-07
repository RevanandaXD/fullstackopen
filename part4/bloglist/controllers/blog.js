const jwt = require("jsonwebtoken");
const blogRouter = require("express").Router();
const Blog = require("../models/blogs");
const User = require("../models/users");
const { userExtraction } = require("../middleware/token");

blogRouter.get("/", async (req, res) => {
  const blog = await Blog.find({}).populate("user", "username name");
  res.status(200).json(blog);
});

blogRouter.post("/", userExtraction, async (req, res) => {
  try {
    const user = req.user;
    const { title, author, likes, url } = req.body;

    const newBlog = new Blog({
      title,
      author,
      likes,
      url,
      user: user._id,
    });

    const savedBlog = await newBlog.save();
    user.blogs.push(savedBlog._id);
    await user.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "invalid token",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "token expired",
      });
    }

    return res.status(400).json({
      message: err.message,
    });
  }
});

blogRouter.put("/:id", async (req, res) => {
  const { likes } = req.body;

  try {
    const fieldId = await Blog.findByIdAndUpdate(
      req.params.id,
      { likes },
      { new: true },
    );
    res.status(200).json(fieldId);
  } catch (err) {
    res.status(400).send({
      message: `error due ${err.message}`,
    });
  }
});

blogRouter.delete("/:id", userExtraction, async (req, res) => {
  const id = req.params.id;

  try {
    const userBlog = await Blog.findById(id);
    if (!userBlog)
      return res.status(404).json({
        message: "user not found",
      });
    if (userBlog.user.toString() === req.user._id.toString()) {
      await userBlog.deleteOne();
      res.status(204).end();
    } else {
      res.status(403).json({
        message: "Forbidden",
      });
    }
  } catch (err) {
    res.status(400).send({
      message: `error due to ${err.message}`,
    });
  }
});

module.exports = blogRouter;
