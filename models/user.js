const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  user: {
    type: String,
    required: true,
    minLength: 5,
  },
  name: {
    type: String,
    required: true,
    minLength: 4,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
});

module.exports = model("User", userSchema);
