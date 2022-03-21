
var routes = require('express').Router();
var mysql = require('mysql');

var servicemanager = require('../../../app/models/servicemanagerModel');



var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "mhcdbuser",
  password: "mhc123",
  database : 'mhc'
});


routes.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  // console.log('Call made by-- Prashant Verma');
  next()
});



routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

// logic for pagination and limit needs to be implemeted
routes.get('/getAllServices', (req, res) => {
  var keyValueArray = {};
  var searchArr = {}
  var paginationSettings = {};
  var service = new servicemanager();
  var offset =0;
  var oB = {};
  var data = JSON.parse(req.query.data);

  //console.log(data);

  searchArr  = data['searchVal'];



  if(data.paginationSettings != undefined) {
    paginationSettings = data.paginationSettings;
  } else {
    paginationSettings = {};
  }

  if(data.orderBy != undefined) {
    oB = data.orderBy;
  } else {
    oB = {};
  }
  var limit = 10;
  var offset = 0;

  if (paginationSettings !=null && paginationSettings!=undefined) {
    limit = paginationSettings.limit;
    offset = paginationSettings.offset;
  }

  var orderBy = {
    created_on: -1
  };

  if(Object.keys(oB).length > 0) {
    orderBy = oB;
  }


  service.getAllServices(searchArr,'',orderBy,limit,offset,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});


routes.get('/getAllServicesOrganic', (req, res) => {
  var keyValueArray = {};
  var searchArr = {}
  var paginationSettings = {};
  var service = new servicemanager();
  var offset =0;
  var oB = {};
  var data = JSON.parse(req.query.data);

  searchArr  = data['searchVal'];
  paginationSettings = data.paginationSettings;
  oB = data.orderBy;
  var limit = 10;
  var offset = 0;

  if (paginationSettings !=null && paginationSettings!=undefined) {
    limit = paginationSettings.limit;
    offset = paginationSettings.offset;
  }

  var orderBy = {
    created_on: -1
  };

  if(Object.keys(oB).length > 0) {
    orderBy = oB;
  }


  service.getAllServicesOrganic(searchArr,'',orderBy,limit,offset,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});

//getAllServicesPartner
routes.get('/getAllServicesPartner', (req, res) => {
  var keyValueArray = {};
  var searchArr = {}
  var paginationSettings = {};
  var service = new servicemanager();
  var offset =0;
  var oB = {};
  var data = JSON.parse(req.query.data);

  searchArr  = data['searchVal'];
  paginationSettings = data.paginationSettings;
  oB = data.orderBy;
  var limit = 10;
  var offset = 0;

  if (paginationSettings !=null && paginationSettings!=undefined) {
    limit = paginationSettings.limit;
    offset = paginationSettings.offset;
  }

  var orderBy = {
    created_on: -1
  };

  if(Object.keys(oB).length > 0) {
    orderBy = oB;
  }


  service.getAllServicesPartner(searchArr,'',orderBy,limit,offset,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});



routes.get('/getServiceAddress', (req, res) => {
  var searchArr = {}
  searchArr = JSON.parse(req.query.data);
  //console.log(searchArr);
  var service = new servicemanager();

  var offset =0;
  var response = {};

  service.getServiceAddress(searchArr,'','',0,offset,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});

routes.put('/updateServiceInfo/:id', (req, res) => {
  var id = req.params.id;
  var response = {};
  var whereArr = {};
  var updateVal = {};
  var options = null;
  var service = new servicemanager();
  if (id != "") {
    whereArr['_id'] = id;
  }

  updateVal = req.body.serviceData;
  //console.log(updateVal['lead_history']);

  service.updateServiceInfo(whereArr,updateVal,options,function(data){
      response  = data;
      res.status(200).json({ message: response });
  })

});


routes.post('/updateServiceLeadStage', (req, res) => {
    var service = new servicemanager();
    var response = {};
    var updateVal = {};
    var insertObj = {};

    insertObj = req.body.data;
    orderObj = insertObj.orderData;
    updateVal = insertObj.serviceData;

    console.log("Service Manager Controller");
    console.log(insertObj);

    service.updateServiceLeadStage(orderObj,updateVal,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});



routes.post('/addNewService', (req, res) => {
    var service = new servicemanager();
    var response = {};
    var insertObj = {};

    insertObj = req.body.serviceData;

    service.addNewService(insertObj,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});

routes.delete('/deleteServiceInfo/:id', (req, res) => {
    var service = new servicemanager();
    var id = req.params.id;
    var response = {};
    var deleteArr = {};
    // if (id>0) {
      deleteArr['_id'] = id;
    // }
    // console.log(deleteArr);

    if(id != undefined && id != null && id != "") {

      service.deleteServiceInfo(deleteArr,function (data) {
        response = data;
        res.status(200).json({ message: response });
      });

    } 

  });

  routes.get('/getVariant', (req, res) => {

    var searchArr = {}
    var service = ''
    searchArr = JSON.parse(req.query.data);
    console.log(searchArr);
    var qryString = "SELECT  DISTINCT(varianttype) FROM mhc.pricelist where name='" + searchArr['name'] + "'";
    con.query(qryString,function(err,rows){

      if(err) throw err;

      res.status(200).json({ message: rows });
    });


  });

  routes.get('/getServicePrice', (req, res) => {

    var searchArr = {}
    var service= '';
    var variantid =0;
    var city =0;
    var leadsourceid =5;
    searchArr = JSON.parse(req.query.data);

    service = searchArr['service'];
    variantid = searchArr['variantid'];
    if (searchArr.hasOwnProperty('city')) {
     city = searchArr['city'];
    }

    if (searchArr.hasOwnProperty('leadsourceid')) {
      leadsourceid = searchArr['leadsourceid'];
    }
    //console.log(searchArr);
    var qryString = "Select price as pre_tax_cost, taxed_cost,commission,teamleader_deployment,supervisor_deployment,janitor_deployment  FROM mhc.pricelist where name ='"+ service+"' and varianttype ="+variantid+" and city = "+city+" and lead_source="+ leadsourceid;
    con.query(qryString,function(err,rows){
      if(err) throw err;

      res.status(200).json({ message: rows });
    });


  });

  routes.post('/submitemail', (req, res) => {
      var searchArr = {}
      emailid = req.query.data;
      console.log(emailid);
      // var service = new servicemanager();
      //
      // var offset =0;
      // var response = {};

      var qryString = "Insert into vennemail (email_id) Values ('" + emailid + "')";
      console.log(qryString);
      con.query(qryString,function(err,rows){
        if(err) throw err;

        res.status(200).json({ message: rows });
      });

    });
module.exports = routes;
