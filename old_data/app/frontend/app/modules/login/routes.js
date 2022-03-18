angular.module('appRoutes', ['ngRoute']).config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {

    $routeProvider
        // home page
       .when('/login', {
           templateUrl: 'crm_app/modules/login/views/login.html',
           controller: 'LoginController'
       })

       .when('/password/reset', {
           templateUrl: 'crm_app/modules/login/views/reset_password.html',
           controller: 'LoginController'
       })

       .when('/password/reset/token/:userId', {
           templateUrl: 'crm_app/modules/login/views/new_password.html',
           controller: 'LoginController'
       });

       $locationProvider.html5Mode(true);

}]);