(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('ModelNoService', ModelNoService);  

    function ModelNoService($http) {

        var urlBase = 'http://demo.local/api';
        var ModelNo = {};

        ModelNo.getModelNos = function (page) {
            return $http.get(urlBase+'/model_no/all?page='+page);
        };

        ModelNo.addModelNo = function (data) {
            return $http.post(urlBase + '/model_no/add', data);
        };

        ModelNo.getModelNo = function(id) {
            return $http.get(urlBase + '/model_no/get/'+id);
        };

        ModelNo.deleteModelNo = function(id) {
            return $http.get(urlBase + '/model_no/delete/'+id);
        };

        return ModelNo;


    }

})();