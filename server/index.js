


const mongoose = require('mongoose');

const fs = require('fs');

mongoose.Promise = global.Promise;

const passportSetup = require('../config/passport-setup');


/**mongoose.connect('mongodb+srv://test:test1234@paan-a4x6e.gcp.mongodb.net/test?retryWrites=true')
**/
mongoose.connect('mongodb://localhost/paan', {useNewUrlParser: true})
.then(()=> console.log('connexion ok!'))
.catch((err) => console.error(err));




const socket = require('socket.io');

const bodyParser = require('body-parser');

//upload des photos de profil
const multer = require('multer');
const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./static/assets/img/avatars');
  },
  filename: function(req,file,cb) {
    cb(null, req.params.id + '.' + file.mimetype.split('/')[1]);
  }
});

const fileFilter = (req,file,cb) => {
  //rejeter un fichier
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null,true);
  }
  else {
    cb(null,false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 512 * 512 * 5
  },
  fileFilter: fileFilter
});

//models

const User = require('../models/user');
const Review =  require('../models/review');
const ChatMessage = require('../models/chatmessage');
const Image = require('../models/image');
const Commentaire = require('../models/commentaire');



//

const express = require('express')
const next = require('next')

const passport = require('passport');

const keys = require('../config/keys');
const cookieSession = require('cookie-session');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const router = express.Router()

const authRoutes = require('../routes/auth');

const adminRoutes = require('../routes/admin');

const server = express();

const globals = require('../config/globals');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(function(err, req, res, next) {
  console.log(err);
});



app.prepare()
.then(() => {



  server.use(cookieSession({
    maxAge: 15*24*60*60*1000,
    keys: [keys.session.cookieKey]
  }))
  
  server.use(passport.initialize());
  server.use(passport.session());
  

  server.use('/auth',authRoutes);
  server.use('/admin', adminRoutes);

  


  

  

  //
    server.get('/retrieveuser/:id', (req,res) => {

      User.findById(req.params.id, function(err,user){
       
        if(err) return next(err);

        res.json(user);
      })
    })

    server.get('/retrieveusers', (req,res) => {

      User.find((err,users) => {
        if(err) return next(err);
        res.json(users);
      })


    })
    
    server.get('/retrieveuser', (req,res) => {
      if (req.user){
        res.status(200);
      }
      else{
        res.status(204);
      }


      res.send(req.user);
    })


    
    //Reviews api


    server.get('/review',(req,res) => {
        Review.find({},null,{sort:'-date_of_submit'},function(err, reviews) {
            if (err) return next (err);
            res.json(reviews);
        })


    })

    server.get('/article/:id', (req, res) => {
      const actualPage = '/article'
      const queryParams = { id: req.params.id }
      app.render(req, res, actualPage, queryParams)
  })

    server.get('/review/:id', (req,res) => {
      Review.findById(req.params.id, function(err,review){
        if(err) return next(err);

        res.json(review);
      })
    })

    //Upload new password
    server.put('/newpassword/:id', (req,res,err) => {

      User.findById(req.params.id, function(err,user){
        if (err) return next(err);
        user.password = req.body.name;
        user.save();

        return res.status(200).send('Utilisateur bien modifié!');
      })

    })


    //Upload new name
    server.put('/newname/:id', (req,res,err) => {

      User.findById(req.params.id, function(err,user){
        if (err) return next(err);
        if (!req.body.name){
          return res.status(500).send("Pas d'utilisateur renseigné...")
        }
        user.username = req.body.name;
        user.save();

        return res.status(200).send('Utilisateur bien modifié!');
      })

    })

    //Upload profile picture
    server.post('/uploadpp/:id', (req,res,err) => {

      const avatarUpload = upload.single('profilePicture');

      avatarUpload(req, res, function(err) {
        if (err) {
            return res.status(500).send("Erreur au cours de l'envoi de l'image. L'image ne doit pas excéder 512x512 px, et être au format jpeg ou png.");
        }

        User.findById(req.params.id, function(err,user){
          user.photoURL = globals.domain + req.file.path;
          user.save( function(err) {
              if(err) {
                return  res.status(500).send("Erreur lors de la sauvegarde.");
              }

              return res.status(200).send('Profil bien modifié!');
  
          });
        })
      });

      
    })

    //arrêter de suivre un utilisateur 

    server.post('/unfollow', (req,res,err) => {

      User.findById(req.body.follower, function(err,user){

        if(err) return next(err);



      })

      User.findById(req.body.following, function(err,user){
        
        if(err) return next(err);
      })

    })

    //suivre un utilisateur

    server.post('/follow', (req,res,err) => {

     
      User.findById(req.body.follower, function(err,user){
        if(err) return next(err);

      
        if (user.following){
          user.following.push(req.body.following);
        }
        else {
          user.following = new Array(req.body.following);
        }
        user.save( function(err){
          if(err) return next(err);
        });
        
      })

      User.findById(req.body.following, function(err,user){
        if(err) return next(err);

        if (user.followers){
          user.followers.push(req.body.follower);
        }
        else {
          user.followers = new Array(req.body.follower);
        }
        user.save( function(err){
          if(err) return next(err);
        });
        
      })

      return res.status(200).send("Vous avez bien souscrit à cet utilisateur.");


    })

    //Commentaires


      //Retrouver les commentaires

      server.get('/retrievecommentaries/:id', (req,res,err) => {

        Commentaire.find({article:req.params.id},null,{sort:'-date'}, function(err,commentaires){
          if(err) return next(err);

          res.json(commentaires);
        })

      })


      //Ajouter un commentaire

      server.post('/addcommentary', (req,res,err) => {

        let commentaire = new Commentaire(req.body);
        commentaire.save(function(err){
          if(err){
            res.status(500).send(err);
          }
        })
        res.status(200).send("Commentaire bien envoyé.")

        

      })


    //Chat API

    server.post('/addmessage',(req,res,err) => {
      let message = new ChatMessage(req.body);
      message.save(function(err){
        if(err){
          res.status(500)
          throw err
        }
      })
      res.status(200)
    })

    server.get('/getconversationfrom/:from/:to', function(req,res){
      ChatMessage.find({$or: [{from:req.params.to,to:req.params.from},{from:req.params.from,to:req.params.to}]},null, {sort:'date'}, function(err,messages){
        if(err) return next(err);
        
        res.json(messages);
      })
    })

    server.get('/getlastmsgconversation/:from/:to', function(req,res){
      ChatMessage.findOne({$or: [{from:req.params.to,to:req.params.from},{from:req.params.from,to:req.params.to}]},null, {sort:'-date'}, function(err,message){
        if(err) return next(err);
        
        res.json(message);
      })
    })

    server.get('/retrievefromlast/:user', function(req,res){


      
      ChatMessage.aggregate(
        [
            // Matching pipeline, similar to find
            { 
              "$match": { 

                "$or": [
                  {
                    "from":req.params.user
                  }
                ]
                  
              }
            },
            // Sorting pipeline
            { 
                "$sort": { 
                    "date": -1 
                } 
            },
            // Grouping pipeline
            {
                "$group": {
                    "_id": "$to",
                    "from": {
                      "$first": "$from"
                    },
                    "message": {
                        "$first": "$content" 
                    },
                    "date": {
                        "$first": "$date" 
                    }
                }
            },
            // Project pipeline, similar to select
            {
                 "$project": { 
                    "_id": 0,
                    "from":1,
                    "to": "$_id",
                    "message": 1,
                    "date": 1
                }
            }
        ],
        function(err,results) {
            if (err) throw err;
            res.json(results);
        }
    )
  });

    //retrouver les derniers messages d'un utilisateur
    server.get('/retrievelast/:user', function(req,res){


      
      ChatMessage.aggregate(
        [
            // Matching pipeline, similar to find
            { 
              "$match": { 

                "$or": [
                  {
                    "to":req.params.user
                  }
                ]
                  
              }
            },
            // Sorting pipeline
            { 
                "$sort": { 
                    "date": -1 
                } 
            },
            // Grouping pipeline
            {
                "$group": {
                    "_id": "$from",
                    "to": {
                      "$first": "$to"
                    },
                    "message": {
                        "$first": "$content" 
                    },
                    "date": {
                        "$first": "$date" 
                    }
                }
            },
            // Project pipeline, similar to select
            {
                 "$project": { 
                    "_id": 0,
                    "to":1,
                    "from": "$_id",
                    "message": 1,
                    "date": 1
                }
            }
        ],
        function(err,results) {
            if (err) throw err;
            res.json(results);
        }
    )
  });
    

    server.get('/retrieveunread/:user', function(req,res) {
      ChatMessage.find({to:req.params.user,read:false}, function(err,messages){
        if(err) return next(err);

        if(!messages) {return null;}

        res.json(messages);


      })
    })

    server.put('/markconversationasread/:from/:to', function(req,res){
      ChatMessage.find({from:req.params.from,to:req.params.to}, function(err,messages){
        if(err) return next(err);

        if(!messages) {return null ; }

        messages.map((message) => {

          message.read = true;
          message.save( function(err) {
              if(err) {
                  return res.send(500, err);
              }
  
          });


        })

        
      })
      
    })


    //post review


    server.post('/review',(req,res,err) => {
        let review = new Review(req.body);
        review.save(function(err){
          if(err) {
            res.status(500).send('failure')
          }
        })
        res.status(200).send('success')

    })

    server.put('/review/:id', function(req,res) {

  
      if(!req.body) { return res.send(400); } // 6
  
      Review.findById(req.params.id, function(e,data){  
          if(e) { return res.send(500, e); } // 1, 2
  
          if(!data) { return res.send(404); } // 3
  
         data.title = req.body.title;
         data.author = req.body.author;
         data.content = req.body.content; // 4
         data.position = req.body.position;
         data.adress = req.body.adress;
          data.save( function(err) { // 5
              if(err) {
                  return res.send(500, err);
              }
  
              res.json(data);
          });
      });

    })

    server.delete('/review/:id', function (req, res) {

      Review.findByIdAndRemove(req.params.id, function(err) {
        if (err) throw err;
      
      });
      res.status(200).send('success')
    });

  



  server.get('*', (req, res) => {
    return handle(req, res)
  })

  const serv = server.listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })

  
  io = socket(serv);

  io.on('connection', (socket) => {
      console.log(socket.id);

      socket.on('SEND_CHATMESSAGE',function(data){
        io.emit('RECEIVE_CHATMESSAGE',data);
      })


  });

})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
})