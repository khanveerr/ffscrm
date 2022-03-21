
var routes = require('express').Router();

var amcservicemanager = require('../../../app/models/amcservicemanagerModel');

routes.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now())
  // console.log('Call made by-- Prashant Verma');
  next()
});



routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

// logic for pagination and limit needs to be implemeted
routes.get('/getAllAMCServices/:id', (req, res) => {
  var id = req.params.id;
  var keyValueArray= {};

  if(id != undefined && id != null) {
    keyValueArray['amc_id'] = id;
  }
  var offset =0;
  // var searchArr = {};
  // searchArr = req.query;
  //console.log(searchArr['primary_contact_no']);
  var service = new amcservicemanager();
  var response = {};

  service.getAllAMCServices(keyValueArray,'','',0,offset,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});

routes.get('/getAMCServiceInfo', (req, res) => {
  var id = req.params.id;
  // keyValueArray['_id'] = id;
  var searchArr = {};
  searchArr = req.query;
  //console.log(searchArr['primary_contact_no']);
  var service = new amcservicemanager();
  var response = {};
  var offset =0;

  service.getAllAMCServices(searchArr,'','',0,offset,function(data){
    response = data;
      res.status(200).json({ message: response });
  });

});

routes.put('/updateAMCServiceInfo/:id', (req, res) => {
  var id = req.params.id;
  var response = {};
  var whereArr = {};
  var updateVal = {};
  var options = null;
  var service = new amcservicemanager();
  // if (id>0) {
    whereArr['_id'] = id;
  // }

  updateVal = req.body.amcServiceData;


  service.updateAMCServiceInfo(whereArr,updateVal,options,function(data){
      response  = data;
      res.status(200).json({ message: response });
  })

});

routes.put('/updateAMCByAMCId/:id', (req, res) => {
  var id = req.params.id;
  var response = {};
  var whereArr = {};
  var updateVal = {};
  var options = { multi: true };
  var service = new amcservicemanager();
  // if (id>0) {
    whereArr['amc_id'] = id;
  // }

  updateVal = req.body.amcServiceData;


  service.updateAMCServiceInfo(whereArr,updateVal,options,function(data){
      response  = data;
      res.status(200).json({ message: response });
  })

});

routes.post('/addNewAMCService', (req, res) => {
    var service = new amcservicemanager();
    var response = {};
    var insertObj = {};
    insertObj = req.body.amcData;
    // insertObj.amc_id = "582da248ffb0b87c3229ac78";
    // insertObj.amc_label = "Service-1";
    // insertObj.service_address ="582b05cf321a38a82bbe969a";
    // insertObj.service_id = 42;
    // insertObj.variant_type_id = 7;
    // insertObj.additional_variant = "3 BHK";
    // insertObj.service_date = [new Date(2016,11,10).toISOString()];
    // insertObj.service_time =[ new Date(2016,11,10,10,30,0).toISOString()];
    // insertObj.duration_of_service = 1;
    // insertObj.no_of_team_leader = 1;
    // insertObj.no_of_supervisor =2;
    // insertObj.no_of_janitor =3;
    // insertObj.crm_remark = [
    //   {
    //     "remark" :"Customer wants to have AMC",
    //     "added_by" :"Prashant"
    //   }
    // ];
    // insertObj.ops_remark =   [
    //   {
    //     "remark" :"Customer wants to have AMC",
    //     "added_by" :"Prashant"
    //   }
    // ];
    // insertObj.accounts_remark = [{
    //   "remark" :"Customer wants to have AMC",
    //   "added_by" :"Prashant"
    // }];

    // insertObj.service_rating =5;
    // insertObj.crm_rating = 5;
    // insertObj.service_status = 12;
    // insertObj.is_order =1;
    // insertObj.created_by = "Prashant";
    // insertObj.updated_by = "Prashant";
    // insertObj.status = 0;

    // console.log(insertObj);

    service.addNewAMCService(insertObj,function(data){
        response  = data;
        res.status(200).json({ message: response });
    });
});

routes.delete('/deleteAMCService/:id', (req, res) => {
    var service = new amcservicemanager();
    var id = req.params.id;
    var response = {};
    var deleteArr = {};
    // if (id>0) {
      deleteArr['_id'] = id;
    // }
    // console.log(deleteArr);
    service.deleteAMCServiceInfo(deleteArr,function (data) {
      response = data;
      res.status(200).json({ message: response });
    });

  });


module.exports = routes;
