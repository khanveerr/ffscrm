(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('ReqVendorController', ReqVendorController);

    function ReqVendorController(ReqVendorService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getVendors = function(pageNumber,keyword = null){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            if (keyword == null) {
                keyword = '';
            }

            ReqVendorService.getVendors(pageNumber,keyword).then(function(response){

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
                template: '../views/req_vendors/add.html',
                resolve: {
                    zones_obj: ['ZoneService', function(ZoneService) {
                        
                        return ZoneService.getZones().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    types_obj: ['ItemTypeService', function(ItemTypeService) {
                        
                        return ItemTypeService.getItemTypes().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    states_obj: ['StateService', function(StateService) {
                        
                        return StateService.getAllStates().then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'ReqVendorService', 'zones_obj', 'types_obj', 'states_obj', function($scope, ReqVendorService, zones_obj, types_obj, states_obj) {
                    
                    $scope.zones = zones_obj;
                    $scope.item_types = types_obj;
                    $scope.states = states_obj;

                    $scope.addVendor = function() {

                        var data = {};

                        data.id = '';
                        data.name = $scope.name;
                        data.zone_id = $scope.zone_id;
                        data.state_id = $scope.state_id;
                        data.item_type_id = $scope.item_type_id;
                        data.address = $scope.address;
                        //New Field
                        data.pincode = $scope.pincode;
                        data.email = $scope.email;
                        data.gst_no = $scope.gst_no;
                        // New Field
                        data.pan_no = $scope.pan_no;
                        data.code = $scope.code;
                        data.contact_person = $scope.contact_person;
                        data.contact_no = $scope.contact_no;

                        ReqVendorService.addVendor(data).then(function(response){
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

        vm.export = function() {

            ReqVendorService.export().then(function(response){

                if(response != undefined && response.data != undefined) {

                    var path = response.data.path;
                    var filename = response.data.filename;

                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',path);
                    downloadLink.attr('download', filename);
                    downloadLink[0].click();

                }
                
            });

        }


        vm.edit_vendor = function(id) {

            var dialog = ngDialog.open({
                template: '../views/req_vendors/add.html',
                resolve: {
                    vendor_obj: ['ReqVendorService', function(ReqVendorService) {
                        
                        return ReqVendorService.getVendor(id).then(function(response){
                            return response.data;
                        });
                    
                    }],
                    zones_obj: ['ZoneService', function(ZoneService) {
                        
                        return ZoneService.getZones().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    types_obj: ['ItemTypeService', function(ItemTypeService) {
                        
                        return ItemTypeService.getItemTypes().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    states_obj: ['StateService', function(StateService) {
                        
                        return StateService.getAllStates().then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'ReqVendorService', 'vendor_obj', 'zones_obj', 'types_obj', 'states_obj', '$timeout', function($scope, ReqVendorService, vendor_obj, zones_obj, types_obj, states_obj, $timeout) {

                    $scope.zones = zones_obj;
                    $scope.item_types = types_obj;
                    $scope.states = states_obj;

                    $scope.vendor_id = vendor_obj.id;
                    $scope.name = vendor_obj.name;
                    $scope.zone_id = vendor_obj.zone_id;
                    $scope.item_type_id = vendor_obj.item_type_id;
                    $scope.address = vendor_obj.address;
                    $scope.pincode = vendor_obj.pincode;
                    $scope.email = vendor_obj.email;
                    $scope.gst_no = vendor_obj.gst_no;
                    $scope.pan_no = vendor_obj.pan_no;
                    $scope.code = vendor_obj.code;
                    $scope.state_id = vendor_obj.state_id;
                    $scope.contact_person = vendor_obj.contact_person;
                    $scope.contact_no = vendor_obj.contact_no;

                    $scope.addVendor = function() {

                        var data = {};

                        data.id = $scope.vendor_id;
                        data.name = $scope.name;
                        data.zone_id = $scope.zone_id;
                        data.state_id = $scope.state_id;
                        data.item_type_id = $scope.item_type_id;
                        data.address = $scope.address;
                        data.pincode = $scope.pincode;
                        data.email = $scope.pincode;
                        data.gst_no = $scope.gst_no;
                        data.pan_no = $scope.pan_no;
                        data.code = $scope.code;
                        data.contact_person = $scope.contact_person;
                        data.contact_no = $scope.contact_no;

                        ReqVendorService.addVendor(data).then(function(response){
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

                ReqVendorService.deleteVendor(id).then(function(response){
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