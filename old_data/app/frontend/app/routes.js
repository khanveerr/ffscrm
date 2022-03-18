angular.module('appRoutes', ['ngRoute']).config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {

    $routeProvider
        // home page
        .when('/lead/add', {
           templateUrl: 'crm_app/modules/leadmanager/views/add_lead.html',
           controller: 'LeadManagerController',
           action: 'add',
           access: { restricted: true }
       })
       .when('/leads', {
           templateUrl: 'crm_app/modules/leads/views/index.html',
           controller: 'LeadController',
           action: 'all',
           access: { restricted: true }
       })

       .when('/kaps', {
           templateUrl: 'crm_app/modules/kap/views/index.html',
           controller: 'KAPController',
           action: 'all',
           access: { restricted: true }
       })

       .when('/targets', {
           templateUrl: 'crm_app/modules/bd_targets/views/index.html',
           controller: 'BDTargetController',
           action: 'all',
           access: { restricted: true }
       })

       .when('/won/leads', {
           templateUrl: 'crm_app/modules/won_leads/views/index.html',
           controller: 'WonLeadController',
           action: 'all',
           access: { restricted: true }
       })

       .when('/lost/leads', {
           templateUrl: 'crm_app/modules/lost_leads/views/index.html',
           controller: 'LostLeadController',
           action: 'all',
           access: { restricted: true }
       })

       .when('/leads1', {
           templateUrl: 'crm_app/modules/leadmanager/views/index.html',
           controller: 'LeadManagerController',
           action: 'all',
           access: { restricted: true }
       })
       .when('/orders', {
           templateUrl: 'crm_app/modules/order/views/index.html',
           controller: 'OrderController',
           action: 'all_orders',
           access: { restricted: true }
       })
       .when('/amcs', {
           templateUrl: 'crm_app/modules/amc/views/index.html',
           controller: 'AMCController',
           action: 'all_amcs',
           access: { restricted: true }
       })
       .when('/amc/renewal', {
           templateUrl: 'crm_app/modules/amc_renewal/views/index.html',
           controller: 'AMCRenewController',
           action: 'all_amcs',
           access: { restricted: true }
       })

       .when('/change/password', {
           templateUrl: 'crm_app/modules/change_password/views/index.html',
           controller: 'ChangePasswordController',
           access: { restricted: true }
       })

       .when('/accounts', {
           templateUrl: 'crm_app/modules/account/views/index.html',
           controller: 'AccountController',
           action: 'all',
           access: { restricted: true }
       })
       .when('/lead/edit/:leadId', {
           templateUrl: 'crm_app/modules/leadmanager/views/add_lead.html',
           controller: 'LeadManagerController',
           action: 'edit',
           access: { restricted: true }
       })
       .when('/inspections', {
           templateUrl: 'crm_app/modules/inspection/views/index.html',
           controller: 'InspectionController',
           action: 'all',
           access: { restricted: true }
       })
       .when('/manpowers', {
           templateUrl: 'crm_app/modules/manpower/views/index.html',
           controller: 'ManpowerController',
           action: 'all',
           access: { restricted: true }
       })

       .when('/cities', {
           templateUrl: 'crm_app/modules/city/views/index.html',
           controller: 'CityController',
           action: 'all',
           access: { restricted: true }
       })

       .when('/inspections/open', {
           templateUrl: 'crm_app/modules/inspection/views/index.html',
           controller: 'InspectionController',
           action: 'open',
           access: { restricted: true }
       })
       .when('/inspections/closed', {
           templateUrl: 'crm_app/modules/inspection/views/index.html',
           controller: 'InspectionController',
           action: 'closed',
           access: { restricted: true }
       });

       $locationProvider.html5Mode(true);

}]).run(['$rootScope', '$location', '$window', 'AuthService',function($rootScope, $location, $window, AuthService){

  $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {

    if (nextRoute.access.restricted && !AuthService.isLoggedIn()) {
      //$location.path('/login');
      $window.location.href = '/login';
    }

    // controller: 'LeadManagerController',

  });

}]);