const { Router } = require("express");
const {
  getSynonyms,
  addSynonym,
  getSynonym,
  updateSynonym,
  deleteSynonym,
} = require("../controllers/synonym.controller");

const router = Router();

router.get("/", getSynonyms);
router.post("/", addSynonym);
router.get("/:id", getSynonym);
router.put("/:id", updateSynonym);
router.delete("/:id", deleteSynonym);

module.exports = router;
