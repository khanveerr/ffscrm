(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('ReqService', ReqService);  

    function ReqService($http) {

        var urlBase = 'http://demo.local/api';
        var Requisition = {};

        Requisition.getRequisitions = function (page, data) {
            return $http.post(urlBase+'/requisition/all?page='+page, data);
        };

        Requisition.getRequisitionItems = function(id) {
            return $http.get(urlBase + '/requisition/items/get/'+id);
        };

        Requisition.getAllRequisitionItems = function(id) {
            return $http.get(urlBase + '/requisition/items/get_all/'+id);
        };

        Requisition.getReportData = function(data) {
            return $http.post(urlBase + '/procurement/report',data);
        };

        Requisition.getRequisitionsReportExcel = function (data) {
            return $http.post(urlBase+'/requisition/export/all', data);
        };

        // ProcCal.addProcCalc = function (data) {
        //     return $http.post(urlBase + '/proc_calc/add', data);
        // };

        // ProcCal.updateItem = function (data) {
        //     return $http.post(urlBase + '/proc_calc/item/update', data);
        // };

        // ProcCal.uploadImage = function (data) {
        //     return $http.post(urlBase + '/proc_calc/upload/image', data);
        // };

        // ProcCal.getProCalc = function(id) {
        //     return $http.get(urlBase + '/proc_calc/get/'+id);
        // };

        // ProcCal.export = function(id, type) {
        //     return $http.get(urlBase + '/proc_calc/export/'+id + '/' + type);
        // };

        

        // ProcCal.deleteProcCalc = function(id) {
        //     return $http.get(urlBase + '/proc_calc/delete/'+id);
        // };

        return Requisition;


    }

})();