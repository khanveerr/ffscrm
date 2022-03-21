angular.module('KAP', []).controller('KAPController', function($scope,$rootScope,$window,$http,KAPService,CityService,$timeout,$routeParams,$route,$location,ClientService,CacheService,OrderService,InspectionService,SweetAlert,$filter,serverConfig,bitly,SMSService,AuthService,ManpowerService) {


    $scope.kap_data = [];
    $scope.page = 1;
    $scope.leadData = {};

    $scope.search_data = {};
	$scope.search_data.status = 'open';
	$scope.search_data.page = $scope.page;
	$scope.companies = [];
	$scope.kap_id = '';
	$scope.activities = [];
	$scope.show_other_company = false;
	$scope.loading = true;
	$scope.isUpdateKAP = false;

	if($scope.currentUser.email != 'rushabh.vora@silagroup.co.in') {
		$scope.search_data.email = $scope.currentUser.email;
	}

	debugger;

	var current_days = moment().daysInMonth();
	var year = moment().year();
	var month = moment().month() + 1;
	debugger;
	$timeout(function(){
		debugger;
		$scope.month_filter = month;		
	});

	debugger;
	//var month = moment().format('MMM');
	console.log(month);
	console.log(year);
	$scope.kap_date = '';

	var current_month_days = [];

	for (var d = 1; d <= current_days; d++) {
		//debugger;
		var new_dt = new Date(year+'-'+month+'-'+d);
		var cur_dt = moment(new_dt).format("DD MMM YYYY");
		var cur_dt_val = moment(new_dt).format("YYYY-MM-DD");
		// console.log(cur_dt);
		current_month_days.push({ 'display': cur_dt, 'value': cur_dt_val });
		//debugger;
	}

	$scope.month_days = current_month_days;
	$timeout(function(){
		$scope.loading = false;
		angular.element("body").css({"overflow-y":"scroll"});
	},1000);
	console.log(current_month_days);

	$scope.change_month = function() {

		var year = moment().year();
		var month = $scope.month_filter;
		var current_days = moment(year+"-"+month, "YYYY-MM").daysInMonth();

		debugger;
		//var month = moment().format('MMM');
		console.log(month);
		console.log(year);
		$scope.kap_date = '';

		var current_month_days = [];

		for (var d = 1; d <= current_days; d++) {
			debugger;
			var new_dt = new Date(year+'-'+month+'-'+d);
			var cur_dt = moment(new_dt).format("DD MMM YYYY");
			var cur_dt_val = moment(new_dt).format("YYYY-MM-DD");
			// console.log(cur_dt);
			current_month_days.push({ 'display': cur_dt, 'value': cur_dt_val });
			debugger;
		}

		$scope.month_days = current_month_days;
		console.log(current_month_days);


	};

	$scope.show_company = function(company) {


		if(company == 'Other') {
			$scope.show_other_company = true;
		} else {
			$scope.show_other_company = false;
		}


	};

	$scope.editKAP = function(kap) {

		$scope.isUpdateKAP = true;
		$scope.kap_id = kap._id;
		$scope.kap_date = kap.kap_date_formatted;

		$scope.leadData.ccompany_name = kap.company_name;
		if(kap.company_name == 'Other') {
			$scope.show_other_company = true;
			$scope.leadData.other_company_name = kap.other_company_name;
		} else {
			$scope.show_other_company = false;
		}
		// $scope.leadData.follow_up_date = kap.follow_up_date_formatted;
		$scope.leadData.activity = kap.activity;

		angular.element('#add_activity').openModal({ dismissible: false });

	};


	KAPService.getAllCompanies($scope.search_data).then(function(response){


		$scope.companies = response.data.result;
		$scope.companies.push({ 'name': 'Other' });
		console.log($scope.companies);

		// $scope.hasMoreData = true;
		// $scope.loading = false;

	});

	$scope.setKAPDate = function(kap_dt) {
		debugger;
		$scope.kap_date = kap_dt;
	}

	$scope.getAllKAPs = function(kap_date = null, email_filter = null) {

		var data = {};
		$scope.kaps = [];

		if(kap_date != null) {
			data.kap_date = kap_date;
		}

		if(email_filter != null) {
			data.email = email_filter;
		}

		// if($scope.currentUser.email != 'rushabh.vora@silagroup.co.in') {
		// 	data.email = $scope.currentUser.email;
		// }

		if($scope.currentUser.email != 'rushabh.vora@silagroup.co.in' && $scope.currentUser.email != 'tanveer.khan@mrhomecare.in' && $scope.currentUser.email != 'sv@silagroup.co.in' && $scope.currentUser.email != 'payal.sondhi@silagroup.co.in' && $scope.currentUser.email != 'daneeshd@gmail.com' && $scope.currentUser.email != 'delnaavari30@gmail.com' && $scope.currentUser.email != 'delnaavari30@gmail.com' && $scope.currentUser.email != 'priyanka.asher@silagroup.co.in' && $scope.currentUser.email != 'sila@silagroup.co.in' && $scope.currentUser.email != 'demo@silagroup.co.in' && $scope.currentUser.email != 'satyajit.nalawade@silagroup.co.in') {
	    	data.email = $scope.currentUser.email;
	  	}

		KAPService.getKaps(data).then(function(response){

			debugger;

			$scope.kaps = response.data.result;

			debugger;

			// $scope.hasMoreData = true;
			// $scope.loading = false;

		});


	};

	KAPService.getAllKaps($scope.search_data).then(function(response){

		$scope.kap_data = response.data.result.data;

		$scope.hasMoreData = true;
		$scope.loading = false;

	});

	$scope.saveKAP = function() {

		debugger;

		if($scope.leadData.ccompany_name == '' || $scope.leadData.ccompany_name == undefined || $scope.leadData.ccompany_name == null) {
	        SweetAlert.swal("Error!", 'Please enter company name', "error");
	        return;
	    }

	    if($scope.leadData.ccompany_name == 'Other') {
	    	if($scope.leadData.other_company_name == '' || $scope.leadData.other_company_name == undefined || $scope.leadData.other_company_name == null) {
		        SweetAlert.swal("Error!", 'Please enter other company name', "error");
		        return;
		    }
	    }

		// if($scope.leadData.follow_up_date == '' || $scope.leadData.follow_up_date == undefined || $scope.leadData.follow_up_date == null) {
	 //        SweetAlert.swal("Error!", 'Please enter follow up date', "error");
	 //        return;
	 //    }

	    if($scope.leadData.activity == '' || $scope.leadData.activity == undefined || $scope.leadData.activity == null) {
	        SweetAlert.swal("Error!", 'Please enter your activity', "error");
	        return;
	    }	 

	    $scope.leadData.kap_date = $scope.kap_date;
	    $scope.leadData.email = $scope.currentUser.email;

	    debugger;

	    var data = {};

	    data.company_name = $scope.leadData.ccompany_name;
	    data.other_company_name = $scope.leadData.ccompany_name == 'Other' ? $scope.leadData.other_company_name : '';
	    // data.follow_up_date = $scope.leadData.follow_up_date;
	    data.activity = $scope.leadData.activity;
	    data.kap_date = $scope.leadData.kap_date;
	    data.email = $scope.leadData.email;

	    KAPService.saveKAP(data).then(function(response){

	    	console.log(response);
	    	if(response != undefined && response != null) {
	          	if(response.data != undefined && response.data != null) {
		            SweetAlert.swal("Success!", response.data.message, "success");
		            angular.element('#add_activity').closeModal();
		            $scope.leadData.ccompany_name = '';
		            // $scope.leadData.follow_up_date = '';
		            $scope.leadData.activity = '';
		            $scope.other_company_name = '';
		            //$scope.searchLeads(1);

	        	}
	        }

	    });   

	};


	$scope.updateKAP = function() {

		debugger;

		if($scope.leadData.ccompany_name == '' || $scope.leadData.ccompany_name == undefined || $scope.leadData.ccompany_name == null) {
	        SweetAlert.swal("Error!", 'Please enter company name', "error");
	        return;
	    }

	    if($scope.leadData.ccompany_name == 'Other') {
	    	if($scope.leadData.other_company_name == '' || $scope.leadData.other_company_name == undefined || $scope.leadData.other_company_name == null) {
		        SweetAlert.swal("Error!", 'Please enter other company name', "error");
		        return;
		    }
	    }

		// if($scope.leadData.follow_up_date == '' || $scope.leadData.follow_up_date == undefined || $scope.leadData.follow_up_date == null) {
	 //        SweetAlert.swal("Error!", 'Please enter follow up date', "error");
	 //        return;
	 //    }

	    if($scope.leadData.activity == '' || $scope.leadData.activity == undefined || $scope.leadData.activity == null) {
	        SweetAlert.swal("Error!", 'Please enter your activity', "error");
	        return;
	    }	 

	    $scope.leadData.kap_date = $scope.kap_date;
	    $scope.leadData.email = $scope.currentUser.email;

	    debugger;

	    var data = {};

	    data.kap_id = $scope.kap_id;
	    data.company_name = $scope.leadData.ccompany_name;
	    data.other_company_name = $scope.leadData.ccompany_name == 'Other' ? $scope.leadData.other_company_name : '';
	    // data.follow_up_date = $scope.leadData.follow_up_date;
	    data.activity = $scope.leadData.activity;
	    // data.kap_date = $scope.leadData.kap_date;
	    // data.email = $scope.leadData.email;

	    KAPService.updateKAP(data).then(function(response){

	    	console.log(response);
	    	if(response != undefined && response != null) {
	          	if(response.data != undefined && response.data != null) {
		            SweetAlert.swal("Success!", response.data.message, "success");
		            angular.element('#add_activity').closeModal();
		            $scope.kap_id = '';
		            $scope.isUpdateKAP = false;
		            $scope.leadData.ccompany_name = '';
		            // $scope.leadData.follow_up_date = '';
		            $scope.leadData.activity = '';
		            $scope.leadData.other_company_name = '';
		            $scope.getAllKAPs($scope.kap_date);
		            //$scope.searchLeads(1);

	        	}
	        }

	    });   

	};


	$scope.logout = function() {
		AuthService.logout();
		$window.location.href = '/login';
	};

	$scope.show_more_data = function() {

		$scope.page++;
		$scope.loading = true;

		if($scope.currentUser.email != 'rushabh.vora@silagroup.co.in') {
			$scope.search_data.email = $scope.currentUser.email;
		}
		$scope.search_data.page = $scope.page;

		KAPService.getAllKaps($scope.search_data).then(function(response){

			if(response.data.result.data.length > 0) {

				$scope.kap_data =  $scope.kap_data.concat(response.data.result.data);
				$scope.hasMoreData = true;
				$scope.loading = false;

			} else {

				$scope.hasMoreData = false;
				$scope.loading = false;

			}

		});  


	};


	$scope.searchLeads = function(page) {

		$scope.search_data = {};

		$scope.page = 1;
		$scope.search_data.page = 1;

		// if($scope.sales_stage_filter != undefined && $scope.sales_stage_filter != null && $scope.sales_stage_filter != "") {
		// $scope.search_data.sales_stage = $scope.sales_stage_filter;
		// }

		// if($scope.spoc_filter != undefined && $scope.spoc_filter != null && $scope.spoc_filter != "") {
		// $scope.search_data.spoc = $scope.spoc_filter;
		// }

		// if($scope.client_type_filter != undefined && $scope.client_type_filter != null && $scope.client_type_filter != "") {
		// $scope.search_data.client_type = $scope.client_type_filter;
		// }

		if($scope.email_filter != undefined && $scope.email_filter != null && $scope.email_filter != "") {
			$scope.search_data.email = $scope.email_filter;
		}

		if($scope.company_name_filter != undefined && $scope.company_name_filter != null && $scope.company_name_filter != "") {
			$scope.search_data.company_name = $scope.company_name_filter;
		}


		if($scope.currentUser.email != 'rushabh.vora@silagroup.co.in') {
			$scope.search_data.email = $scope.currentUser.email;
		}

		KAPService.getAllKaps($scope.search_data).then(function(response){

		$scope.kap_data = [];

		if(response.data.result.data.length > 0) {

			var kaps = response.data.result.data;

			for (var i = 0; i < kaps.length; i++) {
				$scope.kap_data.push(kaps[i]);
			}

			$scope.hasMoreData = true;
			$scope.loading = false;

		} else {

			$scope.hasMoreData = false;
			$scope.loading = false;

		}

		}); 
	  


	};

	$scope.add_activity = function(id, kap) {
		$scope.kap_id = id;
	};


	$scope.saveActivity = function() {

		var data = {};
		data = $scope.leadData;
		data.kap_id = $scope.kap_id;

		KAPService.saveActivity(data).then(function(response){

	    	console.log(response);
	    	if(response != undefined && response != null) {
	          	if(response.data != undefined && response.data != null) {
		            SweetAlert.swal("Success!", response.data.message, "success");
		            angular.element('#add_activity').closeModal();
		            // $scope.leadData.follow_up_date = '';
		            $scope.leadData.activity = '';
		            $scope.searchLeads(1);
	        	}
	        }

	    });   


	};

	$scope.set_activities = function(kap) {

		if(kap.activities != undefined && kap.activities != null && kap.activities.length > 0) {
			$scope.activities = kap.activities;
		}


	};



});