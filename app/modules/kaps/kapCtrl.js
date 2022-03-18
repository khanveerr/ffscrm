var App = angular.module("kap");

App.controller("KAPCtrl", [
  "$scope",
  "$rootScope",
  "$state",
  "$route",
  "$stateParams",
  "$timeout",
  "LeadFactory",
  "KAPFactory",
  "SweetAlert",
  function (
    $scope,
    $rootScope,
    $state,
    $route,
    $stateParams,
    $timeout,
    LeadFactory,
    KAPFactory,
    SweetAlert
  ) {
    var user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      $rootScope.authenticated = true;
      $rootScope.currentUser = user;
    } else {
      $rootScope.authenticated = false;
      $state.go("auth");
    }
  },
]);
