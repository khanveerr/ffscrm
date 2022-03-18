var App = angular.module("won_lead", ["ngRoute"]);

App.config([
  "$stateProvider",
  function ($stateProvider) {
    $stateProvider.state({
      name: "all_won_leads",
      url: "/won_leads",
      templateUrl: "app/modules/won_leads/list.html",
      controller: "WonLeadCtrl",
      action: "all",
    });
  },
]);
