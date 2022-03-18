var App = angular.module("kap");

App.factory("KAPFactory", function ($http, configSettings, $timeout) {
  var factory = {};

  factory.saveKAP = function (data) {
    return $http.post(configSettings.apiUrl + "kap/save", data);
  };

  factory.updateKAP = function (data) {
    return $http.post(configSettings.apiUrl + "kap/update", data);
  };

  factory.getAllKAPs = function () {
    return $http.get(configSettings.apiUrl + "kap/get_all");
  };

  return factory;
});
