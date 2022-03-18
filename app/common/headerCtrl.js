var App = angular.module("header");

App.controller("HeaderCtrl", [
  "$auth",
  "$scope",
  "$rootScope",
  "$state",
  "$stateParams",
  "$timeout",
  "LoginFactory",
  function (
    $auth,
    $scope,
    $rootScope,
    $state,
    $stateParams,
    $timeout,
    LoginFactory
  ) {
    var user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      $rootScope.authenticated = true;
      $rootScope.currentUser = user;
      $state.go("all_leads");
    } else {
      $rootScope.authenticated = false;
      $state.go("auth");
    }

    $scope.logout = function () {
      $auth.logout().then(function () {
        // Remove the authenticated user from local storage
        localStorage.removeItem("user");

        // Flip authenticated to false so that we no longer
        // show UI elements dependant on the user being logged in
        $rootScope.authenticated = false;

        // Remove the current user info from rootscope
        $rootScope.currentUser = null;

        $state.go("auth");
      });
    };
  },
]);
