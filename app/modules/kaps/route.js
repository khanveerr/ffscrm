var App = angular.module("kap", ["ngRoute"]);

App.config([
  "$stateProvider",
  function ($stateProvider) {
    $stateProvider.state({
      name: "all_kaps",
      url: "/kaps",
      templateUrl: "app/modules/kaps/list.html",
      controller: "KAPCtrl",
      action: "all",
    });
  },
]);
