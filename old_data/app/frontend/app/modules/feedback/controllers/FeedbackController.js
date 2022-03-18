angular.module('Feedback', []).controller('FeedbackController', function($scope,$routeParams,$route,$location,SweetAlert,ClientService,FeedbackService) {

	$scope.orderId = $routeParams.orderId;
	var userId = $routeParams.userId;
	$scope.rating = 1;
	$scope.showFeedbackForm = true;
	$scope.isFeedbackGiven = false;

	var rateObj = {
		quality_service: 0,
    	punctuality:  0,
    	grooming:  0,
    	detail_attention:  0,
    	product_knowledge:  0,
    	communication_coordination:  0 
    };

    FeedbackService.getFeedback({'client_details': userId,'order_details': $scope.orderId}).then(function(response){
    	var feedback_count = response.data.message.length;
    	console.log(feedback_count);
    	if(feedback_count > 0) {
    		$scope.showFeedbackForm = false;
    	}
    });

  
	$scope.submitFeedback = function() {

		var filterData = {};
		var client_count = 0;

		filterData['_id'] = userId;

		ClientService.getAllClients(filterData).then(function(client){
			client_count = client.data.message.length;

			if(client_count > 0) {

				rateObj.client_details = userId;
				rateObj.order_details = $scope.orderId;
				rateObj.additional_feedback = $scope.client_feedback;
				rateObj.rating = $scope.rating;

				console.log(rateObj);

				FeedbackService.addFeedback(rateObj).then(function(response){
					console.log(response);
					$scope.isFeedbackGiven = true;
					SweetAlert.swal("Success", "Feedback submitted.", "success");
				});

			} else {
				SweetAlert.swal("Failed", "Invalid user", "error");	
			}

		});



	};

// function resetForm() {
// 	$scope.serviceQuality = false;
// 	$scope.punctuality = false;
// 	$scope.grooming = false;
// 	$scope.detailAttention = false;
// 	$scope.productKnowledge = false;

// }

$scope.setServiceQuality = function(val) {

	if(val == true) {
		rateObj.quality_service = 1;
	} else {
		rateObj.quality_service = 0;
	}

};

$scope.setPunctuality = function(val) {

	if(val == true) {
		rateObj.punctuality = 1;
	} else {
		rateObj.punctuality = 0;
	}

};


$scope.setGrooming = function(val) {

	if(val == true) {
		rateObj.grooming = 1;
	} else {
		rateObj.grooming = 0;
	}

};


$scope.setDA = function(val) {

	if(val == true) {
		rateObj.detail_attention = 1;
	} else {
		rateObj.detail_attention = 0;
	}

};


$scope.setPK = function(val) {

	if(val == true) {
	  rateObj.product_knowledge = 1;
	} else {
	  rateObj.product_knowledge = 0;
	}

};


$scope.setCC = function(val) {

	if(val == true) {
	  rateObj.communication_coordination = 1;
	} else {
	  rateObj.communication_coordination = 0;
	}

};




});