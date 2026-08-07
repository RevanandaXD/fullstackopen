const jwt = require("jsonwebtoken");
const User = require("../models/users");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }

  next();
};

const userExtraction = async (req, res, next) => {
  try {
    if (!req.token) {
      return res.status(401).json({ message: "forbidden" });
    }

    const decodedToken = jwt.verify(req.token, process.env.SECRET);

    if (!decodedToken.id) {
      return res.status(401).json({ message: "invalid token" });
    }

    const user = await User.findById(decodedToken.id);
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  tokenExtractor,
  userExtraction,
};
