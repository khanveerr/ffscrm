(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('ZoneService', ZoneService);  

    function ZoneService($http) {

        var urlBase = 'http://demo.local/api';
        var Zone = {};

        Zone.getZones = function (page,keyword) {
            return $http.get(urlBase+'/zone/all/'+ keyword +'?page='+page);
        };

        Zone.addZone = function (data) {
            return $http.post(urlBase + '/zone/add', data);
        };

        Zone.getZone = function(id) {
            return $http.get(urlBase + '/zone/get/'+id);
        };

        Zone.deleteZone = function(id) {
            return $http.get(urlBase + '/zone/delete/'+id);
        };

        return Zone;


    }

})();