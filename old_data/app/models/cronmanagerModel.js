
var dbWrapper = require('../../dbWrapper.js');
var db = new dbWrapper();
var leadmanager   = require('../../app/schema/leadmanager');
var servicemanager = require('../../app/schema/servicemanager');
var amcservicemanager = require('../../app/schema/amcservicemanager');
var ordermanager = require('../../app/schema/ordermanager');
var clientmanager = require('../../app/schema/mhc-client');
var inspectionmanager   = require('../../app/schema/inspectionmanager');
var mongoose   = require('mongoose');
var cron = require('node-cron');
var cache = require('../../config/cache');
var moment = require('moment');
var services = {};
var PHPUnserialize = require('php-unserialize');
var invoice = require('../../app/models/invoicemanagerModel');
var request = require('request');
var Bitly = require('bitly');
var bitly = new Bitly('61e1ebd5774328073ab57799c9d0e3d9c4df60b7');

function CronManager(){


}


CronManager.prototype.scheduleConfirmJob = function(selectColObj='',orderBy='',limit=0,offset=0){

  cache.getMulti(['pricelist'], function(error, result){

    for(var mykey in result ){
      if (result.hasOwnProperty(mykey)) {
        result[mykey] = PHPUnserialize.unserialize(result[mykey]);
      };
    }
    services = result;
    //console.log(services);
  //res.status(200).json({ message: result });

    sendConfirmation(selectColObj,orderBy,limit,offset);

  });




   // db.getPopulatedDatafromCollection(leadmanager,populate_obj,leads_detail_match,selectColObj,orderBy,limit,offset,function(result){
      
   //  console.log(result.length);

   //  // for (var i = result.length - 1; i >= 0; i--) {
   //  //   console.log(result[i].service_obj);
   //  // };



   //  // cron.schedule('* * * * *', function(){      
   //  //   console.log('running a task every minute');
   //  // });

   // });

}


function sendConfirmation(selectColObj,orderBy,limit,offset) {

var pricelist = services.pricelist;

var leads_detail_match = {};
var service_detial_match= {};
var client_details_match = {};
var email_arr = [];
var phone_arr = [];
var firstName_arr = [];
var service_Arr = [];

var today_date = moment().format('YYYY-MM-DD');
var tomorrow_date = moment().add(1,'days').format('YYYY-MM-DD');


  //leads_detail_match['status'] = 0;
  service_detial_match['service_date'] = {"$gt": (new Date(today_date)).toISOString(), "$lte": (new Date(tomorrow_date)).toISOString()};
  service_detial_match['service_status'] = 0;
  service_detial_match['status'] = 0;
  service_detial_match['is_order'] = 1;

  //console.log(service_detial_match);
  //console.log(order_detail_match);


  // if (service_detial_match != null && service_detial_match!= undefined) {
  //   var populate_obj = [
  //     { path: 'service_obj', match: service_detial_match, model: 'ServiceManager'}
  //  ];
  // }

  // else {
  //   var populate_obj = 'client_details service_obj service_obj.amcservices';

  // }

  if (service_detial_match != null && service_detial_match!= undefined) {
    var populate_obj = [
        { path: 'client_details', match: client_details_match, model: 'Clientdetails' },
      { path: 'service_obj', match: service_detial_match, model: 'ServiceManager'}

   ];
  }

  else {
    var populate_obj = 'client_details service_obj service_obj.amcservices';

  }

  var service_name_arr = [];
  var service_date_arr = {};
  var service_time_arr = {};
  var leadServiceArr = [];


   db.getDatafromCollection(servicemanager,service_detial_match,'_id',orderBy,limit,offset,function(result){
      
      //console.log(result);
      var serviceIdArr = [];

      for (var i = result.length - 1; i >= 0; i--) {
        serviceIdArr.push(result[i]['_id'].toString());
      };

      //console.log(serviceIdArr);

      leads_detail_match['service_obj'] = {"$in": result};

      db.getPopulatedDatafromCollection(leadmanager,populate_obj,leads_detail_match,'client_details service_obj',orderBy,limit,offset,function(lead){

          //console.log(lead);

          for (var j = lead.length - 1; j >= 0; j--) {

              service_name_arr = [];
              service_date_arr = [];
              service_time_arr = [];
              
              for (var k = lead[j]['service_obj'].length - 1; k >= 0; k--) {
                
                if(serviceIdArr.indexOf(lead[j]['service_obj'][k]['_id'].toString()) != -1) {
                  //console.log(serviceIdArr.indexOf(lead[j]['service_obj'][k]));
                  if(lead[j]['service_obj'] != undefined) {
                    service_name_arr.push(pricelist[lead[j]['service_obj'][k]['service_id']]);
                    service_date_arr.push(moment(lead[j]['service_obj'][k]['service_date'][0]).format('Do MMMM, YYYY'));
                    service_time_arr.push(moment(lead[j]['service_obj'][k]['service_time'][0]).format('h:mm a'));                  
                  }

                }

              };

              leadServiceArr.push({'lead_id': lead[j]['_id'],'client_id': lead[j]['client_details']['_id'],'firstname': lead[j]['client_details']['firstname'],'mobile': lead[j]['client_details']['primary_contact_no'],'service_names': service_name_arr, 'service_time': service_time_arr,'service_date': service_date_arr});

          };

          //console.log(leadServiceArr);

          var mailBody = '';
          var invoiceObj = new invoice();

          for (var m = leadServiceArr.length - 1; m >= 0; m--) {
            
            var firstname = leadServiceArr[m].firstname;
            var mobile = leadServiceArr[m].mobile;
            var service_names = leadServiceArr[m].service_names.join(", ");
            var service_date = leadServiceArr[m].service_date[0];
            var service_time = leadServiceArr[m].service_time[0];
            var link = 'http://localhost:3000/confirmation/'+ leadServiceArr[m].lead_id + '/' + leadServiceArr[m].client_id;

            // bitly.shorten('https://github.com/tanepiper/node-bitly').then(function(response) {
            //   var short_url = response.data.url

            //   //mailBody = createEmailTemplate(firstname,service_names,service_date,service_time,short_url);
            //   // invoiceObj.sendEmail("tanveer.khan@mrhomecare.in","Confirmation Mail","",mailBody,function(message){
            //   //   console.log(message);
            //   // });

            //   //var smsBody = createSMSTemplate(short_url);
            //   //send_sms(mobile,smsBody);              


            // }, function(error) {
            //   throw error;
            // });


            //send_sms(mobile,"Hello from Homecare");

            //console.log(mailBody);
          };
          
      });








   });



}


function createEmailTemplate(firstname,service_names,service_date,service_time,link) {
  var msg = 'Dear ' + firstname + ',' + '<br /><br />';
  msg += 'We are reaching out to you, to confirm your '+ service_names +' service/s request for tomorrow '+ service_date +' at ' + service_time + '<br /><br />';
  msg += 'We aren not sure whether you would be available tomorrow, so the confirmation email. Please click on either "yes" or "no"​ link below:'+ '<br />';
  msg += '<a href="'+ link +'">'+ link +'</a>' + '<br /><br />';
  msg += 'Incase you want to opt for add on service such as sofa/chair shampooing, marble floor polishing and carpet shampooing, pest control, ac servicing, interior painting or car cleaning ';
  msg += 'service at an add on charge, do feel free to call us on 9022070070​ or reply back on this email for same. Do visit our website for more details: <a href="www.mrhomecare.in">www.mrhomecare.in</a>'+ '<br /><br />';
  msg += 'Should the service be cancelled on the same day, we would have to levy a cancellation charge amounting to Rs. 3000 or 50% of the service value (whichever is lower). We request for an advance notice in the event of any cancellation.'+ '<br /><br />';
  msg += 'Thanks';
  return msg;
}

function createSMSTemplate(link) {
  var msg = 'We are reaching out to you, to confirm your service scheduled tomorrow. Please ​click on either "yes" or "no"​ link below';
  msg += link;
  msg += 'If the service is cancelled on the same day, 50% of the service charge will be applicable as cancellation charges.';
  return msg;
}

function send_sms(mobile, msg) {

  var options = { method: 'POST',
    url: 'http://engine.mrhomecare.net/send_sms.php',
    headers: 
      { 
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { mobile: '7045118387', msg: 'Hello Homecare' } 
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

    //console.log(body);
  });

}



module.exports = CronManager;