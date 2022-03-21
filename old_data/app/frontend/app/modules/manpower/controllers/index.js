angular.module('Manpower', []).controller('ManpowerController', function($scope,$rootScope,$window,ManpowerService,$timeout,$routeParams,$route,$location,CacheService,SweetAlert,$filter,AuthService) {

	$scope.manpowers = [];
	$scope.m_manpower = "";
	$scope.b_manpower = "";
	$scope.d_manpower = "";


	$scope.currentUser = AuthService.currentUser();
	//$scope.getAllManpower = function() {

	ManpowerService.getManpower({}).then(function(response){

		if(response.data.message != undefined) {

			var manpower_data_count = response.data.message.length;

			if(manpower_data_count > 0) {
				$scope.manpowers = response.data.message
				console.log(response);
			}

		}
	});

	//};

	$scope.addManpower = function() {

		var manpower_details = [];
		var from_date = "";
		var flag = 0;
		var manpower_doc_arr = [];


		if((($scope.m_manpower != "") || ($scope.b_manpower != "") || ($scope.d_manpower != "") ) && ($scope.from_date != "" || $scope.to_date != "")) {

			if($scope.m_manpower != "") {
				manpower_details.push({city_id: 1, no_of_manpower: parseInt($scope.m_manpower)});
			} else {
				manpower_details.push({city_id: 1, no_of_manpower: 0});
			}

			if($scope.b_manpower != "") {
				manpower_details.push({city_id: 2, no_of_manpower: parseInt($scope.b_manpower)});
			} else {
				manpower_details.push({city_id: 2, no_of_manpower: 0});
			}

			if($scope.d_manpower != "") {
				manpower_details.push({city_id: 3, no_of_manpower: parseInt($scope.d_manpower)});
			} else {
				manpower_details.push({city_id: 3, no_of_manpower: 0});
			}

			//console.log(manpower_details);

			if(($scope.from_date != "" && $scope.from_date != undefined) && ($scope.to_date != "" && $scope.to_date != undefined)) {

				console.log("1");
				console.log($scope.from_date);
				console.log($scope.to_date);

				var startDate = moment($scope.from_date,'YYYY-MM-DD');
				var endDate = moment($scope.to_date,'YYYY-MM-DD');

				var no_of_days = endDate.diff(startDate, 'days');

				for (var i = 0; i <= no_of_days; i++) {

				    var temp_date = moment($scope.from_date,'YYYY-MM-DD');

				    manpower_doc_arr.push({
				    	'service_date': (new Date(temp_date.add(i, 'days'))).toISOString(),
				    	'manpower_details': manpower_details
				    });

				}



			} else {

				console.log("2");

				manpower_doc_arr.push({
		        	'service_date': (new Date($scope.from_date + ' 00:00:00')).toISOString(),
		        	'manpower_details': manpower_details
		        });

			}

			console.log(manpower_doc_arr);


			for (var i = 0; i < manpower_doc_arr.length; i++) {
				
				ManpowerService.addManpower(manpower_doc_arr[i]).then(function(response){
					console.log(response);
				});

			};

			$route.reload();


		} else {

			SweetAlert.swal("Error!", "Manpower value required", "error");

		}

	};


	$scope.updateManpower = function(manpower_no_index,manpower_value,manpower_obj) {

		if(manpower_value != "" && manpower_value != undefined && manpower_value != null) {

			var new_manpower_obj = {};
			var manpower_details_obj = {};

			manpower_details_obj = manpower_obj.manpower_details;
			manpower_details_obj[manpower_no_index].no_of_manpower = parseInt(manpower_value);

			var updateVal = {};

			updateVal = {
				manpower_details: manpower_details_obj
			};

			ManpowerService.updateManpower(updateVal,manpower_obj._id).then(function(response){
				console.log(response);
			});

		}

	};

	$scope.searchManpower = function() {

		var keyValueArr = {};

		if(($scope.from_date != "" && $scope.from_date != undefined) && ($scope.to_date != "" && $scope.to_date != undefined)) {

			var startDate = (new Date(moment($scope.from_date,'YYYY-MM-DD'))).toISOString();
			var endDate = (new Date(moment($scope.to_date,'YYYY-MM-DD'))).toISOString();

			keyValueArr['service_date'] = { $gte: startDate, $lte: endDate }

		} else {

			var startDate = (new Date($scope.from_date + ' 00:00:00')).toISOString();

			keyValueArr['service_date'] = startDate;

		}

		console.log(keyValueArr);
		
		ManpowerService.getManpower(keyValueArr).then(function(response){
			var manpower_data_count = response.data.message.length;

			$scope.manpowers = [];

			if(manpower_data_count > 0) {
				$scope.manpowers = response.data.message
				console.log(response);
			}
		});		

	};

});