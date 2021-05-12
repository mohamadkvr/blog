const article = require('../../models/aricle');
const Comment = require('../../models/comment')


module.exports.register = (req , res ) => {
            let errors = req.flash("errors");
            res.render("auth/register" ,{errors});
}
module.exports.login = (req , res ) => {

    let errors = req.flash("errors");
    let success = req.flash("success")
    res.render("auth/login" ,{errors , success})
}
module.exports.dashboard = (req , res) => {

    let sessionUser = req.session.user;
    let {password,...user} =  sessionUser;

    article.find({userId: req.session.user._id},{description:1,image:1,title:1,date:1,articleavatar:1}).sort({date:-1}).exec((err , articles) => {
        if (err) return res.status(400).send({err : err.message});

        res.render("dashboard/dashboard", {user, articles});

})
   
}
module.exports.update = (req , res) => {
    let sessionUser = req.session.user;
    let {password,...user} =  sessionUser;
         res.render("dashboard/updateuser", {user , errors : req.flash("errors")});
} 
module.exports.createarticle = (req , res) => {
             res.render("dashboard/createarticle");
}
module.exports.showArticle = (req , res) => {

             article.findById(req.params.id).populate("userId",{userName:1,avatar:1}).exec((err , article) => {
                     if (err) {
                return res.render("dashboard/articleownerpage",{error : true});
            }

            if (!article){
                error.message = "not found"
                return res.render("dashboard/articleownerpage",{error : true});
            } 
            Comment.find({articleID: article._id}).populate("userId").exec((err, comments)=>{
                
            if(err) return console.log(err);
            res.render("dashboard/articleownerpage",{article,error:false,comments});

            }) 
             })
            }        
module.exports.updateArticle = (req , res) => {
     
       article.findById(req.params.id,(err, article) => {
             if (err) return console.log(err)
             if(!article) return console.log("not found")
           
           res.render("dashboard/updatearticle",{article})
              
       })
}
module.exports.forgotPassword = (req , res) => {
    let errors = req.flash("error");
    res.render("auth/forgotpassword", {errors,success : "no"});
}
module.exports.resetPassword = (req , res) => {
             res.render("auth/resetpassword",{success:req.flash("success"),errors:req.flash("errors"),token : req.params.token})
}