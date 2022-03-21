
var routes = require('express').Router();
//var unserialize=require("php-serialization").unserialize;
var PHPUnserialize = require('php-unserialize');
var mhcclient = require('../../../app/models/mhcclientModel');
var cache = require('../../../config/cache');




routes.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  // console.log('Call made by-- Prashant Verma');
  next()
});



routes.get('/', (req, res) => {
  res.status(200).jsonp({ message: 'Connected!' });
});

// logic for pagination and limit needs to be implemeted
routes.get('/get', (req, res) => {
  var searchArr = {};
  var keys = [];
  searchArr = JSON.parse(req.query.data);

    keys = searchArr['key'];

  cache.getMulti(keys, function(error, result){
    for(var mykey in result ){
      if (result.hasOwnProperty(mykey)) {
        result[mykey] = PHPUnserialize.unserialize(result[mykey]);
      };
    }
    //console.log(result);
  res.status(200).json({ message: result });
  });


});

routes.post('/set', (req, res) => {

    var resObj = {};
    var key = '';
    var value = '';

    resObj = req.body.data;
    key = resObj['key'];
    value = resObj['value'];
    cache.set(key, value, function(error, result){
    res.status(200).json({ message: result });
    });
});


module.exports = routes;
