const User = require("../models/User");
const bcrypt = require("bcrypt");
//READ USER
const getTotalUsers = async (req, res) => {
  try {
    const totalCount = await User.countDocuments();
    res.json({ totalUsers: totalCount });
  } catch (err) {
    console.error("Error fetching total users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    if (!user) return res.status(404).json({ message: "User not found!!!" });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(_id, { cart: [...req.body.cart] })
      .then((result) => {
        res.status(200).json({
          status: "ok",
          message: "Update Sucess",
          data: result,
        });
      })
      .catch((err) => {
        res.status(200).json({
          status: "false",
          message: "Update fails",
          data: "",
        });
      });
  } catch (error) {}
};

//GET ALL USER
const getAllUser = async (req, res) => {
  try {
    const user = await User.find({});
    res.json({ data: user });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getListUser = (req, res) => {
  try {
    const { uniqueUserIds } = req.body;
    User.find({ _id: { $in: uniqueUserIds } })
      .then((result) => {
        return res.status(200).json({
          status: "Ok",
          message: "ok",
          data: result,
        });
      })
      .catch((err) => {});
  } catch (error) {}
};

const deleteUsers = async (req, res) => {
  try {
    const { selected } = req.body;
    // return res.json(selected);
    User.deleteMany({ _id: { $in: selected } })
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
const updateAccount = async (req, res) => {
  try {
    const { userId } = req.params;
    let { firstName, lastName, email, password } = req.body;

    const editAble = req.params.userId === req.user._id || req.user.role === "admin";

    if (editAble) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);

      // Cập nhật thông tin người dùng trong database
      User.findByIdAndUpdate(userId, { firstName, lastName, email, password: passwordHash }, { new: true })
        .then((result) => {
          return res.json({
            data: result,
            message: "Cập nhật thành công",
            status: "true",
          });
        })
        .catch((err) => {
          return res.json({
            data: "",
            message: "Cập nhật thất bại",
            status: "false",
          });
        });
    } else {
      return res.json({
        data: "",
        message: "Cập nhật thất bại",
        status: "false",
      });
    }
  } catch (error) {
    // Xử lý lỗi
    return res.json({
      data: "",
      message: "Cập nhật thất bại",
      status: "false",
    });
  }
};
const updateRole = (req, res) => {
  try {
    const { userId, role } = req.body;
    User.findByIdAndUpdate(userId, { role }, { new: true })
      .then((result) => {
        return res.json({
          data: result,
          message: "Cập nhật thành công",
          status: "true",
        });
      })
      .catch((err) => {
        return res.json({
          data: "",
          message: "Cập nhật thất bại",
          status: "false",
        });
      });
  } catch (error) {
    return res.json({
      data: "",
      message: "Cập nhật thất bại",
      status: "false",
    });
  }
};
module.exports = {
  getUser,
  getAllUser,
  updateCart,
  getListUser,
  deleteUsers,
  updateAccount,
  updateRole,
  getTotalUsers,
};
