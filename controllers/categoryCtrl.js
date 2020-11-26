const Categories = require("../models/categoryModel");
const Products = require("../models/productModel");

const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Categories.find();
      if (!categories)
        return res.status(400).json({ msg: "there is no category" });

      res.json(categories);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Categories.findOne({ name });
      if (category)
        return res.status(400).json({ msg: "category already exist" });

      const newCategory = new Categories({
        name,
      });
      await newCategory.save();
      res.json({ msg: "category created" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Categories.findByIdAndUpdate(req.params.id, { name });
      res.json({ msg: "category updated" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const products = await Products.findOne({ category: req.params.id });
      if (products)
        return res.status(400).json({
          msg:
            "can't delete category, please delete all products with same category",
        });

      await Categories.findByIdAndDelete(req.params.id);
      res.json({ msg: "category deleted" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = categoryCtrl;
