
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var clientDetail = require ('../schema/mhc-client')
var orderDetail = require('../schema/ordermanager');


// set up a mongoose model
var FeedbackManagerSchema = new Schema({
  client_details : {
    type: Schema.ObjectId,
    ref: 'Clientdetails'
  },
  order_details : {
    type: Schema.ObjectId,
    ref: 'ordermanager'
  },
  rating : {
    type: Number
  },
  quality_service : {
    type: Number,
    default : 0
  },
  punctuality : {
    type: Number,
    default : 0
  },
  grooming : {
    type: Number,
    default : 0
  },
  detail_attention : {
    type: Number,
    default : 0
  },
  product_knowledge : {
    type: Number,
    default : 0
  },
  communication_coordination : {
    type: Number,
    default : 0
  },
  additional_feedback : {
    type: String
  },
  created_on:{
    type:Date,
    default : Date.now
  }

});



module.exports = mongoose.model('feedbackmanager', FeedbackManagerSchema);
