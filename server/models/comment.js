const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

commentSchema = new Schema({

    text:{ type : String, required: true},
    userId : {type: Schema.Types.ObjectID,ref : 'user',required: true},
    date: { type: Date, required: true},
    articleID:{ type: Schema.Types.ObjectID,ref : 'article',required: true},

})

module.exports = mongoose.model("comment" , commentSchema);

