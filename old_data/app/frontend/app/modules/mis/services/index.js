angular.module('MISServiceHelper', []).factory('MISService', ['$http','serverConfig', function($http,serverConfig) {

    //var base_url = "http://localhost:3000";

    return {

        get : function() {
            return $http.get(serverConfig.apiUrl + '/app/');
        },

        addFeedback : function(feedbackData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/client/addNewFeedback',
                data: $.param({feedbackData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        }

    }       

}]);