(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('UserController', UserController);  

    function UserController($http, $rootScope, $location, $scope, ngDialog, SweetAlert, UserService) {

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


        vm.getUsers = function() {

            // This request will hit the index method in the AuthenticateController
            // on the Laravel side and will return the list of users
            $http.get('api/authenticate').then(function(users) {
                console.log(users);
                vm.users = users.data;
            },function(error) {
                vm.error = error;
            });
        }

        vm.getAllUsers = function(pageNumber,keyword = null){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            if (keyword == null) {
                keyword = '';
            }

            UserService.getAllUsers(pageNumber,keyword).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.users        = response.data.data;
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


        vm.addUser = function() {


            var dialog = ngDialog.open({
                template: '../views/user/add.html',
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
                controller: ['$scope', 'UserService', 'zones_obj', 'states_obj', function($scope, UserService, zones_obj, states_obj) {

                    $scope.is_edit_user = false;
                    $scope.zones = zones_obj;
                    $scope.states = states_obj;
                    
                    $scope.addUser = function() {

                        var data = {};

                        data.id = '';
                        data.name = $scope.name;
                        data.email = $scope.email;
                        data.password = $scope.password;
                        data.user_type = $scope.user_type;
                        data.zone_id = $scope.zone_id;
                        data.state_id = $scope.state_id;

                        UserService.addUser(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Sent!", "User added.", "success");
                            }
                        }, function(response){

                            console.log(response);

                            var errors = response.data.errors;

                            //$scope.closeThisDialog(null);


                            if(errors.hasOwnProperty('email')) {
                                //SweetAlert.swal("Error!", "Email Id already exists", "error");
                                $scope.userForm.email.$error.exists = true;
                            } else {
                                $scope.userForm.email.$error.exists = false;
                            }

                            if(errors.hasOwnProperty('password')) {
                                $scope.userForm.password.$error.mlen = true;
                            } else {
                                $scope.userForm.password.$error.mlen = false;
                            }


                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getAllUsers();
            });

        };


        vm.edit_user = function(id) {

            var dialog = ngDialog.open({
                template: '../views/user/add.html',
                resolve: {
                    user_obj: ['UserService', function(UserService) {
                        
                        return UserService.getUser(id).then(function(response){
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
                controller: ['$scope', 'UserService', 'user_obj', 'zones_obj', 'states_obj', function($scope, UserService, user_obj, zones_obj, states_obj) {
                    

                    $scope.zones = zones_obj;
                    $scope.states = states_obj;

                    $scope.user_id = user_obj.id;
                    $scope.name = user_obj.name;
                    $scope.email = user_obj.email;
                    $scope.user_type = user_obj.user_type;
                    $scope.zone_id =  user_obj.zone_id != "" ? parseInt(user_obj.zone_id) : undefined;
                    $scope.state_id = user_obj.state_id != "" ? parseInt(user_obj.state_id) : undefined;

                    $scope.is_edit_user = true;


                    $scope.addUser = function() {

                        var data = {};

                        data.id = $scope.user_id;
                        data.name = $scope.name;
                        data.email = $scope.email;
                        data.user_type = $scope.user_type;
                        data.zone_id = $scope.zone_id;
                        data.state_id = $scope.state_id;

                        UserService.addUser(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Sent!", "User updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getAllUsers();
            });


        };


        vm.delete_user = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this user?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                UserService.deleteUser(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "User deleted.", "success");
                        vm.getAllUsers();
                    }
                });

              }

          });

        };


    }

})();