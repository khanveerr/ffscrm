(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('UserService', UserService);  

    function UserService($http) {

        var urlBase = 'http://demo.local/api';
        var User = {};

        User.getAllUsers = function (page,keyword) {
            return $http.get(urlBase+'/user/all/'+ keyword +'?page='+page);
        };

        User.addUser = function (data) {
            return $http.post(urlBase + '/user/add', data);
        };

        User.getUser = function(id) {
            return $http.get(urlBase + '/user/get/'+id);
        };

        User.deleteUser = function(id) {
            return $http.get(urlBase + '/user/delete/'+id);
        };

        return User;


    }

})();