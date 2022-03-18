(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('InventoryAssignController', InventoryAssignController);

    function InventoryAssignController(InventoryAssignService, $rootScope, $scope, ngDialog, SweetAlert, $location, $stateParams) {

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
        $scope.inventory_id = 0;
        var inventory_id = 0;

        if($stateParams.inventoryId != null && $stateParams.inventoryId != undefined && $stateParams.inventoryId != "") {
            $scope.inventory_id = $stateParams.inventoryId;
        }


        vm.getAssignedInventories = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            inventory_id = $scope.inventory_id;

            InventoryAssignService.getAssignedInventories(pageNumber, inventory_id).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.assigned_inventories  = response.data.data;
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


        vm.addAssignInventory = function() {


            var dialog = ngDialog.open({
                className: 'ngdialog-theme-default custom-dialog-css',
                template: '../views/inventory/user_assign/add.html',
                resolve: {
                    sites_obj: ['SiteService', function(SiteService) {
                        
                        return SiteService.getSites().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    employee_obj: ['EmployeeService', function(EmployeeService) {
                        
                        return EmployeeService.getEmployees().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    departments_obj: ['DepartmentService', function(DepartmentService) {
                        
                        return DepartmentService.getDepartments().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'InventoryAssignService', 'sites_obj', 'employee_obj', 'departments_obj', function($scope, InventoryAssignService, sites_obj, employee_obj, departments_obj) {
                    
                    $scope.sites = sites_obj;
                    $scope.employees = employee_obj;
                    $scope.departments = departments_obj;

                    $scope.addAssignInventory = function() {

                        var data = {};

                        if($stateParams.inventoryId != null && $stateParams.inventoryId != undefined && $stateParams.inventoryId != "") {
                            $scope.inventory_id = $stateParams.inventoryId;
                        }

                        data.inventory_id = $scope.inventory_id;
                        data.site_id = $scope.site_id;
                        data.employee_id = $scope.employee_id;
                        data.department_id = $scope.department_id;
                        data.repair_cost = $scope.repair_cost;
                        data.assigned_date = $scope.assigned_date;

                        InventoryAssignService.addAssignInventory(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Inventory assigned.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getAssignedInventories();
            });

        };


        vm.edit_inventory = function(id) {

            var dialog = ngDialog.open({
                template: '../views/inventory/user_assign/add.html',
                resolve: {
                    assigned_inventory_obj: ['InventoryAssignService', function(InventoryAssignService) {
                        
                        return InventoryAssignService.getAssignedInventory(id).then(function(response){
                            return response.data;
                        });
                    
                    }],
                    sites_obj: ['SiteService', function(SiteService) {
                        
                        return SiteService.getSites().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    employee_obj: ['EmployeeService', function(EmployeeService) {
                        
                        return EmployeeService.getEmployees().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    departments_obj: ['DepartmentService', function(DepartmentService) {
                        
                        return DepartmentService.getDepartments().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'InventoryAssignService', 'assigned_inventory_obj', 'sites_obj', 'employee_obj', 'departments_obj', '$timeout', function($scope, InventoryAssignService, assigned_inventory_obj, sites_obj, employee_obj, departments_obj, $timeout) {

                    $scope.sites = sites_obj;
                    $scope.employees = employee_obj;
                    $scope.departments = departments_obj;

                    $scope.assigned_inventory_id = assigned_inventory_obj.id;
                    $scope.inventory_id = assigned_inventory_obj.inventory_id;
                    $scope.site_id = assigned_inventory_obj.site_id;
                    $scope.department_id = assigned_inventory_obj.department_id;
                    $scope.employee_id = assigned_inventory_obj.employee_id;
                    $scope.repair_cost = assigned_inventory_obj.repair_cost;
                    $scope.assigned_date = assigned_inventory_obj.assigned_date;


                    $scope.addAssignInventory = function() {

                        var data = {};

                        data.id = $scope.assigned_inventory_id;
                        data.inventory_id = $scope.inventory_id;
                        data.site_id = $scope.site_id;
                        data.employee_id = $scope.employee_id;
                        data.department_id = $scope.department_id;
                        data.repair_cost = $scope.repair_cost;
                        data.assigned_date = $scope.assigned_date;

                        InventoryAssignService.addAssignInventory(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Assigned inventory updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getAssignedInventories();
            });


        };

        vm.delete_inventory = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this assigned inventory?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                InventoryAssignService.deleteAssignedInventory(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Inventory deleted.", "success");
                        vm.getAssignedInventories();
                    }
                });

              }

          });

        };

    }


})();