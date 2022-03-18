
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var clientDetail = require('../schema/mhc-client');
// var bcrypt = require('bcrypt');


// set up a mongoose model
var ClientPromocodeSchema = new Schema({
  promocode: {
        type: String,
    },
  client_id : {
    type:{ type: Schema.ObjectId, ref: 'Clientdetails' }
  },
  promocode_no :{
    type:Number
  },
  created_at:{
    type:Date,
    default : Date.now
  },
  updated_at :{
    type:Date,
    default:Date.now
  }
});


// ClientDetailsSchema.methods.

module.exports = mongoose.model('ClientPromocode', ClientPromocodeSchema);
