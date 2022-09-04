const express = require("express");
const createError = require("http-errors");
const router = express.Router();

const { Post } = require("../models");

// Create a post
router.route("/").post((req, res, next) =>
  Promise.resolve()
    .then(() => new Post({ ...req.body, user: req.user._id }).save())
    .then((post) => res.status(201).json(post))
    .catch((err) => next(err))
);

// Get a post by id
router
  .route("/:id")
  .get((req, res, next) =>
    Promise.resolve()
      .then(() =>
        Post.findById(req.params.id).populate(
          "user",
          "-_id -__v -password -user"
        )
      )
      .then((post) => (post ? res.status(200).json(post) : createError(404)))
      .catch((err) => next(err))
  )
  // Update a post by id
  .patch((req, res, next) =>
    Promise.resolve()
      .then(() => Post.findByIdAndUpdate(req.params.id, { ...req.body }, {runValidators: true}))
      .then((post) => (post ? res.status(203).json(post) : createError(404)))
      .catch((err) => next(err))
  )
  // y
  .delete((req, res, next) =>
    Promise.resolve()
      .then(() => Post.findByIdAndDelete(req.params.id))
      .then((post) => (post ? res.status(203).json({message: 'post deleted with success'}) : createError(404)))
      .catch((err) => next(err))
  );

module.exports = router;
