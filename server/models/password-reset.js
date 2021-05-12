const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema =  mongoose.Schema;

const passwordResetSchema = new Schema ({
    email: {type:String, required:true},
    token : {type:String, required:true},
})

module.exports = mongoose.model("passReset" , passwordResetSchema);