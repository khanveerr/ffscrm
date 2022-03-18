var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var clientdetails = require('../schema/mhc-client');
var addressDetail = require('../schema/addressdetail');

// set up a mongoose model
var InspectionManagerSchema = new Schema({
  client_details : {
    type: Schema.ObjectId,
    ref: 'Clientdetails'
  },
  address_details :{
    type: Schema.ObjectId,
    ref : 'Addressdetails'
  },
  inspector_name :{
    type : String
  },
  inspector_contact :{
    type : String
  },
  variant_type :{
    type : String
  },
  additional_variant :{
    type : String
  },
  site_type :{
    type : String
  },
  site_condition :{
    type : String
  },
  additional_options :[
    {type : String}
  ],
  deployment_particulars :{
    type:[{
      service:{
        type : String
      },
      manpower_deployment : {
        type : String
      },
      comments : {
        type : String
      }
    }]
  },
  customer_notes :{
    type : String
  },
  reason_additional_manpower :{
    type : String
  },
  created_on:{
    type:Date,
    default : Date.now
  },
  updated_on:{
    type:Date,
    default : Date.now
  },
  status :{
    type :Number,
    default: 0
  }


});



module.exports = mongoose.model('inspectionmanager', InspectionManagerSchema);
