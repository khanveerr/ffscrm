(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('RegistrationService', RegistrationService);  

    function RegistrationService($http) {

        var urlBase = 'http://demo.local';
        var Registration = {};

        Registration.registerUser = function (data) {
            return $http.post(urlBase + '/user/register', data);
        };


        return Registration;


    }

})();