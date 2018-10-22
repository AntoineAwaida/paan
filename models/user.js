const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcrypt');

let UserSchema = new Schema({

    username: {type:String, required:true},
    email: {type:String, required:true},
    password: String,
    photoURL: String,
    admin: {type:Boolean, default:false}

})


UserSchema.pre('save', function(next) {
    let user = this;
    //sel
    if (user.password){
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt) {
            if(err) return next(err);
        
            //hash
            bcrypt.hash(user.password,salt,function(err,hash) {
                if(err) return next(err);
    
                user.password = hash;
                next();
            })
        })


    }

    next();
   
})


UserSchema.methods.validPassword = function(password){

    return bcrypt.compareSync(password, this.password);

}

module.exports = mongoose.model('User',UserSchema);