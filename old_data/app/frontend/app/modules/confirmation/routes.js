angular.module('appRoutes', ['ngRoute']).config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {

    $routeProvider
        // home page
       .when('/confirmation/:userId/:serviceId', {
           templateUrl: 'crm_app/modules/confirmation/views/index.html',
           controller: 'ConfirmationController',
           action: 'edit'
       });

       $locationProvider.html5Mode(true);

}]);