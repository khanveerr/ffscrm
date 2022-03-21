angular.module('Register', []).controller('RegisterController', function($scope,$routeParams,$route,$window,$location,AuthService) {

	$scope.email = "";
	$scope.password = "";
	$scope.name = "";
	$scope.role = "";
	$scope.city = "";

	$scope.registerUser = function() {

		var userData = {
			'name': $scope.uname,
			'email': $scope.email,
			'password': $scope.password,
			'role': $scope.role,
			'city': parseInt($scope.city)
		};

		AuthService
			.register(userData)
			.error(function(err){
				alert(err);
			})
			.then(function(){
				resetForm();
				alert("User registered");
			});




	};


	function resetForm() {
		$scope.uname = "";
		$scope.email = "";
		$scope.role = "";
		$scope.password = "";
		$scope.cpassword = "";
		$scope.city = "";
	}

});