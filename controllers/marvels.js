var express = require('express');
var Marvel = require('../models/marvel');
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    // var randomNumber = Math.floor(Math.random() * (70 - 1 + 1)) + 1
    // console.log(randomNumber)
    // when i go to /api/marvels?name='wolverine' do this
    // console.log(req.query)
    if (req.query.name) {
      var query = Marvel.find(
        {'name': { "$regex": req.query.name, "$options":"i"}
      });

      query.find(function(err, marvels) {
        if (err) return res.status(500).send(err);
        res.send(marvels);
      });
    } else {
      // else when I got to /api/marvels do this
      var randomNumber = Math.random() * 1042;
      var query = Marvel.find().skip(randomNumber).limit(21);
      query.find(function(err, marvels) {
        if (err) return res.status(500).send(err);
        res.send(marvels);
      });
    }
  })
  .post(function(req, res) {
    Marvel.create(req.body, function(err, marvel) {
      if (err) return res.status(500).send(err);
      res.send(marvel);
    });
  });

router.route('/:id')
  .get(function(req, res) {
    Marvel.findById(req.params.id, function(err, marvel) {
      if (err) return res.status(500).send(err);
      res.send(marvel);
    });
  })
  .put(function(req, res) {
    Marvel.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  })
  .delete(function(req, res) {
    Marvel.findByIdAndRemove(req.params.id, function(err) {
      if (err) return res.status(500).send(err);
      res.send({'message': 'success'});
    });
  });

module.exports = router;
