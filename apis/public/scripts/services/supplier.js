(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('SupplierService', SupplierService);  

    function SupplierService($http) {

        var urlBase = 'http://demo.local/api';
        var Supplier = {};

        Supplier.getSupplierList = function (year,month,site_id) {
            return $http.get(urlBase+'/supplier_list/get/'+ year +'/'+month+'/'+site_id);
        };

        Supplier.exportSupplierList = function (year,month,site_id) {
            return $http.get(urlBase+'/supplier_list/export/'+ year + '/'+month+'/'+site_id);
        };

        return Supplier;


    }

})();