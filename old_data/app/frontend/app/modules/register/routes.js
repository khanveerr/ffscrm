angular.module('appRoutes', ['ngRoute']).config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {

    $routeProvider
        // home page
       .when('/register', {
           templateUrl: 'crm_app/modules/register/views/register.html',
           controller: 'RegisterController'
       });

       $locationProvider.html5Mode(true);

}]);