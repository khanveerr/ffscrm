var mongoose   = require('mongoose');
var config = require('./config/database');

// Constructor
function Database() {
  this.dbHost = 'mongodb://localhost:27017/silacrm';
  // mongoose.connect(this.dbHost);
  this.dbName = "silacrm";
  if(config.connections[this.dbName]) {
        //database connection already exist. Return connection object

    } else {
        config.connections[this.dbName] = mongoose.createConnection('mongodb://localhost:27017/' + this.dbName);
        mongoose.connect(this.dbHost);
    }

}
// class methods
Database.prototype.getDatafromCollection = function(collectionObj,keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback) {
  var query = '';
  var queryResult = {};
  var colselect = null;

  // console.log(collectionObj);

  if (keyValueArray!=null) {
    //console.log(keyValueArray);
    if (selectColObj!='') {
      colselect = selectColObj;
    }

    console.log(keyValueArray);

    query = collectionObj.find(keyValueArray,colselect,{
     skip:offset, // Starting Row
     limit:limit, // Ending Row
     sort:orderBy
     });

      //console.log(query);

   }


   // if (selectColObj!='') {
   //   query.select(selectColObj).exec(function (err, result) {
   //     if ( err ){
   //       throw err;
   //      }

   //     else {
   //       queryResult = result;
   //        // console.log(queryResult);
   //      //  return JSON.stringify(queryResult);
   //     }

   //     callback && callback(queryResult);

   //    });
   // }
   // else {
     query.exec(function (err, result) {
       if ( err ){
         throw err;
        }

       else {
          //console.log(result);
         queryResult = result;
          // console.log(queryResult);
        //  return JSON.stringify(queryResult);
       }

       callback && callback(queryResult);

      });
   // }




};

Database.prototype.getPopulatedDatafromCollection = function(collectionObj,populateCollectionObj,keyValueArray,selectColObj='',orderBy='',limit=0,offset=0,callback){
  var query = '';
  var queryResult = {};
  var colselect = null;
  if (keyValueArray!=null) {
    if (selectColObj!='') {
      colselect = selectColObj;
    }
    query = collectionObj.find(keyValueArray,colselect,{
     skip:offset, // Starting Row
     limit:limit, // Ending Row
     sort:orderBy
     });

   }

  console.log(populateCollectionObj);
   query.populate(populateCollectionObj).exec(function (err, result) {
     if ( err ){
       throw err;
      }

     else {
       queryResult = result;
        // console.log(queryResult);
      //  return JSON.stringify(queryResult);
     }

     callback && callback(queryResult);

    });


}

Database.prototype.updateDocument = function (collectionObj,whereArr,updateVal,options,callback) {

  var query = '';
  // var collection = mongoose.model(collectionName, schemaName,this.dbName);
  var queryResult = {};
  console.log(whereArr);
  console.log(options);
  collectionObj.update(whereArr, updateVal, options, function(err, result){
      if ( err ){
         throw err;
       }
      else {
        queryResult = result;
      }

      callback && callback(queryResult);
      // return result;
    });
};


Database.prototype.deleteDocument = function (collectionObj,deleteArr,callback) {
  // var collection = mongoose.model(collectionName, schemaName,this.dbName);
  // console.log("in delete doc");
  // console.log(deleteArr);

  collectionObj.remove(deleteArr,function(err,result) {
    if ( err ){
       throw err;
     }
    else {
      queryResult = result;
    }

    callback && callback(queryResult);
});
}

Database.prototype.insertDocument = function (insertObj,callback) {
  var queryResult = {};

      insertObj.save(function(err,result){
        if ( err ){
           throw err;
         }
         else {
           queryResult = result;
         }

          callback && callback(queryResult);
    })


  // collection.save(insertObj).exec();
}
Database.prototype.insertAssociateDocument = function (insertObj,childObj,callback) {
  var queryResult = {};
  childObj.save(function(err,data){
    if ( err ){
       throw err;
     }
    else {
      insertObj.address_details = [childObj._id];
      insertObj.save(function(err,result){
        if ( err ){
           throw err;
         }
         else {
           queryResult = result;
         }

          callback && callback(queryResult);
    })

  }


    });

  // collection.save(insertObj).exec();
};

Database.prototype.groupByDate = function (collectionObj,keyValueArray,orderBy,whereArr,callback) {

  var match_field = '$'+keyValueArray['match_field'];
  var queryResult = [];

  // console.log("In DB Wrapper");
  // console.log(keyValueArray);
  // console.log(orderBy);
  // console.log(whereServiceArr);


   var condition_arr = [];
   var condition = { 'created_on': { '$gte': new Date(whereArr['start_date']), '$lte': new Date(whereArr['end_date']) } }
   condition_arr.push(condition);

    if(whereArr['invoice_sent'] != undefined && whereArr['invoice_sent'] != null && whereArr['invoice_sent'] != "" && whereArr['invoice_sent']==1) {
      condition_arr.push({'invoice_sent': parseInt(whereArr['invoice_sent'])});  
    }

    if(whereArr['city'] != undefined && whereArr['city'] != null && whereArr['city'] != "") {
      condition_arr.push({'city': parseInt(whereArr['city'])});  
    }

    if(whereArr['leadsource'] != undefined && whereArr['leadsource'] != null && whereArr['leadsource'] != "") {
      condition_arr.push({'leadsource': whereArr['leadsource']});
    }

    if(whereArr['service_id'] != undefined && whereArr['service_id'] != null && whereArr['service_id'] != "") {
      condition_arr.push({'service_id': parseInt(whereArr['service_id'])});
    }

    if(whereArr['is_order'] != undefined && whereArr['is_order'] != null && whereArr['is_order'] != "") {
      condition_arr.push({'is_order': parseInt(whereArr['is_order'])});
    }

    if(whereArr['client_type'] != undefined && whereArr['client_type'] != null && whereArr['client_type'] != "") {
      condition_arr.push({'client_type': parseInt(whereArr['client_type'])});
    }

    condition_arr.push({'leadsource': {'$ne': null}});
    condition_arr.push({'leadsource': {'$ne': ""}});
    console.log(whereArr);

  collectionObj.aggregate([
    { $match: { $and: condition_arr} },
    { $sort : orderBy },
    {
        $project: {
            dt: { $dateToString: { format: "%Y-%m-%d", date: match_field } },
            posttotal: { $ifNull: ["$taxed_cost", 0] },
            pretotal: { $ifNull: ["$pre_taxed_cost", 0] }
        }
    },
    {
        $group: {
            _id: '$dt', // grouping key - group by field date
            posttotal: { $sum: "$posttotal" },
            pretotal: { $sum: "$pretotal" },
            fieldCount: { $sum: 1 }
        }
    }
  ], function(err,result){
        if ( err ){
           throw err;
         }
         else {
           queryResult = result;
         }

         console.log(result);

          callback && callback(queryResult);
    });

};


Database.prototype.groupByDateOrganic = function (collectionObj,keyValueArray,orderBy,whereArr,callback) {

  var match_field = '$'+keyValueArray['match_field'];
  var queryResult = [];

  // console.log("In DB Wrapper");
  // console.log(keyValueArray);
  // console.log(orderBy);
  // console.log(whereServiceArr);


   var condition_arr = [];
   var condition = { 'created_on': { '$gte': new Date(whereArr['start_date']), '$lte': new Date(whereArr['end_date']) } }
   condition_arr.push(condition);

    if(whereArr['invoice_sent'] != undefined && whereArr['invoice_sent'] != null && whereArr['invoice_sent'] != "" && whereArr['invoice_sent']==1) {
      condition_arr.push({'invoice_sent': parseInt(whereArr['invoice_sent'])});  
    }

    if(whereArr['city'] != undefined && whereArr['city'] != null && whereArr['city'] != "") {
      condition_arr.push({'city': parseInt(whereArr['city'])});  
    }

    if(whereArr['leadsource'] != undefined && whereArr['leadsource'] != null && whereArr['leadsource'] != "") {
      condition_arr.push({'leadsource': whereArr['leadsource']});
    }

    if(whereArr['service_id'] != undefined && whereArr['service_id'] != null && whereArr['service_id'] != "") {
      condition_arr.push({'service_id': parseInt(whereArr['service_id'])});
    }

    if(whereArr['client_type'] != undefined && whereArr['client_type'] != null && whereArr['client_type'] != "") {
      condition_arr.push({'client_type': parseInt(whereArr['client_type'])});
    }

    condition_arr.push({ $and: [{ 'leadsource': { '$ne': "70" } }, { 'leadsource': { '$ne': "84" } }] });

    //console.log(condition_arr);

  collectionObj.aggregate([
    { $match: { $and: condition_arr} },
    { $sort : orderBy },
    {
        $project: {
            dt: { $dateToString: { format: "%Y-%m-%d", date: match_field } },
            posttotal: { $ifNull: ["$taxed_cost", 0] },
            pretotal: { $ifNull: ["$pre_taxed_cost", 0] }
        }
    },
    {
        $group: {
            _id: '$dt', // grouping key - group by field date
            posttotal: { $sum: "$posttotal" },
            pretotal: { $sum: "$pretotal" },
            fieldCount: { $sum: 1 }
        }
    }
  ], function(err,result){
        if ( err ){
           throw err;
         }
         else {
           queryResult = result;
         }

         console.log(result);

          callback && callback(queryResult);
    });

};

Database.prototype.groupByDatePartner = function (collectionObj,keyValueArray,orderBy,whereArr,callback) {

  var match_field = '$'+keyValueArray['match_field'];
  var queryResult = [];

  // console.log("In DB Wrapper");
  // console.log(keyValueArray);
  // console.log(orderBy);
  // console.log(whereServiceArr);


   var condition_arr = [];
   var condition = { 'created_on': { '$gte': new Date(whereArr['start_date']), '$lte': new Date(whereArr['end_date']) } }
   condition_arr.push(condition);

    if(whereArr['invoice_sent'] != undefined && whereArr['invoice_sent'] != null && whereArr['invoice_sent'] != "" && whereArr['invoice_sent']==1) {
      condition_arr.push({'invoice_sent': parseInt(whereArr['invoice_sent'])});  
    }

    if(whereArr['city'] != undefined && whereArr['city'] != null && whereArr['city'] != "") {
      condition_arr.push({'city': parseInt(whereArr['city'])});  
    }

    if(whereArr['leadsource'] != undefined && whereArr['leadsource'] != null && whereArr['leadsource'] != "") {
      condition_arr.push({'leadsource': whereArr['leadsource']});
    }

    if(whereArr['service_id'] != undefined && whereArr['service_id'] != null && whereArr['service_id'] != "") {
      condition_arr.push({'service_id': parseInt(whereArr['service_id'])});
    }

    condition_arr.push({ $or: [{ 'leadsource': { '$eq': "70" } }, { 'leadsource': { '$eq': "84" } }] });

    console.log(whereArr);

  collectionObj.aggregate([
    { $match: { $and: condition_arr} },
    { $sort : orderBy },
    {
        $project: {
            dt: { $dateToString: { format: "%Y-%m-%d", date: match_field } },
            posttotal: { $ifNull: ["$taxed_cost", 0] },
            pretotal: { $ifNull: ["$pre_taxed_cost", 0] }
        }
    },
    {
        $group: {
            _id: '$dt', // grouping key - group by field date
            posttotal: { $sum: "$posttotal" },
            pretotal: { $sum: "$pretotal" },
            fieldCount: { $sum: 1 }
        }
    }
  ], function(err,result){
        if ( err ){
           throw err;
         }
         else {
           queryResult = result;
         }

         console.log(result);

          callback && callback(queryResult);
    });

};


Database.prototype.groupByLeadSource = function (collectionObj,keyValueArray,orderBy,whereArr,callback) {

  var match_field = '$'+keyValueArray['match_field'];
  var queryResult = [];

  console.log(match_field);

  // console.log("In DB Wrapper");
  // console.log(keyValueArray);
  // console.log(orderBy);
  // console.log(whereServiceArr);

   var condition_arr = [];
   var condition = { 'created_on': { '$gte': new Date(whereArr['start_date']), '$lte': new Date(whereArr['end_date']) } }
   condition_arr.push(condition);

    if(whereArr['invoice_sent'] != undefined && whereArr['invoice_sent'] != null && whereArr['invoice_sent'] != "" && whereArr['invoice_sent']==1) {
      condition_arr.push({'invoice_sent': parseInt(whereArr['invoice_sent'])});  
    }


    if(whereArr['city'] != undefined && whereArr['city'] != null && whereArr['city'] != "") {
      condition_arr.push({'city': parseInt(whereArr['city'])});  
    }

    if(whereArr['leadsource'] != undefined && whereArr['leadsource'] != null && whereArr['leadsource'] != "") {
      condition_arr.push({'leadsource': whereArr['leadsource']});
    }

    if(whereArr['service_id'] != undefined && whereArr['service_id'] != null && whereArr['service_id'] != "") {
      condition_arr.push({'service_id': parseInt(whereArr['service_id'])});
    }

    if(whereArr['client_type'] != undefined && whereArr['client_type'] != null && whereArr['client_type'] != "") {
      condition_arr.push({'client_type': parseInt(whereArr['client_type'])});
    }

    condition_arr.push({'leadsource': {'$ne': null}});
    condition_arr.push({'leadsource': {'$ne': ""}});
    condition_arr.push({'is_order': 1});

   //console.log(con);
  collectionObj.aggregate([
    { $match: { $and: condition_arr} },
    { $sort : orderBy },
    {
        $project: {
            ls: match_field ,
            posttotal: { $ifNull: ["$taxed_cost", 0] },
            pretotal: { $ifNull: ["$pre_taxed_cost", 0] },
            service_id: 1
        }
    },
    {
        $group: {
            _id: '$ls', // grouping key - group by field date
            posttotal: { $sum: "$posttotal" },
            pretotal: { $sum: "$pretotal" },
            fieldCount: { $sum: 1 }
        }
    }
  ], function(err,result){
        if ( err ){
           throw err;
         }
         else {
           queryResult = result;
         }

         console.log(result);

          callback && callback(queryResult);
    });

};


Database.prototype.groupByCategory = function (collectionObj,keyValueArray,orderBy,whereArr,callback) {

  var match_field = '$'+keyValueArray['match_field'];
  var queryResult = [];

  console.log(match_field);

  // console.log("In DB Wrapper");
  // console.log(keyValueArray);
  // console.log(orderBy);
  // console.log(whereServiceArr);

   var condition_arr = [];
   var condition = { 'created_on': { '$gte': new Date(whereArr['start_date']), '$lte': new Date(whereArr['end_date']) } }
   condition_arr.push(condition);

    if(whereArr['invoice_sent'] != undefined && whereArr['invoice_sent'] != null && whereArr['invoice_sent'] != "" && whereArr['invoice_sent']==1) {
      condition_arr.push({'invoice_sent': parseInt(whereArr['invoice_sent'])});  
    }


    if(whereArr['city'] != undefined && whereArr['city'] != null && whereArr['city'] != "") {
      condition_arr.push({'city': parseInt(whereArr['city'])});  
    }

    if(whereArr['leadsource'] != undefined && whereArr['leadsource'] != null && whereArr['leadsource'] != "") {
      condition_arr.push({'leadsource': whereArr['leadsource']});
    }

    if(whereArr['client_type'] != undefined && whereArr['client_type'] != null && whereArr['client_type'] != "") {
      condition_arr.push({'client_type': whereArr['client_type']});
    }

    // if(whereArr['service_id'] != undefined && whereArr['service_id'] != null && whereArr['service_id'] != "") {
    //   condition_arr.push({'service_id': parseInt(whereArr['service_id'])});
    // }

    // condition_arr.push({'leadsource': {'$ne': null}});
    // condition_arr.push({'leadsource': {'$ne': ""}});
    condition_arr.push({'is_order': 1});

   //console.log(con);
  collectionObj.aggregate([
    { $match: { $and: condition_arr} },
    { $sort : orderBy },
    {
        $project: {
            posttotal: { $ifNull: ["$taxed_cost", 0] },
            pretotal: { $ifNull: ["$pre_taxed_cost", 0] },
            service_id: 1,
            service_category_id: 1
        }
    },
    { 
      $group: 
      {
        "_id": {
            "service_category_id": "$service_category_id",
            "service_id": "$service_id",
            "posttotal": { "$sum": "$posttotal"},
            "pretotal": { "$sum": "$pretotal"}
          },
        "serviceCount": { "$sum": 1 },
      }
    },
    {
        $group: {
            "_id": '$_id.service_category_id', // grouping key - group by field date
            "services": {
              "$push": {
                "service_id": '$_id.service_id',
                "count": "$serviceCount",
                "posttotal": "$_id.posttotal",
                "pretotal": "$_id.pretotal"
              }
            },
            "count": { "$sum": "$serviceCount" },
            "posttotal": { "$sum": "$_id.posttotal" },
            "pretotal": { "$sum": "$_id.pretotal" }
        }
    }
  ], function(err,result){
        if ( err ){
           throw err;
         }
         else {
           queryResult = result;
         }

         console.log(result);

          callback && callback(queryResult);
    });

};


Database.prototype.groupByCancellation = function (collectionObj,keyValueArray,orderBy,whereArr,callback) {

  var match_field = '$'+keyValueArray['match_field'];
  var queryResult = [];

  console.log(match_field);

  // console.log("In DB Wrapper");
  // console.log(keyValueArray);
  // console.log(orderBy);
  // console.log(whereServiceArr);

   var condition_arr = [];
   var condition = { 'created_on': { '$gte': new Date(whereArr['start_date']), '$lte': new Date(whereArr['end_date']) } }
   condition_arr.push(condition);

    if(whereArr['invoice_sent'] != undefined && whereArr['invoice_sent'] != null && whereArr['invoice_sent'] != "" && whereArr['invoice_sent']==1) {
      condition_arr.push({'invoice_sent': parseInt(whereArr['invoice_sent'])});  
    }


    if(whereArr['city'] != undefined && whereArr['city'] != null && whereArr['city'] != "") {
      condition_arr.push({'city': parseInt(whereArr['city'])});  
    }

    if(whereArr['leadsource'] != undefined && whereArr['leadsource'] != null && whereArr['leadsource'] != "") {
      condition_arr.push({'leadsource': whereArr['leadsource']});
    }

    if(whereArr['service_id'] != undefined && whereArr['service_id'] != null && whereArr['service_id'] != "") {
      condition_arr.push({'service_id': parseInt(whereArr['service_id'])});
    }

    condition_arr.push({'cancellation_reason': {'$ne': null}});
    condition_arr.push({'cancellation_reason': {'$ne': ""}});
    //condition_arr.push({'is_order': 1});

   //console.log(con);

  collectionObj.aggregate([
    { $match: { $and: condition_arr} },
    { $sort : orderBy },
    {
        $project: {
            ls: match_field ,
            posttotal: { $ifNull: ["$taxed_cost", 0] },
            pretotal: { $ifNull: ["$pre_taxed_cost", 0] },
            service_id: 1
        }
    },
    {
        $group: {
            _id: '$ls', // grouping key - group by field date
            posttotal: { $sum: "$posttotal" },
            pretotal: { $sum: "$pretotal" },
            fieldCount: { $sum: 1 }
        }
    }
  ], function(err,result){
        if ( err ){
           throw err;
         }
         else {
           queryResult = result;
         }

         console.log(result);

          callback && callback(queryResult);
    });

};


Database.prototype.groupByLeadStage = function (collectionObj,keyValueArray,orderBy,whereArr,callback) {

  var match_field = '$'+keyValueArray['match_field'];
  var queryResult = [];

  //console.log(match_field);

  // console.log("In DB Wrapper");
  // console.log(keyValueArray);
  // console.log(orderBy);
  // console.log(whereServiceArr);


   var condition_arr = [];
   var condition = { 'created_on': { '$gte': new Date(whereArr['start_date']), '$lte': new Date(whereArr['end_date']) } }
   condition_arr.push(condition);

    if(whereArr['invoice_sent'] != undefined && whereArr['invoice_sent'] != null && whereArr['invoice_sent'] != "" && whereArr['invoice_sent']==1) {
      condition_arr.push({'invoice_sent': parseInt(whereArr['invoice_sent'])});  
    }

    if(whereArr['city'] != undefined && whereArr['city'] != null && whereArr['city'] != "") {
      condition_arr.push({'city': parseInt(whereArr['city'])});  
    }

    if(whereArr['leadsource'] != undefined && whereArr['leadsource'] != null && whereArr['leadsource'] != "") {
      condition_arr.push({'leadsource': whereArr['leadsource']});
    }

    if(whereArr['service_id'] != undefined && whereArr['service_id'] != null && whereArr['service_id'] != "") {
      condition_arr.push({'service_id': parseInt(whereArr['service_id'])});
    }

    if(whereArr['client_type'] != undefined && whereArr['client_type'] != null && whereArr['client_type'] != "") {
      condition_arr.push({'client_type': parseInt(whereArr['client_type'])});
    }


    // condition_arr.push({'leadsource': {'$ne': null}});
    // condition_arr.push({'leadsource': {'$ne': ""}});
    //condition_arr.push({'is_order': 1});

  collectionObj.aggregate([
    { $match: { $and: condition_arr} },
    { $sort : orderBy },
    { $unwind: "$lead_history"},
    {
        $project: {
            ls: "$lead_history.lead_stage" ,
            posttotal: { $ifNull: ["$taxed_cost", 0] },
            pretotal: { $ifNull: ["$pre_taxed_cost", 0] }
        }
    },
    {
        $group: {
            _id: '$ls', // grouping key - group by field date
            posttotal: { $sum: "$posttotal" },
            pretotal: { $sum: "$pretotal" },
            fieldCount: { $sum: 1 }
        }
    }
  ], function(err,result){
        if ( err ){
           throw err;
         }
         else {
           queryResult = result;
         }

         console.log(result);

          callback && callback(queryResult);
    });

};


// export the class
module.exports = Database;
