const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum : ['user','admin'],
      default: 'user'
    },
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "user.jpg",
    },
    cart: [
      {
        id: {
          type:  mongoose.ObjectId,
          ref:"Product",
          required: true,
        },
        quantity: {
          type: Number,
          min: 1,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
