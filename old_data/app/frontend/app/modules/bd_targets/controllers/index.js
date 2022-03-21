angular.module('BDTarget', []).controller('BDTargetController', function($scope,$rootScope,$window,$http,LeadService,KAPService,CityService,$timeout,$routeParams,$route,$location,ClientService,CacheService,OrderService,InspectionService,SweetAlert,$filter,serverConfig,bitly,SMSService,AuthService,ManpowerService) {


	$scope.users = [];
	$scope.monthTarget = {};
	$scope.monthwiseTarget = {};
	$scope.achievedMonthTarget = {};
	$scope.monthwiseAchievedTarget = {};
	$scope.monthTargetTotal = {};
	$scope.monthAchievedTargetTotal = {};
	var months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
	var total_target_month = 0;
	$scope.companies = [];
	$scope.leadData = {};
	$scope.target_hits = [];

	if($scope.currentUser.email == "rushabh.vora@silagroup.co.in" || $scope.currentUser.email == "tanveer.khan@mrhomecare.in") {
    } else {
    	$window.location.href = '/leads';
    }

    LeadService.getAllTargetHits().then(function(response){
    	//console.log(response);
    	if(response != undefined && response != null && response != "") {
			$scope.target_hits = response.data.result;
		}
    });

	LeadService.getAllUsers().then(function(response){
		//console.log(response);
		if(response != undefined && response != null && response != "") {
			$scope.users = response.data.result;
		}
	});

	var search_data = {};

    search_data.email = $scope.currentUser.email;
	KAPService.getAllCompanies(search_data).then(function(response){

      $scope.companies = response.data.result;
      //console.log($scope.companies);

    });

	LeadService.getAllTargets().then(function(response){

		//console.log(response);

		if(response != undefined && response != null && response != "") {

			$scope.monthTarget = response.data.result;
			$scope.monthwiseTarget = response.data.monthwise_total;
			$scope.achievedMonthTarget = response.data.result_achieve;
			$scope.monthwiseAchievedTarget = response.data.monthwise_achieve_total;
			$scope.percentageTotal = {};

			// var mtt = 0;
			// var matt = 0;
			// var p_total = 0;

			//debugger;

			target_month_value = 0;
			achieve_target_month_value = 0;

			$timeout(function(){

				for (var i = 0; i < $scope.users.length; i++) {

					total_target_month = 0;

					for (var j = 0; j < months.length; j++) {
						//debugger;
						target_month_value = angular.isNumber(parseFloat($scope.monthTarget[months[j]+'_'+$scope.users[i].id])) ? $scope.monthTarget[months[j]+'_'+$scope.users[i].id] : 0;
						target_month_value = target_month_value != undefined ? target_month_value : 0;
						total_target_month = total_target_month + parseFloat(target_month_value);

						console.log(months[j] + " | " + $scope.users[i].id + " | " + total_target_month);
					}
					//debugger;

					$scope.monthTargetTotal['total_'+$scope.users[i].id] = total_target_month;

					
				}

				//$scope.monthTargetTotal = mtt;


				console.log($scope.monthTargetTotal);


				for (var i = 0; i < $scope.users.length; i++) {

					total_achieve_target_month = 0;

					for (var j = 0; j < months.length; j++) {
						debugger;
						achieve_target_month_value = angular.isNumber(parseFloat($scope.achievedMonthTarget[months[j]+'_'+$scope.users[i].id+'_achieved'])) ? $scope.achievedMonthTarget[months[j]+'_'+$scope.users[i].id+'_achieved'] : 0;
						achieve_target_month_value = achieve_target_month_value != undefined ? achieve_target_month_value : 0;
						total_achieve_target_month = total_achieve_target_month + parseFloat(achieve_target_month_value);
					}

					debugger;

					$scope.monthAchievedTargetTotal['total_'+$scope.users[i].id] = total_achieve_target_month;
					
					
				}

				//$scope.monthAchievedTargetTotal = matt;

				var p_total = 0;

				for (var i = 0; i < $scope.users.length; i++) {

					p_total = ((parseFloat($scope.monthAchievedTargetTotal['total_'+$scope.users[i].id])*100)/ parseFloat($scope.monthTargetTotal['total_'+$scope.users[i].id])).toFixed(1);
					$scope.percentageTotal['total_'+$scope.users[i].id] = isNaN(p_total) ? 0 : p_total;

				}

				//$scope.percentageTotal = p_total;


			});



		}


	});

	$scope.refreshTargets = function() {

		for (var i = 0; i < $scope.users.length; i++) {

			total_target_month = 0;

			for (var j = 0; j < months.length; j++) {
				//debugger;
				target_month_value = angular.isNumber(parseFloat($scope.monthTarget[months[j]+'_'+$scope.users[i].id])) ? $scope.monthTarget[months[j]+'_'+$scope.users[i].id] : 0;
				target_month_value = target_month_value != undefined ? target_month_value : 0;
				total_target_month = total_target_month + parseFloat(target_month_value);

				console.log(months[j] + " | " + $scope.users[i].id + " | " + total_target_month);
			}
			//debugger;



			$scope.monthTargetTotal['total_'+$scope.users[i].id] = total_target_month;
			
		}

		console.log($scope.monthTargetTotal);


		for (var i = 0; i < $scope.users.length; i++) {

			total_achieve_target_month = 0;

			for (var j = 0; j < months.length; j++) {
				//debugger;
				achieve_target_month_value = angular.isNumber(parseFloat($scope.achievedMonthTarget[months[j]+'_'+$scope.users[i].id+'_achieved'])) ? $scope.achievedMonthTarget[months[j]+'_'+$scope.users[i].id+'_achieved'] : 0;
				achieve_target_month_value = achieve_target_month_value != undefined ? achieve_target_month_value : 0;
				total_achieve_target_month = total_achieve_target_month + parseFloat(achieve_target_month_value);
			}

			//debugger;

			$scope.monthAchievedTargetTotal['total_'+$scope.users[i].id] = total_achieve_target_month;
			
		}

		var p_total = 0;

		for (var i = 0; i < $scope.users.length; i++) {

			p_total = ((parseFloat($scope.monthAchievedTargetTotal['total_'+$scope.users[i].id])*100)/ parseFloat($scope.monthTargetTotal['total_'+$scope.users[i].id])).toFixed(1);
			$scope.percentageTotal['total_'+$scope.users[i].id] = isNaN(p_total) ? 0 : p_total;

		}

	}


	// LeadService.getAllAchievedTargets().then(function(response){

	// 	console.log(response);

	// 	if(response != undefined && response != null && response != "") {

	// 		$scope.achievedMonthTarget = response.data.result;
	// 		$scope.monthwiseAchievedTarget = response.data.monthwise_total;

	// 		debugger;

	// 		target_month_value = 0;

	// 		$timeout(function(){

	// 			for (var i = 0; i < $scope.users.length; i++) {

	// 				total_target_month = 0;

	// 				for (var j = 0; j < months.length; j++) {
	// 					debugger;
	// 					target_month_value = angular.isNumber(parseFloat($scope.achievedMonthTarget[months[j]+'_'+$scope.users[i].id+'_achieved'])) ? $scope.achievedMonthTarget[months[j]+'_'+$scope.users[i].id+'_achieved'] : 0;
	// 					target_month_value = target_month_value != undefined ? target_month_value : 0;
	// 					total_target_month = total_target_month + parseFloat(target_month_value);
	// 				}

	// 				debugger;

	// 				$scope.monthAchievedTargetTotal['total_'+$scope.users[i].id] = total_target_month;
					
	// 			}


	// 		});



	// 	}


	// });

	$scope.update_achieved_target = function(value,user_id, month) {

		var year = moment().year();

		var data = {};

		data.month = month;
		data.year = year;
		data.value = $scope.achievedMonthTarget[value];
		data.user_id = user_id;


		LeadService.saveBDAchieveTarget(data).then(function(response){


		});



	}

	$scope.update_target = function(value,user_id, month) {

		var year = moment().year();

		//console.log($scope.monthTarget);
		//console.log($scope.monthTarget[value]);
		//console.log(user_id);
		//console.log(month);
		//console.log(year);

		var data = {};

		data.month = month;
		data.year = year;
		data.value = $scope.monthTarget[value];
		data.user_id = user_id;

		LeadService.saveBDTarget(data).then(function(response){
		});


		// target_month_value = 0;

		// for (var i = 0; i < $scope.users.length; i++) {

		// 	total_target_month = 0;

		// 	for (var j = 0; j < months.length; j++) {
		// 		debugger;
		// 		var mt_val = $scope.monthTarget[months[j]+'_'+$scope.users[i].id] == '' ? 0 : $scope.monthTarget[months[j]+'_'+$scope.users[i].id];
		// 		target_month_value = angular.isNumber(parseFloat(mt_val)) ? mt_val : 0;
		// 		target_month_value = target_month_value != undefined ? target_month_value : 0;
		// 		total_target_month = total_target_month + parseFloat(target_month_value);
		// 	}

		// 	debugger;

		// 	$scope.monthTargetTotal['total_'+$scope.users[i].id] = total_target_month;
			
		// }



	}


	$scope.open_target_hit_modal = function() {
		$scope.leadData = {};
		angular.element('#add_target_hit').openModal({ dismissible: false });
	};

	$scope.delete_target_hit = function(lead_id) {

      SweetAlert.swal({
          title: "Do you really want to delete this target?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },  function(isConfirm){

          if(isConfirm) {

            LeadService.deleteTargetHitData(lead_id).then(function(res){
              
              SweetAlert.swal("Success!", res.data.message, "success");
              // $route.reload();
              filter_target_hits();

              // $scope.page = 1;

              // LeadService.getAllLeads({ page: $scope.page }).then(function(response){
              //   $scope.lead_data = response.data.result.data;
              //   $scope.hasMoreData = true;
              //   $scope.loading = false;
              //   //$scope.leadData = {};
              //   //angular.element('#lead_form').reset();
              // });

            }, function(error) {
              //alert(error.message);
              SweetAlert.swal("Error!", error.data.message, "error");
            });

          }

      });

    };

	$scope.edit_target = function(id) {

		$scope.leadData = {};

		LeadService.getTargetHitDetail(id).then(function(response){

			console.log(response);

			var data = response.data.result;

			console.log(data);
			$scope.leadData.id = data._id;
			$scope.leadData.bd_rep = data.bd_rep;
			$scope.leadData.company_name = data.company_name;
			$scope.leadData.bdm_contribution = data.bdm_contribution;
			$scope.leadData.director_contribution = data.director_contribution;

			console.log($scope.leadData);
			angular.element('#add_target_hit').openModal({ dismissible: false });

		});

	};

	$scope.saveTargetHit = function() {

		if($scope.leadData.bd_rep == '' || $scope.leadData.bd_rep == undefined || $scope.leadData.bd_rep == null) {
	        SweetAlert.swal("Error!", 'Please select BD', "error");
	        return;
	    }

	    if($scope.leadData.company_name == '' || $scope.leadData.company_name == undefined || $scope.leadData.company_name == null) {
	        SweetAlert.swal("Error!", 'Please select company', "error");
	        return;
	    }

	    if($scope.leadData.bdm_contribution == '' || $scope.leadData.bdm_contribution == undefined || $scope.leadData.bdm_contribution == null) {
	        SweetAlert.swal("Error!", 'Please enter bdm contribution', "error");
	        return;
	    }

	    if($scope.leadData.director_contribution == '' || $scope.leadData.director_contribution == undefined || $scope.leadData.director_contribution == null) {
	        SweetAlert.swal("Error!", 'Please enter director contribution', "error");
	        return;
	    }

		var data = {};
		data = $scope.leadData;

		LeadService.saveTargetHit(data).then(function(response){

			if(response.data != undefined && response.data != null) {

                SweetAlert.swal("Success!", response.data.message, "success");
                //$scope.searchLeads(1);

                angular.element('#add_target_hit').closeModal();
                $scope.leadData = {};
                filter_target_hits();
                
            }

		});

	};

	$scope.filter_targets = function() {
		filter_target_hits();
	};

	function filter_target_hits() {

		var search_data = {};

		if($scope.month_filter != undefined && $scope.month_filter != null && $scope.month_filter != "") {
			search_data.month = $scope.month_filter;
		}

		if($scope.bd_rep_filter != undefined && $scope.bd_rep_filter != null && $scope.bd_rep_filter != "") {
			search_data.bd_rep = $scope.bd_rep_filter;
		}

		LeadService.getAllTargetHits(search_data).then(function(response){
	    	//console.log(response);
	    	if(response != undefined && response != null && response != "") {
				$scope.target_hits = response.data.result;
			}
	    });

	}


});
