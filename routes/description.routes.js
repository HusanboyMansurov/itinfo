const { Router } = require("express");
const {
  addDescription,
  getDescription,
  getDescriptions,
} = require("../controllers/description.controller");

const router = Router();

router.get("/", getDescriptions);
router.get("/:id", getDescription);
router.post("/", addDescription);

module.exports = router;
