
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var addressDetail = require('../schema/addressdetail');
// var bcrypt = require('bcrypt');


// set up a mongoose model
var ClientDetailsSchema = new Schema({
  firstname: {
        type: String,
    },
  lastname: {
        type: String
    },
  primary_contact_no :{
      type:String
  },
  alternate_contact_no :{
    type:Array
  },
  primary_email_id :{
    type :String,
  },
  alternate_email_id : {
    type : Array
  },
  address_details : {
    type:[{ type: Schema.ObjectId, ref: 'Addressdetails' }]
  },
  rating :{
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
  },
  total_amount :{
    type :Number,
    default: 0
  },
  used_amount :{
    type :Number,
    default: 0
  }
});


// ClientDetailsSchema.methods.

module.exports = mongoose.model('Clientdetails', ClientDetailsSchema);
