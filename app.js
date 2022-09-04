const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const { Connection } = require("./models");
const { PostPublic, PostSecure, Security } = require("./routes");
const { authMiddleware } = require("./middlewares");

const app = express();
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Connection middleware
app.use((req, res, next) =>
  Connection.then(() => next()).catch((err) => next(err))
);

app.use("/admin", Security);
app.use("/posts", PostPublic);
// authMiddleware is a middleware that checks if the user is authenticated
app.use("/posts", authMiddleware, PostSecure);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // mongoose validator?
  if (err.name && err.name === "ValidationError") {
    res.status(406).json(err);
  } else if (
    (err.status && err.status === 404) ||
    (err.name && err.name === "CastError")
  ) {
    res.status(404).json({
      url: req.originalUrl,
      error: {
        message: "Not found",
      },
    });
  } else if (err.code === 11000) {
    res.status(500).json({
      url: req.originalUrl,
      error: {
        message: "Duplicate key not allowed",
      },
    });
  } else {
    // console.log(err);
    // error page
    res.status(err.status || 500).json({
      url: req.originalUrl,
      error: err,
    });
  }
});

module.exports = app;
