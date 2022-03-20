(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('InventoryTransferController', InventoryTransferController);

    function InventoryTransferController(InventoryTransferService, $rootScope, $scope, ngDialog, SweetAlert, $location, $stateParams) {

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


        vm.getTransferredInventories = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            inventory_id = $scope.inventory_id;

            InventoryTransferService.getTransferredInventories(pageNumber, inventory_id).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.transferred_inventories  = response.data.data;
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


        vm.addTransferInventory = function() {


            var dialog = ngDialog.open({
                className: 'ngdialog-theme-default custom-dialog-css',
                template: '../views/inventory/transfer/add.html',
                resolve: {
                    sites_obj: ['SiteService', function(SiteService) {
                        
                        return SiteService.getSites().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    cost_centre_obj: ['CostCentreService', function(CostCentreService) {
                        
                        return CostCentreService.getCostCentres().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'InventoryTransferService', 'sites_obj', 'cost_centre_obj', function($scope, InventoryTransferService, sites_obj, cost_centre_obj) {
                    
                    $scope.sites = sites_obj;
                    $scope.cost_centres = cost_centre_obj;

                    $scope.addTransferInventory = function() {

                        var data = {};

                        if($stateParams.inventoryId != null && $stateParams.inventoryId != undefined && $stateParams.inventoryId != "") {
                            $scope.inventory_id = $stateParams.inventoryId;
                        }

                        data.inventory_id = $scope.inventory_id;
                        data.site_id = $scope.site_id;
                        data.cost_centre_id = $scope.cost_centre_id;
                        data.rental_amount = $scope.rental_amount;
                        data.transferred_site_id = $scope.transferred_site_id;

                        InventoryTransferService.addTransferInventory(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Inventory transferred.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getTransferredInventories();
            });

        };


        vm.edit_inventory = function(id) {

            var dialog = ngDialog.open({
                template: '../views/inventory/transfer/add.html',
                resolve: {
                    transferred_inventory_obj: ['InventoryTransferService', function(InventoryTransferService) {
                        
                        return InventoryTransferService.getTranserredInventory(id).then(function(response){
                            return response.data;
                        });
                    
                    }],
                    sites_obj: ['SiteService', function(SiteService) {
                        
                        return SiteService.getSites().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    cost_centre_obj: ['CostCentreService', function(CostCentreService) {
                        
                        return CostCentreService.getCostCentres().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'InventoryTransferService', 'transferred_inventory_obj', 'sites_obj', 'employee_obj', 'departments_obj', '$timeout', function($scope, InventoryTransferService, assigned_inventory_obj, sites_obj, employee_obj, departments_obj, $timeout) {

                    $scope.sites = sites_obj;
                    $scope.cost_centres = cost_centre_obj;

                    $scope.transfer_inventory_id = transferred_inventory_obj.id;
                    $scope.inventory_id = transferred_inventory_obj.inventory_id;
                    $scope.site_id = transferred_inventory_obj.site_id;
                    $scope.cost_centre_id = transferred_inventory_obj.cost_centre_id;
                    $scope.rental_amount = transferred_inventory_obj.rental_amount;
                    $scope.transferred_site_id = transferred_inventory_obj.transferred_site_id;


                    $scope.addTransferInventory = function() {

                        var data = {};

                        data.id = $scope.transfer_inventory_id;
                        data.inventory_id = $scope.inventory_id;
                        data.site_id = $scope.site_id;
                        data.cost_centre_id = $scope.cost_centre_id;
                        data.rental_amount = $scope.rental_amount;
                        data.transferred_site_id = $scope.transferred_site_id;

                        InventoryTransferService.addTransferInventory(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Transferred inventory updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getTransferredInventories();
            });


        };

        vm.delete_inventory = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this transferred inventory?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                InventoryTransferService.deleteTranserredInventory(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Transferred inventory deleted.", "success");
                        vm.getTransferredInventories();
                    }
                });

              }

          });

        };

    }


})();