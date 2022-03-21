angular.module('Login', []).controller('LoginController', function($scope,$routeParams,$route,$window,$location,AuthService,$timeout) {

	$scope.email = "";
	$scope.password = "";
	$scope.is_reset_link_sent = false;
	$scope.is_new_password_set = false;

	$scope.userId = $routeParams.userId;

	$scope.authenticateUser = function() {

		var credentials = {
			'email': $scope.email,
			'password': $scope.password
		};

		console.log(credentials);


		AuthService
			.login(credentials)
			.error(function(err){
				var status = err.message.status;
				if(status == 401) {
					alert(err.message.info.message);
				}

				if(status == 404) {
					alert(err.message.error.message);
				}

			})
			.then(function(){
				//alert("success");
				//$location.path('/leads');
				var currentUser = AuthService.currentUser();

				if(currentUser.role == "view") {
					$window.location.href = '/leads';	
				} else if(currentUser.role == "operations") {
					$window.location.href = '/orders';	
				} else {
					$window.location.href = '/leads';
				}
			});


	};


	$scope.resetUser = function() {

		$scope.is_reset_link_sent = true;

		console.log($scope.email);
		if($scope.email != undefined && $scope.email != null && $scope.email != "") {

			AuthService.sendResetLink($scope.email).then(function(response){
				$scope.is_reset_link_sent = false;
				//Materialize.toast('Please check your email. Password reset link has been sent to your registered email id.', 4000);
				Materialize.toast(response.data.message, 4000);
			}, function(error) {

				//console.log(error);
				//error.data.message
				Materialize.toast(error.data.message, 4000);

			});


		}

	};


	$scope.setNewPassword = function() {

		console.log($scope.userId);
		console.log($scope.password);

		var data = {};

		data.id = $scope.userId;
		data.password = $scope.password;

		var toast_content = '';
		$scope.is_new_password_set = true;

		AuthService.setPassword(data).then(function(response){

			console.log(response.data.message.status);
			$scope.is_new_password_set = false;
			if(response.data.message.status == 200) {
				//SweetAlert.swal("Success!", 'Password reset successfull.', "success");
				Materialize.toast('Password reset successfull.', 4000);
				$timeout(function(){
					$window.location.href = '/login';
				},4000);
			} else {
				//SweetAlert.swal("Error!", 'Password cannot be reset', "success");
				Materialize.toast('Password reset failed.', 4000);
				// $timeout(function(){
				// 	$window.location.href = '/login';
				// },4000);
			}

		});

	};


});