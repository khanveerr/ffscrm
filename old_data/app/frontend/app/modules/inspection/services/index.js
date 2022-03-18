angular.module('InspectionServiceHelper', []).factory('InspectionService', ['$http','serverConfig', function($http,serverConfig) {

    //var base_url = "http://localhost:3000";

    return {

        get : function() {
            return $http.get(serverConfig.apiUrl + '/app/');
        },

        getInspections : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/inspection/getAllInspections',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        addInspection : function(inspectionData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/inspection/addNewInspection',
                data: $.param({inspectionData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updateInspection : function(inspectionData,inspection_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'PUT',
                url: serverConfig.apiUrl + '/inspection/updateInspection/' + inspection_id,
                data: $.param({inspectionData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

    }       

}]);