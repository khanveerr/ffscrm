angular.module('appRoutes', ['ngRoute']).config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {

    $routeProvider
        // home page
       .when('/feedback/ongoing/thankyou', {
           templateUrl: 'crm_app/modules/feedback/views/ongoing.html',
           controller: 'FeedbackController',
           action: 'ongoing'
       })

       .when('/feedback/:userId/:orderId', {
           templateUrl: 'crm_app/modules/feedback/views/index.html',
           controller: 'FeedbackController',
           action: 'edit'
       });


       $locationProvider.html5Mode(true);

}]);