const validateBodyExist = require("../../validate/authvalidate");
const { validationResult } = require("express-validator");
const user = require("../../models/models");
const bcrypt = require("bcrypt");
const multer = require("multer");
const generalTools = require("../../tools/generalTools")
const fs = require("fs");
const path = require("path");
const article = require("../../models/aricle")

module.exports.updateUser =  (req, res) => {
             let existInputs = validateBodyExist.updateValidatorsBody(req);
             if (existInputs ) {
               
                 req.flash("errors", "you must be fill all of inputes");
                 return res.redirect("http://localhost:3000/dashboard/owner/update");
             }

             const errors = validationResult(req);
             if (!errors.isEmpty()) {
              
              req.flash('errors', errors.array()[0].msg)
              return res.redirect("http://localhost:3000/dashboard/owner/update")
             }

             user.findByIdAndUpdate(req.session.user._id, req.body, {new : true},( err , newUser) =>{
                if (err) {
                    console.log(err);
                    //////unique validate/////////////
                    if(err.code  == 11000) {
                         if (err.keyValue.userName) {
                             req.flash('errors' , "this user name already exists" )
                             return res.redirect("http://localhost:3000/dashboard/owner/update");
                         }else {
                             req.flash('errors', "this email  already exists")
                             return res.redirect("http://localhost:3000/dashboard/owner/update");
                         }
                    }
                }
                           req.session.user = newUser

                           res.redirect("http://localhost:3000/dashboard");
                          
             })
}

module.exports.updatePassword =  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return  res.status(400).json({err : errors.array()[0].msg});
    }

////////////////////////////hash with bycrypt/////////////////////////////////////////// 

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return res.status(500).json({err : " err in hash update pass 1 "});
        bcrypt.hash(req.body.password, salt, function(err, hash) {

            if (err) return res.status(500).json({err : " err in hash update pass 2"}); 
            user.findByIdAndUpdate(req.session.user._id,{password : hash},{new : true},(err, newUser) => {
                if ( err) return res.status(404).json({err : "server err on update password"})
                return   res.status(201).json({data : "password updated successfully"})
            })
        });
    });

}

module.exports.updateAvatar =  (req, res) => {

////////////////////////////upload with multer///////////////////////////////////////////

       const upload = generalTools.uploadAvatar.single("avatar");
       upload(req , res, ( err) => {
        if (err instanceof multer.MulterError) {
                  return  console.log(err);
          } else if (err) {
                  return  console.log(err);
          } else { 
                if ( req.session.user.avatar) {

                            fs.unlink(`public/img/avatar/${req.session.user.avatar}`,(err) => {
                                 if(err) return console.log(err);

                user.findByIdAndUpdate(req.session.user._id, { avatar : req.file.filename } ,{new : true}, (err, result) => {
                    if ( err) return console.log(err);
                    req.session.user = result;
                    res.redirect("http://localhost:3000/dashboard/owner/update");

          })
                            })

                }else {
                    user.findByIdAndUpdate(req.session.user._id, { avatar : req.file.filename } ,{new : true}, (err, result) => {
                        if ( err) return console.log(err);
                        req.session.user = result;
                        res.redirect("http://localhost:3000/dashboard/owner/update")
    
              })
                }

          }
       }) 
}

module.exports.createArticle =   (req, res) => {
    
    const upload = generalTools.uploadArticleavatar.single("articleavatar");
   
    upload(req , res, ( err) => {
        
        if (err instanceof multer.MulterError) {
                  return  console.log(err);
          } else if (err) {
              console.log(err.message);
                  return  res.status(400).json({err : err.message});
          } else { 


let text = generalTools.createSegment(req.body.text);
let description = req.body.description.slice(0,100);
 new  article ({
     title:req.body.title,
     description:description,
     text:text,
     userId:req.session.user._id,
     articleavatar:req.file.filename,
     image:req.session.imgArt,
     date:new Date()
 }).save((err , article) => {
     if (err) return  console.log(err);
 
     req.session.user.articleId = article._id;
    res.status(201).json({data : "article added successfully",img:req.file.filename});
 });

                    }
            })


 }

 module.exports.uploadeImgArticle = (req, res) => {
    
    const upload = generalTools.uploadArticleImg.single("upload");
    upload(req , res, ( err) => {
        
        if (err instanceof multer.MulterError) {
                  return  console.log(err);
          } else if (err) {
              console.log(err.message);
                  return  res.status(400).json({err : err.message});
          } else { 
                req.session.imgArt.push(req.file.filename);
                 res.json({
                     "uploaded":1,
                     "fileName":req.file.originalname,
                     "url": `http://localhost:3000/img/articleimg/${req.file.filename}`,     
                 })
          }
        })
    
 }

 module.exports.updateArticle =   (req, res) => {
     
    const upload = generalTools.uploadArticleavatar.single("articleavatar");
    upload(req , res, ( err) => {
        
        if (err instanceof multer.MulterError) {
                  return  console.log(err)
          } else if (err) {
                  return  res.status(400).json({err : err.message});
          } else { 

            article.findById(req.body.id,{image:1,articleavatar:1},(err, newarticle) => {
                if ( err) return res.status(400).json({err: err.message})
                if ( ! newarticle) return res.status(404).json({data: "not found"})
                let images = newarticle.image
                let newImg = req.session.imgArt
                let imgs = [...images, ...newImg]
  
          let resultImg = generalTools.checkImaArtForUpdate(req.body.text, imgs)
          if(resultImg[1].length > 0) {
           generalTools.deleteExtraImg(resultImg[1])

          }

          let   text =    generalTools.createSegment(req.body.text)
          let resultobject = {
            title : req.body.title,
            description : req.body.description.slice(0,100),
            text: text,
            image : resultImg[0]
        }

         if(req.file) {
            resultobject.articleavatar = req.file.filename;
            fs.unlink(`${path.resolve()}/public/img/articleavatar/${newarticle.articleavatar}`,(err) => {
              if (err) return console.log(err);
   })
         }
                article.findByIdAndUpdate(req.body.id,resultobject ,{new: true}, (err , newArt) => {
                    if(err) return res.status(400).json({err : err.message});
                    res.status(201).json({success: true,id : newArt._id })
                });
            })
          }
        })
    
 }

 module.exports.deleteArticle = (req , res) => {
      article.findById(req.params.id,(err , thisarticle) => {
                    if (err) return  res.status(400).json({success:false, message : err.message})
                    if( ! thisarticle) return res.status(404).json({success:false, message : err})
                    if(thisarticle.image.length > 0)  generalTools.deleteExtraImg(thisarticle.image)

                    article.findByIdAndDelete(req.params.id,(err ) => {
                                  if(err) return res.status(400).json({success:false})
                                  res.status(200).json({success:true})
                    })        
      })
 }


