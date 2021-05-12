const user = require("../models/models");
const article = require("../models/aricle");
const generalTools = require("./generalTools");
const bcrypt = require("bcrypt");

module.exports.deleteImgArticle = (id) =>{

            article.find({userId : id},{image :1},(err, articles) =>{
                  if(err) return "err in find article"

                  let images = [];
                  for(let i of articles) {
                      images.push(...i.image)
                  }
               console.log(images)
             
             })
}

module.exports.deleteArticles = (id) => {
           article.deleteMany({userId : id}, (err) =>{
               if(err) return "error"
               return "ok"
           })
}

module.exports.hashWithbycrpt = (res,password) => {

    try {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt)
                 
        return hash

    } catch (error) {
        res.status(400).json({message : error.message})
    }
               

}