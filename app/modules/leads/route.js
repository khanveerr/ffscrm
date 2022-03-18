var App = angular.module("lead", ["ngRoute"]);

App.config([
  "$stateProvider",
  function ($stateProvider) {
    $stateProvider.state({
      name: "all_leads",
      url: "/leads",
      templateUrl: "app/modules/leads/list.html",
      controller: "LeadCtrl",
      action: "all",
    });
  },
]);
