
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientdetails = require('../schema/mhc-client');
var addressDetail = require('../schema/addressdetail');

// console.log(clientdetails);



// set up a mongoose model
var AMCServiceManagerSchema = new Schema({

  amc_id :{
    type :Schema.ObjectId,
    ref: 'Servicemanager'
  },

  amc_label :{
    type :String
  },

  service_address:{
    type: Schema.ObjectId,
    ref : 'Addressdetails'
  },
  service_id :{
    type : Number
  },
  variant_type_id :{
    type :Number
  },
  additional_variant :{
    type : String
  },
  service_date :[
    {type : Date}
  ],
  service_time :[
    {type : Date}
  ],
  duration_of_service :{
    type : Number
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
      added_on :{type: Date,default:Date.now}
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
module.exports = mongoose.model('AMCServicemanager', AMCServiceManagerSchema);
