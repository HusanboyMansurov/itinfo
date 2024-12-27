const { errorHandler } = require("../helpers/error_handler");
const Category = require("../schemas/Category");
const Joi = require("joi");
const { categoryValidation } = require("../validations/category.validation");

const addCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const { category_name, parent_category_id } = value;

    const category = await Category.findOne({
      category_name: { $regex: category_name, $options: "i" },
    });
    if (category) {
      return res
        .status(400)
        .send({ message: "Bunday kategoriya avval kiritilgan" });
    }
    const newCategory = await Category({
      category_name,
      parent_category_id,
    });

    await newCategory.save();
    res.status(200).send({ message: "Yangi kategoriya qo'shildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).populate("parent_category_id");

    if (!categories) {
      return res.status(400).send({ message: "Birorta kategoriya topilmadi" });
    }

    res.json({ categories });
  } catch (error) {
    errorHandler(error, res);
  }
};
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parent_category_id"
    );

    if (!category) {
      return res.status(400).send({ message: "Bunday kategoriya topilmadi" });
    }
    res.json(category);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addCategory,
  getCategories,
  getCategoryById,
};
