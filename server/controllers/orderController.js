const Order = require("../models/Order");
const Product = require("../models/Product");

const calculateOrderStatistics = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $in: [4] } }); // Lọc các đơn hàng đã hoàn thành

    let totalRevenue = 0;
    let totalOrders = orders.length;

    orders.forEach(order => {
      order.items.forEach(item => {
        totalRevenue += item.price * item.count;
      });
    });

    res.status(200).json({
      totalRevenue,
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderStatisticsByMonth = async (req, res) => {
  try {
    // Thực hiện aggregation để nhóm và tính toán số lượng đơn hàng theo tháng
    const orders = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" }, // Group theo tháng (1-12)
          count: { $sum: 1 } // Đếm số lượng đơn hàng trong mỗi tháng
        }
      },
      {
        $sort: { "_id": 1 } // Sắp xếp theo thứ tự các tháng (1-12)
      }
    ]);

    // Tạo một object để lưu kết quả, ban đầu tất cả tháng đều có giá trị là 0
    const result = {};
    for (let i = 1; i <= 12; i++) {
      result[`Tháng ${i}`] = 0;
    }

    // Lặp qua kết quả aggregation và cập nhật số lượng đơn hàng cho từng tháng
    orders.forEach(order => {
      const monthName = `Tháng ${order._id}`;
      result[monthName] = order.count;
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const addOrder = async (req, res) => {
  try {
    const { name, phoneNumber, address, userId, items } = req.body;

    await Order.create({
      name,
      phoneNumber,
      address,
      items,
      userId,
      status: 1,
      statusHistory: [{ status: 1, timestamp: Date.now() }],
    })
      .then((result) => {
        return res.status(201).json({
          status: "OK",
          message: "Order Susses",
          data: result,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: "false",
          message: err.message,
          data: "",
        });
      });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: error,
      data: "",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    await Order.find({})
      .then((result) => {
        return res.status(200).json({
          status: "ok",
          message: "Get Order Success",
          data: result,
        });
      })
      .catch((err) => {
        res.status(300).json({
          status: "false",
          message: "Something wrong",
          data: "",
        });
      });
  } catch (error) {
    res.status(500).json({
      status: "false",
      message: "Server wrong",
      data: "",
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    Order.findById(id)
      .then((result) => {
        return res.status(200).json({
          status: "ok",
          message: "Get order success",
          data: result,
        });
      })
      .catch((err) => {
        return res.status(200).json({
          status: "false",
          message: "Get order false",
          data: "",
        });
      });
  } catch (error) {
    return res.status(200).json({
      status: "false",
      message: "Server error",
      data: "",
    });
  }
};
const updateStatus = (req, res) => {
  try {
    const { selected } = req.body.data;

    const updatePromises = selected.map(async (orderId) => {
      const order = await Order.findById(orderId);
      if (order) {
        order.status += 1;
        order.statusHistory.push({ status: order.status, timestamp: Date.now() });
        await order.save();
      }
    });

    Promise.all(updatePromises)
      .then((result) => {
        return res.status(200).json({
          data: result,
          message: "Update status success",
          status: "ok",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(300).json({
          data: "",
          message: "Update status false",
          status: "false",
        });
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: "",
      message: "Server false",
      status: "false",
    });
  }
};

const deleteMany = (req, res) => {
  try {
    const { selected } = req.body;
    Order.deleteMany({ _id: { $in: selected } })
      .then((result) => {
        return res.status(200).json({
          data: result,
          message: "Delete success",
          status: "ok",
        });
      })
      .catch((err) => {
        return res.status(300).json({
          data: "",
          message: "Delete fail",
          status: "false",
        });
      });
  } catch (error) {
    return res.status(500).json({
      data: "",
      message: "Server false",
      status: "false",
    });
  }
};

const thongke = (req, res) => {
  try {
    const { productId } = req.params;
    Order.find()
      .then((result) => {
        const salesByMonth = getProductSalesByMonth(productId, result);
        res.json(salesByMonth);
      })
      .catch((err) => {});
  } catch (error) {
    return res.json(error);
  }
};

const thongkeDoanhThu = (req, res) => {
  try {
    Order.find()
      .then((result) => {
        const salesByMonth = getSalesByMonth(result);
        res.json(salesByMonth);
      })
      .catch((err) => {});
  } catch (error) {
    return res.json(error);
  }
};
const getOrdersByUserId = (req, res) => {
  try {
    const { userId } = req.params;
    Order.find({ userId })
      .then((result) => {
        return res.json({ data: result, status: "ok", message: "ok" });
      })
      .catch((err) => {});
  } catch (error) {}
};

function getProductSalesByMonth(productId, orders) {
  // Tạo một đối tượng để lưu trữ kết quả thống kê
  const productSalesByMonth = {};

  const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  for (const month of months) {
    if (!productSalesByMonth[month]) {
      productSalesByMonth[month] = 0;
    }
  }

  // Lặp qua từng đơn hàng
  for (const order of orders) {
    // Lấy tháng từ createdAt
    const month = new Date(order.createdAt).getMonth() + 1;

    // Kiểm tra nếu đơn hàng có chứa sản phẩm có productId
    const foundItem = order.items.find((item) => {
      return item._id.toString() === productId;
    });
    if (foundItem) {
      // Kiểm tra nếu chưa có thông tin thống kê cho tháng này, tạo mới
      if (!productSalesByMonth[`Tháng ${month}`]) {
        productSalesByMonth[`Tháng ${month}`] = 0;
      }
      // Tăng số lượng bán được trong tháng lên 1
      productSalesByMonth[`Tháng ${month}`] += foundItem.count;
    }
  }

  return productSalesByMonth;
}

function getSalesByMonth(orders) {
  // Tạo một đối tượng để lưu trữ kết quả thống kê
  const productSalesByMonth = {};

  const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  for (const month of months) {
    if (!productSalesByMonth[month]) {
      productSalesByMonth[month] = 0;
    }
  }

  // Lặp qua từng đơn hàng
  for (const order of orders) {
    // Lấy tháng từ createdAt
    const month = new Date(order.createdAt).getMonth() + 1;

    // Kiểm tra nếu đơn hàng có chứa sản phẩm có productId
    const doanhthu = order.items.reduce((acc, item) => {
      return acc + item.price * item.count;
    }, 0);
    productSalesByMonth[`Tháng ${month}`] += doanhthu;
  }

  return productSalesByMonth;
}
module.exports = {
  addOrder,
  getOrders,
  getOrder,
  updateStatus,
  deleteMany,
  thongke,
  getOrdersByUserId,
  thongkeDoanhThu,
  getOrderStatisticsByMonth,
  calculateOrderStatistics,
};
