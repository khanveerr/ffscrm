(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('VendorService', VendorService);  

    function VendorService($http) {

        var urlBase = 'http://demo.local/api';
        var Vendor = {};

        Vendor.getVendors = function (page) {
            return $http.get(urlBase+'/vendor/all?page='+page);
        };

        Vendor.addVendor = function (data) {
            return $http.post(urlBase + '/vendor/add', data);
        };

        Vendor.getVendor = function(id) {
            return $http.get(urlBase + '/vendor/get/'+id);
        };

        Vendor.deleteVendor = function(id) {
            return $http.get(urlBase + '/vendor/delete/'+id);
        };

        return Vendor;


    }

})();