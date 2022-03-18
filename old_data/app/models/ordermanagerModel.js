1
var dbWrapper = require('../../dbWrapper.js');
var db = new dbWrapper();
var leadmanager   = require('../../app/schema/leadmanager');
var servicemanager = require('../../app/schema/servicemanager');
var amcservicemanager = require('../../app/schema/amcservicemanager');
var moment = require('moment');
var ordermanager   = require('../../app/schema/ordermanager');
var clientmanager = require('../../app/schema/mhc-client');
var addressmanager = require('../../app/schema/addressdetail');
var inspectionmanager   = require('../../app/schema/inspectionmanager');



function OrderManager(){

}

OrderManager.prototype.getAllOrders = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var queryResult = {};

  var populate_obj = 'client_details service_details amc_service_details leadmanager_details address_details';
  // var populate_obj = [
  //      { path: 'client_details', model: 'Clientdetails'},
  //      { path: 'service_details',model: 'ServiceManager',populate: { path: 'amcservices',model: 'AMCServicemanager' }},
  //      { path: 'leadmanager_details',model: 'leadmanager'},
  //      { path: 'address_details', model: 'Addressdetails'}
  //
  // ];
  // populate_obj = [{path:'clientdetails', select:''}, {path:'movie', select:'director'}];

  db.getPopulatedDatafromCollection(ordermanager,populate_obj,keyValueArray,selectColObj,orderBy,limit,offset,callback);

  //   console.log(response);
  // return response;
}

OrderManager.prototype.filterAllOrders = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  //offset = 0;
  var queryResult = {};
  var order_detail_match = {};

  if (keyValueArray.hasOwnProperty('name')) {
        order_detail_match['firstname'] = {'$regex': keyValueArray['name'], $options: 'i'};
        //client_details_match['lastname'] = {'$regex': keyValueArray['name'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('primary_contact_no')) {
      order_detail_match['primary_contact_no'] = {'$regex': keyValueArray['primary_contact_no'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('primary_email_id')) {
      order_detail_match['primary_email_id'] = {'$regex': keyValueArray['primary_email_id'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('variant_type_id')) {
      // order_detail_match['variant_type_id'] = keyValueArray['variant_type_id'];
      order_detail_match['service_obj.variant_type_id'] = keyValueArray['variant_type_id'];
  }

  if (keyValueArray.hasOwnProperty('from_inquiry_date')) {
      //order_detail_match['service_obj.service_date'] = {"$gte": keyValueArray['from_inquiry_date'], "$lte": keyValueArray['to_inquiry_date']};
      order_detail_match['$or'] = [{ 'service_obj.service_date': {"$gte": keyValueArray['from_inquiry_date'], "$lte": keyValueArray['to_inquiry_date']} }, { 'service_date': {"$gte": keyValueArray['from_inquiry_date'], "$lte": keyValueArray['to_inquiry_date']} }];
  }

  if (keyValueArray.hasOwnProperty('not_empty')) {
      //order_detail_match['service_obj.service_date'] = {"$gte": keyValueArray['from_inquiry_date'], "$lte": keyValueArray['to_inquiry_date']};
      order_detail_match['$and'] = [{ '$or': [{'job_start_timestamp': {"$eq": null} }, { 'job_start_timestamp': {"$eq": ""} }] }, { '$or': [{'job_end_timestamp': {"$eq": null} }, { 'job_end_timestamp': {"$eq": ""} }] }];
  }


  if (keyValueArray.hasOwnProperty('leadsource')) {
      order_detail_match['leadmanager_obj.leadsource'] = keyValueArray['leadsource'];
  }

  if (keyValueArray.hasOwnProperty('leadowner')) {
      order_detail_match['leadmanager_obj.leadowner'] = {'$regex': keyValueArray['leadowner'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('service_id')) {
      order_detail_match['service_obj.service_id'] = keyValueArray['service_id'];
  }

  if (keyValueArray.hasOwnProperty('vendor_allocated')) {
      order_detail_match['vendor_allocated'] = keyValueArray['vendor_allocated'];
  }

  if (keyValueArray.hasOwnProperty('payment_status')) {
      order_detail_match['payment_status'] = keyValueArray['payment_status'];
  }

  if (keyValueArray.hasOwnProperty('payment_mode')) {
      order_detail_match['payment_mode'] = keyValueArray['payment_mode'];
  }

  if (keyValueArray.hasOwnProperty('address')) {
      order_detail_match['address'] = {'$regex': keyValueArray['address'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('taxed_cost')) {
      order_detail_match['service_obj.taxed_cost'] = parseInt(keyValueArray['taxed_cost']);
  }

  if (keyValueArray.hasOwnProperty('billing_name')) {
      order_detail_match['leadmanager_obj.billing_name'] = {'$regex': keyValueArray['billing_name'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('billing_address')) {
      order_detail_match['leadmanager_obj.billing_address'] = {'$regex': keyValueArray['billing_address'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('supervisor')) {
      order_detail_match['supervisor_name'] ={ "$in" : [keyValueArray['supervisor']] } ;
  }

  if (keyValueArray.hasOwnProperty('teamleader')) {
      order_detail_match['team_leader_name'] ={ "$in" : [keyValueArray['teamleader']] } ;
  }
 
  if (keyValueArray.hasOwnProperty('janitor')) {
      order_detail_match['janitor_name'] ={ "$in" : [keyValueArray['janitor']] } ;
  }

  if (keyValueArray.hasOwnProperty('city')) {
    order_detail_match['city'] = parseInt(keyValueArray['city']);
  }

  if (keyValueArray.hasOwnProperty('leadid') && keyValueArray['leadid'] != "" && keyValueArray['leadid'] != null && keyValueArray['leadid'] != undefined) {
    order_detail_match['leadmanager_details'] = keyValueArray['leadid'];
  }

  if (keyValueArray.hasOwnProperty('orderid')) {
    order_detail_match['_id'] = keyValueArray['orderid'];
  }

  if (keyValueArray.hasOwnProperty('is_amc')) {
    order_detail_match['is_amc'] = keyValueArray['is_amc'];
  }

  if (keyValueArray.hasOwnProperty('not_amc')) {
    order_detail_match['is_amc'] = { "$ne": keyValueArray['not_amc'] };
  }

  if(keyValueArray.hasOwnProperty('all_status') && keyValueArray['all_status'] == 1) {

  } else {

    if(keyValueArray.hasOwnProperty('status')) {
      order_detail_match['status'] = keyValueArray['status'];
    } else {
      order_detail_match['status'] = 0;    
    }

  }


  //order_detail_match['is_amc'] = { "$ne": 1 };





  // if ((client_details_match != null && client_details_match!= undefined) ||(service_detial_match != null && service_detial_match!= undefined) ) {
   //  var populate_obj = [
   //      { path: 'client_details', model: 'Clientdetails' },
   //      { path: 'service_details', model: 'ServiceManager', populate: { path: 'inspection_reports', model: 'inspectionmanager' }},
   //      { path: 'amc_service_details',model: 'AMCServicemanager'},
   //      { path: 'leadmanager_details', model: 'leadmanager'},
   //      { path: 'address_details', model: 'Addressdetails'},

   // ];
  // }

  // else {
       var populate_obj = 'amc_service_details client_details service_details leadmanager_details address_details';

  // }

  console.log(order_detail_match);
  console.log(orderBy);
  console.log(populate_obj);


  db.getPopulatedDatafromCollection(ordermanager,populate_obj,order_detail_match,selectColObj,orderBy,limit,offset,callback);

  //   console.log(response);
  // return response;
}

OrderManager.prototype.insertOrder = function(orderObj,callback){

  var queryResult = {};
  var insertObj = new ordermanager(orderObj);
  var service_id = insertObj['service_details'];
  var whereArr ={};
  var updateVal = {};
  var options = null;
  whereArr['_id'] = service_id;
  updateVal['is_order'] = 1;
  db.updateDocument(servicemanager,whereArr,updateVal,options,function(data){
      if (data) {
        db.insertDocument(insertObj,callback);
      }
  });


}

OrderManager.prototype.getLatestAMCserviceDetails = function(service_id,callback){
  var keyValueArray = {};
  var selectColObj = {};
  var orderBy = '';
  var limit = 1;
  var offset = '';
  keyValueArray['amc_id'] = service_id;
  keyValueArray['service_date'] ={'$elemMatch':{'$gte': isoDate,'$lt': isoDate}};

  var populate_obj = '';

  db.getPopulatedDatafromCollection(amcservicemanager,populate_obj,keyValueArray,selectColObj,orderBy,limit,offset,callback)
}

OrderManager.prototype.updatedOrder = function(whereArr,updateVal,options,callback){

  var queryResult = {};
  var options = {multi: true};

  db.updateDocument(ordermanager,whereArr,updateVal,options,callback);

}

OrderManager.prototype.deleteOrder = function(deleteArr,callback){

  var queryResult = {};
  db.deleteDocument(ordermanager,deleteArr,callback);


}

OrderManager.prototype.getLatestAMCserviceDetails = function(service_id,callback){

  var keyValueArray = {};
  var selectColObj = {};
  var orderBy = '';
  var limit = 1;
  var offset = '';
  var isoDate = moment().startOf('day');
  keyValueArray['amc_id'] = service_id;
  keyValueArray['service_date'] ={'$elemMatch':{'$gte': isoDate}};

  var populate_obj = '';

  db.getPopulatedDatafromCollection(amcservicemanager,populate_obj,keyValueArray,selectColObj,orderBy,limit,offset,callback);

}

module.exports = OrderManager;
