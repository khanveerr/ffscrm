var App = angular.module("login");

App.factory("LoginFactory", function ($http, configSettings, $timeout) {
  var factory = {};

  factory.authenticateUser = function (data) {
    return $http.post(configSettings.apiUrl + "authenticate", data);
  };

  factory.logout = function () {
    return $http.get(configSettings.apiUrl + "logout");
  };

  return factory;
});
