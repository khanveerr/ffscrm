angular.module('Dashboard', []).controller('DashboardController', function($scope,$routeParams,$route,$window,$location,AuthService,LeadService,LeadManagerService,OrderService) {

	$scope.open_leads = [];
	$scope.reminder_leads = [];
	$scope.new_leads = [];
	$scope.is_open_leads_loading = true;
	$scope.is_reminder_leads_loading = true;
	$scope.is_won_leads_loading = true;
	$scope.is_new_leads_loading = true;
	$scope.date_filter = 1;
	$scope.sales_stage_filter = '';

	var filter_data = {};
	var new_filter_data = {};

	filter_data = { option: 1 };
	loadOpenLeads(filter_data);

	new_filter_data = { option: 1 };
	loadNewLeads(new_filter_data);



	$scope.filter_open_leads = function(date_filter,sales_stage_filter) {
		$scope.is_open_leads_loading = true;

		debugger;

		filter_data = {};

		if(date_filter != undefined && date_filter != null && date_filter != "") {
			filter_data.option = date_filter;
		}

		if(sales_stage_filter != undefined && sales_stage_filter != null && sales_stage_filter != "") {
			filter_data.sales_stage = sales_stage_filter;
		}

		debugger;


		loadOpenLeads(filter_data);
	}

	$scope.filter_new_leads = function(days_filter) {
		$scope.is_new_leads_loading = true;

		new_filter_data = {};

		if(days_filter != undefined && days_filter != null && days_filter != "") {
			new_filter_data.option = days_filter;
		}


		loadNewLeads(new_filter_data);
	}


	function loadOpenLeads(filter_data) {

		LeadService.getOpenLeads(filter_data).then(function(response){

			console.log("Open Leads");
			console.log(response.data);

			$scope.is_open_leads_loading = false;

			if(response != undefined && response.data != undefined && response.data != "" && response.data.length > 0) {
				$scope.open_leads = response.data;
			} else {
				$scope.open_leads = [];
			}

		});

	}

	function loadNewLeads(new_filter_data) {

		LeadService.getNewLeads(new_filter_data).then(function(response){

			console.log("New Leads");
			console.log(response.data);

			$scope.is_new_leads_loading = false;

			if(response != undefined && response.data != undefined && response.data != "" && response.data.length > 0) {
				$scope.new_leads = response.data;
			} else {
				$scope.new_leads = [];
			}

		});

	}


	LeadService.getReminderLeads({}).then(function(response){

		$scope.is_reminder_leads_loading = false;

		if(response != undefined && response.data != undefined && response.data != "" && response.data.length > 0) {
			$scope.reminder_leads = response.data;
		} else {
			$scope.reminder_leads = [];
		}

	});

	LeadService.getWonLeads({}).then(function(response){

		$scope.is_won_leads_loading = false;

		if(response != undefined && response.data != undefined && response.data != "" && response.data.length > 0) {
			$scope.won_leads = response.data;
		} else {
			$scope.won_leads = [];
		}

	});


	$scope.yesterday_followups = "";
	$scope.today_followups = "";
	$scope.day_followups = "";

	$scope.type = "today";

	$scope.currentUser = AuthService.currentUser();
 	if($scope.currentUser.role == "view") {
 		$window.location.href = "/leads";
 	} else if($scope.currentUser.role == "operations") {
		$window.location.href = "/orders";
	}
	loadData($scope.type);
	loadPendingAMCs();

	//console.log($scope.currentUser);

	$scope.loadTabData = function(type) {
		loadData(type);
	};

	$scope.logout = function() {
		console.log("Logout");
		AuthService.logout();
		$window.location.href = '/login';		
	};

	$scope.showLead = function(id) {
		$window.location.href = "/lead/edit/"+id;
	}

	$scope.goToPath = function(path) {
		$window.location.href = path;
	};


	function loadData(type) {

		$scope.type = type;

		var date1 = "";
		var date2 = "";

		if(type == "yesterday") {

			date1 = (new Date(moment().startOf('day').subtract(1, 'days').format('YYYY-MM-DD'))).toISOString();
			date2 = (new Date(moment().startOf('day').format('YYYY-MM-DD'))).toISOString();

		}

		if(type == "today") {

			date1 = (new Date(moment().startOf('day').format('YYYY-MM-DD'))).toISOString();
			date2 = (new Date(moment().startOf('day').add(1, 'days').format('YYYY-MM-DD'))).toISOString();

		}

		if(type == "1day") {

			date1 = (new Date(moment().startOf('day').add(1, 'days').format('YYYY-MM-DD'))).toISOString();
			date2 = (new Date(moment().startOf('day').add(2, 'days').format('YYYY-MM-DD'))).toISOString();

		}


	 	var orderBy = {
		    created_on: 1
		};

	 	var paginationSettings = {
	        limit: 0,
	        offset: 0
		};


	 	var searchFollowups = {
	 		'status': 0,
	 		'rem_from_inquiry_date': date1, 
	 		'rem_to_inquiry_date': date2
	 	};

		var data = {
			searchVal: searchFollowups,
			paginationSettings: paginationSettings
		};

		if($scope.currentUser.role != "admin") {
			searchFollowups.leadowner = $scope.currentUser.name;
		}

		console.log(searchFollowups);

	 	LeadManagerService.filterLeads(data).then(function(response){

	 		console.log(response);
	 		
	 		var lead_count = response.data.message.length;

	 		if(lead_count > 0) {

	 			var lead_data = response.data.message;
	 			var lead_data_arr = [];

	 			for (var i = lead_data.length - 1; i >= 0; i--) {
	 				
	 				var lead_obj = {
	 					'id': lead_data[i]['_id'],
	 					'leadowner': lead_data[i]['leadowner'],
	 					'firstname': lead_data[i]['firstname'],
	 					'primary_contact_no': lead_data[i]['primary_contact_no'],
	 					'primary_email_id': lead_data[i]['primary_email_id']	
	 				};

	 				if(lead_data[i]['service_obj_arr'].length > 0) {

	 					var service_obj_arr = lead_data[i]['service_obj_arr'];
	 					var service_lead_stage_count = 0;

	 					for (var j = service_obj_arr.length - 1; j >= 0; j--) {

	 						service_lead_stage_count += getServiceNotClosed(service_obj_arr[j].lead_history);

	 					};

	 				}

	 				if(service_lead_stage_count > 0) {
	 					lead_obj['count'] = service_lead_stage_count;
	 					lead_data_arr.push(lead_obj);
	 				}


	 			};

	 			console.log(lead_data_arr);

				if(type == "yesterday") {
					$scope.yesterday_followups = lead_data_arr;
				}

				if(type == "today") {
					$scope.today_followups = lead_data_arr;
				}

				if(type == "1day") {
					$scope.day_followups = lead_data_arr;
				}

	 		}

	 	});

	}

	function loadPendingAMCs() {

		var start_date = new Date(moment().startOf('month').format('YYYY-MM-DD'));
		var end_date = new Date(moment(start_date).add('months',1).subtract('days', 1).format('YYYY-MM-DD'));

		
		var searchVal = {
			'from_inquiry_date':  start_date.toISOString(),
			'to_inquiry_date':  end_date.toISOString(),
			'is_amc': 1,
			'not_empty': 1
		};

		console.log(searchVal);

		var paginationSettings = {
          limit: 0,
          offset: 0
        }

        var orderBy = {
		    created_on: 1
		};

		var data = {
			'searchVal':searchVal,
			'paginationSettings': paginationSettings,
			orderBy: orderBy
		}

		OrderService.filterAllOrders(data).then(function(response){
			
			var order_count = response.data.message.length;

			if(order_count > 0 ) {

				var order_data = response.data.message;
				$scope.pending_amcs = order_data;

			}

		});


	};

});



function getServiceNotClosed(lead_history) {

	var count = 0;
	var lead_stage = lead_history[lead_history.length-1].lead_stage;
	//if(lead_stage != 17 && lead_stage != 36) {
		count++;
	//}


	return count;

};