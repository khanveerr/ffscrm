
var routes = require('express').Router();

var feedbackmanager = require('../../../app/models/feedbackModel');


routes.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  // console.log('Call made by-- Prashant Verma');
  next()
});



routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});


// logic for pagination and limit needs to be implemeted
routes.get('/getAllFeedback', (req, res) => {
  var keyValueArray = {};
  var searchArr = {}
  var feedback = new feedbackmanager();
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

  feedback.getAllFeedback(searchArr,'',orderBy,0,offset,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});

routes.post('/addNewFeedback', (req, res) => {
    var feedback = new feedbackmanager();
    var response = {};
    var insertObj = {};

    insertObj = req.body.feedbackData;

    feedback.addNewFeedback(insertObj,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});

// routes.put('/updateInspection/:id', (req, res) => {
//   var id = req.params.id;
//   var response = {};
//   var whereArr = {};
//   var updateVal = {};
//   var options = null;
//   var inspection = new inspectionmanager();
//   if (id != "") {
//     whereArr['_id'] = id;
//   }

//   updateVal = req.body.inspectionData;
//   //console.log(updateVal['lead_history']);

//   inspection.updateInspection(whereArr,updateVal,options,function(data){
//       response  = data;
//       res.status(200).json({ message: response });
//   })

// });


module.exports = routes;