(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('ModelNoController', ModelNoController);

    function ModelNoController(ModelNoService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getModelNos = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            ModelNoService.getModelNos(pageNumber).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.model_nos    = response.data.data;
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


        vm.addModelNo = function() {


            var dialog = ngDialog.open({
                template: '../views/model_no/add.html',
                resolve: {
                    brands_obj: ['BrandService', function(BrandService) {
                        
                        return BrandService.getBrands().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'ModelNoService', 'brands_obj', function($scope, ModelNoService, brands_obj) {
                    
                    $scope.brands = brands_obj;

                    $scope.addModelNo = function() {

                        var data = {};

                        data.id = '';
                        data.name = $scope.name;
                        data.brand_id = $scope.brand_id;

                        ModelNoService.addModelNo(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Model No added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getModelNos();
            });

        };


        vm.edit_model_no = function(id) {

            var dialog = ngDialog.open({
                template: '../views/model_no/add.html',
                resolve: {
                    model_no_obj: ['ModelNoService', function(ModelNoService) {
                        
                        return ModelNoService.getModelNo(id).then(function(response){
                            return response.data;
                        });
                    
                    }],
                    brands_obj: ['BrandService', function(BrandService) {
                        
                        return BrandService.getBrands().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'ModelNoService', 'model_no_obj', 'brands_obj', '$timeout', function($scope, ModelNoService, model_no_obj, brands_obj, $timeout) {

                    $scope.brand_id = 1;
                    $scope.brands = brands_obj;

                    $scope.model_no_id = model_no_obj.id;
                    $scope.name = model_no_obj.name;
                    $scope.brand_id = model_no_obj.brand_id;                        

                    $scope.addModelNo = function() {

                        var data = {};

                        data.id = $scope.model_no_id;
                        data.name = $scope.name;
                        data.brand_id = $scope.brand_id;

                        ModelNoService.addModelNo(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Model No updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getModelNos();
            });


        };

        vm.delete_model_no = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this model no?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                ModelNoService.deleteModelNo(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Model No deleted.", "success");
                        vm.getModelNos();
                    }
                });

              }

          });

        };

    }


})();