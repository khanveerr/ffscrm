
var routes = require('express').Router();

var leadmanager = require('../../../app/models/leadmanagerModel');
var ordermanager = require('../../../app/models/ordermanagerModel');
var servicemanager = require('../../../app/models/servicemanagerModel');
var amcmanager = require('../../../app/models/amcservicemanagerModel');


routes.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  // console.log('Call made by-- Prashant Verma');
  next()
});



routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

// logic for pagination and limit needs to be implemeted
routes.get('/getAllOrders', (req, res) => {
  var keyValueArray = {};
  var searchArr = {}
  var paginationSettings = {};
  var selectCol = '';
  var oB = {};
  data = JSON.parse(req.query.data);

  console.log(data);
  searchArr  = data['searchVal'];
  paginationSettings = data.paginationSettings;
  if(data.hasOwnProperty('selectCol')) {
    selectCol = data.selectCol;
  }
  oB = data.orderBy;
  var limit = 10;
  var offset = 0;
  //console.log(searchArr['primary_contact_no']);
  var order = new ordermanager();
  var response = {};
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


  order.getAllOrders(searchArr,selectCol,orderBy,limit,offset,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});


routes.get('/filterAllOrders', (req, res) => {
  var keyValueArray = {};
  var searchArr = {}
  var paginationSettings = {};
  var oB = {};
  data = JSON.parse(req.query.data);

  console.log(data);
  searchArr  = data['searchVal'];
  paginationSettings = data.paginationSettings;
  oB = data.orderBy;
  var limit = 10;
  var offset = 0;
  //console.log(searchArr['primary_contact_no']);
  var order = new ordermanager();
  var response = {};
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

  order.filterAllOrders(searchArr,'',orderBy,limit,offset,function(data){
    console.log("Order Controller");
    console.log(limit + ' : ' + offset);
    response = data;
      res.status(200).json({ message: response });
  });

});



routes.put('/updatedOrder/:id', (req, res) => {
  var id = req.params.id;
  var response = {};
  var whereArr = {};
  var updateVal = {};
  var options = null;
  var order = new ordermanager();
  // if (id>0) {
    whereArr['_id'] = id;
  // }

  updateVal = req.body.orderData;


  order.updatedOrder(whereArr,updateVal,options,function(data){
      response  = data;
      res.status(200).json({ message: response });
  })

});

routes.put('/updatedLeadOrder/:serviceid', (req, res) => {
  var serviceid = req.params.serviceid;
  var response = {};
  var whereArr = {};
  var updateVal = {};
  var options = null;
  var order = new ordermanager();
  // if (id>0) {
    whereArr['service_details'] = serviceid;
  // }

  updateVal = req.body.orderData;


  order.updatedOrder(whereArr,updateVal,options,function(data){
      response  = data;
      res.status(200).json({ message: response });
  })

});

routes.put('/updatedOrderByAMCId/:amcid', (req, res) => {
  var amcid = req.params.amcid;
  var response = {};
  var whereArr = {};
  var updateVal = {};
  var options = null;
  var order = new ordermanager();
  // if (id>0) {
    whereArr['amc_service_details'] = amcid;
  // }

  updateVal = req.body.orderData;


  order.updatedOrder(whereArr,updateVal,options,function(data){
      response  = data;
      res.status(200).json({ message: response });
  })

});


routes.post('/insertOrder', (req, res) => {
    var order = new ordermanager();
    var response = {};
    var insertObj = {};

    insertObj = req.body.orderData;
    // console.log(insertObj);

    order.insertOrder(insertObj,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});


routes.delete('/deleteOrder/:id', (req, res) => {
    var order = new ordermanager();
    var id = req.params.id;
    var response = {};
    var deleteArr = {};
    // if (id>0) {
      deleteArr['_id'] = id;
    // }
    // console.log(deleteArr);
    order.deleteOrder(deleteArr,function (data) {
      response = data;
      res.status(200).json({ message: response });
    });

  });

  routes.get('/latestAmcOrders', (req, res) => {
    var keyValueArray = {};
    var searchArr = {};
    data = JSON.parse(req.query.data);

    console.log(data);
    searchArr  = data['service_id'];

    //console.log(searchArr['primary_contact_no']);
    var order = new ordermanager();
    var response = {};


    order.getLatestAMCserviceDetails(searchArr,function(data){
      response = data;
        res.status(200).json({ message: response });
    });

  });


routes.get('/latestAmcOrders', (req, res) => {
    var keyValueArray = {};
    var searchArr = {};
    data = JSON.parse(req.query.data);

    console.log(data);
    searchArr  = data['service_id'];

    //console.log(searchArr['primary_contact_no']);
    var order = new ordermanager();
    var response = {};


    order.getLatestAMCserviceDetails(searchArr,function(data){
      response = data;
        res.status(200).json({ message: response });
    });

  });


module.exports = routes;
