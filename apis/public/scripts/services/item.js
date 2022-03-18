(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('ItemService', ItemService);  

    function ItemService($http) {

        var urlBase = 'http://demo.local/api';
        var Item = {};

        Item.getItems = function (page,keyword,zone_id,type_id) {
            return $http.get(urlBase+'/item/all/'+zone_id+'/'+type_id + '/' + keyword +'?page='+page);
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