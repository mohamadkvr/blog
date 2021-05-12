const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin/adminController');
const generalTools = require('../../tools/generalTools');

router.get("/users",generalTools.checkRole,adminController.showUsers);
router.delete("/deleteuser",adminController.deleteUsers);
router.get("/deleteArt/:id",adminController.deleteArt);
router.post('/resetpass',adminController.resetPassAdmin);
router.delete("/deletecomment",adminController.deleteComment);

module.exports = router