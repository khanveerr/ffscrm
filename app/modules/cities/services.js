var App = angular.module("city");

App.factory("CityFactory", function ($http, configSettings, $timeout) {
  var factory = {};

  factory.createCity = function (data) {
    return $http.post(configSettings.apiUrl + "city/add", data);
  };

  factory.getCities = function (data) {
    return $http.post(configSettings.apiUrl + "city/all", data);
  };

  factory.getAllCities = function () {
    return $http.get(configSettings.apiUrl + "city/get_all");
  };

  factory.getCityDetail = function (id) {
    return $http.get(configSettings.apiUrl + "city/get/" + id);
  };

  factory.deleteCity = function (id) {
    return $http.get(configSettings.apiUrl + "city/delete/" + id);
  };

  return factory;
});
