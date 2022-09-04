const createError = require("http-errors");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || "jwt-token";
console.log(SECRET_ACCESS_KEY)

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return next(createError(401));
  jwt.verify(token, SECRET_ACCESS_KEY, (err, user) => {
    if (err) return next(createError(403));
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;