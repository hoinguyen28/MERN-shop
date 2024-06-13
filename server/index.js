// const { fileURLToPath } = require("url");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoute = require("./routes/categoryRoute");
const orderRoute = require("./routes/orderRoute");
const { register } = require("./controllers/authController");
const { createProduct } = require("./controllers/productController");
const { verifyToken, checkAdmin } = require("./middleware/authMiddleware");
const Product = require("./models/Product");
const { products, categorys } = require("./data/index");
const Category = require("./models/Category");
// const User = require("./models/User")
const app = express();
dotenv.config();

// MIDLEWARE
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
// app.post(
//   "/product",
//   upload.array("picture", 12),
//   createProduct
// );
app.post("/product", upload.array("productImages", 12), createProduct);

// ROUTES
app.use("/auth", authRoutes);
app.use("/category", categoryRoute);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoute);
// DATA BASE CONNECT

mongoose.set('strictQuery', false);
mongoose
  //.connect(process.env.MONGO_URL)
  .connect("mongodb://0.0.0.0:27017/social-media")
  .then(() => {
    // console.log(app._router.stack.filter((r) => r.route));
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Example app listening on port ${process.env.PORT || 4000}`);
      //  User.insertMany(users);
      // Product.insertMany(products);
     //  Category.insertMany(categorys);
    });
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
