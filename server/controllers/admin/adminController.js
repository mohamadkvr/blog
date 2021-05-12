const user = require("../../models/models");
const fs = require("fs");
const article = require("../../models/aricle");
const comment = require("../../models/comment");
const path = require("path");
const adminTools = require("../../tools/admintools");
const nodeMailer = require('nodemailer');

module.exports.showUsers = (req, res) => {
    user.find({role : "blogger"},(err, users) => {

           if(err) return console.log(err);
           res.render("admin/users",{users});
           
    })
}

module.exports.deleteUsers = async (req, res) => {
        try {
          let resultDeleteUser = await user.findByIdAndDelete(req.body.id);

//////////////////////////////delete avatar of user///////////////////////////////////////////

           if(resultDeleteUser.avatar) {
              let result =  fs.unlinkSync(`${path.resolve()}/public/img/avatar/${resultDeleteUser.avatar}`);
           }

////////////////////////////delete images of article///////////////////////////////////////////      

           let resultfindArticleForDeImg = await article.find({userId: req.body.id},{image : 1});
           let deleteComment =  await  comment.deleteMany({articleID : resultfindArticleForDeImg[0]._id})
           
           let resultfindArticleForDeAvatar = await article.find({userId: req.body.id},{articleavatar: 1});
           let  avatar = resultfindArticleForDeAvatar[0].articleavatar;
           let resultDelAvatar =  fs.unlinkSync(`${path.resolve()}/public/img/articleavatar/${avatar}`);
    
           for ( let i of resultfindArticleForDeImg ) {
                for (let j of i.image) {
                    fs.unlinkSync(`${path.resolve()}/public/img/articleimg/${j}`);
                }
           }

////////////////////////////delete articles of user///////////////////////////////////////////

           let resultDeleteArticles = await article.deleteMany({userId: req.body.id});
           return res.status(201).json({ success: true});

        } catch (error) {
            if(error) return res.status(400).json({ success: false});
        }
}

module.exports.deleteArt = async (req, res) => {
          try {
                    let resultFind = await article.findById(req.params.id);

////////////////////////////delete avatar and images of article///////////////////////////////////////////                    
                    
                    for (let i of resultFind.image) {
                           fs.unlinkSync(`${path.resolve()}/public/img/articleimg/${i}`);
                   }

                   let resultDelAvatar =  fs.unlinkSync(`${path.resolve()}/public/img/articleavatar/${resultFind.articleavatar}`);
                   let deleteComment =  await  comment.deleteMany({articleID : req.params.id });

////////////////////////////delete article///////////////////////////////////////////                 
                   let resultDeleteArt = await article.findByIdAndDelete(req.params.id)
                    if(resultDeleteArt) {
                        res.redirect("/home")

                    }
          } catch (error) {
              console.log(error)
          }
}

module.exports.resetPassAdmin =  (req, res) => {
            
       const id = req.body.id;
       

       user.findById(id,{phone:1},(err, myUser) => {
        
             if(err) res.status(400).json({err});
             let hash = adminTools.hashWithbycrpt(res,myUser.phone);
             user.findByIdAndUpdate(myUser.id,{password:hash},{new : true},(err,newUser) => {
                         if(err) return res.status(400).json({err});

                         
let transporter = nodeMailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: '781e19253ca472', // generated ethereal user
      pass: "1d9a787c6f2862", // generated ethereal password
    },
  });
  let options = {
    from: '"programing blog 👻" <foo@example.com>', // sender address
    to: `${newUser.email}`, // list of receivers
    subject: "password reset", // Subject line
    html:`
        <h2>Reset password</h2>
        <p>Your password has been changed to your mobile number. Please login again using the link below and reset your password.</p>
        <a href = "http://localhost:3000/login">click here</a>   
    `, // html body
  }
  transporter.sendMail(options, (err, info) => {
      if(err) return consol.log("err");
       res.json({success : "password reset successfully and send emill for this user"})
  })

       
             })
       })
}


module.exports.deleteComment =  (req, res) => {
        
            comment.findByIdAndDelete(req.body.id, (err) =>{
                if(err) return res.status(400).json({ err});

                res.json({data:req.header('Referer')});
            })
}

