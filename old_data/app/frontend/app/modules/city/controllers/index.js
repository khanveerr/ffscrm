angular.module('City', []).controller('CityController', function($scope,$rootScope,$window,CityService,$timeout,$routeParams,$route,$location,CacheService,SweetAlert,$filter,AuthService) {

	$scope.cities = [];
	$scope.currentUser = AuthService.currentUser();
	$scope.city_id = '';


	CityService.getCitiesAll({}).then(function(response){
		if(response.data != undefined && response.data != null) {
			var data = response.data.result;			
			$scope.cities = data;
		}
		//console.log(response.data.result);
	});

	$scope.show_add_city_form = function() {

		angular.element('#add_city').openModal();
		$scope.city = '';

	};


	$scope.addCity = function() {
		
		if($scope.city != undefined && $scope.city != null && $scope.city != "") {

			var data = {};
			data.name = $scope.city;

			CityService.addCity(data).then(function(response){
				SweetAlert.swal("Success!", response.data.message, "success");

				$scope.cities = [];
				CityService.getCities({}).then(function(response){
					if(response.data != undefined && response.data != null) {
						var data = response.data.result;			
						$scope.cities = data;

						angular.element('#add_city').closeModal();
					}
					//console.log(response.data.result);
				});

			});

		} else {

			SweetAlert.swal("Error!", 'Please enter city name', "error");

		}

	};

	$scope.show_edit_form = function(city) {

		console.log(city);

		$scope.city_id = city._id;
		$scope.city = city.name;
		$scope.status = city.status;
		$scope.status_name = city.status_name;
		angular.element('#edit_city').openModal();

	};

	$scope.change_status = function(status){

		$scope.status = status;
		$scope.status_name = status == 0 ? 'Active' : 'Inactive';
		
	};


	$scope.updateCity = function() {


		if($scope.city != undefined && $scope.city != null && $scope.city != "") {

			var data = {};
			data.id = $scope.city_id;
			data.name = $scope.city;
			data.status = parseInt($scope.status);

			CityService.updateCity(data).then(function(response){
				
				SweetAlert.swal("Success!", response.data.message, "success");

				$scope.cities = [];
				CityService.getCities({}).then(function(response){
					if(response.data != undefined && response.data != null) {
						var data = response.data.result;			
						$scope.cities = data;

						angular.element('#edit_city').closeModal();
					}
					//console.log(response.data.result);
				});

			});

		} else {

			SweetAlert.swal("Error!", 'Please enter city name', "error");

		}

	};

	$scope.deleteCity = function(id) {

		SweetAlert.swal({
          title: "Do you really want to delete this city?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },  function(isConfirm){

          if(isConfirm) {

            CityService.deleteCity(id).then(function(res){
              
              SweetAlert.swal("Success!", res.data.message, "success");

              	$scope.cities = [];
				CityService.getCities({}).then(function(response){
					if(response.data != undefined && response.data != null) {
						var data = response.data.result;			
						$scope.cities = data;

						//angular.element('#edit_city').closeModal();
					}
					//console.log(response.data.result);
				});


            }, function(error) {
              //alert(error.message);
              SweetAlert.swal("Error!", error.data.message, "error");
            });

          }

      });

	};


});