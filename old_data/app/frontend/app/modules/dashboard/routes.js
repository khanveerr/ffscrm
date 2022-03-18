angular.module('appRoutes', ['ngRoute']).config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {

    $routeProvider
        // home page
       .when('/dashboard', {
           templateUrl: 'crm_app/modules/dashboard/views/dashboard.html',
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