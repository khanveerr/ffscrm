(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('DepartmentController', DepartmentController);

    function DepartmentController(DepartmentService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getDepartments = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            DepartmentService.getDepartments(pageNumber).then(function(response){
            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.departments        = response.data.data;
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


        vm.addDepartment = function() {


            var dialog = ngDialog.open({
                template: '../views/department/add.html',
                resolve: {
                    sites_obj: ['SiteService', function(SiteService) {
                        
                        return SiteService.getSites().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'DepartmentService', 'sites_obj', function($scope, DepartmentService, sites_obj) {

                    $scope.sites = sites_obj;
                    
                    $scope.addDepartment = function() {

                        var data = {};

                        data.id = '';
                        data.name = $scope.name;
                        data.site_id = $scope.site_id;

                        DepartmentService.addDepartment(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Department added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getDepartments();
            });

        };


        vm.edit_department = function(id) {

            var dialog = ngDialog.open({
                template: '../views/department/add.html',
                resolve: {
                    sites_obj: ['SiteService', function(SiteService) {
                        
                        return SiteService.getSites().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    department_obj: ['DepartmentService', function(DepartmentService) {
                        
                        return DepartmentService.getDepartment(id).then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'DepartmentService', 'department_obj', 'sites_obj', function($scope, DepartmentService, department_obj, sites_obj) {
                    
                    $scope.sites = sites_obj;
                    $scope.department_id = department_obj.id;
                    $scope.name = department_obj.name;
                    $scope.site_id = department_obj.site_id;

                    $scope.addDepartment = function() {

                        var data = {};

                        data.id = $scope.department_id;
                        data.name = $scope.name;
                        data.site_id = $scope.site_id;

                        DepartmentService.addDepartment(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Department updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getDepartments();
            });


        };

        vm.delete_department = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this department?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                DepartmentService.deleteDepartment(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Department deleted.", "success");
                        vm.getDepartments();
                    }
                });

              }

          });

        };

    }

})();