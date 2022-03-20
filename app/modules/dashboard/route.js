var App = angular.module("dashboard", ["ngRoute"]);

App.config([
  "$stateProvider",
  function ($stateProvider) {
    $stateProvider.state({
      name: "reports",
      url: "/reports",
      templateUrl: "app/modules/dashboard/index.html",
      controller: "DashboardCtrl",
      action: "all",
    });
  },
]);
