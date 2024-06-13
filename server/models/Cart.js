const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type:  mongoose.ObjectId,
      required: true,
    },
    
  },
  { timestamps: true }
);
module.exports = mongoose.model("Cart", cartSchema);