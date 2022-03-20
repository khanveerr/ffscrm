(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('QuoteService', QuoteService);  

    function QuoteService($http) {

        var urlBase = 'http://demo.local/api';
        var Brand = {};

        Brand.getQuotes = function (page) {
            return $http.get(urlBase+'/quote/all?page='+page);
        };

        Brand.addQuote = function (data) {
            return $http.post(urlBase + '/quote/add', data);
        };

        Brand.getQuote = function(id) {
            return $http.get(urlBase + '/quote/get/'+id);
        };

        Brand.deleteQuote = function(id) {
            return $http.get(urlBase + '/quote/delete/'+id);
        };

        return Brand;


    }

})();