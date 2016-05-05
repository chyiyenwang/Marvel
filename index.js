var express = require("express");
var app = express();
var mongoose = require("mongoose");
var expressJWT = require("express-jwt");
var jwt = require("jsonwebtoken");
var request = require('request');
var Twit = require('twit');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
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
        io.sockets.emit('tweets', msg);
      })
    })
  })
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


server.listen(port, function() {
  console.log("I have " + port + " comic books");
});