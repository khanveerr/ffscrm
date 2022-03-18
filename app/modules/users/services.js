var App = angular.module("user");

App.factory("UserFactory", function ($http, configSettings, $timeout) {
  var factory = {};

  factory.createUser = function (data) {
    return $http.post(configSettings.apiUrl + "user/add", data);
  };

  factory.getAllUsers = function (data) {
    return $http.post(configSettings.apiUrl + "user/all", data);
  };

  factory.getUserDetail = function (id) {
    return $http.get(configSettings.apiUrl + "user/get/" + id);
  };

  factory.deleteUser = function (id) {
    return $http.get(configSettings.apiUrl + "user/delete/" + id);
  };

  factory.changePassword = function (data) {
    return $http.post(configSettings.apiUrl + "user/change_password", data);
  };

  return factory;
});
