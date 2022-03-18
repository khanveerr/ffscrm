angular.module('appRoutes', ['ngRoute']).config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {

    $routeProvider
        // home page
       .when('/mis', {
           templateUrl: 'crm_app/modules/mis/views/ongoing.html',
           controller: 'MISController',
           access: { restricted: true }
       })

       .when('/mis/dashboard/leads', {
           templateUrl: 'crm_app/modules/mis/views/index.html',
           controller: 'MISController',
           action: 'open',
           access: { restricted: true }
       })

       .when('/mis/dashboard/leads/won', {
           templateUrl: 'crm_app/modules/mis/views/won_leads.html',
           controller: 'MISController',
           action: 'won',
           access: { restricted: true }
       })

       .when('/mis/dashboard/leads/lost', {
           templateUrl: 'crm_app/modules/mis/views/lost_leads.html',
           controller: 'MISController',
           action: 'lost',
           access: { restricted: true }
       })

       .when('/mis/dashboard/revenue/summary', {
           templateUrl: 'crm_app/modules/mis/views/revenue.html',
           controller: 'MISController',
           action: 'rs',
           access: { restricted: true }
       })

       .when('/mis/dashboard/revenue/organic-vs-partners', {
           templateUrl: 'crm_app/modules/mis/views/revenue-organic-vs-partner.html',
           controller: 'MISController',
           action: 'rovp',
           access: { restricted: true }
       })

       .when('/mis/dashboard/bookings/organic-vs-partners', {
           templateUrl: 'crm_app/modules/mis/views/organic-vs-partner.html',
           controller: 'MISController',
           action: 'bovp',
           access: { restricted: true }
       })

       .when('/mis/dashboard/bookings/category-analysis', {
           templateUrl: 'crm_app/modules/mis/views/category-analysis.html',
           controller: 'MISController',
           action: 'cwb',
           access: { restricted: true }
       })

       .when('/mis/dashboard/revenue/category-analysis', {
           templateUrl: 'crm_app/modules/mis/views/category-analysis-revenue.html',
           controller: 'MISController',
           action: 'cwr',
           access: { restricted: true }
       });


       $locationProvider.html5Mode(true);

}]).run(['$rootScope', '$location', '$window', 'AuthService',function($rootScope, $location, $window, AuthService){

  $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
    if (nextRoute.access.restricted && !AuthService.isLoggedIn()) {
      //$location.path('/login');
      $window.location.href = '/login';
    }
  });

}]);