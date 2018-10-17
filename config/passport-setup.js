const passport = require('passport')


const FacebookStrategy = require('passport-facebook').Strategy

const LocalStrategy = require('passport-local').Strategy;

const GoogleStrategy = require('passport-google-oauth20')

const keys = require('./keys')

const User = require('../models/user')

passport.serializeUser((user,done) => {
  done(null,user.id)
})

passport.deserializeUser((id,done) => {
  User.findById(id).then((user) => {
    done(null,user)
  })
})


var LOCAL_STRATEGY_CONFIG = {
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
};

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
function(email, password, done) {
  process.nextTick(function () {
    User.findOne({ email: email }, function(err, user) {
      if (err) { 
        console.log('Error:', err);
        return done(err); 
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      if (!(user.validPassword(password) == true)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  });
}
));

passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['displayName','email']
  },
  function(accessToken, refreshToken, profile, done) {

    User.findOne({email:profile.emails[0].value}, function(err,user) {
        

      //il n'existe pas
      if (!user) {

        user = new User({
          username:profile.displayName,
          email:profile.emails[0].value,
          photoURL:"http://graph.facebook.com/" + profile.id + "/picture",
  
        })
        user.save(function(err) {
          done(null,user);
        })

      }
      //il existe
      else {
        done(null,user);
      }
    })
  
  }
  
));

passport.use(
    new GoogleStrategy({
        clientID:keys.google.clientID,
        clientSecret:keys.google.clientSecret,
        callbackURL:'/auth/google/redirect',
    },(accessToken,refreshToken,profile,done) => {
      //l'utilisateur existe déjà?
      User.findOne({email:profile.emails[0].value}, function(err,user) {
        

        //il n'existe pas
        if (!user) {

          user = new User({
            username:profile.displayName,
            email:profile.emails[0].value,
            photoURL:profile.photos[0].value
    
          })
          user.save(function(err) {
            done(null,user);
          })

        }
        //il existe
        else {
          done(null,user);
        }
      })
      
    })
)

