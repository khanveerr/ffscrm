angular.module('ClientServiceHelper', []).factory('ClientService', ['$http','serverConfig', function($http,serverConfig) {

    //var base_url = "http://localhost:3000";

    return {

        get : function() {
            return $http.get(serverConfig.apiUrl + '/app/');
        },

        getAllClients : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/client/getAllClient',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        searchClient : function(data) {            
            //return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/client/searchClient',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        addClientAddress : function(clientAddressData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/client/addClientAddress',
                data: $.param({clientAddressData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
         },

        updateClientInfo : function(clientContactData,client_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'PUT',
                url: serverConfig.apiUrl + '/client/updateClientInfo/'+client_id,
                data: $.param({clientContactData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
         },

         updateAddressInfo : function(clientAddressData,address_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'PUT',
                url: serverConfig.apiUrl + '/client/updateAddressInfo/'+address_id,
                data: $.param({clientAddressData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
         },


        create : function(clientData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/client/addNewClient',
                data: $.param({clientData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        }

        // delete : function(id) {
        //     return $http.delete('/api/' + id);
        // }
    }       

}]);