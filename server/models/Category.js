const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: [true, "slug is require"],
      unique: [true, "slug is unique"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Category", categorySchema);
