(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('QuoteController', QuoteController);

    function QuoteController(QuoteService, $rootScope, $scope, ngDialog, SweetAlert, $location) {

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


        vm.getQuotes = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            angular.element('.overlay').show();
            angular.element('.loader').show();

            QuoteService.getQuotes(pageNumber).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.quotes        = response.data.data;
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

                angular.element('.overlay').hide();
                angular.element('.loader').hide();



            });

        };


        vm.addQuote = function() {


            var dialog = ngDialog.open({
                template: '../views/quotes/add.html',
                controller: ['$scope', 'QuoteService', function($scope, QuoteService) {
                    
                    $scope.addQuote = function() {

                        var data = {};

                        data.id = '';
                        data.product_name = $scope.product_name;
                        data.quantity = $scope.quantity;
                        data.unit = $scope.unit;
                        data.rate = $scope.rate;
                        // data.is_credit = $scope.is_credit;
                        // data.pincode = $scope.pincode;
                        data.requirements = $scope.requirements;

                        QuoteService.addQuote(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Quote submitted.", "success");
                            }
                        });

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getQuotes();
            });

        };


        vm.view_quote_details = function(id) {

            var dialog = ngDialog.open({
                template: '../views/quotes/view.html',
                resolve: {
                    quote_obj: ['QuoteService', function(QuoteService) {
                        
                        return QuoteService.getQuote(id).then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'QuoteService', 'quote_obj', function($scope, QuoteService, quote_obj) {
                    
                    $scope.product_name = quote_obj.product_name;
                    $scope.quantity = quote_obj.quantity;
                    $scope.unit = quote_obj.unit;
                    $scope.rate = quote_obj.rate;
                    // $scope.is_credit = quote_obj.is_credit;
                    // $scope.pincode = quote_obj.pincode;
                    $scope.requirements = quote_obj.requirements;

                    
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getQuotes();
            });


        };

        

        
    }

})();