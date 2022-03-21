
var routes = require('express').Router();

var mhcclient = require('../../../app/models/mhcclientModel');

routes.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  // console.log('Call made by-- Prashant Verma');
  next()
});



routes.get('/', (req, res) => {
  res.status(200).jsonp({ message: 'Connected!' });
});

// logic for pagination and limit needs to be implemeted
routes.get('/getAllClient', (req, res) => {
  var keyValueArray = {};
  var searchArr = {};
  var offset =0;
  searchArr = JSON.parse(req.query.data);

  //console.log(searchArr);

  //console.log(searchArr['primary_contact_no']);
  var clients = new mhcclient();
  var response = {};

  clients.getAllClientsInfo(searchArr,'','',0,offset,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});
routes.get('/searchClient', (req, res) => {
  var keyValueArray = {};
  var searchArr = {}
  reqArr = JSON.parse(req.query.data);

  var limit =20;
  console.log(reqArr);
  console.log("Hi this is controller");
  //console.log(searchArr);

  //console.log(searchArr['primary_contact_no']);
  var clients = new mhcclient();
  var response = {};

  clients.searchClientsInfo(reqArr.keyValueObj,reqArr.colObj,'',limit,0,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});

routes.put('/updateClientInfo/:id', (req, res) => {
  var id = req.params.id;
  var response = {};
  var whereArr = {};
  var updateVal = {};
  var options = null;
  var clients = new mhcclient();
  //if (id>0) {
    whereArr['_id'] = id;
  //}
  var clients = new mhcclient();
  updateVal = req.body.clientContactData;

  // console.log(updateVal);
  // console.log(whereArr);

  clients.updateClientInfo(whereArr,updateVal,options,function(data){
      response  = data;
      res.status(200).json({ message: response });
  });

});

routes.put('/updateAddressInfo/:id', (req, res) => {
  var id = req.params.id;
  var response = {};
  var whereArr = {};
  var updateVal = {};
  var options = null;
  var clients = new mhcclient();
  //if (id>0) {
    whereArr['_id'] = id;
  //}
  var clients = new mhcclient();
  updateVal = req.body.clientAddressData;

  // console.log(updateVal);
  // console.log(whereArr);

  clients.updateAddressInfo(whereArr,updateVal,options,function(data){
      response  = data;
      res.status(200).json({ message: response });
  });

});

routes.post('/addNewClient', (req, res) => {
    var clients = new mhcclient();
    var response = {};
    var insertObj = {};
    var clientObj = {};
    var addressObj ={};

    insertObj = req.body.clientData;
    //console.log(insertObj);
    // clientObj.firstname = "Tanveer";
    // clientObj.lastname = "Khan";
    // clientObj.primary_contact_no = "9426838119";
    // // insertObj.alternate_contact_no = ["7738038119","9414141999"];
    // clientObj.primary_email_id = "tanveer.khan@mrhomecare.in";
    // clientObj.alternate_email_id = ["tk@gmail.com"];
    // clientObj.rating = 5;


    // addressObj.address = "Andheri East";
    // addressObj.landmark = "Near Jogeshwari";
    // addressObj.city = 1;
    // addressObj.latitude = "19.119677";
    // addressObj.longitude = "72.905081";
    // addressObj.is_primary = 1;

    // insertObj.clientdetails = clientObj;
    // insertObj.addressdetails = addressObj;


    // console.log(insertObj);
    clients.addNewClient(insertObj,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});

routes.delete('/deleteClientInfo/:id', (req, res) => {
    var clients = new mhcclient();
    var id = req.params.id;
    var response = {};
    var deleteArr = {};
    // if (id>0) {
      deleteArr['_id'] = id;
    // }
    // console.log(deleteArr);
    clients.deleteClientInfo(deleteArr,function (data) {
      response = data;
      res.status(200).json({ message: response });
    });

  });


routes.post('/addClientAddress', (req, res) => {
    var clients = new mhcclient();
    var response = {};
    var existingAddr = [];
    var clientObj = {};
    var whereArr = {};
    var addressObj ={};
    var whereOptions = null;

    var updateVal = req.body.clientAddressData;

    //console.log(updateVal);


    // addressObj.address = "Andheri East";
    // addressObj.landmark = "Near Jogeshwari";
    // addressObj.city = 1;
    // addressObj.latitude = "19.119677";
    // addressObj.longitude = "72.905081";
    // addressObj.is_primary = 1;



    whereArr['_id'] = updateVal.client_id;
    //console.log(whereArr);
    addressObj = updateVal.addressObj;
    //console.log(addressObj);
    if(updateVal.old_address_id != undefined && updateVal.old_address_id.length > 0) {
      existingAddr =  updateVal.old_address_id;
    }
    //console.log(existingAddr);


    //console.log(typeof(updateVal.old_address_id));

    clients.addClientAddress(whereArr,addressObj,existingAddr,whereOptions,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });

  });



module.exports = routes;
