const express = require('express');
const router = express.Router();
const pageController = require("../../controllers/pagesController/authPageController");
const authChecker = require('../../tools/generalTools');
const homeController = require('../../controllers/pagesController/homecontroller');

router.get("/", homeController.showHome);
router.get("/article/:id",authChecker.authCheckerExist ,homeController.showarticles);
router.post("/comment",authChecker.authCheckerExist ,homeController.addArticle);

module.exports = router;