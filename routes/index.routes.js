const express = require("express");

const dictionaryRouter = require("./dictionary.routes");

const categoryRouter = require("./category.routes");
const descriptionRouter = require("./description.routes");
const synonymRouter = require("./synonym.routes");
const authorRouter = require("./author.routes");

const router = express.Router();

router.use("/dict", dictionaryRouter);
router.use("/category", categoryRouter);
router.use("/desc", descriptionRouter);
router.use("/synonym", synonymRouter);
router.use("/author", authorRouter);

module.exports = router;
