var App = angular.module("dashboard");

App.factory("DashboardFactory", function ($http, configSettings, $timeout) {
  var factory = {};

  // factory.createNPS = function (data) {
  //   return $http.post(configSettings.apiUrl + "nps/add", data);
  // };

  factory.getSalesFunnelData = function (data) {
    return $http.post(configSettings.apiUrl + "report/get_sales_funnel_data", data);
  };

  factory.getIndustryData = function (data) {
    return $http.post(configSettings.apiUrl + "report/industry_wise", data);
  };

  factory.getLeadBySource = function (data) {
    return $http.post(configSettings.apiUrl + "report/get_total_leads_by_source", data);
  };

  factory.getLeadByOwner = function () {
    return $http.get(configSettings.apiUrl + "report/get_leadowner_report_data");
  };

  factory.getContractWonSiteStartedData = function (data) {
    return $http.post(configSettings.apiUrl + "report/get_contracts_won_and_site_activated_report_data", data);
  };

  factory.getSiteStartedData = function (data) {
    return $http.post(configSettings.apiUrl + "report/get_site_started_report_data", data);
  };

  factory.getContractWonSiteStartedDataMonthWise = function (data) {
    return $http.post(configSettings.apiUrl + "report/get_contracts_won_and_site_started_monthwise_report_data", data);
  };

  return factory;
});
