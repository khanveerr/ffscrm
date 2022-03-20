(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('StateController', StateController);

    function StateController(StateService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getStates = function(pageNumber,keyword = null){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            if (keyword == null) {
                keyword = '';
            }

            StateService.getStates(pageNumber,keyword).then(function(response){
            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.states        = response.data.data;
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


        vm.addState = function() {


            var dialog = ngDialog.open({
                template: '../views/state/add.html',
                resolve: {
                    zones_obj: ['ZoneService', function(ZoneService) {
                        
                        return ZoneService.getZones().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'StateService', 'zones_obj', function($scope, StateService, zones_obj) {
                    
                    $scope.zones = zones_obj;

                    $scope.addState = function() {

                        var data = {};

                        data.id = '';
                        data.zone_id = $scope.zone_id;
                        data.name = $scope.name;
                        data.code = $scope.code;

                        StateService.addState(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "State added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getStates();
            });

        };


        vm.edit_state = function(id) {

            var dialog = ngDialog.open({
                template: '../views/state/add.html',
                resolve: {
                    state_obj: ['StateService', function(StateService) {
                        
                        return StateService.getState(id).then(function(response){
                            return response.data;
                        });
                    
                    }],
                    zones_obj: ['ZoneService', function(ZoneService) {
                        
                        return ZoneService.getZones().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'StateService', 'state_obj', 'zones_obj', function($scope, StateService, state_obj, zones_obj) {
                    
                    $scope.zones = zones_obj;

                    $scope.state_id = state_obj.id;
                    $scope.zone_id = state_obj.zone_id;
                    $scope.name = state_obj.name;
                    $scope.code = state_obj.code;

                    $scope.addState = function() {

                        var data = {};

                        data.id = $scope.state_id;
                        data.zone_id = $scope.zone_id;
                        data.name = $scope.name;
                        data.code = $scope.code;

                        StateService.addState(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "State updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getStates();
            });


        };

        vm.delete_state = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this state?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                StateService.deleteState(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "State deleted.", "success");
                        vm.getStates();
                    }
                });

              }

          });

        };

    }

})();