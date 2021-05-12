const article = require('../../models/aricle')
const comment = require('../../models/comment')

module.exports.showHome = (req , res )  => {
       
       article.find({},{description:1,image:1,title:1,date:1,articleavatar:1}).sort({date:-1})
         .populate("userId", {userName:1}).exec((err , articles) => {

              if (err) return res.status(400).send({err : err.message});
        if(req.session.user) {
            return  res.render("home/home",{articles, success:req.flash("a"),auth:"ok"});
        }
              res.render("home/home",{articles, success:req.flash("a"),auth:"no"});
      
      })
      
}

module.exports.showarticles = (req , res )  => {
   
       article.findById(req.params.id,{description:0}).populate("userId",{userName:1,role :1}).exec((err, article) =>{
              if (err) return console.log(err);
              if (!article) return console.log("not found");
             let limitNumber = req.query.page;
             let skipNumber =  0;
             if(req.query.page > 1) { {
              skipNumber = 5;
             }}
             comment.find({articleID : req.params.id}).populate("userId",{avatar:1,userName:1})
               .sort({date : -1}).exec((err, comments) =>{
                     if(err) return console.log(err)
                     comment.find({}).count().exec((err , a) =>{
                            if(err) return console.log(err)
                             let resultnumber = 0;

                             if( a < 5) {
                                   resultnumber = 1
                                   console.log(a)
                             }else {
                                   if ( a % 5  == 0 ) {
                                          resultnumber  =  Math.floor(a / 5)
                                   }else {
                                          resultnumber  =  Math.floor(a / 5) + 1
                                   }
                             }
                            res.render("home/showarticle",{article,role:req.session.user.role,comments,page :resultnumber } )
                     } )
                     
              })

        
           
 })
}
module.exports.addArticle = (req , res )  => {
     new comment ({
              userId : req.session.user._id,
              articleID : req.body.id,
              text : req.body.text,
              date : new Date()
       }).save((err, comment) => {
              if(err) return res.status(400).json({message : err.message});
             res.status(201).json({data : "sucssec"});
       })
}