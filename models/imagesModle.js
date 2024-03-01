const mongoose = require("mongoose");

const imageModel = mongoose.Schema(
  {
    imageURL: { type: "String" },
  },
  { timestamps: true }
);

const Image = mongoose.model("Image", imageModel);
module.exports = Image;
