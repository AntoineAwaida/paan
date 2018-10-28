const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const CommentaireSchema = new Schema(
    {
    
        article: {type:String, required:true},
        user: {type:String, required:true},
        content: {type:String, required:true},
        date: {type:Date, default:Date.now}

    }
)


module.exports = mongoose.model('Commentaire', CommentaireSchema);