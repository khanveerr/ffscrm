angular.module('LeadManagerServiceHelper', []).factory('LeadManagerService', ['$http','serverConfig', 'AuthService', function($http,serverConfig,AuthService) {

    //var base_url = "http://localhost:3000";

    return {

        get : function() {
            return $http.get(serverConfig.apiUrl + '/app/');
        },

        authenticateUser: function() {
            return $http.get(serverConfig.apiUrl + '/token');
        },

        getLeads : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/getAllLeads',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getServiceLeads : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/getAllServiceLeads',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        filterLeads : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/getFilterAllLeads',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer '+ AuthService.getToken()}
            });
        },

        groupByDate : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/groupByDate',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        groupByDateOrganic : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/groupByDateOrganic',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        groupByDatePartner : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/groupByDatePartner',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },


        groupByLeadSource : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/groupByLeadSource',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        groupByCategory : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/groupByCategory',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        groupByCancellation: function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/groupByCancellation',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        groupByLeadStage : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/groupByLeadStage',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        generateInvoice : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/generateInvoice',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getInvoiceData : function(invoice_data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.mrhomecare.net/api/public/generate/invoice',
                params: {invoice_data: invoice_data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getClientPromocode : function(client_data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.mrhomecare.net/api/public/client/promocode',
                params: {client_data: client_data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getServices : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.mrhomecare.net/api/public/service/all',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getLeadstages : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.mrhomecare.net/api/public/leadstages',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getLeadsources : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.mrhomecare.net/api/public/leadsources',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getCities : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.mrhomecare.net/api/public/cities',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getVariants : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.mrhomecare.net/api/public/variants',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getCategories : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.mrhomecare.net/api/public/category/all',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getManpowerCapacity : function(manpower_data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.mrhomecare.net/api/public/get/manpower',
                params: {manpower_data: manpower_data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        checkPromocode : function(promocode_data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'POST',
                url: 'http://engine.mrhomecare.net/api/public/check/promocode',
                data: $.param({promocode_data: promocode_data}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        sendEmail : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/sendEmail',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        sendInvoice : function(data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/lead/sendInvoice',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        sendInvoiceData : function(invoice_data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.mrhomecare.net/api/public/send/invoice',
                params: {invoice_data: invoice_data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        //getAllServicesPartner

        getAllServices : function(data) {            
            //return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/service/getAllServices',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getAllServicesOrganic : function(data) {            
            //return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/service/getAllServicesOrganic',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getAllServicesPartner : function(data) {            
            //return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/service/getAllServicesPartner',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },


        getAmcServices : function(id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/amc/getAllAMCServices/' + id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        addLead : function(leadData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/lead/addNewLead',
                data: $.param({leadData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        saveLead : function(leadData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/lead/saveLead',
                data: $.param({leadData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updateLead : function(leadData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/lead/updateLead',
                data: $.param({leadData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updateLeadInfo : function(leadData,lead_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'PUT',
                url: serverConfig.apiUrl + '/lead/updateLeadInfo/' + lead_id,
                data: $.param({leadData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },        

        deleteLead : function(leadData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/lead/deleteLead',
                data: $.param({leadData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        addService : function(serviceData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/service/addNewService',
                data: $.param({serviceData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updateServiceLeadStage : function(data) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/service/updateServiceLeadStage',
                data: $.param({data}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updateServiceInfo : function(serviceData,service_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'PUT',
                url: serverConfig.apiUrl + '/service/updateServiceInfo/' + service_id,
                data: $.param({serviceData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        deleteServiceInfo : function(service_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'DELETE',
                url: serverConfig.apiUrl + '/service/deleteServiceInfo/' + service_id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        }, 

        addAMCServices : function(amcData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
           
            return $http({
                method: 'POST',
                url: serverConfig.apiUrl + '/lead/saveLead',
                data: $.param({leadData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updateAMCServiceInfo : function(amcServiceData,amc_service_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'PUT',
                url: serverConfig.apiUrl + '/amc/updateAMCServiceInfo/' + amc_service_id,
                data: $.param({amcServiceData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updateAMCByAMCId: function(amcServiceData,amc_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'PUT',
                url: serverConfig.apiUrl + '/amc/updateAMCByAMCId/' + amc_id,
                data: $.param({amcServiceData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        deleteAMCService : function(service_id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'DELETE',
                url: serverConfig.apiUrl + '/amc/deleteAMCService/' + service_id,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getServiceAddress:  function(data) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/service/getServiceAddress/',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getVariant: function(data) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/service/getVariant/',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getServicePrice: function(data) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: serverConfig.apiUrl + '/service/getServicePrice/',
                params: {data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getClientFromLaravel: function() {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: 'http://engine.mrhomecare.net/api/public/clients',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        }
        // delete : function(id) {
        //     return $http.delete('/api/' + id);
        // }
    }       

}]);