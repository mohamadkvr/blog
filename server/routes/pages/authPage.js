const express = require('express');
const router = express.Router();
const authController = require("../../controllers/pagesController/authPageController")
const authChecker = require('../../tools/generalTools');

router.get('/register',authChecker.authCheckerNotExist,authController.register);
router.get('/login',authChecker.authCheckerNotExist,authController.login );
router.get('/forgotpassword',authController.forgotPassword);
router.get('/resetpassword/:token',authController.resetPassword);

module.exports = router;