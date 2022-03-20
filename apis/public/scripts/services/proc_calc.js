(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('ProcCalService', ProcCalService);  

    function ProcCalService($http) {

        var urlBase = 'http://demo.local/api';
        var ProcCal = {};

        ProcCal.getProcDetails = function (page) {
            return $http.get(urlBase+'/proc_calc/all?page='+page);
        };

        ProcCal.addProcCalc = function (data) {
            return $http.post(urlBase + '/proc_calc/add', data);
        };

        ProcCal.updateItem = function (data) {
            return $http.post(urlBase + '/proc_calc/item/update', data);
        };

        ProcCal.uploadImage = function (data) {
            return $http.post(urlBase + '/proc_calc/upload/image', data);
        };

        ProcCal.getProCalc = function(id) {
            return $http.get(urlBase + '/proc_calc/get/'+id);
        };

        ProcCal.export = function(id, type) {
            return $http.get(urlBase + '/proc_calc/export/'+id + '/' + type);
        };

        ProcCal.getProcItems = function(id) {
            return $http.get(urlBase + '/proc_calc/items/get/'+id);
        };

        ProcCal.deleteProcCalc = function(id) {
            return $http.get(urlBase + '/proc_calc/delete/'+id);
        };

        return ProcCal;


    }

})();