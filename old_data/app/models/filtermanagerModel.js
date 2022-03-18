
var dbWrapper = require('../../dbWrapper.js');
var db = new dbWrapper();
var leadmanager   = require('../../app/schema/leadmanager');
var servicemanager = require('../../app/schema/servicemanager');
var amcservicemanager = require('../../app/schema/amcservicemanager');
var ordermanager = require('../../app/schema/ordermanager');
var clientmanager = require('../../app/schema/mhc-client');
var mongoose   = require('mongoose');

var moment = require('moment');


function FilterManager(){


}


FilterManager.prototype.masterFiltermanager = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){
  var client_details_match = {};
  var service_detial_match = {};
  var lead_detail_match = {};
  var order_detail_match = {};
  var amc_detail_match = {};

  //console.log(keyValueArray);

  if (keyValueArray.hasOwnProperty('name')) {
    client_details_match['firstname'] = {'$regex': keyValueArray['name'], $options: 'i'};
    //client_details_match['lastname'] = {'$regex': keyValueArray['name'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('primary_contact_no')) {
      client_details_match['primary_contact_no'] = {'$regex': keyValueArray['primary_contact_no'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('lead_stage')) {
      service_detial_match['lead_history.lead_stage'] = keyValueArray['lead_stage'];
  }

  if (keyValueArray.hasOwnProperty('variant_type_id')) {
      service_detial_match['variant_type_id'] = keyValueArray['variant_type_id'];
  }

  if (keyValueArray.hasOwnProperty('service_id')) {
      service_detial_match['service_id'] = keyValueArray['service_id'];
  }

  if (keyValueArray.hasOwnProperty('from_inquiry_date')) {
      service_detial_match['service_date'] = {"$gte": keyValueArray['from_inquiry_date'], "$lte": keyValueArray['to_inquiry_date']};
      amc_detial_match['service_date'] = {"$gte": keyValueArray['from_inquiry_date'], "$lte": keyValueArray['to_inquiry_date']};
  }


  if (keyValueArray.hasOwnProperty('leadsource')) {
      lead_detail_match['leadsource'] = parseInt(keyValueArray['leadsource']);
  }

  if (keyValueArray.hasOwnProperty('vendor_allocated')) {
      order_detail_match['vendor_allocated'] = keyValueArray['vendor_allocated'];
  }
  if (keyValueArray.hasOwnProperty('payment_status')) {
      order_detail_match['payment_status'] = keyValueArray['payment_status'];
  }
  if (keyValueArray.hasOwnProperty('supervisor_name')) {
      order_detail_match['supervisor_name'] ={ "$in" : [keyValueArray['supervisor_name']] } ;
  }
  if (keyValueArray.hasOwnProperty('team_leader_name')) {
      order_detail_match['team_leader_name'] ={ "$in" : [keyValueArray['team_leader_name']] } ;
  }
  if (keyValueArray.hasOwnProperty('janitor_name')) {
      order_detail_match['janitor_name'] ={ "$in" : [keyValueArray['janitor_name']] } ;
  }

  if (keyValueArray.hasOwnProperty('city')) {
    lead_detail_match['city'] = parseInt(keyValueArray['city']);
  }


  if (keyValueArray['isCallFromLead']==1) {
    var populate_obj = 'client_details service_obj service_obj.amcservices';
    leadmasterfiltercall(client_details_match,service_detial_match,amc_detail_match,order_detail_match,lead_detail_match,orderBy,limit,offset,function(leadFilterId){
      //console.log(leadFilterId);
      db.getPopulatedDatafromCollection(leadmanager,populate_obj,{'_id':{$in:leadFilterId}},selectColObj,orderBy,limit,offset,callback);

    })
  }
  else{
    var populate_obj = 'client_details service_details amc_service_details leadmanager_details address_details';
    ordermasterfiltercall(client_details_match,service_detial_match,amc_detail_match,order_detail_match,lead_detail_match,function(orderFilterId){

      db.getPopulatedDatafromCollection(leadmanager,populate_obj,{'_id':{$in:orderFilterId}},selectColObj,orderBy,limit,offset,callback);
    })
  }


}

function leadmasterfiltercall(clientfiltearr,servicefilterarr,amcfilterarr,orderfilterarr,leadfilterarr,orderBy,limit,offset,callback){

    console.log("In Lead");

    // filterleadamccollection(amcfilterarr,orderBy,limit,offset,function(amcId){
    //       if (amcId.length > 0) {
    //         var unique = {};
    //         var distinct = [];
    //             for( var i in amcId ){
    //              if( typeof(unique[amcId[i].amc_id]) == "undefined"){
    //               distinct.push(unique[i].amc_id);
    //              }
    //              unique[unique[i].amc_id] = 0;
    //             }
    //         servicefilterarr['_id'] = distinct;
    //       }
      filterservicecollection(servicefilterarr,orderBy,limit,offset,function(serviceId){

        if (serviceId.length > 0) {
            leadfilterarr['service_obj'] = {$in : serviceId};
        }
        filterclientcollection(clientfiltearr,orderBy,limit,offset,function(clientId){
          if (clientId.length > 0) {
            leadfilterarr['client_details'] = {$in:clientId};
          }
          filterleadcollection(leadfilterarr,orderBy,limit,offset,function(leadId){
            if (leadId.length > 0) {
              callback(leadId);
            }
          })
        })
      })
    //})

}

function ordermasterfiltercall(clientfiltearr,servicefilterarr,amcfilterarr,orderfilterarr,leadfilterarr,orderBy,limit,offset,callback){

  var andarr = [];
  var orarr = [];

      filterservicecollection(servicefilterarr,orderBy,limit,offset,function(serviceId){
        if (serviceId) {
            orderfilterarr['service_obj'] = {$in : serviceId};
        }
        filterclientcollection(clientfiltearr,orderBy,limit,offset,function(clientId){
          if (clientId) {
            orderfilterarr['client_details'] = {$in:clientId};
          }

          filterleadcollection(leadfilterarr,orderBy,limit,offset,function(leadId){
            if (leadId) {
              orderfilterarr['leadmanager_details'] = {$in:leadId};
            }
          filterordercollection(orderfilterarr,orderBy,limit,offset,function(orderId){
            if (orderId) {
              callback(orderId);
            }
          })
        })
      })
    })

}

function filterleadamccollection(filterarr,orderBy,limit,offset,callback){
  var selectColObj = 'amc_id';
  db.getDatafromCollection(amcservicemanager,filterarr,selectColObj,orderBy,limit,offset,callback);
}

function filteramccollection(filterarr,orderBy,limit,offset,callback){
  var selectColObj = '_id';
  db.getDatafromCollection(amcservicemanager,filterarr,selectColObj,orderBy,limit,offset,callback);
}

function filterservicecollection(filterarr,orderBy,limit,offset,callback){
  var selectColObj = '_id';
  db.getDatafromCollection(servicemanager,filterarr,selectColObj,orderBy,limit,offset,callback);
}

function filterclientcollection(filterarr,orderBy,limit,offset,callback){
  var selectColObj = '_id';
  db.getDatafromCollection(amcservicemanager,filterarr,selectColObj,orderBy,limit,offset,callback);
}

function filterleadcollection(filterarr,orderBy,limit,offset,callback){
  var selectColObj = '_id';
  //console.log(filterarr);
  db.getDatafromCollection(leadmanager,filterarr,selectColObj,orderBy,limit,offset,callback);
}

function filterordercollection(filterarr,orderBy,limit,offset,callback){
  var selectColObj = '_id';
  db.getDatafromCollection(ordermanager,filterarr,selectColObj,orderBy,limit,offset,callback);
}

module.exports = FilterManager;