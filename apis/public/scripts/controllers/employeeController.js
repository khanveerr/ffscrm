(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('EmployeeController', EmployeeController);

    function EmployeeController(EmployeeService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getEmployees = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            EmployeeService.getEmployees(pageNumber).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.employees        = response.data.data;
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


        vm.addEmployee = function() {


            var dialog = ngDialog.open({
                template: '../views/employee/add.html',
                resolve: {
                    companies_obj: ['CompanyService', function(CompanyService) {
                        
                        return CompanyService.getCompanies().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'EmployeeService', 'companies_obj', function($scope, EmployeeService, companies_obj) {
                    
                    $scope.companies = companies_obj;

                    $scope.addEmployee = function() {

                        var data = {};

                        data.id = '';
                        data.name = $scope.name;
                        data.company_id = $scope.company_id;

                        EmployeeService.addEmployee(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Employee added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getEmployees();
            });

        };


        vm.edit_employee = function(id) {

            var dialog = ngDialog.open({
                template: '../views/employee/add.html',
                resolve: {
                    employee_obj: ['EmployeeService', function(EmployeeService) {
                        
                        return EmployeeService.getEmployee(id).then(function(response){
                            return response.data;
                        });
                    
                    }],
                    companies_obj: ['CompanyService', function(CompanyService) {
                        
                        return CompanyService.getCompanies().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'EmployeeService', 'employee_obj', 'companies_obj', '$timeout', function($scope, EmployeeService, employee_obj, companies_obj, $timeout) {

                    $scope.company_id = 1;
                    $scope.companies = companies_obj;

                    $scope.employee_id = employee_obj.id;
                    $scope.name = employee_obj.name;
                    $scope.company_id = employee_obj.company_id;                        

                    $scope.addEmployee = function() {

                        var data = {};

                        data.id = $scope.employee_id;
                        data.name = $scope.name;
                        data.company_id = $scope.company_id;

                        EmployeeService.addEmployee(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Employee updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getEmployees();
            });


        };

        vm.delete_employee = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this employee?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                EmployeeService.deleteEmployee(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Employee deleted.", "success");
                        vm.getEmployees();
                    }
                });

              }

          });

        };

    }


})();