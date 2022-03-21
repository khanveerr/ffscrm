
var express     = require('express');
var app         = express();
var path = require('path');
var moment = require('moment');
var mysql = require("mysql");
var memcache = require('memcached');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose   = require('mongoose');
var passport	= require('passport');
var excel = require('node-excel-export');
var NodePDF = require('nodepdf');
var fs = require('fs');
var http = require('http');
var https = require('https');
var crypto = require('crypto')

var ssl_options = {
  key: fs.readFileSync('certs/silagroup.co.in.key'),
  cert: fs.readFileSync('certs/STAR_silagroup_co_in.crt'),
  ca: fs.readFileSync('certs/bundle.crt')
};

var routes = require('./app/controllers/mhcclient/mhcclientController');
var serviceroutes = require('./app/controllers/servicemanager/servicemanagerController');
var amcroutes = require('./app/controllers/amcservicemanager/amcservicemanagerController');
var leadroutes = require('./app/controllers/leadmanager/leadmanagerController');
var orderroutes = require('./app/controllers/ordermanager/ordermanagerController');
var cacheroutes = require('./app/controllers/cachemanager/cacheController');
var inspectionroutes = require('./app/controllers/inspectionmanager/inspectionmanagerController');
var feedbackroutes = require('./app/controllers/feedbackmanager/feedbackmanagerController');
var manpowerroutes = require('./app/controllers/manpowermanager/manpowermanagerController');
var authroutes = require('./app/controllers/authenticationmanager/authenticationmanagerController');

var servicemanager = require('./app/schema/servicemanager');
var mhcclientdetails = require('./app/schema/mhc-client');
var addressmanager   = require('./app/schema/addressdetail');

var User = require('./app/schema/logins');

var config      = require('./config/database'); // get db config file
var cache      = require('./config/cache');
var PHPUnserialize = require('php-unserialize');
var port        = process.env.PORT || 8081;
var dbwrapper = require('./dbWrapper');
var exportdata      = require('./config/export_sql_data');

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'silacrmmeanapp',
  userProperty: 'payload'
});



var allowCrossDomain = function(req, res, next) {
   res.header('Access-Control-Allow-Origin', "*");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header('Access-Control-Allow-Headers', 'Content-Type');
   next();
}
app.use(allowCrossDomain);

app.use(function(req, res, next) {
 req.headers['if-none-match'] = 'no-match-for-this';
 // console.log(req.session.get('userSession'));
 // console.log(req.session.get('userSessionId'));
 // console.log(userSessionId);
 // console.log(req.session.has('php_user_session'));
 next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(forceSSL);
app.use(allowCrossDomain);

require('./authentication/passport');
app.use(passport.initialize());


// log to console
app.use(morgan('dev'));

// Use the passport package in our application

// demo Route (GET http://localhost:8080)
// console.log(routes);
app.use('/client', routes);
app.use('/service', serviceroutes);
app.use('/amc',amcroutes);
app.use('/lead',leadroutes);
app.use('/order',orderroutes);
app.use('/cache',cacheroutes);
app.use('/inspection',inspectionroutes);
app.use('/manpower', manpowerroutes)
app.use('/client',feedbackroutes);
app.use('/auth',authroutes);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});

console.log(__dirname);



app.use('/invoices',express.static(path.join(__dirname, 'app/frontend/invoices')));
app.use('/img',express.static(path.join(__dirname, 'app/frontend/images')));
app.use('/js',express.static(path.join(__dirname, 'app/frontend/js')));
app.use('/css',express.static(path.join(__dirname, 'app/frontend/css')));
app.use('/crm_app',express.static(path.join(__dirname, 'app/frontend/app')));
app.use('/template',express.static(path.join(__dirname, 'app/frontend/template')));

// app.use(function(req, res, next) {
//     if (req.secure) {
//         next();
//     } else {
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });


// app.get('/config', function(req, res) {
//     res.sendFile(path.join(__dirname,'app/frontend/config.json')); // load our config file file
// });

// app.get('/token', function (req, res) {
// 	// if(userObject != undefined && userObject != null)
//  //    res.send(req.session.get('userSession'));
// });


app.get('/feedback/:userId/:orderId', function(req, res) {
    res.sendFile(path.join(__dirname,'app/frontend/feedback.html')); // load our public/index.html file
});

app.get('/mis', function(req, res) {
    res.sendFile(path.join(__dirname,'app/frontend/mis.html')); // load our public/index.html file
});



app.get('/mis/:userId/:orderId', function(req, res) {
    res.sendFile(path.join(__dirname,'app/frontend/mis.html')); // load our public/index.html file
});

app.get('/mis/:userId1/:userId2/:userId3', function(req, res) {
    res.sendFile(path.join(__dirname,'app/frontend/mis.html')); // load our public/index.html file
});



app.post('/website/lead', function(req, res) {
	var data = req.body;

	console.log(data['args_mhc']);

});


app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname,'app/frontend/login.html')); // load our public/index.html file
});

app.get('/password/:reset', function(req, res) {
    res.sendFile(path.join(__dirname,'app/frontend/login.html')); // load our public/index.html file
});

app.get('/password/:reset/:reset1/:reset2', function(req, res) {
    res.sendFile(path.join(__dirname,'app/frontend/login.html')); // load our public/index.html file

    // var user_id = req.params.reset2;
    // console.log(user_id);

    // User.findOne({_id: user_id}, function(err,user){
    // if(err) { console.log(err); };
    
    // // return if user not found in database
    // if(!user) {
    //   console.log('User not found')
    // }

    // // return if password is wrong
    // // if(!user.validPassword(password)) {
    // //   console.log('Password is wrong');
    // // }

    // res.sendFile(path.join(__dirname,'app/frontend/new_password.html')); // load our public/index.html file

    // console.log(user);

//  });

    //document.write(user_id);

});


app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname,'app/frontend/register.html')); // load our public/index.html file
});

app.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname,'app/frontend/dashboard.html')); // load our public/index.html file
});

app.get('/', function(req, res){
	res.redirect('/login');
})


app.get('/*', function(req, res) {
	console.log("Get All Angular Request");
	console.log(req.user);
    res.sendFile(path.join(__dirname,'app/frontend/index.html')); // load our public/index.html file
});


// mongoose.set('debug', true);
// Start the server

http.globalAgent.maxSockets = 100;

var httpServer = http.createServer(app);
// var secureServer = https.createServer(ssl_options, app);

// app.set('httpsPort', 443);

httpServer.listen(port);
// secureServer.listen(port);
httpServer.timeout = 3600000;
//app.listen(port);
console.log('There will be dragons: http://localhost:' + port);
