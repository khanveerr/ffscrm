angular.module('CityServiceHelper', []).factory('CityService', ['$http','serverConfig', function($http,serverConfig) {

    var base_url = "http://engine.silagroup.co.in/api/public";

    return {

        get : function() {
            return $http.get(serverConfig.apiUrl + '/app/');
        },

        getCities : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: base_url + '/city/all',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getCitiesAll : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: base_url + '/city/get_cities',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        addCity : function(cityData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: base_url + '/city/add',
                data: $.param({cityData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updateCity : function(cityData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'PUT',
                url: base_url + '/city/update',
                data: $.param({cityData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        deleteCity : function(city_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'DELETE',
                url: base_url + '/city/delete/' + city_id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

    }       

}]);