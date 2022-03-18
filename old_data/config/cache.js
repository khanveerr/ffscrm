var mysql = require("mysql");

// 
// var con = mysql.createConnection({
//   host: "localhost",
//   port : 1369,
//   user: "mhcdbuser",
//   password: "mhc123",
//   database : 'mhc'
// });

var Memcached = require('memcached');

var client = {};
client = new Memcached();


module.exports  =  client;


