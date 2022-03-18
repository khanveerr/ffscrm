angular.module('LeadServiceHelper', []).factory('LeadService', ['$http','serverConfig', 'AuthService', function($http,serverConfig,AuthService) {

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
                url: 'http://engine.silagroup.co.in/api/public/generate/invoice',
                params: {invoice_data: invoice_data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getClientPromocode : function(client_data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/client/promocode',
                params: {client_data: client_data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getServices : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/service/all',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getLeadstages : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/leadstages',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getLeadsources : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/leadsources',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getCities : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/cities',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getVariants : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/variants',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getCategories : function() {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/category/all',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        getManpowerCapacity : function(manpower_data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/get/manpower',
                params: {manpower_data: manpower_data},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        },

        checkPromocode : function(promocode_data) {
            // return $http.get('http://localhost:3000/client/getAllClient');
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/check/promocode',
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

        //deleteLeadData

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
                url: 'http://engine.silagroup.co.in/api/public/clients',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getAllUsers: function() {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/get_users',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getAllTargets: function() {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/target/get',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getAllTargetHits: function(data) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/target_hits/get',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        //users
        getAllAchievedTargets: function() {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/spoc/achieved/target',
                params: {},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        saveLeadData : function(leadData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/lead/save',
                data: $.param({leadData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        saveLeadComment : function(leadData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/lead/save_comment',
                data: $.param({leadData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        saveBDTarget : function(targetData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/target/save',
                data: $.param({targetData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        saveTargetHit : function(targetData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/target_hit/save',
                data: $.param({targetData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        saveBDAchieveTarget : function(targetData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/achieve_target/save',
                data: $.param({targetData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        changeStatus: function(status) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/lead/save',
                data: $.param({leadData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        updateStatus: function(data) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/lead/status/update',
                data: $.param({data}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        setReminder: function(leadData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/lead/update_reminder',
                data: $.param({leadData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        setContractReminder: function(leadData) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/lead/update_contract_renewal_reminder',
                data: $.param({leadData}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getLeadDetail: function(id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/get',
                params: { id: id },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getLeadComments: function(id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/all_comments',
                params: { id: id },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getTargetHitDetail: function(id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/target_hit_details/get',
                params: { id: id },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getAllLeads: function(data) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/get_leads',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getKaps: function(data) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/get_kap_by_country',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        getOpenLeads: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/dashboard/leads/open',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

        getReminderLeads: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/dashboard/leads/reminder',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

        getWonLeads: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/dashboard/won_leads',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },


        getNewLeads: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/dashboard/leads/new',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

        getLeadSPOCMis: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/mis/spoc',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

        getTargetHitSPOCMis: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/mis/c3_value/get',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

        getNewExistingSPOCMis: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/mis/spoc/new_existing',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

        getLeadDatabaseSPOCMis: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/mis/spoc/lead_database',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

        getLeadCInfoMis: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/mis/spoc/cvalue',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

         getLeadSPOCStageMis: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/mis/spoc/stagewise',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },


        getLeadSCityMis: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/mis/city',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },


        getLeadIndustryMis: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/mis/industry',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

        getLeadSalesStageMis: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/mis/sales_stage',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

        getLostLeadMis: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/mis/reason',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

        exportLead: function(data) {

            return $http({
                method: 'GET',
                url: 'http://engine.silagroup.co.in/api/public/lead/export',
                params: data,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

        },

        deleteLeadData : function(id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/lead/delete',
                data: $.param({id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        deleteTargetHitData : function(id) {
            //return $http.post('http://localhost:3000/client/addNewClient', clientData);
            return $http({
                method: 'POST',
                url: 'http://engine.silagroup.co.in/api/public/target_hit/delete',
                data: $.param({id}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            
        },

        // delete : function(id) {
        //     return $http.delete('/api/' + id);
        // }
    }       

}]);