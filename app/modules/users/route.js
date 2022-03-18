var App = angular.module("user", ["ngRoute"]);

App.config([
  "$stateProvider",
  function ($stateProvider) {
    $stateProvider.state({
      name: "all_users",
      url: "/users",
      templateUrl: "app/modules/users/list.html",
      controller: "UserCtrl",
      action: "all",
    });

    $stateProvider.state({
      name: "change_password",
      url: "/change_password",
      templateUrl: "app/modules/users/change_password.html",
      controller: "UserCtrl",
      action: "change_password",
    });

  },
]);
