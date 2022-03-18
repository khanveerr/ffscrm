angular.module('AuthHelper', []).factory('AuthService', ['$http','$window','serverConfig', function($http,$window,serverConfig) {

    //var base_url = "http://localhost:3000";


    var saveToken = function (token) {
      $window.localStorage['mean-token'] = token;
    };

    var getToken = function () {
      return $window.localStorage['mean-token'];
    };

    var logout = function() {
      $window.localStorage.removeItem('mean-token');
    };

    var isLoggedIn = function() {
    	var token = getToken();
    	var payload;

    	if(token) {
    		payload = token.split('.')[1];
    		payload = $window.atob(payload);
    		payload = JSON.parse(payload);

    		return payload.exp > (Date.now()/1000);
    	} else {
    		return false;
    	}
    };

    var currentUser = function(){

    	if(isLoggedIn()) {
    		var token = getToken();
    		var payload = token.split('.')[1];
    		payload = $window.atob(payload);
    		payload = JSON.parse(payload);
    		return {
    			email: payload.email,
    			name: payload.name,
                role: payload.role,
                city: payload.city
    		};
    	}

    };

    var register = function(user) {
	  return $http.post(serverConfig.apiUrl + '/auth/register', user).success(function(data){
	    saveToken(data.message.token);
	  });
	};

	var login = function(user) {
	  return $http.post(serverConfig.apiUrl + '/auth/login', user).success(function(data) {
	  	//console.log(data);
	    saveToken(data.message.token);
	  });
	};

    var sendResetLink = function(email) {

        return $http.get('http://engine.silagroup.co.in/api/public/password/reset/'+email);

    };


    var setPassword = function(data) {
      return $http.post(serverConfig.apiUrl + '/auth/set_password', data);
    };

    var changePassword = function(data) {
        return $http.post(serverConfig.apiUrl + '/auth/change_password', data);
    };


    return {

        get : function() {
            return $http.get(serverConfig.apiUrl + '/app/');
        },

        saveToken: saveToken,
        getToken: getToken,
        logout: logout,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        register: register,
        login: login,
        sendResetLink: sendResetLink,
        setPassword: setPassword,
        changePassword: changePassword
    }


}]);