var routes = require('express').Router();
var passport = require('passport');
var authmanager = require('../../../app/models/authenticationModel');
var User = require('../../schema/logins');


routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});


routes.post('/register', (req, res) => {
    var auth = new authmanager();
    var response = {};
    var insertObj = {};

    insertObj = req.body;
    console.log(insertObj);

    auth.register(insertObj,function(data){
        response  = data;
        res.status(response['status']).json({ message: response });
    });
});

routes.post('/set_password', (req, res) => {
    var auth = new authmanager();
    var response = {};
    var insertObj = {};

    insertObj = req.body;
    console.log(insertObj);

    auth.setNewPassword(insertObj,function(data){
        response  = data;
        res.status(response['status']).json({ message: response });
    });
});


routes.post('/change_password', (req, res) => {
    var auth = new authmanager();
    var response = {};
    var insertObj = {};

    insertObj = req.body;
    console.log(insertObj);

    auth.changePassword(insertObj,function(data){
        response  = data;
        res.status(response['status']).json({ message: response });
    });
});


routes.post('/login', (req, res) => {
    

	passport.authenticate('local',function(err,user,info){

		var token;
		var response = {};

		// If passport throws/catches an error
		if(err) {
			response['status'] = 404;
			response['error'] = err;
			res.status(response['status']).json({ message: response });
		}

		// If a user is found
		if(user) {
			token = user.generateJwt();
			response['status'] = 200;
			response['token'] = token;
			res.status(response['status']).json({ message: response });
		} else {
			response['status'] = 401;
			response['info'] = info;
			res.status(response['status']).json({ message: response });
		}

	})(req, res);



});


module.exports = routes;
