const express = require("express");
const {
  addTerm,
  getDictionary,
  getTermsByLetter,
  getTermsByTerm,
  getTermById,
} = require("../controllers/dictionary.controller");

const router = express.Router();

router.post("/create", addTerm);
router.get("/", getDictionary);
router.get("/letter/:letter", getTermsByLetter);
router.get("/term/:term", getTermsByTerm);
// router.get("/query/search", getTermsByQuery);
router.get("/:id", getTermById);

module.exports = router;
