const createError = require("http-errors");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY || "jwt-token";
const { User } = require("../models");

console.log(SECRET_ACCESS_KEY);

router.route("/login").post((req, res, next) =>
  Promise.resolve()
    .then(() => User.findOne({ user: req.body.user }))
    .then((user) => user
        ? bcrypt.compare(req.body.password, user.password)
            .then((isValidated) => isValidated
                ? jwt.sign(
                    JSON.stringify(Object.assign(user, { password: "" })),
                    SECRET_ACCESS_KEY
                  )
                : next(createError(401))
            )
        : next(createError(404))
    )
    .then((accessToken) => accessToken ? res.status(200).json({ accessToken }) : null)
    .catch((err) => next(err))
);

module.exports = router;
