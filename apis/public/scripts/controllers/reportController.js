(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('ReportController', ReportController);

    function ReportController(ReqService, CompanyService, ItemTypeService, SiteService, ProcureService, $rootScope, $scope, ngDialog, SweetAlert, $location, $state, $stateParams, $timeout, ReqVendorService, ZoneService) {

        var vm = this;

        vm.users;
        vm.error;
        $rootScope.items = [];

        // Grab the user from local storage and parse it to an object
        var user = JSON.parse(localStorage.getItem('user')); 
        if(user) {
            $rootScope.authenticated = true;
            $rootScope.currentUser = user;
        } else {
            $location.path( "/user/login" );

        }

        console.log(user);

        vm.totalPages = 0;
        vm.currentPage = 1;
        vm.range = [];
        vm.showPagination = false;
        vm.vendors = [];
        const monthNames = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        vm.report_months = [];
        for (var i = 1; i < monthNames.length; i++) {
            vm.report_months.push({ name: monthNames[i], value: i });
        }      

        vm.zones = [];
        ZoneService.getZones().then(function(response){
            vm.zones = response.data.data;
        });

        vm.states = [];
        SiteService.getSiteStates().then(function(response){
            // debugger;
            // console.log(response);
            vm.states = response.data;
            console.log(vm.states);
        });

        vm.billing_types = [
            {
                value: 0,
                name: 'Fixed'
            }, {
                value: 1,
                name: 'Actuals'
            }, {
                value: 2,
                name: 'No Charge'
            }
        ];

        vm.chargeable_types = [
            {
                value: 0,
                name: 'Non Chargeable'
            }, {
                value: 1,
                name: 'Chargeable'
            }
        ];

        ItemTypeService.getItemTypes().then(function(response){
            console.log(response);
            vm.item_types = response.data.data;
        });

        SiteService.getAllSites().then(function(response){
            console.log(response);
            vm.sites = response.data;
        });

        get_report_data({});


        $scope.filterData = function() {

            var data = {};

            if ($scope.filter_month != undefined && $scope.filter_month != null && $scope.filter_month != "") {
                data.month = $scope.filter_month;
            }

            if ($scope.filter_state != undefined && $scope.filter_state != null && $scope.filter_state != "") {
                data.state = $scope.filter_state;
            }

            if ($scope.filter_billing_type != undefined && $scope.filter_billing_type != null && $scope.filter_billing_type != "") {
                data.billing_type = $scope.filter_billing_type;
            }

            if ($scope.filter_item_type != undefined && $scope.filter_item_type != null && $scope.filter_item_type != "") {
                data.item_type = $scope.filter_item_type;
            }

            if ($scope.filter_site != undefined && $scope.filter_site != null && $scope.filter_site != "") {
                data.site = $scope.filter_site;
            }

            //if ($scope.filter_chargeable_type != "") {
                data.chargeable_type = $scope.filter_chargeable_type;
            //}

            get_report_data(data);


        };



        // var chartOptions = {
        //     chart: {
        //         type: 'column'
        //     },
        //     title: {
        //         text: 'Stacked column chart'
        //     },
        //     xAxis: {
        //         categories: ['Apples', 'Oranges', 'Pears']
        //     },
        //     yAxis: {
        //         min: 0,
        //         title: {
        //             text: 'Total fruit consumption'
        //         }
        //     },
        //     tooltip: {
        //         pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        //         shared: true
        //     },
        //     plotOptions: {
        //         column: {
        //             stacking: 'normal'
        //         }
        //     },
        //     series: [{
        //         name: 'John',
        //         data: [5, 3, 4]
        //     }, {
        //         name: 'Jane',
        //         data: [2, 2, 3]
        //     }, {
        //         name: 'Joe',
        //         data: [3, 4, 4]
        //     }]
        // };


        // Highcharts.chart('pie_chart', chartOptions);


        function get_report_data(data) {

            ReqService.getReportData(data).then(function(response){

                var formatted_data = response.data.data;
                vm.tbl_sites = response.data.sites;

                vm.total_tbl_sales = 0;
                vm.total_tbl_purchase = 0;
                vm.total_tbl_profit = 0;

                var total_tbl_sales = 0;
                var total_tbl_purchase = 0;
                var total_tbl_profit = 0;

                angular.forEach(vm.tbl_sites, function(value, key){

                    if (value.report_data.sales.length > 0) {
                        total_tbl_sales += parseFloat(value.report_data.sales[1]);
                    }

                    if (value.report_data.purchase.length > 0) {
                        total_tbl_purchase += parseFloat(value.report_data.purchase[1]);
                    }

                    if (value.report_data.profit.length > 0) {
                        total_tbl_profit += parseFloat(value.report_data.profit[1]);
                    }

                });

                vm.total_tbl_sales = total_tbl_sales.toFixed(2);
                vm.total_tbl_purchase = total_tbl_purchase.toFixed(2);
                vm.total_tbl_profit = total_tbl_profit.toFixed(2);

                var chartOptions = {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Sales / Purchase / Profit'
                    },
                    xAxis: {
                        categories: ['Sales', 'Purchase', 'Profit']
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Item Charge'
                        }
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },
                    series: formatted_data
                };


                Highcharts.chart('stacked_bar_chart', chartOptions);


            });

        }


    }

})();