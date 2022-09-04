const express = require("express");
const router = express.Router();

const { Post } = require("../models");
// GET /posts
router
  .route("/")
  .get((req, res, next) =>
    Promise.resolve()
      .then(() => Post.find().populate("user", "-_id -__v -password -user"))
      .then((posts) => res.status(200).json(posts))
      .catch((err) => next(err))
  )
router
  .route("/search")
  .get((req, res, next) =>
    Promise.resolve()
      .then(() =>
        Post.find(
          { $text: { $search: `${req.query.q}` } },
          { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } })
      )
      .then((data) =>
        data ? res.status(200).json(data) : next(createError(404))
      )
      .catch((err) => next(err))
  );

module.exports = router;
