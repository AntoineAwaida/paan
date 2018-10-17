var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ChatMessageSchema = new Schema(
    {
        from:{type:String},
        to:{type:String},
        content:{type:String},
        date:{type:Date, default:Date.now},
        read:{type:Boolean,default:false}
    }
)

module.exports = mongoose.model('ChatMessage',ChatMessageSchema);