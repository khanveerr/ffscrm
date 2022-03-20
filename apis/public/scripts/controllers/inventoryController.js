(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('InventoryController', InventoryController);

    function InventoryController(InventoryService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getInventories = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            InventoryService.getInventories(pageNumber).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.inventories  = response.data.data;
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


        vm.addInventory = function() {


            var dialog = ngDialog.open({
                className: 'ngdialog-theme-default custom-dialog-css',
                template: '../views/inventory/add.html',
                resolve: {
                    companies_obj: ['CompanyService', function(CompanyService) {
                        
                        return CompanyService.getCompanies().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    employee_obj: ['EmployeeService', function(EmployeeService) {
                        
                        return EmployeeService.getEmployees().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    category_obj: ['CategoryService', function(CategoryService) {
                        
                        return CategoryService.getCategories().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    vendor_obj: ['VendorService', function(VendorService) {
                        
                        return VendorService.getVendors().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    brand_obj: ['BrandService', function(BrandService) {
                        
                        return BrandService.getBrands().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    model_no_obj: ['ModelNoService', function(ModelNoService) {
                        
                        return ModelNoService.getModelNos().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'InventoryService', 'companies_obj', 'employee_obj', 'category_obj' , 'vendor_obj', 'brand_obj', 'model_no_obj', function($scope, InventoryService, companies_obj, employee_obj, category_obj , vendor_obj, brand_obj, model_no_obj) {
                    
                    $scope.companies = companies_obj;
                    $scope.employees = employee_obj;
                    $scope.categories = category_obj;
                    $scope.vendors = vendor_obj;
                    $scope.brands = brand_obj;
                    $scope.model_nos = model_no_obj;

                    $scope.addInventory = function() {

                        var data = {};

                        data.company_id = $scope.company_id;
                        data.request_from_id = $scope.request_from_id;
                        data.approved_by_id = $scope.approved_by_id;
                        data.category_id = $scope.category_id;
                        data.product_description = $scope.product_description;
                        data.vendor_id = $scope.vendor_id;
                        data.brand_id = $scope.brand_id;
                        data.serial_no = $scope.serial_no;
                        data.model_no_id = $scope.model_no_id;
                        data.asset_code = $scope.asset_code;
                        data.purchase_cost = $scope.purchase_cost;
                        // data.company_id = $scope.company_id;

                        InventoryService.addInventory(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Inventory added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getInventories();
            });

        };


        vm.edit_inventory = function(id) {

            var dialog = ngDialog.open({
                template: '../views/inventory/add.html',
                resolve: {
                    inventory_obj: ['InventoryService', function(InventoryService) {
                        
                        return InventoryService.getInventory(id).then(function(response){
                            return response.data;
                        });
                    
                    }],
                    companies_obj: ['CompanyService', function(CompanyService) {
                        
                        return CompanyService.getCompanies().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    employee_obj: ['EmployeeService', function(EmployeeService) {
                        
                        return EmployeeService.getEmployees().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    category_obj: ['CategoryService', function(CategoryService) {
                        
                        return CategoryService.getCategories().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    vendor_obj: ['VendorService', function(VendorService) {
                        
                        return VendorService.getVendors().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    brand_obj: ['BrandService', function(BrandService) {
                        
                        return BrandService.getBrands().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    model_no_obj: ['ModelNoService', function(ModelNoService) {
                        
                        return ModelNoService.getModelNos().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'InventoryService', 'inventory_obj', 'companies_obj', 'employee_obj', 'category_obj' , 'vendor_obj', 'brand_obj', 'model_no_obj', '$timeout', function($scope, InventoryService, inventory_obj, companies_obj, employee_obj, category_obj , vendor_obj, brand_obj, model_no_obj, $timeout) {

                    $scope.company_id = 1;
                    $scope.companies = companies_obj;
                    $scope.employees = employee_obj;
                    $scope.categories = category_obj;
                    $scope.vendors = vendor_obj;
                    $scope.brands = brand_obj;
                    $scope.model_nos = model_no_obj;

                    $scope.inventory_id = inventory_obj.id;
                    $scope.company_id = inventory_obj.company_id;
                    $scope.request_from_id = inventory_obj.request_from_id;
                    $scope.approved_by_id = inventory_obj.approved_by_id;
                    $scope.category_id = inventory_obj.category_id;
                    $scope.product_description = inventory_obj.product_description;
                    $scope.vendor_id = inventory_obj.vendor_id;
                    $scope.brand_id = inventory_obj.brand_id;
                    $scope.serial_no = inventory_obj.serial_no;
                    $scope.model_no_id = inventory_obj.model_no_id;
                    $scope.asset_code = inventory_obj.asset_code;
                    $scope.purchase_cost = inventory_obj.purchase_cost;


                    $scope.addInventory = function() {

                        var data = {};

                        data.id = $scope.inventory_id;
                        data.company_id = $scope.company_id;
                        data.request_from_id = $scope.request_from_id;
                        data.approved_by_id = $scope.approved_by_id;
                        data.category_id = $scope.category_id;
                        data.product_description = $scope.product_description;
                        data.vendor_id = $scope.vendor_id;
                        data.brand_id = $scope.brand_id;
                        data.serial_no = $scope.serial_no;
                        data.model_no_id = $scope.model_no_id;
                        data.asset_code = $scope.asset_code;
                        data.purchase_cost = $scope.purchase_cost;

                        InventoryService.addInventory(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Inventory updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getInventories();
            });


        };

        vm.delete_inventory = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this inventory?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                InventoryService.deleteInventory(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Inventory deleted.", "success");
                        vm.getInventories();
                    }
                });

              }

          });

        };

    }


})();