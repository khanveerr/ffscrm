var App = angular.module("nps");

App.factory("NPSFactory", function ($http, configSettings, $timeout) {
  var factory = {};

  factory.createNPS = function (data) {
    return $http.post(configSettings.apiUrl + "nps/add", data);
  };

  factory.getAllNPS = function (data) {
    return $http.post(configSettings.apiUrl + "nps/all", data);
  };

  // factory.getAllCities = function (state_id) {
  //   return $http.get(configSettings.apiUrl + "nps/get_all/" + state_id);
  // };

  factory.getNPSDetail = function (id) {
    return $http.get(configSettings.apiUrl + "nps/get/" + id);
  };

  factory.deleteNPS = function (id) {
    return $http.get(configSettings.apiUrl + "nps/delete/" + id);
  };

  return factory;
});
