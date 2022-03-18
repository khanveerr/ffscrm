angular.module('ServiceHelper', []).factory('SMSService', ['$http','serverConfig', function($http,serverConfig) {

    //var base_url = "http://localhost:3000";

    return {

        get : function() {
            return $http.get(serverConfig.apiUrl + '/app/');
        },
        
        sendSMS : function(mobile,message) {
            return $http({
                method: 'POST',
                url: 'http://engine.mrhomecare.net/send_sms.php',
                data: $.param({ mobile: mobile, msg: message }),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        }

    }       

}]);