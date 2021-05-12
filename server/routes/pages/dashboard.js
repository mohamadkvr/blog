const express = require('express');
const router = express.Router();
const pageController = require("../../controllers/pagesController/authPageController");
const authChecker = require('../../tools/generalTools');

router.get("/" ,authChecker.authCheckerExist,pageController.dashboard);
router.get("/owner/update", authChecker.authCheckerExist,pageController.update);
router.get("/owner/createarticle", authChecker.authCheckerExist,pageController.createarticle);
router.get("/owner/article/:id",authChecker.authCheckerExist, pageController.showArticle);
router.get("/owner/article/update/:id",authChecker.authCheckerExist,pageController.updateArticle);

module.exports = router;