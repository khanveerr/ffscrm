angular.module('Inspection', []).controller('InspectionController', function($scope,$rootScope,$window,LeadManagerService,$timeout,$routeParams,$route,$location,ClientService,CacheService,OrderService,InspectionService,SweetAlert,$filter) {

	$scope.clients = {};
	$scope.keyValueObj = {};
	$scope.isNewAddress = false;
	$scope.cities = {};
	var selected_client = {};
	var selected_address = {};
	$scope.manpower_deployment_arr = [];
	$scope.inspections = [];
	$scope.inspection_details = {};
	var selected_inspection = {};
	var selected_inspection_id = 0;
	var selected_inspection_index = 0;
	$scope.isUpdateInspection = false;

	CacheService.getCache({key: ['city']}).then(function(response){
      $scope.cities = response.data.message.city;
    });

    if($route.current.action == 'all') {
    	InspectionService.getInspections({}).then(function(response) {
	    	$scope.inspections = response.data.message;
	    	console.log(response.data.message);
	    });
    } else if($route.current.action == 'open') {
    	InspectionService.getInspections({status: 0}).then(function(response) {
	    	$scope.inspections = response.data.message;
	    	console.log(response.data.message);
	    });
    	InspectionService.getInspections({}).then(function(res) {
	    	$scope.all_inspections = res.data.message;
	    	//console.log(response.data.message);
	    });
    } else if($route.current.action == 'closed') {
    	InspectionService.getInspections({status: 1}).then(function(response) {
	    	$scope.inspections = response.data.message;
	    	console.log(response.data.message);
	    });
    }

    

	$scope.searchClient = function() {

		var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var mobilePattern = /^\d+$/;
		
		if(emailPattern.test($scope.searchVal)) {
			$scope.keyValueObj = {};
			$scope.keyValueObj.primary_contact_no = "";
			$scope.keyValueObj.firstname = "";
			$scope.keyValueObj.primary_email_id = $scope.searchVal;
		} else if(mobilePattern.test($scope.searchVal)) {
			$scope.keyValueObj = {};
			$scope.keyValueObj.firstname = "";
			$scope.keyValueObj.primary_email_id = "";
			$scope.keyValueObj.primary_contact_no = $scope.searchVal;
		} else {
			$scope.keyValueObj = {};
			$scope.keyValueObj.primary_contact_no = "";
			$scope.keyValueObj.primary_email_id = "";
			$scope.keyValueObj.firstname = $scope.searchVal;
		}

		if($scope.keyValueObj.firstname == "") {
			delete $scope.keyValueObj.firstname;
		}
		
		if($scope.keyValueObj.primary_email_id == "") {
			delete $scope.keyValueObj.primary_email_id;
		}
		
		if($scope.keyValueObj.primary_contact_no == "") {
			delete $scope.keyValueObj.primary_contact_no;
		}
		
		$scope.colObj = {};
		$scope.searchClientObj = {};
		//$scope.keyValueObj.primary_contact_no = $scope.searchVal;

		$scope.colObj = "firstname";

		$scope.searchClientObj.keyValueObj = $scope.keyValueObj;
		$scope.searchClientObj.colObj = $scope.colObj;


		console.log($scope.searchClientObj);

		ClientService.searchClient($scope.searchClientObj).then(function(client){
			$scope.clients = client.data.message;
			//console.log(client);
		});
	};

	$scope.setAddress = function(address) {
		selected_address = address;
		
		angular.element('#select_address').closeModal();
		angular.element('#add_inspection_modal').openModal();


	};

	$scope.saveAddress = function() {

		$scope.clientAddress = {};

		$scope.old_address_id = [];
		$scope.client_id = selected_client._id;
		$scope.addressObj = {
			'address': $scope.address,
			'landmark': $scope.landmark,
			'city': $scope.client_city
		};


		angular.forEach(selected_client.address_details, function(value,key){
			$scope.old_address_id.push(value._id);
		});


		$scope.clientAddress.old_address_id = $scope.old_address_id;
		$scope.clientAddress.client_id = $scope.client_id;
		$scope.clientAddress.addressObj = $scope.addressObj;


		ClientService.addClientAddress($scope.clientAddress).then(function(response){
			if(response.data.message.ok == 1) {
				$scope.addresses.push(response.data.message.resp);
				selected_client.address_details = $scope.addresses;
				$scope.isNewAddress = false;
			}
		});

	};

	$scope.addDeployment = function() {

		var md_obj = {};

		md_obj = {
			service: $scope.service,
			manpower_deployment: $scope.manpower_deployment,
			comments: $scope.comments
		};

		$scope.manpower_deployment_arr.push(md_obj);

		$scope.service = "";
		$scope.manpower_deployment = "";
		$scope.comments = "";


	};

	$scope.removeDP = function(index){
		if($scope.manpower_deployment_arr.length > 0 ) {
			$scope.manpower_deployment_arr.splice(index,1);
		}
	};

	$scope.saveInspection = function() {

		var inspectionData = {
			client_details: selected_client._id,
			address_details: selected_address._id,
			inspector_name: $scope.inspector_name,
			inspector_contact: $scope.inspector_contact,
			variant_type: $scope.variant_type,
			additional_variant: $scope.additional_variant,
			site_type: $scope.site_type,
			site_condition: $scope.site_condition,
			deployment_particulars: $scope.manpower_deployment_arr,
			customer_notes: $scope.customer_notes,
			reason_additional_manpower: $scope.reason_additional_manpower 
		};

		InspectionService.addInspection(inspectionData).then(function(response){
			SweetAlert.swal("Inspection Report Added!", "Inspection report", "success");
			angular.element('#add_inspection_modal').closeModal();
		});

	};

	$scope.editInspection = function(inspection,index) {

		selected_inspection = inspection;
		selected_inspection_id = inspection._id;
		selected_inspection_index = index;
		$scope.isUpdateInspection = true;

		$scope.inspector_name = inspection.inspector_name;
		$scope.inspector_contact = inspection.inspector_contact;
		$scope.variant_type = inspection.variant_type;
		$scope.additional_variant = inspection.additional_variant;
		$scope.site_type = inspection.site_type;
		$scope.site_condition = inspection.site_condition;
		$scope.manpower_deployment_arr = inspection.deployment_particulars;
		$scope.customer_notes = inspection.customer_notes;
		$scope.reason_additional_manpower = inspection.reason_additional_manpower;

		angular.element('#add_inspection_modal').openModal();



	};


	$scope.updateInspection = function() {

		var inspectionData = {
			inspector_name: $scope.inspector_name,
			inspector_contact: $scope.inspector_contact,
			variant_type: $scope.variant_type,
			additional_variant: $scope.additional_variant,
			site_type: $scope.site_type,
			site_condition: $scope.site_condition,
			deployment_particulars: $scope.manpower_deployment_arr,
			customer_notes: $scope.customer_notes,
			reason_additional_manpower: $scope.reason_additional_manpower 
		};

		InspectionService.updateInspection(inspectionData,selected_inspection_id).then(function(response){
			if(response.data.message.ok == 1) {

				SweetAlert.swal("Success!", "Inspection report updated", "success");
				
				InspectionService.getInspections().then(function(response) {
			    	$scope.inspections = response.data.message;
			    	//console.log(response.data.message);
			    });

				angular.element('#add_inspection_modal').closeModal();
			}
		});

	};

	$scope.updateInspectionStatus = function(inspection_id,status,index){

		var updateVal = {
			status: status
		};
		
		InspectionService.updateInspection(updateVal,inspection_id).then(function(response){
			if(response.data.message.ok == 1) {

				SweetAlert.swal("Success!", "Inspection status updated", "success");
				
				InspectionService.getInspections().then(function(response) {
			    	$scope.inspections = response.data.message;
			    	//console.log(response.data.message);
			    });
			}
		});		

	};

	$scope.getClientInfo = function(client){

		console.log(client);
		selected_client = client;

		$scope.addresses = client.address_details;

		angular.element('#add_lead_modal').closeModal();
		angular.element('#select_address').openModal();

	};


	$scope.addNewAddress = function() {
		$scope.isNewAddress = true;
	};

	$scope.cancelAddAddress = function() {
		$scope.isNewAddress = false;
	};

	$scope.showFullReport = function(index) {

		$scope.inspection_details = $scope.inspections[index];

	}

	$scope.saveClient = function() {

		$scope.clientObj = {
			firstname: $scope.firstname,
			lastname: $scope.lastname,
			primary_contact_no: $scope.primary_contact_no,
			primary_email_id: $scope.primary_email_id
		};

		$scope.addressObj = {
			address: $scope.address,
			landmark: $scope.landmark,
			city: parseInt($scope.client_city)
		};

		$scope.insertObj = {
			clientdetails: $scope.clientObj,
			addressdetails: $scope.addressObj
		};


		ClientService.create($scope.insertObj).then(function(response){

			console.log(response);

			ClientService.getAllClients({'_id': response.data.message._id}).then(function(resp){

				selected_client = resp.data.message[0];
				selected_address = resp.data.message[0].address_details[0];

				angular.element('#add_lead_modal').closeModal();
				angular.element('#add_user_modal').closeModal();
				angular.element('#add_inspection_modal').openModal();


			});

		});



	};

	$scope.$watch('searchVal',function(newVal,oldVal){
		$scope.primary_contact_no = newVal;
	});


});