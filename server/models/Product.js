const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Các trường thông tin khác trong review
});

const productSchema = mongoose.Schema(
  {
    category: {
      type: String,
      // enum: ["newArrivals", "bestSellers", "topRated"],
      default: "newArrivals",
    },
    name: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    longDescription: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    sales: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    likes: {
      type: Map,
      of: Boolean,
      default: {},
    },
    comments: {
      type: [reviewSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
