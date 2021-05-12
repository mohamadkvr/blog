const validateBodyExist = require("../../validate/authvalidate")
const { validationResult } = require("express-validator")
const user = require("../../models/models");
const passReset  = require("../../models/password-reset");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const nodeMailer = require('nodemailer');


module.exports.register = (req , res) => {

    //////////validate body //////////////////////////////////////////
   let existBody =  validateBodyExist.registerValidatorsBody(req);
   if (existBody) {
    req.flash('errors', 'you have to enter all of inputs');
     return res.redirect("/register");
   }
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
    req.flash('errors', errors.array()[0].msg);
    return res.redirect("/register");
   }
   ////////////////////add user //////////////////////////////////////////////

   new user ({
       firstName : req.body.firstName,
       lastName : req.body.lastName,
       userName : req.body.userName,
       email : req.body.email,
       password : req.body.password,
       phone : req.body.phone,
   }).save((err , data) => {
       if (err) {
           //////unique validate/////////////
           if(err.code  == 11000) {
                if (err.keyValue.userName) {
                    req.flash('errors' , "this user name already exists" );
                    return res.redirect("/register");
                }else {
                    req.flash('errors', "this email  already exists");
                    return res.redirect("/register");
                }
           }
       }
       res.redirect("/login");
   })
   
}
module.exports.login = (req , res) => {

    user.findOne({userName:req.body.userName,email:req.body.email}, (err , user) => {
        if (err) return console.log(err);
        if (!user) {
            req.flash("errors", "No user with this username or email or password was found");
            return res.redirect("/login");
        }

 /////////////////compare password///////////////////////////////      

        bcrypt.compare( req.body.password, user.password,function(err, result) {
             if(!result) {

                req.flash("errors", "No user with this username or email or password was found");
                return res.redirect("/login");

             }else {
                req.session.user = user;
                req.session.imgArt = [];
                req.flash("success", "Your login was successful" );
               let url = req.flash("url");

////////////////////////////redirect///////////////////////////////////////////

                   if(url.length > 0) {
                        if (url[0] =="/"){
                            return res.redirect("/dashboard");
                        }else if(url[0].includes("owner")) {
                            return res.redirect(`/dashboard/${url[0]}`);
                                                 
                        }else if(!url[0].includes("owner") && url[0].includes("article")){
                            return res.redirect(`/home/${url[0]}`);;
                        }
                    }else {
                    return res.redirect('/home');
                }
             }
        });
       
    })
}
module.exports.logout = (req , res) => {
    req.session.user = "";
    res.redirect("/home");
}
module.exports.forgotEmail = (req , res) => {
         if (!req.body.email) {
             req.flash("error", "you must be enter a email");
             return  res.redirect(req.header('Referer'));
         }
         
         user.findOne({ email: req.body.email },(err, user) => {
              if (err) return console.log(err);
              
              if(!user) {
                  req.flash("error", "No user found with such email");
                  return  res.redirect(req.header('Referer'));
              }
///////////////////////////create token for password reset///////////////////////////////////////////  

              new passReset({
                email : req.body.email,
                token : uuidv4(),
       }).save((err , data) => {
        if (err) return console.log(err);

////////////////////////////send email to user//////////////////////////////////////////

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
    to: `${req.body.email}`, // list of receivers
    subject: "password reset", // Subject line
    html:`
        <h2>Reset password</h2>
        <p>for reset your password  click on link bottom</p>
        <a href = "http://localhost:3000/resetpassword/${data.token}">click here</a>   
    `, // html body
  }
  transporter.sendMail(options, (err, info) => {
      if(err) return consol.log("err");
      req.flash("success", "check your email for reset your password");
      res.redirect("/login");
  })

       
    })

         })



}
module.exports.resetpassword = (req , res) => {
         const {email,password} = req.body
         
         if(!email || !password) {
                   req.flash("errors", "you must be enter all of inputs")
                   return  res.redirect(`http://localhost:3000/resetpassword/${req.body.token}`)
         }
        
         passReset.findOne({$and:[{email: req.body.email, token: req.body.token,}]} , (err , data) => {
                if(err) return console.log(err)
                
                if(!data) {
                    req.flash("errors", "No user found with this email")
                    return   res.redirect(`http://localhost:3000/resetpassword/${req.body.token}`)
    
                }
                
////////////////////////////hash with bycrypt///////////////////////////////////////////

                bcrypt.genSalt(10, function(err, salt) {
                    if (err) return res.status(500).json({err : " err in hash update pass 1 "}); 
                    bcrypt.hash(req.body.password, salt, function(err, hash) {
                        if (err) return res.status(500).json({err : " err in hash update pass 2"}); 
                        user.findOneAndUpdate({email : req.body.email},{$set : {password : hash}},(err, newUser) => {
            
                            if ( err) return res.status(404).json({err : "server err on update password"});
                            
                            passReset.findOneAndDelete({token : req.body.token},(err) => {
                                if(err) return console.log(err);
                                req.flash("success","password updated successfully Refer to the login page for login");
                                res.redirect(`http://localhost:3000/resetpassword/${req.body.token}`);

                            })
                         
                        })
                    });
                });
                
         })

}
