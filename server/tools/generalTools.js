const path = require('path');
const multer = require('multer');
const { validationResult } = require("express-validator");
const validation = require('../validate/authvalidate');
const fs = require('fs');

let avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        let a= path.join(__dirname, "../../public/img/avatar")
      cb(null, path.join(__dirname, "../../public/img/avatar"))
    },
    filename: function (req, file, cb) {
      cb(null, `${req.session.user.userName}-${Date.now()}-${file.originalname}`)
    }
  })


  module.exports.uploadAvatar = multer({
      storage : avatarStorage,
      fileFilter : (req, file, cb) => {
             if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
                 cb(null, true)       
             }else{
                 cb(new Error("Invalid type"))
             }
      }
  })

  

  module.exports.authCheckerExist = (req, res, next) => {
       if (req.session.user ){
                 next()
       }else {
         let url = req.url
     req.flash("url", `${url}`)
         res.redirect("/login")
       }
  } 

  module.exports.authCheckerNotExist = (req, res, next) => {
    
       if (req.session.user ){
 
      return     next();
      }
    next();
  }

  module.exports.createSegment = (text) => {
    let result = []
        
    let count = segment(text)
    
   if (text.length > 100) {

   count.push(text.slice(count.length*499,text.length ))

   for(let i of count) {
      if (i) {
             result.push({ text1 : i})
      }
  }
 }else{
   return  [{text}]
 }
  
   return result
}

let articleImgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/img/articleimg"))
  },
  filename: function (req,file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

module.exports.uploadArticleImg = multer({
  storage :articleImgStorage ,
  fileFilter : (req, file, cb) => {
  
         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
             cb(null, true)       
         }else{
             cb(new Error("Invalid type"), false)
         }
  }
})

function segment(text) {
  let len =Math.floor(text.length / 499)
  let list = []
  let b = 0
  let n = 500
  for (let i = 0; i < len; i++) {
  list.push(text.slice(b , n))
  b +=500
  n +=500
  }
  return list
}

module.exports.joinText = (list) => {
    let text = "";
    for(let i of list) {
       text += i.text1
    }
    return text
 }

 module.exports.deleteExtraImg = (list) => {
   console.log(list)
   let flag = true
    for(let i of list) {
      fs.unlink(`${path.resolve()}/public/img/articleimg/${i}`,(err) => {
                   if(err) {
                     flag = false;
                    
                   }     
      })

    }
    return flag
 }


 module.exports.checkImaArtForUpdate = (text, imgs) => {
        let imageBe = [];
        let imageBeDelete = [];
        for(let i of imgs) {
          if(!text.includes(i)) {
                imageBeDelete.push(i)
          }else {
            imageBe.push(i)
          }
        } 
        return [imageBe , imageBeDelete]
 }

 module.exports.checkRole = (req, res, next) => {
  if(req.session.user) {

    if(  req.session.user.role  !==  "admin" ) {
      return   res.redirect("/home")  
     }
  }else{
    return   res.redirect("/home")  
  }

         next()
 }

 
let articleavatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/img/articleavatar"))
  },
  filename: function (req,file, cb) {


  let validLength = validation.validationlenghText( req.body.text , req.body.description)
  if(validLength == "text") {
    return cb(new Error("text must be more than 100 characters"),false)
  }

  if(validLength == "description") {
    return cb(new Error("description must be more than 500 characters"),false)
  }

    let {title,description,text} = req.body
if ( !title || !description || !text){
 return cb(new Error("you must enter all of input"),false)
}
    cb(null, `${req.body.title}-${Date.now()}-${file.originalname}`)
  }
})

module.exports.uploadArticleavatar = multer({
  storage :articleavatarStorage ,
  fileFilter : (req, file, cb) => {
  
         if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
             cb(null, true)       
         }else{
             cb(new Error("Invalid type"), false)
         }
  }
})
