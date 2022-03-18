var App = angular.module("dashboard");

App.controller("DashboardCtrl", [
  "$scope",
  "$rootScope",
  "$state",
  "$route",
  "$stateParams",
  "$timeout",
  "SweetAlert",
  "DashboardFactory",
  function (
    $scope,
    $rootScope,
    $state,
    $route,
    $stateParams,
    $timeout,
    SweetAlert,
    DashboardFactory,
  ) {
    var user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      $rootScope.authenticated = true;
      $rootScope.currentUser = user;
    } else {
      $rootScope.authenticated = false;
      $state.go("auth");
    }

    if ($rootScope.currentUser.user_type != "A") {
      $state.go("reports");
    }

    $scope.is_date_filter = false;
    $scope.is_month_filter = false;
    $scope.financial_year_filter = '';
    $scope.from_date_filter = '';
    $scope.to_date_filter = '';
    $scope.month_filter = '';
    $scope.type_filter = '';

    $scope.total_site_started_value = 0;
    $scope.total_contracts_won_value = 0;

    $scope.total_industry_data_value = 0;
    $scope.total_leadsource_data_value = 0;

    $scope.total_site_started_report_data_value = 0;
    $scope.total_contracts_won_data_value = 0;

    $scope.total_contracts_won_lead_count = 0;
    $scope.total_sites_activated_lead_count = 0;

    DashboardFactory.getSalesFunnelData({'status': 'open'}).then(function(response){
      if(response && response.data && response.data.report_data) {
        var report_data = response.data.report_data;

        console.log(report_data);

        var chartOptions = {
          chart: {
              type: 'funnel'
          },
          title: {
              text: 'CURRENT SALES PIPELINE BY STAGE'
          },
          plotOptions: {
              series: {
                  dataLabels: {
                      enabled: true,
                      format: '<b>{point.name}</b> ({point.y:,.0f} L)',
                      softConnector: true
                  },
                  center: ['40%', '50%'],
                  neckWidth: '10%',
                  neckHeight: '30%',
                  width: '50%',
                  colors: ['#77da61','#95ceff','#ff7599','#fdec6d'],
              }
          },
          legend: {
              enabled: false
          },
          series: [{
              name: 'Total Value',
              data: report_data
          }],
      
          responsive: {
              rules: [{
                  condition: {
                      maxWidth: 250
                  },
                  chartOptions: {
                      plotOptions: {
                          series: {
                              dataLabels: {
                                  inside: true
                              },
                              center: ['50%', '50%'],
                              width: '100%'
                          }
                      }
                  }
              }]
          }
        };


      Highcharts.chart('sales_funnel', chartOptions);


      }
    });


    

function loadLeadsByIndustryData(data) {

    DashboardFactory.getIndustryData(data).then(function(response) {
        if(response && response.data) {
            var industries = response.data.industries;
            var industries_data = response.data.industry_data;

            $scope.total_industry_data_value = (response.data.total_industry_data_value).toFixed(1);

            var chartOptions = {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'REVENUE BY INDUSTRY'
                },
                xAxis: {
                    categories: industries,
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Value (No. of leads)'
                    }
                },
                tooltip: {
                formatter: function () {
                    return 'Total value: ' + numDifferentiation(this.y) + 'L';
                }
                },
                series: [{
                    name: 'Total Value',
                    data: industries_data
                }]
            };

            Highcharts.chart('industry_report', chartOptions);

        }

    });

}

function loadLeadsByLeadSource(data) {

    DashboardFactory.getLeadBySource(data).then(function(response){
    
        if(response && response.data && response.data.data) {
        var report_data = response.data.data;
        $scope.total_leadsource_data_value = (response.data.total_leadsource_data_value).toFixed(1);

        var chartOptions = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'REVENUE BY LEAD SOURCE'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br />Total Value: {point.y:.1f}L'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
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
                    name: 'Leadsource',
                    colorByPoint: true,
                    data: report_data
                }]
            };

        Highcharts.chart('leadsource_report', chartOptions);

        }
    
    });
}


//   DashboardFactory.getContractWonSiteStartedDataMonthWise({'from_date': '01-12-2020', 'to_date': '31-03-2021'}).then(function(response){
//       console.log(response);
//   });


  DashboardFactory.getLeadByOwner().then(function(response){
    if(response && response.data) {

      var leadowners = response.data.leadowners;
      var leadowners_data = response.data.leadowner_data;


      var chartOptions = {
          chart: {
              type: 'column'
          },
          title: {
              text: 'CURRENT SALES PIPELINE PER BD REP'
          },
          xAxis: {
              categories: leadowners,
              crosshair: true
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Value (in lacs)'
              }
          },
          tooltip: {
              headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
              pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} L</b></td></tr>',
              footerFormat: '</table>',
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: leadowners_data
      };
      
      Highcharts.chart('leadownerwise_bar', chartOptions);


    }

  });

  loadLeadsByIndustryData({});
  loadLeadsByLeadSource({});
  loadContractWonSiteStartedData({});
  loadSiteStartedData({});
  loadContractWonSiteStartedDataMonthWise({});

  function loadContractWonSiteStartedDataMonthWise(data) {
    DashboardFactory.getContractWonSiteStartedDataMonthWise(data).then(function(response){
        if(response && response.data) {
    
          var leadowners = response.data.months;
          var leadowners_data = response.data.leadowner_data;

          $scope.total_site_started_value = (response.data.total_site_started_value).toFixed(1);
          $scope.total_contracts_won_value = response.data.total_contracts_won_value.toFixed(1);
    
    
          var chartOptions = {
              chart: {
                  type: 'column'
              },
              title: {
                  text: 'MONTH WISE SITE STARTED / CONTRACTS WON'
              },
              xAxis: {
                  categories: leadowners,
                  crosshair: true
              },
              yAxis: {
                  min: 0,
                  title: {
                      text: 'Value (in lacs)'
                  }
              },
              tooltip: {
                  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                      '<td style="padding:0"><b>{point.y:.1f} L</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
              },
              plotOptions: {
                  column: {
                      pointPadding: 0.2,
                      borderWidth: 0
                  }
              },
              series: leadowners_data
          };
          
          Highcharts.chart('contractswon_sitestarted_month_bar', chartOptions);
    
    
        }
        
      });
  }

  function loadContractWonSiteStartedData(data) {
    DashboardFactory.getContractWonSiteStartedData(data).then(function(response){
        if(response && response.data) {
    
          var leadowners = response.data.leadowners;
          var leadowners_data = response.data.leadowner_data;

          $scope.total_contracts_won_lead_count = response.data.total_contracts_won_lead_count;
          $scope.total_sites_activated_lead_count = response.data.total_sites_activated_lead_count;
    
    
          var chartOptions = {
              chart: {
                  type: 'column'
              },
              title: {
                  text: 'TOTAL LEADS (CONTRACTS WON / SITE ACTIVATED)'
              },
              xAxis: {
                  categories: leadowners,
                  crosshair: true
              },
              yAxis: {
                  min: 0,
                  title: {
                      text: 'No. of leads'
                  }
              },
              tooltip: {
                  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                      '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
              },
              plotOptions: {
                  column: {
                      pointPadding: 0.2,
                      borderWidth: 0
                  }
              },
              series: leadowners_data
          };
          
          Highcharts.chart('contractswon_sitestarted_bar', chartOptions);
    
    
        }
        
      });
  }

  function loadSiteStartedData(data) {
    DashboardFactory.getSiteStartedData(data).then(function(response){
        if(response && response.data) {
    
          var leadowners = response.data.leadowners;
          var leadowners_data = response.data.leadowner_data;

          $scope.total_site_started_report_data_value = (response.data.total_site_started_report_data_value).toFixed(1);
          $scope.total_contracts_won_data_value = (response.data.total_contracts_won_data_value).toFixed(1);
    
    
          var chartOptions = {
              chart: {
                  type: 'column'
              },
              title: {
                  text: 'LEADOWNER WISE (SITE STARTED / CONTRACTS WON)'
              },
              xAxis: {
                  categories: leadowners,
                  crosshair: true
              },
              yAxis: {
                  min: 0,
                  title: {
                      text: 'Value (in lacs)'
                  }
              },
              tooltip: {
                  headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                  pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                      '<td style="padding:0"><b>{point.y:.1f} L</b></td></tr>',
                  footerFormat: '</table>',
                  shared: true,
                  useHTML: true
              },
              plotOptions: {
                  column: {
                      pointPadding: 0.2,
                      borderWidth: 0
                  }
              },
              series: leadowners_data
          };
          
          Highcharts.chart('sitestarted_bar', chartOptions);
    
    
        }
        
      });
  }


  $scope.setType = function(type) {

    if(type === 'date') {
        $scope.is_date_filter = true;
        $scope.month_filter = '';
    } else {
        $scope.from_date_filter = '';
        $scope.to_date_filter = '';
        $scope.is_date_filter = false;
    }

    if(type === 'month') {
        $scope.is_month_filter = true;
        $scope.from_date_filter = '';
        $scope.to_date_filter = '';
    } else {
        $scope.is_month_filter = false;
        $scope.month_filter = '';
    }

  };

  $scope.apply_filter = function() {
    
    var filter_data = {};

    // if($scope.financial_year_filter === '') {
    //     toastr.error(null, "Please select your financial year.");
    //     return;
    // }

    if($scope.type_filter === '') {
        toastr.error(null, "Please select your filter type.");
        return;
    }

    if($scope.type_filter === 'date') {

        if($scope.from_date_filter === '' || $scope.from_date_filter === undefined || $scope.from_date_filter === null) {
            toastr.error(null, "Please select your from date.");
            return;
        }

        if($scope.to_date_filter === '' || $scope.to_date_filter === undefined || $scope.to_date_filter === null) {
            toastr.error(null, "Please select your to date.");
            return;
        }

    }

    if($scope.type_filter === 'month') {
        if($scope.month_filter === '' || $scope.month_filter === undefined || $scope.month_filter === null) {
            toastr.error(null, "Please select your month.");
            return;
        }
    }

    // filter_data.financial_year = $scope.financial_year_filter;
    if($scope.type_filter === 'date') {
        filter_data.from_date = $scope.from_date_filter;
        filter_data.to_date = $scope.to_date_filter;
    }
    if($scope.type_filter === 'month') {
        filter_data.month = $scope.month_filter;
    }

    loadLeadsByIndustryData(filter_data);
    loadLeadsByLeadSource(filter_data);
    loadContractWonSiteStartedData(filter_data);
    loadSiteStartedData(filter_data);
    loadContractWonSiteStartedDataMonthWise(filter_data);

  };


    function numDifferentiation(val) {
        val = parseFloat(val);
        if(val >= 10000000) val = (val/10000000).toFixed(1) + ' Cr';
        else if(val >= 100000) val = (val/100000).toFixed(1) + ' L';
        else if(val >= 1000) val = (val/1000).toFixed(1) + ' K';
        else val = val.toFixed(1);
        return val;
    }
    

  },
]);
