
var dbWrapper = require('../../dbWrapper.js');
var db = new dbWrapper();
var amcservicemanager   = require('../../app/schema/amcservicemanager');


function AMCServiceManager(){

}

AMCServiceManager.prototype.getAllAMCServices = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var queryResult = {};

  db.getPopulatedDatafromCollection(amcservicemanager,'service_address',keyValueArray,selectColObj,orderBy,limit,offset,callback);

  //   console.log(response);
  // return response;

}

AMCServiceManager.prototype.updateAMCServiceInfo = function(whereArr,updateVal,options,callback){

  var queryResult = {};
  db.updateDocument(amcservicemanager,whereArr,updateVal,options,callback);

}

AMCServiceManager.prototype.addNewAMCService = function(newClientObj,callback){

  var queryResult = {};
  var insertObj = new amcservicemanager(newClientObj);
  db.insertDocument(insertObj,callback);

}

AMCServiceManager.prototype.deleteAMCServiceInfo = function(deleteArr,callback){

  var queryResult = {};
  db.deleteDocument(amcservicemanager,deleteArr,callback);
}


// MhcClient.prototype.upd


module.exports = AMCServiceManager;
