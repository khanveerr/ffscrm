
var dbWrapper = require('../../dbWrapper.js');
var db = new dbWrapper();
var servicemanager   = require('../../app/schema/servicemanager');
var ordermanager = require('../../app/schema/ordermanager');
var addressdetail   = require('../../app/schema/addressdetail');
var amcservicemanager = require('../../app/schema/amcservicemanager');

var moment = require('moment');

function ServiceManager(){

}

ServiceManager.prototype.getAllServices = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var queryResult = {};
 db.getPopulatedDatafromCollection(servicemanager,'service_address',keyValueArray,selectColObj,orderBy,limit,offset,callback);
  //   console.log(response);
  // return response;

}

ServiceManager.prototype.getAllServicesOrganic = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var queryResult = {};
  var condition_arr = [];

  console.log("Key Value");
  console.log(keyValueArray);


  if(keyValueArray.hasOwnProperty('city')) {
    condition_arr.push({'city': parseInt(whereArr['city'])});  
  }

  if(keyValueArray.hasOwnProperty('leadsource')) {
    condition_arr.push({'leadsource': whereArr['leadsource']});  
  }

  if(keyValueArray.hasOwnProperty('service_id')) {
    condition_arr.push({'service_id': parseInt(whereArr['service_id'])});  
  }

  if(keyValueArray.hasOwnProperty('created_on')) {
    condition_arr.push({'created_on': whereArr['created_on']});  
  }

  condition_arr.push({ $and: [{ 'leadsource': { '$ne': "70" } }, { 'leadsource': { '$ne': "84" } }] });

  console.log("COndition Arr");
  console.log(condition_arr);
  console.log(condition_arr[0]);
  console.log("COndition Arr End");

 db.getDatafromCollection(servicemanager,{ $and: condition_arr },selectColObj,orderBy,limit,offset,callback);
  //   console.log(response);
  // return response;
}

ServiceManager.prototype.getAllServicesPartner = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var queryResult = {};
  var condition_arr = [];

  if(keyValueArray.hasOwnProperty('city')) {
    condition_arr.push({'city': parseInt(whereArr['city'])});  
  }

  if(keyValueArray.hasOwnProperty('leadsource')) {
    condition_arr.push({'leadsource': parseInt(whereArr['leadsource'])});  
  }

  if(keyValueArray.hasOwnProperty('service_id')) {
    condition_arr.push({'service_id': parseInt(whereArr['service_id'])});  
  }

  condition_arr.push({ $or: [{ 'leadsource': { '$eq': "70" } }, { 'leadsource': { '$eq': "84" } }] });


 db.getDatafromCollection(servicemanager,{ $and: condition_arr },selectColObj,orderBy,limit,offset,callback);
  //   console.log(response);
  // return response;
}

ServiceManager.prototype.getServiceAddress = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var queryResult = {};
 db.getDatafromCollection(addressdetail,keyValueArray,selectColObj,orderBy,limit,offset,callback);
  //   console.log(response);
  // return response;

}

ServiceManager.prototype.updateServiceInfo = function(whereArr,updateVal,options,callback){

  var queryResult = {};
  db.updateDocument(servicemanager,whereArr,updateVal,options,callback);

}

function createAmcServices(serviceObj,callback){

  console.log("inside create amc services");
  console.log(serviceObj);

  var amcserviceArr = [];
  var noOfServices = parseInt(serviceObj.no_of_service);
  console.log(noOfServices);
  var startDate = moment(serviceObj.contract_start_date,'YYYY-MM-DD');
  console.log(startDate);
  var endDate = moment(serviceObj.contract_end_date,'YYYY-MM-DD');
  console.log(endDate);
  var no_of_days = endDate.diff(startDate, 'days');
  console.log(no_of_days);
  var service_day_gap = Math.floor((no_of_days+1)/noOfServices);
  console.log(service_day_gap);
  var amc_is_arr = [];
  var is_first = 0;

  console.log(noOfServices);
  console.log(no_of_days);
  console.log("Service Day Gap");
  console.log(service_day_gap);
  console.log("Frequency");
  console.log(serviceObj['frequency']);

  //moment('2017-02-19').isoWeekday()

  var j=0;

    if(serviceObj['frequency'] == 5) {

      console.log("5 create amc services");

      for (var i = 0; i < (no_of_days+1); i++) {
          var temp = new amcservicemanager();

            var temp_date = moment(serviceObj.contract_start_date,'YYYY-MM-DD');
            console.log(i*service_day_gap);
            console.log(temp_date);

            var new_date = temp_date.add(i, 'days');

            if(moment(new_date).isoWeekday() == 6 || moment(new_date).isoWeekday() == 7) {

            } else {

              temp['amc_id'] = serviceObj['_id'];
              temp['amc_label'] = "AMC Service --" + (j+1);
              temp['service_address'] = serviceObj['service_address'];
              temp['service_id'] = serviceObj['service_id'];
              temp['variant_type_id'] = serviceObj['variant_type_id'];
              temp['service_category_id'] = serviceObj['service_category_id'];
              temp['additional_variant'] =serviceObj['additional_variant'];
              temp['service_date'] = new_date;
              temp['service_time'] = serviceObj['service_time'];
              temp['duration_of_service'] = serviceObj['duration_of_service'];
              temp['no_of_team_leader'] = serviceObj['no_of_team_leader'];
              temp['no_of_supervisor'] = serviceObj['no_of_supervisor'];
              temp['no_of_janitor'] = serviceObj['no_of_janitor'];
              temp['crm_remark'] = serviceObj['crm_remark'];
              temp['ops_remark'] = serviceObj['ops_remark'];
              temp['accounts_remark'] = serviceObj['accounts_remark'];
              temp['service_rating'] = serviceObj['service_rating'];
              temp['crm_rating'] = serviceObj['crm_rating'];
              temp['service_status'] = serviceObj['service_status'];
              temp['is_order'] = serviceObj['is_order'];
              temp['created_by'] = serviceObj['created_by'];
              temp['updated_by'] = serviceObj['updated_by'];
              temp['status'] = serviceObj['status'];
              amcserviceArr.push(temp);
              amc_is_arr.push(temp['_id']);

              j++;

            }

      }

    }

    else if(serviceObj['frequency'] == 6) {

      console.log("6 create amc services");

      for (var i = 0; i < (no_of_days+1); i++) {
          var temp = new amcservicemanager();

            var temp_date = moment(serviceObj.contract_start_date,'YYYY-MM-DD');
            console.log(i*service_day_gap);
            console.log(temp_date);

            var new_date = temp_date.add(i, 'days');

            if(moment(new_date).isoWeekday() == 7) {

            } else {

              temp['amc_id'] = serviceObj['_id'];
              temp['amc_label'] = "AMC Service --" + (j+1);
              temp['service_address'] = serviceObj['service_address'];
              temp['service_id'] = serviceObj['service_id'];
              temp['variant_type_id'] = serviceObj['variant_type_id'];
              temp['service_category_id'] = serviceObj['service_category_id'];
              temp['additional_variant'] =serviceObj['additional_variant'];
              temp['service_date'] = new_date;
              temp['service_time'] = serviceObj['service_time'];
              temp['duration_of_service'] = serviceObj['duration_of_service'];
              temp['no_of_team_leader'] = serviceObj['no_of_team_leader'];
              temp['no_of_supervisor'] = serviceObj['no_of_supervisor'];
              temp['no_of_janitor'] = serviceObj['no_of_janitor'];
              temp['crm_remark'] = serviceObj['crm_remark'];
              temp['ops_remark'] = serviceObj['ops_remark'];
              temp['accounts_remark'] = serviceObj['accounts_remark'];
              temp['service_rating'] = serviceObj['service_rating'];
              temp['crm_rating'] = serviceObj['crm_rating'];
              temp['service_status'] = serviceObj['service_status'];
              temp['is_order'] = serviceObj['is_order'];
              temp['created_by'] = serviceObj['created_by'];
              temp['updated_by'] = serviceObj['updated_by'];
              temp['status'] = serviceObj['status'];
              amcserviceArr.push(temp);
              amc_is_arr.push(temp['_id']);

              j++;

            }

      }

    }

    else if(serviceObj['frequency'] == 2) {

      console.log("2 create amc services");

      for (var i = 0; i < (no_of_days+1); i++) {
          var temp = new amcservicemanager();

            var temp_date = moment(serviceObj.contract_start_date,'YYYY-MM-DD');
            console.log(i*service_day_gap);
            console.log(temp_date);

            var new_date = temp_date.add(i, 'days');

            console.log(moment(new_date).isoWeekday());

            if(moment(new_date).isoWeekday() == 1 || moment(new_date).isoWeekday() == 2 || moment(new_date).isoWeekday() == 3 || moment(new_date).isoWeekday() == 4 || moment(new_date).isoWeekday() == 5) {

            } else {

              temp['amc_id'] = serviceObj['_id'];
              temp['amc_label'] = "AMC Service --" + (j+1);
              temp['service_address'] = serviceObj['service_address'];
              temp['service_id'] = serviceObj['service_id'];
              temp['variant_type_id'] = serviceObj['variant_type_id'];
              temp['service_category_id'] = serviceObj['service_category_id'];
              temp['additional_variant'] =serviceObj['additional_variant'];
              temp['service_date'] = new_date;
              temp['service_time'] = serviceObj['service_time'];
              temp['duration_of_service'] = serviceObj['duration_of_service'];
              temp['no_of_team_leader'] = serviceObj['no_of_team_leader'];
              temp['no_of_supervisor'] = serviceObj['no_of_supervisor'];
              temp['no_of_janitor'] = serviceObj['no_of_janitor'];
              temp['crm_remark'] = serviceObj['crm_remark'];
              temp['ops_remark'] = serviceObj['ops_remark'];
              temp['accounts_remark'] = serviceObj['accounts_remark'];
              temp['service_rating'] = serviceObj['service_rating'];
              temp['crm_rating'] = serviceObj['crm_rating'];
              temp['service_status'] = serviceObj['service_status'];
              temp['is_order'] = serviceObj['is_order'];
              temp['created_by'] = serviceObj['created_by'];
              temp['updated_by'] = serviceObj['updated_by'];
              temp['status'] = serviceObj['status'];
              amcserviceArr.push(temp);
              amc_is_arr.push(temp['_id']);

              j++;

            }

      }

    } else {

      console.log("others create amc services");


      for (var i = 0; i < noOfServices; i++) {
          var temp = new amcservicemanager();

            var temp_date = moment(serviceObj.contract_start_date,'YYYY-MM-DD');
            console.log(i*service_day_gap);
            console.log(temp_date);

            var new_date = temp_date.add(i*service_day_gap, 'days');

            temp['amc_id'] = serviceObj['_id'];
            temp['amc_label'] = "AMC Service --" + (i+1);
            temp['service_address'] = serviceObj['service_address'];
            temp['service_id'] = serviceObj['service_id'];
            temp['variant_type_id'] = serviceObj['variant_type_id'];
            temp['service_category_id'] = serviceObj['service_category_id'];
            temp['additional_variant'] =serviceObj['additional_variant'];
            temp['service_date'] = new_date;
            temp['service_time'] = serviceObj['service_time'];
            temp['duration_of_service'] = serviceObj['duration_of_service'];
            temp['no_of_team_leader'] = serviceObj['no_of_team_leader'];
            temp['no_of_supervisor'] = serviceObj['no_of_supervisor'];
            temp['no_of_janitor'] = serviceObj['no_of_janitor'];
            temp['crm_remark'] = serviceObj['crm_remark'];
            temp['ops_remark'] = serviceObj['ops_remark'];
            temp['accounts_remark'] = serviceObj['accounts_remark'];
            temp['service_rating'] = serviceObj['service_rating'];
            temp['crm_rating'] = serviceObj['crm_rating'];
            temp['service_status'] = serviceObj['service_status'];
            temp['is_order'] = serviceObj['is_order'];
            temp['created_by'] = serviceObj['created_by'];
            temp['updated_by'] = serviceObj['updated_by'];
            temp['status'] = serviceObj['status'];
            amcserviceArr.push(temp);
            amc_is_arr.push(temp['_id']);

      }



    }


    amcservicemanager.insertMany(amcserviceArr,function(err,docs){

        if (err) {
          console.log("error create amc services");
          throw err;
        }

        else {
          console.log("callback create amc services");
            //console.log("Amc services Inserted !!!");
            callback({'service':amcserviceArr,'id':amc_is_arr});
        }

    });
      // console.log(amcserviceArr);
      // console.log(amc_is_arr);
}

ServiceManager.prototype.updateServiceLeadStage = function(orderObj,updateVal,callback){

  console.log("Service Manager Model");

  var queryResult = {};
  var whereArr = {};
  var options = null;
  var order_arr = [];
  var amc_order_arr =[];

  whereArr['_id'] = orderObj.service_details;

  if (  orderObj['is_order'] ==1 && orderObj['is_amc']!=1 ) {

    console.log("Not AMC");

    for (var d = 0; d < orderObj['duration_of_service'].length; d++) {

      var ordermanagerdetail = new ordermanager();

      ordermanagerdetail.service_details = orderObj.service_details;
      ordermanagerdetail.leadmanager_details = orderObj.leadmanager_details;
      ordermanagerdetail.client_details = orderObj.client_details;
      ordermanagerdetail.address_details = orderObj.address_details;

      ordermanagerdetail.firstname = orderObj.firstname;
      ordermanagerdetail.primary_contact_no = orderObj.primary_contact_no;
      ordermanagerdetail.primary_email_id = orderObj.primary_email_id;
      ordermanagerdetail.address = orderObj.address;
      ordermanagerdetail.city = parseInt(orderObj.city);

      ordermanagerdetail.service_obj = orderObj.service_obj;
      ordermanagerdetail.leadmanager_obj = orderObj.leadmanager_obj;
      ordermanagerdetail.service_date = orderObj.service_date;
      ordermanagerdetail.service_time = orderObj.service_time;

      ordermanagerdetail.order_no = (d+1);

      if(orderObj['service_category_id'] == 11) {
        ordermanagerdetail.vendor_allocated = 100;
      }


      order_arr.push(ordermanagerdetail);

    };

  }

  if (orderObj['is_amc']==1) {

    console.log("It Is AMC");
    console.log("called create amc services");

    createAmcServices(orderObj,function(data){

        console.log("Return from create amc services");

        temp_return = data;
        //amcserviceArr[j].push(temp_return.service);
        orderObj.amcservices = temp_return['id'];
        temp_return_amc_arr = temp_return['service'];
        //console.log(temp.amcservices);

        if (orderObj['is_order']==1) {
          for (var k = 0; k < orderObj.amcservices.length; k++) {

              var temp_ordermanagerdetail = new ordermanager();
              temp_ordermanagerdetail.service_details = orderObj['service_details'];
              temp_ordermanagerdetail.leadmanager_details = orderObj['leadmanager_details'];
              temp_ordermanagerdetail.client_details = orderObj['client_details'];
              temp_ordermanagerdetail.address_details = orderObj['address_details'];
              //console.log("Ckeking address");
              //console.log(temp['service_address']);
              temp_ordermanagerdetail.amc_service_details = orderObj.amcservices[k];

              temp_ordermanagerdetail.leadmanager_obj = orderObj.leadmanager_obj;
              temp_ordermanagerdetail.firstname = orderObj.firstname;
              temp_ordermanagerdetail.primary_contact_no = orderObj.primary_contact_no;
              temp_ordermanagerdetail.primary_email_id = orderObj.primary_email_id;
              temp_ordermanagerdetail.address = orderObj.address;
              temp_ordermanagerdetail.city = parseInt(orderObj.city);
              temp_ordermanagerdetail.service_obj = orderObj.service_obj;
              temp_ordermanagerdetail.is_amc = orderObj['is_amc'];
              temp_ordermanagerdetail.service_date = temp_return_amc_arr[k]['service_date'];
              temp_ordermanagerdetail.service_time = temp_return_amc_arr[k]['service_time'];
              temp_ordermanagerdetail.order_no = (k+1);
              if(orderObj['service_category_id'] == 11) {
                temp_ordermanagerdetail.vendor_allocated = 100;
              }

              amc_order_arr.push(temp_ordermanagerdetail);
          }

          ordermanager.insertMany(amc_order_arr,function(err,docs){

              if (err) {
                throw err;
              }

              else {
                  //console.log("Amc Orders Placed !!!");
                  // callback('docs');
              }

          });

        }
          // serviceArr.push(temp);
          j++;
    });

  }


  if (order_arr.length !=0) {

      // console.log("Order Array");
      // console.log(orderarr);

    ordermanager.insertMany(order_arr,function(err,docs){

        if (err) {
          throw err;
        }

        else {
            //console.log("Multi Orders Placed !!!");
            // callback('docs');
        }

    });
  }


  // db.insertDocument(ordermanagerdetail,function(data){
  //     if (data) {
  //       console.log("Order Placed!!!");
  //     }
  // });

  db.updateDocument(servicemanager,whereArr,updateVal,options,callback);

}

ServiceManager.prototype.addNewService = function(newClientObj,callback){

  var queryResult = {};
  var insertObj = new servicemanager(newClientObj);
  db.insertDocument(insertObj,callback);

}

ServiceManager.prototype.deleteServiceInfo = function(deleteArr,callback){

  var queryResult = {};
  db.deleteDocument(servicemanager,deleteArr,callback);
}


// MhcClient.prototype.upd


module.exports = ServiceManager;
