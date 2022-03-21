angular.module('AccountServiceHelper', []).factory('AccountService', ['$http','serverConfig', function($http,serverConfig) {

    //var base_url = "http://localhost:3000";

    return {

        getAllOrders : function(data) {            
            //return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/order/getAllOrders',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        filterAllOrders : function(data) {            
            //return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/order/filterAllOrders',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        exportMaster: function(data) {
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/exportMaster',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },   

        exportCancelledOrder: function(data) {
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/exportCancelledOrder',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },   

        exportAllInvoice: function(data) {
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/exportAll',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },   

        exportClientInvoice: function(data) {
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/export',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },   

        exportPartnerInvoice: function(data) {
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/exportPartner',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },   

        exportOutstanding: function(data) {
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/exportOutstanding',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        latestAmcOrders : function(data) {            
            //return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/order/latestAmcOrders',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },        

        insertOrder : function(orderData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/order/insertOrder',
                data: $.param({orderData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updatedOrder : function(orderData,order_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'PUT',
                url: serverConfig.apiUrl + '/order/updatedOrder/' + order_id,
                data: $.param({orderData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updatedLeadOrder : function(orderData,service_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'PUT',
                url: serverConfig.apiUrl + '/order/updatedLeadOrder/' + service_id,
                data: $.param({orderData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },


    }       

}]);