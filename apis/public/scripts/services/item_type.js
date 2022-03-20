(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('ItemTypeService', ItemTypeService);  

    function ItemTypeService($http) {

        var urlBase = 'http://demo.local/api';
        var ItemType = {};

        ItemType.getItemTypes = function (page,keyword) {
            return $http.get(urlBase+'/item_type/all/'+ keyword +'?page='+page);
        };

        ItemType.addItemType = function (data) {
            return $http.post(urlBase + '/item_type/add', data);
        };

        ItemType.getItemType = function(id) {
            return $http.get(urlBase + '/item_type/get/'+id);
        };

        ItemType.deleteItemType = function(id) {
            return $http.get(urlBase + '/item_type/delete/'+id);
        };

        return ItemType;


    }

})();