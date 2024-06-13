const mongoose = require("mongoose");

const billSchema = mongoose.Schema(
  {
    userID: {
      typeo:  mongoose.ObjectId,
      required: true,
    },
    listItem: [
      {
        id: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
    paymentDate: {
      type:Date
    },
    paymentType: {
      type: String,
      default:"Cash"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
