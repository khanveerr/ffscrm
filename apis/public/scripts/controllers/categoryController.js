(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('CategoryController', CategoryController);

    function CategoryController(CategoryService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getCategories = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            CategoryService.getCategories(pageNumber).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.categories        = response.data.data;
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


        vm.addCategory = function() {


            var dialog = ngDialog.open({
                template: '../views/category/add.html',
                controller: ['$scope', 'CategoryService', function($scope, CategoryService) {
                    
                    $scope.addCategory = function() {

                        var data = {};

                        data.id = '';
                        data.name = $scope.name;

                        CategoryService.addCategory(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Category added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getCategories();
            });

        };


        vm.edit_category = function(id) {

            var dialog = ngDialog.open({
                template: '../views/category/add.html',
                resolve: {
                    category_obj: ['CategoryService', function(CategoryService) {
                        
                        return CategoryService.getCategory(id).then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'CategoryService', 'category_obj', function($scope, CategoryService, category_obj) {
                    
                    $scope.category_id = category_obj.id;
                    $scope.name = category_obj.name;

                    $scope.addCategory = function() {

                        var data = {};

                        data.id = $scope.category_id;
                        data.name = $scope.name;

                        CategoryService.addCategory(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Category updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getCategories();
            });


        };

        vm.delete_category = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this category?",
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

                CategoryService.deleteCategory(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Category deleted.", "success");
                        vm.getCategories();
                    }
                });

              }

          });

        };

        
    }

})();