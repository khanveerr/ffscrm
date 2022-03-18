
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');


// set up a mongoose model
var AddressDetailsSchema = new Schema({

      address:{
        type : String
      },
      landmark : {
        type : String
      },
      location : {
        type : String
      },
      city : {
        type : Number
      },
      latitude :{
        type : String
      },
      longitude :{
        type : String
      },
      pincode :{
        type : String
      },
      is_primary :{
        type : Boolean
      },
      created_on :{
        type : Date,
        default : Date.now
      },
      updated_on : {
        type :Date,
        default :Date.now
      },
      status :{
        type : Number,
        default : 0
      }
});


// ClientDetailsSchema.methods.

module.exports = mongoose.model('Addressdetails', AddressDetailsSchema);
