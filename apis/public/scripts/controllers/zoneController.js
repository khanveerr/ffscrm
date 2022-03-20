(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('ZoneController', ZoneController);

    function ZoneController(ZoneService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getZones = function(pageNumber,keyword = null){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            if (keyword == null) {
                keyword = '';
            }

            ZoneService.getZones(pageNumber, keyword).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.zones        = response.data.data;
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


        vm.addZone = function() {


            var dialog = ngDialog.open({
                template: '../views/zone/add.html',
                controller: ['$scope', 'ZoneService', function($scope, ZoneService) {
                    
                    $scope.addZone = function() {

                        var data = {};

                        data.id = '';
                        data.zone_name = $scope.zone_name;
                        data.code = $scope.code;

                        ZoneService.addZone(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Sent!", "Zone added.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getZones();
            });

        };


        vm.edit_zone = function(id) {

            var dialog = ngDialog.open({
                template: '../views/zone/add.html',
                resolve: {
                    zone_obj: ['ZoneService', function(ZoneService) {
                        
                        return ZoneService.getZone(id).then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'ZoneService', 'zone_obj', function($scope, ZoneService, zone_obj) {
                    
                    $scope.zone_id = zone_obj.id;
                    $scope.zone_name = zone_obj.zone_name;
                    $scope.code = zone_obj.code;

                    $scope.addZone = function() {

                        var data = {};

                        data.id = $scope.zone_id;
                        data.zone_name = $scope.zone_name;
                        data.code = $scope.code;

                        ZoneService.addZone(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Sent!", "Zone updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getZones();
            });


        };

        vm.delete_zone = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this zone?",
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

                ZoneService.deleteZone(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Zone deleted.", "success");
                        vm.getZones();
                    }
                });

              }

          });

        };

        // vm.getZones = function() {

        //     // This request will hit the index method in the ZoneController
        //     // on the Laravel side and will return the list of zones

        // }
    }


})();