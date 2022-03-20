(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('CompanyController', CompanyController);

    function CompanyController(CompanyService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getCompanies = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            CompanyService.getCompanies(pageNumber).then(function(response){
            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.companies        = response.data.data;
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


        vm.addCompany = function() {


            var dialog = ngDialog.open({
                template: '../views/company/add.html',
                controller: ['$scope', 'CompanyService', function($scope, CompanyService) {
                    
                    $scope.addCompany = function() {

                        var data = {};

                        data.id = '';
                        data.name = $scope.name;

                        CompanyService.addCompany(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Company added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getCompanies();
            });

        };


        vm.edit_company = function(id) {

            var dialog = ngDialog.open({
                template: '../views/company/add.html',
                resolve: {
                    company_obj: ['CompanyService', function(CompanyService) {
                        
                        return CompanyService.getCompany(id).then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'CompanyService', 'company_obj', function($scope, CompanyService, company_obj) {
                    
                    $scope.company_id = company_obj.id;
                    $scope.name = company_obj.name;

                    $scope.addCompany = function() {

                        var data = {};

                        data.id = $scope.company_id;
                        data.name = $scope.name;

                        CompanyService.addCompany(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Company updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getCompanies();
            });


        };

        vm.delete_company = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this company?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                CompanyService.deleteCompany(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Company deleted.", "success");
                        vm.getCompanies();
                    }
                });

              }

          });

        };

    }

})();