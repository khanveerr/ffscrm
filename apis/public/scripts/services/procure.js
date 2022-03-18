(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('ProcureService', ProcureService);  

    function ProcureService($http) {

        var urlBase = 'http://demo.local/api';
        var Procure = {};

        Procure.getItems = function (zone_id) {
            return $http.get(urlBase+'/procurement/items/'+zone_id);
        };

        Procure.export = function (data) {
            return $http.post(urlBase+'/procurement/items/export',data);
        };

        Procure.export_by_proc_id = function (data) {
            return $http.post(urlBase+'/procurement/items/export_by_proc_id',data);
        };

        Procure.exportPO = function(id) {
            return $http.get(urlBase+'/procurement/items/export_po/'+id);
        }

        Procure.updateStatus = function(id, status) {
            return $http.get(urlBase+'/requisition/update/status/'+id+'/'+status);
        }

        Procure.submitRequest = function (data) {
            return $http.post(urlBase+'/procurement/request/items',data);
        };

        Procure.submitDraftRequest = function (data) {
            return $http.post(urlBase+'/procurement/draft/requisition',data);
        };

        return Procure;


    }

})();