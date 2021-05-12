const User = require('../models/models')
module.exports = function(){
            User.findOne({role: 'admin',},(err, user) => {
                if(err) return console.log(err)

                if(user) return console.log("admin already exists")

                let adminUser = new User({
                            firstName: "admin",
                            lastName : "admin",
                            userName : "admin",
                            email : "admin@example.com",
                            phone : "01910181792",
                            password : "09190181792",
                            role : "admin",
                        }) 
                        adminUser.save((err , user) => {
                             if(err) console.log(err);
                             console.log("admin created")
                        })
     })
}()


        
// let adminUser = new User({
//     firstName: "admin",
//     lastName : "admin",
//     userName : "admin",
//     email : "admin@example.com",
//     phone : "01910181792",
//     password : "09190181792",
//     role : "admin",
//  }) 