(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('StateService', StateService);  

    function StateService($http) {

        var urlBase = 'http://demo.local/api';
        var Site = {};

        Site.getStates = function (page,keyword) {
            return $http.get(urlBase+'/state/all/'+ keyword +'?page='+page);
        };

        Site.getAllStates = function () {
            return $http.get(urlBase+'/state/get_all');
        };

        Site.addState = function (data) {
            return $http.post(urlBase + '/state/add', data);
        };

        Site.getState = function(id) {
            return $http.get(urlBase + '/state/get/'+id);
        };

        Site.deleteState = function(id) {
            return $http.get(urlBase + '/state/delete/'+id);
        };

        return Site;


    }

})();