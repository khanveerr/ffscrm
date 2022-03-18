(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('InventoryService', InventoryService);  

    function InventoryService($http) {

        var urlBase = 'http://demo.local/api';
        var Inventory = {};

        Inventory.getInventories = function (page) {
            return $http.get(urlBase+'/inventory/all?page='+page);
        };

        Inventory.addInventory = function (data) {
            return $http.post(urlBase + '/inventory/add', data);
        };

        Inventory.getInventory = function(id) {
            return $http.get(urlBase + '/inventory/get/'+id);
        };

        Inventory.deleteInventory = function(id) {
            return $http.get(urlBase + '/inventory/delete/'+id);
        };

        return Inventory;


    }

})();