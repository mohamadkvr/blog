const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const textSchema = new Schema({
    text1:{type:String}
})

articleSchema = new Schema({
    title: { type: String, required: true},
    text:[textSchema],
    description: { type: String, required: true},
    image: [ {type: String,required: true}],
    userId : {type: Schema.Types.ObjectID,ref : 'user',required: true},
    date: { type: Date, required: true},
    articleavatar : {type: String, required: true},

})

module.exports = mongoose.model("article" , articleSchema);

