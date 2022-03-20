
(function() {

    'use strict';

    angular
        .module('authApp', ['ui.router', 'satellizer', 'ngDialog', 'ngMessages','oitozero.ngSweetAlert','ngAnimate', 'toastr','720kb.datepicker', 'ngTagsInput','angucomplete'])
        .config(function($stateProvider, $locationProvider, $urlRouterProvider, $authProvider, $httpProvider, $provide, $interpolateProvider,ngDialogProvider,toastrConfig) {

        	$interpolateProvider.startSymbol('{%');
    		$interpolateProvider.endSymbol('%}');

    		ngDialogProvider.setDefaults({
		        className: 'ngdialog-theme-default ngdialog-custom-width',
		        showClose: true,
		        closeByDocument: false,
		        closeByEscape: true
		    });


    		function redirectWhenLoggedOut($q, $injector) {

		        return {

                  request: function(config) {
                    config.headers = config.headers || {};
                    if(localStorage.getItem('satellizer_token')) {
                        config.headers.Authorization = 'Bearer ' + localStorage.getItem('satellizer_token');
                    }
                    return config;

                  },

		          responseError: function(rejection) {

		            // Need to use $injector.get to bring in $state or else we get
		            // a circular dependency error
		            var $state = $injector.get('$state');

		            // Instead of checking for a status code of 400 which might be used
		            // for other reasons in Laravel, we check for the specific rejection
		            // reasons to tell us if we need to redirect to the login state
		            var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

		            // Loop through each rejection reason and redirect to the login
		            // state if one is encountered
		            angular.forEach(rejectionReasons, function(value, key) {

		              if(rejection.data.error === value) {

		                  // If we get a rejection corresponding to one of the reasons
		                  // in our array, we know we need to authenticate the user so 
		                  // we can remove the current user from local storage
		                  localStorage.removeItem('user');

		                  // Send the user to the auth state so they can login
		                  $state.go('auth');
		              }
		            });

		            return $q.reject(rejection);
		          }
		        }
		    }

		    // Setup for the $httpInterceptor
      		$provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);

      		// Push the new factory onto the $http interceptor array
      		$httpProvider.interceptors.push('redirectWhenLoggedOut');


            // Satellizer configuration that specifies which API
            // route the JWT should be retrieved from
            $authProvider.loginUrl = '/api/authenticate';

            // Redirect to the auth state if any other states
            // are requested other than users
            $urlRouterProvider.otherwise('/user/login');

            $stateProvider
                .state('auth', {
                    url: '/user/login',
                    templateUrl: '../views/authView.html',
                    controller: 'AuthController as auth'
                })
                .state('signup', {
                    url: '/signup',
                    templateUrl: '../views/registerView.html',
                    controller: 'RegisterController as reg'
                })
                .state('users', {
                    url: '/users',
                    templateUrl: '../views/userView.html',
                    controller: 'UserController as user'
                })
                .state('categories', {
                    url: '/categories',
                    templateUrl: '../views/category/list.html',
                    controller: 'CategoryController as ct'
                })
                .state('companies', {
                    url: '/companies',
                    templateUrl: '../views/company/list.html',
                    controller: 'CompanyController as ct'
                })
                .state('vendors', {
                    url: '/vendors',
                    templateUrl: '../views/vendor/list.html',
                    controller: 'VendorController as ct'
                })
                .state('req_vendors', {
                    url: '/requisition/vendors',
                    templateUrl: '../views/req_vendors/list.html',
                    controller: 'ReqVendorController as ct'
                })
                .state('brands', {
                    url: '/brands',
                    templateUrl: '../views/brand/list.html',
                    controller: 'BrandController as ct'
                })
                .state('model_nos', {
                    url: '/model_nos',
                    templateUrl: '../views/model_no/list.html',
                    controller: 'ModelNoController as ct'
                })
                .state('cost_centres', {
                    url: '/cost_centres',
                    templateUrl: '../views/cost_centre/list.html',
                    controller: 'CostCentreController as ct'
                })
                .state('departments', {
                    url: '/departments',
                    templateUrl: '../views/department/list.html',
                    controller: 'DepartmentController as ct'
                })
                .state('sites', {
                    url: '/sites',
                    templateUrl: '../views/site/list.html',
                    controller: 'SiteController as ct'
                })
                .state('states', {
                    url: '/states',
                    templateUrl: '../views/state/list.html',
                    controller: 'StateController as ct'
                })
                .state('employees', {
                    url: '/employees',
                    templateUrl: '../views/employee/list.html',
                    controller: 'EmployeeController as ct'
                })
                .state('inventories', {
                    url: '/inventories',
                    templateUrl: '../views/inventory/list.html',
                    controller: 'InventoryController as ct'
                })
                .state('assigned_inventories', {
                    url: '/inventory/assign/:inventoryId',
                    templateUrl: '../views/inventory/user_assign/list.html',
                    controller: 'InventoryAssignController as ct'
                })
                .state('transferred_inventories', {
                    url: '/inventory/transfer/:inventoryId',
                    templateUrl: '../views/inventory/transfer/list.html',
                    controller: 'InventoryTransferController as ct'
                })
                .state('zones', {
                    url: '/zones',
                    templateUrl: '../views/zone/list.html',
                    controller: 'ZoneController as ct'
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: '../views/dashboard/view.html',
                    controller: 'DashboardController as ct'
                })
                .state('masters', {
                    url: '/list/masters',
                    templateUrl: '../views/dashboard/masters.html',
                    controller: 'DashboardController as ct'
                })
                .state('item_type', {
                    url: '/item/type',
                    templateUrl: '../views/item_type/list.html',
                    controller: 'ItemTypeController as it'
                })
                .state('proc_calc', {
                    url: '/procurement/calculator',
                    templateUrl: '../views/proc-calc/list.html',
                    controller: 'ProcCalController as ct'
                })
                .state('proc_calc_add', {
                    url: '/procurement/calculator/list',
                    templateUrl: '../views/proc-calc/items.html',
                    controller: 'ProcCalController as ct',
                    action: 'proc_add'
                }).state('proc_calc_edit', {
                    url: '/procurement/calculator/list/:procId',
                    templateUrl: '../views/proc-calc/items.html',
                    controller: 'ProcCalController as ct',
                    action: 'proc_edit'
                }).state('user_all', {
                    url: '/user/all',
                    templateUrl: '../views/user/list.html',
                    controller: 'UserController as ct'
                }).state('items', {
                    url: '/items',
                    templateUrl: '../views/requisition_items/list.html',
                    controller: 'ItemController as ct'
                }).state('procure_items', {
                    url: '/procure/items',
                    templateUrl: '../views/procure/list.html',
                    controller: 'ProcureController as ct'
                }).state('procure_items_edit', {
                    url: '/procure/items/:requisitionId',
                    templateUrl: '../views/procure/list.html',
                    controller: 'ProcureController as ct',
                    action: 'procure_items_edit'
                }).state('requisition_request', {
                    url: '/requisition/request',
                    templateUrl: '../views/requisition/list.html',
                    controller: 'ReqController as ct'
                }).state('requisition_edit', {
                    url: '/requisition/edit/:requisitionId',
                    templateUrl: '../views/requisition/index.html',
                    controller: 'ReqController as ct',
                    action: 'requisition_edit'
                }).state('requisition_report', {
                    url: '/requisition/report',
                    templateUrl: '../views/requisition/chart.html',
                    controller: 'ReportController as ct',
                    action: 'requisition_report'
                }).state('quote_request', {
                    url: '/request/quote',
                    templateUrl: '../views/quotes/list.html',
                    controller: 'QuoteController as ct',
                    action: 'quote_request'
                }).state('supplier_list', {
                    url: '/supplier/list',
                    templateUrl: '../views/supplier_list/index.html',
                    controller: 'SupplierController as ct',
                    action: 'supplier_list'
                });


                $locationProvider.html5Mode(true);

                angular.extend(toastrConfig, {
				    allowHtml: false,
				    closeButton: false,
				    closeHtml: '<button>&times;</button>',
				    extendedTimeOut: 1000,
				    iconClasses: {
				      error: 'toast-error',
				      info: 'toast-info',
				      success: 'toast-success',
				      warning: 'toast-warning'
				    },  
				    messageClass: 'toast-message',
				    onHidden: null,
				    onShown: null,
				    onTap: null,
				    progressBar: true,
				    tapToDismiss: true,
				    templates: {
					  toast: 'directives/toast/toast.html',
					  progressbar: 'directives/progressbar/progressbar.html'
					},
				    timeOut: 5000,
				    titleClass: 'toast-title',
				    toastClass: 'toast'
				  });


        })
        .run(function($rootScope, $state) {

		  	// $stateChangeStart is fired whenever the state changes. We can use some parameters
		  	// such as toState to hook into details about the state as it is changing
		  	$rootScope.$on('$stateChangeStart', function(event, toState) {

			    // Grab the user from local storage and parse it to an object
			    var user = JSON.parse(localStorage.getItem('user')); 
			    console.log(user);           

			    // If there is any user data in local storage then the user is quite
			    // likely authenticated. If their token is expired, or if they are
			    // otherwise not actually authenticated, they will be redirected to
			    // the auth state because of the rejected request anyway
			    if(user) {

			      	// The user's authenticated state gets flipped to
			      	// true so we can now show parts of the UI that rely
			      	// on the user being logged in
			      	$rootScope.authenticated = true;

			      	// Putting the user's data on $rootScope allows
			      	// us to access it anywhere across the app. Here
			      	// we are grabbing what is in local storage
			      	$rootScope.currentUser = user;

			      	// If the user is logged in and we hit the auth route we don't need
			      	// to stay there and can send the user to the main state
			      	if(toState.name === "auth") {

			        	// Preventing the default behavior allows us to use $state.go
			        	// to change states
			        	event.preventDefault();

			        	// go to the "main" state which in our case is users
			        	$state.go('users');
			    	}       

			    }
		  	});

		})
		.directive('postsPagination', pagination)
		.directive('compareTo', compareTo);

		function compareTo() {
			return {
			    require: 'ngModel',
			    link: function(scope, elem, attr, ngModelCtrl) {

			    	var pwdToMatch = $parse(attr.confirmPwd);
			    	var pwdFn = $interpolate(attr.confirmPwd)(scope);

			    	scope.$watch(pwdFn, function(newVal) {
			        	ngModelCtrl.$setValidity('password', ngModelCtrl.$viewValue == newVal);
			      	})

			      	ngModelCtrl.$validators.password = function(modelValue, viewValue) {
			        	var value = modelValue || viewValue;
			        	return value == pwdToMatch(scope);
			      	};

			    }
			}
		}

		function pagination(){  
	       return {
	          restrict: 'E',
	          template: '<ul class="pagination">'+
	            '<li ng-show="ct.currentPage != 1"><a href="javascript:void(0)" ng-click="ct.getZones(1)">&laquo;</a></li>'+
	            '<li ng-show="ct.currentPage != 1"><a href="javascript:void(0)" ng-click="ct.getZones(ct.currentPage-1)">&lsaquo; Prev</a></li>'+
	            '<li ng-repeat="i in ct.range" ng-class="{active : ct.currentPage == i}">'+
	                '<a href="javascript:void(0)" ng-click="ct.getZones(i)">{{i}}</a>'+
	            '</li>'+
	            '<li ng-show="ct.currentPage != ct.totalPages"><a href="javascript:void(0)" ng-click="ct.getZones(ct.currentPage+1)">Next &rsaquo;</a></li>'+
	            '<li ng-show="ct.currentPage != ct.totalPages"><a href="javascript:void(0)" ng-click="ct.getZones(ct.totalPages)">&raquo;</a></li>'+
	          '</ul>'
	       };
	    }
		
})();