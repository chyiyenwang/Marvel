var express = require("express");
var app = express();
var mongoose = require("mongoose");
var expressJWT = require("express-jwt");
var jwt = require("jsonwebtoken");
var request = require('request');
var fs = require('fs');
var port = process.env.PORT || 3000;

var secret = "ifyousmellwhattherockiscookin";

var User = require("./models/user");
var Marvel = require('./models/marvel');
mongoose.connect(process.env.MONGOLAB_URI || "mongodb://localhost/marvel");
// var db = mongoose.connection


var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var path = require("path");
app.use(express.static(path.join(__dirname, "public")));
// var basename  = path.basename(module.filename);

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

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.listen(port, function() {
  console.log("I have " + port + " pokemon");
});