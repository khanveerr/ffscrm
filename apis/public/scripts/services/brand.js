(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('BrandService', BrandService);  

    function BrandService($http) {

        var urlBase = 'http://demo.local/api';
        var Brand = {};

        Brand.getBrands = function (page) {
            return $http.get(urlBase+'/brand/all?page='+page);
        };

        Brand.addBrand = function (data) {
            return $http.post(urlBase + '/brand/add', data);
        };

        Brand.getBrand = function(id) {
            return $http.get(urlBase + '/brand/get/'+id);
        };

        Brand.deleteBrand = function(id) {
            return $http.get(urlBase + '/brand/delete/'+id);
        };

        return Brand;


    }

})();