const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema =  mongoose.Schema;

const userSchema = new Schema ({
    firstName:{type : String, required: true},
    lastName:{type : String, required: true},
    userName:{type : String, required: true,unique: true},
    email:{type : String, required: true, unique: true},
    gender:{type : String, enum : ["male", "female"]},
    phone:{type : String, required: true},
    password:{type:String , required: true},
    role:{type : String,default:"blogger" , enum:["blogger" , "admin"]},
    avatar:{type : String },
})

userSchema.pre("save" , function(next) {
    const user = this;
    if (this.isNew || this.isModified('password')) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);

                user.password = hash;
                return next();

            });
        });
    } else {
        return next();
    };
})

module.exports = mongoose.model("user" , userSchema);

