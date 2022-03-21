angular.module('MIS', []).controller('MISController', function($scope,$timeout,$routeParams,$route,$location,OrderService,MISService,LeadManagerService,LeadService,CacheService) {

 	$scope.total_bookings = 0;
 	$scope.total_booking_revenue = 0;
 	$scope.total_average_order_value = 0;

 	$scope.today_total_bookings = 0;
 	$scope.today_total_booking_revenue = 0;
 	$scope.today_average_order_value = 0;

 	$scope.new_lead_count = 0;
 	$scope.cancelled_order_count = 0;

 	$scope.total_organic_order_count = 0;
	$scope.total_organic_order_bookings = 0;

 	$scope.total_partner_order_count = 0;
	$scope.total_partner_order_bookings = 0;

	$scope.ajaxResponse = [];

 	var lead_source_options = {};
 	var lead_stage_options = {};
 	$scope.months = [];

 	$scope.citywisedata = [];
 	$scope.industrywisedata = [];
 	$scope.new_client_data = [];
 	$scope.existing_client_data = [];
 	$scope.leaddatabasedata = [];
 	$scope.leaddatabasespocdata = [];

 	var c_dt = new Date(), c_mon = c_dt.getMonth()+1, yr = c_dt.getFullYear();



 	var condition = {};

 	drawCValueBarChart();
 	drawTargetHitColumnChart();
 	makeColumnData();


 	// if($route.current.action == 'open') {

 	// 	condition = { status: 0 };
 	// 	drawColumnChart(condition, 0);

 	// }


 	// if($route.current.action == 'won') {

 	// 	condition = { status: 1 };
 	// 	drawColumnChart(condition, 1);

 	// }


 	// if($route.current.action == 'lost') {

 	// 	condition = { status: 3 };
 	// 	drawColumnChartLost(condition);

 	// }

 	var month_no = {
 		1: 'Jan',
 		2: 'Feb',
 		3: 'Mar',
 		4: 'Apr',
 		5: 'May',
 		6: 'Jun',
 		7: 'Jul',
 		8: 'Aug',
 		9: 'Sep',
 		10: 'Oct',
 		11: 'Nov',
 		12: 'Dec',
 	};


 	for (var i = 1; i <=12; i++) {
 		
 		$scope.months.push({ m: i, m_name: month_no[i]+' '+yr });

 	}




 	$scope.filterResult = function(status,flag) {

	 	condition = { status: status };

 		if($scope.from_date != undefined && $scope.from_date != null && $scope.from_date != "") {
 			condition.from_date = $scope.from_date;
 		}

 		if($scope.to_date != undefined && $scope.to_date != null && $scope.to_date != "") {
 			condition.to_date = $scope.to_date;
 		}

 		if($scope.month_filter != undefined && $scope.month_filter != null && $scope.month_filter != "") {

 			if($scope.month_filter.length > 0) {

 				condition.month_filter = angular.toJson($scope.month_filter);

 			}

 		}

 		console.log($scope.month_filter);
 		console.log(condition);

 		drawColumnChart(condition, flag);

 	};

 	$scope.filterResultLost = function(status) {

	 	condition = { status: status };

 		if($scope.from_date != undefined && $scope.from_date != null && $scope.from_date != "") {
 			condition.from_date = $scope.from_date;
 		}

 		if($scope.to_date != undefined && $scope.to_date != null && $scope.to_date != "") {
 			condition.to_date = $scope.to_date;
 		}

 		console.log(condition);

 		drawColumnChartLost(condition);

 	};


 	function makeColumnData() {

 		LeadService.getLeadSCityMis(condition).then(function(response){

	 		if(response != null && response.data != null) {
	 			$scope.citywisedata = response.data;
	 		}

	 	});

	 	LeadService.getLeadIndustryMis(condition).then(function(response){

	 		if(response != null && response.data != null) {
	 			$scope.industrywisedata = response.data;
	 		}

	 	});

	 	condition = { client_type: 'new_client' }
	 	LeadService.getNewExistingSPOCMis(condition).then(function(response){

	 		if(response != null && response.data != null) {
	 			$scope.new_client_data = response.data;
	 		}

	 	});

	 	condition = { client_type: 'existing_client' }
	 	LeadService.getNewExistingSPOCMis(condition).then(function(response){

	 		if(response != null && response.data != null) {
	 			$scope.existing_client_data = response.data;
	 		}

	 	});

	 	LeadService.getLeadDatabaseSPOCMis(condition).then(function(response){

	 		if(response != null && response.data != null) {
	 			$scope.leaddatabasedata = response.data;
	 		}

	 	});

	 	LeadService.getLostLeadMis(condition).then(function(response){

	 		console.log(response);
	 		if(response != null && response.data != null &&  response.data.data != null) {
	 			$scope.leaddatabasespocdata = response.data.data;
	 			$scope.reasons = response.data.reasons;
	 		}

	 	});


 	}


 	function drawColumnChartLost(condition) {


 		LeadService.getLostLeadMis(condition).then(function(response){

	 			// console.log(response.data);
	 			var reason_data = dataforColumnCharts(response.data,'reason');

	 			console.log(reason_data);

	 			var areaChartOptions = {
			        chart: {
			            type: 'column'
			        },
			        title: {
			            text: 'Reason Wise'
			        },
			        xAxis: {
				        type: 'category',
				        labels: {
				            rotation: 0,
				            style: {
				                fontSize: '13px',
				                fontFamily: 'Verdana, sans-serif'
				            }
				        }
				    },
			        yAxis: {
				        min: 0,
				        title: {
				            text: 'Total deal size'
				        },
				        labels: {
			                formatter: function () {
			                    return numDifferentiationYAxis(this.value);
			                }            
			            }
				    },
				    tooltip: {
			            formatter: function () {
			                return '<b>' + this.point.name + '</b><br/>' +
			                    ' Total deal size: ' + numDifferentiation(this.y) + '<br/>' +
			                    'No. of leads: ' + this.point.count;
			            }
			        },
			        series:[
			        {
				         name: "Reasons",
				         color: '#337ab7',
				         data: reason_data
			      	}
			      ]
			    };



				Highcharts.chart('reason_column_chart', areaChartOptions);



	 	});

 	}

 	$scope.filterTargetHits = function() {
 		drawTargetHitColumnChart();
 	};

 	function drawTargetHitColumnChart() {

 		condition = {};
 		if($scope.month_filter != undefined && $scope.month_filter != null && $scope.month_filter != "") {
 			condition.month = $scope.month_filter;
 		}

 		LeadService.getTargetHitSPOCMis(condition).then(function(response){

 			console.log(response.data.spoc_lists_data);
 			var spoc_data = [];
 			if(response != undefined && response.data.spoc_lists_data != undefined && response.data.spoc_lists_data.length > 0) {
 				spoc_data = dataforColumnCharts(response.data.spoc_lists_data, 'spoc')
 				$scope.month_filter = response.data.month;
 			} else {
 				spoc_data = [];
 			}

 			console.log(spoc_data);

 			var areaChartOptions = {
		        chart: {
		            type: 'column'
		        },
		        title: {
		            text: 'Target Hits'
		        },
		        xAxis: {
			        type: 'category',
			        labels: {
			            rotation: -45,
			            style: {
			                fontSize: '13px',
			                fontFamily: 'Verdana, sans-serif'
			            }
			        }
			    },
		        yAxis: {
			        min: 0,
			        title: {
			            text: 'Total target hits'
			        },
			        labels: {
		                formatter: function () {
		                    return numDifferentiationYAxis(this.value);
		                }            
		            }
			    },
			    tooltip: {
		            formatter: function () {
		                return '<b>' + this.point.name + '</b><br/>' +
		                    ' Total target hits: ' + numDifferentiation(this.y);
		            }
		        },
		        series:[
		        {
			         name: "Lead Owners",
			         color: '#337ab7',
			         data: spoc_data
		      	}
		      ]
		    };



			Highcharts.chart('spoc_column_chart', areaChartOptions);



	 	});

 	}

 	function drawCValueBarChart() {

 		LeadService.getLeadCInfoMis(condition).then(function(response){

 			debugger;
 			console.log(response.data);
 			debugger;

 			var c0_list = response.data.c0_lists;
 			console.log(c0_list);
 			debugger;

 			var c1_list = response.data.c1_lists;
			console.log(c1_list);
 			debugger;

 			var c2_list = response.data.c2_lists;
			console.log(c2_list);
 			debugger;

 			var c3_list = response.data.c3_lists;
			console.log(c3_list);
 			debugger;

 			var spoc_lists = response.data.spoc_lists;
			console.log(spoc_lists);
 			debugger;	 
 					

				var areaChartOptions = {
		        chart: {
			      type: 'column'
			    },
			    title: {
			      text: 'C0/C1/C2/C3'
			    },
			    tooltip: {
		            formatter: function () {
		                return '<b>' + this.point.spoc + '</b><br/>' +
		                    ' Total ' + this.point.name.toUpperCase() + ' value : ' + numDifferentiation(this.y);
		            }
		        },
			    plotOptions: {
			      	series: {
						pointWidth: 15
					}
			    },
			    xAxis: {
			      categories: spoc_lists
			    },
			    series: [{
			      	name: 'C0',
					color: 'rgba(0,155,255,1)',
					data: c0_list
			    }, {
			      	name: 'C1',
					color: 'rgba(253,99,0,1)',
					data: c1_list
			    }, {
			      	name: 'C2',
					color: 'rgba(27,248,64,1)',
					data: c2_list
			    }, {
			      	name: 'C3',
					color: 'rgba(0,0,0,1)',
					data: c3_list
			    }]
		    };

		    debugger;


		    Highcharts.chart('cvalue_bar_chart', areaChartOptions);




 		});

 	}


 	function drawColumnChart(condition, flag) {

	 	if(flag == 0) {

	 		LeadService.getLeadSPOCStageMis(condition).then(function(response){

	 			debugger;
	 			console.log(response.data);
	 			debugger;

	 			var in_the_zone_list = response.data.in_the_zone_lists;
	 			console.log(in_the_zone_list);
	 			debugger;

	 			var verbal_yes_list = response.data.verbal_yes_lists;
				console.log(verbal_yes_list);
	 			debugger;

	 			var spoc_lists = response.data.spoc_lists;
				console.log(spoc_lists);
	 			debugger;	 
	 					

 				var areaChartOptions = {
			        chart: {
				      type: 'column'
				    },
				    title: {
				      text: 'In The Zone/Verbal Yes Leads'
				    },
				    tooltip: {
			            formatter: function () {
			                return '<b>' + this.point.spoc + '</b><br/>' +
			                    ' Total deal size: ' + numDifferentiation(this.y) + '<br/>' +
			                    'No. of leads: ' + this.point.count;
			            }
			        },
				    plotOptions: {
				      	series: {
							pointWidth: 15
						}
				    },
				    xAxis: {
				      categories: spoc_lists
				    },
				    series: [{
				      	name: 'In The Zone',
						color: 'rgba(0,155,255,1)',
						data: in_the_zone_list
				    }, {
				      	name: 'Verbal Yes',
						color: 'rgba(253,99,0,1)',
						data: verbal_yes_list
				    }]
			    };

			    debugger;


			    Highcharts.chart('spoc_stage_column_chart', areaChartOptions);




	 		});

	 	}

 		

 		if(flag == 0 || flag == 1) {

	 	LeadService.getLeadSPOCMis(condition).then(function(response){

	 			// console.log(response.data);
	 			var spoc_data = [];
	 			if(response != undefined && response.data != undefined && response.data.length > 0) {
	 				spoc_data = dataforColumnCharts(response.data,'spoc');
	 			} else {
	 				spoc_data = [];
	 			}

	 			console.log(spoc_data);

	 			var areaChartOptions = {
			        chart: {
			            type: 'column'
			        },
			        title: {
			            text: 'Lead Owner Wise'
			        },
			        xAxis: {
				        type: 'category',
				        labels: {
				            rotation: -45,
				            style: {
				                fontSize: '13px',
				                fontFamily: 'Verdana, sans-serif'
				            }
				        }
				    },
			        yAxis: {
				        min: 0,
				        title: {
				            text: 'Total deal size'
				        },
				        labels: {
			                formatter: function () {
			                    return numDifferentiationYAxis(this.value);
			                }            
			            }
				    },
				    tooltip: {
			            formatter: function () {
			                return '<b>' + this.point.name + '</b><br/>' +
			                    ' Total deal size: ' + numDifferentiation(this.y) + '<br/>' +
			                    'No. of leads: ' + this.point.count;
			            }
			        },
			        series:[
			        {
				         name: "Lead Owners",
				         color: '#337ab7',
				         data: spoc_data
			      	}
			      ]
			    };



				Highcharts.chart('spoc_column_chart', areaChartOptions);



	 	});

	 	}


	 	if(flag == 0 || flag == 1) {

	 	LeadService.getLeadIndustryMis(condition).then(function(response){

	 			// console.log(response.data);
	 			var industry_data = dataforColumnCharts(response.data,'industry');

	 			console.log(industry_data);

	 			var areaChartOptions = {
			        chart: {
			            type: 'column'
			        },
			        title: {
			            text: 'Industry Wise'
			        },
			        xAxis: {
				        type: 'category',
				        labels: {
				            rotation: -45,
				            style: {
				                fontSize: '13px',
				                fontFamily: 'Verdana, sans-serif'
				            }
				        }
				    },
				    yAxis: {
				        min: 0,
				        title: {
				            text: 'Total deal size'
				        },
				        labels: {
			                formatter: function () {
			                    return numDifferentiationYAxis(this.value);
			                }            
			            }
				    },
				    tooltip: {
			            formatter: function () {
			                return '<b>' + this.point.name + '</b><br/>' +
			                    ' Total deal size: ' + numDifferentiation(this.y) + '<br/>' +
			                    'No. of leads: ' + this.point.count;
			            }
			        },
			        series:[
			        {
				         name: "Industry",
				         color: '#337ab7',
				         data: industry_data
			      	}
			      ]
			    };



				Highcharts.chart('industry_column_chart', areaChartOptions);

	 	});

	 	}

	 	if(flag == 0 || flag == 1) {

	 	LeadService.getLeadSCityMis(condition).then(function(response){

	 			// console.log(response.data);
	 			var industry_data = dataforColumnCharts(response.data,'city');

	 			console.log(industry_data);

	 			var areaChartOptions = {
			        chart: {
			            type: 'column'
			        },
			        title: {
			            text: 'City Wise'
			        },
			        xAxis: {
				        type: 'category',
				        labels: {
				            rotation: -45,
				            style: {
				                fontSize: '13px',
				                fontFamily: 'Verdana, sans-serif'
				            }
				        }
				    },
				    yAxis: {
				        min: 0,
				        title: {
				            text: 'Total deal size'
				        },
				        labels: {
			                formatter: function () {
			                    return numDifferentiationYAxis(this.value);
			                }            
			            }
				    },
				    tooltip: {
			            formatter: function () {
			                return '<b>' + this.point.name + '</b><br/>' +
			                    ' Total deal size: ' + numDifferentiation(this.y) + '<br/>' +
			                    'No. of leads: ' + this.point.count;
			            }
			        },
			        series:[
			        {
				         name: "City",
				         color: '#337ab7',
				         data: industry_data
			      	}
			      ]
			    };



				Highcharts.chart('city_column_chart', areaChartOptions);

	 	});

	 	}


	 	if(flag == 0) {


	 	LeadService.getLeadSalesStageMis(condition).then(function(response){

	 			// console.log(response.data);
	 			var sales_stage_data = dataforColumnCharts(response.data,'sales_stage');

	 			console.log(sales_stage_data);

	 			var areaChartOptions = {
			        chart: {
			            type: 'column'
			        },
			        title: {
			            text: 'Sales Stage Wise'
			        },
			        xAxis: {
				        type: 'category',
				        labels: {
				            rotation: -45,
				            style: {
				                fontSize: '13px',
				                fontFamily: 'Verdana, sans-serif'
				            }
				        }
				    },
			        yAxis: {
				        min: 0,
				        title: {
				            text: 'Total deal size'
				        },
				        labels: {
			                formatter: function () {
			                    return numDifferentiationYAxis(this.value);
			                }            
			            }
				    },
				    tooltip: {
			            formatter: function () {
			                return '<b>' + this.point.name + '</b><br/>' +
			                    ' Total deal size: ' + numDifferentiation(this.y) + '<br/>' +
			                    'No. of leads: ' + this.point.count;
			            }
			        },
			        series:[
			        {
				         name: "Sales Stage",
				         color: '#337ab7',
				         data: sales_stage_data
			      	}
			      ]
			    };



				Highcharts.chart('sales_stage_column_chart', areaChartOptions);



	 	});

	 	}



 	}


 // 	CacheService.getCache({key: ['leadstage','leadsource','city','pricelist','category']}).then(function(response){
 //      lead_source_options = response.data.message.leadsource;
 //      lead_stage_options = response.data.message.leadstage;
 //      $scope.cities = response.data.message.city;
 //      $scope.ls_options = lead_source_options;
 //      $scope.services_options = response.data.message.pricelist;
 //      $scope.category_options = response.data.message.category;
 //      //console.log(lead_source_options);
 //      //console.log(lead_stage_options);
 //      console.log($scope.category_options);
 //    });

 //    $scope.cancellation_reasons = {
 //      1: 'Travelling',
 //      2: 'Booked with Other provider',
 //      3: 'Low Budget',
 //      4: 'No Reasons',
 //      5: 'Unhappy termination',
 //      6: 'No Show Cancellations',
 //      7: 'Family Emergency',
 //      8: 'Cancelled by Ops',
 //      9: 'Tentative Booking',
 //      10: 'Others'
 //    };


 // 	if($route.current.action == 'bs') {
	//     fillSummaryGroupBoxes1();
	// 	fillSummaryGroupBoxes2();    
	//     plotareachart();
	//     plotpiechart_leadsourcewise();
	//     plotpiechart_cancellation();
	//     plotpiechart_leadstagebooking();
	// }

	// if($route.current.action == 'cwb') {
	//     plotareachart_categorywise();
	// }

	// if($route.current.action == 'cwr') {
	//     plotareachart_categorywise_revenue();
	// }

	// if($route.current.action == 'bovp') {
	//     fillSummaryGroupBoxes_Organic();
	// 	fillSummaryGroupBoxes_Partner();    
	// 	plotcolumnchart();
	//     //plotpiechart_leadsourcewise();
	//     //plotpiechart_leadstagebooking();
	// }

 // 	if($route.current.action == 'rs') {
	//     fillSummaryGroupBoxes1_revenue();
	// 	fillSummaryGroupBoxes2_revenue(); 
	// 	getLeadCount();   
	// 	countCancelledOrder();
	//     plotareachart_revenue();
	//     plotpiechart_leadsourcewise_revenue();
	//     plotpiechart_leadstagebooking_revenue();
	// }

	// if($route.current.action == 'rovp') {
	//     fillSummaryGroupBoxes_Organic_revenue();
	// 	fillSummaryGroupBoxes_Partner_revenue();    
	// 	plotcolumnchart_revenue();
	//     //plotpiechart_leadsourcewise();
	//     //plotpiechart_leadstagebooking();
	// }


    $scope.filterData = function() {

    	fillSummaryGroupBoxes1($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
    	fillSummaryGroupBoxes2($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,'','',$scope.filter_client_type);
    	plotareachart($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
    	plotpiechart_leadsourcewise($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
    	plotpiechart_leadstagebooking($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);

    };

    $scope.filterData_Revenue = function() {

    	fillSummaryGroupBoxes1_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
    	fillSummaryGroupBoxes2_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,'','',$scope.filter_client_type);
    	getLeadCount($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.filter_client_type);
    	countCancelledOrder($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.filter_client_type);
    	plotareachart_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
    	plotpiechart_leadsourcewise_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
    	plotpiechart_leadstagebooking_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);

    };

    $scope.filterDataOP = function() {
    	fillSummaryGroupBoxes_Organic($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
		fillSummaryGroupBoxes_Partner($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);    
		plotcolumnchart($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
    }

    $scope.filterDataOP_Revenue = function() {
    	fillSummaryGroupBoxes_Organic_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
		fillSummaryGroupBoxes_Partner_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);    
		plotcolumnchart_revenue($scope.filter_city,$scope.filter_leadsource,$scope.filter_service,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
    }

    $scope.filterDataCB = function() {
		plotareachart_categorywise($scope.filter_city,$scope.filter_leadsource,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
    }

    $scope.filterDataCR = function() {
		plotareachart_categorywise_revenue($scope.filter_city,$scope.filter_leadsource,$scope.from_sdate,$scope.to_sdate,$scope.filter_client_type);
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

    function getLeadCount(city='',leadsource='',service='',start_date='',end_date='',client_type='') {

    	var searchVal = {
	 		'status': 0
	 	};

	 	var service_id_arr = [];

	 	if(city != undefined && city != null && city != "") {
	 		searchVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchVal.service_id = service;
	 	}

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		searchVal.client_type = client_type;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && (end_date != undefined && end_date != null && end_date != "")) {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	} else {
	 		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	 		var from_date = new Date(y, m, 1);
	 		var to_date = new Date(y, m + 1, 0);
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}	 		
	 	}

	 	// searchVal.leadsource = {'$ne': null};
	 	// searchVal.leadsource = {'$ne': ""};

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

	    console.log(data);

	    LeadManagerService.getLeads(data).then(function(response){

	    	var lead_count = response.data.message.length;
	    	var lead_arr = response.data.message;
	    	var closed_service_count = 0;
	    	var new_leads_count = 0;

	    	console.log(response);

	    	if(lead_count > 0) {

	    		for (var i = 0; i < lead_count; i++) {
	    			
	    			closed_service_count = countClosedService(lead_arr[i]['service_obj']);
	    			if(closed_service_count > 1) {

	    				new_leads_count++;

	    			}

	    		};

	    		$scope.new_lead_count = new_leads_count;

	    	} else {

	    		$scope.new_lead_count = 0;
	    	}

	    });


    }


    function countCancelledOrder(city='',leadsource='',service='',start_date='',end_date='',client_type='') {

	 	var searchVal = {
	 		'status': -1	 		
	 	};

	 	var service_id_arr = [];

	 	if(city != undefined && city != null && city != "") {
	 		searchVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchVal.service_id = service;
	 	}

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		searchVal.client_type = client_type;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && (end_date != undefined && end_date != null && end_date != "")) {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	} else {
	 		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	 		var from_date = new Date(y, m, 1);
	 		var to_date = new Date(y, m + 1, 0);
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}	 		
	 	}

	 	// searchVal.leadsource = {'$ne': null};
	 	// searchVal.leadsource = {'$ne': ""};

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

	      //console.log(data);

	 	LeadManagerService.getAllServices(data).then(function(response){
	 		console.log(response);
	 		var order_count = response.data.message.length;
	 		if(order_count > 0) {

	 			$scope.cancelled_order_count = order_count;

	 			//$scope.total_bookings = order_count;
	 			//var orders = response.data.message;

	 			// for (var i = orders.length - 1; i >= 0; i--) {
	 			// 	//console.log(orders[i]['_id'] + ' : ' + orders[i]['invoice_sent'] + ' : ' + orders[i]['taxed_cost']);
	 			// 	if(orders[i]['pre_taxed_cost'] != null && orders[i]['pre_taxed_cost'] != "") {
 				// 		taxed_cost_sum = taxed_cost_sum + orders[i]['pre_taxed_cost'];
 				// 	}

 				// 	service_id_arr.push(orders[i]['_id']);
	 			// };

	 			// $scope.total_booking_revenue = numDifferentiation(taxed_cost_sum);


	 			// LeadManagerService.getServiceLeads(data).then(function(res){

	 			// 	//console.log(res);

	 			// 	// //debugger;
	 			// 	var lead_count = res.data.message.length;
	 			// 	var lead_arr = res.data.message;
	 			// 	var lead_id_arr = [];

	 			// 	// if(lead_count > 0) {

 				// 	for (var i = 0; i < lead_arr.length; i++) {
 				// 		//console.log(lead_arr[i]['_id'] + ' : ' + lead_arr[i]['created_on']);
 				// 		lead_id_arr.push(lead_arr[i]['_id']);
 				// 	};

	 			// 	 	//console.log('------------------------------------------------------------');

	 			// 		// for (var i = 0; i < lead_id_arr.length; i++) {
	 			// 		// 	console.log(lead_id_arr[i]);
	 			// 		// };

	 			// 		//console.log(lead_count);

	 			// 	 	//console.log('------------------------------------------------------------');

	 			// 		var unique_lead_arr = lead_id_arr.filter(function(elem, index, self) {
					// 	    return index == self.indexOf(elem);
					// 	});

					// 	//console.log(unique_lead_arr.length);

	 			// 	// 	for (var i = 0; i < unique_lead_arr.length; i++) {
	 			// 	// 		console.log(unique_lead_arr[i]);
	 			// 	// 	};

	 			// 	// 	console.log('------------------------------------------------------------');

	 			// 		var total_aov = taxed_cost_sum / unique_lead_arr.length;
	 			// 		$scope.total_bookings = unique_lead_arr.length;
	 			// 		$scope.total_average_order_value = numDifferentiation(total_aov);

	 			// 	// }

	 			// });



	 		} else {
	 			$scope.cancelled_order_count = 0;
	 		}
	 	});




    }



    function fillSummaryGroupBoxes1(city='',leadsource='',service='',start_date='',end_date='', client_type='') {

	 	var searchVal = {
	 		'status': 0,
	 		'is_order': 1	 		
	 	};

	 	var service_id_arr = [];

	 	if(city != undefined && city != null && city != "") {
	 		searchVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchVal.service_id = service;
	 	}

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		searchVal.client_type = client_type;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && (end_date != undefined && end_date != null && end_date != "")) {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	} else {
	 		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	 		var from_date = new Date(y, m, 1);
	 		var to_date = new Date(y, m + 1, 0);
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}	 		
	 	}

	 	// searchVal.leadsource = {'$ne': null};
	 	// searchVal.leadsource = {'$ne': ""};

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

	      //console.log(data);

	 	LeadManagerService.getAllServices(data).then(function(response){
	 		console.log(response);
	 		var order_count = response.data.message.length;
	 		if(order_count > 0) {
	 			//$scope.total_bookings = order_count;
	 			var orders = response.data.message;

	 			for (var i = orders.length - 1; i >= 0; i--) {
	 				//console.log(orders[i]['_id'] + ' : ' + orders[i]['invoice_sent'] + ' : ' + orders[i]['taxed_cost']);
					console.log(orders[i]['_id'] + ' : ' + orders[i]['invoice_sent'] + ' : ' + orders[i]['client_payment_expected'] + ' : ' + orders[i]['city'] + ' : ' + orders[i]['leadsource']);
	 				if(orders[i]['pre_taxed_cost'] != null && orders[i]['pre_taxed_cost'] != "") {
 						taxed_cost_sum = taxed_cost_sum + orders[i]['pre_taxed_cost'];
 					}

 					service_id_arr.push(orders[i]['_id']);
	 			};

	 			$scope.total_booking_revenue = numDifferentiation(taxed_cost_sum);


	 			LeadManagerService.getServiceLeads(data).then(function(res){

	 				//console.log(res);

	 				// //debugger;
	 				var lead_count = res.data.message.length;
	 				var lead_arr = res.data.message;
	 				var lead_id_arr = [];

	 				// if(lead_count > 0) {

 					for (var i = 0; i < lead_arr.length; i++) {
 						//console.log(lead_arr[i]['_id'] + ' : ' + lead_arr[i]['created_on']);
 						lead_id_arr.push(lead_arr[i]['_id']);
 					};

	 				 	//console.log('------------------------------------------------------------');

	 					// for (var i = 0; i < lead_id_arr.length; i++) {
	 					// 	console.log(lead_id_arr[i]);
	 					// };

	 					//console.log(lead_count);

	 				 	//console.log('------------------------------------------------------------');

	 					var unique_lead_arr = lead_id_arr.filter(function(elem, index, self) {
						    return index == self.indexOf(elem);
						});

						//console.log(unique_lead_arr.length);

	 				// 	for (var i = 0; i < unique_lead_arr.length; i++) {
	 				// 		console.log(unique_lead_arr[i]);
	 				// 	};

	 				// 	console.log('------------------------------------------------------------');

	 					var total_aov = taxed_cost_sum / unique_lead_arr.length;
	 					$scope.total_bookings = unique_lead_arr.length;
	 					$scope.total_average_order_value = numDifferentiation(total_aov);

	 				// }

	 			});



	 		} else {
	 			$scope.total_bookings = 0;
	 			$scope.total_booking_revenue = 0;
	 			$scope.total_average_order_value = 0;
	 		}
	 	});




    }


    function fillSummaryGroupBoxes1_revenue(city='',leadsource='',service='',start_date='',end_date='',client_type='') {

	 	var searchVal = {
	 		'status': 0,
	 		'invoice_sent': 1,
	 		'is_order': 1	 		
	 	};

	 	var service_id_arr = [];

	 	if(city != undefined && city != null && city != "") {
	 		searchVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchVal.service_id = service;
	 	}

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		searchVal.client_type = client_type;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && (end_date != undefined && end_date != null && end_date != "")) {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		//searchVal.service_date = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 		searchVal['$or'] = [{ 'contract_start_date': {"$gte": from_date.toISOString(), "$lte": to_date.toISOString()} }, { 'service_date': {"$gte": from_date.toISOString(), "$lte": to_date.toISOString()} }];
	 	} else {
	 		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	 		var from_date = new Date(y, m, 1);
	 		var to_date = new Date(y, m + 1, 0);
	 		//searchVal.service_date = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}	 		
	 		searchVal['$or'] = [{ 'contract_start_date': {"$gte": from_date.toISOString(), "$lte": to_date.toISOString()} }, { 'service_date': {"$gte": from_date.toISOString(), "$lte": to_date.toISOString()} }];
	 	}

	 	// searchVal.leadsource = {'$ne': null};
	 	// searchVal.leadsource = {'$ne': ""};

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

	      console.log(data);

	 	LeadManagerService.getAllServices(data).then(function(response){
	 		console.log(response);
	 		var order_count = response.data.message.length;
	 		if(order_count > 0) {
	 			$scope.total_bookings = order_count;
	 			var orders = response.data.message;

	 			for (var i = orders.length - 1; i >= 0; i--) {
	 				//console.log(orders[i]['_id'] + ' : ' + orders[i]['invoice_sent'] + ' : ' + orders[i]['taxed_cost']);

	 				if(orders[i]['pre_taxed_cost'] != null && orders[i]['pre_taxed_cost'] != "") {
 						taxed_cost_sum = taxed_cost_sum + orders[i]['pre_taxed_cost'];
 					}

 					service_id_arr.push(orders[i]['_id']);
	 			};

	 			$scope.total_booking_revenue = numDifferentiation(taxed_cost_sum);


	 			LeadManagerService.getServiceLeads(data).then(function(res){

	 				//console.log(res);

	 				// //debugger;
	 				var lead_count = res.data.message.length;
	 				var lead_arr = res.data.message;
	 				var lead_id_arr = [];

	 				// if(lead_count > 0) {

 					for (var i = 0; i < lead_arr.length; i++) {
 						//console.log(lead_arr[i]['_id'] + ' : ' + lead_arr[i]['created_on']);
 						lead_id_arr.push(lead_arr[i]['_id']);
 					};

	 				 	//console.log('------------------------------------------------------------');

	 					// for (var i = 0; i < lead_id_arr.length; i++) {
	 					// 	console.log(lead_id_arr[i]);
	 					// };

	 					console.log(lead_count);

	 				 	//console.log('------------------------------------------------------------');

	 					var unique_lead_arr = lead_id_arr.filter(function(elem, index, self) {
						    return index == self.indexOf(elem);
						});

						console.log(unique_lead_arr.length);

	 				// 	for (var i = 0; i < unique_lead_arr.length; i++) {
	 				// 		console.log(unique_lead_arr[i]);
	 				// 	};

	 				// 	console.log('------------------------------------------------------------');

	 					var total_aov = taxed_cost_sum / unique_lead_arr.length;
	 					$scope.total_bookings = unique_lead_arr.length;
	 					$scope.total_average_order_value = numDifferentiation(total_aov);

	 				// }

	 			});



	 		} else {
	 			$scope.total_bookings = 0;
	 			$scope.total_booking_revenue = 0;
	 			$scope.total_average_order_value = 0;
	 		}
	 	});




    }


    function fillSummaryGroupBoxes_Organic(city='',leadsource='',service='',start_date='',end_date='', client_type='') {


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

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		searchVal.client_type = client_type;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	} else {
	 		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	 		var from_date = new Date(y, m, 1);
	 		var to_date = new Date(y, m + 1, 0);
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

    function fillSummaryGroupBoxes_Organic_revenue(city='',leadsource='',service='',start_date='',end_date='',client_type='') {


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

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		searchVal.client_type = client_type;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	} else {
	 		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	 		var from_date = new Date(y, m, 1);
	 		var to_date = new Date(y, m + 1, 0);
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


    function fillSummaryGroupBoxes_Partner(city='',leadsource='',service='',start_date='',end_date='', client_type='') {


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

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		searchVal.client_type = client_type;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	} else {
	 		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	 		var from_date = new Date(y, m, 1);
	 		var to_date = new Date(y, m + 1, 0);
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


    function fillSummaryGroupBoxes_Partner_revenue(city='',leadsource='',service='',start_date='',end_date='', client_type='') {


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

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		searchVal.client_type = client_type;
	 	}

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		searchVal.created_on = {'$gte': from_date.toISOString(), '$lt': to_date.toISOString()}
	 	} else {
	 		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	 		var from_date = new Date(y, m, 1);
	 		var to_date = new Date(y, m + 1, 0);
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



    function fillSummaryGroupBoxes2(city='',leadsource='',service='',start_date='',end_date='', client_type='') {

		var today_date =  new Date(moment().format('YYYY-MM-DD') + ' 00:00:00');
		var tomorrow_date = moment().add(1,'days').toDate();
		var service_id_arr = [];

	 	var orderBy = {
		    created_on: 1
		};

	 	var paginationSettings = {
	        limit: 0,
	        offset: 0
		};


	 	var searchTodayVal = {
	 		'status': 0,
	 		'is_order': 1,
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

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		searchTodayVal.client_type = client_type;
	 	}

	 	// searchTodayVal.leadsource = {'$ne': null};
	 	// searchTodayVal.leadsource = {'$ne': ""};


	 	console.log(searchTodayVal);

		var dataToday = {
		  	orderBy: orderBy,
		    searchVal: searchTodayVal,
		    paginationSettings: paginationSettings
		};


	 	LeadManagerService.getAllServices(dataToday).then(function(response){
	 		console.log(response.data.message);
	 		var today_order_count = response.data.message.length;
	 		if(today_order_count > 0) {
	 			var orders_arr = response.data.message;
	 			var today_taxed_cost_sum = 0;
	 			//$scope.today_total_bookings = today_order_count;

				for (var i = orders_arr.length - 1; i >= 0; i--) {

	 				if(orders_arr[i]['taxed_cost'] != "" && orders_arr[i]['taxed_cost'] != null) {

						console.log(orders_arr[i]['_id'] + ' : ' + orders_arr[i]['invoice_sent'] + ' : ' + orders_arr[i]['pre_taxed_cost'] + ' : ' + orders_arr[i]['city'] + ' : ' + orders_arr[i]['leadsource']);

	 					today_taxed_cost_sum = today_taxed_cost_sum + orders_arr[i]['pre_taxed_cost'];
		 				service_id_arr.push(orders_arr[i]['_id']);
		 				
	 				}

	 			}; 	

	 			$scope.today_total_booking_revenue = numDifferentiation(today_taxed_cost_sum);

	 			var searchLead = {
	 				'status': 0,
	 				'service_obj': {$in : service_id_arr}
	 			};

	 			var leadOptions = {
	 				orderBy: orderBy,
				    searchVal: searchLead,
				    paginationSettings: paginationSettings
	 			};

	 			LeadManagerService.getLeads(leadOptions).then(function(res){

	 				//debugger;
	 				var lead_count = res.data.message.length;
	 				var lead_arr = res.data.message;
	 				var lead_id_arr = [];
	 				var lead_arr_data = [];
	 				var k=0;

	 				if(lead_count > 0) {

	 					for (var i = 0; i < lead_count; i++) {

	 						//debugger;
	 						//console.log(lead_arr[i]['_id'] + ' : ' + lead_arr[i]['created_on']);
	 						//lead_id_arr.push(lead_arr[i]['_id']);
	 						if(lead_arr[i]['service_obj'].length > 0) {
		 						for (var p = 0; p < lead_arr[i]['service_obj'].length; p++) {

		 							//debugger;

		 							if(in_array(lead_arr[i]['service_obj'][p]['_id'], service_id_arr) == true) {

		 									//debugger;
		 								// lead_arr_data[k]['name'] = lead_arr[i]['billing_name'];
		 								// lead_arr_data[k]['service_name'] = services_options[lead_arr[i]['service_obj'][p]['service_id']];

										var str = $scope.services_options[lead_arr[i]['service_obj'][p]['service_id']];
										var matches = str.match(/\b(\w)/g);
										var acronym = matches.join('');

		 								lead_arr_data.push({ 'name': lead_arr[i]['billing_name'], 'service_name': acronym, 'service_full_name': $scope.services_options[lead_arr[i]['service_obj'][p]['service_id']], 'pre_taxed_cost': lead_arr[i]['service_obj'][p]['pre_taxed_cost'], 'leadsource': lead_source_options[lead_arr[i]['service_obj'][p]['leadsource']] });
		 								k++;

		 							}
		 							
		 						}
	 						}

	 					};

	 					// console.log('------------------------------------------------------------');

	 					// for (var i = 0; i < lead_id_arr.length; i++) {
	 					// 	//console.log(lead_id_arr[i]);
	 					// };

	 					// console.log('------------------------------------------------------------');

	 				// 	var unique_lead_arr = lead_id_arr.filter(function(elem, index, self) {
						//     return index == self.indexOf(elem);
						// });

	 					// for (var i = 0; i < unique_lead_arr.length; i++) {
	 					// 	//console.log(unique_lead_arr[i]);
	 					// };

	 					// console.log('------------------------------------------------------------');


	 					console.log(lead_arr_data);
	 					var today_aov = today_taxed_cost_sum / lead_count;
	 					$scope.today_total_bookings = lead_count;
	 					$scope.today_average_order_value = numDifferentiation(today_aov);
	 					$scope.today_closed_order_data = lead_arr_data;

	 				}

	 			});


	 		} else {
	 			$scope.today_total_bookings = 0;
	 			$scope.today_total_booking_revenue = 0;
	 			$scope.today_average_order_value = 0;
	 		}
	 	});

    }


    function fillSummaryGroupBoxes2_revenue(city='',leadsource='',service='',start_date='',end_date='',client_type='') {

		var today_date =  new Date(moment().format('YYYY-MM-DD') + ' 00:00:00');
		var tomorrow_date = moment(today_date).add(1,'days').toDate();
		var service_id_arr = [];


	 	var orderBy = {
		    created_on: 1
		};

	 	var paginationSettings = {
	        limit: 0,
	        offset: 0
		};


	 	var searchTodayVal = {
	 		'status': 0,
	 		'is_order': 1,
	 		'invoice_sent': 1
	 	};


 		searchTodayVal['$or'] = [{ 'contract_start_date': {"$gte": today_date.toISOString(), "$lt": tomorrow_date.toISOString()} }, { 'service_date': {"$gte": today_date.toISOString(), "$lt": tomorrow_date.toISOString()} }];


	 	if(city != undefined && city != null && city != "") {
	 		searchTodayVal.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		searchTodayVal.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		searchTodayVal.service_id = service;
	 	}

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		searchTodayVal.client_type = client_type;
	 	}

	 	searchTodayVal.leadsource = {'$ne': null};
	 	searchTodayVal.leadsource = {'$ne': ""};



	 	console.log(searchTodayVal);

		var dataToday = {
		  	orderBy: orderBy,
		    searchVal: searchTodayVal,
		    paginationSettings: paginationSettings
		};

	 	LeadManagerService.getAllServices(dataToday).then(function(response){
	 		//console.log("Revenue Fill Summary Box 2 Called Inside All Services");
	 		//console.log(response);
	 		var today_order_count = response.data.message.length;
	 		if(today_order_count > 0) {
	 			var orders_arr = response.data.message;
	 			var today_taxed_cost_sum = 0;
	 			$scope.today_total_bookings = today_order_count;

				console.log("---------------------------------------------------------------");

				for (var i = orders_arr.length - 1; i >= 0; i--) {

					// if(orders_arr[i]['partner_payment_payable'] != undefined && orders_arr[i]['partner_payment_payable'] != 0 && orders_arr[i]['leadsource'] != 70) {
					// 	console.log(orders_arr[i]['_id'] + ' : ' + orders_arr[i]['invoice_sent'] + ' : ' + orders_arr[i]['client_payment_expected'] + " | Date Index: " + getDateIndex(orders_arr[i]['service_date']));
					// } else if(orders_arr[i]['is_amc'] == 0 && getDateIndex(orders_arr[i]['service_date']) < 1) {
					// 	console.log(orders_arr[i]['_id'] + ' : ' + orders_arr[i]['invoice_sent'] + ' : ' + orders_arr[i]['taxed_cost'] + " | Date Index: " + getDateIndex(orders_arr[i]['service_date']));
					// } else if(orders_arr[i]['is_amc'] == 1) {
					// 	console.log(orders_arr[i]['_id'] + ' : ' + orders_arr[i]['invoice_sent'] + ' : ' + orders_arr[i]['taxed_cost']);
					// }

					if(orders_arr[i]['partner_payment_payable'] != undefined && orders_arr[i]['partner_payment_payable'] != 0 && orders_arr[i]['leadsource'] != 70) {
						today_taxed_cost_sum = today_taxed_cost_sum + (orders_arr[i]['client_payment_expected'] * (1/1.15));
					} else if(orders_arr[i]['pre_taxed_cost'] != "" && orders_arr[i]['pre_taxed_cost'] != null && orders_arr[i]['is_amc'] == 0 && getDateIndex(orders_arr[i]['service_date']) < 1) {
	 					today_taxed_cost_sum = today_taxed_cost_sum + orders_arr[i]['pre_taxed_cost'];
	 				} else if(orders_arr[i]['pre_taxed_cost'] != "" && orders_arr[i]['pre_taxed_cost'] != null && orders_arr[i]['is_amc'] == 1) {
	 					today_taxed_cost_sum = today_taxed_cost_sum + orders_arr[i]['pre_taxed_cost'];
	 				}

	 				service_id_arr.push(orders_arr[i]['_id']);
	 			}; 			


				console.log("---------------------------------------------------------------");

	 			$scope.today_total_booking_revenue = numDifferentiation(today_taxed_cost_sum);


	 			var searchLead = {
	 				'status': 0,
	 				'service_obj': {$in : service_id_arr}
	 			};

	 			var leadOptions = {
	 				orderBy: orderBy,
				    searchVal: searchLead,
				    paginationSettings: paginationSettings
	 			};

	 			LeadManagerService.getLeads(leadOptions).then(function(res){

	 				//debugger;
	 				var lead_count = res.data.message.length;
	 				var lead_arr = res.data.message;
	 				var lead_id_arr = [];

	 				if(lead_count > 0) {

	 					for (var i = 0; i < lead_arr.length; i++) {
	 						//console.log(lead_arr[i]['_id'] + ' : ' + lead_arr[i]['created_on']);
	 						lead_id_arr.push(lead_arr[i]['_id']);
	 					};

	 					// console.log('------------------------------------------------------------');

	 					// for (var i = 0; i < lead_id_arr.length; i++) {
	 					// 	//console.log(lead_id_arr[i]);
	 					// };

	 					// console.log('------------------------------------------------------------');

	 					var unique_lead_arr = lead_id_arr.filter(function(elem, index, self) {
						    return index == self.indexOf(elem);
						});

	 					// for (var i = 0; i < unique_lead_arr.length; i++) {
	 					// 	//console.log(unique_lead_arr[i]);
	 					// };

	 					// console.log('------------------------------------------------------------');

	 					var today_aov = today_taxed_cost_sum / unique_lead_arr.length;
	 					$scope.today_total_bookings = unique_lead_arr.length;
	 					$scope.today_average_order_value = numDifferentiation(today_aov);

	 				}

	 			});




	 		} else {

	 			$scope.today_total_bookings = 0;
	 			$scope.today_total_booking_revenue = 0;
	 			$scope.today_average_order_value = 0;

	 		}
	 	});

    }

    function getDateIndex(service_date_arr,current_date) {

    	for (var i = 0; i < service_date_arr.length; i++) {
    		var current_date_f = moment(current_date).format('YYYY-MM-DD');
    		var s_date_f = moment(service_date_arr[i]).format('YYYY-MM-DD');

    		if(current_date_f == s_date_f) {
    			return i;
    		}

    	};

    	return i;

    }

    function in_array(needle, haystack) {
	    for(var i in haystack) {
	        if(haystack[i] == needle) return true;
	    }
	    return false;
	}


    function plotareachart_categorywise(city='',leadsource='',start_date='',end_date='', client_type='') {

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = moment((new Date(start_date + ' 00:00:00'))).toDate();
	 		var to_date = moment((new Date(end_date + ' 00:00:00'))).add(1,'days').toDate();
	 		
	 		var firstDay = from_date.toISOString();
	 		var lastDay = to_date.toISOString();

	 	} else {

	 		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	 		var from_date = new Date(y, m, 1);
	 		var to_date = new Date(y, m + 1, 0);

	 		var firstDay = from_date.toISOString();
	 		var lastDay = to_date.toISOString();
	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay,
			'is_order': 1
		};

		if(city != undefined && city != null && city != "") {
			whereServiceArr.city = city;
		}

		if(leadsource != undefined && leadsource != null && leadsource != "") {
			whereServiceArr.leadsource = leadsource;
		}

		if(client_type != undefined && client_type != null && client_type != "") {
			whereServiceArr.client_type = parseInt(client_type);
		}

		console.log(whereServiceArr);

		var orderByService = { service_category_id: -1 };

		var match_field = {'match_field': 'service_category_id'};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		LeadManagerService.groupByCategory(data).then(function(response){

			console.log(response);

			if(response.data != undefined) {

				if(response.data.message != undefined && response.data.message.length > 0) {

					var res_data = response.data.message;
					var res_data_count = response.data.message.length;
					var child_data = [];
					var child_data_obj = {};
					var parent_data = [];
					var parent_data_obj = {};

					var service_sum = [];
					var posttotal_sum = [];
					var pretotal_sum = [];
					var count_sum = [];
					var service_category = [];

					var result = [];

					for(var i = 0; i< res_data_count; i++) {

						var service_data = res_data[i].services;
						var service_data_count = res_data[i].services.length;
						var category = res_data[i]['_id'];

						parent_data_obj = { 'category':  category, 'estimated_revenue_post_tax': res_data[i].posttotal, 'estimated_revenue_pre_tax': res_data[i].pretotal, 'total_orders': res_data[i].count };
						parent_data.push(parent_data_obj);

						if(service_data_count > 0) {

							for(var j = 0; j < service_data_count; j++) {

								//child_data_obj = { category: res_data[i]['_id'], service: service_data[j].service_id, };
								if(posttotal_sum[service_data[j].service_id] == undefined) {
									posttotal_sum[service_data[j].service_id] = [];
								}

								if(count_sum[service_data[j].service_id] == undefined) {
									count_sum[service_data[j].service_id] = [];
								} 

								if(pretotal_sum[service_data[j].service_id] == undefined) {
									pretotal_sum[service_data[j].service_id] = [];
								}

								if(service_category[service_data[j].service_id] == undefined) {
									service_category[service_data[j].service_id] = [];
								}

								posttotal_sum[service_data[j].service_id].push(service_data[j].posttotal);
								pretotal_sum[service_data[j].service_id].push(service_data[j].pretotal);
								count_sum[service_data[j].service_id].push(service_data[j].count);
								service_category[service_data[j].service_id] = category;
								
							}

							



							// for(var j = 0; j < service_data_count; j++) {


							// }


						}


					}

					for(var k in posttotal_sum) {
						var sum_post = posttotal_sum[k].reduce(function(pv, cv) { return pv + cv; }, 0);
						posttotal_sum[k] = sum_post;
					}

					for(var p in pretotal_sum) {
						var sum_pre = pretotal_sum[p].reduce(function(x, y) { return x + y; }, 0);
						pretotal_sum[p] = sum_pre;
					}

					for(var l in count_sum) {
						var sum_count = count_sum[l].reduce(function(a, b) { return a + b; }, 0);
						count_sum[l] = sum_count;
					}

					for(var k in posttotal_sum) {

						child_data_obj = { 'category': service_category[k], 'estimated_revenue_post_tax':  posttotal_sum[k], 'service': k, 'total_orders': count_sum[k] };
						child_data.push(child_data_obj);
					}


					// console.log(posttotal_sum);
					// console.log(pretotal_sum);
					// console.log(count_sum);

					//console.log(parent_data);

					// for(var k in service_sum) {
					// 	var sum = service_sum[k].reduce(function(pv, cv) { return pv + cv; }, 0);
					// 	service_sum[k] = sum;
					// }

					// console.log(service_sum);

					result['parent'] = parent_data;
					result['child'] = child_data;

					var formatted_data = formatCategoryDataforCharts(result);
					$scope.parent_data = parent_data;
					var category_id = 9;

					var category_count_total = 0;
					var category_pre_total = 0;
					var category_post_total = 0;

					for (var i = 0; i < $scope.parent_data.length; i++) {
						//$scope.parent_data[i].estimated_revenue_pre_tax = $scope.parent_data[i].estimated_revenue_pre_tax;
						category_count_total += $scope.parent_data[i].total_orders;
						category_pre_total += parseFloat($scope.parent_data[i].estimated_revenue_pre_tax);
						category_post_total += parseInt($scope.parent_data[i].estimated_revenue_post_tax); 
					}

					for (var i = 0; i < $scope.parent_data.length; i++) {
						$scope.parent_data[i].estimated_revenue_pre_tax = numDifferentiation($scope.parent_data[i].estimated_revenue_pre_tax);
						$scope.parent_data[i].estimated_revenue_post_tax = numDifferentiation($scope.parent_data[i].estimated_revenue_post_tax);
					}



					$scope.category_count_total = category_count_total;
					$scope.category_pre_total = numDifferentiation(category_pre_total);
					$scope.category_post_total = numDifferentiation(category_post_total);

					drawTableforService(result, category_id);
					// $timeout(function() { $scope.service_category = category_id; }, 1000);
					angular.element('#service_category').val(category_id);
					
					var parent_response = parent_data;
				    var cleaning_estimated_revenue = 0;
				    var pest_estimated_revenue = 0;
				    var ac_estimated_revenue = 0;
				    var handyman_estimated_revenue = 0;
				    var car_estimated_revenue = 0;


                    for (var i = 0; i < parent_response.length; i++) {
                       if(parent_response[i].category==6){
                        ac_estimated_revenue = numDifferentiation(parseFloat(parent_response[i].estimated_revenue_post_tax)/1.18);
                       }
                        if(parent_response[i].category==7){
                        car_estimated_revenue = parseFloat(parent_response[i].estimated_revenue_post_tax)/1.18;
                       }
                        if(parent_response[i].category==8){
                        handyman_estimated_revenue = parseFloat(parent_response[i].estimated_revenue_post_tax)/1.18;
                       }
                        if(parent_response[i].category==9){
                        cleaning_estimated_revenue = numDifferentiation(parseFloat(parent_response[i].estimated_revenue_post_tax)/1.18);
                       }
                        if(parent_response[i].category==11){
                        pest_estimated_revenue = numDifferentiation(parseFloat(parent_response[i].estimated_revenue_post_tax)/1.18);
                       }

                    };

                    $scope.ac_estimated_revenue = ac_estimated_revenue;
                    $scope.car_estimated_revenue = car_estimated_revenue;
                    $scope.handyman_estimated_revenue = handyman_estimated_revenue;
                    $scope.cleaning_estimated_revenue = cleaning_estimated_revenue;
                    $scope.pest_estimated_revenue = pest_estimated_revenue;



					//console.log(formatted_data);


					var areaChartOptions = {
				        chart: {
				            type: 'column'
				        },
				        title: {
				            text: 'Category Wise Analysis'
				        },
				        xAxis: {
				            type: 'category'  
				           
				        },
				        yAxis: {
				            min: 0,
				            title: {
				                text: 'Total No of Orders'
				            }
				            
				        },
				       
				        tooltip: {
				            // headerFormat: '<span style="font-size:11px"></span><br>',
				            pointFormat: '<span style="color:{point.color}">Total Orders</span>: <b>{point.y}</b><br/><span style="color:{point.color}">Total Bookings</span>: <b>{point.revenue}</b><br/>'
				        },
				       plotOptions: {
				            series: {
				                borderWidth: 0,
				                dataLabels: {
				                    enabled: true,
				                    format: '{point.y}',
				                     style:{
				                               color: '#4d4d4d',
				                               textDecoration:"none"
				                            }
				                }
				            }
				        },
				        series: [{
				            name: 'Category',
				            colorByPoint: true,
				            data: formatted_data.maindata
				        }],
				        drilldown: {
				            series: formatted_data.drilldowndata
				        }
				        
				    };



					Highcharts.chart('categorywise_area_chart', areaChartOptions);



				}

			}
			

		});


    }



    function plotareachart_categorywise_revenue(city='',leadsource='',start_date='',end_date='',client_type='') {

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = moment((new Date(start_date + ' 00:00:00'))).add(1,'days').toDate();
	 		var to_date = moment((new Date(end_date + ' 00:00:00'))).add(1,'days').toDate();
	 		
	 		var firstDay = from_date.toISOString();
	 		var lastDay = to_date.toISOString();

	 	} else {

	 		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	 		var from_date = new Date(y, m, 1);
	 		var to_date = new Date(y, m + 1, 0);

	 		var firstDay = from_date.toISOString();
	 		var lastDay = to_date.toISOString();
	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay,
			'city': city,
			'client_type': client_type,
			'leadsource': leadsource,
			'is_order': 1,
			'status': 0,
			'invoice_sent': 1
		};

		console.log(whereServiceArr);

		var orderByService = { service_category_id: -1 };

		var match_field = {'match_field': 'service_category_id'};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		LeadManagerService.groupByCategory(data).then(function(response){

			console.log(response);

			if(response.data != undefined) {

				if(response.data.message != undefined && response.data.message.length > 0) {

					var res_data = response.data.message;
					var res_data_count = response.data.message.length;
					var child_data = [];
					var child_data_obj = {};
					var parent_data = [];
					var parent_data_obj = {};

					var service_sum = [];
					var posttotal_sum = [];
					var pretotal_sum = [];
					var count_sum = [];
					var service_category = [];

					var result = [];

					for(var i = 0; i< res_data_count; i++) {

						var service_data = res_data[i].services;
						var service_data_count = res_data[i].services.length;
						var category = res_data[i]['_id'];

						parent_data_obj = { 'category':  category, 'estimated_revenue_post_tax': res_data[i].posttotal, 'estimated_revenue_pre_tax': res_data[i].pretotal, 'total_orders': res_data[i].count };
						parent_data.push(parent_data_obj);

						if(service_data_count > 0) {

							for(var j = 0; j < service_data_count; j++) {

								//child_data_obj = { category: res_data[i]['_id'], service: service_data[j].service_id, };
								if(posttotal_sum[service_data[j].service_id] == undefined) {
									posttotal_sum[service_data[j].service_id] = [];
								}

								if(count_sum[service_data[j].service_id] == undefined) {
									count_sum[service_data[j].service_id] = [];
								} 

								if(pretotal_sum[service_data[j].service_id] == undefined) {
									pretotal_sum[service_data[j].service_id] = [];
								}

								if(service_category[service_data[j].service_id] == undefined) {
									service_category[service_data[j].service_id] = [];
								}

								posttotal_sum[service_data[j].service_id].push(service_data[j].posttotal);
								pretotal_sum[service_data[j].service_id].push(service_data[j].pretotal);
								count_sum[service_data[j].service_id].push(service_data[j].count);
								service_category[service_data[j].service_id] = category;
								
							}

							



							// for(var j = 0; j < service_data_count; j++) {


							// }


						}


					}

					for(var k in posttotal_sum) {
						var sum_post = posttotal_sum[k].reduce(function(pv, cv) { return pv + cv; }, 0);
						posttotal_sum[k] = sum_post;
					}

					for(var p in pretotal_sum) {
						var sum_pre = pretotal_sum[p].reduce(function(x, y) { return x + y; }, 0);
						pretotal_sum[p] = sum_pre;
					}

					for(var l in count_sum) {
						var sum_count = count_sum[l].reduce(function(a, b) { return a + b; }, 0);
						count_sum[l] = sum_count;
					}

					for(var k in posttotal_sum) {

						child_data_obj = { 'category': service_category[k], 'estimated_revenue_post_tax':  posttotal_sum[k], 'service': k, 'total_orders': count_sum[k] };
						child_data.push(child_data_obj);
					}


					// console.log(posttotal_sum);
					// console.log(pretotal_sum);
					// console.log(count_sum);

					//console.log(parent_data);

					// for(var k in service_sum) {
					// 	var sum = service_sum[k].reduce(function(pv, cv) { return pv + cv; }, 0);
					// 	service_sum[k] = sum;
					// }

					// console.log(service_sum);

					result['parent'] = parent_data;
					result['child'] = child_data;

					var formatted_data = formatCategoryDataforCharts(result);
					$scope.parent_data = parent_data;
					var category_id = 9;

					var category_count_total = 0;
					var category_pre_total = 0;
					var category_post_total = 0;

					for (var i = 0; i < $scope.parent_data.length; i++) {
						$scope.parent_data[i].estimated_revenue_pre_tax = $scope.parent_data[i].estimated_revenue_pre_tax.toFixed(2);
						category_count_total += $scope.parent_data[i].total_orders;
						category_pre_total += parseFloat($scope.parent_data[i].estimated_revenue_pre_tax);
						category_post_total += parseInt($scope.parent_data[i].estimated_revenue_post_tax); 
					}



					$scope.category_count_total = category_count_total;
					$scope.category_pre_total = category_pre_total;
					$scope.category_post_total = category_post_total;

					drawTableforService(result, category_id);
					// $timeout(function() { $scope.service_category = category_id; }, 1000);
					angular.element('#service_category').val(category_id);
					
					var parent_response = parent_data;
				    var cleaning_estimated_revenue = 0;
				    var pest_estimated_revenue = 0;
				    var ac_estimated_revenue = 0;
				    var handyman_estimated_revenue = 0;
				    var car_estimated_revenue = 0;


                    for (var i = 0; i < parent_response.length; i++) {
                       if(parent_response[i].category==6){
                        ac_estimated_revenue = numDifferentiation(parseFloat(parent_response[i].estimated_revenue_post_tax)/1.18);
                       }
                        if(parent_response[i].category==7){
                        car_estimated_revenue = parseFloat(parent_response[i].estimated_revenue_post_tax)/1.18;
                       }
                        if(parent_response[i].category==8){
                        handyman_estimated_revenue = parseFloat(parent_response[i].estimated_revenue_post_tax)/1.18;
                       }
                        if(parent_response[i].category==9){
                        cleaning_estimated_revenue = numDifferentiation(parseFloat(parent_response[i].estimated_revenue_post_tax)/1.18);
                       }
                        if(parent_response[i].category==11){
                        pest_estimated_revenue = numDifferentiation(parseFloat(parent_response[i].estimated_revenue_post_tax)/1.18);
                       }

                    };

                    $scope.ac_estimated_revenue = ac_estimated_revenue;
                    $scope.car_estimated_revenue = car_estimated_revenue;
                    $scope.handyman_estimated_revenue = handyman_estimated_revenue;
                    $scope.cleaning_estimated_revenue = cleaning_estimated_revenue;
                    $scope.pest_estimated_revenue = pest_estimated_revenue;



					//console.log(formatted_data);


					var areaChartOptions = {
				        chart: {
				            type: 'column'
				        },
				        title: {
				            text: 'Category Wise Analysis'
				        },
				        xAxis: {
				            type: 'category'  
				           
				        },
				        yAxis: {
				            min: 0,
				            title: {
				                text: 'Total No of Orders'
				            }
				            
				        },
				       
				        tooltip: {
				            // headerFormat: '<span style="font-size:11px"></span><br>',
				            pointFormat: '<span style="color:{point.color}">Total Orders</span>: <b>{point.y}</b><br/><span style="color:{point.color}">Total Bookings</span>: <b>{point.revenue}</b><br/>'
				        },
				       plotOptions: {
				            series: {
				                borderWidth: 0,
				                dataLabels: {
				                    enabled: true,
				                    format: '{point.y}',
				                     style:{
				                               color: '#4d4d4d',
				                               textDecoration:"none"
				                            }
				                }
				            }
				        },
				        series: [{
				            name: 'Category',
				            colorByPoint: true,
				            data: formatted_data.maindata
				        }],
				        drilldown: {
				            series: formatted_data.drilldowndata
				        }
				        
				    };



					Highcharts.chart('categorywise_area_chart', areaChartOptions);



				}

			}
			

		});


    }



    function drawTableforService(result, category_id) {

    	$scope.ajaxResponse = result;

    	var resp = formatDataforTable(result);
	        // debugger;
	    if (resp==null || resp.length==0 || resp[category_id] == null|| resp[category_id].length==0) {
	        $scope.child_data = [];
	    } else {
	    	$scope.child_data = resp[category_id][0];	
	    }

		var service_count_total = 0;
		var service_pre_total = 0;
		var service_post_total = 0;	    


		for (var i = 0; i < $scope.child_data.length; i++) {
			$scope.child_data[i].estimated_revenue_pre_tax = (parseFloat($scope.child_data[i].estimated_revenue_post_tax)/1.18).toFixed(2);
			service_count_total += $scope.child_data[i].total_orders;
			service_pre_total += parseFloat($scope.child_data[i].estimated_revenue_pre_tax);
			service_post_total += parseInt($scope.child_data[i].estimated_revenue_post_tax); 
		}

		$scope.service_count_total = service_count_total;
		$scope.service_pre_total = service_pre_total.toFixed(2);
		$scope.service_post_total = service_post_total;

    }

    $scope.filterByCategory = function() {
    	drawTableforService($scope.ajaxResponse,$scope.service_category);
    }


    function formatDataforTable(response){

	    var data = [];
	    var parent_data =response.parent;
	    var child_data = response.child;
	    var formatted_child_data = [];
	 
	   for (var i = 0; i < parent_data.length; i++) {
	            
	            var mydata = [];
	       
	       for (var j = 0; j < child_data.length; j++) {           
	            

	            if (parent_data[i].category===child_data[j].category) {

	                var tempObj = {service:$scope.services_options[child_data[j].service],estimated_revenue_post_tax:parseInt(child_data[j].estimated_revenue_post_tax),total_orders:parseInt(child_data[j].total_orders)}
	                mydata.push(tempObj);
	            };

	       };

	       formatted_child_data[parent_data[i].category] = [];

	       formatted_child_data[parent_data[i].category].push(mydata);

	       console.log(formatted_child_data);
	       // formatted_data.push({name:category_name[parent_data[i].category],revenue:parseInt(parent_data[i].estimated_revenue_post_tax),drilldown:category_name[parent_data[i].category],y:parseInt(parent_data[i].total_orders)});


	   };
	    
	    return formatted_child_data;
	    
	}


    function formatCategoryDataforCharts(response){

	    var data = [];
	    var parent_data =response.parent;
	    var child_data = response.child;
	    var formatted_child_data = [];
	    var formatted_data = [];
	    var drilldown_data = [];
	   	for (var i = 0; i < parent_data.length; i++) {
	            
	            var mydata = [];
	       
	       for (var j = 0; j < child_data.length; j++) {
	            
	            

	            if (parent_data[i].category===child_data[j].category) {

	                var tempObj = {name:$scope.services_options[child_data[j].service],revenue:parseInt(child_data[j].estimated_revenue_post_tax),y:parseInt(child_data[j].total_orders)}
	                mydata.push(tempObj);
	            };

	       };

	       formatted_child_data.push({name:$scope.category_options[parent_data[i].category],id:$scope.category_options[parent_data[i].category],data:mydata});
	       formatted_data.push({name:$scope.category_options[parent_data[i].category],revenue:parseInt(parent_data[i].estimated_revenue_post_tax),drilldown:$scope.category_options[parent_data[i].category],y:parseInt(parent_data[i].total_orders)});


	   	};
	    
	    return {maindata:formatted_data,drilldowndata:formatted_child_data};
	    
	}



    function plotareachart(city='',leadsource='',service='',start_date='',end_date='', client_type='') {

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = moment((new Date(start_date + ' 00:00:00'))).toDate();
	 		var to_date = moment((new Date(end_date + ' 00:00:00'))).add(1,'days').toDate();
	 		
	 		var firstDay = from_date.toISOString();
	 		var lastDay = to_date.toISOString();

	 	} else {

	 		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
	 		var from_date = new Date(y, m, 1);
	 		var to_date = new Date(y, m + 1, 0);

	 		var firstDay = from_date.toISOString();
	 		var lastDay = to_date.toISOString();
	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay,
			'is_order': 1
		};


		if(city != undefined && city != null && city != "") {
			whereServiceArr.city = city;
		}

		if(leadsource != undefined && leadsource != null && leadsource != "") {
			whereServiceArr.leadsource = leadsource;
		}

		if(service != undefined && service != null && service != "") {
			whereServiceArr.service_id = service;
		}

		if(client_type != undefined && client_type != null && client_type != "") {
			whereServiceArr.client_type = client_type;
		}

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
				var b_data = res_data;

				for (var i = 0; i < b_data.length; i++) {
					b_data[i]['dateFormatted'] = moment(b_data[i]['_id']).format('Do MMMM YYYY');
					b_data[i]['pretotalFormatted'] = numDifferentiation(b_data[i]['pretotal']);
					b_data[i]['posttotalFormatted'] = numDifferentiation(b_data[i]['posttotal']);
					b_data[i]['numberformattedDate'] = moment(b_data[i]['_id']).unix();
				};

				var byDate = b_data.slice(0);
				byDate.sort(function(a,b) {
				    return a.numberformattedDate - b.numberformattedDate;
				});

				$scope.booking_data = byDate;
				
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



    function plotareachart_revenue(city='',leadsource='',service='',start_date='',end_date='',client_type='') {

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
			'invoice_sent': 1
		};

		if(city != undefined && city != null && city != "") {
	 		whereServiceArr.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		whereServiceArr.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		whereServiceArr.service_id = service;
	 	}

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		whereServiceArr.client_type = client_type;
	 	}

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
    	var firstDay = new Date(y, m, 1);
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
				console.log(organic_res_data);

				var b_data = organic_res_data;

				for (var i = 0; i < b_data.length; i++) {
					b_data[i]['dateFormatted'] = moment(b_data[i]['_id']).format('Do MMMM YYYY');
					b_data[i]['pretotalFormatted'] = numDifferentiation(b_data[i]['pretotal']);
					b_data[i]['posttotalFormatted'] = numDifferentiation(b_data[i]['posttotal']);
					b_data[i]['numberformattedDate'] = moment(b_data[i]['_id']).unix();
				};

				var byDate = b_data.slice(0);
				byDate.sort(function(a,b) {
				    return a.numberformattedDate - b.numberformattedDate;
				});


				$scope.organic_booking_data = byDate;
				formatted_data_organic = formatDataforColumnCharts(organic_res_data);

				LeadManagerService.groupByDatePartner(data).then(function(resp){

					var partner_data_count = resp.data.message.length;

					//if(partner_data_count > 0) {

						var partner_res_data = resp.data.message;
						console.log(partner_res_data);

						var br_data = partner_res_data;

						for (var i = 0; i < br_data.length; i++) {
							br_data[i]['dateFormatted'] = moment(br_data[i]['_id']).format('Do MMMM YYYY');
							br_data[i]['pretotalFormatted'] = numDifferentiation(br_data[i]['pretotal']);
							br_data[i]['posttotalFormatted'] = numDifferentiation(br_data[i]['posttotal']);
							br_data[i]['numberformattedDate'] = moment(br_data[i]['_id']).unix();
						};

						var byRDate = br_data.slice(0);
						byRDate.sort(function(a,b) {
						    return a.numberformattedDate - b.numberformattedDate;
						});

						$scope.partner_booking_data = byRDate;
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


    function plotcolumnchart_revenue(city='',leadsource='',service='',start_date='',end_date='',client_type='') {

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
			'invoice_sent': 1
		};

		if(city != undefined && city != null && city != "") {
			whereServiceArr.city = city;
		}

		if(leadsource != undefined && leadsource != null && leadsource != "") {
			whereServiceArr.leadsource = leadsource;
		}

		if(service != undefined && service != null && service != "") {
			whereServiceArr.service_id = service;
		}

		if(client_type != undefined && client_type != null && client_type != "") {
			whereServiceArr.client_type = client_type;
		}

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


    function plotpiechart_leadsourcewise(city='',leadsource='',service='',start_date='',end_date='', client_type='') {

  	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  	var firstDay = new Date(y, m, 1);
		var lastDay = new Date(y, m+1, 0);

	 	if((start_date != undefined && start_date != null && start_date != "") && end_date != undefined && end_date != null && end_date != "") {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		
	 		firstDay = from_date.toISOString();
	 		lastDay = to_date.toISOString();

	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay
		};

		if(city != undefined && city != null && city != "") {
			whereServiceArr.city = city;
		}

		if(leadsource != undefined && leadsource != null && leadsource != "") {
			whereServiceArr.leadsource = leadsource;
		}

		if(service != undefined && service != null && service != "") {
			whereServiceArr.service_id = service;
		}

		if(client_type != undefined && client_type != null && client_type != "") {
			whereServiceArr.client_type = client_type;
		}

		var orderByService = { created_on: -1 };

		var match_field = {'match_field': 'leadsource'};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		console.log(data);

		LeadManagerService.groupByLeadSource(data).then(function(response){
			
			console.log(response);

			var res_data = response.data.message;
			if(res_data.length > 0) {
				var formatted_data = formatLeadSourceWiseData(res_data,lead_source_options);
				createPieChart(formatted_data,'lead_source_wise');
			}

		});


    }


    function plotpiechart_cancellation(city='',leadsource='',service='',start_date='',end_date='') {

  	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
  	var firstDay = new Date(y, m, 1);
		var lastDay = new Date(y, m+1, 0);

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

		var match_field = {'match_field': 'cancellation_reason'};

		var data = {
			keyValueArray: match_field,
			orderBy: orderByService,
			whereArr: whereServiceArr
		};

		console.log(data);

		LeadManagerService.groupByCancellation(data).then(function(response){
			
			console.log(response);

			var res_data = response.data.message;

			if(res_data.length > 0) {
				$scope.cancellation_reasons_orders = res_data;
			}

			// if(res_data.length > 0) {
			// 	var formatted_data = formatLeadSourceWiseData(res_data,$scope.cancellation_reasons);
			// 	console.log(formatted_data);
			// 	createPieChart(formatted_data,'cancellation_wise');
			// }

		});


    }


    function plotpiechart_leadsourcewise_revenue(city='',leadsource='',service='',start_date='',end_date='',client_type='') {

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
			'invoice_sent': 1
		};

		if(city != undefined && city != null && city != "") {
	 		whereServiceArr.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		whereServiceArr.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		whereServiceArr.service_id = service;
	 	}

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		whereServiceArr.client_type = client_type;
	 	}

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

				for (var i = 0; i < res_data.length; i++) {
					if(res_data[i]['leadsource'] == "" || res_data[i] == undefined || res_data[i]['leadsource'] == null) {
						//console.log();
					}
				};

			var formatted_data = formatLeadSourceWiseData(res_data,lead_source_options);
				createPieChart(formatted_data,'lead_source_wise');
			}

		});


    }

    function plotpiechart_leadstagebooking(city='',leadsource='',service='',start_date='',end_date='', client_type='') {

    	var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    	var firstDay = new Date(y, m, 1);
		var lastDay = new Date(y, m+1, 0);

	 	if((start_date != undefined && start_date != null && start_date != "") && (end_date != undefined && end_date != null && end_date != "")) {
	 		var from_date = new Date(start_date + ' 00:00:00');
	 		var to_date = new Date(end_date + ' 00:00:00');
	 		
	 		firstDay = from_date.toISOString();
	 		lastDay = to_date.toISOString();

	 	}


		var whereServiceArr = {
			'start_date': firstDay,
			'end_date': lastDay
		};

		if(city != undefined && city != null && city != "") {
			whereServiceArr.city = city;
		}

		if(leadsource != undefined && leadsource != null && leadsource != "") {
			whereServiceArr.leadsource = leadsource;
		}

		if(service != undefined && service != null && service != "") {
			whereServiceArr.service_id = service;
		}

		if(client_type != undefined && client_type != null && client_type != "") {
			whereServiceArr.client_type = client_type;
		}

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

    function plotpiechart_leadstagebooking_revenue(city='',leadsource='',service='',start_date='',end_date='',client_type='') {

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
			'invoice_sent': 1
		};

		if(city != undefined && city != null && city != "") {
	 		whereServiceArr.city = parseInt(city);
	 	}

	 	if(leadsource != undefined && leadsource != null && leadsource != "") {
	 		whereServiceArr.leadsource = leadsource;
	 	}

	 	if(service != undefined && service != null && service != "") {
	 		whereServiceArr.service_id = service;
	 	}

	 	if(client_type != undefined && client_type != null && client_type != "") {
	 		whereServiceArr.client_type = client_type;
	 	}

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
    if(val >= 10000000) val = (val/10000000).toFixed(1) + ' Cr';
    else if(val >= 100000) val = (val/100000).toFixed(1) + ' L';
    else if(val >= 1000) val = (val/1000).toFixed(1) + ' K';
    else val = val.toFixed(1);
    return val;
}

function numDifferentiationYAxis(val) {
    val = parseFloat(val);
    if(val >= 10000000) val = (val/10000000) + ' Cr';
    else if(val >= 100000) val = (val/100000) + ' L';
    else if(val >= 1000) val = (val/1000) + ' K';
    else val = val;
    return val;
}


function formatDataforCharts(response){

    var data = [];
    // [data:moment(response[i].dt, "YYYY-MM-DD").valueOf(),
    for(var i=0;i<response.length;i++){

        var obj = {};
        obj = {x:moment(response[i]['_id'], "YYYY-MM-DD").add(1,'days').valueOf(),y:response[i].pretotal,orders:(parseInt(response[i].fieldCount)-1)};
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

function dataforColumnCharts(response,label){

    var data = [];
    // [data:moment(response[i].dt, "YYYY-MM-DD").valueOf(),
    for(var i=0;i<response.length;i++){

        var obj = {};
        //obj = [response[i][label],parseInt(response[i]['total']),parseInt(response[i]['count'])];
        obj = {name: response[i][label],y:parseFloat(response[i]['total']), count: parseInt(response[i]['count'])};
        data[i] = obj;
    }
    
    return data;
}


function dataforGroupColumnCharts(response,label){

    var data = [];
    // [data:moment(response[i].dt, "YYYY-MM-DD").valueOf(),
    for(var i=0;i<response.length;i++){

        var obj = {};
        //obj = [response[i][label],parseInt(response[i]['total']),parseInt(response[i]['count'])];
        obj = {name: response[i][label],y:parseInt(response[i]['total']), count: parseInt(response[i]['count'])};
        data[i] = obj;
    }
    
    return data;
}


function formatLeadSourceWiseData(resp,master_resp){

	console.log(master_resp);

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

    	if(resp[i]['_id'] != "" && resp[i]['_id'] != undefined && resp[i]['_id'] != null) {

	        if(resp[i]['_id']==17 || resp[i]['_id']==31||resp[i]['_id']==32){
	            closedEstimate = closedEstimate + parseInt(resp[i].pretotal);
	            closedTotal = closedTotal + parseInt(resp[i].fieldCount);             
	        }

	        else{
	            myNewArray.push(resp[i]);
	        }

        }

    };

        myNewArray.push({pretotal:closedEstimate.toString(),_id:"17",fieldCount:(closedTotal-1).toString()})
    // console.log(myNewArray);
    for(var i =0; i< myNewArray.length;i++){
        
        if (myNewArray[i]['_id'] ==17) {
            color = "red";
        };



        formatted_data[i] = {name: lead_stage_options[myNewArray[i]['_id']],total_orders:myNewArray[i].fieldCount,y:parseInt(myNewArray[i].pretotal),color:color};
        formatted_data_orders[i] = {name: lead_stage_options[myNewArray[i]['_id']],y:parseInt(myNewArray[i].fieldCount),revenue:parseInt(myNewArray[i].pretotal),color:color};
    }

    // debugger;
    return {revenue:formatted_data,orders:formatted_data_orders};

}


function sortMapByValue(map)
{
    var tupleArray = [];
    for (var key in map) tupleArray.push([key, map[key]]);
    tupleArray.sort(function (a, b) { return a[1] - b[1] });
    return tupleArray;
}

function countClosedService(service_obj_arr) {

	var closed_count = 0;

	for (var i = 0; i < service_obj_arr.length; i++) {
		if(service_obj_arr[i].is_order == 1) {
			closed_count++;
		}
	};

	return closed_count;
}