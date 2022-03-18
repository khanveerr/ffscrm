
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var clientDetail = require('../schema/mhc-client');
// var bcrypt = require('bcrypt');


// set up a mongoose model
var PromocodeUsageSchema = new Schema({
  promocode: {
        type: String,
    },
  client_id : {
    type:{ type: Schema.ObjectId, ref: 'Clientdetails' }
  },
  referred_id : {
    type:{ type: Schema.ObjectId, ref: 'Clientdetails' }
  },
  amount :{
    type:Number
  },
  created_on:{
    type:Date,
    default : Date.now
  },
  updated_on :{
    type:Date,
    default:Date.now
  },
  created_by:{
    type: String
  },
  updated_by :{
    type :String
  },
  status :{
    type :Number,
    default: 0
  }
});


// ClientDetailsSchema.methods.

module.exports = mongoose.model('PromocodeUsage', PromocodeUsageSchema);
