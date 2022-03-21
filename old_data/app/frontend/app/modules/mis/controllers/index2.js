angular.module('MIS', []).controller('MISController', function($scope,$routeParams,$window,$route,$location,OrderService,MISService,LeadManagerService,CacheService,AuthService) {

	// $scope.chartOptions = {
 //        title: {
 //            text: 'Temperature data'
 //        },
 //        xAxis: {
 //            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
 //                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
 //        },

 //        series: [{
 //            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
 //        }]
 //    };


 	$scope.total_bookings = 0;
 	$scope.total_booking_revenue = 0;

 	$scope.today_total_bookings = 0;
 	$scope.today_total_booking_revenue = 0;

 	$scope.total_organic_order_count = 0;
	$scope.total_organic_order_bookings = 0;

 	$scope.total_partner_order_count = 0;
	$scope.total_partner_order_bookings = 0;

 	var lead_source_options = {};
 	var lead_stage_options = {};

 	$scope.user = AuthService.currentUser();
 	if($scope.user.role == "view") {
 		$window.location.href = "/leads";
 	}

 	CacheService.getCache({key: ['leadstage','leadsource','city','pricelist']}).then(function(response){
      lead_source_options = response.data.message.leadsource;
      lead_stage_options = response.data.message.leadstage;
      $scope.cities = response.data.message.city;
      $scope.ls_options = lead_source_options;
      $scope.services_options = response.data.message.pricelist;
      console.log(lead_source_options);
      console.log(lead_stage_options);
    });


 	if($route.current.action == 'bs') {
	    fillSummaryGroupBoxes1();
		fillSummaryGroupBoxes2();    
	    plotareachart();
	    plotpiechart_leadsourcewise();
	    plotpiechart_leadstagebooking();
	}

	if($route.current.action == 'bovp') {
	    fillSummaryGroupBoxes_Organic();
		fillSummaryGroupBoxes_Partner();    
		plotcolumnchart();
	    //plotpiechart_leadsourcewise();
	    //plotpiechart_leadstagebooking();
	}

 	if($route.current.action == 'rs') {
	    fillSummaryGroupBoxes1_revenue();
		fillSummaryGroupBoxes2_revenue();    
	    plotareachart_revenue();
	    plotpiechart_leadsourcewise_revenue();
	    plotpiechart_leadstagebooking_revenue();
	}

	if($route.current.action == 'rovp') {
	    fillSummaryGroupBoxes_Organic_revenue();
		fillSummaryGroupBoxes_Partner_revenue();    
		plotcolumnchart_revenue();
	    //plotpiechart_leadsourcewise();
	    //plotpiechart_leadstagebooking();
	}

	$scope.goToPath = function(path) {
		$window.location.href = path;
	};
	
    $scope.filterData = function() {

    	fillSummaryGroupBoxes1($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);
    	fillSummaryGroupBoxes2($scope.filter_city,$scope.filter_leadsource,$scope.filter_service);
    	plotareachart($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);
    	plotpiechart_leadsourcewise($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);
    	plotpiechart_leadstagebooking($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);

    };

    $scope.filterData_Revenue = function() {

    	fillSummaryGroupBoxes1_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);
    	fillSummaryGroupBoxes2_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service);
    	plotareachart_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);
    	plotpiechart_leadsourcewise_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);
    	plotpiechart_leadstagebooking_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);

    };

    $scope.filterDataOP = function() {
    	fillSummaryGroupBoxes_Organic($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);
		fillSummaryGroupBoxes_Partner($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);    
		plotcolumnchart($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);
    }

    $scope.filterDataOP_Revenue = function() {
    	fillSummaryGroupBoxes_Organic_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);
		fillSummaryGroupBoxes_Partner_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);    
		plotcolumnchart_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate);
    }

    $scope.chartOptions = {
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Browser usage'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                }
            }
        },
        series: [{
            data: [{
                    name: "Microsoft Internet Explorer",
                    y: 56.33
                }, {
                    name: "Chrome",
                    y: 24.03,
                    sliced: true,
                    selected: true
                }, {
                    name: "Firefox",
                    y: 10.38
                }, {
                    name: "Safari",
                    y: 4.77
                }, {
                    name: "Opera",
                    y: 0.91
                }, {
                    name: "Proprietary or Undetectable",
                    y: 0.2
            }]
        }]
    };


    function fillSummaryGroupBoxes1(city='',leadsource='',service='',start_date='',end_date='') {

	 	var searchVal = {
	 		'status': 0
	 	};

	 	if(city != undefined && city != null && city != "") {
	 		searchVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchVal.service_id = service;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && (end_date != undefined && end_date != null && end_date != "")) {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	}

	 	var orderBy = {
		    created_on: 1
		};

	 	var paginationSettings = {
	        limit: 0,
	        offset: 0
	      };
	      //console.log(paginationSettings);
	      var data = {
	      	orderBy: orderBy,
	        searchVal: searchVal,
	        paginationSettings: paginationSettings
	      };

	      var orders_arr = [];
	      var taxed_cost_sum = 0; 

	 	LeadManagerService.getAllServices(data).then(function(response){
	 		//console.log(response);
	 		var order_count = response.data.message.length;
	 		if(order_count > 0) {
	 			$scope.total_bookings = order_count;
	 			var orders = response.data.message;

	 			for (var i = orders.length - 1; i >= 0; i--) {
	 				if(orders[i]['taxed_cost'] != null && orders[i]['taxed_cost'] != "") {
 						taxed_cost_sum = taxed_cost_sum + orders[i]['taxed_cost'];
 					}
	 			};

	 			$scope.total_booking_revenue = numDifferentiation(taxed_cost_sum);

	 		} else {
	 			$scope.total_bookings = 0;
	 			$scope.total_booking_revenue = 0;
	 		}
	 	});




    }


    function fillSummaryGroupBoxes1_revenue(city='',leadsource='',service='',start_date='',end_date='') {

	 	var searchVal = {
	 		'status': 0,
	 		'invoice_sent': 1
	 	};

	 	if(city != undefined && city != null && city != "") {
	 		searchVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchVal.service_id = service;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && (end_date != undefined && end_date != null && end_date != "")) {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	}

	 	var orderBy = {
		    created_on: 1
		};

	 	var paginationSettings = {
	        limit: 0,
	        offset: 0
	      };
	      //console.log(paginationSettings);
	      var data = {
	      	orderBy: orderBy,
	        searchVal: searchVal,
	        paginationSettings: paginationSettings
	      };

	      var orders_arr = [];
	      var taxed_cost_sum = 0; 

	 	LeadManagerService.getAllServices(data).then(function(response){
	 		//console.log(response);
	 		var order_count = response.data.message.length;
	 		if(order_count > 0) {
	 			$scope.total_bookings = order_count;
	 			var orders = response.data.message;

	 			for (var i = orders.length - 1; i >= 0; i--) {
	 				if(orders[i]['taxed_cost'] != null && orders[i]['taxed_cost'] != "") {
 						taxed_cost_sum = taxed_cost_sum + orders[i]['taxed_cost'];
 					}
	 			};

	 			$scope.total_booking_revenue = numDifferentiation(taxed_cost_sum);

	 		} else {
	 			$scope.total_bookings = 0;
	 			$scope.total_booking_revenue = 0;
	 		}
	 	});




    }


    function fillSummaryGroupBoxes_Organic(city='',leadsource='',service='',start_date='',end_date='') {


	 	var searchVal = {
	 		'status': 0
	 	};

	 	if(city != undefined && city != null && city != "") {
	 		searchVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchVal.service_id = service;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	}

	 	searchVal['$and'] = [{ 'leadsource': { '$ne': "70" } }, { 'leadsource': { '$ne': "84" } }];

	 	var orderBy = {
		    created_on: 1
		};

	 	var paginationSettings = {
	        limit: 0,
	        offset: 0
	      };
	      //console.log(paginationSettings);
	      var data = {
	      	orderBy: orderBy,
	        searchVal: searchVal,
	        paginationSettings: paginationSettings
	      };

	      var orders_arr = [];
	      var taxed_cost_sum = 0; 

	 	LeadManagerService.getAllServices(data).then(function(response){
	 		console.log(response);
	 		var total_organic_order_count = response.data.message.length;
	 		if(total_organic_order_count > 0) {
	 			$scope.total_organic_order_count = total_organic_order_count;
	 			var orders = response.data.message;

	 			for (var i = orders.length - 1; i >= 0; i--) {
	 				if(orders[i]['taxed_cost'] != null && orders[i]['taxed_cost'] != "") {
 						taxed_cost_sum = taxed_cost_sum + orders[i]['taxed_cost'];
 					}
	 			};

	 			$scope.total_organic_order_bookings = numDifferentiation(taxed_cost_sum);

	 		} else {
	 			$scope.total_organic_order_count = 0;
	 			$scope.total_organic_order_bookings = 0;
	 		}
	 	});




    }

    function fillSummaryGroupBoxes_Organic_revenue(city='',leadsource='',service='',start_date='',end_date='') {


	 	var searchVal = {
	 		'status': 0,
	 		'invoice_sent': 1
	 	};

	 	if(city != undefined && city != null && city != "") {
	 		searchVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchVal.service_id = service;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	}

	 	searchVal['$and'] = [{ 'leadsource': { '$ne': "70" } }, { 'leadsource': { '$ne': "84" } }];

	 	var orderBy = {
		    created_on: 1
		};

	 	var paginationSettings = {
	        limit: 0,
	        offset: 0
	      };
	      //console.log(paginationSettings);
	      var data = {
	      	orderBy: orderBy,
	        searchVal: searchVal,
	        paginationSettings: paginationSettings
	      };

	      var orders_arr = [];
	      var taxed_cost_sum = 0; 

	 	LeadManagerService.getAllServices(data).then(function(response){
	 		console.log(response);
	 		var total_organic_order_count = response.data.message.length;
	 		if(total_organic_order_count > 0) {
	 			$scope.total_organic_order_count = total_organic_order_count;
	 			var orders = response.data.message;

	 			for (var i = orders.length - 1; i >= 0; i--) {
	 				if(orders[i]['taxed_cost'] != null && orders[i]['taxed_cost'] != "") {
 						taxed_cost_sum = taxed_cost_sum + orders[i]['taxed_cost'];
 					}
	 			};

	 			$scope.total_organic_order_bookings = numDifferentiation(taxed_cost_sum);

	 		} else {
	 			$scope.total_organic_order_count = 0;
	 			$scope.total_organic_order_bookings = 0;
	 		}
	 	});




    }


    function fillSummaryGroupBoxes_Partner(city='',leadsource='',service='',start_date='',end_date='') {


	 	var searchVal = {
	 		'status': 0
	 	};

	 	if(city != undefined && city != null && city != "") {
	 		searchVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchVal.service_id = service;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	}

	 	searchVal['$or'] = [{ 'leadsource': { '$eq': "70" } }, { 'leadsource': { '$eq': "84" } }];

	 	var orderBy = {
		    created_on: 1
		};

	 	var paginationSettings = {
	        limit: 0,
	        offset: 0
	      };
	      //console.log(paginationSettings);
	      var data = {
	      	orderBy: orderBy,
	        searchVal: searchVal,
	        paginationSettings: paginationSettings
	      };

	      var orders_arr = [];
	      var taxed_cost_sum = 0; 

	 	LeadManagerService.getAllServices(data).then(function(response){
	 		console.log(response);
	 		var total_partner_order_count = response.data.message.length;
	 		if(total_partner_order_count > 0) {
	 			$scope.total_partner_order_count = total_partner_order_count;
	 			var orders = response.data.message;

	 			for (var i = orders.length - 1; i >= 0; i--) {
	 				if(orders[i]['taxed_cost'] != null && orders[i]['taxed_cost'] != "") {
 						taxed_cost_sum = taxed_cost_sum + orders[i]['taxed_cost'];
 					}
	 			};

	 			$scope.total_partner_order_bookings = numDifferentiation(taxed_cost_sum);

	 		} else {
	 			$scope.total_partner_order_count = 0;
	 			$scope.total_partner_order_bookings = 0;
	 		}
	 	});




    }


    function fillSummaryGroupBoxes_Partner_revenue(city='',leadsource='',service='',start_date='',end_date='') {


	 	var searchVal = {
	 		'status': 0,
	 		'invoice_sent': 1
	 	};

	 	if(city != undefined && city != null && city != "") {
	 		searchVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchVal.service_id = service;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	}

	 	searchVal['$or'] = [{ 'leadsource': { '$eq': "70" } }, { 'leadsource': { '$eq': "84" } }];

	 	var orderBy = {
		    created_on: 1
		};

	 	var paginationSettings = {
	        limit: 0,
	        offset: 0
	      };
	      //console.log(paginationSettings);
	      var data = {
	      	orderBy: orderBy,
	        searchVal: searchVal,
	        paginationSettings: paginationSettings
	      };

	      var orders_arr = [];
	      var taxed_cost_sum = 0; 

	 	LeadManagerService.getAllServices(data).then(function(response){
	 		console.log(response);
	 		var total_partner_order_count = response.data.message.length;
	 		if(total_partner_order_count > 0) {
	 			$scope.total_partner_order_count = total_partner_order_count;
	 			var orders = response.data.message;

	 			for (var i = orders.length - 1; i >= 0; i--) {
	 				if(orders[i]['taxed_cost'] != null && orders[i]['taxed_cost'] != "") {
 						taxed_cost_sum = taxed_cost_sum + orders[i]['taxed_cost'];
 					}
	 			};

	 			$scope.total_partner_order_bookings = numDifferentiation(taxed_cost_sum);

	 		} else {
	 			$scope.total_partner_order_count = 0;
	 			$scope.total_partner_order_bookings = 0;
	 		}
	 	});




    }



    function fillSummaryGroupBoxes2(city='',leadsource='',service='',start_date='',end_date='') {

		var today_date =  new Date(moment().format('YYYY-MM-DD') + ' 00:00:00');
		var tomorrow_date = moment().add(1,'days').toDate();


	 	var orderBy = {
		    created_on: 1
		};

	 	var paginationSettings = {
	        limit: 0,
	        offset: 0
		};


	 	var searchTodayVal = {
	 		'status': 0,
	 		'created_on': {'$gte': today_date.toISOString(), '$lt': tomorrow_date.toISOString()}
	 	};

	 	if(city != undefined && city != null && city != "") {
	 		searchTodayVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchTodayVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchTodayVal.service_id = service;
	 	}

	 	console.log(searchTodayVal);

		var dataToday = {
		  	orderBy: orderBy,
		    searchVal: searchTodayVal,
		    paginationSettings: paginationSettings
		};


	 	LeadManagerService.getAllServices(dataToday).then(function(response){
	 		// console.log(response);
	 		var today_order_count = response.data.message.length;
	 		if(today_order_count > 0) {
	 			var orders_arr = response.data.message;
	 			var today_taxed_cost_sum = 0;
	 			$scope.today_total_bookings = today_order_count;

				for (var i = orders_arr.length - 1; i >= 0; i--) {
	 				if(orders_arr[i]['taxed_cost'] != "" && orders_arr[i]['taxed_cost'] != null) {
	 					today_taxed_cost_sum = today_taxed_cost_sum + orders_arr[i]['taxed_cost'];
	 				}
	 			}; 			

	 			$scope.today_total_booking_revenue = numDifferentiation(today_taxed_cost_sum);
	 		} else {
	 			$scope.today_total_bookings = 0;
	 			$scope.today_total_booking_revenue = 0;
	 		}
	 	});

    }


    function fillSummaryGroupBoxes2_revenue(city='',leadsource='',service='',start_date='',end_date='') {

		var today_date =  new Date(moment().format('YYYY-MM-DD') + ' 00:00:00');
		var tomorrow_date = moment().add(1,'days').toDate();


	 	var orderBy = {
		    created_on: 1
		};

	 	var paginationSettings = {
	        limit: 0,
	        offset: 0
		};


	 	var searchTodayVal = {
	 		'status': 0,
	 		'invoice_sent': 1,
	 		'created_on': {'$gte': today_date.toISOString(), '$lt': tomorrow_date.toISOString()}
	 	};

	 	if(city != undefined && city != null && city != "") {
	 		searchTodayVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchTodayVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchTodayVal.service_id = service;
	 	}

	 	console.log(searchTodayVal);

		var dataToday = {
		  	orderBy: orderBy,
		    searchVal: searchTodayVal,
		    paginationSettings: paginationSettings
		};


	 	LeadManagerService.getAllServices(dataToday).then(function(response){
	 		// console.log(response);
	 		var today_order_count = response.data.message.length;
	 		if(today_order_count > 0) {
	 			var orders_arr = response.data.message;
	 			var today_taxed_cost_sum = 0;
	 			$scope.today_total_bookings = today_order_count;

				for (var i = orders_arr.length - 1; i >= 0; i--) {
	 				if(orders_arr[i]['taxed_cost'] != "" && orders_arr[i]['taxed_cost'] != null) {
	 					today_taxed_cost_sum = today_taxed_cost_sum + orders_arr[i]['taxed_cost'];
	 				}
	 			}; 			

	 			$scope.today_total_booking_revenue = numDifferentiation(today_taxed_cost_sum);
	 		} else {
	 			$scope.today_total_bookings = 0;
	 			$scope.today_total_booking_revenue = 0;
	 		}
	 	});

    }


    function plotareachart(city='',leadsource='',service='',start_date='',end_date='') {

    	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    	var firstDay = new Date(y, m, 2);
		var lastDay = new Date(y, m+1, 1);

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		
	 		firstDay = from_date.toISOString();
	 		lastDay = to_date.toISOString();

	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay,
			'city': city,
			'leadsource': leadsource,
			'service_id': service
		};

		console.log(whereServiceArr);

		var orderByService = { created_on: -1 };

		var match_field = {'match_field': 'created_on'};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		LeadManagerService.groupByDate(data).then(function(response){
			
			if(response.data.message.length > 0) {

				var res_data = response.data.message;
				$scope.booking_data = res_data;
				var formatted_data = formatDataforCharts(res_data);

				console.log(formatted_data);


			    var areaChartOptions = {
			        chart: {
			            type: 'area'
			        },
			        title: {
			            text: 'Expected Revenue Generated'
			        },
			        
			        xAxis: {
			            type: 'datetime',
			            labels: {
			                formatter: function () {
			                    return Highcharts.dateFormat(' %d %b', this.value);
			                },
			                dateTimeLabelFormats: {
			                    minute: '%H:%M',
			                    hour: '%H:%M',
			                    day: '%e. %b',
			                    week: '%e. %b',
			                    month: '%b \'%y',
			                    year: '%Y'
			                }
			            }
			        },
			        yAxis: {
			            min: 0,
			            title: {
			                text: 'Expected Revenue'
			            },
			            labels: {
			                formatter: function () {
			                    return this.value / 1000 + 'k';
			                }
			            }
			        },
			        tooltip: {
			            pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>Total Orders : <b>{point.orders}</b>'
			        },
			        plotOptions: {
			                area: {
			                    fillColor: {
			                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
			                        stops: [
			                            [0, '#ff0000'],
			                            [1, '#f4f4f4']
			                        ]
			                    },
			                    lineWidth: 1,
			                    marker: {
			                        enabled: false
			                    },
			                    shadow: false,
			                    states: {
			                        hover: {
			                            lineWidth: 1
			                        }
			                    },
			                    threshold: null
			                }
			            },
			        series:[{
			         name: 'Revenue',
			         data: formatted_data,
			      }]
			    };



				Highcharts.chart('area_chart', areaChartOptions);



			}

		});


    }



    function plotareachart_revenue(city='',leadsource='',service='',start_date='',end_date='') {

    	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    	var firstDay = new Date(y, m, 2);
		var lastDay = new Date(y, m+1, 1);

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		
	 		firstDay = from_date.toISOString();
	 		lastDay = to_date.toISOString();

	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay,
			'city': city,
			'leadsource': leadsource,
			'service_id': service,
			'invoice_sent': 1
		};

		console.log(whereServiceArr);

		var orderByService = { created_on: -1 };

		var match_field = {'match_field': 'created_on'};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		LeadManagerService.groupByDate(data).then(function(response){
			
			if(response.data.message.length > 0) {

				var res_data = response.data.message;
				$scope.booking_data = res_data;
				var formatted_data = formatDataforCharts(res_data);

				console.log(formatted_data);


			    var areaChartOptions = {
			        chart: {
			            type: 'area'
			        },
			        title: {
			            text: 'Expected Revenue Generated'
			        },
			        
			        xAxis: {
			            type: 'datetime',
			            labels: {
			                formatter: function () {
			                    return Highcharts.dateFormat(' %d %b', this.value);
			                },
			                dateTimeLabelFormats: {
			                    minute: '%H:%M',
			                    hour: '%H:%M',
			                    day: '%e. %b',
			                    week: '%e. %b',
			                    month: '%b \'%y',
			                    year: '%Y'
			                }
			            }
			        },
			        yAxis: {
			            min: 0,
			            title: {
			                text: 'Expected Revenue'
			            },
			            labels: {
			                formatter: function () {
			                    return this.value / 1000 + 'k';
			                }
			            }
			        },
			        tooltip: {
			            pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>Total Orders : <b>{point.orders}</b>'
			        },
			        plotOptions: {
			                area: {
			                    fillColor: {
			                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
			                        stops: [
			                            [0, '#ff0000'],
			                            [1, '#f4f4f4']
			                        ]
			                    },
			                    lineWidth: 1,
			                    marker: {
			                        enabled: false
			                    },
			                    shadow: false,
			                    states: {
			                        hover: {
			                            lineWidth: 1
			                        }
			                    },
			                    threshold: null
			                }
			            },
			        series:[{
			         name: 'Revenue',
			         data: formatted_data,
			      }]
			    };



				Highcharts.chart('area_chart', areaChartOptions);



			}

		});


    }


    function plotcolumnchart(city='',leadsource='',service='',start_date='',end_date='') {

    	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    	var firstDay = new Date(y, m, 2);
		var lastDay = new Date(y, m+1, 1);

        var formatted_data_organic = {};
        var formatted_data_partner = {};


	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		
	 		firstDay = from_date.toISOString();
	 		lastDay = to_date.toISOString();

	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay,
			'city': city,
			'leadsource': leadsource,
			'service_id': service
		};

		console.log(whereServiceArr);

		var orderByService = { created_on: -1 };

		var match_field = {'match_field': 'created_on'};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		LeadManagerService.groupByDateOrganic(data).then(function(response){
			
			var organic_data_count = response.data.message.length;

				var organic_res_data = response.data.message;
				$scope.organic_booking_data = organic_res_data;
				formatted_data_organic = formatDataforColumnCharts(organic_res_data);

				LeadManagerService.groupByDatePartner(data).then(function(resp){

					var partner_data_count = resp.data.message.length;

					//if(partner_data_count > 0) {

						var partner_res_data = resp.data.message;
						$scope.partner_booking_data = partner_res_data;
						formatted_data_partner = formatDataforColumnCharts(partner_res_data);


						    var areaChartOptions = {
						        chart: {
						            type: 'column'
						        },
						        title: {
						            text: 'Organic Vs Partner'
						        },
						        
						        xAxis: {
						            lineWidth: 2,
						            type: 'datetime'
						        },
						        yAxis: {
						            min: 0,
						            title: {
						                text: 'Total No of Orders'
						            },
						            stackLabels: {
						                enabled: true,
						                style: {
						                    fontWeight: 'bold',
						                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
						                }
						            }
						        },
						        tooltip: {
						            formatter: function () {
						                return '<b>' + moment(this.x).format("DD-MM-YYYY") + '</b><br/>' +
						                    this.series.name + ' Orders: ' + this.y + '<br/>' +
						                    'Revenue: ' + this.point.revenue;
						            }
						        },
						        plotOptions: {
						            column: {
						                stacking: 'normal',
						                dataLabels: {
						                    enabled: true,
						                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
						                    style: {
						                        textShadow: '0 0 3px black, 0 0 3px black'
						                    }
						                }
						            }
						        },
						        series:[
						        {
							         name: 'Organic',
							         color: '#337ab7',
							         data: formatted_data_organic,
						      	},
						        {
							         name: 'Partner',
							         color: '#d9534f',
							         data: formatted_data_partner,
						      	}
						      ]
						    };



							Highcharts.chart('column_chart', areaChartOptions);





					//}					

				});


		});


    }


    function plotcolumnchart_revenue(city='',leadsource='',service='',start_date='',end_date='') {

    	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    	var firstDay = new Date(y, m, 2);
		var lastDay = new Date(y, m+1, 1);

        var formatted_data_organic = {};
        var formatted_data_partner = {};


	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		
	 		firstDay = from_date.toISOString();
	 		lastDay = to_date.toISOString();

	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay,
			'city': city,
			'leadsource': leadsource,
			'service_id': service,
			'invoice_sent': 1
		};

		console.log(whereServiceArr);

		var orderByService = { created_on: -1 };

		var match_field = {'match_field': 'created_on'};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		LeadManagerService.groupByDateOrganic(data).then(function(response){
			
			var organic_data_count = response.data.message.length;

				var organic_res_data = response.data.message;
				$scope.organic_booking_data = organic_res_data;
				formatted_data_organic = formatDataforColumnCharts(organic_res_data);

				LeadManagerService.groupByDatePartner(data).then(function(resp){

					var partner_data_count = resp.data.message.length;

					//if(partner_data_count > 0) {

						var partner_res_data = resp.data.message;
						$scope.partner_booking_data = partner_res_data;
						formatted_data_partner = formatDataforColumnCharts(partner_res_data);


						    var areaChartOptions = {
						        chart: {
						            type: 'column'
						        },
						        title: {
						            text: 'Organic Vs Partner'
						        },
						        
						        xAxis: {
						            lineWidth: 2,
						            type: 'datetime'
						        },
						        yAxis: {
						            min: 0,
						            title: {
						                text: 'Total No of Orders'
						            },
						            stackLabels: {
						                enabled: true,
						                style: {
						                    fontWeight: 'bold',
						                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
						                }
						            }
						        },
						        tooltip: {
						            formatter: function () {
						                return '<b>' + moment(this.x).format("DD-MM-YYYY") + '</b><br/>' +
						                    this.series.name + ' Orders: ' + this.y + '<br/>' +
						                    'Revenue: ' + this.point.revenue;
						            }
						        },
						        plotOptions: {
						            column: {
						                stacking: 'normal',
						                dataLabels: {
						                    enabled: true,
						                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
						                    style: {
						                        textShadow: '0 0 3px black, 0 0 3px black'
						                    }
						                }
						            }
						        },
						        series:[
						        {
							         name: 'Organic',
							         color: '#337ab7',
							         data: formatted_data_organic,
						      	},
						        {
							         name: 'Partner',
							         color: '#d9534f',
							         data: formatted_data_partner,
						      	}
						      ]
						    };



							Highcharts.chart('column_chart', areaChartOptions);





					//}					

				});


		});


    }


    function plotpiechart_leadsourcewise(city='',leadsource='',service='',start_date='',end_date='') {

    	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    	var firstDay = new Date(y, m, 2);
		var lastDay = new Date(y, m+1, 1);

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		
	 		firstDay = from_date.toISOString();
	 		lastDay = to_date.toISOString();

	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay,
			'city': city,
			'leadsource': leadsource,
			'service_id': service
		};

		var orderByService = { created_on: -1 };

		var match_field = {'match_field': 'leadsource'};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		LeadManagerService.groupByLeadSource(data).then(function(response){
						
			var res_data = response.data.message;
			if(res_data.length > 0) {
			var formatted_data = formatLeadSourceWiseData(res_data,lead_source_options);
				createPieChart(formatted_data,'lead_source_wise');
			}

		});


    }


    function plotpiechart_leadsourcewise_revenue(city='',leadsource='',service='',start_date='',end_date='') {

    	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    	var firstDay = new Date(y, m, 2);
		var lastDay = new Date(y, m+1, 1);

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		
	 		firstDay = from_date.toISOString();
	 		lastDay = to_date.toISOString();

	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay,
			'city': city,
			'leadsource': leadsource,
			'service_id': service,
			'invoice_sent': 1
		};

		var orderByService = { created_on: -1 };

		var match_field = {'match_field': 'leadsource'};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		LeadManagerService.groupByLeadSource(data).then(function(response){
						
			var res_data = response.data.message;
			if(res_data.length > 0) {
			var formatted_data = formatLeadSourceWiseData(res_data,lead_source_options);
				createPieChart(formatted_data,'lead_source_wise');
			}

		});


    }

    function plotpiechart_leadstagebooking(city='',leadsource='',service='',start_date='',end_date='') {

    	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    	var firstDay = new Date(y, m, 2);
		var lastDay = new Date(y, m+1, 1);

	 	if((start_date != undefined && start_date != null && start_date != "") && (end_date != undefined && end_date != null && end_date != "")) {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		
	 		firstDay = from_date.toISOString();
	 		lastDay = to_date.toISOString();

	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay,
			'city': city,
			'leadsource': leadsource,
			'service_id': service
		};

		var orderByService = { created_on: -1 };

		var match_field = {};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		LeadManagerService.groupByLeadStage(data).then(function(response){
			
			// console.log(response);

			var res_data = response.data.message;

			if(res_data.length > 0) {
				var formatted_data = formatLeadStageWiseData(res_data,lead_stage_options);
				console.log(formatted_data);
				createPieChart(formatted_data.orders,"lead_pie_chart","Order Converted");
                createPieChart(formatted_data.revenue,"lead_data_chart");
			}

		});


    }

    function plotpiechart_leadstagebooking_revenue(city='',leadsource='',service='',start_date='',end_date='') {

    	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    	var firstDay = new Date(y, m, 2);
		var lastDay = new Date(y, m+1, 1);

	 	if((start_date != undefined && start_date != null && start_date != "") && (end_date != undefined && end_date != null && end_date != "")) {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		
	 		firstDay = from_date.toISOString();
	 		lastDay = to_date.toISOString();

	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay,
			'city': city,
			'leadsource': leadsource,
			'service_id': service,
			'invoice_sent': 1
		};

		var orderByService = { created_on: -1 };

		var match_field = {};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		LeadManagerService.groupByLeadStage(data).then(function(response){
			
			// console.log(response);

			var res_data = response.data.message;

			if(res_data.length > 0) {
				var formatted_data = formatLeadStageWiseData(res_data,lead_stage_options);
				console.log(formatted_data);
				createPieChart(formatted_data.orders,"lead_pie_chart","Order Converted");
                createPieChart(formatted_data.revenue,"lead_data_chart");
			}

		});


    }



    function createPieChart(response,container,seriesname='Bookings'){

    	var plotChartOptions = {
	        chart: {
	            plotBackgroundColor: null,
	            plotBorderWidth: null,
	            plotShadow: false,
	            type: 'pie'
	        },
	        title: {
	            text: ''
	        },
	        tooltip: {
	            pointFormat: '{series.name}%: <b>{point.percentage:.1f}%</b><br/>{series.name}: <b>{point.y}'
	        },
	        plotOptions: {
	            pie: {
	                allowPointSelect: true,
	                cursor: 'pointer',
	                dataLabels: {
	                    enabled: true,
	                   
	                    format: '<b>{point.name}</b>',
	                    style: {
	                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	                    }
	                }
	            }
	        },
	        series: [{
	            name: seriesname,
	            colorByPoint: true,
	            data: response,
	        }]
	    };

	    Highcharts.chart(container, plotChartOptions);
	}

});



function numDifferentiation(val) {
    val = parseFloat(val);
    if(val >= 10000000) val = (val/10000000).toFixed(2) + ' Cr';
    else if(val >= 100000) val = (val/100000).toFixed(2) + ' L';
    else if(val >= 1000) val = (val/1000).toFixed(2) + ' K';
    return val;
}


function formatDataforCharts(response){

    var data = [];
    // [data:moment(response[i].dt, "YYYY-MM-DD").valueOf(),
    for(var i=0;i<response.length;i++){

        var obj = {};
        obj = {x:moment(response[i]['_id'], "YYYY-MM-DD").add(1,'days').valueOf(),y:response[i].pretotal,orders:parseInt(response[i].fieldCount)};
        data[i] = obj;
    }
    data.sort(function(a, b){
    var keyA = new Date(a.x),
        keyB = new Date(b.x);
    // Compare the 2 dates
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
    })
    return data;
}

function formatDataforColumnCharts(response){

    var data = [];
    // [data:moment(response[i].dt, "YYYY-MM-DD").valueOf(),
    for(var i=0;i<response.length;i++){

        var obj = {};
        obj = {x:moment(response[i]['_id'], "YYYY-MM-DD").valueOf(),y:response[i].fieldCount,revenue:parseInt(response[i].posttotal)};
        data[i] = obj;
    }
    data.sort(function(a, b){
    var keyA = new Date(a.x),
        keyB = new Date(b.x);
    // Compare the 2 dates
    if(keyA < keyB) return -1;
    if(keyA > keyB) return 1;
    return 0;
    })
    return data;
}


function formatLeadSourceWiseData(resp,master_resp){

    var formatted_data =[];
    for(var i =0; i< resp.length;i++){
        formatted_data[i] = {name: master_resp[resp[i]['_id']],total_orders:resp[i].fieldCount,y:parseInt(parseFloat(resp[i].pretotal).toFixed(2))};
    }

    // debugger;
    return formatted_data;

}


function formatLeadStageWiseData(resp,lead_stage_options){

    var formatted_data =[];
    var formatted_data_orders =[];
    var myNewArray = [];
    var closedEstimate =0;
    var closedTotal =0;
    var testArray = resp;
    var removeIndx = [];
    var color = "#007042"
    

    

    for (var i =0; i< resp.length;i++){

        if(resp[i]['_id']==17 || resp[i]['_id']==31||resp[i]['_id']==32){
            closedEstimate = closedEstimate + parseInt(resp[i].posttotal);
            closedTotal = closedTotal + parseInt(resp[i].fieldCount);             
        }

        else{
            myNewArray.push(resp[i]);
        }

    };

        myNewArray.push({posttotal:closedEstimate.toString(),_id:"17",fieldCount:closedTotal.toString()})
    // console.log(myNewArray);
    for(var i =0; i< myNewArray.length;i++){
        
        if (myNewArray[i]['_id'] ==17) {
            color = "red";
        };



        formatted_data[i] = {name: lead_stage_options[myNewArray[i]['_id']],total_orders:myNewArray[i].fieldCount,y:parseInt(myNewArray[i].posttotal),color:color};
        formatted_data_orders[i] = {name: lead_stage_options[myNewArray[i]['_id']],y:parseInt(myNewArray[i].fieldCount),revenue:parseInt(myNewArray[i].posttotal),color:color};
    }

    // debugger;
    return {revenue:formatted_data,orders:formatted_data_orders};

}