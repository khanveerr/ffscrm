var App = angular.module("lead_db", ["ngRoute"]);

App.config([
  "$stateProvider",
  function ($stateProvider) {
    $stateProvider.state({
      name: "all_lead_database",
      url: "/lead_database",
      templateUrl: "app/modules/lead_database/list.html",
      controller: "LeadDBCtrl",
      action: "all",
    });
  },
]);
