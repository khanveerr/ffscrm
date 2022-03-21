
var mysql = require('mysql');
var instamojo = require('instamojo-nodejs');
var dbWrapper = require('../../dbWrapper.js');
var db = new dbWrapper();
var leadmanager   = require('../../app/schema/leadmanager');
var servicemanager = require('../../app/schema/servicemanager');
var amcservicemanager = require('../../app/schema/amcservicemanager');
var ordermanager = require('../../app/schema/ordermanager');
var clientmanager = require('../../app/schema/mhc-client');
var cache = require('../../config/cache');
var PHPUnserialize = require('php-unserialize');
var nodemailer = require('nodemailer');

var con = mysql.createConnection({
  host: "localhost",
  user: "mhcdbuser",
  password: "mhc123",
  database : 'mhc'
});

instamojo.setKeys('2b8c809c62df5657174b0ef8cf4c2213', 'f8691d38b1291e934398d02c39608917');
//instamojo.setKeys('36aaaf1c7fcfd3b42e3cae8c357a18e3', '03da5987850348298e6646c2dec37f52');

var moment = require('moment');



function InvoiceManager(){

}

InvoiceManager.prototype.sendEmail = function(to,subject='Mr Home Care- Invoice',cc='khanveerr@gmail.com',body,from='customercare@mrhomecare.in',callback) {

  var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: 'customercare@mrhomecare.in', // Your email id
          pass: 'MHC#123456' // Your password
      }
  });

  var mailOptions = {
      from: from, // sender address
      to: to, // list of receivers
      cc: cc,
      subject: subject, // Subject line
      html: body //, // plaintext body
      // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
          console.log(error);
          callback(error);
          //res.json({yo: 'error'});
      }else{
          callback(info);
          console.log('Message sent: ' + info.response);
          //res.json({yo: info.response});
      };
  });

};

InvoiceManager.prototype.sendInvoice = function(to,invoice_input,callback) {

  var invoice_obj = new InvoiceManager();
  var leadid = invoice_input['lead_id'];
  var serviceid_arr = invoice_input['serviceid_arr'];
  var send_sms = invoice_input['send_sms'];
  var invoice_type = invoice_input['invoice_type'];

  console.log("Invoice Model Send INVOICE");
  console.log(invoice_input);
  

  invoice_obj.generateInvoice(leadid,serviceid_arr,send_sms,invoice_type,function(res){

    var invoiceobj = res;
    var invoice_template = createGSTInvoiceTemplate(invoiceobj,invoice_type);

    console.log(invoice_template);

    invoice_obj.sendEmail(to,'Mr Home Care- Invoice','customercare@mrhomecare.in,accounts@mrhomecare.in',invoice_template,'',callback);  

  });

};

// inputs --- leadid,service_id_arr,invoice_type,callabck
InvoiceManager.prototype.generateInvoice = function(leadid,serviceidArr,send_sms,invoice_type,callback){

  console.log("In Model");
  console.log(leadid);

  var overallInvoiceObj = {};
  var orderBy = '';
  var limit =0;
  var offset = 0;
  var selectColObj = '';
  var keyValueArray = {};
  //var leadid = '5845e6d58d82ae18bcf2bbe0';
  //var serviceidArr = ['5845e6d68d82ae18bcf2d163','5845e6d78d82ae18bcf2d4fb'];
  var service_namesArr = [];
  var variantnameArr = [];
  var amcservice_namesArr = [];
  var amcvariantnameArr = [];
  var keys = ['pricelist','varianttype'];


  getLeadData(leadid,invoice_type,function(data){
    if (data) {
      getServiceData(serviceidArr,function(servData){
        if (servData) {
          cache.getMulti(keys, function(error, result){
            for(var mykey in result ){
              if (result.hasOwnProperty(mykey)) {
                result[mykey] = PHPUnserialize.unserialize(result[mykey]);
                // console.log(result);
              };
            }
            var pricelistmaster = result['pricelist'];
            var variantmaster = result['varianttype'];
            var temp_serv_arr =   servData['servicedata']['service'];
            var temp_variant_arr = servData['servicedata']['varianttype'];



            // console.log(temp_serv_arr);
            for (var i = 0; i < temp_serv_arr.length; i++) {
              // console.log(temp_serv_arr[i]);
              if(pricelistmaster != undefined && pricelistmaster[temp_serv_arr[i]] != undefined) {
                service_namesArr.push(pricelistmaster[temp_serv_arr[i]]);
                variantnameArr.push(variantmaster[temp_variant_arr[i]]);
              }
            }

            servData['servicedata']['servicenames'] = service_namesArr;
            servData['servicedata']['variantnames'] = variantnameArr;

            if (servData.hasOwnProperty('amcdata')) {
              var temp_amc_arr =   servData['amcdata']['service'];
              // var temp_amc_variant_arr = servData['amcdata']['varianttype'];
              for (var i = 0; i < temp_amc_arr.length; i++) {
                // console.log(temp_serv_arr[i]);
                if(pricelistmaster != undefined && pricelistmaster != null && pricelistmaster != "") {
                  amcservice_namesArr.push(pricelistmaster[temp_amc_arr[i]]);
                }
                // amcvariantnameArr.push(variantmaster[temp_amc_variant_arr[i]]);
              }
              servData['amcdata']['servicenames'] = amcservice_namesArr;
              // servData['amcdata']['variantnames'] = amcvariantnameArr;
            }
          // console.log();




        overallInvoiceObj = Object.assign(data,servData);
        console.log("Overall Invoice Object");
        console.log(overallInvoiceObj);
        // console.log(overallInvoiceObj['servicedata']['service']);
        //  console.log(overallInvoiceObj);
          // this will be only called if service colleection do not have invoice property
          if (overallInvoiceObj.hasOwnProperty('invoice_id')==false) {
             console.log("NO INVOICE ID");

            var servidarr =[];
            var temp_amc_serv = [];
            var temp_serv = overallInvoiceObj['servicedata']['service'];
            //console.log(servidarr);
            //console.log(overallInvoiceObj['amcdata']['service']);
            if (overallInvoiceObj.hasOwnProperty('amcdata')) {
                temp_amc_serv = overallInvoiceObj['amcdata']['service'];
            };

            servidarr = temp_serv.concat(temp_amc_serv);
            //console.log(overallInvoiceObj);
            //console.log(servidarr);
            console.log(overallInvoiceObj);
            mastergenerateInvoiceno(overallInvoiceObj['city'],servidarr,serviceidArr,function(invcdata){
              overallInvoiceObj['invoice_id'] = invcdata;
              generatePaymentLink(overallInvoiceObj,send_sms,invoice_type,function(paydata){

                if (paydata) {

                    if(paydata['payment_request'] != undefined && paydata['payment_request'] != null && paydata['payment_request'] != "") {
                      overallInvoiceObj['payment_link'] = paydata['payment_request']['longurl'];
                    } else {
                      overallInvoiceObj['payment_link'] = '';
                    }
                    callback(overallInvoiceObj);


                }
              });
            });

          }

          else {
            generatePaymentLink(overallInvoiceObj,send_sms,invoice_type,function(paydata){

              console.log("paydata testing");
              console.log(paydata);

              if (paydata) {

                  if(paydata['payment_request'] != undefined) {
                    overallInvoiceObj['payment_link'] = paydata['payment_request']['longurl'];
                  } else {
                    overallInvoiceObj['payment_link'] = "";
                  }

                  callback(overallInvoiceObj);


              }
            });
          }

          });
        }
      });
    }

  });




}

function getLeadData(leadid,invoice_type,callback){

  console.log("In Lead Data");
  console.log(leadid);

  var orderBy = '';
  var limit =0;
  var offset = 0;
  // var callback = 0;
  var selectColObj = '';
  var keyValueArray = {};
  var overallInvoiceObj = {};
  keyValueArray['_id'] = leadid;
  var populate_obj = 'client_details service_obj';

  db.getPopulatedDatafromCollection(leadmanager,populate_obj,keyValueArray,selectColObj,orderBy,limit,offset,function(data){

      if (data) {

          var leadObj = data[0];
          console.log(leadObj);

          // If Housejoy or hicare straight and simple send it to only partner
          if (leadObj['leadsource']==70 ||leadObj['leadsource']==84) {
            getPartnerbillingdetails(leadObj['leadsource'],leadObj['city'],function(data){
              if (data) {

                var partner_details = data[0];
                overallInvoiceObj['billing_name'] = partner_details['billing_name'];
                overallInvoiceObj['billing_email_id'] = (partner_details['email_id'] != undefined && partner_details['email_id'] != null && partner_details['email_id'] != "") ? partner_details['email_id'] : '';
                overallInvoiceObj['billing_address'] = '';
                overallInvoiceObj['client_name'] = leadObj['client_details']['firstname'] + " " + leadObj['client_details']['lastname'];

                overallInvoiceObj['leadsource'] = leadObj['leadsource'];
                overallInvoiceObj['city'] = leadObj['city'];
                overallInvoiceObj['invoice_type'] = leadObj['invoice_type'];
                overallInvoiceObj['invoice_id'] = 'Partner';


                callback(overallInvoiceObj);

              }

            });
          }

          else {
            //console.log("---------------Billing Name: " + leadObj['billing_name'] + "--------------");
            //console.log(Object.keys(leadObj));
            //console.log(leadObj.hasOwnProperty('billing_name'));

            if(invoice_type == 1) {
              getPartnerbillingdetails(leadObj['leadsource'],leadObj['city'],function(data){
                if (data) {

                  var partner_details = data[0];
                  overallInvoiceObj['billing_name'] = partner_details['billing_name'];
                  overallInvoiceObj['billing_email_id'] = (partner_details['email_id'] != undefined && partner_details['email_id'] != null && partner_details['email_id'] != "") ? partner_details['email_id'] : '';
                  overallInvoiceObj['billing_address'] = '';
                  overallInvoiceObj['client_name'] = leadObj['client_details']['firstname'] + " " + leadObj['client_details']['lastname'];

                  overallInvoiceObj['leadsource'] = leadObj['leadsource'];
                  overallInvoiceObj['city'] = leadObj['city'];
                  overallInvoiceObj['invoice_type'] = leadObj['invoice_type'];
                  overallInvoiceObj['invoice_id'] = 'Partner';


                  callback(overallInvoiceObj);

                }

              });
            } else {

              if ('billing_name' in leadObj && leadObj['billing_name'] !== undefined) {
                overallInvoiceObj['billing_name'] = leadObj['billing_name'];
              }
              else {
                overallInvoiceObj['billing_name'] = leadObj['client_details']['firstname'] + " " + leadObj['client_details']['lastname'];
              }

              if (leadObj.hasOwnProperty('billing_email_id')) {
                overallInvoiceObj['billing_email_id'] = leadObj['billing_email_id'];
              }
              else {
                overallInvoiceObj['billing_email_id'] = leadObj['client_details']['primary_email_id'];
              }

              overallInvoiceObj['billing_address'] = leadObj['billing_address'];
              overallInvoiceObj['billing_phone_no'] = leadObj['client_details']['primary_contact_no']
              overallInvoiceObj['leadsource'] = leadObj['leadsource'];
              overallInvoiceObj['city'] = leadObj['city'];
              overallInvoiceObj['invoice_type'] = leadObj['invoice_type']


              callback(overallInvoiceObj);

            }

          }






      }

  });

}

function getServiceData(service_id_arr,callback){

  var orderBy = '';
  var limit =0;
  var offset = 0;
  var selectColObj = '';
  var keyValueArray = {};
  var overallInvoiceObj = {};
  var service_populate_obj = 'service_address amcservices';
  keyValueArray['_id'] = {'$in':service_id_arr};
  db.getPopulatedDatafromCollection(servicemanager,service_populate_obj,keyValueArray,selectColObj,orderBy,limit,offset,function(servData){

    if (servData) {
    //  console.log(servData);
          var temp_service_arr =[];
          var temp_service_category_id_arr =[];
          var temp_variant_arr = [];
          var temp_service_date = [];
          var temp_service_time = [];
          var temp_amc_contract_start =[];
          var temp_amc_contract_end =[];
          var temp_amc_service = [];
          var temp_amc_service_category_id = [];
          var temp_amc_service_nos = [];
          var temp_amc_variant = [];
          var temp_amc_price_data = [];
          var temp_price_data = [];
          var has_amc = 0;
          var invoiceid ='';
          var invoice_date = '';

        for (var i = 0; i < servData.length; i++) {

          if (servData[i]['is_amc']==1) {
            var amcpriceobj = {};
            has_amc =1;
            temp_amc_contract_start.push(servData[i]['contract_start_date']);
            temp_amc_contract_end.push(servData[i]['contract_end_date']);
            temp_amc_variant.push(servData[i]['variant_type_id']);
            temp_amc_service.push(servData[i]['service_id']);
            temp_amc_service_category_id.push(servData[i]['service_category_id']);
            temp_amc_service_nos.push(servData[i]['amcservices']);

              if(servData[i]['pre_taxed_cost'] != undefined && servData[i]['pre_taxed_cost'] != null && servData[i]['pre_taxed_cost'] !="") {
                amcpriceobj['pre_taxed_cost'] = servData[i]['pre_taxed_cost'];
              } else {
                amcpriceobj['pre_taxed_cost'] = 0;
              }

              if(servData[i]['taxed_cost'] != undefined && servData[i]['taxed_cost'] != null && servData[i]['taxed_cost'] != "") {
                amcpriceobj['taxed_cost'] = servData[i]['taxed_cost'];
              } else {
                amcpriceobj['taxed_cost'] = 0;
              }

              if(servData[i]['client_payment_expected'] != undefined && servData[i]['client_payment_expected'] != null && servData[i]['client_payment_expected'] != "") {
                amcpriceobj['client_payment_expected'] = servData[i]['client_payment_expected'];
              } else {
                amcpriceobj['client_payment_expected'] = 0;
              }

              if(servData[i]['partner_payment_payable'] != undefined && servData[i]['partner_payment_payable'] != null && servData[i]['partner_payment_payable'] != "") {
                amcpriceobj['partner_payment_payable'] = servData[i]['partner_payment_payable'];
              } else {
                amcpriceobj['partner_payment_payable'] = 0;
              }

              if(servData[i]['partner_payment_recievable'] != undefined && servData[i]['partner_payment_recievable'] != null && servData[i]['partner_payment_recievable'] != "") {
                amcpriceobj['partner_payment_recievable'] = servData[i]['partner_payment_recievable'];
              } else {
                amcpriceobj['partner_payment_recievable'] = 0;
              }

              if(servData[i]['discount'] != undefined && servData[i]['discount'] != null && servData[i]['discount'] != "") {
                amcpriceobj['discount'] = servData[i]['discount'];
              } else {
                amcpriceobj['discount'] = 0;
              }

              if(servData[i]['cgst_tax'] != undefined && servData[i]['cgst_tax'] != null && servData[i]['cgst_tax'] != "") {
                amcpriceobj['cgst_tax'] = servData[i]['cgst_tax'];
              } else {
                amcpriceobj['cgst_tax'] = 0;
              }

              if(servData[i]['sgst_tax'] != undefined && servData[i]['sgst_tax'] != null && servData[i]['sgst_tax'] != "") {
                amcpriceobj['sgst_tax'] = servData[i]['sgst_tax'];
              } else {
                amcpriceobj['sgst_tax'] = 0;
              }

              if(servData[i]['gst_tax'] != undefined && servData[i]['gst_tax'] != null && servData[i]['gst_tax'] != "") {
                amcpriceobj['gst_tax'] = servData[i]['gst_tax'];
              } else {
                amcpriceobj['gst_tax'] = 0;
              }

              if(servData[i]['service_tax'] != undefined && servData[i]['service_tax'] != null && servData[i]['service_tax'] != "") {
                amcpriceobj['service_tax'] = servData[i]['service_tax'];
              } else {
                amcpriceobj['service_tax'] = 0;
              }

              if(servData[i]['cess_tax'] != undefined && servData[i]['cess_tax'] != null && servData[i]['cess_tax'] != "") {
                amcpriceobj['cess_tax'] = servData[i]['cess_tax'];
              } else {
                amcpriceobj['cess_tax'] = 0;
              }

              if(servData[i]['kk_tax'] != undefined && servData[i]['kk_tax'] != null && servData[i]['kk_tax'] != "") {
                amcpriceobj['kk_tax'] = servData[i]['kk_tax'];
              } else {
                amcpriceobj['kk_tax'] = 0;
              }

            temp_amc_price_data.push(amcpriceobj);
            // console.log();
            // if (servData[i].hasOwnProperty('invoice_id')) {
              invoiceid = servData[i]['invoice_id'];
              invoice_date = servData[i]['invoice_date'];
            // }


          }

          else{
              var priceobj = {};
              temp_service_arr.push(servData[i]['service_id']);
              temp_service_category_id_arr.push(servData[i]['service_category_id']);
              temp_variant_arr.push(servData[i]['variant_type_id']);
              temp_service_date.push(servData[i]['service_date']);
              temp_service_time.push(servData[i]['service_time']);

              if(servData[i]['pre_taxed_cost'] != undefined && servData[i]['pre_taxed_cost'] != null && servData[i]['pre_taxed_cost'] !="") {
                priceobj['pre_taxed_cost'] = servData[i]['pre_taxed_cost'];
              } else {
                priceobj['pre_taxed_cost'] = 0;
              }

              if(servData[i]['taxed_cost'] != undefined && servData[i]['taxed_cost'] != null && servData[i]['taxed_cost'] != "") {
                priceobj['taxed_cost'] = servData[i]['taxed_cost'];
              } else {
                priceobj['taxed_cost'] = 0;
              }

              if(servData[i]['client_payment_expected'] != undefined && servData[i]['client_payment_expected'] != null && servData[i]['client_payment_expected'] != "") {
                priceobj['client_payment_expected'] = servData[i]['client_payment_expected'];
              } else {
                priceobj['client_payment_expected'] = 0;
              }

              if(servData[i]['partner_payment_payable'] != undefined && servData[i]['partner_payment_payable'] != null && servData[i]['partner_payment_payable'] != "") {
                priceobj['partner_payment_payable'] = servData[i]['partner_payment_payable'];
              } else {
                priceobj['partner_payment_payable'] = 0;
              }

              if(servData[i]['partner_payment_recievable'] != undefined && servData[i]['partner_payment_recievable'] != null && servData[i]['partner_payment_recievable'] != "") {
                priceobj['partner_payment_recievable'] = servData[i]['partner_payment_recievable'];
              } else {
                priceobj['partner_payment_recievable'] = 0;
              }

              if(servData[i]['discount'] != undefined && servData[i]['discount'] != null && servData[i]['discount'] != "") {
                priceobj['discount'] = servData[i]['discount'];
              } else {
                priceobj['discount'] = 0;
              }

              if(servData[i]['cgst_tax'] != undefined && servData[i]['cgst_tax'] != null && servData[i]['cgst_tax'] != "") {
                priceobj['cgst_tax'] = servData[i]['cgst_tax'];
              } else {
                priceobj['cgst_tax'] = 0;
              }

              if(servData[i]['sgst_tax'] != undefined && servData[i]['sgst_tax'] != null && servData[i]['sgst_tax'] != "") {
                priceobj['sgst_tax'] = servData[i]['sgst_tax'];
              } else {
                priceobj['sgst_tax'] = 0;
              }

              if(servData[i]['gst_tax'] != undefined && servData[i]['gst_tax'] != null && servData[i]['gst_tax'] != "") {
                priceobj['gst_tax'] = servData[i]['gst_tax'];
              } else {
                priceobj['gst_tax'] = 0;
              }

              if(servData[i]['service_tax'] != undefined && servData[i]['service_tax'] != null && servData[i]['service_tax'] != "") {
                priceobj['service_tax'] = servData[i]['service_tax'];
              } else {
                priceobj['service_tax'] = 0;
              }

              if(servData[i]['cess_tax'] != undefined && servData[i]['cess_tax'] != null && servData[i]['cess_tax'] != "") {
                priceobj['cess_tax'] = servData[i]['cess_tax'];
              } else {
                priceobj['cess_tax'] = 0;
              }

              if(servData[i]['kk_tax'] != undefined && servData[i]['kk_tax'] != null && servData[i]['kk_tax'] != "") {
                priceobj['kk_tax'] = servData[i]['kk_tax'];
              } else {
                priceobj['kk_tax'] = 0;
              }
              // console.log(servData[i]['invoice_id']);

                invoiceid = servData[i]['invoice_id'];

                invoice_date = servData[i]['invoice_date'];
              // console.log(invoiceid);
              temp_price_data.push(priceobj);


          }

        }

        if(invoice_date != "" && invoice_date != undefined) {
          overallInvoiceObj['invoice_date'] = invoice_date;
        } else {
          overallInvoiceObj['invoice_date'] = '';
        }

        if (has_amc==1) {
          overallInvoiceObj['amcdata'] = {'service':temp_amc_service, 'service_category_id':temp_amc_service_category_id,'startdate':temp_amc_contract_start,'enddate':temp_amc_contract_end,'price':temp_amc_price_data,'servicenos':temp_amc_service_nos};
        }

        overallInvoiceObj['servicedata'] = {'service':temp_service_arr, 'service_category_id':temp_service_category_id_arr,'varianttype':temp_variant_arr,'service_date':temp_service_date,'service_time':temp_service_time,'price':temp_price_data};

        if (invoiceid !==''&& invoiceid!= undefined) {
        overallInvoiceObj['invoice_id'] = invoiceid;
        };


        callback(overallInvoiceObj);
    }

  });


}

// function createHtmlInvoice(invoiceobj,callback){
//   var htmlcontent = '';
//
//     htmlcontent = '<div bgcolor="#f6f8f1; color:#500050 !important"><table cellspacing="0" cellpadding="0" border="1" align="center" style="width:80%">';
//     htmlcontent += '<tbody>';
//     htmlcontent += '<tr>';
//     htmlcontent += '<td bgcolor="white" style="padding:20px 30px 80px 30px">';
//     htmlcontent += '<table cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" align="center" style="margin-top:10px;width:100%;max-width:600px;padding:50px 0 0px 0px">';
//     htmlcontent += '<tbody>';
//     htmlcontent += '<tr>';
//     htmlcontent += '<td>';
//     htmlcontent += '<table cellspacing="0" cellpadding="0" border="0" align="left" style="width:40%;padding:0px 0 0 0">';
//     htmlcontent += '<tbody>';
//     htmlcontent += '<tr>';
//     htmlcontent += '<td style="padding:0 0 0px 5px;font-family:"Neris Light",arial;font-size:18px;min-height:auto;width:50px"></td>';
//     htmlcontent += '<td>';
//     htmlcontent += 'Hello <span style="padding:0px 0 0 0px;font-family:"Neris Semibold",arial;font-size:18px;width:50px;min-height:0px">';
//     htmlcontent +=  invoiceobj['billing_name'];
//     htmlcontent += '</span>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody>';
//     htmlcontent += '</table>';
//     htmlcontent += '<table border="0" align="right" style="width:50%;max-width:100%;float:right">';
//     htmlcontent += '<tbody>';
//     htmlcontent += '<tr>';
//     htmlcontent += '<td align="right" style="padding:0px 0 0px 0px;font-family:"Neris Light",arial;font-size:12px">';
//     htmlcontent += 'INVOICE NO.';
//     htmlcontent += '<span style="padding:0px 0 0px 0px;border:none;border-collapse:collapse;font-family:"Roboto",sans-serif;font-size:12px;font-weight:700;width:80px;text-align:right">';
//     htmlcontent +=  invoiceobj['invoice_id'];
//     htmlcontent += '</span>';
//     htmlcontent += '<p align="right" valign="top" style="padding:0px 0 0px 0px;border:none;font-family:"Roboto",sans-serif;font-size:12px;width:100px;text-align:right"></p>';
//     htmlcontent += new Date().toString();
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody>';
//     htmlcontent += '</table>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr>';
//     htmlcontent += '<td style="padding:10px 0 10px 0">';
//     htmlcontent += '<hr width="100%" size="1" color="#fec11f">';
//     htmlcontent += '<div class="" style="width:40%;float:left">';
//     htmlcontent += '  <a target="_blank" href="http://www.mrhomecare.in">';
//     htmlcontent += '  <img height="35" width="156" alt="Mr Home Care logo" src="https://www.mrhomecare.in/wp-content/themes/mrhomecare/mhc-lib/img/logo.png" class="CToWUd">';
//     htmlcontent += '  </a>';
//     htmlcontent += '  <p style="font-size:12px;font-family:"Roboto",sans-serif;">';
//     htmlcontent += '    <span style="font-weight:700">Mister Homecare Services Private Limited</span> <br>Gordhan Building, 2nd Floor,<br>';
//     htmlcontent += '    Dr. Parekh Street, Prathana Samaj <br>Mumbai - 400004<br/>';
//     htmlcontent += '    <span style="font-weight:700;">Ph: </span>9022070070<br/>';
//     htmlcontent += '     <span style="font-weight:700;">Email ID: </span>customercare@mrhomecare.in';
//     htmlcontent += '  </p>';
//     htmlcontent += '</div>';
//     htmlcontent += '<table border="0" align="right" style="padding:0 24px 10px 9px;width:55%;max-width:60%">';
//     htmlcontent += '<tbody><tr>';
//     htmlcontent += '<td>';
//     htmlcontent += '<table border="0" style="width:50%;max-width:100%;">';
//     htmlcontent += '<tbody>';
//     htmlcontent += '<tr>';
//
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody>';
//     htmlcontent += '</table>';
//     htmlcontent += '<table border="0" style="" align="right" valign="top">';
//     htmlcontent += '<tbody>';
//     htmlcontent += '<tr><td valign="top" align="left" style="padding:0px 0 0px 10px;font-family:"Roboto",sans-serif;font-size:14px;font-weight:700;line-height:1em">';
//     htmlcontent += 'Bill To:';
//     htmlcontent += '</td></tr>';
//     htmlcontent += '<tr>';
//     htmlcontent += '<td style="padding:0 0 0px 0px">';
//     htmlcontent += '<p align="left" style="padding:0px 0 0px 0px;border:none;overflow:hidden;font-family:"Roboto",sans-serif;font-size:12px;width:200px;min-height:120px">';
//     htmlcontent += '<b>'+ invoiceobj['billing_name'] +'</b>';
//     htmlcontent += '<br>';
//     htmlcontent += '<br>';
//     htmlcontent += 'Andheri East';
//     htmlcontent += '<br>';
//     htmlcontent += '<b>Ph:</b> <a target="_blank" value="'+invoiceobj['billing_phone_no']+'" href="tel:'+invoiceobj['billing_phone_no']+'">'+invoiceobj['billing_phone_no']+'</a>';
//     htmlcontent += '<br>';
//     htmlcontent += '<b>Email ID:</b> '+ invoiceobj['billing_email_id'];
//     htmlcontent += '<br>';
//     htmlcontent += '</p>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody>';
//     htmlcontent += '</table>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody></table>';
//     htmlcontent += '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0 0px 0">';
//     htmlcontent += '<tbody><tr>';
//     htmlcontent += '<td style="width:100px">';
//     htmlcontent += '<hr width="100%" size="1px" color="#fec11f" align="left" style="display:inline-block">';
//     htmlcontent += '</td>';
//     htmlcontent += '<td style="width:50px !important;text-align:center !important;">';
//     htmlcontent += '<h6 style="display:inline;color:#fec11f;font-size:18px;padding:0 0px 0 0px">Booking Details</h6>';
//     htmlcontent += '</td>';
//     htmlcontent += '<td style="width:100px">';
//     htmlcontent += '<hr width="100%" size="1px" color="#fec11f" align="right" style="display:inline-block">';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody></table>';
//     htmlcontent += '<span style="font-family:"Neris Thin",arial;font-size:15px;font-weight:400;padding:0px 0 20px 20px">';
//     htmlcontent += '<table border="0" style="color:black;font-size:14px;font-family:"Neris Thin",arial">';
//     htmlcontent += '<tbody><tr>';
//     htmlcontent += '<td>Service:</td>';
//     htmlcontent += '<td>';
//     if(invoiceobj['servicedata']['servicenames'].length > 0) {
//       htmlcontent +=  invoiceobj['servicedata']['servicenames'].join(", ");
//     } else {
//       htmlcontent +=  ' No Service';
//     }
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody></table>';
//     htmlcontent += '</span>';
//     htmlcontent += '<table width="100%" border="0" style="border-collapse:collapse;font-family:"Roboto",sans-serif;color:black;font-size:12px">';
//     htmlcontent += '<tbody><tr width="100%" style="font-weight:500;font-size:14px;background:#fec11f;color:white;height:30px">';
//     htmlcontent += '<td align="center" style="width:10px">';
//     htmlcontent += '<strong>Sr.No.</strong>';
//     htmlcontent += '</td>';
//     htmlcontent += '<td align="center">';
//     htmlcontent += '<strong>Service Breakup</strong>';
//     htmlcontent += '</td>';
//     htmlcontent += '<td align="center">';
//     htmlcontent += '<strong>Quantity</strong>';
//     htmlcontent += '</td>';
//     htmlcontent += '<td align="center">';
//     htmlcontent += '<strong>Rate</strong>';
//     htmlcontent += '</td>';
//     htmlcontent += '<td align="center">';
//     htmlcontent += '<strong>Amount</strong>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr cellpadding="1">';
//     htmlcontent += '<td></td>';
//     htmlcontent += '<td align="center" style="font-weight:700;font-size:14px;padding-top:1%;padding-bottom:1%" colspan="1">';
//
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr>';
//     htmlcontent += '  <td align="center">1</td>';
//     htmlcontent += '  <td align="left">Deep Cleaning</td>';
//     htmlcontent += '  <td align="center">1</td>';
//     htmlcontent += '  <td align="center">Rs. 2260.87</td>';
//     htmlcontent += '  <td align="right">Rs. 2260.87</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr>';
//     htmlcontent += '  <td align="center"></td>';
//     htmlcontent += '  <td align="left"><strong>Pre Tax Total</strong</td>';
//     htmlcontent += '  <td align="center"></td>';
//     htmlcontent += '  <td align="center"></td>';
//     htmlcontent += '  <td align="right">Rs. 2260.87</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr>';
//     htmlcontent += '  <td align="center"></td>';
//     htmlcontent += '  <td align="left">Service Tax @ 14 % 2016-17</td>';
//     htmlcontent += '  <td></td>';
//     htmlcontent += '  <td></td>';
//     htmlcontent += '  <td align="right">Rs. 316.00</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr>';
//     htmlcontent += '<td style="width:50px"></td>';
//     htmlcontent += '<td></td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr style="border-bottom:1px solid #fec11f">';
//     htmlcontent += '<td></td>';
//     htmlcontent += '<td></td>';
//     htmlcontent += '<td align="right" style="padding:0 10px 0 0" colspan="2">';
//     htmlcontent += '</td>';
//     htmlcontent += '<td>';
//     htmlcontent += '<strong>';
//     htmlcontent += '<p style="border:none;float:center;text-align:center">';
//
//     htmlcontent += '</p>';
//     htmlcontent += '</strong>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr style="border-bottom:1px solid #fec11f">';
//     htmlcontent += '<td></td>';
//     htmlcontent += '<td></td>';
//     htmlcontent += '<td></td>';
//     htmlcontent += '<td align="right" style="padding:0 10px 0 0">';
//     htmlcontent += '<strong>Net Payable</strong>';
//     htmlcontent += '</td>';
//     htmlcontent += '<td align="right">';
//     htmlcontent += '<p style="border:none;float:center;font-weight:700;text-align:right;">';
//     htmlcontent += 'Rs. 2600.00';
//     htmlcontent += '</p>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr>';
//     htmlcontent += '<td colspan="2">MHC ST No.: AAJCM6704HSD001</td>';
//     htmlcontent += '<td></td>';
//     htmlcontent += '<td align="right" style="font-size:14px;padding:0 10px 0 0"></td>';
//     htmlcontent += '<td>';
//     htmlcontent += '<strong>';
//     htmlcontent += '<p type="text" style="border:none;float:center;text-align:center;font-weight:700">';
//     htmlcontent += '</p>';
//     htmlcontent += '</strong>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr>';
//     htmlcontent += '<td colspan="2">Company PAN No.: AAJCM6704H</td>';
//     htmlcontent += '<td align="right" colspan="3">';
//     htmlcontent += '<a target="_blank" style="padding:1%;border:1px solid #fec11f;color:black;background-color:#fec11f;text-decoration:none" href="'+invoiceobj['payment_link']+'">';
//     htmlcontent += 'Click to pay online';
//     htmlcontent += '</a>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr>';
//     htmlcontent += '<td colspan="4"></td>';
//     htmlcontent += '<td>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '<tr>';
//     htmlcontent += '<td colspan="4"></td>';
//     htmlcontent += '<td>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody></table>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody>';
//     htmlcontent += '</table>';
//     htmlcontent += '<div class="" style="margin-left:5%;width:95%">';
//     htmlcontent += '  <p style=" text-decoration: underline">Declaration</p>';
//     htmlcontent += '  <p> We declare that this invoice shows the actual price of the service provided and that all the particulars are true and correct.</p>';
//     htmlcontent += '</div>';
//     htmlcontent += '<table style="margin-left:5%;width:95%" border="0" align="center">';
//     htmlcontent += '<tbody><tr>';
//     htmlcontent += '<td style="padding:20px 0 0px 0">';
//     htmlcontent += '  <p>Kindly address the cheque to - <b>Mister Homecare Services Pvt. Ltd.</b></p>';
//     htmlcontent += '</td>';
//     htmlcontent += '<td>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody></table>';
//     htmlcontent += '<table width="100%" border="0" align="center">';
//     htmlcontent += '<tbody><tr>';
//     htmlcontent += '<td>';
//     htmlcontent += '<h2 align="center" width="100%" style="border-collapse:collapse;font-family:"Roboto",sans-serif;color:black;font-weight:300;font-size:14px" border="0">';
//     htmlcontent += '</h2>';
//     htmlcontent += '<table align="center">';
//     htmlcontent += '<tbody><tr>';
//     htmlcontent += '<td>';
//     htmlcontent += '<a target="_blank" href="https://twitter.com/misterhomecare">';
//     htmlcontent += '<img alt="Twitter" src="http://engine.mrhomecare.net/images/twitter.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
//     htmlcontent += '</a>';
//     htmlcontent += '<a target="_blank" href="https://www.facebook.com/MisterHomecare/">';
//     htmlcontent += '<img alt="Facebook" src="http://engine.mrhomecare.net/images/facebook.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
//     htmlcontent += '</a>';
//     htmlcontent += '<a target="_blank" href="https://www.linkedin.com/company/mr-homecare">';
//     htmlcontent += '<img alt="Facebook" src="http://engine.mrhomecare.net/images/linkedin.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
//     htmlcontent += '</a>';
//     htmlcontent += '<a target="_blank" href="https://www.instagram.com/mrhomecare/">';
//     htmlcontent += '<img alt="Facebook" src="http://engine.mrhomecare.net/images/instagram.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
//     htmlcontent += '</a>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody></table>';
//     htmlcontent += '<p align="center" style="font-family:"Roboto",sans-serif;color:black;font-weight:300;font-size:15px">';
//     htmlcontent += '<i>Thanks for using our service!</i>';
//     htmlcontent += '</p>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody></table>';
//     htmlcontent += '</td>';
//     htmlcontent += '</tr>';
//     htmlcontent += '</tbody>';
//     htmlcontent += '</table><div class="yj6qo"></div><div class="adL">';
//     htmlcontent += '</div>';
//   htmlcontent += '</div>';
//
//     callback(htmlcontent);
//
// }


// INVOICE No will only be generated for Organic + Urbanclap Customers

function mastergenerateInvoiceno(city,service_namesArr,service_idArr,callback){
  var citystring = '';
  var servicestring = '';
  var keys = ['pricelist'];
  switch (city) {
    case 2:
      citystring = "B";
      break;
    case 3:
      citystring = "D";
      break;
    case 4:
      citystring = "P";
      break;
    default:citystring = "M";

  }

  // logic for service names to be implemented
  var invoiceid = "2017-18/" +citystring + "/";
  cache.getMulti(keys, function(error, result){
    for(var mykey in result ){
      if (result.hasOwnProperty(mykey)) {
        result[mykey] = PHPUnserialize.unserialize(result[mykey]);
        console.log(result);
      };
    }

    var pricelistcache = result['pricelist'];
    for (var i = 0; i < service_namesArr.length; i++) {

      if(pricelistcache != undefined && pricelistcache != null && pricelistcache != "") {
        var tempstr = pricelistcache[service_namesArr[i]];
        var matches = tempstr.match(/\b(\w)/g);
        var acronym = matches.join('');

        servicestring += acronym + '-';
      }

    }

    if(service_namesArr.length > 1) {
      servicestring = 'MS';
    } else {
      servicestring = servicestring.substr(0, servicestring.length-1);
    }

    





    createInvoiceNo(city,function(invoice){
      if (invoice) {
        invoiceid = 'MHC/' + servicestring+'/'+ invoiceid + invoice;
        // console.log(invoiceid);
        setInoviceId(service_idArr,invoiceid,function(setdata){

          if (setdata) {
              updateInvoiceNo(invoice,city,function(updatedata){
                if (updatedata) {
                  callback(invoiceid);
                }
                else {
                  callback(0);
                }
              });
          }
        });


      } else {
        callback(0);
      }
    });

    });

}



function createInvoiceNo(city,callback){
  var qryString = "SELECT  invoice_no FROM mhc.invoice_master where city=" + city;
  con.query(qryString,function(err,rows){

    //if(err) throw err;

    if(rows != undefined && rows != null) {

      var invobj = rows[0];

      console.log("Create Invoice Number");
      console.log(invobj);

      if(invobj != undefined) {
        console.log(invobj['invoice_no']);
        if(invobj['invoice_no'] == 0) {
          callback(1);
        } else {
          callback(invobj['invoice_no']);
        }
      } else {
        callback("");
      }

    } else {
      callback("");
    }

  });

}


// inserting invoice id in service collection
function setInoviceId(serviceArr,invoiceid,callback){
  var whereArr = {};
  var updateVal = {};
  var options = {multi: true};

  console.log("Set Invoice Id");
  console.log(invoiceid);

      whereArr['_id'] =   {"$in":serviceArr};
      console.log(whereArr);
      updateVal['invoice_id'] = invoiceid;
      db.updateDocument(servicemanager,whereArr,updateVal,options,function(data){

          if (data) {
          callback(1);
          }

      });


      // console.log(whereArr);
      // console.log(updateVal);
}

// update the invoice no in master table
function updateInvoiceNo(lastInvoiceNo,city,callback){

  console.log("Update Invoice No");
  console.log(lastInvoiceNo);

  var updatedNo = parseInt(lastInvoiceNo) +1;
  var qryString = "UPDATE mhc.invoice_master SET invoice_no="+ updatedNo+" where city=" + city;
  con.query(qryString,function(err,rows){

    if(err) console.log(err);

    callback(rows);

  });

}


//generate paymentlink
function generatePaymentLink(payObj,send_sms,invoice_type,callback){

  var data = new instamojo.PaymentData();
  var pricearr = payObj['servicedata']['price'];
  var amcarr = [];

   var total = 0;

   // if(payObj['leadsource'] == 63) {
   //   for ( var i = 0, _len = pricearr.length; i < _len; i++ ) {
   //       total += pricearr[i]['pre_taxed_cost'];
   //   }
   // } else {
   //   for ( var i = 0, _len = pricearr.length; i < _len; i++ ) {
   //       total += pricearr[i]['client_payment_expected'];
   //   }    
   // }

      if(invoice_type == 1) {
        for ( var i = 0, _len = pricearr.length; i < _len; i++ ) {
           total += pricearr[i]['pre_taxed_cost'];
        }        
      } else {
       for ( var i = 0, _len = pricearr.length; i < _len; i++ ) {
           total += pricearr[i]['client_payment_expected'];
       }            
      }




   if (payObj.hasOwnProperty('amcdata')) {
     amcarr = payObj['amcdata']['price'];

     for ( var i = 0, _len = amcarr.length; i < _len; i++ ) {
         total += amcarr[i]['client_payment_expected']
     }
   }

   console.log(total);
   console.log("total");


   var serviceNamesArrString = payObj['servicedata']['servicenames'].toString();
   var serviceNamesArr = payObj['servicedata']['servicenames'];
   var serviceNamesInitialsArr = [];
   if (payObj.hasOwnProperty('amcdata')) {
     serviceNamesArrString = payObj['servicedata']['servicenames'].toString() +','+payObj['amcdata']['servicenames'].toString() ;
     serviceNamesArr.concat(payObj['amcdata']['servicenames']);
   }
   //var serviceNamesArrCount = count(payObj['servicedata']['servicenames']);


   if(serviceNamesArrString.length > 30) {

    console.log("Test 1");

    for(var obj=0;obj<serviceNamesArr.length;obj++) {
      var str = serviceNamesArr[obj];
     var matches = str.match(/\b(\w)/g);
      var acronym = matches.join('');

      serviceNamesInitialsArr.push(acronym);
    }

    data.purpose = serviceNamesInitialsArr.toString() ;

   } else {

    console.log("Test 2");

   data.purpose = payObj['servicedata']['servicenames'].toString() ;

   if (payObj.hasOwnProperty('amcdata')) {
     data.purpose +=','+payObj['amcdata']['servicenames'].toString() ;
   }

   }
       // REQUIRED

   console.log(data);

   if(payObj['billing_email_id'] != "" && payObj['billing_email_id'] != undefined && payObj['billing_email_id'] != null) {
    var email_id = payObj['billing_email_id'].split(",");
   } else {
    var email_id = [];
   }

   data.amount =total;                  // REQUIRED
   data.currency                = 'INR';
   data.buyer_name              = payObj['billing_name'];
   data.email                   = email_id[0];
   data.phone                   = payObj['billing_phone_no'];
   data.send_sms                = send_sms;
   data.send_email              = 'False';
   data.webhook                 = "http://engine.mrhomecare.net/payment/instapayu.php";
   data.setRedirectUrl('https://www.mrhomecare.in/');

   instamojo.createPayment(data, function(error, response) {
     if (error) {
       console.log(error);
     } else {
       // Payment redirection link at response.payment_request.longurl
       var url = JSON.parse(response);
       callback(url);
      //  console.log(response);
     }
   });
  }

function getPartnerbillingdetails(leadsource,city,callback) {
  var qryString = "SELECT * FROM mhc.partner_emails where city=" + city + " and source_id=" +leadsource;
  console.log(qryString);
  con.query(qryString,function(err,rows){

    if(err) console.log(err);

    callback(rows);

  });
}

function sendMail(){

}


function createGSTInvoiceTemplate(invoiceobj,invoice_type) {

  var htmlcontent = "";


  htmlcontent += '<table align="center" border="0" width="90%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
      htmlcontent += '<tr>';
        htmlcontent += '<td style="padding: 0px; text-align: center;" align="center">Tax Invoice</td>';
      htmlcontent += '</tr>';
      htmlcontent += '<tr>';
        htmlcontent += '<td style="border: 1px solid #000000; padding: 0px;">';
          htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
              htmlcontent += '<tr>';
                htmlcontent += '<td style="width: 50%; padding: 0px; border-right: 1px solid #000000;">';
                  htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 14px;" valign="top">';
                        htmlcontent += '<span style="font-weight: 700">Mister Homecare Services Privated Limited</span><br />';
                        if(invoiceobj['city'] == 1) {
                          htmlcontent += 'Gordhan Building, 2nd Floor,<br />';
                          htmlcontent += 'Dr. Parekh Street, Prarthana Samaj,<br />';
                          htmlcontent += 'Mumbai - 400004<br />';
                          htmlcontent += 'GSTIN/UIN: 27AAJCM6704H1ZC<br />';
                          htmlcontent += 'State Code: 27<br />&nbsp;<br />&nbsp;';
                        } else if(invoiceobj['city'] == 2) {                          
                          htmlcontent += 'No. 52, 2nd Floor,<br />';
                          htmlcontent += 'St. Johns Road,<br />';
                          htmlcontent += 'Bangalore - 560042<br />';
                          htmlcontent += 'GSTIN/UIN: 29AAJCM6704H1Z8<br />';
                          htmlcontent += 'State Code: 29<br />&nbsp;<br />&nbsp;';
                        } else if(invoiceobj['city'] == 3) {                          
                          htmlcontent += 'B 44/2, Freedom Fighter Colony,<br />';
                          htmlcontent += 'Neb Sarai,<br />';
                          htmlcontent += 'New Delhi - 110068<br />';
                          htmlcontent += 'GSTIN/UIN: 07AAJCM6704H1ZE<br />';
                          htmlcontent += 'State Code: 07<br />&nbsp;<br />&nbsp;';
                        } else {
                          htmlcontent += 'Gordhan Building, 2nd Floor,<br />';
                          htmlcontent += 'Dr. Parekh Street, Prarthana Samaj,<br />';
                          htmlcontent += 'Mumbai - 400004<br />';
                          htmlcontent += 'GSTIN/UIN: 27AAJCM6704H1ZC<br />';
                          htmlcontent += 'State Code: 27<br />&nbsp;<br />&nbsp;';
                        }
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="padding: 3px; font-size: 14px;" valign="top">';
                        htmlcontent += 'Details of Receiver (Bill To)<br />';
                        htmlcontent += '<span style="font-weight: 700">'+ invoiceobj['billing_name'] +'</span><br /><br />';
                        htmlcontent += invoiceobj['billing_address'] + '<br />&nbsp;<br />&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                  htmlcontent += '</table>';
                htmlcontent += '</td>';
                htmlcontent += '<td style="width: 50%; padding: 0px; vertical-align: top;" valign="top">';
                  htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; font-size: 14px;">';
                        htmlcontent += 'Invoice No.<br />';
                        htmlcontent += '<span style="font-weight: 700;">'+ invoiceobj['invoice_id'] +'</span>';
                      htmlcontent += '</td>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 14px;">';
                        htmlcontent += 'Dated<br />';

                        var dt = '';

                        if(invoiceobj['invoice_date'] != undefined && invoiceobj['invoice_date'] != null && invoiceobj['invoice_date'] != "") {

                              dt = moment(invoiceobj['invoice_date']);

                            } else {

                              if(invoiceobj['servicedata']['servicenames'].length > 0 && invoiceobj['servicedata']['servicenames'].length < 2) {

                                inv_date = getMaxDate(invoiceobj['servicedata']['service_date']);

                                if(moment().unix() < moment(inv_date).unix()) {
                                  dt = (new Date()).toISOString();
                                } else {

                                  dt = inv_date;
                                }

                              } else {

                                dt = (new Date()).toISOString();

                              }

                        }                       


                        htmlcontent += '<span style="font-weight: 700;">'+ moment(dt).format("Do MMMM, YYYY") +'</span>';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; font-size: 14px;">';
                        htmlcontent += 'Delivery Note<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 14px;">';
                        htmlcontent += 'Model/Terms of Payment<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; font-size: 14px;">';
                        htmlcontent += 'Buyers Order No.<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 14px;">';
                        htmlcontent += 'Dated<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; font-size: 14px;">';
                        htmlcontent += 'Despatch Document No.<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 14px;">';
                        htmlcontent += 'Delivery Note Date<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; font-size: 14px;">';
                        htmlcontent += 'Despatched through<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 14px;">';
                        htmlcontent += 'Destination<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td colspan="2" style="padding: 3px; font-size: 14px;">';
                        htmlcontent += 'Terms of Delivery<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                  htmlcontent += '</table>';
                htmlcontent += '</td>';
              htmlcontent += '</tr>';

              htmlcontent += '<tr>';
                htmlcontent += '<td style="padding: 0px; border-right: 1px solid #000000;" colspan="2">';
                  htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">Sr No.</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">Description of Services<br />&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">HSN/SAC<br />&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">Quantity<br />&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">Rate<br />&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">per<br />&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">Amount<br />&nbsp;</td>';
                    htmlcontent += '</tr>';
                    
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                    htmlcontent += '</tr>';

                    var cnt = 1;
                      var pre_taxed_cost_total = 0;
                      var service_tax = 0;
                      var sb_tax = 0;
                      var kk_tax = 0;
                      var cgst_tax = 0;
                      var sgst_tax = 0;
                      var gst_tax = 0;
                      var taxed_cost_total = 0;
                      var discount_total = 0;

                      if (invoiceobj.hasOwnProperty('servicedata') && invoiceobj.servicedata.servicenames.length>0) {

                          var servicedata_arr = invoiceobj.servicedata.servicenames;

                          //angular.forEach(invoiceobj.servicedata.servicenames,function(value,key){


                            for (var i = servicedata_arr.length - 1; i >= 0; i--) {
                              
                            

                        htmlcontent += '<tr>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; vertical-align: top; text-align: right; font-size: 14px;" valign="top" align="right">'+ cnt +'.</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 14px;">';
                          if(invoiceobj.servicedata.service_category_id[cnt-1] == 6 || invoiceobj.servicedata.service_category_id[cnt-1] == 7) {
                            htmlcontent += 'Maintenance and repair services<br />';
                            htmlcontent += '<small>('+ servicedata_arr[cnt-1] +')</small>';
                          } else if(invoiceobj.servicedata.service_category_id[cnt-1] == 9 || invoiceobj.servicedata.service_category_id[cnt-1] == 11) {
                            htmlcontent += 'Cleaning services<br />';
                            htmlcontent += '<small>('+ servicedata_arr[cnt-1] +')</small>';
                          } else if(invoiceobj.servicedata.service_category_id[cnt-1] == 10) {
                            if(servicedata_arr[cnt-1].indexOf('water') !== -1) {
                              htmlcontent += 'Painting and waterproofing services<br />';
                              htmlcontent += '<small>('+ servicedata_arr[cnt-1] +')</small>';
                            } else {
                              htmlcontent += 'Painting and waterproofing services<br />';
                              htmlcontent += '<small>('+ servicedata_arr[cnt-1] +')</small>';                              
                            }
                          }
                          htmlcontent += '</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 14px;">';
                          if(invoiceobj.servicedata.service_category_id[cnt-1] == 6 || invoiceobj.servicedata.service_category_id[cnt-1] == 7) {
                            htmlcontent += '998719';
                          } else if(invoiceobj.servicedata.service_category_id[cnt-1] == 9 || invoiceobj.servicedata.service_category_id[cnt-1] == 11) {
                            htmlcontent += '998533';
                          } else if(invoiceobj.servicedata.service_category_id[cnt-1] == 10) {
                            if(servicedata_arr[cnt-1].toLowerCase().indexOf('water') !== -1) {
                              htmlcontent += '995453';
                            } else {
                              htmlcontent += '995473';
                            }
                          }
                          htmlcontent += '</td>';
                          htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">1</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                          htmlcontent += '<td align="right" style="text-align: right; font-size: 14px;"><span style="font-weight: 700; padding: 3px; ">'+ invoiceobj.servicedata.price[cnt-1].pre_taxed_cost.toFixed(2) +'</span></td>';
                        htmlcontent += '</tr>';

                        pre_taxed_cost_total += invoiceobj.servicedata.price[cnt-1].pre_taxed_cost;
                            // service_tax += invoiceobj.servicedata.price[cnt-1].service_tax;
                            // sb_tax += invoiceobj.servicedata.price[cnt-1].cess_tax;
                            // kk_tax += invoiceobj.servicedata.price[cnt-1].kk_tax;
                            cgst_tax += invoiceobj.servicedata.price[cnt-1].cgst_tax;
                            sgst_tax += invoiceobj.servicedata.price[cnt-1].sgst_tax;
                            gst_tax += invoiceobj.servicedata.price[cnt-1].gst_tax;

                            if(invoice_type == 1) {
                              taxed_cost_total += invoiceobj.servicedata.price[cnt-1].pre_taxed_cost;
                            } else {

                              //if(invoiceobj.servicedata.price[cnt-1].discount != undefined && invoiceobj.servicedata.price[cnt-1].discount != 0) {
                                //taxed_cost_total += (invoiceobj.servicedata.price[cnt-1].taxed_cost - invoiceobj.servicedata.price[cnt-1].discount);  
                              //} else {
                                taxed_cost_total += invoiceobj.servicedata.price[cnt-1].taxed_cost;
                              //}

                              
                            }

                            discount_total += invoiceobj.servicedata.price[cnt-1].discount;
                            cnt++;

                      }

                        }


                        if (invoiceobj.hasOwnProperty('amcdata') && invoiceobj.amcdata.servicenames.length>0) {
                          var amccnt =0;

                          var amcdata_arr = invoiceobj.amcdata.servicenames;

                          //angular.forEach(invoiceobj.amcdata.servicenames,function(value,key){

                            for (var i = amcdata_arr.length - 1; i >= 0; i--) {
                              //amcdata_arr[i]
                            

                        htmlcontent += '<tr>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;" valign="top" align="right">'+ cnt +'.</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 14px;">';
                          if(invoiceobj.amcdata.service_category_id[amccnt] == 6 || invoiceobj.amcdata.service_category_id[amccnt] == 7) {
                            htmlcontent += 'Maintenance and repair services<br />';
                            htmlcontent += '<small>('+ amcdata_arr[amccnt] +')</small>';
                          } else if(invoiceobj.amcdata.service_category_id[amccnt] == 9 || invoiceobj.amcdata.service_category_id[amccnt] == 11) {
                            htmlcontent += 'Cleaning services<br />';
                            htmlcontent += '<small>('+ amcdata_arr[amccnt] +')</small>';
                          } else if(invoiceobj.amcdata.service_category_id[amccnt] == 10) {
                            if(amcdata_arr[amccnt].indexOf('water') !== -1) {
                              htmlcontent += 'Painting and waterproofing services<br />';
                              htmlcontent += '<small>('+ amcdata_arr[amccnt] +')</small>';
                            } else {
                              htmlcontent += 'Painting and waterproofing services<br />';
                              htmlcontent += '<small>('+ amcdata_arr[amccnt] +')</small>';                              
                            }
                          }
                          htmlcontent += '</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 14px;">';
                          if(invoiceobj.amcdata.service_category_id[amccnt] == 6 || invoiceobj.amcdata.service_category_id[amccnt] == 7) {
                            htmlcontent += '998719';
                          } else if(invoiceobj.amcdata.service_category_id[amccnt] == 9 || invoiceobj.amcdata.service_category_id[amccnt] == 11) {
                            htmlcontent += '998533';
                          } else if(invoiceobj.amcdata.service_category_id[amccnt] == 10) {
                            if(amcdata_arr[amccnt].toLowerCase().indexOf('water') !== -1) {
                              htmlcontent += '995453';
                            } else {
                              htmlcontent += '995473';
                            }
                          }
                          htmlcontent += '</td>';
                          htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">1</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                          htmlcontent += '<td align="right" style="text-align: right;"><span style="font-weight: 700; padding: 3px; font-size: 14px;">'+ invoiceobj.amcdata.price[amccnt].pre_taxed_cost.toFixed(2) +'</span></td>';
                        htmlcontent += '</tr>';

                        pre_taxed_cost_total += invoiceobj.amcdata.price[amccnt].pre_taxed_cost;
                            // service_tax += invoiceobj.amcdata.price[amccnt].service_tax;
                            // sb_tax += invoiceobj.amcdata.price[amccnt].cess_tax;
                            // kk_tax += invoiceobj.amcdata.price[amccnt].kk_tax;
                            cgst_tax += invoiceobj.amcdata.price[amccnt].cgst_tax;
                            sgst_tax += invoiceobj.amcdata.price[amccnt].sgst_tax;
                            gst_tax += invoiceobj.amcdata.price[amccnt].gst_tax;

                            if(invoice_type == 1) {
                              taxed_cost_total += invoiceobj.amcdata.price[amccnt].pre_taxed_cost;
                            } else {

                              //if(invoiceobj.servicedata.price[cnt-1].discount != undefined && invoiceobj.servicedata.price[cnt-1].discount != 0) {
                                //taxed_cost_total += (invoiceobj.servicedata.price[cnt-1].taxed_cost - invoiceobj.servicedata.price[cnt-1].discount);  
                              //} else {
                                taxed_cost_total += invoiceobj.amcdata.price[amccnt].taxed_cost;
                              //}

                              
                            }

                            discount_total += invoiceobj.amcdata.price[amccnt].discount;

                            cnt++;
                            amccnt++;

                      }

                        }

                        if(discount_total !=0 && discount_total != "") {
                          taxed_cost_total = taxed_cost_total - discount_total;
                        }


                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; vertical-align: top; text-align: right; font-size: 14px;" valign="top" align="right">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 14px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 14px;">&nbsp;</td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td align="right" style="text-align: right; font-size: 14px; border-top: 1px solid #000000; font-size: 14px;">'+ pre_taxed_cost_total.toFixed(2) +'</td>';
                    htmlcontent += '</tr>';

                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;" align="right"><span style="font-weight: 700"><em>OUTPUT CGST</em></span></td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">9</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 14px;">%</td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;"><span style="font-weight: 700;">'+ cgst_tax.toFixed(2) +'</span></td>';
                    htmlcontent += '</tr>';
                    
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;" align="right"><span style="font-weight: 700"><em>OUTPUT SGST</em></span></td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">9</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 14px;">%</td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;"><span style="font-weight: 700;">'+ sgst_tax.toFixed(2) +'</span></td>';
                    htmlcontent += '</tr>';

                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                    htmlcontent += '</tr>';

                    htmlcontent += '<tr>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;" align="right">Total</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;" align="right"><span style="font-weight: 700;">Rs. '+ taxed_cost_total +'</span></td>';
                    htmlcontent += '</tr>';
                    
                  htmlcontent += '</table>';

                htmlcontent += '</td>';

              htmlcontent += '</tr>';

              htmlcontent += '<tr>';
                htmlcontent += '<td valign="top" style="padding: 3px; font-size: 14px; vertical-align: top;">';
                  htmlcontent += '<small>Amount Chargeable (in words)</small><br />';
                  htmlcontent += '<span style="font-weight: 700;">INR '+ inWords(taxed_cost_total) +'</span>';
                htmlcontent += '</td>';
                htmlcontent += '<td valign="top" align="right" style="padding: 3px; font-size: 14px; vertical-align: top; text-align: right;">';
                  htmlcontent += '<em>E. & O.E</em>';
                htmlcontent += '</td>';
              htmlcontent += '</tr>';

              htmlcontent += '<tr>';
                htmlcontent += '<td style="padding: 0px;" colspan="2">';

                  htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="width: 40%; border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;" valign="top" align="center">HSN/SAC</td>';
                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">Taxable<br />Value</td>';
                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 0px; font-size: 14px;">';
                        htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td colspan="2" align="center" style="border-bottom: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">Central Tax</td>';
                          htmlcontent += '</tr>';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td align="center" align="center" style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">Rate</td>';
                            htmlcontent += '<td align="center" style="width: 50%; padding: 3px; text-align: center; font-size: 14px;">Amount</td>';
                          htmlcontent += '</tr>';
                        htmlcontent += '</table>';
                      htmlcontent += '</td>';
                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; padding: 0px; font-size: 14px;">';
                        htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td colspan="2" align="center" style="border-bottom: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">State Tax</td>';
                          htmlcontent += '</tr>';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td align="center"  style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 14px;">Rate</td>';
                            htmlcontent += '<td align="center" style="width: 50%; padding: 3px; text-align: center; font-size: 14px;">Amount</td>';
                          htmlcontent += '</tr>';
                        htmlcontent += '</table>';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';

                    var cnt = 0;
                    var pre_taxed_cost_total = 0;
                    var cgst_tax = 0;
                    var sgst_tax = 0;

                    if (invoiceobj.hasOwnProperty('servicedata') && invoiceobj.servicedata.servicenames.length>0) {

                          var servicedata_arr = invoiceobj.servicedata.servicenames;

                          //angular.forEach(invoiceobj.servicedata.servicenames,function(value,key){


                            for (var i = servicedata_arr.length - 1; i >= 0; i--) {
                              //Things[i]
                            

                        htmlcontent += '<tr>';
                          htmlcontent += '<td style="width: 40%; border-right: 1px solid #000000; padding: 3px; font-size: 14px;" valign="top">';
                            if(invoiceobj.servicedata.service_category_id[cnt] == 6 || invoiceobj.servicedata.service_category_id[cnt] == 7) {
                              htmlcontent += '998719';
                            } else if(invoiceobj.servicedata.service_category_id[cnt] == 9 || invoiceobj.servicedata.service_category_id[cnt] == 11) {
                              htmlcontent += '998533';
                            } else if(invoiceobj.servicedata.service_category_id[cnt] == 10) {
                              if(servicedata_arr[cnt].toLowerCase().indexOf('water') !== -1) {
                                htmlcontent += '995453';
                              } else {
                                htmlcontent += '995473';
                              }
                            }
                          htmlcontent += '</td>';
                          htmlcontent += '<td valign="top" align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">'+ invoiceobj.servicedata.price[cnt].pre_taxed_cost.toFixed(2) +'</td>';
                          htmlcontent += '<td valign="top" align="center" style="border-right: 1px solid #000000; padding: 0px; font-size: 14px;">';
                            htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                              htmlcontent += '<tr>';
                                htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">9%</td>';
                                htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 14px;">'+ invoiceobj.servicedata.price[cnt].cgst_tax.toFixed(2) +'</td>';
                              htmlcontent += '</tr>';
                            htmlcontent += '</table>';
                          htmlcontent += '</td>';
                          htmlcontent += '<td valign="top" align="center" style="padding: 0px; font-size: 14px;">';
                            htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                              htmlcontent += '<tr>';
                                htmlcontent += '<td align="right"  style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">9%</td>';
                                htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 14px;">'+ invoiceobj.servicedata.price[cnt].cgst_tax.toFixed(2) +'</td>';
                              htmlcontent += '</tr>';
                            htmlcontent += '</table>';
                          htmlcontent += '</td>';
                        htmlcontent += '</tr>';

                        pre_taxed_cost_total += invoiceobj.servicedata.price[cnt].pre_taxed_cost;
                            cgst_tax += invoiceobj.servicedata.price[cnt].cgst_tax;
                            sgst_tax += invoiceobj.servicedata.price[cnt].sgst_tax;

                        cnt++;

                      }

                        }

                        var amccnt = 0;

                        if (invoiceobj.hasOwnProperty('amcdata') && invoiceobj.amcdata.servicenames.length>0) {

                          var amcdata_arr = invoiceobj.amcdata.servicenames;

                          //angular.forEach(invoiceobj.amcdata.servicenames,function(value,key){

                            for (var i = amcdata_arr.length - 1; i >= 0; i--) {
                              //amcdata_arr[i]
                            

                        htmlcontent += '<tr>';
                          htmlcontent += '<td style="width: 40%; border-right: 1px solid #000000; padding: 3px; font-size: 14px;" valign="top">';
                            if(invoiceobj.amcdata.service_category_id[amccnt] == 6 || invoiceobj.amcdata.service_category_id[amccnt] == 7) {
                              htmlcontent += '998719';
                            } else if(invoiceobj.amcdata.service_category_id[amccnt] == 9 || invoiceobj.amcdata.service_category_id[amccnt] == 11) {
                              htmlcontent += '998533';
                            } else if(invoiceobj.amcdata.service_category_id[amccnt] == 10) {
                              if(amcdata_arr[amccnt].toLowerCase().indexOf('water') !== -1) {
                                htmlcontent += '995453';
                              } else {
                                htmlcontent += '995473';
                              }
                            }
                          htmlcontent += '</td>';
                          htmlcontent += '<td valign="top" align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">'+ invoiceobj.amcdata.price[amccnt].pre_taxed_cost.toFixed(2) +'</td>';
                          htmlcontent += '<td valign="top" align="center" style="border-right: 1px solid #000000;  padding: 0px; font-size: 14px;">';
                            htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                              htmlcontent += '<tr>';
                                htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">9%</td>';
                                htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 14px;">'+ invoiceobj.amcdata.price[amccnt].cgst_tax.toFixed(2) +'</td>';
                              htmlcontent += '</tr>';
                            htmlcontent += '</table>';
                          htmlcontent += '</td>';
                          htmlcontent += '<td valign="top" align="center" style="padding: 0px; font-size: 14px;">';
                            htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                              htmlcontent += '<tr>';
                                htmlcontent += '<td align="right"  style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">9%</td>';
                                htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 14px;">'+ invoiceobj.amcdata.price[amccnt].cgst_tax.toFixed(2) +'</td>';
                              htmlcontent += '</tr>';
                            htmlcontent += '</table>';
                          htmlcontent += '</td>';
                        htmlcontent += '</tr>';

                        pre_taxed_cost_total += invoiceobj.amcdata.price[amccnt].pre_taxed_cost;
                            cgst_tax += invoiceobj.amcdata.price[amccnt].cgst_tax;
                            sgst_tax += invoiceobj.amcdata.price[amccnt].sgst_tax;

                        amccnt++;

                        }

                        }

                    // htmlcontent += '<tr>';
                    //  htmlcontent += '<td style="width: 40%; border-right: 1px solid #000000; padding: 3px;" valign="top">998724</td>';
                    //  htmlcontent += '<td valign="top" align="right" style="border-right: 1px solid #000000; padding: 3px;">5,000.00</td>';
                    //  htmlcontent += '<td valign="top" align="center" style="border-right: 1px solid #000000;">';
                    //    htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    //      htmlcontent += '<tr>';
                    //        htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000; padding: 3px;">9%</td>';
                    //        htmlcontent += '<td align="right" style="width: 50%; padding: 3px;">450.00</td>';
                    //      htmlcontent += '</tr>';
                    //    htmlcontent += '</table>';
                    //  htmlcontent += '</td>';
                    //  htmlcontent += '<td valign="top" align="center">';
                    //    htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    //      htmlcontent += '<tr>';
                    //        htmlcontent += '<td align="right"  style="width: 50%; border-right: 1px solid #000000; padding: 3px;">9%</td>';
                    //        htmlcontent += '<td align="right" style="width: 50%; padding: 3px;">450.00</td>';
                    //      htmlcontent += '</tr>';
                    //    htmlcontent += '</table>';
                    //  htmlcontent += '</td>';
                    // htmlcontent += '</tr>';

                    // htmlcontent += '<tr>';
                    //  htmlcontent += '<td style="width: 40%; border-right: 1px solid #000000;padding: 3px;" valign="top">995479</td>';
                    //  htmlcontent += '<td valign="top" align="right" style="border-right: 1px solid #000000;">5,000.00</td>';
                    //  htmlcontent += '<td valign="top" align="center" style="border-right: 1px solid #000000;">';
                    //    htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    //      htmlcontent += '<tr>';
                    //        htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000;padding: 3px;">9%</td>';
                    //        htmlcontent += '<td align="right" style="width: 50%;padding: 3px;">450.00</td>';
                    //      htmlcontent += '</tr>';
                    //    htmlcontent += '</table>';
                    //  htmlcontent += '</td>';
                    //  htmlcontent += '<td valign="top" align="center">';
                    //    htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    //      htmlcontent += '<tr>';
                    //        htmlcontent += '<td align="right"  style="width: 50%; border-right: 1px solid #000000;padding: 3px;">9%</td>';
                    //        htmlcontent += '<td align="right" style="width: 50%; padding: 3px;">450.00</td>';
                    //      htmlcontent += '</tr>';
                    //    htmlcontent += '</table>';
                    //  htmlcontent += '</td>';
                    // htmlcontent += '</tr>';

                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="width: 40%; border-top: 1px solid #000000; border-right: 1px solid #000000;padding: 3px; text-align: right; font-size: 14px;" valign="top" align="right"><span style="font-weight: 700">Total</span></td>';
                      htmlcontent += '<td valign="top" align="right" style="border-top: 1px solid #000000; border-right: 1px solid #000000;padding: 3px; text-align: right; font-size: 14px;"><span style="font-weight: 700">'+ pre_taxed_cost_total.toFixed(2) +'</span></td>';
                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; border-right: 1px solid #000000; padding: 0px; font-size: 14px;">';
                        htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000;padding: 3px;">&nbsp;</td>';
                            htmlcontent += '<td align="right" style="width: 50%;padding: 3px; text-align: right; font-size: 14px;"><span style="font-weight: 700">'+ cgst_tax.toFixed(2) +'</span></td>';
                          htmlcontent += '</tr>';
                        htmlcontent += '</table>';
                      htmlcontent += '</td>';
                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; padding: 0px; font-size: 14px;">';
                        htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td align="right"  style="width: 50%; border-right: 1px solid #000000;padding: 3px;">&nbsp;</td>';
                            htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 14px;"><span style="font-weight: 700">'+ sgst_tax.toFixed(2) +'</span></td>';
                          htmlcontent += '</tr>';
                        htmlcontent += '</table>';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';

                  htmlcontent += '</table>';
                  
                htmlcontent += '</td>';
              htmlcontent += '</tr>';


              htmlcontent += '<tr>';
                htmlcontent += '<td style="border-top: 1px solid #000000; padding: 3px; font-size: 14px;" colspan="2">';
                  htmlcontent += '<small>Tax Amount (in words) : <span style="font-weight: 700">INR '+ inWords(cgst_tax + sgst_tax) +' Only</span></small>';
                htmlcontent += '</td>';
              htmlcontent += '</tr>';

              htmlcontent += '<tr>';
                htmlcontent += '<td colspan="2" style="padding: 3px;">';
                  htmlcontent += '&nbsp;';
                htmlcontent += '</td>';
              htmlcontent += '</tr>';

              htmlcontent += '<tr>';
                htmlcontent += '<td style="width: 50%; padding: 3px; font-size: 14px;">';
                  // htmlcontent += 'Companys PAN : <span style="font-weight: 700">AAJCM6704H</span><br /><br />';
                  htmlcontent += '<span style="text-decoration: underline;">Declaration</span><br />';
                  htmlcontent += 'We declare that this invoice shows the actual price of the service provided and that all the particulars are tru and correct.<br /><br />';
                  htmlcontent += 'Kindly address the cheque to - <span style="font-weight: 700">Mister Homecare Services Pvt. Ltd.</span><br />';
                  htmlcontent += 'For online payment- <a href="'+ invoiceobj.payment_link +'">Click here</a>';
                htmlcontent += '</td>';
                htmlcontent += '<td style="width: 50%; padding: 0px; vertical-align: bottom; font-size: 14px;" valign="bottom">';
                  
                  htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td align="right" style="border-top: 1px solid #000000; border-left: 1px solid #000000; padding: 3px; text-align: right; font-size: 14px;">';
                        htmlcontent += 'for Mister Homecare Services Private Limited<br /><br /><br /><br />';
                        htmlcontent += 'Varun Vaz - CRM Account Manager<br />';
                        htmlcontent += 'Authorised Signatory';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                  htmlcontent += '</table>';

                htmlcontent += '</td>';
              htmlcontent += '</tr>';


          htmlcontent += '</table>';


        htmlcontent += '</td>';
      htmlcontent += '</tr>';
    htmlcontent += '</table>';

    return htmlcontent;
}


function createInvoiceTemplate(invoiceobj,invoice_type) {

    var htmlcontent = "";

    htmlcontent = '<div bgcolor="#f6f8f1; color:#500050 !important"><table cellspacing="0" cellpadding="0" border="1" align="center" style="width:80%">';
    htmlcontent += '<tbody>';
    htmlcontent += '<tr>';
    htmlcontent += '<td bgcolor="white" style="padding:20px 30px 80px 30px">';
    htmlcontent += '<table cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" align="center" style="margin-top:10px;width:100%;max-width:600px;padding:50px 0 0px 0px">';
    htmlcontent += '<tbody>';
    htmlcontent += '<tr>';
    htmlcontent += '<td>';
    htmlcontent += '<table cellspacing="0" cellpadding="0" border="0" align="left" style="width:40%;padding:0px 0 0 0">';
    htmlcontent += '<tbody>';
    htmlcontent += '<tr>';
    htmlcontent += '<td style="padding:0 0 0px 5px;font-family:"Neris Light",arial;font-size:18px;min-height:auto;width:50px"></td>';
    htmlcontent += '<td>';
    htmlcontent += 'Hello <span style="padding:0px 0 0 0px;font-family:"Neris Semibold",arial;font-size:18px;width:50px;min-height:0px">';
    htmlcontent +=  invoiceobj['billing_name'];
    htmlcontent += '</span>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody>';
    htmlcontent += '</table>';
    htmlcontent += '<table border="0" align="right" style="width:50%;max-width:100%;float:right">';
    htmlcontent += '<tbody>';
    htmlcontent += '<tr>';
    htmlcontent += '<td align="right" style="padding:0px 0 0px 0px;font-family:"Neris Light",arial;font-size:12px">';
    htmlcontent += 'TAX INVOICE ';
    htmlcontent += '<span style="padding:0px 0 0px 0px;border:none;border-collapse:collapse;font-family:"Roboto",sans-serif;font-size:12px;font-weight:700;width:80px;text-align:right">';
    htmlcontent +=  invoiceobj['invoice_id'];
    htmlcontent += '</span>';
    htmlcontent += '<p align="right" valign="top" style="padding:0px 0 0px 0px;border:none;font-family:"Roboto",sans-serif;font-size:12px;width:100px;text-align:right"></p>';

    if(invoiceobj['servicedata']['servicenames'].length > 0 && invoiceobj['servicedata']['servicenames'].length < 2) {
      htmlcontent += moment(invoiceobj['servicedata']['service_date'][0][0]).format("Do MMMM, YYYY");
    } else {
      htmlcontent += moment().format('Do MMMM, YYYY');
    }

    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody>';
    htmlcontent += '</table>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr>';
    htmlcontent += '<td style="padding:10px 0 10px 0">';
    htmlcontent += '<hr width="100%" size="1" color="#fec11f">';
    htmlcontent += '<div class="" style="width:40%;float:left">';
    htmlcontent += '  <a target="_blank" href="http://www.mrhomecare.in">';
    htmlcontent += '  <img height="35" width="156" alt="Mr Home Care logo" src="https://www.mrhomecare.in/wp-content/themes/mrhomecare/mhc-lib/img/logo.png" class="CToWUd">';
    htmlcontent += '  </a>';
    htmlcontent += '  <p style="font-size:12px;font-family:"Roboto",sans-serif;">';
    htmlcontent += '    <span style="font-weight:700">Mister Homecare Services Private Limited</span> <br>Gordhan Building, 2nd Floor,<br>';
    htmlcontent += '    Dr. Parekh Street, Prathana Samaj <br>Mumbai - 400004<br/>';
    htmlcontent += '    <span style="font-weight:700;">Ph: </span>9022070070<br/>';
    htmlcontent += '     <span style="font-weight:700;">Email ID: </span>customercare@mrhomecare.in';
    htmlcontent += '  </p>';
    htmlcontent += '</div>';
    htmlcontent += '<table border="0" align="right" style="padding:0 24px 10px 9px;width:55%;max-width:60%">';
    htmlcontent += '<tbody><tr>';
    htmlcontent += '<td>';
    htmlcontent += '<table border="0" style="width:50%;max-width:100%;">';
    htmlcontent += '<tbody>';
    htmlcontent += '<tr>';

    htmlcontent += '</tr>';
    htmlcontent += '</tbody>';
    htmlcontent += '</table>';
    htmlcontent += '<table border="0" style="" align="right" valign="top">';
    htmlcontent += '<tbody>';
    htmlcontent += '<tr><td valign="top" align="left" style="padding:0px 0 0px 10px;font-family:"Roboto",sans-serif;font-size:14px;font-weight:700;line-height:1em">';
    htmlcontent += 'Bill To:';
    htmlcontent += '</td></tr>';
    htmlcontent += '<tr>';
    htmlcontent += '<td style="padding:0 0 0px 0px">';
    htmlcontent += '<p align="left" style="padding:0px 0 0px 0px;border:none;overflow:hidden;font-family:"Roboto",sans-serif;font-size:12px;width:200px;min-height:120px">';
    htmlcontent += '<b>'+ invoiceobj['billing_name'] +'</b>';
    htmlcontent += '<br>';
    htmlcontent += '<br>';
    htmlcontent += invoiceobj['billing_address'];
    htmlcontent += '<br>';
    htmlcontent += '<b>Ph:</b> <a target="_blank" value="'+invoiceobj['billing_phone_no']+'" href="tel:'+invoiceobj['billing_phone_no']+'">'+invoiceobj['billing_phone_no']+'</a>';
    htmlcontent += '<br>';
    htmlcontent += '<b>Email ID:</b> '+ invoiceobj['billing_email_id'];
    htmlcontent += '<br>';
    htmlcontent += '</p>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody>';
    htmlcontent += '</table>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody></table>';
    htmlcontent += '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0 0px 0">';
    htmlcontent += '<tbody><tr>';
    htmlcontent += '<td style="width:100px">';
    htmlcontent += '<hr width="100%" size="1px" color="#fec11f" align="left" style="display:inline-block">';
    htmlcontent += '</td>';
    htmlcontent += '<td style="width:50px !important;text-align:center !important;">';
    htmlcontent += '<h6 style="display:inline;color:#fec11f;font-size:18px;padding:0 0px 0 0px">Booking Details</h6>';
    htmlcontent += '</td>';
    htmlcontent += '<td style="width:100px">';
    htmlcontent += '<hr width="100%" size="1px" color="#fec11f" align="right" style="display:inline-block">';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody></table>';
    htmlcontent += '<span style="font-family:"Neris Thin",arial;font-size:15px;font-weight:400;padding:0px 0 20px 20px">';
    htmlcontent += '<table border="0" style="color:black;font-size:14px;font-family:"Neris Thin",arial">';
    htmlcontent += '<tbody><tr>';
    htmlcontent += '<td>Service:</td>';
    htmlcontent += '<td>';

    if(invoiceobj['servicedata']['servicenames'].length > 0) {

      for (var p = 0; p < invoiceobj['servicedata']['servicenames'].length; p++) {
        if(p == (invoiceobj['servicedata']['servicenames'].length-1)) {
          htmlcontent += invoiceobj['servicedata']['servicenames'][p] + " (" + invoiceobj['servicedata']['variantnames'][p] +")" + " - " + moment(invoiceobj['servicedata']['service_date'][p][0]).format("Do MMMM, YYYY") + " at " + moment(invoiceobj['servicedata']['service_time'][p][0]).format("h:mm a");
        } else {
          htmlcontent += invoiceobj['servicedata']['servicenames'][p] + " (" + invoiceobj['servicedata']['variantnames'][p] +")" + " - " + moment(invoiceobj['servicedata']['service_date'][p][0]).format("Do MMMM, YYYY") + " at " + moment(invoiceobj['servicedata']['service_time'][p][0]).format("h:mm a") + ", ";
        }
      };

    }

    if(invoiceobj.hasOwnProperty('amcdata') ) {
         if(invoiceobj['servicedata']['servicenames'].length > 0) {
          htmlcontent += ',' ;
          }

        if(invoiceobj['amcdata']['servicenames'].length > 0) {

          for (var p = 0; p < invoiceobj['amcdata']['servicenames'].length; p++) {
            if(p == (invoiceobj['amcdata']['servicenames'].length-1)) {
              htmlcontent += invoiceobj['amcdata']['servicenames'][p];
            } else {
              htmlcontent += invoiceobj['amcdata']['servicenames'][p] + ", ";
            }
          };

        }
    }

    if(invoiceobj.hasOwnProperty('client_name') ) {
      htmlcontent += " for " + invoiceobj['client_name'];
    }

    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody></table>';
    htmlcontent += '</span>';
    htmlcontent += '<table width="100%" border="0" style="border-collapse:collapse;font-family:"Roboto",sans-serif;color:black;font-size:12px">';
    htmlcontent += '<tbody><tr width="100%" style="font-weight:500;font-size:14px;background:#fec11f;color:white;height:30px">';
    htmlcontent += '<td align="center" style="width:10px">';
    htmlcontent += '<strong>Sr.No.</strong>';
    htmlcontent += '</td>';
    htmlcontent += '<td align="center">';
    htmlcontent += '<strong>Service Breakup</strong>';
    htmlcontent += '</td>';
    htmlcontent += '<td align="center">';
    htmlcontent += '<strong>Quantity</strong>';
    htmlcontent += '</td>';
    htmlcontent += '<td align="center">';
    htmlcontent += '<strong>Rate</strong>';
    htmlcontent += '</td>';
    htmlcontent += '<td align="center">';
    htmlcontent += '<strong>Amount</strong>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr cellpadding="1">';
    htmlcontent += '<td></td>';
    htmlcontent += '<td align="center" style="font-weight:700;font-size:14px;padding-top:1%;padding-bottom:1%" colspan="1">';

    htmlcontent += '</td>';
    htmlcontent += '</tr>';

    var cnt = 1;
    var pre_taxed_cost_total = 0;
    var service_tax = 0;
    var sb_tax = 0;
    var kk_tax = 0;
    var gst_tax = 0;
    var taxed_cost_total = 0;
    if (invoiceobj.hasOwnProperty('servicedata') && invoiceobj.servicedata.servicenames.length>0) {

      var servicenames_arr = invoiceobj.servicedata.servicenames;

      for (var i = servicenames_arr.length - 1; i >= 0; i--) {
        
        htmlcontent += '<tr>';
        htmlcontent += '  <td align="center">'+ cnt +'</td>';
        htmlcontent += '  <td align="left">'+ servicenames_arr[cnt-1] +'</td>';
        htmlcontent += '  <td align="center">1</td>';
        htmlcontent += '  <td align="center">Rs. '+ invoiceobj.servicedata.price[cnt-1].pre_taxed_cost +'</td>';
        htmlcontent += '  <td align="right">Rs. '+ invoiceobj.servicedata.price[cnt-1].pre_taxed_cost +'</td>';
        htmlcontent += '</tr>';

        pre_taxed_cost_total += invoiceobj.servicedata.price[cnt-1].pre_taxed_cost;
        service_tax += invoiceobj.servicedata.price[cnt-1].service_tax;
        sb_tax += invoiceobj.servicedata.price[cnt-1].cess_tax;
        kk_tax += invoiceobj.servicedata.price[cnt-1].kk_tax;
        //gst_tax += invoiceobj.servicedata.price[cnt-1].gst_tax;
        if(invoice_type == 1) {
          taxed_cost_total += invoiceobj.servicedata.price[cnt-1].pre_taxed_cost;
        } else {
          //if(invoiceobj.servicedata.price[cnt-1].discount != undefined && invoiceobj.servicedata.price[cnt-1].discount != 0) {
            //taxed_cost_total += (invoiceobj.servicedata.price[cnt-1].taxed_cost - invoiceobj.servicedata.price[cnt-1].discount);
          //} else {
            taxed_cost_total += invoiceobj.servicedata.price[cnt-1].taxed_cost;
          //}

        }

        cnt++;


      };


    };

    if (invoiceobj.hasOwnProperty('amcdata')) {
        var amccnt =0;

        var amc_servicenames_arr = invoiceobj.amcdata.servicenames;

        for (var i = amc_servicenames_arr.length - 1; i >= 0; i--) {

          htmlcontent += '<tr>';
          htmlcontent += '  <td align="center">'+ cnt +'</td>';
          htmlcontent += '  <td align="left">'+ amc_servicenames_arr[amccnt] +'</td>';
          htmlcontent += '  <td align="center">1</td>';
          htmlcontent += '  <td align="center">Rs. '+ invoiceobj.amcdata.price[amccnt].pre_taxed_cost +'</td>';
          htmlcontent += '  <td align="right">Rs. '+ invoiceobj.amcdata.price[amccnt].pre_taxed_cost +'</td>';
          htmlcontent += '</tr>';

          pre_taxed_cost_total += invoiceobj.amcdata.price[amccnt].pre_taxed_cost;
          service_tax += invoiceobj.amcdata.price[amccnt].service_tax;
          sb_tax += invoiceobj.amcdata.price[amccnt].cess_tax;
          kk_tax += invoiceobj.amcdata.price[amccnt].kk_tax;
          //gst_tax += invoiceobj.amcdata.price[amccnt].gst_tax;
          taxed_cost_total += invoiceobj.amcdata.price[amccnt].client_payment_expected;

          cnt++;
          amccnt++;

          
        };

    };




    htmlcontent += '<tr>';
    htmlcontent += '  <td align="center"></td>';
    htmlcontent += '  <td align="left"><strong>Pre Tax Total</strong</td>';
    htmlcontent += '  <td align="center"></td>';
    htmlcontent += '  <td align="center"></td>';
    htmlcontent += '  <td align="right">Rs. '+ Math.floor(pre_taxed_cost_total) +'</td>';
    htmlcontent += '</tr>';

    // htmlcontent += '<tr>';
    // htmlcontent += '  <td align="center"></td>';
    // htmlcontent += '  <td align="left">GST Tax @ 18 % 2017-18</td>';
    // htmlcontent += '  <td></td>';
    // htmlcontent += '  <td></td>';
    // htmlcontent += '  <td align="right">Rs. '+ Math.floor(gst_tax) +'</td>';
    // htmlcontent += '</tr>';

    htmlcontent += '<tr>';
    htmlcontent += '  <td align="center"></td>';
    htmlcontent += '  <td align="left">Service Tax @ 14 % 2017-18</td>';
    htmlcontent += '  <td></td>';
    htmlcontent += '  <td></td>';
    htmlcontent += '  <td align="right">Rs. '+ Math.floor(service_tax) +'</td>';
    htmlcontent += '</tr>';

    htmlcontent += '<tr>';
    htmlcontent += '  <td align="center"></td>';
    htmlcontent += '  <td align="left">Swachh Bharat Cess @ 0.5 % 2017-18</td>';
    htmlcontent += '  <td></td>';
    htmlcontent += '  <td></td>';
    htmlcontent += '  <td align="right">Rs. '+ Math.floor(sb_tax) +'</td>';
    htmlcontent += '</tr>';

    htmlcontent += '<tr>';
    htmlcontent += '  <td align="center"></td>';
    htmlcontent += '  <td align="left">Krishi Kalyan Cess @ 0.5 % 2017-18</td>';
    htmlcontent += '  <td></td>';
    htmlcontent += '  <td></td>';
    htmlcontent += '  <td align="right">Rs. '+ Math.floor(kk_tax) +'</td>';
    htmlcontent += '</tr>';

    htmlcontent += '<tr>';
    htmlcontent += '<td style="width:50px"></td>';
    htmlcontent += '<td></td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr style="border-bottom:1px solid #fec11f">';
    htmlcontent += '<td></td>';
    htmlcontent += '<td></td>';
    htmlcontent += '<td align="right" style="padding:0 10px 0 0" colspan="2">';
    htmlcontent += '</td>';
    htmlcontent += '<td>';
    htmlcontent += '<strong>';
    htmlcontent += '<p style="border:none;float:center;text-align:center">';

    htmlcontent += '</p>';
    htmlcontent += '</strong>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr style="border-bottom:1px solid #fec11f">';
    htmlcontent += '<td></td>';
    htmlcontent += '<td></td>';
    htmlcontent += '<td></td>';
    htmlcontent += '<td align="right" style="padding:0 10px 0 0">';
    htmlcontent += '<strong>Net Payable</strong>';
    htmlcontent += '</td>';
    htmlcontent += '<td align="right">';
    htmlcontent += '<p style="border:none;float:center;font-weight:700;text-align:right;">';
    htmlcontent += 'Rs. '+ taxed_cost_total;
    htmlcontent += '</p>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr>';
    htmlcontent += '<td colspan="2">MHC ST No.: AAJCM6704HSD001</td>';
    htmlcontent += '<td></td>';
    htmlcontent += '<td align="right" style="font-size:14px;padding:0 10px 0 0"></td>';
    htmlcontent += '<td>';
    htmlcontent += '<strong>';
    htmlcontent += '<p type="text" style="border:none;float:center;text-align:center;font-weight:700">';
    htmlcontent += '</p>';
    htmlcontent += '</strong>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr>';
    htmlcontent += '<td colspan="2">Company PAN No.: AAJCM6704H</td>';
    htmlcontent += '<td align="right" colspan="3">';
    htmlcontent += '<a target="_blank" style="padding:1%;border:1px solid #fec11f;color:black;background-color:#fec11f;text-decoration:none" href="'+invoiceobj['payment_link']+'">';
    htmlcontent += 'Click to pay online';
    htmlcontent += '</a>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';


    var vat_no = '27185308368V';

    if(invoiceobj['city'] == 2) {
      vat_no = '29521364516';
    } else if(invoiceobj['city'] == 3) {
      vat_no = '7687166938';
    }

    htmlcontent += '<tr>';
    htmlcontent += '<td colspan="2" style="padding: 10px 5px;">VAT No.: '+ vat_no +'</td>';
    htmlcontent += '<td style="padding: 10px 5px;"></td>';
    htmlcontent += '<td align="right" style="font-size:14px;padding:10px 0px 0 0"></td>';
    htmlcontent += '<td style="padding: 10px 5px;">';
    htmlcontent += '<strong>';
    htmlcontent += '<p type="text" style="border:none;float:center;text-align:center;font-weight:700">';
    htmlcontent += '</p>';
    htmlcontent += '</strong>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';


    htmlcontent += '<tr>';
    htmlcontent += '<td colspan="4"></td>';
    htmlcontent += '<td>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '<tr>';
    htmlcontent += '<td colspan="4"></td>';
    htmlcontent += '<td>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody></table>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody>';
    htmlcontent += '</table>';
    htmlcontent += '<div class="" style="margin-left:5%;width:95%">';
    htmlcontent += '  <p style=" text-decoration: underline">Declaration</p>';
    htmlcontent += '  <p> We declare that this invoice shows the actual price of the service provided and that all the particulars are true and correct.</p>';
    htmlcontent += '</div>';
    htmlcontent += '<table style="margin-left:5%;width:95%" border="0" align="center">';
    htmlcontent += '<tbody><tr>';
    htmlcontent += '<td style="padding:20px 0 0px 0">';
    htmlcontent += '  <p>Kindly address the cheque to - <b>Mister Homecare Services Pvt. Ltd.</b></p>';
    htmlcontent += '</td>';
    htmlcontent += '<td>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody></table>';
    htmlcontent += '<table width="100%" border="0" align="center">';
    htmlcontent += '<tbody><tr>';
    htmlcontent += '<td>';
    htmlcontent += '<h2 align="center" width="100%" style="border-collapse:collapse;font-family:"Roboto",sans-serif;color:black;font-weight:300;font-size:14px" border="0">';
    htmlcontent += '</h2>';
    htmlcontent += '<table align="center">';
    htmlcontent += '<tbody><tr>';
    htmlcontent += '<td>';
    htmlcontent += '<a target="_blank" href="https://twitter.com/misterhomecare">';
    htmlcontent += '<img alt="Twitter" src="http://engine.mrhomecare.net/images/twitter.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
    htmlcontent += '</a>';
    htmlcontent += '<a target="_blank" href="https://www.facebook.com/MisterHomecare/">';
    htmlcontent += '<img alt="Facebook" src="http://engine.mrhomecare.net/images/facebook.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
    htmlcontent += '</a>';
    htmlcontent += '<a target="_blank" href="https://www.linkedin.com/company/mr-homecare">';
    htmlcontent += '<img alt="Facebook" src="http://engine.mrhomecare.net/images/linkedin.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
    htmlcontent += '</a>';
    htmlcontent += '<a target="_blank" href="https://www.instagram.com/mrhomecare/">';
    htmlcontent += '<img alt="Facebook" src="http://engine.mrhomecare.net/images/instagram.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
    htmlcontent += '</a>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody></table>';
    htmlcontent += '<p align="center" style="font-family:"Roboto",sans-serif;color:black;font-weight:300;font-size:15px">';
    htmlcontent += '<i>Thanks for using our service!</i>';
    htmlcontent += '</p>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody></table>';
    htmlcontent += '</td>';
    htmlcontent += '</tr>';
    htmlcontent += '</tbody>';
    htmlcontent += '</table><div class="yj6qo"></div><div class="adL">';
    htmlcontent += '</div>';
  htmlcontent += '</div>';

  return htmlcontent;

};


function getMaxDate(service_dates_array) {

  var new_service_dates_array = [];
  var max_date_in_unix = 0;
  var max_date = "";
  var return_arr = [];

  for (var i = 0; i < service_dates_array.length; i++) {
    var dt = moment(service_dates_array[i][0]).unix();
    if(dt > max_date_in_unix) {
      max_date_in_unix = dt;
      max_date = service_dates_array[i][0];
    }
  };

  return max_date;

}

function inWords (totalRent) {

    var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    var number = parseFloat(totalRent).toFixed(2).split(".");
    var num = parseInt(number[0]);
    var digit = parseInt(number[1]);
    //console.log(num);
    if ((num.toString()).length > 9)  return 'overflow';
    var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    var d = ('00' + digit).substr(-2).match(/^(\d{2})$/);;
    if (!n) return; 
    var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupee ' : '';
    str += (d[1] != 0) ? ((str != '' ) ? "and " : '') + (a[Number(d[1])] || b[d[1][0]] + ' ' + a[d[1][1]]) + 'Paise ' : 'Only';
    console.log(str);
    return str;

  
}


module.exports = InvoiceManager;
