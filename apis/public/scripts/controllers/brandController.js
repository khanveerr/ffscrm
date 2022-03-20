(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('BrandController', BrandController);

    function BrandController(BrandService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getBrands = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            BrandService.getBrands(pageNumber).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.brands        = response.data.data;
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


        vm.addBrand = function() {


            var dialog = ngDialog.open({
                template: '../views/brand/add.html',
                controller: ['$scope', 'BrandService', function($scope, BrandService) {
                    
                    $scope.addBrand = function() {

                        var data = {};

                        data.id = '';
                        data.name = $scope.name;

                        BrandService.addBrand(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Brand added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getBrands();
            });

        };


        vm.edit_brand = function(id) {

            var dialog = ngDialog.open({
                template: '../views/brand/add.html',
                resolve: {
                    brand_obj: ['BrandService', function(BrandService) {
                        
                        return BrandService.getCategory(id).then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'BrandService', 'brand_obj', function($scope, BrandService, brand_obj) {
                    
                    $scope.brand_id = brand_obj.id;
                    $scope.name = brand_obj.name;

                    $scope.addBrand = function() {

                        var data = {};

                        data.id = $scope.brand_id;
                        data.name = $scope.name;

                        BrandService.addBrand(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Brand updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getBrands();
            });


        };

        vm.delete_brand = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this brand?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                BrandService.deleteBrand(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Category deleted.", "success");
                        vm.getBrands();
                    }
                });

              }

          });

        };

        
    }

})();