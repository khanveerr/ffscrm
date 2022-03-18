var App = angular.module("nps", ["ngRoute"]);

App.config([
  "$stateProvider",
  function ($stateProvider) {
    $stateProvider.state({
      name: "nps_survey",
      url: "/nps_survey",
      templateUrl: "app/modules/nps/list.html",
      controller: "NPSCtrl",
      action: "all",
    });
  },
]);
