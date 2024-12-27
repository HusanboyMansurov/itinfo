const { Router } = require("express");
const {
  addCategory,
  getCategoryById,
  getCategories,
} = require("../controllers/category.controller");

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/add", addCategory);

module.exports = router;
