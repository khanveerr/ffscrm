var mysql = require("mysql");

var dbWrapper = require('../dbWrapper.js');
var db = new dbWrapper();
var leadmanager   = require('../app/schema/leadmanager');
var addressmanager   = require('../app/schema/addressdetail');
var clientmanager   = require('../app/schema/mhc-client');
var servicemanager = require('../app/schema/servicemanager');
var amcservicemanager = require('../app/schema/amcservicemanager');
var ordermanager = require('../app/schema/ordermanager');
var moment = require('moment');


var con = mysql.createConnection({
  host: "localhost",
  user: "mhcdbuser",
  password: "mhc123",
  database : 'mhc'
});


function  exportdata (){


}

exportdata.prototype.clientdata = function(callback){

var qryString = "SELECT * from `mhcclient`where client_mobile_no !='' GROUP BY client_mobile_no";
var clientmongoArr = [];
var addressmongoArr = [];
var clientmongosqlmap = {};
var addressMongoSqlmap ={};
var cityMongoSqlmap ={};
con.query(qryString,function(err,rows){
  if (rows) {
    for (var i = 0; i <rows.length; i++) {
      var addressObj = new addressmanager();
      var clientObj = new clientmanager();
      var clientsqlObj = {};
        clientsqlObj = rows[i];

        addressObj['address'] = clientsqlObj['address'];
        addressObj['landmark'] = clientsqlObj['landmark'];
        addressObj['location'] = clientsqlObj['location'];
        addressObj['city'] = clientsqlObj['city'];
        addressObj['pincode'] = clientsqlObj['pincode'];
        addressObj['is_primary'] = clientObj['is_primary'];

        if (clientsqlObj['client_firstname']!=null && clientsqlObj['client_firstname']!='') {
            clientObj['firstname'] = clientsqlObj['client_firstname'];
        }
        if (clientsqlObj['client_lastname']!=null && clientsqlObj['client_lastname']!='') {
            clientObj['lastname'] = clientsqlObj['client_lastname'];
        }
        if (clientsqlObj['client_mobile_no']!=null && clientsqlObj['client_mobile_no']!='') {
            clientObj['primary_contact_no'] = clientsqlObj['client_mobile_no'];
        }

        if (clientsqlObj['alternate_no']!=null) {
          clientObj['alternate_contact_no'] = [clientsqlObj['alternate_no']];
        }

        if (clientsqlObj['client_email_id']!=null && clientsqlObj['client_email_id']!='') {
            clientObj['primary_email_id'] = clientsqlObj['client_email_id'];
        }


        clientObj['address_details'] = [addressObj['_id']];
        cityMongoSqlmap[clientObj['_id']] = clientsqlObj['city'];
        clientmongosqlmap[clientsqlObj['id']] = clientObj['_id'];
        addressMongoSqlmap[clientObj['_id']] = addressObj['_id'];

        clientmongoArr.push(clientObj);
        addressmongoArr.push(addressObj);

    }
  }
    // console.log(clientmongoArr[0]);

    addressmanager.insertMany(addressmongoArr,function(err,docs){

        if (err) {
          throw err;
        }

        else {
          clientmanager.insertMany(clientmongoArr,function(err1,docs){

              if (err1) {
                console.log(err1);
              }

              else {

                callback({
                  'idmap' : clientmongosqlmap,
                  'citymap' : cityMongoSqlmap,
                  'addressmap' : addressMongoSqlmap

                });
              }

          });
        }

    });


});




}




exportdata.prototype.leaddata = function(callback){
  var serviceqryString = "Select * from `service` where is_amc !=1 and lead_stage!=17"; // this query is for filling services which are not closed
  var leadqryString = "Select * from `leadmanager` where insert_date >= Date('2016-09-01')";  // all leads without amc
  var orderqryString = "Select `order`.*,service.varianttype_id,service.sqft from `order` join service on(service.leadmanager_id = `order`.leadmanager_id and service.service_inquiry = `order`.service) where `order`.is_amc = 0 and `order`.insert_date >= Date('2016-09-01')";  // closed order/service query
  var servicemongoArr = [];
  var leadmongoArr = [];
  var finalleadmongoArr = [];
  var ordermongoArr = [];
  var exportObj = new exportdata();
  var clientidmap = {};
  var cityidmap = {};
  var addressidmap ={};
  var leadmongosqlidmap ={};
  var leadidmap = {};
  var dataLead =[];
  var dataService = [];
  var dataOrder =[];
  var leadaddressmap = {};
  var leadservicemap =[];
  var orderObjmap = {};
  var serviceObjmap ={};
  var serviceidMap = {};




  exportObj.clientdata(function(data){
    if (data) {
      clientidmap =data['idmap'];
      addressidmap = data['addressmap'];
      cityidmap = data['citymap'];

      //console.log(addressidmap);
      con.query(orderqryString,function(err,orderows){
        console.log(err);
        if (orderows) {

            dataOrder = orderows;
            console.log(dataOrder[0]);
          con.query(serviceqryString,function(err,rows){
              // console.log(err);
            if (rows) {
              dataService = rows;
              // console.log(dataService[0]);
              con.query(leadqryString,function(err,leadrows){
                console.log(err);
                  if (leadrows) {
                    dataLead = leadrows;
                    for (var i = 0; i < dataLead.length; i++) {
                      var leadsqlObj ={};
                      var leadObj = new leadmanager();
                      leadsqlObj = dataLead[i];

                      leadObj['client_details'] = clientidmap[leadsqlObj['mhcclient_id']];
                      leadObj['followup_by'] = leadsqlObj['followup_by'];
                      leadObj['leadsource'] = leadsqlObj['lead_source'];
                      leadObj['leadowner'] = leadsqlObj['lead_owner'];
                      leadObj['city'] = cityidmap[leadObj['client_details']];
                      leadaddressmap[leadObj['_id']] = addressidmap[leadObj['client_details']];
                      leadObj['reminder'] = leadsqlObj['reminder'];
                      leadObj['invoice_mode'] = leadsqlObj['invoice_mode'];
                      leadObj['invoice_type'] = leadsqlObj['invoice_type'];
                      leadObj['created_on'] = leadsqlObj['insert_date'];
                      leadObj['updated_on'] = leadsqlObj['update_date'];
                      leadObj['created_by'] = leadsqlObj['author_name'];
                      leadObj['status'] = leadsqlObj['status'];
                      leadObj['last_updated_by'] = leadsqlObj['update_date'];

                      leadservicemap[leadsqlObj['id']] = leadObj;
                      leadmongosqlidmap[leadObj['_id']] = leadsqlObj['id'];
                      leadidmap[leadsqlObj['id']] = leadObj['_id'];
                      leadmongoArr.push(leadObj);
                      // console.log(leadObj);


                    }
                    // console.log(leadservicemap);
                  }
                  console.log(dataOrder[0]);
                for (var i = 0; i < dataOrder.length; i++) {
                  var ordersqlObj = {};
                  ordersqlObj = dataOrder[i];
                  var orderObj = new ordermanager();
                  var closedServiceObj = new servicemanager();
                  // console.log(orderObj);

                 closedServiceObj['lead_history'] = [{
                   'lead_stage' : 17,
                   'lead_remark' :"Closed"
                 }];

                 closedServiceObj['service_address'] = leadaddressmap[leadidmap[ordersqlObj['leadmanager_id']]];
                 closedServiceObj['service_id'] = ordersqlObj['service'];
                 // serviceObj['service_category_id'] = ;
                 closedServiceObj['variant_type_id'] = ordersqlObj['varianttype_id'];
                 closedServiceObj['additional_variant'] = ordersqlObj['sqft'];
                 closedServiceObj['service_date'] = ordersqlObj['service_date'];
                 closedServiceObj['service_time'] =ordersqlObj['service_time'] ;
                 //closedServiceObj['duration_of_service'] = ordersqlObj['no_of_service'];
                 closedServiceObj['is_amc'] =ordersqlObj['is_amc']==''?0:0 ;

                 closedServiceObj['no_of_team_leader'] = ordersqlObj['teamleader_deployment'];
                 closedServiceObj['no_of_supervisor'] = ordersqlObj['supervisor_deployment'];
                 closedServiceObj['no_of_janitor'] = ordersqlObj['janitor_deployment'];
                 closedServiceObj['pre_taxed_cost'] = parseFloat((parseInt(ordersqlObj['taxed_cost'])/1.15).toFixed(2));
                 closedServiceObj['taxed_cost'] = ordersqlObj['taxed_cost'];
                 closedServiceObj['client_payment_expected'] = ordersqlObj['client_payment_expected'];
                 closedServiceObj['partner_payment_payable'] = ordersqlObj['partner_payable'];
                 closedServiceObj['partner_payment_recievable'] = ordersqlObj['partner_receivable'];
                 closedServiceObj['discount'] = ordersqlObj['discount'];

                 closedServiceObj['invoice_id'] = ordersqlObj['invoice_id'];
                 closedServiceObj['invoice_sent'] = ordersqlObj['invoice_sent'];
                 closedServiceObj['payment_link_sent'] =  ordersqlObj['payment_link_sent'];
                 closedServiceObj['is_order'] = 1;
                 closedServiceObj['service_status'] =ordersqlObj['job_status'];

                 closedServiceObj['created_on'] = ordersqlObj['insert_date'];
                 closedServiceObj['last_updated_on'] = ordersqlObj['update_date'];
                 closedServiceObj['status'] = ordersqlObj['status'];


                 if ( serviceidMap[ordersqlObj['leadmanager_id']] == undefined ) {
                    // console.log("I am in if");
                     serviceidMap[ordersqlObj['leadmanager_id']] = [];
                 }

                   serviceidMap[ordersqlObj['leadmanager_id']].push(closedServiceObj['_id']);



                //  console.log(serviceidMap);
                //  console.log(serviceidMap[ordersqlObj['leadmanager_id']]);
                 servicemongoArr.push(closedServiceObj);

                  orderObj['leadmanager_details'] = leadidmap[ordersqlObj['leadmanager_id']];
                  orderObj['client_details'] = clientidmap[ordersqlObj['mhcclient_id']];
                  orderObj['address_details'] = leadaddressmap[orderObj['leadmanager_details']];
                  orderObj['service_details'] = closedServiceObj['_id'];
                  orderObj['job_start_timestamp'] =  ordersqlObj['job_start'];
                  orderObj['job_end_timestamp'] = ordersqlObj['job_end'];
                  orderObj['vendor_allocated'] = ordersqlObj['vendor'];
                  orderObj['payment_mode'] = ordersqlObj['payment_mode'];
                  orderObj['payment_status'] = ordersqlObj['payment_status'];
                  orderObj['payment_remark'] = ordersqlObj['payment_remarks'];
                  orderObj['travel_cost'] = ordersqlObj['travel_cost'];
                  orderObj['material_cost'] = ordersqlObj['material_cost'];
                  orderObj['acount_payment_status'] = ordersqlObj['payment_remarks'];
                  orderObj['created_on'] = ordersqlObj['insert_date'];
                  orderObj['last_updated_on'] = ordersqlObj['update_date'];
                  orderObj['status'] = ordersqlObj['status'];

                  ordermongoArr.push(orderObj);

                  if ( orderObjmap[ordersqlObj['leadmanager_id']] == undefined ) {
                      orderObjmap[ordersqlObj['leadmanager_id']] = [];
                  }
                  orderObjmap[ordersqlObj['leadmanager_id']][ordersqlObj['service']] = orderObj;
                  // console.log(orderObjmap[ordersqlObj['leadmanager_id']][ordersqlObj['service']])


                }

                //  console.log(orderObjmap);
                // console.log(servicemongoArr.length);
                console.log(serviceidMap['3920']);

                var array1 = Object.keys(serviceidMap);
                console.log(array1.length);
                for (var i = 0; i < rows.length; i++) {
                  var servicesqlObj = {};
                  var serviceObj = new servicemanager();
                    servicesqlObj = rows[i];

                    // console.log(serviceObj);
                    serviceObj['lead_history'] = [{
                      'lead_stage' : servicesqlObj['lead_stage'],
                      'lead_remark' :servicesqlObj['lead_status']
                    }];

                    serviceObj['service_address'] = leadaddressmap[leadidmap[servicesqlObj['leadmanager_id']]];
                    serviceObj['service_id'] = servicesqlObj['service_inquiry'];
                    // serviceObj['service_category_id'] = ;
                    serviceObj['variant_type_id'] = servicesqlObj['varianttype_id'];
                    serviceObj['additional_variant'] = servicesqlObj['sqft'];
                    serviceObj['service_date'] = servicesqlObj['service_date'];
                    serviceObj['service_time'] =servicesqlObj['service_time'] ;
                    serviceObj['duration_of_service'] = servicesqlObj['no_of_service'];
                    serviceObj['is_amc'] =servicesqlObj['is_amc']==''?0:0 ;

                    serviceObj['no_of_team_leader'] = servicesqlObj['teamleader_deployment'];
                    serviceObj['no_of_supervisor'] = servicesqlObj['supervisor_deployment'];
                    serviceObj['no_of_janitor'] = servicesqlObj['janitor_deployment'];
                    serviceObj['pre_taxed_cost'] = parseFloat((parseInt(servicesqlObj['service_price'])/1.15).toFixed(2));
                    serviceObj['taxed_cost'] = servicesqlObj['service_price'];
                    serviceObj['client_payment_expected'] = servicesqlObj['client_payment_expected'];
                    serviceObj['partner_payment_payable'] = servicesqlObj['partner_payable'];
                    serviceObj['partner_payment_recievable'] = servicesqlObj['partner_receivable'];

                    serviceObj['invoice_sent'] = 0;
                    serviceObj['payment_link_sent'] = 0;
                    serviceObj['is_order'] = 0;
                    serviceObj['service_status'] =0;


                    // serviceObj['created_on'] = leadservicemap[servicesqlObj['leadmanager_id']]['created_on'];
                    // serviceObj['updated_on'] = leadservicemap[servicesqlObj['leadmanager_id']]['updated_on'];
                    serviceObj['created_by'] = serviceObj['author_name'];
                    serviceObj['last_updated_by'] = serviceObj['author_name'];
                    serviceObj['status'] = serviceObj['status'];


                    if ( serviceidMap[servicesqlObj['leadmanager_id']] == undefined ) {
                        serviceidMap[servicesqlObj['leadmanager_id']] = [];
                    }
                      serviceidMap[servicesqlObj['leadmanager_id']].push(serviceObj['_id']);

                    if ( serviceObjmap[servicesqlObj['leadmanager_id']] == undefined ) {
                        serviceObjmap[servicesqlObj['leadmanager_id']] = {};
                    }
                    serviceObjmap[servicesqlObj['leadmanager_id']][serviceObj['service_id']] = serviceObj;

                    servicemongoArr.push(serviceObj);

                }
                console.log("hi");
                console.log(servicemongoArr.length);
                var array2 = Object.keys(serviceidMap);

                console.log(array2.length);
                Array.prototype.diff = function(arr2) {
                    var ret = [];
                    this.sort();
                    arr2.sort();
                    for(var i = 0; i < this.length; i += 1) {
                        if(arr2.indexOf( this[i] ) > -1){
                            ret.push( this[i] );
                        }
                    }
                    return ret;
                };

                // console.log( array1.diff(array2));

                for (var i = 0; i < leadmongoArr.length; i++) {
                  var tempObj = leadmongoArr[i];

                  tempObj['service_obj'] = serviceidMap[leadmongosqlidmap[tempObj['_id']]];
                  // console.log(tempObj['_id']);
                  finalleadmongoArr.push(tempObj);
                }

                  // console.log(finalleadmongoArr);


                  servicemanager.insertMany(servicemongoArr,function(err,docs){

                      if (err) {
                        throw err;
                      }

                      else {
                        leadmanager.insertMany(leadmongoArr,function(err1,docs){

                            if (err1) {
                              console.log(err1);
                            }

                            else {

                              ordermanager.insertMany(ordermongoArr,function(err1,docs){

                                  if (err1) {
                                    console.log(err1);
                                  }

                                  else {
                                      callback("Lead Exported");

                                  }

                              });
                            }

                        });
                      }

                  });



                  });

            }

          });
        }

      });


    }

  });


}
module.exports  =  exportdata;
