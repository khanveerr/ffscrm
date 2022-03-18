(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('ItemMasterService', ItemMasterService);  

    function ItemMasterService($http) {

        var urlBase = 'http://demo.local/api';
        var Item = {};

        Item.getItems = function (page) {
            return $http.get(urlBase+'/items/all');
        };

        Item.addItem = function (data) {
            return $http.post(urlBase + '/item/add', data);
        };

        Item.getItem = function(id) {
            return $http.get(urlBase + '/item/get/'+id);
        };

        Item.deleteItem = function(id) {
            return $http.get(urlBase + '/item/delete/'+id);
        };

        return Item;


    }

})();