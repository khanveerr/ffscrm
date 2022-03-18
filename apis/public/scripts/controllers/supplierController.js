(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('SupplierController', SupplierController);

    function SupplierController(SupplierService, SiteService, $rootScope, $scope, ngDialog, SweetAlert, $location, toastr) {


        var user = JSON.parse(localStorage.getItem('user')); 
        if(user) {
            $rootScope.authenticated = true;
            $rootScope.currentUser = user;
        } else {
            $location.path( "/user/login" );

        }


        var vm = this;
        vm.months = [];
        vm.years = [];
        var months = [];
        var years = [];
        vm.supplier_list = [];

        const monthNames = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        vm.sites = [];

        var current_date = new Date();
        var current_month = current_date.getMonth();
        var current_year = current_date.getFullYear();

        for (var i = 1; i < monthNames.length; i++) {
            months.push({ name: monthNames[i], value: i });
        }

        for (var j = 2019; j <= current_year; j++) {
            years.push({ name: j, value: j });
        }

        vm.years = years;

        vm.months = months;


        SiteService.getAllSites().then(function(response){
            console.log(response);
            vm.sites = response.data;
        });

        vm.getSupplierList = function() {

            if ($scope.filter_year == undefined || $scope.filter_year == null || $scope.filter_year == '') {
                // SweetAlert.swal("Info!", "Please select year.", "info");
                return;
            }

            if ($scope.filter_month == undefined || $scope.filter_month == null || $scope.filter_month == '') {
                // toastr.error('Please select month');
                return;
            }

            if ($scope.filter_site == undefined || $scope.filter_site == null || $scope.filter_site == '') {
                // toastr.error('Please select site');
                return;
            }

            SupplierService.getSupplierList($scope.filter_year, $scope.filter_month,$scope.filter_site).then(function(response){
                console.log(response);
                vm.supplier_list = response.data.supplier_lists;
                vm.site_name = response.data.site_name;
                vm.requisition_period = response.data.requisition_period;
                vm.tax_info = response.data.tax_info;
            })

        };

        vm.exportData = function() {

            if ($scope.filter_year == undefined || $scope.filter_year == null || $scope.filter_year == '') {
                // SweetAlert.swal("Info!", "Please select year.", "info");
                return;
            }

            if ($scope.filter_month == undefined || $scope.filter_month == null || $scope.filter_month == '') {
                toastr.error('Please select month');
                return;
            }

            if ($scope.filter_site == undefined || $scope.filter_site == null || $scope.filter_site == '') {
                toastr.error('Please select site');
                return;
            }

            SupplierService.exportSupplierList($scope.filter_year, $scope.filter_month,$scope.filter_site).then(function(response){
                if(response != undefined && response.data != undefined) {

                    var path = response.data.path;
                    var filename = response.data.filename;

                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',path);
                    downloadLink.attr('download', filename);
                    downloadLink[0].click();

                }
            })

        }

        
    }

})();