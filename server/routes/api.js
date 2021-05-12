const express = require('express');
const router = express.Router();
const authChecker = require('../tools/generalTools');
router.use((req, res, next) => {

    let urlListPattern = ["/auth/uploadimagearticle","/auth/creatarticle"]
    if(!urlListPattern.includes(req.url)) {
             if(! req.url.includes("updatearticle")) {
                    if(req.session.imgArt) {
              
                        req.session.imgArt = []
                    }
             }
    }
    next();
})

router.use("/" ,require(__dirname + "/pages/authPage"))
router.use("/auth",require(__dirname + "/auth/index"))
router.use("/dashboard",require(__dirname +"/pages/dashboard"))
router.use("/home",require(__dirname +"/pages/homepage"))
router.use("/admin",require(__dirname +"/admin/adminRouter"))

module.exports = router