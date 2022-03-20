(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('ItemTypeController', ItemTypeController);

    function ItemTypeController(ItemTypeService, $scope, $rootScope, ngDialog, SweetAlert, $location) {

        var vm = this;

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

        // function loadZones() {

        //     ItemTypeService.getItemTypes().then(function(response){
        //         console.log(response);
        //         vm.zones = response.data.data;
        //     });

        // }

        vm.getItemTypes = function(pageNumber,keyword = null){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            if (keyword == null) {
                keyword = '';
            }

            ItemTypeService.getItemTypes(pageNumber,keyword).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.item_types   = response.data.data;
              vm.totalPages   = response.data.last_page;
              vm.currentPage  = response.data.current_page;

              if((response.data.current_page != response.data.last_page) && response.data.last_page > 0) {
                vm.showPagination = true
              }

              var pages = [];

              for(var i=1;i<=response.data.last_page;i++) {          
                pages.push(i);
              }

              vm.range = pages; 

            });

        };


        vm.addItemType = function() {


            var dialog = ngDialog.open({
                template: '../views/item_type/add.html',
                controller: ['$scope', 'ItemTypeService', function($scope, ItemTypeService) {
                    
                    $scope.addItemType = function() {

                        var data = {};

                        data.id = '';
                        data.name = $scope.type_name;
                        data.code = $scope.type_code;

                        ItemTypeService.addItemType(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Sent!", "Item Type added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getItemTypes();
            });

        };


        vm.edit_item_type = function(id) {

            var dialog = ngDialog.open({
                template: '../views/item_type/add.html',
                resolve: {
                    item_type_obj: ['ItemTypeService', function(ItemTypeService) {
                        
                        return ItemTypeService.getItemType(id).then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'ItemTypeService', 'item_type_obj', function($scope, ItemTypeService, item_type_obj) {
                    
                    $scope.type_id = item_type_obj.id;
                    $scope.type_name = item_type_obj.name;
                    $scope.type_code = item_type_obj.code;

                    $scope.addItemType = function() {

                        var data = {};

                        data.id = $scope.type_id;
                        data.name = $scope.type_name;
                        data.code = $scope.type_code;

                        ItemTypeService.addItemType(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Sent!", "Item Type updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getItemTypes();
            });


        };

        vm.delete_item_type = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this item type?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                // LeadManagerService.sendEmail(data).then(function(res){
                //   console.log();
                //     if(res.status == 200 && res.statusText == "OK") {
                //       SweetAlert.swal("Success!", "Quotation sent to user.", "success");
                //     }
                // });

                ItemTypeService.deleteItemType(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Item Type deleted.", "success");
                        vm.getItemTypes();
                    }
                });

              }

          });

        };

        // vm.getItemTypes = function() {

        //     // This request will hit the index method in the ZoneController
        //     // on the Laravel side and will return the list of zones

        // }
    }

})();