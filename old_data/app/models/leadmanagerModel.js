
var dbWrapper = require('../../dbWrapper.js');
var db = new dbWrapper();
var leadmanager   = require('../../app/schema/leadmanager');
var servicemanager = require('../../app/schema/servicemanager');
var amcservicemanager = require('../../app/schema/amcservicemanager');
var ordermanager = require('../../app/schema/ordermanager');
var clientmanager = require('../../app/schema/mhc-client');
var inspectionmanager   = require('../../app/schema/inspectionmanager');
var addressmanager   = require('../../app/schema/addressdetail');

var moment = require('moment');



function LeadManager(){

}

LeadManager.prototype.getAllLeads = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var queryResult = {};

  var populate_obj = 'client_details service_obj service_obj.amcservices';
  // populate_obj = [{path:'clientdetails', select:''}, {path:'movie', select:'director'}];

  db.getPopulatedDatafromCollection(leadmanager,populate_obj,keyValueArray,selectColObj,orderBy,limit,offset,callback);

  //   console.log(response);
  // return response;

}

LeadManager.prototype.getServiceLead = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  var leadfilterarr = {};

  filterservicecollection(keyValueArray,orderBy,limit,offset,function(serviceId){
    if (serviceId) {
        leadfilterarr['service_obj'] = {$in : serviceId};
    }

    filterleadcollection(leadfilterarr,orderBy,limit,offset,function(leadId){
      if (leadId.length > 0) {
        callback(leadId);
      }
    });

  });

}

LeadManager.prototype.filterAllLeads = function(keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){

  //offset = 0;

  var queryResult = {};
  var client_details_match = {};
  var service_detial_match = {};
  var leads_detail_match = {};

  if (keyValueArray.hasOwnProperty('name')) {
        leads_detail_match['firstname'] = {'$regex': keyValueArray['name'], $options: 'i'};
        client_details_match['lastname'] = {'$regex': keyValueArray['name'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('primary_contact_no')) {

      leads_detail_match['primary_contact_no'] = {'$regex': keyValueArray['primary_contact_no'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('primary_email_id')) {

      leads_detail_match['primary_email_id'] = keyValueArray['primary_email_id'];
  }

  if (keyValueArray.hasOwnProperty('city_filter')) {
      leads_detail_match['city'] = keyValueArray['city_filter'];
  }


  if (keyValueArray.hasOwnProperty('lead_stage')) {
      leads_detail_match['service_obj_arr'] = { "$elemMatch": { "lead_history": { "$elemMatch": { "lead_stage": parseInt(keyValueArray['lead_stage']) } } } } ;
  }

  if (keyValueArray.hasOwnProperty('service_filter')) {
      leads_detail_match['service_obj_arr'] = { "$elemMatch": { "service_id": parseInt(keyValueArray['service_filter']) } } ;
  }

  if (keyValueArray.hasOwnProperty('lead_stage') && keyValueArray.hasOwnProperty('service_filter')) {
      leads_detail_match['service_obj_arr'] = { "$elemMatch": { "service_id": parseInt(keyValueArray['service_filter']), "lead_history": { "$elemMatch": { "lead_stage": parseInt(keyValueArray['lead_stage']) } } } } ;
  }

  // if (keyValueArray.hasOwnProperty('status')) {
  //     service_detial_match['status'] = keyValueArray['status'];
  //      leads_detail_match['status'] = keyValueArray['status'];

  // }

  if (keyValueArray.hasOwnProperty('address')) {
    leads_detail_match['address'] = {'$regex': keyValueArray['address'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('taxed_cost')) {
    leads_detail_match['service_obj_arr'] = { "$elemMatch": { "taxed_cost": keyValueArray['taxed_cost'] } } ;
  }


  if (keyValueArray.hasOwnProperty('lead_stage') && keyValueArray.hasOwnProperty('service_filter') && keyValueArray.hasOwnProperty('taxed_cost')) {
      leads_detail_match['service_obj_arr'] = { "$elemMatch": { "taxed_cost": keyValueArray['taxed_cost'], "service_id": parseInt(keyValueArray['service_filter']), "lead_history": { "$elemMatch": { "lead_stage": parseInt(keyValueArray['lead_stage']) } } } } ;
  }


  if (keyValueArray.hasOwnProperty('billing_name')) {
    leads_detail_match['billing_name'] = {'$regex': keyValueArray['billing_name'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('billing_address')) {
    leads_detail_match['billing_address'] = {'$regex': keyValueArray['billing_address'], $options: 'i'};
  }

  if (keyValueArray.hasOwnProperty('lead_id')) {
    leads_detail_match['_id'] = keyValueArray['lead_id'];
  }


  if (keyValueArray.hasOwnProperty('city_filter')) {
      leads_detail_match['city'] = keyValueArray['city_filter'];
  }


  if (keyValueArray.hasOwnProperty('from_inquiry_date')) {
      leads_detail_match['created_on'] = {"$gte": keyValueArray['from_inquiry_date'], "$lt": keyValueArray['to_inquiry_date']};
  }
  
  if (keyValueArray.hasOwnProperty('rem_from_inquiry_date')) {
      leads_detail_match['reminder'] = {"$gte": keyValueArray['rem_from_inquiry_date'], "$lt": keyValueArray['rem_to_inquiry_date']};
  }

  if (keyValueArray.hasOwnProperty('from_inquiry_sdate')) {
      leads_detail_match['service_obj_arr'] =  { "$elemMatch": { "service_date": {"$gte": keyValueArray['from_inquiry_sdate'], "$lte": keyValueArray['to_inquiry_sdate']} } };
      // leads_detail_match['$or'] =  [{ "service_obj_arr.service_date": {"$gte": keyValueArray['from_inquiry_sdate'], "$lte": keyValueArray['to_inquiry_sdate']} }, { 'contract_start_date': { '$lte': keyValueArray['from_inquiry_sdate'] }, 'contract_end_date': { '$gte': keyValueArray['from_inquiry_sdate'] } }];
  }

  if (keyValueArray.hasOwnProperty('lead_stage') && keyValueArray.hasOwnProperty('service_filter') && keyValueArray.hasOwnProperty('taxed_cost') && keyValueArray.hasOwnProperty('from_inquiry_sdate')) {
      leads_detail_match['service_obj_arr'] = { "$elemMatch": { "service_date": {"$gte": keyValueArray['from_inquiry_sdate'], "$lte": keyValueArray['to_inquiry_sdate']}, "taxed_cost": keyValueArray['taxed_cost'], "service_id": parseInt(keyValueArray['service_filter']), "lead_history": { "$elemMatch": { "lead_stage": parseInt(keyValueArray['lead_stage']) } } } } ;
  }

  if (keyValueArray.hasOwnProperty('leadowner')) {

      leads_detail_match['leadowner'] = {'$regex': keyValueArray['leadowner'], $options: 'i'};;
  }
  if (keyValueArray.hasOwnProperty('leadsource')) {

      leads_detail_match['leadsource'] = parseInt(keyValueArray['leadsource']);
  }

  // if ((client_details_match != null && client_details_match!= undefined) ||(service_detial_match != null && service_detial_match!= undefined) ) {
  //   var populate_obj = [
  //       { path: 'client_details', match: client_details_match, model: 'Clientdetails' },
  //     { path: 'service_obj', match: service_detial_match, model: 'ServiceManager'}

  //  ];
  // }

  //else {
    var populate_obj = 'client_details service_obj service_obj.amcservices';

  //}

  console.log(leads_detail_match);
  //console.log(populate_obj);

  // var populate_obj = 'client_details service_obj service_obj.amcservices';
  // populate_obj = [{path:'clientdetails', select:''}, {path:'movie', select:'director'}];

  db.getPopulatedDatafromCollection(leadmanager,populate_obj,leads_detail_match,selectColObj,orderBy,limit,offset,callback);

  //   console.log(response);
  // return response;

}





LeadManager.prototype.updateLeadInfo = function(whereArr,updateVal,options,callback){

  var queryResult = {};
  db.updateDocument(leadmanager,whereArr,updateVal,options,callback);

}

LeadManager.prototype.addNewLead = function(newClientObj,callback){

  var queryResult = {};
  var insertObj = new leadmanager(newClientObj);
  //console.log(insertObj);
  db.insertDocument(insertObj,callback);

}

LeadManager.prototype.saveWebsiteLead = function(dataObj,callback){

  // var queryResult = {};
  // var insertObj = new leadmanager(newClientObj);
  // //console.log(insertObj);
  // db.insertDocument(insertObj,callback);

  var serviceObj = {};
  var addressObj = {};
  var clientObj = {};
  var keyValueArray = {};
  var leadObj = {};
  var leadHistoryArr = [];
  var service_date_arr = [];
  var service_time_arr = [];

  clientObj = dataObj.clientObj;
  addressObj = dataObj.addressObj;
  serviceObj = dataObj.serviceObj;

  

  keyValueArray['primary_contact_no'] = clientObj.primary_contact_no;

  //var client_response = {};

  console.log("Client Find Criteria");
  console.log(keyValueArray);

  db.getDatafromCollection(clientmanager,keyValueArray,'','',0,0,function(data){
    
    console.log("Client Found");
    console.log(data);

    if(data.length > 0 ) {

      var client_data = data[0];
      var leadKeyValueArray = {};
      leadKeyValueArray['client_details'] = client_data['_id'];

      console.log("Lead find Criteria");
      console.log(leadKeyValueArray);

      db.getDatafromCollection(leadmanager,leadKeyValueArray,'','',0,0,function(lead_result){

        console.log("Lead Found--------------------------------");
        console.log(lead_result);
        
        if(lead_result.length > 0) {
          
          var lead_data = lead_result[0];
          var lead_service_id_arr = [];
          var lead_service_obj_arr = [];

          if(lead_data.hasOwnProperty('service_obj') && lead_data.service_obj != undefined) {
            lead_service_id_arr = lead_data.service_obj;
          }

          if(lead_data.hasOwnProperty('service_obj_arr') && lead_data.service_obj_arr != undefined) {
            lead_service_obj_arr = lead_data.service_obj_arr;
          }

          var leadHistoryObj = {
            lead_stage: 18,
            lead_remark: 'Confirmed',
            updated_by: 'Website'
          };

          var service_id_arr = [];
          var leadsource = 0;
          var sdate = "";
          var s1date = "";
          var stime = "";

          if(serviceObj.service_date != "" && serviceObj.service_time != "") {

            sdate = moment(serviceObj.service_date);
            s1date = moment(sdate,["YYYY-MM-DD"]);
            stime = moment(serviceObj.service_time,["h:mm A"]);

            service_date_arr.push(sdate);
            service_time_arr.push(stime);

          } else {

            serviceObj.service_date = [];
            serviceObj.service_time = [];

          }

          if(serviceObj.service != "" && serviceObj.service_date != "" && serviceObj.service_time != "" && serviceObj.taxed_cost != "") {
            if(serviceObj.landing_source == "landing") {
              leadsource = 27;
            } else {
              leadsource = 43;
            }
          } else {
            leadsource = 300;
          }



          leadHistoryArr.push(leadHistoryObj);

          // var var_name = serviceObj.variant_name.replace(' - ','-');
          // var new_var_name = var_name.replace(' (','(');
          // var final_var_name = var_name.replace("  "," ");

          // console.log(final_var_name);

          var temp;

          if(serviceObj.service != "" && serviceObj.service_date != "" && serviceObj.service_time != "" && serviceObj.taxed_cost != "") {

            serviceObj.service_address = client_data['address_details'][0];
            serviceObj.lead_history = leadHistoryArr;
            serviceObj.leadsource = leadsource;
            serviceObj.service_id = (serviceObj.service != "") ? websiteServiceMaster(serviceObj.service) : "";
            serviceObj.variant_type_id = (serviceObj.variant_name != "") ? parseInt(websiteVariantMaster(serviceObj.variant_name)) : "";
            serviceObj.variant_type_name = (serviceObj.variant_name != "") ? serviceObj.variant_name : "";
            serviceObj.service_date =  (service_date_arr.length > 0) ? service_date_arr : [];
            serviceObj.service_time = (service_time_arr.length > 0) ? service_time_arr : [];
            serviceObj.taxed_cost =  (serviceObj.taxed_cost != "") ? parseInt(serviceObj.taxed_cost) : 0;
            serviceObj.duration_of_service = 1;
            serviceObj.pre_taxed_cost = (serviceObj.taxed_cost != "") ? parseInt(serviceObj.taxed_cost)/1.15 : 0;
            serviceObj.client_payment_expected = (serviceObj.taxed_cost != "") ? parseInt(serviceObj.taxed_cost) : 0;
            serviceObj.discount = 0;
            serviceObj.status = 0;

            temp = new servicemanager(serviceObj);
            lead_service_id_arr.push(temp['_id']);

          }

          //console.log(serviceObj);


          lead_service_obj_arr.push(serviceObj);

          //leadObj.firstname = clientObj.firstname;
          //leadObj.primary_contact_no = clientObj.primary_contact_no;
          //leadObj.primary_email_id = clientObj.primary_email_id;
          //leadObj.address = addressObj.address;
          //leadObj.client_details = client_data['_id'];
          leadObj.leadsource = leadsource;
          leadObj.leadowner = "API";
          
          if(leadObj.customer_id != undefined && leadObj.customer_id.length <= 0) {
            leadObj.customer_id = 'C' + (clientObj.firstname == undefined ? '' : clientObj.firstname[0]) + (clientObj.lastname == undefined ? '' : clientObj.lastname[0]) + getRandomFromRange(111111,999999) + moment().format('YY');
          }
          leadObj.city = addressObj.city_id;
          if(serviceObj.service != "" && serviceObj.service_date != "" && serviceObj.service_time != "" && serviceObj.taxed_cost != "") {
            leadObj.service_obj = lead_service_id_arr;
            leadObj.service_obj_arr = lead_service_obj_arr;
          }

          leadObj.billing_name = clientObj.firstname;
          leadObj.billing_email_id = clientObj.primary_email_id;
          leadObj.billing_address = addressObj.address;
          //leadObj.invoice_mode = "Single";
          //leadObj.invoice_type = "Client";
          //leadObj.status = 0;

          console.log(leadObj);

          var temp_lead = new leadmanager();

          if(serviceObj.service != "" && serviceObj.service_date != "" && serviceObj.service_time != "" && serviceObj.taxed_cost != "") { 

            db.insertDocument(temp,function(data){
                if (data) {

                  var leadWhereArr = {};
                  leadWhereArr['_id'] = lead_data['_id'];
                  // console.log(leadWhereArr);

                  // var leadUpdateVal = leadObj;
                  // console.log("In Lead Update Action");
                  // console.log(leadObj);
                  db.updateDocument(leadmanager,leadWhereArr,leadObj,null,function(d){

                    console.log("Update success");
                    console.log(d);
                    
                  });

                }
            });

          } else {

            var leadWhereArr = {};
            leadWhereArr['_id'] = lead_data['_id'];
            // console.log(leadWhereArr);

            // var leadUpdateVal = leadObj;
            // console.log("In Lead Update Action");
            // console.log(leadObj);
            db.updateDocument(leadmanager,leadWhereArr,leadObj,null,function(d){

              console.log("Only Lead - Update success >>> " + lead_data['_id']);
              console.log(d);
              
            });


          }


        } else {


          var leadHistoryObj = {
            lead_stage: 18,
            lead_remark: 'Confirmed',
            updated_by: 'Website'
          };

          var service_id_arr = [];
          var sdate = "";
          var s1date = "";
          var stime = "";
          var leadsource = 0;

          if(serviceObj.service_date != "" && serviceObj.service_time != "") {

            sdate = moment(serviceObj.service_date);
            s1date = moment(sdate,["YYYY-MM-DD"]);
            stime = moment(serviceObj.service_time,["h:mm A"]);

            service_date_arr.push(sdate);
            service_time_arr.push(stime);

          } else {
            serviceObj.service_date = [];
            serviceObj.service_time = [];
          }


          if(serviceObj.service != "" && serviceObj.service_date != "" && serviceObj.service_time != "" && serviceObj.taxed_cost != "") {
            if(serviceObj.landing_source == "landing") {
              leadsource = 27;
            } else {
              leadsource = 43;
            }
          } else {
            leadsource = 300;
          }

          leadHistoryArr.push(leadHistoryObj);

          serviceObj.service_address = client_data['address_details'][0];
          serviceObj.lead_history = leadHistoryArr;
          serviceObj.leadsource = leadsource;
          serviceObj.service_id = (serviceObj.service != "") ? websiteServiceMaster(serviceObj.service) : "";
          serviceObj.variant_type_id = (serviceObj.variant_name != "") ? websiteVariantMaster(serviceObj.variant_name.replace(' - ','-')) : "";
          serviceObj.variant_type_name = (serviceObj.variant_name != "") ? serviceObj.variant_name : "";
          serviceObj.service_date = (service_date_arr.length > 0) ? service_date_arr : [];
          serviceObj.service_time = (service_time_arr.length > 0) ? service_time_arr : [];
          serviceObj.duration_of_service = 1;
          serviceObj.pre_taxed_cost = (serviceObj.taxed_cost != "") ? (parseInt(serviceObj.taxed_cost)/1.15) : 0;
          serviceObj.client_payment_expected = (serviceObj.taxed_cost != "") ? serviceObj.taxed_cost : 0;
          serviceObj.discount = 0;
          serviceObj.status = 0;



          var temp = new servicemanager(serviceObj);

          service_id_arr.push(temp['_id']);
          leadObj.firstname = clientObj.firstname;
          leadObj.primary_contact_no = clientObj.primary_contact_no;
          leadObj.primary_email_id = clientObj.primary_email_id;
          leadObj.address = addressObj.address;
          leadObj.client_details = client_data['_id'];
          leadObj.leadsource = leadsource;
          leadObj.leadowner = "API";
          leadObj.customer_id = 'C' + (clientObj.firstname == undefined ? '' : clientObj.firstname[0]) + (clientObj.lastname == undefined ? '' : clientObj.lastname[0]) + getRandomFromRange(111111,999999) + moment().format('YY');
          leadObj.city = addressObj.city_id;
          leadObj.service_obj = service_id_arr;
          leadObj.service_obj_arr = serviceObj;
          leadObj.billing_name = clientObj.firstname;
          leadObj.billing_email_id = clientObj.primary_email_id;
          leadObj.billing_address = addressObj.address;
          leadObj.invoice_mode = "Single";
          leadObj.invoice_type = "Client";
          leadObj.status = 0;

          var temp_lead = new leadmanager(leadObj);

          db.insertDocument(temp,function(data){
              if (data) {
                db.insertDocument(temp_lead,function(d){
                  
                });
              }
          });




        }


      });



    } else {

      var temp_address = new addressmanager(addressObj);
      var address_arr = [];

      db.insertDocument(temp_address, function(add_result){
      });

      address_arr.push(temp_address['_id']);

      clientObj.status = 0;
      clientObj.address_details = address_arr;

      var temp_client = new clientmanager(clientObj);

      db.insertDocument(temp_client, function(add_result){
      });


      var leadHistoryObj = {
        lead_stage: 18,
        lead_remark: 'Confirmed',
        updated_by: 'Website'
      };

      var service_id_arr = [];
      var sdate = "";
      var s1date = "";
      var stime = "";
      var leadsource = 0;


      if(serviceObj.service_date != "" && serviceObj.service_time != "") {

        sdate = moment(serviceObj.service_date);
        s1date = moment(sdate,["YYYY-MM-DD"]);
        stime = moment(serviceObj.service_time,["h:mm A"]);
        service_id_arr = [];

        service_date_arr.push(sdate);
        service_time_arr.push(stime);

      } else {
        serviceObj.service_date = [];
        serviceObj.service_time = [];
      }

      if(serviceObj.service != "" && serviceObj.service_date != "" && serviceObj.service_time != "" && serviceObj.taxed_cost != "") {
        if(serviceObj.landing_source == "landing") {
          leadsource = 27;
        } else {
          leadsource = 43;
        }
      } else {
        leadsource = 300;
      }
      
      leadHistoryArr.push(leadHistoryObj);

      var temp;

      if(serviceObj.service != "" && serviceObj.service_date != "" && serviceObj.service_time != "" && serviceObj.taxed_cost != "") {

        serviceObj.service_address = temp_client['address_details'][0];
        serviceObj.lead_history = leadHistoryArr;
        serviceObj.leadsource = leadsource;
        serviceObj.service_id = (serviceObj.service != "") ? websiteServiceMaster(serviceObj.service) : "";
        serviceObj.variant_type_id = (serviceObj.variant_name != "") ? websiteVariantMaster(serviceObj.variant_name.replace(' - ','-')) : "";
        serviceObj.variant_type_name = (serviceObj.variant_name != "") ? serviceObj.variant_name : "";
        serviceObj.service_date = (service_date_arr.length > 0) ? service_date_arr : [];
        serviceObj.service_time = (service_time_arr.length > 0) ? service_time_arr : [];
        serviceObj.duration_of_service = 1;
        serviceObj.pre_taxed_cost = (serviceObj.taxed_cost.length > 0) ? (parseInt(serviceObj.taxed_cost)/1.15) : 0;
        serviceObj.client_payment_expected = (serviceObj.taxed_cost.length > 0) ? serviceObj.taxed_cost : 0;
        serviceObj.discount = 0;
        serviceObj.status = 0;

        temp = new servicemanager(serviceObj);

        service_id_arr.push(temp['_id']);

        leadObj.service_obj = service_id_arr;
        leadObj.service_obj_arr = serviceObj;


      }



      leadObj.firstname = clientObj.firstname;
      leadObj.primary_contact_no = clientObj.primary_contact_no;
      leadObj.primary_email_id = clientObj.primary_email_id;
      leadObj.address = addressObj.address;
      leadObj.client_details = temp_client['_id'];
      leadObj.leadsource = leadsource;
      leadObj.leadowner = "API";
      leadObj.customer_id = 'C' + (clientObj.firstname == undefined ? '' : clientObj.firstname[0]) + (clientObj.lastname == undefined ? '' : clientObj.lastname[0]) + getRandomFromRange(111111,999999) + moment().format('YY');
      leadObj.city = addressObj.city_id;
      leadObj.billing_name = clientObj.firstname;
      leadObj.billing_email_id = clientObj.primary_email_id;
      leadObj.billing_address = addressObj.address;
      leadObj.invoice_mode = "Single";
      leadObj.invoice_type = "Client";
      leadObj.status = 0;

      var temp_lead = new leadmanager(leadObj);

      if(serviceObj.service != "" && serviceObj.service_date != "" && serviceObj.service_time != "" && serviceObj.taxed_cost != "") {

        db.insertDocument(temp,function(data){
            if (data) {
              db.insertDocument(temp_lead,function(d){
                console.log("Service and Lead Insert");                
              });
            }
        });

      } else {

        db.insertDocument(temp_lead,function(d){
          console.log("Only Lead Insert");
        });


      }


    }

  });


}


LeadManager.prototype.deleteLeadInfo = function(deleteArr,callback){
  var queryResult = {};
  db.deleteDocument(leadmanager,deleteArr,callback);
}


function createAmcServices(serviceObj,callback){
  var amcserviceArr = [];
  var noOfServices = serviceObj.no_of_service;
  var startDate = moment(serviceObj.contract_start_date,'YYYY-MM-DD');
  var endDate = moment(serviceObj.contract_end_date,'YYYY-MM-DD');
  var no_of_days = endDate.diff(startDate, 'days');
  var service_day_gap = Math.floor((no_of_days+1)/noOfServices);
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
          throw err;
        }

        else {
            //console.log("Amc services Inserted !!!");
            callback({'service':amcserviceArr,'id':amc_is_arr});
        }

    });
      // console.log(amcserviceArr);
      // console.log(amc_is_arr);
}

LeadManager.prototype.saveLead = function(leadmanagerObj,serviceObjArr,callback){

  var serviceArr = [];
  var service_id_arr = [];
  var inspection_id_arr = [];
  var leadmanagerdetail = new leadmanager(leadmanagerObj);
  var ordermanagerdetail = new ordermanager();
  var orderarr =[];
  var amc_order_arr =[];
  var temp_return_amc_arr = [];
  var amcserviceArr  = [];
  var j=0;
  var temp_return = {};
  var order_service_id =[];
  var leadServiceObjArr = [];
  var leadObj = {};

  // console.log("Hiii");
  // console.log(leadmanagerdetail);
  console.log("In Lead Model");
  //console.log(serviceObjArr);

  for (var i = 0; i < serviceObjArr.length; i++) {
    // console.log(serviceObjArr[i]);
    var temp = new servicemanager(serviceObjArr[i]);

    console.log(temp);

    service_id_arr.push(temp['_id']);
    leadServiceObjArr.push({service_id: temp['service_id'], service_date: temp['service_date'], taxed_cost: temp['taxed_cost'], lead_history: temp['lead_history']});
    var lead_stage_arr =  temp['lead_history'];

    for (var k = 0; k < lead_stage_arr.length; k++) {

        var stageobj = lead_stage_arr[k];

        if (stageobj.lead_stage == 17) {
            temp['is_order'] = 1;
        }

    }

    if(temp['variant_type_id'] == 56) {

      var inspection_obj = {
        'client_details': leadmanagerdetail['client_details'],
        'address_details': temp['service_address'],
        'variant_type': temp['variant_type_name'],
        'additional_variant': temp['additional_variant']
      };

      var tp_inspectiondetail = new inspectionmanager(inspection_obj);
      tp_inspectiondetail.save(function(err){
        if (err) {
            throw err;
          }

          else {
              //console.log("Inspection inserted !!!");
              //callback({'service':amcserviceArr,'id':amc_is_arr});
          }
      });
      inspection_id_arr.push(tp_inspectiondetail['_id']);
      temp['inspection_reports'] = inspection_id_arr;

    }

    var leadmanager_obj = {};
    var firstname = "";
    var primary_contact_no = "";
    var primary_email_id = "";
    var address = "";
    var city = "";
    var ser_obj = {};


    if(serviceObjArr[i] != undefined) {

      leadmanager_obj = serviceObjArr[i]['leadmanager_obj'];
      firstname = serviceObjArr[i]['firstname'];
      primary_contact_no = serviceObjArr[i]['primary_contact_no'];
      primary_email_id = serviceObjArr[i]['primary_email_id'];
      address = serviceObjArr[i]['address'];
      city = serviceObjArr[i]['city'];
      ser_obj = serviceObjArr[i]['service_obj'];
    }



    // place orders for non_amc services

    if (  temp['is_order'] ==1 && temp['is_amc']!=1 ) {
      // order_service_id.push(temp['_id']);
      for(var d=0; d< temp['duration_of_service']; d++) {
        
        var tp_ordermanagerdetail = new ordermanager();
        tp_ordermanagerdetail.service_details = temp['_id'];
        tp_ordermanagerdetail.leadmanager_details = leadmanagerdetail['_id'];
        tp_ordermanagerdetail.client_details = leadmanagerdetail['client_details'];
        tp_ordermanagerdetail.address_details = temp['service_address'];
        tp_ordermanagerdetail.client_type = temp['client_type'];

        if(serviceObjArr[i] != undefined) {
          tp_ordermanagerdetail.leadmanager_obj = leadmanager_obj;
          tp_ordermanagerdetail.firstname = firstname;
          tp_ordermanagerdetail.primary_contact_no = primary_contact_no;
          tp_ordermanagerdetail.primary_email_id = primary_email_id;
          tp_ordermanagerdetail.address = address;
          tp_ordermanagerdetail.city = city;
          tp_ordermanagerdetail.service_obj = ser_obj;
        }
        if(temp['service_category_id'] == 11) {
          tp_ordermanagerdetail.vendor_allocated = 100;
        }
        // console.log("Ckeking address");
        // console.log(temp['service_address']);

        tp_ordermanagerdetail.order_no = (d+1);
        orderarr.push(tp_ordermanagerdetail);
      }

      // db.insertDocument(ordermanagerdetail,function(data){
      //     if (data) {
      //       console.log("Order Placed!!!");
      //     }
      // });

    }


    if (temp['is_amc']==1) {
        amcserviceArr[j] = [];

       createAmcServices(temp,function(data){
            temp_return = data;
            //amcserviceArr[j].push(temp_return.service);
            temp.amcservices = temp_return['id'];
            temp_return_amc_arr = temp_return['service'];
            //console.log(temp.amcservices);

            if (temp['is_order']==1) {
              for (var k = 0; k < temp.amcservices.length; k++) {

                  var temp_ordermanagerdetail = new ordermanager();
                  temp_ordermanagerdetail.service_details = temp['_id'];
                  temp_ordermanagerdetail.leadmanager_details = leadmanagerdetail['_id'];
                  temp_ordermanagerdetail.client_details = leadmanagerdetail['client_details'];
                  temp_ordermanagerdetail.address_details = temp['service_address'];
                  temp_ordermanagerdetail.client_type = temp['client_type'];
                  //console.log("Ckeking address");
                  //console.log(temp['service_address']);
                  temp_ordermanagerdetail.amc_service_details = temp.amcservices[k];

                  temp_ordermanagerdetail.leadmanager_obj = leadmanager_obj;
                  temp_ordermanagerdetail.firstname = firstname;
                  temp_ordermanagerdetail.primary_contact_no = primary_contact_no;
                  temp_ordermanagerdetail.primary_email_id = primary_email_id;
                  temp_ordermanagerdetail.address = address;
                  temp_ordermanagerdetail.city = city;
                  temp_ordermanagerdetail.service_obj = ser_obj;
                  temp_ordermanagerdetail.is_amc = temp['is_amc'];
                  temp_ordermanagerdetail.service_date = temp_return_amc_arr[k]['service_date'];
                  temp_ordermanagerdetail.service_time = temp_return_amc_arr[k]['service_time'];
                  temp_ordermanagerdetail.order_no = (k+1);
                  if(temp['service_category_id'] == 11) {
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

          serviceArr.push(temp);

    }
    if (orderarr.length !=0) {

      console.log("Order Array");
      console.log(orderarr);

    ordermanager.insertMany(orderarr,function(err,docs){

        if (err) {
          throw err;
        }

        else {
            //console.log("Multi Orders Placed !!!");
            // callback('docs');
        }

    });
  }

      leadmanagerdetail.service_obj = service_id_arr;
      leadmanagerdetail.service_obj_arr = leadServiceObjArr;
      servicemanager.insertMany(serviceArr,function(err,doc){

          if (err) {
            throw err;
          }

          else {
            db.insertDocument(leadmanagerdetail,callback);
          }
      });
  }

LeadManager.prototype.updateLead = function(lead_id,serviceObjArr,old_service_id_arr,service_obj_arr,client_id,callback){

    var serviceArr = [];
    var service_id_arr = [];
    var inspection_id_arr = [];
    // var leadmanagerdetail = new leadmanager(leadmanagerObj);
    var amcserviceArr  = [];
    var temp_return_amc_arr = [];
    var amc_order_arr =[];
    var orderarr =[];
    var j=0;
    var temp_return = {};
    var options = null;
    var whereArr = {};
    var updateVal = {};
    var leadServiceObjArr = [];

    //leadServiceObjArr = service_obj_arr;

    var ordermanagerdetail = new ordermanager();

    if(serviceObjArr == undefined || serviceObjArr == null ) {
      return;
    }

    for (var i = 0; i < serviceObjArr.length; i++) {
      // console.log(serviceObjArr[i]);
      var temp = new servicemanager(serviceObjArr[i]);

      //service_obj_arr.push(temp);
      old_service_id_arr.push(temp['_id']);
      service_obj_arr.push({service_id: temp['service_id'], service_date: temp['service_date'], taxed_cost: temp['taxed_cost'], lead_history: temp['lead_history']});

      var lead_stage_arr =  temp['lead_history'];

      for (var k = 0; k < lead_stage_arr.length; k++) {

        var stageobj = lead_stage_arr[k];

        if (stageobj.lead_stage == 17) {
            temp['is_order'] = 1;
        }

      }


      if(temp['variant_type_id'] == 56) {

        var inspection_obj = {
          'client_details': client_id,
          'address_details': temp['service_address'],
          'variant_type': temp['variant_type_name'],
          'additional_variant': temp['additional_variant']
        };

        // console.log(temp);
        // console.log("Inspection Object");
        // console.log(inspection_obj);

        var tp_inspectiondetail = new inspectionmanager(inspection_obj);
        tp_inspectiondetail.save(function(err){
          if (err) {
              throw err;
            }

            else {
                //console.log("Inspection inserted !!!");
                //callback({'service':amcserviceArr,'id':amc_is_arr});
            }
        });
        // db.insertDocument(tp_inspectiondetail,function(err,docs){
        //     if (err) {
        //       throw err;
        //     }

        //     else {
        //         console.log("Inspection inserted !!!");
        //         //callback({'service':amcserviceArr,'id':amc_is_arr});
        //     }
        // });
        inspection_id_arr.push(tp_inspectiondetail['_id']);
        temp['inspection_reports'] = inspection_id_arr;

      }


      var leadmanager_obj = {};
      var firstname = "";
      var primary_contact_no = "";
      var primary_email_id = "";
      var address = "";
      var city = "";
      var ser_obj = {};


      if(serviceObjArr[i] != undefined) {

        leadmanager_obj = serviceObjArr[i]['leadmanager_obj'];
        firstname = serviceObjArr[i]['firstname'];
        primary_contact_no = serviceObjArr[i]['primary_contact_no'];
        primary_email_id = serviceObjArr[i]['primary_email_id'];
        address = serviceObjArr[i]['address'];
        city = serviceObjArr[i]['city'];
        ser_obj = serviceObjArr[i]['service_obj'];
      }



      if (  temp['is_order'] ==1 && temp['is_amc']!=1 ) {
        // order_service_id.push(temp['_id']);
        for(var d=0; d< temp['duration_of_service']; d++) {
          var tp_ordermanagerdetail = new ordermanager();
          tp_ordermanagerdetail.service_details = temp['_id'];
          tp_ordermanagerdetail.leadmanager_details = lead_id;
          tp_ordermanagerdetail.client_details = client_id;
          tp_ordermanagerdetail.address_details = temp['service_address'];
          // console.log("Ckeking address");
          // console.log(temp['service_address']);


          tp_ordermanagerdetail.leadmanager_obj = leadmanager_obj;
          tp_ordermanagerdetail.firstname = firstname;
          tp_ordermanagerdetail.primary_contact_no = primary_contact_no;
          tp_ordermanagerdetail.primary_email_id = primary_email_id;
          tp_ordermanagerdetail.address = address;
          tp_ordermanagerdetail.city = city;
          tp_ordermanagerdetail.service_obj = ser_obj;

          if(temp['service_category_id'] == 11) {
            tp_ordermanagerdetail.vendor_allocated = 100;
          }

          tp_ordermanagerdetail.order_no = (d+1);
          orderarr.push(tp_ordermanagerdetail);
        }

      }


      if (temp['is_amc']==1) {
          amcserviceArr[j] = [];

         createAmcServices(temp,function(data){
              temp_return = data;
              amcserviceArr[j].push(temp_return.service);
              temp.amcservices = temp_return['id'];
              temp_return_amc_arr = temp_return['service'];
              //console.log(temp.amcservices);

              if (temp['is_order']==1) {
                for (var k = 0; k < temp.amcservices.length; k++) {

                    var temp_ordermanagerdetail = new ordermanager();
                    temp_ordermanagerdetail.service_details = temp['_id'];
                    temp_ordermanagerdetail.leadmanager_details = lead_id;
                    temp_ordermanagerdetail.client_details = client_id;
                    temp_ordermanagerdetail.address_details = temp['service_address'];
                    // console.log("Ckeking address");
                    // console.log(temp['service_address']);
                    temp_ordermanagerdetail.amc_service_details =   temp.amcservices[k];


                    temp_ordermanagerdetail.leadmanager_obj = leadmanager_obj;
                    temp_ordermanagerdetail.firstname = firstname;
                    temp_ordermanagerdetail.primary_contact_no = primary_contact_no;
                    temp_ordermanagerdetail.primary_email_id = primary_email_id;
                    temp_ordermanagerdetail.address = address;
                    temp_ordermanagerdetail.city = city;
                    temp_ordermanagerdetail.service_obj = ser_obj;
  
                    temp_ordermanagerdetail.is_amc = temp['is_amc'];

                    temp_ordermanagerdetail.service_date = temp_return_amc_arr[k]['service_date'];
                    temp_ordermanagerdetail.service_time = temp_return_amc_arr[k]['service_time'];
                    
                    temp_ordermanagerdetail.order_no = (k+1);
  
                    if(temp['service_category_id'] == 11) {
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

            serviceArr.push(temp);

      }

      if (orderarr.length !=0) {
      ordermanager.insertMany(orderarr,function(err,docs){

          if (err) {
            throw err;
          }

          else {
              //console.log("Multi Orders Placed !!!");
              // callback('docs');
          }

      });
    }

        // leadmanagerdetail.service_obj = service_id_arr;
        servicemanager.insertMany(serviceArr,function(err,doc){

            if (err) {
              throw err;
            }

            else {
              whereArr['_id'] = lead_id;
              updateVal['service_obj'] = old_service_id_arr;
              updateVal['service_obj_arr'] = service_obj_arr;

              console.log("Lead Update Action");
              console.log(whereArr);
              console.log(updateVal);

              db.updateDocument(leadmanager,whereArr,updateVal,options,callback);
            }
        });
    }

LeadManager.prototype.deleteLead = function(lead_id,callback){


  var keyValueArray = {};
  var selectColObj='';
  var orderBy='';
  var limit=0;
  keyValueArray['_id'] = lead_id;
  //console.log('Hi this is delete lead');
    //console.log(lead_id);
  var leadmanagerResp = {};
  var service_id_arr = [];
  db.getDatafromCollection(leadmanager,keyValueArray,selectColObj,orderBy,limit,offset=0,function(data){

      if (data) {

        //console.log(data);
        leadmanagerResp = data[0];

        //console.log(leadmanagerResp);

        service_id_arr = leadmanagerResp['service_obj'];

        db.deleteDocument(leadmanager,{'_id':lead_id},function(deletedata){

            // if (err1) { log err1;}

            // else {
              // console.log("hi in lead");
              servicemanager.remove({ '_id': { $in: service_id_arr } },function (err2) {
                  if (err2) {throw err2;}
                  else {
                    //console.log("in service");
                    amcservicemanager.remove({ 'amc_id': { $in: service_id_arr } },function (err3) {
                        if (err3) {throw err3;}
                        else {
                            // console.log("in amc")
                            callback("Lead deleted !!!");
                        }
                      });

                  }
                });
            // }


        });
      }

  });

}


LeadManager.prototype.removeServicefromLead = function(lead_id,service_id){

  var keyValueArray = {};
  var selectColObj='';
  var orderBy='';
  var limit=0;
  keyValueArray['_id'] = lead_id;
  var leadmanagerResp = {};
  var service_id_arr = [];
  var options = null;
  var updateVal ={};
  db.getDatafromCollection(leadmanager,keyValueArray,selectColObj,orderBy,limit,offset=0,function(data){

      if (data) {
        leadmanagerResp = data[0];

        service_id_arr = leadmanagerResp['service_obj'];
        var index = service_id_arr.indexOf(item);
        service_id_arr.splice(index, 1);

        updateVal['service_obj'] =service_id_arr;
        // db.updateDocument(leadmanager,keyValueArray,updateVal,options,callback);

        db.updateDocument(leadmanager,keyValueArray,updateVal,options,function(lead_data){

            if (lead_data) {
              servicemanager.remove({ '_id': service_id },function (err2) {
                  if (err2) {throw err2;}
                  else {
                    amcservicemanager.remove({ 'amc_id': service_id },function (err3) {
                        if (err3) {throw err3;}
                        else {
                            callback("Service deleted !!!");
                        }
                      });

                  }
                });
            }


        });
      }

  });


}

LeadManager.prototype.groupByDate = function(keyValueArray,orderBy,whereServiceArr,callback) {

  var queryResult = {};
  db.groupByDate(servicemanager,keyValueArray,orderBy,whereServiceArr,callback);

}

LeadManager.prototype.groupByDateOrganic = function(keyValueArray,orderBy,whereServiceArr,callback) {

  var queryResult = {};
  db.groupByDateOrganic(servicemanager,keyValueArray,orderBy,whereServiceArr,callback);

}

LeadManager.prototype.groupByDatePartner = function(keyValueArray,orderBy,whereServiceArr,callback) {

  var queryResult = {};
  db.groupByDatePartner(servicemanager,keyValueArray,orderBy,whereServiceArr,callback);

}


LeadManager.prototype.groupByLeadSource = function(keyValueArray,orderBy,whereServiceArr,callback) {

  var queryResult = {};
  db.groupByLeadSource(servicemanager,keyValueArray,orderBy,whereServiceArr,callback);

}

LeadManager.prototype.groupByCategory = function(keyValueArray,orderBy,whereServiceArr,callback) {

  var queryResult = {};
  db.groupByCategory(servicemanager,keyValueArray,orderBy,whereServiceArr,callback);

}

LeadManager.prototype.groupByCancellation = function(keyValueArray,orderBy,whereServiceArr,callback) {

  var queryResult = {};
  db.groupByCancellation(servicemanager,keyValueArray,orderBy,whereServiceArr,callback);

}

LeadManager.prototype.groupByLeadStage = function(keyValueArray,orderBy,whereServiceArr,callback) {

  var queryResult = {};
  db.groupByLeadStage(servicemanager,keyValueArray,orderBy,whereServiceArr,callback);

}

function getRandomFromRange(minimum,maximum) {
  var randomNo = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  return randomNo;
}

function filterleadcollection(filterarr,orderBy,limit,offset,callback){
  var selectColObj = '_id';
  //console.log(filterarr);
  db.getDatafromCollection(leadmanager,filterarr,selectColObj,orderBy,limit,offset,callback);
}

function filterservicecollection(filterarr,orderBy,limit,offset,callback){
  var selectColObj = '_id';
  db.getDatafromCollection(servicemanager,filterarr,selectColObj,orderBy,limit,offset,callback);
}

function websiteServiceMaster(service_name){

    serviceMaster = [];

    serviceMaster['DEEP CLEANING'] = 28;
    serviceMaster['SOFA SHAMPOO'] = 97;
    serviceMaster['CARPET SHAMPOO'] = 139;
    serviceMaster['FOUR HOUR EXPRESS CLEANING'] = 36;
    serviceMaster['BATHROOM CLEANING'] = 160;
    serviceMaster['OFFICE CLEANING'] = 717;
    serviceMaster['FLOOR POLISHING'] = 118;
    serviceMaster['MATTRESS & CURTAIN STEAMING'] = 466;
    serviceMaster['GENERAL PEST MANAGEMENT (AMC)'] = 208;
    serviceMaster['BED BUGS CONTROL (AMC)'] = 280;
    serviceMaster['TERMITE CONTROL (AMC)'] = 304;
    serviceMaster['GENERAL PEST MANAGEMENT (SINGLE SERVICE)'] = 184;
    serviceMaster['RODENT CONTROL (AMC)'] = 256;
    serviceMaster['CARPENTER'] = 475;
    serviceMaster['ELECTRICIAN'] = 477;
    serviceMaster['PLUMBER'] = 476;
    serviceMaster['ECO CAR CARE'] = 388;
    serviceMaster['PREMIUM CAR CARE'] = 391;
    serviceMaster['AC SERVICING (AMC)'] = 370;
    serviceMaster['AC SERVICING (SINGLE SERVICE)'] = 352;
    serviceMaster['AC INSTALLATION'] = 792;
    serviceMaster['INTERIOR PAINTING'] = 460;
    serviceMaster['HOME HEALTH CHECKUP'] = 915;


    return serviceMaster[service_name];
    



  }

  function websiteVariantMaster(variant_name){
    var variantMaster = [];

    variantMaster['1 RK (0 - 300 Sq. Ft.)'] = 1;
    variantMaster['1 BHK (301 - 600 Sq. Ft.)'] = 2;
    variantMaster['2 BHK (601 - 1000 Sq. Ft.)'] = 3;
    variantMaster['3 BHK (1001 - 1500 Sq. Ft.)'] = 4;
    variantMaster['4 BHK Regular (1501 - 2100 Sq. Ft.)'] = 5;
    variantMaster['4 BHK Large (2101 - 2500 Sq. Ft.)'] = 12;
    variantMaster['5 BHK (2501 - 3000 Sq. Ft.)'] = 6;
    variantMaster['6 BHK & above (3001 - 10000 Sq. Ft.)'] = 55;
    variantMaster['0 - 1 Hour'] = 63;
    variantMaster['1 - 2 Hours'] = 55;
    variantMaster['2 - 4 Hours'] = 55;
    variantMaster['4 - 6 Hours'] = 55;
    variantMaster['6 - 8 Hours'] = 55;
    variantMaster['Eco'] = 55;
    variantMaster['1'] = 7;
    variantMaster['2'] = 8;
    variantMaster['3'] = 9;
    variantMaster['4'] = 10;
    variantMaster['5'] = 11;
    variantMaster['0-300 Sq. Ft.'] = 32;
    variantMaster['301-600 Sq. Ft.'] = 65;
    variantMaster['601-1100 Sq. Ft.'] = 67;
    variantMaster['1101-1500 Sq. Ft.'] = 21;
    variantMaster['1501-2000 Sq. Ft.'] = 22;
    variantMaster['2001-2500 Sq. Ft.'] = 23;
    variantMaster['2501-3000 Sq. Ft.'] = 24;
    variantMaster['3001-10000 Sq. Ft.'] = 46;
    

    return variantMaster[variant_name];

  }

  function getMonthNumber() {

    var monthArr = {};

    monthArr['January'] = 1;
    monthArr['February'] = 2;
    monthArr['March'] = 3;
    monthArr['April'] = 4;
    monthArr['May'] = 5;
    monthArr['June'] = 6;
    monthArr['July'] = 7;
    monthArr['August'] = 8;
    monthArr['September'] = 9;
    monthArr['October'] = 10;
    monthArr['November'] = 11;
    monthArr['Devember'] = 12;

    return monthArr;

  }



module.exports = LeadManager;
