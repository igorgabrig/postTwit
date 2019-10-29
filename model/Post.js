var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var PostSchema = new Schema(
    {
        post: { 
            type: String,
        },
        remetente:{
            type:mongoose.Schema.Types.ObjectId, ref:'User', required:true
        },
    }
);

module.exports = mongoose.model('Post', PostSchema);