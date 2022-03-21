angular.module('FeedbackServiceHelper', []).factory('FeedbackService', ['$http','serverConfig', function($http,serverConfig) {

    //var base_url = "http://localhost:3000";

    return {

        get : function() {
            return $http.get(serverConfig.apiUrl + '/app/');
        },

        getFeedback : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/client/getAllFeedback',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
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