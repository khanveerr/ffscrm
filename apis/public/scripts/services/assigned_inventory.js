(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('InventoryAssignService', InventoryAssignService);  

    function InventoryAssignService($http) {

        var urlBase = 'http://demo.local/api';
        var Inventory = {};

        Inventory.getAssignedInventories = function (page,id) {
            return $http.get(urlBase+'/inventory/assign/'+ id +'?page='+page);
        };

        Inventory.addAssignInventory = function (data) {
            return $http.post(urlBase + '/inventory/assign/add', data);
        };

        Inventory.getAssignedInventory = function(id) {
            return $http.get(urlBase + '/inventory/assign/get/'+id);
        };

        Inventory.deleteAssignedInventory = function(id) {
            return $http.get(urlBase + '/inventory/assign/delete/'+id);
        };

        return Inventory;


    }

})();