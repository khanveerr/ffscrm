angular.module('CacheServiceHelper', []).factory('CacheService', ['$http', function($http) {

    var base_url = "http://crm.mrhomecare.net";

    return {

        get : function() {
            return $http.get(base_url + '/app/');
        },

        getCache : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: base_url + '/cache/get',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        }

        // delete : function(id) {
        //     return $http.delete('/api/' + id);
        // }
    }       

}]);