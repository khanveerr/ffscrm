var App = angular.module("lead");

App.factory("LeadFactory", function ($http, configSettings, $timeout) {
  var factory = {};

  factory.createLead = function (data) {
    return $http.post(configSettings.apiUrl + "lead/save", data);
  };

  factory.getAllLeads = function (data) {
    return $http.post(configSettings.apiUrl + "lead/all", data);
  };

  factory.setLeadImportant = function (data) {
    return $http.post(configSettings.apiUrl + "lead/set_important", data);
  };

  factory.exportLead = function (data) {
    return $http.post(configSettings.apiUrl + "lead/export", data);
  };

  factory.getLeadDetail = function (id) {
    return $http.get(configSettings.apiUrl + "lead/get/" + id);
  };

  factory.setLeadReminder = function (data) {
    return $http.post(configSettings.apiUrl + "lead/update_reminder", data);
  };

  factory.deleteLead = function (id) {
    return $http.post(configSettings.apiUrl + "lead/delete/" + id);
  };

  factory.getCompanies = function () {
    return $http.get(configSettings.apiUrl + "user/companies");
  };

  factory.getStates = function () {
    return $http.get(configSettings.apiUrl + "states");
  };

  factory.getIndustries = function () {
    return $http.get(configSettings.apiUrl + "industries");
  };

  factory.getLeadsources = function () {
    return $http.get(configSettings.apiUrl + "leadsources");
  };

  factory.getLeadKAPs = function (lead_id) {
    return $http.get(configSettings.apiUrl + "lead/kaps/" + lead_id);
  };

  factory.getActiveLeadUsers = function () {
    return $http.get(configSettings.apiUrl + "lead/active_users");
  };

  factory.getLeadUsers = function () {
    return $http.get(configSettings.apiUrl + "lead/users");
  };

  return factory;
});
