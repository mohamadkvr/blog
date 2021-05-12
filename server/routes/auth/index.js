const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../../controllers/main/authcontroller")
const validation = require("../../validate/authvalidate");
const authChecker = require('../../tools/generalTools');
const userController = require("../../controllers/main/userController");


router.post('/login',validation.validation(body),authController.login);
router.post('/register',validation.validation(body),authController.register);
router.get("/logout",authController.logout);


router.post("/updateUser",authChecker.authCheckerExist,validation.validationUser(body),userController.updateUser);
router.post("/updatePassword",authChecker.authCheckerExist,validation.validationPass(body),userController.updatePassword);
router.post("/updateAvatar",authChecker.authCheckerExist,userController.updateAvatar);
router.post("/creatarticle",authChecker.authCheckerExist,userController.createArticle);
router.post("/uploadimagearticle",authChecker.authCheckerExist,userController.uploadeImgArticle);
router.post("/updatearticle",authChecker.authCheckerExist,userController.updateArticle);
router.delete("/deletearticle/:id",authChecker.authCheckerExist,userController.deleteArticle);
router.post("/forgotemail",authController.forgotEmail);
router.post("/resetpassword",authController.resetpassword);


module.exports = router;