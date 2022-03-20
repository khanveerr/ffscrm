(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('CostCentreService', CostCentreService);  

    function CostCentreService($http) {

        var urlBase = 'http://demo.local/api';
        var CostCentre = {};

        CostCentre.getCostCentres = function (page) {
            return $http.get(urlBase+'/cost_centre/all?page='+page);
        };

        CostCentre.getAllCostCentres = function () {
            return $http.get(urlBase+'/cost_centre/get_all');
        };

        CostCentre.addCostCentre = function (data) {
            return $http.post(urlBase + '/cost_centre/add', data);
        };

        CostCentre.getCostCentre = function(id) {
            return $http.get(urlBase + '/cost_centre/get/'+id);
        };

        CostCentre.deleteCostCentre = function(id) {
            return $http.get(urlBase + '/cost_centre/delete/'+id);
        };

        return CostCentre;


    }

})();