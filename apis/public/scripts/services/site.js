(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('SiteService', SiteService);  

    function SiteService($http) {

        var urlBase = 'http://demo.local/api';
        var Site = {};

        Site.getSites = function (page,keyword) {
            return $http.get(urlBase+'/site/all/'+ keyword +'?page='+page);
        };

        Site.getAllSites = function () {
            return $http.get(urlBase+'/site/get_all');
        };

        Site.getSiteStates = function () {
            return $http.get(urlBase+'/site/states');
        };

        Site.addSite = function (data) {
            return $http.post(urlBase + '/site/add', data);
        };

        Site.getSite = function(id) {
            return $http.get(urlBase + '/site/get/'+id);
        };

        Site.deleteSite = function(id) {
            return $http.get(urlBase + '/site/delete/'+id);
        };

        return Site;


    }

})();