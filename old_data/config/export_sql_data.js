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
        clientmongosqlmap[clientsqlObj['id']] = { '_id': clientObj['_id'], 'firstname': clientObj['firstname'], 'primary_contact_no': clientObj['primary_contact_no'], 'primary_email_id': clientObj['primary_email_id'], 'address': addressObj['address'], 'city': addressObj['city'] };
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
  var serviceqryString = "Select * from `service` where is_amc !=1"; // this query is for filling services which are not closed
  var leadqryString = "Select * from `leadmanager` where insert_date >= Date('2016-09-01')";  // all leads without amc
  var orderqryString = "select `order`.*,service.varianttype_id,service.sqft,service.lead_stage,service.no_of_service from `order` left join service on (`order`.leadmanager_id = service.leadmanager_id and service.service_inquiry = `order`.service)  where `order`.is_amc = '0'";  // closed order/service query
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

      con.query(leadqryString,function(err,leadrows){

        dataLead = leadrows;

        for (var i = 0; i < dataLead.length; i++) {

          var leadsqlObj ={};
          var leadObj = new leadmanager();
          leadsqlObj = dataLead[i];

          if(clientidmap[leadsqlObj['mhcclient_id']] != null) {

            leadObj['client_details'] = clientidmap[leadsqlObj['mhcclient_id']]['_id'];
            leadObj['firstname'] = clientidmap[leadsqlObj['mhcclient_id']]['firstname'];
            leadObj['primary_contact_no'] = clientidmap[leadsqlObj['mhcclient_id']]['primary_contact_no'];
            leadObj['primary_email_id'] = clientidmap[leadsqlObj['mhcclient_id']]['primary_email_id'];
            leadObj['address'] = clientidmap[leadsqlObj['mhcclient_id']]['address'];
            leadObj['city'] = clientidmap[leadsqlObj['mhcclient_id']]['city'];
            leadObj['followup_by'] = leadsqlObj['followup_by'];
            leadObj['leadsource'] = leadsqlObj['lead_source'];
            leadObj['leadowner'] = leadsqlObj['lead_owner'];
            leadObj['city'] = cityidmap[leadObj['client_details']];
            leadObj['reminder'] = leadsqlObj['reminder'];
            leadObj['invoice_mode'] = leadsqlObj['invoice_mode'];
            leadObj['invoice_type'] = leadsqlObj['invoice_type'];
            leadObj['created_on'] = leadsqlObj['insert_date'];
            leadObj['updated_on'] = leadsqlObj['update_date'];
            leadObj['created_by'] = leadsqlObj['author_name'];
            leadObj['status'] = leadsqlObj['status'];
            leadObj['last_updated_by'] = leadsqlObj['update_date'];

            console.log(orderqryString + ' and `order`.leadmanager_id=' + leadsqlObj['id']);



            (function(clientidmap,addressidmap,cityidmap,leadObj,leadsqlObj){

              con.query(serviceqryString + ' and leadmanager_id=' + leadsqlObj['id'],function(err,servicerows){

                // service loop start
                  var service_id_arr = [];
                  var service_obj_arr = [];

                for (var t = 0; t < servicerows.length; t++) {

                  console.log((t+1) + " Service");

                  var servicesqlObj = {};
                  var serviceObj = new servicemanager();
                  servicesqlObj = servicerows[t];

                  var mongo_lead_id = leadObj['_id'];




                  serviceObj['lead_history'] = [{
                    'lead_stage' : servicesqlObj['lead_stage'],
                    'lead_remark' :servicesqlObj['lead_status']
                  }];

                  serviceObj['service_address'] = addressidmap[clientidmap[leadsqlObj['mhcclient_id']]['_id']];
                  serviceObj['service_id'] = parseInt(servicesqlObj['service_inquiry']);

                  serviceObj['variant_type_id'] = servicesqlObj['varianttype_id'];
                  serviceObj['additional_variant'] = servicesqlObj['sqft'];

                  if(moment(servicesqlObj['service_date']).isValid() != false) {
                    serviceObj['service_date'] = [servicesqlObj['service_date']];
                  } else {
                    serviceObj['service_date'] = [];
                  }


                  if(moment(servicesqlObj['service_date']).isValid() != false) {
                    if(servicesqlObj['service_time'] != "" && servicesqlObj['service_time'] != null && servicesqlObj['service_time'] != undefined) {
                      serviceObj['service_time'] =[(new Date(moment(servicesqlObj['service_date']).format('YYYY-MM-DD') + ' ' + servicesqlObj['service_time'])).toISOString()];
                    } else {
                      serviceObj['service_time'] = [];
                    }
                  } else {
                      serviceObj['service_time'] = [];                  
                  }
                  serviceObj['duration_of_service'] = servicesqlObj['no_of_service'];
                  serviceObj['is_amc'] =servicesqlObj['is_amc']==''?0:0 ;

                  serviceObj['no_of_team_leader'] = parseInt(servicesqlObj['teamleader_deployment']);
                  serviceObj['no_of_supervisor'] = parseInt(servicesqlObj['supervisor_deployment']);
                  serviceObj['no_of_janitor'] = parseInt(servicesqlObj['janitor_deployment']);
                  serviceObj['pre_taxed_cost'] = parseFloat((parseInt(servicesqlObj['service_price'])/1.15).toFixed(2));
                  serviceObj['taxed_cost'] = parseInt(servicesqlObj['service_price']);
                  serviceObj['client_payment_expected'] = parseInt(servicesqlObj['client_payment_expected']);
                  serviceObj['partner_payment_payable'] = parseInt(servicesqlObj['partner_payable']);
                  serviceObj['partner_payment_recievable'] = parseInt(servicesqlObj['partner_receivable']);


                  serviceObj['invoice_sent'] = 0;
                  serviceObj['payment_link_sent'] =  0;
                    serviceObj['is_order'] = 0;
                  serviceObj['service_status'] = 0;

                  // console.log("Source: " + leadObj['leadsource']);
                  // console.log("City: " + leadObj['city']);
                  // console.log("Date: " + leadObj['created_on']);

                  serviceObj['leadsource'] = leadObj['leadsource'];
                  serviceObj['city'] = leadObj['city'];
                  serviceObj['created_on'] = leadObj['created_on'];

                  serviceObj['created_by'] = servicesqlObj['author_name'];
                  serviceObj['last_updated_by'] = servicesqlObj['author_name'];
                  serviceObj['status'] = servicesqlObj['status'];


                  if(servicesqlObj['lead_stage'] == 17 || servicesqlObj['lead_stage'] == 36 || servicesqlObj['lead_stage'] == 31 ||  servicesqlObj['lead_stage'] == 32) {

                    var order_query = orderqryString + ' and `order`.leadmanager_id=' + leadsqlObj['id'];
                    if(servicesqlObj['service_inquiry'] != "" && servicesqlObj['service_inquiry'] != null && servicesqlObj['service_inquiry'] != undefined) {
                      order_query += ' and `order`.service = ' + servicesqlObj['service_inquiry'];
                    }

                    if(servicesqlObj['varianttype_id'] != "" && servicesqlObj['varianttype_id'] != null && servicesqlObj['varianttype_id'] != undefined) {
                      order_query += ' and service.varianttype_id = ' + servicesqlObj['varianttype_id'];
                    }

                    console.log("Lead: " + leadsqlObj['id']);
                    console.log("Service: " + servicesqlObj['service_inquiry']);
                    console.log(order_query);

                    (function(clientidmap,addressidmap,cityidmap,leadObj,leadsqlObj,serviceObj){


            con.query(order_query,function(err,rows){

              

              if(rows.length > 0) {

              console.log(rows.length);


              
              // order for loop start

              for (var k = 0; k < rows.length; k++) {

                //var servicesqlObj = {};
                
                servicesqlObj = rows[k];

                serviceObj['lead_history'] = [{
                  'lead_stage' : servicesqlObj['lead_stage'],
                  'lead_remark' :servicesqlObj['lead_status']
                }];


                serviceObj['service_address'] = addressidmap[clientidmap[leadsqlObj['mhcclient_id']]['_id']];
                serviceObj['service_id'] = parseInt(servicesqlObj['service']);

                serviceObj['variant_type_id'] = servicesqlObj['varianttype_id'];
                serviceObj['additional_variant'] = servicesqlObj['sqft'];

                if(moment(servicesqlObj['service_date']).isValid() != false) {
                  serviceObj['service_date'] = [servicesqlObj['service_date']];
                } else {
                  serviceObj['service_date'] = [];
                }

                //console.log(moment(servicesqlObj['service_date']).format('YYYY-MM-DD') + ' ' + servicesqlObj['service_time']);

                if(moment(servicesqlObj['service_date']).isValid() != false) {
                  if(servicesqlObj['service_time'] != "" && servicesqlObj['service_time'] != null && servicesqlObj['service_time'] != undefined) {
                    serviceObj['service_time'] =[(new Date(moment(servicesqlObj['service_date']).format('YYYY-MM-DD') + ' ' + servicesqlObj['service_time'])).toISOString()];
                  } else {
                    serviceObj['service_time'] = [];
                  }
                } else {
                    serviceObj['service_time'] = [];                  
                }
                serviceObj['duration_of_service'] = servicesqlObj['no_of_service'];
                serviceObj['is_amc'] =servicesqlObj['is_amc']==''?0:0 ;

                serviceObj['no_of_team_leader'] = parseInt(servicesqlObj['teamleader_deployment']);
                serviceObj['no_of_supervisor'] = parseInt(servicesqlObj['supervisor_deployment']);
                serviceObj['no_of_janitor'] = parseInt(servicesqlObj['janitor_deployment']);
                serviceObj['pre_taxed_cost'] = parseFloat((parseInt(servicesqlObj['price'])/1.15).toFixed(2));
                serviceObj['taxed_cost'] = parseInt(servicesqlObj['price']);
                serviceObj['client_payment_expected'] = parseInt(servicesqlObj['client_payment_expected']);
                serviceObj['partner_payment_payable'] = parseInt(servicesqlObj['partner_payable']);
                serviceObj['partner_payment_recievable'] = parseInt(servicesqlObj['partner_receivable']);


                // serviceObj['invoice_id'] = servicesqlObj['invoice_id'];
                // serviceObj['invoice_sent'] = servicesqlObj['invoice_sent'];
                // serviceObj['payment_link_sent'] =  servicesqlObj['payment_link_sent'];
                serviceObj['service_status'] = 0;

                serviceObj['leadsource'] = leadObj['leadsource'];
                serviceObj['city'] = leadObj['city'];

                serviceObj['created_by'] = servicesqlObj['author_name'];
                serviceObj['last_updated_by'] = servicesqlObj['author_name'];
                serviceObj['created_on'] = servicesqlObj['insert_date'];
                var dt1 = moment(servicesqlObj['update_date']).isValid();
                // var dtparts = dt.split("-");
                if(dt1) {
                    serviceObj['updated_on'] = servicesqlObj['update_date'];
                 } else {
                   serviceObj['updated_on'] = '';
                }
                serviceObj['status'] = servicesqlObj['status'];

                if(servicesqlObj['lead_stage'] == 17 || servicesqlObj['lead_stage'] == 36 || servicesqlObj['lead_stage'] == 31 ||  servicesqlObj['lead_stage'] == 32) {

                  serviceObj['is_order'] = 1;

                  var orderObj = new ordermanager();

                  orderObj['leadmanager_details'] = mongo_lead_id;
                  orderObj['client_details'] = clientidmap[leadsqlObj['mhcclient_id']]['_id'];
                  orderObj['address_details'] = addressidmap[clientidmap[leadsqlObj['mhcclient_id']]['_id']];
                  orderObj['service_details'] = serviceObj['_id'];

                  orderObj['job_start_timestamp'] =  servicesqlObj['job_start'] == null ? '' : servicesqlObj['job_start'];
                  orderObj['job_end_timestamp'] = servicesqlObj['job_end'] == null ? '' : servicesqlObj['job_end'];
                  orderObj['vendor_allocated'] = servicesqlObj['vendor'];
                  orderObj['payment_mode'] = servicesqlObj['payment_mode'];
                  orderObj['payment_status'] = servicesqlObj['payment_status'];
                  orderObj['payment_remark'] = servicesqlObj['payment_remarks'];
                  orderObj['travel_cost'] = servicesqlObj['travel_cost'];
                  orderObj['material_cost'] = servicesqlObj['material_cost'];
                  orderObj['acount_payment_status'] = servicesqlObj['payment_remarks'];
                  orderObj['created_on'] = servicesqlObj['insert_date'];
                  var dt = moment(servicesqlObj['update_date']).isValid();
                  // var dtparts = dt.split("-");
                  if(dt) {
                      orderObj['last_updated_on'] = servicesqlObj['update_date'];
                   } else {
                     orderObj['last_updated_on'] = '';
                  }

                  orderObj['status'] = parseInt(servicesqlObj['status']);

                  orderObj['leadmanager_obj'] = {
                    'leadsource': leadObj['leadsource'], 
                    'leadowner': leadObj['leadowner'],
                    'billing_name': servicesqlObj['billing_name'],
                    'billing_address': servicesqlObj['billing_address']
                  };

                  orderObj['firstname'] = leadObj['firstname'];
                  orderObj['primary_contact_no'] = leadObj['primary_contact_no'];
                  orderObj['primary_email_id'] = leadObj['primary_email_id'];
                  orderObj['address'] = leadObj['address'];
                  orderObj['city'] = leadObj['city'];
                  orderObj['service_obj'] = {
                    'service_id': serviceObj['service_id'],
                    'service_date': (moment(servicesqlObj['service_date']).isValid() != false) ? [servicesqlObj['service_date']] : [],
                    'taxed_cost': servicesqlObj['price'],
                    'variant_type_id': servicesqlObj['varianttype_id']
                  };

                  orderObj['is_amc'] =servicesqlObj['is_amc']==''?0:0 ;
                  orderObj['service_date'] = [servicesqlObj['service_date']];
                  if(moment(servicesqlObj['service_date']).isValid() != false) {
                    orderObj['service_time'] = [(new Date(moment(servicesqlObj['service_date']).format('YYYY-MM-DD') + ' ' + servicesqlObj['service_time'])).toISOString()];
                  } else {
                    orderObj['service_time'] = '';
                  }

                  //ordermongoArr.push(orderObj);

                  orderObj.save(function(err,result){
                      if ( err ){
                          console.log("Order");
                         console.log(orderObj);
                       }
                       else {
                          console.log(result['service_details']);
                         console.log("Order Exported");

                         var whereArr = { '_id': result['service_details']};

                         // db.getDatafromCollection(servicemanager,whereArr,'','',0,0,function(res){
                         //  console.log("Find from service: ");
                         //  console.log(res);
                         // });
                         var updateVal = {};
                          updateVal['invoice_id'] = servicesqlObj['invoice_id'];
                          updateVal['invoice_sent'] = servicesqlObj['invoice_sent'];
                          updateVal['payment_link_sent'] =  servicesqlObj['payment_link_sent'];
                          updateVal['is_order'] = 1;
                          //var update_service_obj = new servicemanager();

                         servicemanager.update(whereArr, updateVal, {multi: true}, function(errr, rs){
                            if ( errr ){
                               console.log(errr);
                             }
                            else {
                              console.log('Service Updated');
                            }

                          });


                       }

                  });


                }


                  service_id_arr.push(serviceObj['_id']);
                  service_obj_arr.push(serviceObj);


              }

              // order for loop end


           
              }

            });


                    })(clientidmap,addressidmap,cityidmap,leadObj,leadsqlObj,serviceObj);

                  }


                  //console.log(leadObj['insert_date']);

                  service_id_arr.push(serviceObj['_id']);
                  service_obj_arr.push(serviceObj);

                  //servicemongoArr.push(serviceObj);

                  serviceObj.save(function(err,result){
                      if ( err ){
                         console.log("Service");
                         console.log(err);
                         //console.log(moment(servicesqlObj['service_date']).isValid() + ' ' + servicesqlObj['service_time']);
                         //console.log(servicesqlObj);
                       }
                       else {
                         console.log("Service Exported");
                       }

                  });


                }

                // service loop end


                leadObj['service_obj'] = service_id_arr;
                leadObj['service_obj_arr'] = service_obj_arr;

                leadObj.save(function(err,result){
                    if ( err ){
                       console.log("Lead Manager");
                       console.log(leadObj);
                     }
                     else {
                       console.log("Lead Exported");
                     }

                });



              });





            })(clientidmap,addressidmap,cityidmap,leadObj,leadsqlObj);

          }

        }

        console.log("Data.............. Exported");

      })    

    }

  });


}
module.exports  =  exportdata;
