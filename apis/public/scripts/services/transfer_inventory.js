(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('InventoryTransferService', InventoryTransferService);  

    function InventoryTransferService($http) {

        var urlBase = 'http://demo.local/api';
        var Inventory = {};

        Inventory.getTransferredInventories = function (page,id) {
            return $http.get(urlBase+'/inventory/transfer/'+ id +'?page='+page);
        };

        Inventory.addTransferInventory = function (data) {
            return $http.post(urlBase + '/inventory/transfer/add', data);
        };

        Inventory.getTranserredInventory = function(id) {
            return $http.get(urlBase + '/inventory/transfer/get/'+id);
        };

        Inventory.deleteTranserredInventory = function(id) {
            return $http.get(urlBase + '/inventory/transfer/delete/'+id);
        };

        return Inventory;


    }

})();