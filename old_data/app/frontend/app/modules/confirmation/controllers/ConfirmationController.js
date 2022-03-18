angular.module('Confirmation', []).controller('ConfirmationController', function($scope,$routeParams,$route,$location,SweetAlert,ClientService,LeadManagerService) {

	var userId = $routeParams.userId;
	var serviceId = $routeParams.serviceId;

	$scope.isServiceConfirmed = false;
	$scope.isServiceCancelled = false;
	$scope.serviceConfirmed = false;
	$scope.serviceCancelled = false;

	var service = {};
	LeadManagerService.getAllServices({'_id': serviceId}).then(function(response){
		console.log(response);
		var service_count = response.data.message.length;
		service = response.data.message[0];
		if(service_count > 0) {

			if(service.service_status == 3) {
				$scope.isServiceConfirmed = true;
			} else if(service.status == -1) {
				$scope.isServiceCancelled = true;
			}

		}
	});

	$scope.confirmService = function() {

		var updateVal = {
			service_status: 3
		};

		LeadManagerService.updateServiceInfo(updateVal,serviceId).then(function(response){
            if(response.data.message.ok == 1) {
              SweetAlert.swal("Success", "Service confirmed", "success");
              $scope.serviceConfirmed = true;
            }
        });  

	};

	$scope.cancelService = function() {

		var lead_history_obj_arr = [];

		var lead_stage_new_obj = {
          lead_stage: 35,
          lead_remark: 'Cancelled Order',
          updated_on: (new Date()).toISOString(),
          updated_by: 'User'
        };


        if(service.lead_history != undefined && service.lead_history.length > 0) {
        	lead_history_obj_arr = service.lead_history;
        }
        lead_history_obj_arr.push(lead_stage_new_obj);

        var updateVal = {
          lead_history: lead_history_obj_arr,
          status: -1
        }

        LeadManagerService.updateServiceInfo(updateVal,serviceId).then(function(response){
            SweetAlert.swal("Cancelled!", "Service has been cancelled.", "success");
            $scope.serviceCancelled = true;
        });


	};


});