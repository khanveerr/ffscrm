
var routes = require('express').Router();

var inspectionmanager = require('../../../app/models/inspectionModel');


routes.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  // console.log('Call made by-- Prashant Verma');
  next()
});



routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});


// logic for pagination and limit needs to be implemeted
routes.get('/getAllInspections', (req, res) => {
  var keyValueArray = {};
  var searchArr = {}
  var inspection = new inspectionmanager();
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

  inspection.getAllInspection(searchArr,'',orderBy,0,offset,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});

routes.post('/addNewInspection', (req, res) => {
    var inspection = new inspectionmanager();
    var response = {};
    var insertObj = {};

    insertObj = req.body.inspectionData;

    inspection.addNewInspection(insertObj,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});

routes.put('/updateInspection/:id', (req, res) => {
  var id = req.params.id;
  var response = {};
  var whereArr = {};
  var updateVal = {};
  var options = null;
  var inspection = new inspectionmanager();
  if (id != "") {
    whereArr['_id'] = id;
  }

  updateVal = req.body.inspectionData;
  //console.log(updateVal['lead_history']);

  inspection.updateInspection(whereArr,updateVal,options,function(data){
      response  = data;
      res.status(200).json({ message: response });
  })

});


module.exports = routes;