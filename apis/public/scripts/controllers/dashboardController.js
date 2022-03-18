(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('DashboardController', DashboardController);  

    function DashboardController($http, $rootScope, $scope, $location) {

        var user = JSON.parse(localStorage.getItem('user')); 
        if(user) {
            $rootScope.authenticated = true;
            $rootScope.currentUser = user;
        } else {
            $location.path( "/user/login" );

        }
        
    }

})();