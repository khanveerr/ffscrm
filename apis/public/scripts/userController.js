(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('UserController', UserController);  

    function UserController($http, $rootScope, $location) {

        var vm = this;

        vm.users;
        vm.error;

        // Grab the user from local storage and parse it to an object
        var user = JSON.parse(localStorage.getItem('user')); 
        if(user) {
            $rootScope.authenticated = true;
            $rootScope.currentUser = user;
        } else {
            $location.path( "/auth" );

        }


        vm.getUsers = function() {

            // This request will hit the index method in the AuthenticateController
            // on the Laravel side and will return the list of users
            $http.get('api/authenticate').then(function(users) {
                console.log(users);
                vm.users = users.data;
            },function(error) {
                vm.error = error;
            });
        }
    }

})();