(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('CompanyService', CompanyService);  

    function CompanyService($http) {

        var urlBase = 'http://demo.local/api';
        var Company = {};

        Company.getCompanies = function (page) {
            return $http.get(urlBase+'/company/all?page='+page);
        };

        Company.addCompany = function (data) {
            return $http.post(urlBase + '/company/add', data);
        };

        Company.getCompany = function(id) {
            return $http.get(urlBase + '/company/get/'+id);
        };

        Company.deleteCompany = function(id) {
            return $http.get(urlBase + '/company/delete/'+id);
        };

        return Company;


    }

})();