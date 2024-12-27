const { Router } = require("express");

const {
  getAuthors,
  getAuthorByID,
  addAuthor,
  deleteAuthor,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  activateAuthor,
} = require("../controllers/author.controller");
const authorPolice = require("../police_middleware/author_police");
const authorSelfPolice = require('../police_middleware/author_self_police');

const router = Router();

router.get("/", authorPolice, getAuthors);
router.get("/:id", authorPolice, authorSelfPolice, getAuthorByID);
router.get("/activate/:link", activateAuthor);
router.post("/add", addAuthor);
router.post("/login", loginAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshAuthorToken);
router.delete("/:id", authorPolice, authorSelfPolice, deleteAuthor);

module.exports = router;
