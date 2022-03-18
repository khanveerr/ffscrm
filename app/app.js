var App = angular.module("silaproject", [
  "ui.router",
  "satellizer",
  "ngRoute",
  "ngMessages",
  "ngAnimate",
  "toastr",
  "lead",
  "login",
  "kap",
  "won_lead",
  "lead_db",
  "user",
  "city",
  "nps",
  "dashboard",
  "header",
  "kapcalendar",
  "oitozero.ngSweetAlert",
  "ui.calendar"
]);

App.config([
  "$locationProvider",
  "$urlRouterProvider",
  "$stateProvider",
  "$provide",
  "$authProvider",
  "$httpProvider",
  "toastrConfig",
  function (
    $locationProvider,
    $urlRouterProvider,
    $stateProvider,
    $provide,
    $authProvider,
    $httpProvider,
    toastrConfig
  ) {
    angular.extend(toastrConfig, {
      closeButton: false,
      debug: false,
      newestOnTop: false,
      progressBar: true,
      positionClass: "toast-top-right",
      preventDuplicates: false,
      onclick: null,
      showDuration: "300",
      hideDuration: "1000",
      timeOut: "5000",
      extendedTimeOut: "1000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);

    //Default route of site
    $urlRouterProvider.otherwise(function () {
      return "/";
    });

    $provide.decorator("$state", [
      "$delegate",
      "$rootScope",
      function ($delegate, $rootScope) {
        $rootScope.$on("$stateChangeStart", function (event, state, params) {
          $delegate.next = state;
          $delegate.toParams = params;
        });
        return $delegate;
      },
    ]);

    function redirectWhenLoggedOut($q, $injector) {
      return {
        request: function (config) {
          config.headers = config.headers || {};
          if (localStorage.getItem("satellizer_token")) {
            config.headers.Authorization =
              "Bearer " + localStorage.getItem("satellizer_token");
          }
          return config;
        },

        responseError: function (rejection) {
          // Need to use $injector.get to bring in $state or else we get
          // a circular dependency error
          var $state = $injector.get("$state");

          // Instead of checking for a status code of 400 which might be used
          // for other reasons in Laravel, we check for the specific rejection
          // reasons to tell us if we need to redirect to the login state
          var rejectionReasons = [
            "token_not_provided",
            "token_expired",
            "token_absent",
            "token_invalid",
          ];

          // Loop through each rejection reason and redirect to the login
          // state if one is encountered
          angular.forEach(rejectionReasons, function (value, key) {
            if (rejection.data.error === value) {
              // If we get a rejection corresponding to one of the reasons
              // in our array, we know we need to authenticate the user so
              // we can remove the current user from local storage
              localStorage.removeItem("user");
              localStorage.removeItem("satellizer_token");

              // Send the user to the auth state so they can login
              $state.go("auth");
            }
          });

          return $q.reject(rejection);
        },
      };
    }

    // Setup for the $httpInterceptor
    $provide.factory("redirectWhenLoggedOut", redirectWhenLoggedOut);

    // Push the new factory onto the $http interceptor array
    $httpProvider.interceptors.push("redirectWhenLoggedOut");

    // Satellizer configuration that specifies which API
    // route the JWT should be retrieved from
    $authProvider.loginUrl = "/apis/public/api/authenticate";
  },
]);

App.directive("datepicker", function () {
  return {
    restrict: "A",
    require: "ngModel",
    compile: function () {
      return {
        pre: function (scope, element, attrs, ngModelCtrl) {
          var format, dateObj;
          format = !attrs.dpFormat ? "d/m/yyyy" : attrs.dpFormat;
          if (!attrs.initDate && !attrs.dpFormat) {
            // If there is no initDate attribute than we will get todays date as the default
            dateObj = new Date();
            scope[attrs.ngModel] =
              dateObj.getDate() +
              "/" +
              (dateObj.getMonth() + 1) +
              "/" +
              dateObj.getFullYear();
          } else if (!attrs.initDate) {
            // Otherwise set as the init date
            scope[attrs.ngModel] = attrs.initDate;
          } else {
            // I could put some complex logic that changes the order of the date string I
            // create from the dateObj based on the format, but I'll leave that for now
            // Or I could switch case and limit the types of formats...
          }
          // Initialize the date-picker
          $(element)
            .datepicker({
              format: format,
            })
            .on("changeDate", function (ev) {
              // To me this looks cleaner than adding $apply(); after everything.
              scope.$apply(function () {
                ngModelCtrl.$setViewValue(ev.format(format));
              });
            });
        },
      };
    },
  };
});

App.directive("leadPagination", function () {
  return {
    restrict: "E",
    template:
      '<nav ng-show="totalPages > 1">' +
      '<ul class="pagination justify-content-center">' +
      '<li class="page-item" ng-show="currentPage != 1"><a href="javascript:void(0)" class="page-link" ng-click="searchLeads(1)">&laquo;</a></li>' +
      '<li class="page-item" ng-show="currentPage != 1"><a href="javascript:void(0)" class="page-link" ng-click="searchLeads(currentPage-1)">&lsaquo; Prev</a></li>' +
      '<li class="page-item" ng-repeat="i in range" ng-class="{active : currentPage == i}">' +
      '<a href="javascript:void(0)" class="page-link" ng-click="searchLeads(i)">{{i}}</a>' +
      "</li>" +
      '<li class="page-item" ng-show="currentPage != totalPages"><a href="javascript:void(0)" class="page-link" ng-click="searchLeads(currentPage+1)">Next &rsaquo;</a></li>' +
      '<li class="page-item" ng-show="currentPage != totalPages"><a href="javascript:void(0)" class="page-link" ng-click="searchLeads(totalPages)">&raquo;</a></li>' +
      "</ul>" +
      "</nav>",
  };
});

App.constant("configSettings", {
  apiUrl: "https://crm.silagroup.co.in/apis/public/api/",
});
