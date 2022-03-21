
var routes = require('express').Router();

var manpowermanager = require('../../../app/models/manpowerModel');


routes.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  // console.log('Call made by-- Prashant Verma');
  next()
});



routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});


// logic for pagination and limit needs to be implemeted
routes.get('/getAllManpower', (req, res) => {
  var keyValueArray = {};
  var searchArr = {}
  var manpower = new manpowermanager();
  var offset =0;
  searchArr = JSON.parse(req.query.data);
  //console.log(searchArr);
  //console.log(searchArr['primary_contact_no']);
  // var service = new servicemanager();
  // var response = {};

  var orderBy = {
    status: 1,
    created_on: 1
  };

  manpower.getAllManpower(searchArr,'',orderBy,0,offset,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});

routes.post('/addNewManpower', (req, res) => {
    var manpower = new manpowermanager();
    var response = {};
    var insertObj = {};

    insertObj = req.body.manpowerData;

    manpower.addNewManpower(insertObj,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});

routes.put('/updateManpower/:id', (req, res) => {
  var id = req.params.id;
  var response = {};
  var whereArr = {};
  var updateVal = {};
  var options = null;
  var manpower = new manpowermanager();
  if (id != "") {
    whereArr['_id'] = id;
  }

  updateVal = req.body.manpowerData;
  //console.log(updateVal['lead_history']);

  manpower.updateManpower(whereArr,updateVal,options,function(data){
      response  = data;
      res.status(200).json({ message: response });
  })

});


routes.delete('/deleteManpower/:id', (req, res) => {
    var manpower = new manpowermanager();
    var id = req.params.id;
    var response = {};
    var deleteArr = {};
    // if (id>0) {
      deleteArr['_id'] = id;
    // }
    // console.log(deleteArr);
    manpower.deleteManpower(deleteArr,function (data) {
      response = data;
      res.status(200).json({ message: response });
    });

  });


module.exports = routes;