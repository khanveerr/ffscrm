var dbWrapper = require('../../dbWrapper.js');
var db = new dbWrapper();
var feedbackmanager   = require('../../app/schema/feedbackmanager');
var clientmanager = require('../../app/schema/mhc-client');
var orderDetail = require('../schema/ordermanager');

function FeedbackManager(){

}

FeedbackManager.prototype.getAllFeedback = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var queryResult = {};

  // var populate_obj = 'client_details service_details leadmanager_details address_details';
  var populate_obj = [
       { path: 'client_details', model: 'Clientdetails'},
       { path: 'order_details', model: 'ordermanager'}
  ];
  // populate_obj = [{path:'clientdetails', select:''}, {path:'movie', select:'director'}];

  db.getPopulatedDatafromCollection(feedbackmanager,populate_obj,keyValueArray,selectColObj,orderBy,limit,offset,callback);

  //   console.log(response);
  // return response;
}


FeedbackManager.prototype.addNewFeedback = function(feedbackObj,callback){

  var queryResult = {};
  var insertObj = new feedbackmanager(feedbackObj);
  db.insertDocument(insertObj,callback);

}

// InspectionManager.prototype.updateInspection = function(whereArr,updateVal,options,callback){

//   var queryResult = {};
//   db.updateDocument(inspectionmanager,whereArr,updateVal,options,callback);

// }


// InspectionManager.prototype.addInspections = function(inspectionObjArr,callback){

//   var queryResult = {};
//   var inspection_arr = [];

//   for (var i = 0; i < inspectionObjArr.length; i++) {
//     var inspectionObj = new inspectionmanager(inspectionObjArr[i]);
//     inspection_arr.push(inspectionObj);
//   };

//   if(inspection_arr.length > 0) {
//     inspectionmanager.insertMany(inspection_arr,function(err,docs){

//         if (err) {
//           throw err;
//         }

//         else {
//             console.log("Multi Inspection Added !!!");
//             // callback('docs');
//         }

//     });
//   }


  
//   db.insertDocument(insertObj,callback);

// }

module.exports = FeedbackManager;