var App = angular.module("city", ["ngRoute"]);

App.config([
  "$stateProvider",
  function ($stateProvider) {
    $stateProvider.state({
      name: "cities",
      url: "/cities",
      templateUrl: "app/modules/cities/list.html",
      controller: "CityCtrl",
      action: "all",
    });
  },
]);
