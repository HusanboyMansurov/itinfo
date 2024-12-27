const { createViewPage } = require("../helpers/create_view_page");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.render(createViewPage("index"), {
    title: "Asosiy sahifa",
    isHome: true,
  });
});
router.get("/dictionary", (req, res) => {
  res.render(createViewPage("dictionary"), {
    title: "Lug'atlar",
    isDict: true,
  });
});
router.get("/topics", (req, res) => {
  res.render(createViewPage("topics"), {
    title: "Maqolalar",
    isTopic: true,
  });
});
router.get("/authors", (req, res) => {
  res.render(createViewPage("authors"), {
    title: "Mualliflar",
    isAuthor: true,
  });
});
router.get("/login", (req, res) => {
  res.render(createViewPage("login"), {
    title: "Tizimga kirish",
    isLogin: true,
  });
});

module.exports = router;
