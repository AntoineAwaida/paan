


const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

const passportSetup = require('../config/passport-setup');


/**mongoose.connect('mongodb+srv://test:test1234@paan-a4x6e.gcp.mongodb.net/test?retryWrites=true')
**/
mongoose.connect('mongodb://localhost/paan', {useNewUrlParser: true})
.then(()=> console.log('connexion ok!'))
.catch((err) => console.error(err));


const upload = require('express-fileupload')


const socket = require('socket.io');

const bodyParser = require('body-parser');

//models
const User = require('../models/user');
const Review =  require('../models/review');
const ChatMessage = require('../models/chatmessage');

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

server.use(upload());
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
        Review.find((err, reviews) => {
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


    server.post('/review/picture', (req, res, err) => {
      console.log(req.files.foo)
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

    //pas fini
    server.get('/retrievelast/:user', function(req,res){

      ChatMessage.aggregate(
        [
            // Matching pipeline, similar to find
            { 
                "$match": { 
                    "to": req.params.user
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


    //


    server.post('/review',(req,res,err) => {
        let review = new Review(req.body);
        review.save(function(err){
          if(err) {
            res.status(500).send('failure')
            throw err
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