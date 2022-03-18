var dbWrapper = require('../../dbWrapper.js');
var db = new dbWrapper();
var manpowermanager   = require('../../app/schema/manpowermanager');

function ManpowerManager(){

}

ManpowerManager.prototype.getAllManpower = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var queryResult = {};

  // var populate_obj = 'client_details service_details leadmanager_details address_details';
  // var populate_obj = [
  //      { path: 'client_details', model: 'Clientdetails'},
  //      { path: 'address_details', model: 'Addressdetails'}
  // ];
  // populate_obj = [{path:'clientdetails', select:''}, {path:'movie', select:'director'}];

  // db.getPopulatedDatafromCollection(inspectionmanager,populate_obj,keyValueArray,selectColObj,orderBy,limit,offset,callback);
  db.getDatafromCollection(manpowermanager,keyValueArray,selectColObj,orderBy,limit,offset,callback);

  //   console.log(response);
  // return response;
}


ManpowerManager.prototype.addNewManpower = function(inspectionObj,callback){

  var queryResult = {};
  var insertObj = new manpowermanager(inspectionObj);
  db.insertDocument(insertObj,callback);

}

ManpowerManager.prototype.updateManpower = function(whereArr,updateVal,options,callback){

  var queryResult = {};
  db.updateDocument(manpowermanager,whereArr,updateVal,options,callback);

}


ManpowerManager.prototype.deleteManpower = function(deleteArr,callback){

  var queryResult = {};
  db.deleteDocument(manpowermanager,deleteArr,callback);
}

module.exports = ManpowerManager;