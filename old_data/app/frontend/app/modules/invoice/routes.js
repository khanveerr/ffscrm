angular.module('appRoutes', ['ngRoute']).config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {

    $routeProvider
        // home page
       .when('/invoice', {
           templateUrl: 'crm_app/modules/invoice/views/index.html',
           controller: 'InvoiceController',
           action: 'view'
       });

       $locationProvider.html5Mode(true);

}]);