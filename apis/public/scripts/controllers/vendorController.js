(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('VendorController', VendorController);

    function VendorController(VendorService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

        var vm = this;

        vm.users;
        vm.error;

        // Grab the user from local storage and parse it to an object
        var user = JSON.parse(localStorage.getItem('user')); 
        if(user) {
            $rootScope.authenticated = true;
            $rootScope.currentUser = user;
        } else {
            $location.path( "/user/login" );

        }

        vm.totalPages = 0;
        vm.currentPage = 1;
        vm.range = [];
        vm.showPagination = false;


        vm.getVendors = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            VendorService.getVendors(pageNumber).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.vendors        = response.data.data;
              vm.totalPages   = response.data.last_page;
              vm.currentPage  = response.data.current_page;

              if(response.data.current_page != response.data.last_page && response.data.last_page != 0) {
                vm.showPagination = true
              }

              var pages = [];

              for(var i=1;i<=response.data.last_page;i++) {          
                pages.push(i);
              }

              vm.range = pages; 

            });

        };


        vm.addVendor = function() {


            var dialog = ngDialog.open({
                template: '../views/vendor/add.html',
                resolve: {
                    companies_obj: ['CompanyService', function(CompanyService) {
                        
                        return CompanyService.getCompanies().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'VendorService', 'companies_obj', function($scope, VendorService, companies_obj) {
                    
                    $scope.companies = companies_obj;

                    $scope.addVendor = function() {

                        var data = {};

                        data.id = '';
                        data.name = $scope.name;
                        data.company_id = $scope.company_id;

                        VendorService.addVendor(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Vendor added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getVendors();
            });

        };


        vm.edit_vendor = function(id) {

            var dialog = ngDialog.open({
                template: '../views/vendor/add.html',
                resolve: {
                    vendor_obj: ['VendorService', function(VendorService) {
                        
                        return VendorService.getVendor(id).then(function(response){
                            return response.data;
                        });
                    
                    }],
                    companies_obj: ['CompanyService', function(CompanyService) {
                        
                        return CompanyService.getCompanies().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'VendorService', 'vendor_obj', 'companies_obj', '$timeout', function($scope, VendorService, vendor_obj, companies_obj, $timeout) {

                    $scope.company_id = 1;
                    $scope.companies = companies_obj;

                    $scope.vendor_id = vendor_obj.id;
                    $scope.name = vendor_obj.name;
                    $scope.company_id = vendor_obj.company_id;                        

                    $scope.addVendor = function() {

                        var data = {};

                        data.id = $scope.vendor_id;
                        data.name = $scope.name;
                        data.company_id = $scope.company_id;

                        VendorService.addVendor(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Vendor updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getVendors();
            });


        };

        vm.delete_vendor = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this vendor?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                VendorService.deleteVendor(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Vendor deleted.", "success");
                        vm.getVendors();
                    }
                });

              }

          });

        };

    }


})();