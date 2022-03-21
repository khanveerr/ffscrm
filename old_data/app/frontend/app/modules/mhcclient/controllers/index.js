angular.module('Client', []).controller('ClientController',function($scope,$rootScope,$location,$window,ClientService,CacheService) {

	$scope.clientObj = {};
	$scope.addressObj = {};
	$scope.insertObj = {};
	$scope.data == {selectedOption: 1};
	// $scope.id = {selectedOption: '_id'};
	$scope.addresses = [];
	$scope.isNewAddress = false;
	$scope.cities = {};

	CacheService.getCache({key: ['city']}).then(function(response){
      //console.log(response.data.message);
      $scope.cities = response.data.message.city;
    });

	$scope.saveClient = function() {

		$scope.clientObj = {
			firstname: $scope.firstname,
			lastname: $scope.lastname,
			primary_contact_no: $scope.primary_contact_no,
			primary_email_id: $scope.primary_email_id
		};


		// $scope.addressObj = {
		// 	address: '',
		// 	landmark: '',
		// 	city: parseInt($scope.client_city)
		// };

		$scope.insertObj = {
			clientdetails: $scope.clientObj,
			addressdetails: {}
		};



		ClientService.create($scope.insertObj).then(function(response){

			console.log(response);

			ClientService.getAllClients({'_id': response.data.message._id}).then(function(resp){

				var client = resp.data.message[0];
				//client.defaultAddress = resp.data.message[0].address_details[0];

				client.city = parseInt($scope.client_city);

				$window.localStorage.setItem("client_details", angular.toJson(client));
				$rootScope.client_details = client;
				angular.element('#add_lead_modal').closeModal();
				angular.element('#add_user_modal').closeModal();
				//angular.element('#select_address').openModal();
				$location.path('/lead/add');


			});

			// $scope.firstname = "";
			// $scope.lastname = "";
			// $scope.primary_contact_no = "";
			// $scope.primary_email_id = "";
			// $scope.address = "";
			// $scope.landmark = "";
			// $scope.client_city = "";
			// $scope.clientObj = {};
			// $scope.addressObj = {};
		});



	}

	$scope.getAllClients = function() {

		ClientService.getAllClients().then(function(client){
			$scope.clients = client.data.message;
			//console.log($scope.clients);
		});
	}

	$scope.keyValueObj = {};

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

		$scope.colObj = "firstname primary_contact_no";

		$scope.searchClientObj.keyValueObj = $scope.keyValueObj;
		$scope.searchClientObj.colObj = $scope.colObj;


		console.log($scope.searchClientObj);

		ClientService.searchClient($scope.searchClientObj).then(function(client){
			$scope.clients = client.data.message;
			//console.log(client);
		});
	}

	$scope.$watch('searchVal',function(newVal,oldVal){
		$scope.primary_contact_no = newVal;
	});

	$scope.getClientInfo = function(client){

		$scope.addresses = client.address_details;

		$window.localStorage.setItem("client_details", angular.toJson(client));
		$rootScope.client_details = client;
		angular.element('#add_lead_modal').closeModal();
		//angular.element('#select_address').openModal();

		//console.log($scope.addresses);


		//console.log(client);
		$location.path('/lead/add');
		// $scope.$apply();
		// $scope.keyValueObj = {};
		// $scope.keyValueObj['_id'] = id;

		// ClientService.getAllClients($scope.keyValueObj).then(function(client){


		// 	//$scope.clients = client.data.message;
		// 	//console.log($scope.clients);
		// });

	};

	$scope.setAddress = function(address) {
		$rootScope.client_details.defaultAddress = address;
		$window.localStorage.setItem("client_details", angular.toJson($rootScope.client_details));
		console.log($rootScope.client_details);
	}

	$scope.addNewAddress = function() {
		$scope.isNewAddress = true;
	};

	$scope.cancelAddAddress = function() {
		$scope.isNewAddress = false;
	};

	$scope.saveAddress = function() {

		$scope.clientAddress = {};

		$scope.old_address_id = [];
		$scope.client_id = $rootScope.client_details._id;
		$scope.addressObj = {
			'address': $scope.address,
			'landmark': $scope.landmark,
			'city': $scope.client_city
		};


		angular.forEach($rootScope.client_details.address_details, function(value,key){
			$scope.old_address_id.push(value._id);
		});


		$scope.clientAddress.old_address_id = $scope.old_address_id;
		$scope.clientAddress.client_id = $scope.client_id;
		$scope.clientAddress.addressObj = $scope.addressObj;


		ClientService.addClientAddress($scope.clientAddress).then(function(response){
			//$scope.clients = client.data.message;
			console.log(response);
			if(response.data.message.ok == 1) {
				//$rootScope.client_details.address_details.push($scope.addressObj);
				$scope.addresses.push(response.data.message.resp);
				$rootScope.client_details.address_details = $scope.addresses;
				$window.localStorage.setItem("client_details", angular.toJson($rootScope.client_details));
				$scope.isNewAddress = false;
			}
		});

		//$rootScope.client_details.address_details.push($scope.addressObj);

		//console.log($scope.clientAddress);
	}

	$scope.addEditLead = function() {
		angular.element('#select_address').closeModal();
		//angular.element('#select_address').openModal();
		$location.path('/lead/add');
	}

});
