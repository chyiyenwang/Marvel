var express = require("express");
var app = express();
var mongoose = require("mongoose");
var expressJWT = require("express-jwt");
var jwt = require("jsonwebtoken");
var request = require('request');
var Twit = require('twit');
var server = app.listen(3030);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;


var twitter = new Twit({
  consumer_key:         process.env.TWIT_CONSUMER_KEY,
  consumer_secret:      process.env.TWIT_CONSUMER_SECRET,
  access_token:         process.env.TWIT_ACCESS_TOKEN,
  access_token_secret:  process.env.TWIT_ACCESS_TOKEN_SECRET
});

var secret = process.env.SALT;

var User = require("./models/user");
var Marvel = require('./models/marvel');
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/marvel");

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.use('/api/users', expressJWT({secret: secret})
.unless({path: ['/api/users'], method: 'post'}));

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.static(401).send({message: "You need an authorization token to view this information."})
  }
});

app.use("/api/marvels", require("./controllers/marvels"));
app.use("/api/users", require("./controllers/users"));

app.post("/api/auth", function(req, res) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err || !user) return res.send({message: "User not found"});
    user.authenticated(req.body.password, function(err, result) {
      if (err || !result) return res.send({message: "User not authenticated"});

      var token = jwt.sign(user, secret);
      res.send({user: user, token: token});
    });
  });
});



// db.on('error', function(error){console.log(error)})
// db.once('open', function(){
//   console.log('open') 
// })

// fs
//   .readdirSync(__dirname)
//   .filter(function(file) {
//     return (file.indexOf('.') !== 0) && (file !== basename);
//   })
//   .forEach(function(file) {
//     if (file.slice(-3) !== '.js') return;
//     var model = require(path.join(__dirname, file));
//     db[model.modelName] = model;
//   });

// module.exports = db;

// var importData = require('./import/1009157.json')


// app.get('/*', function(req,res){


//   myObject = new Character();

//   myObject = importObject(myObject, importData)
//   myObject.save()
//   res.send(myObject)
  
// })

// function importObject(object,importData){
//     for(var key in importData){
//       console.log(importData[key], key)
//       if(typeof importData[key]==='object'){
//         object[key]=importData[key]
//         object[key] = importObject(object[key], importData[key])
//       }else{
//         object[key] = importData[key]
//       }
//     }
//   return object
// }
// twitter.get('search/tweets', {q: "pikachu", count: 20}, function(err, data, response) {
//   console.log(response);
// })

// io.on('connection', function(socket) {
//   searches[socket.id] = {};
//   socket.on('q', function(q) {

//   var stream = twitter.stream('statusus/filter', {track: })
//   })
// })

// stream.on('tweet', function(tweet) {
//   console.log(tweet);
// })
// twitter.get('search/tweets', { q: '#pikachu', count: 20 }, function(err, data, response) {
//   console.log(data)
// })


// var stream = twitter.stream('statuses/filter', { track: req.body.queryString });
// io.on('connection', function(socket) {
//   // searches[socket.id] = {};
//   // socket.on('q', function(q) {
//   console.log('user connected')
// })

// var stream = twitter.stream('statuses/filter', { track: '', language: 'en' });
// var tweetsBuffer = [];

// stream.on('connect', function(request) {
//     console.log('Connected to Twitter API');
// });
 
// stream.on('disconnect', function(message) {
//     console.log('Disconnected from Twitter API. Message: ' + message);
// });
 
// stream.on('reconnect', function (request, response, connectInterval) {
//   console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
// })
// stream.on('tweet', function(tweet) {
//   var msg = {};
//   msg.text = tweet.text;
//   msg.user = {
//     name: tweet.user.name,
//     image: tweet.user.profile_image_url
//   };
//   console.log(msg);
//   io.sockets.emit('tweets', msg);
// })
io.sockets.on('connection', function(socket) {
  socket.on('setTweet', function(query) {
    twitter.get('search/tweets', { q: query.track + " -RT ", count: 10, lang: 'en' }, function(err, data, response) {
      var msg = {};
      var urlRegex = /(https:\/\/t\.co\/[^\s]*)/g;

      var filtered = data.statuses.map(function(element) {
          // console.log("type: " + element.metadata.result_type + "; count: " + element.retweet_count + ";retweeted? " + element.retweeted);
          msg.text = element.text;
          console.log(element.entities.media);
            if (element.entities.media) {
              msg.url = element.entities.media[0].media_url
            }
            else {
              msg.url = ''
            }
            msg.user = {
              name: element.user.screen_name,
              image: element.user.profile_image_url
            }
        // }
        // console.log(msg.url);
        io.sockets.emit('tweets', msg);
      })
    })
  })
});


// THIS STUFF WORKS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// var nbOpenSockets = 0;
 
// io.sockets.on('connection', function(socket) {

//   socket.on('setTweet', function(data) {
//       console.log("hello", data.track)
//       console.log("I DID STUFF!!")
    
//     if(data.track) {
//       console.log(data.track)
//       stream.stop()
      
//       var stream = twitter.stream('statuses/filter', { track: data.track, language: 'en' });
//       stream.on('connect', function(request) {
//         console.log('Connected to Twitter API');
//       });

//       stream.on('disconnect', function(message) {
//         console.log('Disconnected from Twitter API. Message: ' + message);
//       });

//       stream.on('reconnect', function (request, response, connectInterval) {
//         console.log('Trying to reconnect to Twitter API in ' + connectInterval + ' ms');
//       });
//       stream.on('tweet', function(tweet) {
//         var msg = {};
//         msg.text = tweet.text;
//         msg.user = {
//         name: tweet.user.name,
//         image: tweet.user.profile_image_url
//         };
//         console.log(msg);
//         io.sockets.emit('tweets', msg);
//       });

//     }
//   });

// // This checks to make sure there is a connection, if not, the tweet machine will stop functioning
//   console.log('Client connected !');
//   if (nbOpenSockets <= 0) {
//     nbOpenSockets = 0;
//     console.log('First active client. Start streaming from Twitter');
//     stream.start();
//   }
 
//   nbOpenSockets++;
 
//   socket.on('disconnect', function() {
//     console.log('Client disconnected !');
//     nbOpenSockets--;

//     if (nbOpenSockets <= 0) {
//       nbOpenSockets = 0;
//       console.log("No active client. Stop streaming from Twitter");
//       stream.stop();
//     }
//   });
// });
// END OF THE WORKING STUFF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


// MIGHT BE ABLE TO DELETE THIS STUFF

// io.on('connect', function(socket) {
//   console.log('User connected');
//   var stream = null;
//   socket.on('location', function(newLocation) {
//     if(stream) {
//       stream.stop();
//     }
//     stream = twitter.stream('statuses/filter', { track: 'javascript' });
//     stream.on('tweet', function(tweet) {
//       console.log('Emitting tweet');
//       socket.emit('tweets', tweet);
//     });
//   });
//   socket.on('disconnect', function() {
//     console.log('User disconnected');
//     stream.stop();
//   });
// });

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.listen(port, function() {
  console.log("I have " + port + " comic books");
});