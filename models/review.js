var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ReviewSchema = new Schema(
    {
        author : {type:String, required:true, max:100},
        title: {type:String, required:true, max:100},
        content: {type:String, required: true},
        date_of_submit: {type: Date, default:Date.now},
        position: {type:Array, required:true},
        adress: {type:String, required:true}
    }
)


ReviewSchema
.virtual('url')
.get(function(){
    return '/review/' + this._id;
})


module.exports = mongoose.model('Review',ReviewSchema);