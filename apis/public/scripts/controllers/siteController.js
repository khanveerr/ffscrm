(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('SiteController', SiteController);

    function SiteController(SiteService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

        var vm = this;

        vm.users;
        vm.error;

        // Grab the user from local storage and parse it to an object
        var user = JSON.parse(localStorage.getItem('user')); 
        console.log(user);
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


        vm.getSites = function(pageNumber, keyword = null){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            if (keyword == null) {
                keyword = '';
            }

            SiteService.getSites(pageNumber,keyword).then(function(response){
            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.sites        = response.data.data;
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


        vm.addSite = function() {


            var dialog = ngDialog.open({
                template: '../views/site/add.html',
                resolve: {
                    zones_obj: ['ZoneService', function(ZoneService) {
                        
                        return ZoneService.getZones().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    states_obj: ['StateService', function(StateService) {
                        
                        return StateService.getAllStates().then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'SiteService', 'zones_obj', 'states_obj', function($scope, SiteService, zones_obj, states_obj) {
                    
                    $scope.zones = zones_obj;
                    $scope.states = states_obj;
                    $scope.billing_types = [
                        {
                            value: 0,
                            name: 'Fixed'
                        }, {
                            value: 1,
                            name: 'Actuals'
                        }, {
                            value: 2,
                            name: 'No Charge'
                        }, {
                            value: 3,
                            name: 'Budgeted'
                        }
                    ];

                    $scope.addSite = function() {

                        var data = {};

                        data.id = '';
                        data.zone_id = $scope.zone_id;
                        data.state_id = $scope.state_id;
                        data.name = $scope.name;
                        data.site_address = $scope.site_address;
                        data.billing_type = $scope.billing_type;
                        data.budgeted_amount = $scope.budgeted_amount;
                        data.contact_person = $scope.contact_person;
                        data.contact_no = $scope.contact_no;

                        SiteService.addSite(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Site added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getSites();
            });

        };


        vm.edit_site = function(id) {

            var dialog = ngDialog.open({
                template: '../views/site/add.html',
                resolve: {
                    site_obj: ['SiteService', function(SiteService) {
                        
                        return SiteService.getSite(id).then(function(response){
                            return response.data;
                        });
                    
                    }],
                    zones_obj: ['ZoneService', function(ZoneService) {
                        
                        return ZoneService.getZones().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    states_obj: ['StateService', function(StateService) {
                        
                        return StateService.getAllStates().then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'SiteService', 'site_obj', 'zones_obj', 'states_obj', '$timeout', function($scope, SiteService, site_obj, zones_obj, states_obj, $timeout) {
                    
                    $scope.zones = zones_obj;
                    $scope.states = states_obj;

                    $scope.billing_types = [
                        {
                            value: 0,
                            name: 'Fixed'
                        }, {
                            value: 1,
                            name: 'Actuals'
                        }, {
                            value: 2,
                            name: 'No Charge'
                        }, {
                            value: 3,
                            name: 'Budgeted'
                        }
                    ];

                    console.log(site_obj);


                    $timeout(function(){

                        $scope.site_id = site_obj.id;
                        $scope.zone_id = site_obj.zone_id != "" ? site_obj.zone_id : undefined;
                        $scope.state_id = site_obj.state_id != "" ? site_obj.state_id : undefined;
                        $scope.name = site_obj.name;
                        $scope.site_address = site_obj.site_address;
                        $scope.billing_type = site_obj.billing_type != "" ? site_obj.billing_type : 0;
                        $scope.budgeted_amount = site_obj.budgeted_amount;
                        $scope.contact_person = site_obj.contact_person;
                        $scope.contact_no = site_obj.contact_no;

                    },1000);

                    

                    $scope.addSite = function() {

                        var data = {};

                        data.id = $scope.site_id;
                        data.zone_id = $scope.zone_id;
                        data.state_id = $scope.state_id;
                        data.name = $scope.name;
                        data.site_address = $scope.site_address;
                        data.billing_type = $scope.billing_type;
                        data.budgeted_amount = $scope.budgeted_amount;
                        data.contact_person = $scope.contact_person;
                        data.contact_no = $scope.contact_no;

                        SiteService.addSite(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Site updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getSites();
            });


        };

        vm.delete_site = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this site?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                SiteService.deleteSite(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Site deleted.", "success");
                        vm.getSites();
                    }
                });

              }

          });

        };

    }

})();