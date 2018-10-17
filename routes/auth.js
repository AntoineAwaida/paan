const express = require('express')


const router= require('express').Router()

const server = express();
const next = require('next')


const User = require('../models/user')

const dev = process.env.NODE_ENV !== 'production'

const app = next({ dev })

const passport = require('passport');

server.use(passport.session());



app.prepare().then(() => {

    //login
    router.get('/login',(req,res) => {

        if (req.user){
            res.redirect('../');
        }
    
        const page = '/auth/login'
        app.render(req, res,page) 
    
    })

    
    router.get('/local', (req,res) => {
        const actualPage='/auth/local'
        app.render(req,res,actualPage)
    })
    





})
    


//logout
router.get('/logout', (req,res) => {

    if (!req.user){
        res.redirect('/auth/login');
    }
    //avec passeport
    req.logout();
    res.redirect('/');
})

//login avec facebook

router.get('/facebook', passport.authenticate(
    'facebook', {
        scope:['user_friends','email']
    }));

router.get('/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/auth/login'}),
function(req, res) {
    res.redirect('/')
})

//login local

//
router.post('/signin', function(req, res, next) {
    /* look at the 2nd parameter to the below call */
    passport.authenticate('local', {failureFlash: true}, function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.status(200).send("Mauvais utilisateur ou mot de passe.") }
      req.logIn(user, function(err) {
        if (err) { return next(err) }
        return res.status(200).send("connecté.")
      });
    })(req, res, next);
  });



router.post('/signup', function(req,res) {

    let body = req.body,
        email = body.mail,
        password = body.password,
        username = body.username;


    User.findOne({email:email}, function(err,doc){
        if(err) {
            console.log('erreur')
        }
        else {

            if (doc){
                console.log('déjà même adresse email')
            }

            else {

                let user = new User({
                    email:email,
                    password:password,
                    username:username
                });
                console.log(user)
                user.save(function(err){

                    if(err){
                        console.log(err)
                    }

                    else{
                        res.redirect('/')
                    }


                })
               

            }

        }
    })

})


//login avec google
router.get('/google', passport.authenticate(
    'google', {
        scope:['profile','email']
    }
))

//callback route pour google
router.get('/google/redirect', passport.authenticate('google'), (req,res) => {
    res.redirect('/')
})




module.exports = router;