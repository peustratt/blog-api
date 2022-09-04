const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: 2,
    },
    content: {
      type: String,
      required: true,
      minLength: 3,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
postSchema.index({ title: "text", content: "text" }, {weights: {title: 5, content: 1}});
module.exports = model("Post", postSchema);
