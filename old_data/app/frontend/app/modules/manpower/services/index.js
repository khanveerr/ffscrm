angular.module('ManpowerServiceHelper', []).factory('ManpowerService', ['$http','serverConfig', function($http,serverConfig) {

    //var base_url = "http://localhost:3000";

    return {

        get : function() {
            return $http.get(serverConfig.apiUrl + '/app/');
        },

        getManpower : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/manpower/getAllManpower',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        addManpower : function(manpowerData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/manpower/addNewManpower',
                data: $.param({manpowerData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updateManpower : function(manpowerData,manpower_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'PUT',
                url: serverConfig.apiUrl + '/manpower/updateManpower/' + manpower_id,
                data: $.param({manpowerData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        deleteManpower : function(manpower_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'DELETE',
                url: serverConfig.apiUrl + '/manpower/deleteManpower/' + manpower_id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

    }       

}]);