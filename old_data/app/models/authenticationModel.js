var dbWrapper = require('../../dbWrapper.js');
var db = new dbWrapper();
var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../schema/logins');


function AuthenticationManager(){


}


AuthenticationManager.prototype.register = function(userData,callback){

	var user = new User();
	
	user.name = userData.name;
	user.email = userData.email;
	user.role = userData.role;
	user.city = userData.city;

	user.setPassword(userData.password);

	user.save(function(err){
		var token;
		var response = {};
		
		if(err) {
			response['status'] = 404;
			response['err'] = err;
			callback(response);
			return;
		}

		token = user.generateJwt();
		response['status'] = 200;
		response['token'] = token;

		callback(response);

	});

};

AuthenticationManager.prototype.setNewPassword = function(userData,callback){

	//var user = new User();

	var user_id = userData.id;
	var password = userData.password;
	
	// user.name = userData.name;
	// user.email = userData.email;
	// user.role = userData.role;
	// user.city = userData.city;

	User.findOne({_id: user_id}, function(err,user){

		console.log(user);

		if(user) {

			user.setPassword(password);
			user.save(function(err){
				var token;
				var response = {};
				
				if(err) {
					response['status'] = 404;
					response['err'] = err;
					callback(response);
					return;
				}

				token = user.generateJwt();
				response['status'] = 200;
				response['token'] = token;

				callback(response);

			});

		}

	});

	

};


AuthenticationManager.prototype.changePassword = function(userData,callback){

	//var user = new User();

	var user_email = userData.email;
	var old_password = userData.old_password;
	var new_password = userData.new_password;
	
	// user.name = userData.name;
	// user.email = userData.email;
	// user.role = userData.role;
	// user.city = userData.city;

	User.findOne({email: user_email}, function(err,user){

		console.log(user);
		var response = {};

		if(!user.validPassword(old_password)) {
	      //return done(null, false, { message: 'Password is wrong' });
			response['status'] = 400;
			response['message'] = 'Incorrect password';
			callback(response);
			return;
	    }


		if(user) {

			user.setPassword(new_password);
			user.save(function(err){
				var token;
				
				if(err) {
					response['status'] = 404;
					response['message'] = err;
					callback(response);
					return;
				}

				token = user.generateJwt();
				response['status'] = 200;
				response['token'] = token;

				callback(response);

			});

		}

	});

};


AuthenticationManager.prototype.login = function(userData,callback) {

	console.log(userData);

	passport.authenticate('local',function(err,user,info){

		var token;
		var response = {};

		// If passport throws/catches an error
		if(err) {
			response['status'] = 404;
			response['err'] = err;
			callback(response);
			return;
		}

		// If a user is found
		if(user) {
			token = user.generateJwt();
			response['status'] = 200;
			response['token'] = token;
			callback(response);
		} else {
			response['status'] = 401;
			response['info'] = info;
			callback(response);
		}

	});

};


module.exports = AuthenticationManager;