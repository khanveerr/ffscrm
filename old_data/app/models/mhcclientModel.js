
var dbWrapper = require('../../dbWrapper.js');
var db = new dbWrapper();
var mhcclient   = require('../../app/schema/mhc-client');
var addressdetail   = require('../../app/schema/addressdetail');


function MhcClient(){

}

MhcClient.prototype.getAllClientsInfo = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var queryResult = {};

  console.log(keyValueArray);

 db.getPopulatedDatafromCollection(mhcclient,'address_details',keyValueArray,selectColObj,orderBy,limit,offset,callback);

  //   console.log(response);
  // return response;

}
MhcClient.prototype.searchClientsInfo = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var queryResult = {};
  var searchArr = {};
  var keys = Object.keys(keyValueArray);
  for (var i = keys.length - 1; i >= 0; i--) {
    //searchArr[keys[i]] = new RegExp('^'+keyValueArray[keys[i]]+'$', "i");
    searchArr[keys[i]] = {'$regex': keyValueArray[keys[i]], $options: 'i'};
  };

  console.log(selectColObj);
  console.log(keyValueArray);
  console.log(searchArr);
  console.log(keys);

 db.getPopulatedDatafromCollection(mhcclient,'address_details',searchArr,selectColObj,orderBy,limit,offset,callback);

  //   console.log(response);
  // return response;

}

MhcClient.prototype.updateClientInfo = function(whereArr,updateVal,options,callback){

  var queryResult = {};
  db.updateDocument(mhcclient,whereArr,updateVal,options,callback);

}

MhcClient.prototype.updateaddressInfo = function(whereArr,updateVal,options,callback){

  var queryResult = {};
  db.updateDocument(addressdetail,whereArr,updateVal,options,callback);

}

MhcClient.prototype.addNewClient = function(newClientObj,callback){

  var queryResult = {};
  console.log("Hi");
  console.log(newClientObj);
  var insertObj = new mhcclient(newClientObj.clientdetails);
  var childObj  = {};
  if (newClientObj.hasOwnProperty('addressdetails')) {
    childObj  = new addressdetail(newClientObj.addressdetails);
    db.insertAssociateDocument(insertObj,childObj,callback);
  } else {
    db.insertDocument(insertObj,callback);
  }


  // console.log(insertObj);
  // console.log(childObj);

  //db.insertAssociateDocument(insertObj,childObj,callback);

}

MhcClient.prototype.deleteClientInfo = function(deleteArr,callback){

  var queryResult = {};
  db.deleteDocument(mhcclient,deleteArr,callback);
}


MhcClient.prototype.addClientAddress = function(whereArr,updateVal,existing_address,options,callback){
 var insertObj = new addressdetail(updateVal);
 var client_update = {};
 db.insertDocument(insertObj,function(data){

     if (data) {
      //console.log(data);
       existing_address.push(data['_id']);
       client_update['address_details'] = existing_address;
       db.updateDocument(mhcclient,whereArr,client_update,options,function(data){
        if(data) {

          data.resp = insertObj;

          callback(data);
        }
       });
     }

     else {
       callback("Address Not Inserted");
     }

 });
}


MhcClient.prototype.updateAddressInfo = function(whereArr,updateVal,options,callback){

  var queryResult = {};
  //db.updateDocument(addressdetail,whereArr,updateVal,options,callback);
  db.updateDocument(addressdetail,whereArr,updateVal,options,function(data){
    if (data) {
      updateVal['_id'] = whereArr['_id'];
      data.resp = updateVal;
      callback(data);
    } else {
      callback("Address Not Updated");
    }

  });

}


// MhcClient.prototype.upd


module.exports = MhcClient;
