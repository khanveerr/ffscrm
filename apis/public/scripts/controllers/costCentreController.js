(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('CostCentreController', CostCentreController);

    function CostCentreController(CostCentreService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getCostCentres = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            CostCentreService.getCostCentres(pageNumber).then(function(response){
            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.cost_centres        = response.data.data;
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


        vm.addCostCentre = function() {


            var dialog = ngDialog.open({
                template: '../views/cost_centre/add.html',
                 resolve: {
                    sites_obj: ['SiteService', function(SiteService) {
                        
                        return SiteService.getSites().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'CostCentreService', 'sites_obj', function($scope, CostCentreService, sites_obj) {
                    
                    $scope.sites = sites_obj;

                    $scope.addCostCentre = function() {

                        var data = {};

                        data.id = '';
                        data.name = $scope.name;
                        data.site_id = $scope.site_id;

                        CostCentreService.addCostCentre(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Cost Centre added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getCostCentres();
            });

        };


        vm.edit_cost_centre = function(id) {

            var dialog = ngDialog.open({
                template: '../views/cost_centre/add.html',
                resolve: {
                    sites_obj: ['SiteService', function(SiteService) {
                        
                        return SiteService.getSites().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    cost_centre_obj: ['CostCentreService', function(CostCentreService) {
                        
                        return CostCentreService.getCostCentre(id).then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'CostCentreService', 'cost_centre_obj', 'sites_obj', function($scope, CostCentreService, cost_centre_obj, sites_obj) {
                    
                    $scope.sites = sites_obj;
                    $scope.cost_centre_id = cost_centre_obj.id;
                    $scope.name = cost_centre_obj.name;
                    $scope.site_id = cost_centre_obj.site_id;

                    $scope.addCostCentre = function() {

                        var data = {};

                        data.id = $scope.cost_centre_id;
                        data.name = $scope.name;
                        data.site_id = $scope.site_id;

                        CostCentreService.addCostCentre(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Cost Centre updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getCostCentres();
            });


        };

        vm.delete_cost_centre = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this cost centre?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                CostCentreService.deleteCostCentre(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Cost Centre deleted.", "success");
                        vm.getCostCentres();
                    }
                });

              }

          });

        };

    }

})();