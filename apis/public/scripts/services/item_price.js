(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('ItemPriceService', ItemPriceService);  

    function ItemPriceService($http) {

        var urlBase = 'http://demo.local/api';
        var Item = {};

        Item.getItemPrices = function (item_id) {
            return $http.get(urlBase+'/item_price/all/'+item_id);
        };

        Item.addItemPrice = function (data) {
            return $http.post(urlBase + '/item_price/add', data);
        };

        Item.getItemPrice = function(id) {
            return $http.get(urlBase + '/item_price/get/'+id);
        };

        Item.deleteItemPrice = function(id) {
            return $http.get(urlBase + '/item_price/delete/'+id);
        };

        return Item;


    }

})();