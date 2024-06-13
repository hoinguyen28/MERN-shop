const { json } = require("body-parser");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const bodyParser = require("body-parser");

// CREATE POST
const getTotalProducts = async (req, res) => {
  try {
    const totalCount = await Product.countDocuments();
    res.json({ totalProducts: totalCount });
  } catch (err) {
    console.error("Error fetching total products:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getTopThreeBestSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      {
        $unwind: "$items" // Tách các mục sản phẩm trong đơn hàng thành từng bản ghi riêng biệt
      },
      {
        $group: {
          _id: "$items._id",
          totalSales: { $sum: "$items.count" } // Tính tổng số lượng sản phẩm đã bán
        }
      },
      {
        $sort: { totalSales: -1 } // Sắp xếp giảm dần theo tổng số lượng đã bán
      },
      {
        $limit: 3 // Giới hạn kết quả chỉ lấy top 5 sản phẩm
      }
    ]);

    // Lấy thông tin chi tiết của các sản phẩm từ product collection
    const topProductsInfo = await Product.populate(topProducts, { path: "_id" });

    // Chuẩn bị kết quả trả về
    const result = topProductsInfo.map(product => ({
      product: product._id,
      totalSales: product.totalSales
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createProduct = async (req, res) => {
  try {
    const { category, name, shortDescription, longDescription, quantity, price, images } = req.body;
    let myArray = [];
    if (images.length <= 1) {
      myArray.push(images);
    } else {
      myArray = images.split(",");
    }
    // res.json([images]);
    const newProduct = new Product({
      category,
      name,
      shortDescription,
      longDescription,
      quantity,
      price,
      images: myArray,
      likes: {},
      comments: [],
    });
    await newProduct.save();

    res.status(200).json({
      status: "oke",
      message: "Add product success!!!",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: "Add product false!!!",
      data: "",
    });
  }
};

// READ POSTS OF USER
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ _id: productId });
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

// READ POSTS FOR FEED
const getFeedProduct = async (req, res) => {
  try {
    let products = await Product.find().sort({ sales: -1 });

    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getListItem = async (req, res) => {
  try {
    const productIds = req.body;
    // Sử dụng phương thức find() của mongoose để tìm các sản phẩm với mã sản phẩm trong danh sách
    Product.find({ _id: { $in: productIds } })
      .then((result) => {
        return res.status(200).json({
          status: "ok",
          message: "fetch success",
          data: result,
        });
      })
      .catch((err) => { });
  } catch (error) {
    console.log(error);
    return null;
  }
};

// UPDATE LIKE
const likeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const product = await Product.findById(id);
    const isLiked = product.likes.get(userId);

    if (isLiked) {
      product.likes.delete(userId);
    } else {
      product.likes.set(userId, true);
    }

    const updateProduct = await Product.findByIdAndUpdate(
      { _id: id },
      {
        likes: product.likes,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateProduct);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteProducts = async (req, res) => {
  try {
    const { selected } = req.body;
    // return res.json(selected);
    Product.deleteMany({ _id: { $in: selected } })
      .then((result) => {
        res.json({
          data: result,
          status: "ok",
          message: "delete Success",
        });
      })
      .catch((err) => {
        res.json({
          data: "",
          status: "false",
          message: "Delete False",
        });
      });
  } catch (error) {
    res.json({
      data: "",
      status: "flase",
      message: "delete fails",
    });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    res.json(productId);
  } catch (error) { }
};

const updateQuantities = (req, res) => {
  // res.json(req.body);
  try {
    const { cart } = req.body;

    const updates = cart.map((item) => ({
      updateOne: {
        filter: { _id: item._id, quantity: { $gte: item.count } },
        update: { $inc: { quantity: -item.count, sales: item.count } },
      },
    }));

    Promise.all(updates)
      .then((operations) => {
        return Product.bulkWrite(operations);
      })
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.status(400).json({ message: error.message });
      });
  } catch (error) {
    res.json(error);
  }
};

const updateProduct = (req, res) => {
  try {
    const { productId } = req.params;
    Product.findOneAndUpdate({ _id: productId }, req.body, { new: true })
      .then((result) => {
        return res.status(200).json({
          data: result,
          status: "ok",
          message: "update product success",
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: 500,
          message: "Some thing wrong when update product",
          data: "",
        });
      });
  } catch (error) {
    return res.json(error);
  }
};

const addComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;
    const { comment } = req.body;

    const product = await Product.findById(productId);
    if (product) {
      product.comments.push({ userId, comment, timestamp: Date.now() });
      await product.save();
    }
    return res.json({
      status: "oke",
      message: "add comment ok",
      data: product,
    });
  } catch (error) { }
};

const searchPd = async (req, res) => {
  try {
    const searchQuery = req.query.query;
    const products = await Product.find({
      $or: [{ name: { $regex: searchQuery, $options: "i" } }, { category: { $regex: searchQuery, $options: "i" } }, { longDescription: { $regex: searchQuery, $options: "i" } }],
    })
      .sort({ name: -1 })
      .exec();

    return res.json({
      data: products,
      status: "oke",
      message: "oke",
    });
  } catch (error) {
    // Xử lý lỗi
    return res.json(error);
  }
};

module.exports = {
  createProduct,
  likeProduct,
  getProductById,
  getListItem,
  getFeedProduct,
  updateProduct,
  deleteProducts,
  updateQuantities,
  deleteProductById,
  addComment,
  searchPd,
  getTopThreeBestSellingProducts,
  getTotalProducts,
};
