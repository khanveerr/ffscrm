
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientdetails = require('../schema/mhc-client');
var addressDetail = require('../schema/addressdetail');
var amcserviceDetail = require('../schema/amcservicemanager');
var orderDetail = require('../schema/ordermanager');
var inspectionmanager   = require('../../app/schema/inspectionmanager');

// console.log(clientdetails);



// set up a mongoose model
var ServiceManagerSchema = new Schema({
  lead_history :{
    type:[{
      lead_stage:{
        type : Number
      },
      lead_remark : {
        type : String
      },
      updated_on :{
        type : Date,
        default : Date.now
      },
      updated_by :{
        type : String
      }
    }]
  },

  leadsource :{
    type : String
  },

  city: {
    type : Number
  },

  service_address:{
    type: Schema.ObjectId,
    ref : 'Addressdetails'
  },
  service_id :{
    type : Number
  },
  client_type :{
    type : Number
  },
  service_category_id :{
    type : Number
  },
  variant_type_id :{
    type :Number
  },
  variant_type_name :{
    type :String
  },
  additional_variant :{
    type : String
  },
  partner_id :{
    type : String
  },
  service_date :[
    {type : Date}
  ],
  service_time :[
    {type : Date}
  ],
  team_leader :[{
    type : Number
  }],
  supervisor :[{
    type : Number
  }],
  janitor :[{
      type : Number
  }],
  is_amc :{
    type : Number
  },
  contract_start_date :{
    type : Date
  },
  contract_end_date :{
    type : Date
  },
  // efc31f
  amcservices:{
    type:[{
      type :Schema.ObjectId,
      ref: 'AMCServicemanager'
    }]
  },
  complaint_orders:{
    type:[{
      type :Schema.ObjectId,
      ref: 'ordermanager'
    }]
  },
  inspection_reports:{
    type:[{
      type :Schema.ObjectId,
      ref: 'inspectionmanager'
    }]
  },
  frequency :{
    type : Number
  },
  no_of_service:{
    type : Number
  },
  duration_of_service :{
    type : Number,
    default : 1
  },
  no_of_team_leader :{
    type : Number
  },
  no_of_supervisor :{
    type : Number
  },
  no_of_janitor :{
      type : Number
  },
  crm_remark :{
    type :[{
      remark :{type : String},
      added_by :{type : String},
      added_on :{type: Date,default:Date.now},
      show: {type: Number, default : 1}
    }]
  },

  ops_remark:{
    type :[{
      remark :{type : String},
      added_by :{type : String},
      added_on :{type: Date,default:Date.now}
    }]
  },

  accounts_remark :{
    type :[{
      payment_mode: {type : String},
      remark :{type : String},
      added_by :{type : String},
      added_on :{type: Date,default:Date.now}
    }]
  },
  pre_taxed_cost :{
    type: Number,
    default : 0
  },
  taxed_cost :{
    type: Number,
    default : 0
  },
  client_payment_expected :{
    type: Number,
    default : 0
  },
  partner_payment_payable :{
    type: Number,
    default : 0
  },
  partner_payment_recievable :{
    type: Number,
    default : 0
  },
  promocode :{
    type: Schema.Types.ObjectId
  },
  promo_code: {
    type :String
  },
  discount : {
    type : Number
  },

  invoice_id :{
    type :String
  },

  invoice_no :{
    type :Number
  },
  invoice_sent :{
    type : Number
  },
  payment_link_sent :{
    type : Number
  },
  service_rating :{
    type : Number
  },
  crm_rating :{
    type :Number
  },
  service_status :{
    type : Number
  },
  is_order :{
    type : Number
  },
  service_tax :{
    type : Number
  },
  kk_tax :{
    type : Number
  },
  cess_tax :{
    type : Number
  },
  cgst_tax :{
    type : Number
  },
  sgst_tax :{
    type : Number
  },
  gst_tax :{
    type : Number
  },
  invoice_date: {
    type : Date
  },
  cancellation_reason: {
    type : Number
  },
  other_cancellation_reason: {
    type : String
  },
  created_on :{
    type : Date,
    default : Date.now
  },
  updated_on :{
    type : Date,
    default : Date.now
  },
  created_by :{
    type : String
  },
  updated_by :{
    type : String
  },
  status :{
    type :Number
  }

});
module.exports = mongoose.model('ServiceManager', ServiceManagerSchema);
