var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
var ManpowerManagerSchema = new Schema({
  service_date:{
    type:Date
  },
  manpower_details :{
    type:[{
      city_id:{
        type : Number
      },
      no_of_manpower : {
        type : Number,
        default: 0
      }
    }]
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



module.exports = mongoose.model('manpowermanager', ManpowerManagerSchema);
