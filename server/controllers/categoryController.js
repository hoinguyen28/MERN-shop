const Category = require("../models/Category");

const getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json({ data: category, messgase: "ok", status: 200 });
  } catch (error) {}
};

const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const category = new Category({
      name,
      slug,
    });
    await category
      .save()
      .then((result) => {
        res.status(201).json({ status: 200, messgase: "Add category success", data: result });
      })
      .catch((err) => {
        res.status(500).json({ status: 500, messgase: err, data: "" });
      });
  } catch (error) {}
};

module.exports = {
  getCategory,
  createCategory,
};
