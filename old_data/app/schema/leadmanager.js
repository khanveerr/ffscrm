
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var clientDetail = require ('../schema/mhc-client')
var addressDetail = require('../schema/addressdetail');
var serviceDetail = require('../schema/servicemanager');
var amcserviceDetail = require('../schema/amcservicemanager');
// var bcrypt = require('bcrypt');



// set up a mongoose model
var LeadManagerSchema = new Schema({
  
  firstname :{
    type: String
  },  

  primary_contact_no :{
    type: String
  },  

  primary_email_id :{
    type: String
  },

  address :{
    type: String
  },

  client_details : {
    type: Schema.ObjectId,
    ref: 'Clientdetails'
  },

  followup_by :{
    type: String
  },

  leadsource :{
    type : String
  },
  leadowner :{
    type : String
  },
  customer_label :{
    type : String
  },
  customer_id :{
    type : String
  },
  city: {
    type : Number
  },
  client_type: {
    type : Number
  },
  service_obj : [{
    type: Schema.ObjectId,
    ref: 'ServiceManager'
  }],

  service_obj_arr: {
    type: [{
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
      }
    }]
  },

  has_amc : {
    type : Boolean,
    default : false
  },
  billing_name :{
    type : String
  },
  billing_email_id :{
    type : String
  },
  billing_address :{
    type : String
  },
  invoice_mode :{
    type :String
  },
  invoice_type :{
    type : String
  },
  reminder :{
    type:Date
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
  is_complaint :{
    type :Number,
    default: 0
  },
  status :{
    type :Number,
    default: 0
  }


});



module.exports = mongoose.model('leadmanager', LeadManagerSchema);
