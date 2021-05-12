const express = require('express');
const router = express.Router();
const pageController = require("../../controllers/pagesController/authPageController")
const authChecker = require('../../tools/generalTools')

// router.get("/article/:id", pageController.showArticle)


module.exports = router
