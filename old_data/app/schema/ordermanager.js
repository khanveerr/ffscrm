
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var clientDetail = require ('../schema/mhc-client')
var addressDetail = require('../schema/addressdetail');
var serviceDetail = require('../schema/servicemanager');
var amcserviceDetail = require('../schema/amcservicemanager');
var leadManager = require ('../schema/leadmanager');
// var bcrypt = require('bcrypt');



// set up a mongoose model
var OrderManagerSchema = new Schema({
  leadmanager_details : {
    type: Schema.ObjectId,
    ref: 'leadmanager'
  },
  client_details : {
    type: Schema.ObjectId,
    ref: 'Clientdetails'
  },

  service_details :{
    type: Schema.ObjectId,
    ref : 'ServiceManager'
  },
  amc_service_details :{
    type: Schema.ObjectId,
    ref : 'AMCServicemanager'
  },
  address_details :{
    type: Schema.ObjectId,
    ref : 'Addressdetails'
  },
  leadmanager_obj: {
    leadsource :{
      type : String
    },
    leadowner :{
      type : String
    },
    billing_name :{
      type : String
    },
    billing_address :{
      type : String
    }
  },
  firstname: {
    type: String
  },
  primary_contact_no: {
    type: String
  },
  primary_email_id: {
    type: String
  },
  address: {
    type: String
  },
  city: {
    type: Number
  },
  client_type: {
    type : Number
  },
  service_obj: {
    service_id :{
      type : Number
    },
    service_date :[
      {type : Date}
    ],
    taxed_cost :{
      type: Number,
      default : 0
    },
    variant_type_id :{
      type :Number
    }
  },
  order_no : {
    type: Number,
  },
  is_amc :{
    type : Number
  },
  service_date :[
    {type : Date}
  ],
  service_time :[
    {type : Date}
  ],
  is_complaint : {
    type: Number,
    default : 0
  },
  complaint_remark:{
    type :[{
      remark :{type : String},
      added_by :{type : String},
      added_on :{type: Date,default:Date.now},
      is_done: {type: Number, default : 0 }
    }]
  },
  job_start_timestamp :{
    type : Date
  },
  job_end_timestamp :{
    type : Date
  },
  vendor_allocated : {
    type: Number,
    // ref: 'ServiceManager'
  },
  other_vendor_allocated : {
    type: String
  },
  payment_mode : {
    type : String,
  },
  payment_remark :{
    type : String
  },
  payment_status :{
    type : String
  },
  received_amount :{
    type: Number
  },
  acount_payment_status :{
    type : String
  },
  supervisor_name :[{
    type :String
  }],
  team_leader_name :[{
    type : String
  }],
  janitor_name :[{
    type : String
  }],

  travel_cost:{
    type:Number
  },
  material_cost:{
    type:Number
  },
  created_on:{
    type:Date,
    default : Date.now
  },
  last_updated_on :{
    type:Date,
    default:Date.now
  },
  created_by:{
    type: String
  },
  last_updated_by :{
    type :String
  },
  status :{
    type :Number,
    default: 0
  }


});



module.exports = mongoose.model('ordermanager', OrderManagerSchema);
