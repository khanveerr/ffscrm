var App = angular.module("login", []);

App.config([
  "$stateProvider",
  function ($stateProvider) {
    $stateProvider.state({
      name: "auth",
      url: "/",
      templateUrl: "app/modules/login/index.html",
      controller: "LoginCtrl",
    });
  },
]);
