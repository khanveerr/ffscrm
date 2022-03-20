(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('ReqVendorService', ReqVendorService);  

    function ReqVendorService($http) {

        var urlBase = 'http://demo.local/api';
        var Vendor = {};

        Vendor.getVendors = function (page,keyword) {
            return $http.get(urlBase+'/req_vendor/all/'+ keyword +'?page='+page);
        };

        Vendor.getAllVendors = function (zone_id,type_id) {
            return $http.get(urlBase+'/req_vendor/all/'+zone_id+'/'+type_id);
        };

        Vendor.addVendor = function (data) {
            return $http.post(urlBase + '/req_vendor/add', data);
        };

        Vendor.getVendor = function(id) {
            return $http.get(urlBase + '/req_vendor/get/'+id);
        };

        Vendor.deleteVendor = function(id) {
            return $http.get(urlBase + '/req_vendor/delete/'+id);
        };

        Vendor.export = function(id) {
            return $http.get(urlBase + '/req_vendor/export_vendor_master');
        };

        return Vendor;


    }

})();