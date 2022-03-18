
var routes = require('express').Router();

var leadmanager = require('../../../app/models/leadmanagerModel');
var invoicemanager = require('../../../app/models/invoicemanagerModel');
var servicemanager = require('../../../app/models/servicemanagerModel');
var amcmanager = require('../../../app/models/amcservicemanagerModel');
var filtermanager = require('../../../app/models/filtermanagerModel');


routes.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  // console.log('Call made by-- Prashant Verma');
  next();
});



routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

// logic for pagination and limit needs to be implemeted
routes.get('/getAllLeads', (req, res) => {
  var keyValueArray = {};
  var data = {};
  var searchArr = {}
  var paginationSettings = {};
  data = JSON.parse(req.query.data);

  console.log(data);
  searchArr  = data['searchVal'];
  paginationSettings = data.paginationSettings;
  var limit = 10;
  var offset = 0;

  // if(req.query['data'] != null && req.query['data'] != undefined ) {
  //   searchArr = JSON.parse(req.query.data);
  // }
  console.log(data);
  console.log("Hi");
  console.log(searchArr);
  console.log(paginationSettings);
  //console.log(searchArr['primary_contact_no']);
  var lead = new leadmanager();
  var response = {};
  if (paginationSettings !=null && paginationSettings!=undefined) {
    limit = paginationSettings.limit;
    offset = paginationSettings.offset;
  }



  var orderBy = {
    created_on: -1
  };

  lead.getAllLeads(searchArr,'',orderBy,limit,offset,function(data){
    response = data;
    console.log(data);
      res.status(200).json({ message: response });
  });

});


// logic for pagination and limit needs to be implemeted
routes.get('/getAllServiceLeads', (req, res) => {
  var keyValueArray = {};
  var data = {};
  var searchArr = {}
  var paginationSettings = {};
  data = JSON.parse(req.query.data);

  console.log(data);
  searchArr  = data['searchVal'];
  paginationSettings = data.paginationSettings;
  var limit = 10;
  var offset = 0;

  // if(req.query['data'] != null && req.query['data'] != undefined ) {
  //   searchArr = JSON.parse(req.query.data);
  // }
  console.log(data);
  console.log("Hi");
  console.log(searchArr);
  console.log(paginationSettings);
  //console.log(searchArr['primary_contact_no']);
  var lead = new leadmanager();
  var response = {};
  if (paginationSettings !=null && paginationSettings!=undefined) {
    limit = paginationSettings.limit;
    offset = paginationSettings.offset;
  }



  var orderBy = {
    created_on: -1
  };

  lead.getServiceLead(searchArr,'',orderBy,limit,offset,function(data){
    response = data;
    //console.log(data);
      res.status(200).json({ message: response });
  });

});


routes.get('/getFilterAllLeads', (req, res) => {
  var keyValueArray = {};
  var data = {};
  var searchArr = {}
  var paginationSettings = {};
  data = JSON.parse(req.query.data);

  console.log(data);
  searchArr  = data['searchVal'];
  paginationSettings = data.paginationSettings;
  var limit = 10;
  var offset = 0;

  // if(req.query['data'] != null && req.query['data'] != undefined ) {
  //   searchArr = JSON.parse(req.query.data);
  // }
  console.log(data);
  console.log("Hi");
  console.log(searchArr);
  console.log(paginationSettings);
  //console.log(searchArr['primary_contact_no']);
  var lead = new leadmanager();
  var response = {};
  if (paginationSettings !=null && paginationSettings!=undefined) {
    limit = paginationSettings.limit;
    offset = paginationSettings.offset;
  }

  var orderBy = {
    created_on: -1
  };



  lead.filterAllLeads(searchArr,'',orderBy,limit,offset,function(data){
    response = data;
    //console.log(data);
      res.status(200).json({ message: response });
  });

});


routes.put('/updateLeadInfo/:id', (req, res) => {
  var id = req.params.id;
  var response = {};
  var whereArr = {};
  var updateVal = {};
  var options = null;
  var lead = new leadmanager();
  if (id != "") {
    whereArr['_id'] = id;
  }

  updateVal = req.body.leadData;

  //console.log(req.params.id);
  // console.log(updateObj);
  // console.log(whereArr);
  //console.log(updateVal);

  lead.updateLeadInfo(whereArr,updateVal,options,function(data){
      response  = data;
      res.status(200).json({ message: response });
  });

});

routes.post('/addNewLead', (req, res) => {
    var lead = new leadmanager();
    var response = {};
    var insertObj = {};

    // insertObj.client_details = "582b05cf321a38a82bbe9699";
    // insertObj.followup_by = "Prashant";
    // insertObj.leadsource = 23;
    // insertObj.leadowner = 2
    // insertObj.service_obj = ["582da248ffb0b87c3229ac78"];
    // insertObj.has_amc = 1;
    // insertObj.status =0;

    insertObj = req.body.leadData;
    // console.log(insertObj);

    lead.addNewLead(insertObj,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});

routes.post('/saveLead', (req, res) => {
    var lead = new leadmanager();
    var response = {};
    var leadObj = {};
    var serviceObjArr = [];
    var inspectionObjArr = [];


    // insertObj.client_details = "582b05cf321a38a82bbe9699";
    // insertObj.followup_by = "Prashant";
    // insertObj.leadsource = 23;
    // insertObj.leadowner = 2
    // insertObj.service_obj = ["582da248ffb0b87c3229ac78"];
    // insertObj.has_amc = 1;
    // insertObj.status =0;

    insertObj = req.body.leadData;

    leadObj = insertObj.leadObj;
    serviceObjArr = insertObj.serviceObjArr;
    console.log("In Lead Controller");
    console.log(insertObj);

    lead.saveLead(leadObj,serviceObjArr,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});

routes.post('/saveWebsiteLead', (req, res) => {
    var lead = new leadmanager();
    var response = {};
    var leadObj = {};
    var serviceObjArr = [];
    var inspectionObjArr = [];
    var clientObj = {};
    var addressObj = {};
    var serviceObj = {};
    var names = [];
    var city = "";
    var city_id = 1;
    var state = "Maharashtra";
    var variant_arr = [];
    var dataObj = {};


    // insertObj.client_details = "582b05cf321a38a82bbe9699";
    // insertObj.followup_by = "Prashant";
    // insertObj.leadsource = 23;
    // insertObj.leadowner = 2
    // insertObj.service_obj = ["582da248ffb0b87c3229ac78"];
    // insertObj.has_amc = 1;
    // insertObj.status =0;

    insertObj = JSON.parse(req.body.args_mhc);

    console.log(insertObj);
    console.log(insertObj.username);
    console.log(insertObj.username.trim());


    clientObj.primary_email_id = insertObj.email;
    var uname = insertObj.username.trim();
    names = uname.split(" ");
    if(names.length > 1) {
      clientObj.firstname = names[0];
      clientObj.lastname = names[1];
    } else {
      clientObj.firstname = names[0];
    }
    clientObj.primary_contact_no = (insertObj.number != "") ? insertObj.number : insertObj.number;
    city = (insertObj.usercity != "") ? insertObj.usercity : "";

    if(city == "Bangalore") {
      city_id = 2;
      state = "Karnatka";
    }

    if(city == "Delhi (NCR)") {
      city_id = 3;
      state = "Delhi";
    }

    addressObj.address = insertObj.address;
    addressObj.city_id = city_id;
    addressObj.state = state;

    serviceObj.city = city_id;

    serviceObj.service = (insertObj.service != "" && insertObj.service != undefined) ? insertObj.service : "";
    serviceObj.service_date = (insertObj.date != "" && insertObj.date != undefined) ? insertObj.date : "";
    serviceObj.service_time = (insertObj.time != "" && insertObj.time != undefined) ? insertObj.time : "";
    serviceObj.taxed_cost = (insertObj.ser_price != "" && insertObj.ser_price != undefined) ? insertObj.ser_price : "";
    variant_arr = (insertObj.parameter_value != "") ? JSON.parse(insertObj.parameter_value) : '';
    serviceObj.variant_name = (variant_arr.length > 0) ? variant_arr['param_0'] : "";
    if(insertObj.hasOwnProperty('landing_source')) {
      serviceObj.landing_source = (insertObj.landing_source != "") ? insertObj.landing_source : '';
    } else {
      serviceObj.landing_source = '';
    }


    dataObj= {
      'clientObj': clientObj,
      'addressObj': addressObj,
      'serviceObj': serviceObj
    };



    // leadObj = insertObj.leadObj;
    // serviceObjArr = insertObj.serviceObjArr;
    // console.log("In Lead Controller");
    // console.log(insertObj);

    lead.saveWebsiteLead(dataObj,serviceObjArr,function(data){
        // response  = data;
        // res.status(200).json({ message: response });
    });
});



routes.post('/updateLead', (req, res) => {
    var lead = new leadmanager();
    var response = {};
    var leadObj = {};
    var serviceObjArr = [];
    var service_id_arr = [];
    var service_obj_arr = [];
    var client_id = '';
    var leadid = '';


    insertObj = req.body.leadData;

    console.log(insertObj);

    leadid = insertObj.leadid;
    serviceObjArr = insertObj.serviceObjArr;
    if(insertObj.service_id_arr != undefined) {
      service_id_arr = insertObj.service_id_arr;
    } else {
      service_id_arr = [];
    }

    if(insertObj.service_obj_arr != undefined) {
      service_obj_arr = insertObj.service_obj_arr;
    } else {
      service_obj_arr = [];
    }
    
    client_id = insertObj.client_id;
    // console.log(insertObj);

    lead.updateLead(leadid,serviceObjArr,service_id_arr,service_obj_arr,client_id,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});

routes.post('/deleteLead', (req, res) => {
    var lead = new leadmanager();
    var response = {};
    var leadid = '';


    insertObj = (req.body.leadData);

    leadid = insertObj['_id'];


    console.log(insertObj);
    console.log("This is the test");

    lead.deleteLead(leadid,function(data){
        response  = data;
        res.status(200).json({ message: response });

    });
});

routes.post('/deleteService', (req, res) => {
    var lead = new leadmanager();
    var response = {};
    var leadid = '';
    var serviceid = '';


    insertObj = req.body.leadData;

    leadid = insertObj.leadid;
    serviceid = insertObj.serviceid;


    // console.log(insertObj);

    lead.removeServicefromLead(leadid,serviceid,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});

routes.delete('/deleteClientInfo/:id', (req, res) => {
    var lead = new leadmanager();
    var id = req.params.id;
    var response = {};
    var deleteArr = {};
    // if (id>0) {
      deleteArr['_id'] = id;
    // }
    // console.log(deleteArr);
    lead.deleteLeadInfo(deleteArr,function (data) {
      response = data;
      res.status(200).json({ message: response });
    });

  });

  routes.get('/generateInvoice', (req, res) => {
    var keyValueArray = {};
    var data = {};
    var leadid = '';
    var serviceidArr = [];
    var send_sms = false;
    var invoice_type = 0;
    // var paginationSettings = {};
    data = JSON.parse(req.query.data);

    console.log(data);
    leadid  = data['lead_id'];
    serviceidArr = data['serviceid_arr'];
    send_sms = data['send_sms'];
    invoice_type = data['invoice_type'];
    console.log("Invoice Controller");
    console.log(leadid);
    console.log(serviceidArr);
    var invoice = new invoicemanager();
    var response = {};

    invoice.generateInvoice(leadid,serviceidArr,send_sms,invoice_type,function(data){
      response = data;
      console.log(data);
        res.status(200).json({ message: response });
    });

  });

  routes.get('/sendEmail', (req, res) => {
    var keyValueArray = {};
    var data = {};
    var to = '';
    var subject = '';
    var cc = '';
    var body = '';
    // var paginationSettings = {};
    data = JSON.parse(req.query.data);

    console.log(data);
    to  = data['to'];
    subject = data['subject'];
    cc = data['cc'];
    body = data['body'];

    console.log(to);
    //console.log(body);
    var invoice = new invoicemanager();
    var response = {};

    invoice.sendEmail(to,subject,cc,body,'',function(data){
      response = data;
      console.log(data);
        res.status(200).json({ message: response });
    });

  });


  routes.get('/sendInvoice', (req, res) => {
    var keyValueArray = {};
    var data = {};
    var to = '';
    var subject = '';
    var cc = '';
    var body = '';
    var invoiceobj = {};
    var invoice_input = {};
    // var paginationSettings = {};
    data = JSON.parse(req.query.data);

    console.log(data);
    to  = data['to'];
    invoice_input['lead_id'] = data['lead_id'];
    invoice_input['serviceid_arr'] = data['serviceid_arr'];
    invoice_input['send_sms'] = data['send_sms'];
    invoice_input['invoice_type'] = data['invoice_type'];


    console.log(to);
    //console.log(body);
    var invoice = new invoicemanager();
    var response = {};

    invoice.sendInvoice(to,invoice_input,function(data){
      response = data;
      console.log(data);
        res.status(200).json({ message: response });
    });

  });


//groupByDateOrganic

routes.get('/groupByDate', (req, res) => {
    var keyValueArray = {};
    var orderBy = {};
    var whereArr = '';
    // var paginationSettings = {};
    data = JSON.parse(req.query.data);

    keyValueArray  = data['keyValueArray'];
    orderBy = data['orderBy'];
    whereArr = data['whereArr'];

    //console.log("In Lead Controller");
    //console.log(data);

    var lead = new leadmanager();
    var response = {};

    lead.groupByDate(keyValueArray,orderBy,whereArr,function(result){
      //console.log("In Lead Controller response");
      //console.log(result);
      response = result;
      res.status(200).json({ message: response });
    });

  });


routes.get('/groupByDateOrganic', (req, res) => {
    var keyValueArray = {};
    var orderBy = {};
    var whereArr = '';
    // var paginationSettings = {};
    data = JSON.parse(req.query.data);

    keyValueArray  = data['keyValueArray'];
    orderBy = data['orderBy'];
    whereArr = data['whereArr'];

    //console.log("In Lead Controller");
    //console.log(data);

    var lead = new leadmanager();
    var response = {};

    lead.groupByDateOrganic(keyValueArray,orderBy,whereArr,function(result){
      //console.log("In Lead Controller response");
      //console.log(result);
      response = result;
      res.status(200).json({ message: response });
    });

  });


routes.get('/groupByDatePartner', (req, res) => {
    var keyValueArray = {};
    var orderBy = {};
    var whereArr = '';
    // var paginationSettings = {};
    data = JSON.parse(req.query.data);

    keyValueArray  = data['keyValueArray'];
    orderBy = data['orderBy'];
    whereArr = data['whereArr'];

    //console.log("In Lead Controller");
    //console.log(data);

    var lead = new leadmanager();
    var response = {};

    lead.groupByDatePartner(keyValueArray,orderBy,whereArr,function(result){
      //console.log("In Lead Controller response");
      //console.log(result);
      response = result;
      res.status(200).json({ message: response });
    });

  });



routes.get('/groupByLeadSource', (req, res) => {
    var keyValueArray = {};
    var orderBy = {};
    var whereArr = '';
    // var paginationSettings = {};
    data = JSON.parse(req.query.data);

    keyValueArray  = data['keyValueArray'];
    orderBy = data['orderBy'];
    whereArr = data['whereArr'];

    //console.log("In Lead Controller");
    //console.log(data);

    var lead = new leadmanager();
    var response = {};

    lead.groupByLeadSource(keyValueArray,orderBy,whereArr,function(result){
      //console.log("In Lead Controller response");
      //console.log(result);
      response = result;
      res.status(200).json({ message: response });
    });

});


routes.get('/groupByCategory', (req, res) => {
    var keyValueArray = {};
    var orderBy = {};
    var whereArr = '';
    // var paginationSettings = {};
    data = JSON.parse(req.query.data);

    keyValueArray  = data['keyValueArray'];
    orderBy = data['orderBy'];
    whereArr = data['whereArr'];

    //console.log("In Lead Controller");
    //console.log(data);

    var lead = new leadmanager();
    var response = {};

    lead.groupByCategory(keyValueArray,orderBy,whereArr,function(result){
      //console.log("In Lead Controller response");
      //console.log(result);
      response = result;
      res.status(200).json({ message: response });
    });

});


routes.get('/groupByCancellation', (req, res) => {
    var keyValueArray = {};
    var orderBy = {};
    var whereArr = '';
    // var paginationSettings = {};
    data = JSON.parse(req.query.data);

    keyValueArray  = data['keyValueArray'];
    orderBy = data['orderBy'];
    whereArr = data['whereArr'];

    //console.log("In Lead Controller");
    //console.log(data);

    var lead = new leadmanager();
    var response = {};

    lead.groupByCancellation(keyValueArray,orderBy,whereArr,function(result){
      //console.log("In Lead Controller response");
      //console.log(result);
      response = result;
      res.status(200).json({ message: response });
    });

  });


routes.get('/groupByLeadStage', (req, res) => {
    var keyValueArray = {};
    var orderBy = {};
    var whereArr = '';
    // var paginationSettings = {};
    data = JSON.parse(req.query.data);

    keyValueArray  = data['keyValueArray'];
    orderBy = data['orderBy'];
    whereArr = data['whereArr'];

    //console.log("In Lead Controller");
    //console.log(data);

    var lead = new leadmanager();
    var response = {};

    lead.groupByLeadStage(keyValueArray,orderBy,whereArr,function(result){
      //console.log("In Lead Controller response");
      //console.log(result);
      response = result;
      res.status(200).json({ message: response });
    });

  });


module.exports = routes;
