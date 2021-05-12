const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect("mongodb://localhost:27017/finallprojectblog" ,{ useUnifiedTopology: true ,useNewUrlParser: true,useCreateIndex: true },(err ) => {
        if (err)  throw err;

        console.log("database connection successfully ");
    })
}