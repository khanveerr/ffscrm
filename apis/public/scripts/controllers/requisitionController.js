(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('ReqController', ReqController);

    function ReqController(ReqService, CompanyService, ItemTypeService, SiteService, ProcureService, $rootScope, $scope, ngDialog, SweetAlert, $location, $state, $stateParams, $timeout, ReqVendorService, ZoneService) {

        var vm = this;

        vm.users;
        vm.error;
        $rootScope.items = [];

        // Grab the user from local storage and parse it to an object
        var user = JSON.parse(localStorage.getItem('user')); 
        if(user) {
            $rootScope.authenticated = true;
            $rootScope.currentUser = user;
        } else {
            $location.path( "/user/login" );

        }

        console.log(user);

        vm.totalPages = 0;
        vm.currentPage = 1;
        vm.range = [];
        vm.showPagination = false;
        vm.is_requisition_editable = false;
        vm.is_submit = false;
        vm.vendors = [];
        vm.financial_year = [];
        const monthNames = ["","Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        vm.report_months = [];
        for (var i = 1; i < monthNames.length; i++) {
            vm.report_months.push({ name: monthNames[i], value: i });
        }  

        var date = new Date();
        var financial_start_year;
        var financial_end_year;
        var current_month = date.getMonth()+1;
        var current_year = date.getFullYear();
        console.log('Month: ', current_month);
        console.log('Year: ', current_year);

        if(current_month < 4) {
            financial_start_year = current_year-1;
            financial_end_year = current_year;
        } else {
            financial_start_year = current_year;
            financial_end_year = current_year+1;
        }

        var financial_start_year_prev = financial_start_year - 1;
        var financial_end_year_prev = financial_end_year - 1;

        var fy_name_prev='FY' + (financial_start_year_prev + '') + '-' + (financial_end_year_prev + '');
        var fy_value_prev=(financial_start_year_prev + '')+ '-' + (financial_end_year_prev + '');

        var fy_name='FY' + (financial_start_year + '') + '-' + (financial_end_year + '');
        var fy_value=(financial_start_year + '')+ '-' + (financial_end_year + '');

        vm.fy_filter = fy_value;
        vm.month_filter = current_month+'';

        if ($rootScope.currentUser.user_type == 'F') {
            vm.status_filter = '-1';
        } else {
            vm.status_filter = '0';
        }

        console.log(vm.month_filter);

        vm.financial_year.push({ name: fy_name_prev, value: fy_value_prev }, { name: fy_name, value: fy_value });


        vm.zones = [];
        ZoneService.getZones().then(function(response){
            vm.zones = response.data.data;
        });

        vm.billing_types = [
            {
                value: 0,
                name: 'Fixed'
            }, {
                value: 1,
                name: 'Actuals'
            }, {
                value: 2,
                name: 'No Charge'
            }
        ];

        vm.chargeable_types = [
            {
                value: 0,
                name: 'Non Chargeable'
            }, {
                value: 1,
                name: 'Chargeable'
            }
        ];

        ItemTypeService.getItemTypes().then(function(response){
            console.log(response);
            vm.item_types = response.data.data;
        });

        SiteService.getAllSites().then(function(response){
            console.log(response);
            vm.sites = response.data;
        });

        if($state.current.action != undefined && $state.current.action == 'requisition_edit') {

            vm.months = [];
            var months = [];
            vm.sites = [];
            vm.non_chargeable_items = [];
            vm.chargeable_items = [];
            vm.deleted_items = [];

            vm.chargeable_options = [
                {
                    value: 1,
                    name: 'Yes'
                }, {
                    value: 0,
                    name: 'No'
                }
            ];


            var current_date = new Date();
            var current_month = current_date.getMonth();

            for (var i = current_month; i <= current_month+1; i++) {
                months.push({ name: monthNames[i], value: i });
            }


            vm.months = months;

            vm.loading = true;

            

            SiteService.getAllSites().then(function(response){
                console.log(response);
                vm.sites = response.data;
            });


            if($stateParams.requisitionId != null && $stateParams.requisitionId != undefined && $stateParams.requisitionId != "") {

                var requisitionId = $stateParams.requisitionId;
                vm.is_requisition_editable = true;
                $scope.procure_master_id = requisitionId;

                angular.element('.overlay').show();
                angular.element('.loader').show();                    


                ReqService.getRequisitionItems(requisitionId).then(function(response){

                    debugger;

                    console.log(response.data);
                    var req_items = response.data.data;
                    var req_detail = response.data.details;
                    var zone_id = 0;

                    $scope.month = parseInt(req_detail.month);
                    $scope.site_id = parseInt(req_detail.site_id);
                    $scope.is_chargeable = parseInt(req_detail.is_chargeable);
                    $scope.selected_vendor = parseInt(req_detail.selected_vendor);
                    $scope.req_status = parseInt(req_detail.status);
                    zone_id = parseInt(req_detail.zone_id);

                    ReqVendorService.getAllVendors(zone_id,null).then(function(response){
                        vm.vendors = response.data;
                    });

                    debugger;


                    //$timeout(function(){

                        $scope.procure_items = [];
                        var p_items = [];

                        

                        ProcureService.getItems(zone_id).then(function(response){

                            debugger;

                            if (response != null && response != undefined) {
                                vm.items = response.data;    
                                vm.loading = false;

                                var it_id = 0;

                                angular.forEach(vm.items, function(value,key){


                                    angular.forEach(req_items,function(dbvalue,dbkey){

                                        it_id = parseInt(dbvalue.item_id);

                                        if(value.id == dbvalue.item_id) {
                                            // value.total = 0;
                                            value.vendor_id = dbvalue.vendor_id;
                                            value.vendor_rate = parseFloat(dbvalue.vendor_rate);
                                            value.vendor_total = parseFloat(dbvalue.vendor_total);
                                            value.quantity = parseInt(dbvalue.quantity);
                                            value.proc_item_id = parseInt(dbvalue.id);
                                            console.log(dbvalue.id);
                                            //vm.calculateRate(value);
                                            p_items.push(value);
                                        } 

                                    });

                                });

                                $scope.procure_items = p_items;

                                angular.element('.overlay').hide();
                                angular.element('.loader').hide();                    


                                // $timeout(function() {
                                //     vm.addItems();
                                // }, 10000);

                            }

                        });

                        

                    //},1500);

                });



            }


        }

        vm.selectVendor = function() {

            if ($scope.selected_vendor != undefined && $scope.selected_vendor != null && $scope.selected_vendor != "") {

                angular.forEach($scope.procure_items, function(value,key){

                    var selected_vendor_value = isVendorExist(value.vendors, $scope.selected_vendor);

                    if (selected_vendor_value != false) {
                        value.vendor_id = selected_vendor_value;
                        vm.calculateVendorRate(value, selected_vendor_value);
                    } else {
                        value.vendor_id = '';
                        value.vendor_rate = 0;
                        value.vendor_total = 0;
                        SweetAlert.swal("Error!", 'Some of the material dosen\'t have selected vendor.', "error");
                        return;
                    }

                });

            } else {

                angular.forEach($scope.procure_items, function(value,key){

                    value.vendor_id = '';
                    value.vendor_rate = 0;
                    value.vendor_total = 0;

                });                

            }

        }

        function isVendorExist(vendors, selected_vendor) {

            var found = false;

            angular.forEach(vendors, function(value,key){

                if (value.vendor_id == selected_vendor) {
                    found = value.vendor_id+'|'+value.rate;
                }

            });

            return found;

        };


        vm.getRequisitions = function(pageNumber){

            var data = {};

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            if (vm.fy_filter != undefined && vm.fy_filter != null) {
                data.financial_year = vm.fy_filter;
            }

            if (vm.month_filter != undefined && vm.month_filter != null) {
                data.month = vm.month_filter;
            }

            if (vm.site_filter != undefined && vm.site_filter != null) {
                data.site = vm.site_filter;
            }

            if (vm.status_filter != undefined && vm.status_filter != null) {
                data.status = vm.status_filter;
            }

            if (vm.chargeable_filter != undefined && vm.chargeable_filter != null) {
                data.chargeable = vm.chargeable_filter;
            }

            angular.element('.overlay').show();
            angular.element('.loader').show();


            ReqService.getRequisitions(pageNumber, data).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.requisitions        = response.data.data;
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


            }, function(error){

                angular.element('.overlay').hide();
                angular.element('.loader').hide();

            });

        };


        vm.getRequisitionsExport = function(){

            var data = {};

            if (vm.fy_filter != undefined && vm.fy_filter != null) {
                data.financial_year = vm.fy_filter;
            }

            if (vm.month_filter != undefined && vm.month_filter != null) {
                data.month = vm.month_filter;
            }

            if (vm.site_filter != undefined && vm.site_filter != null) {
                data.site = vm.site_filter;
            }

            if (vm.status_filter != undefined && vm.status_filter != null) {
                data.status = vm.status_filter;
            }

            if (vm.chargeable_filter != undefined && vm.chargeable_filter != null) {
                data.chargeable = vm.chargeable_filter;
            }

            angular.element('.overlay').show();
            angular.element('.loader').show();


            ReqService.getRequisitionsReportExcel(data).then(function(response){

                angular.element('.overlay').hide();
                angular.element('.loader').hide();

                if(response != undefined && response.data != undefined) {

                    var path = response.data.path;
                    var filename = response.data.filename;

                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',path);
                    downloadLink.attr('download', filename);
                    downloadLink[0].click();

                }


            }, function(error){

                angular.element('.overlay').hide();
                angular.element('.loader').hide();

            });

        };


        vm.calculateVendorRate = function(obj, vendor_id) {

            // debugger;
            var item_index = $scope.procure_items.indexOf(obj);
            var item = $scope.procure_items[item_index];


            if (vendor_id != undefined && vendor_id != null && vendor_id != "") {

                // debugger;

                var vendor_obj = vendor_id.split('|');
                var vendor_id = vendor_obj[0];
                var vendor_rate = vendor_obj[1];

                // debugger;

                var quantity = (item.quantity != undefined && item.quantity != null) ? parseInt(item.quantity) : 0;
                // var vendor_rate = parseFloat(item.vendors[index].rate);
                var vendor_total = parseFloat(item.vendor_total);

                item.vendor_rate = (parseFloat(vendor_rate)).toFixed(2);

                if (quantity != "" || quantity == 0) {
                    vendor_total = (vendor_rate * quantity);   
                } else {
                    vendor_total = parseFloat(item.vendor_rate);
                }

                item.vendor_total = vendor_total.toFixed(2);

            } else {
                item.vendor_rate = 0;
                item.vendor_total = 0;
            }

        };


        vm.calculateRate = function(obj) {

            //debugger;

            var item_index = $scope.procure_items.indexOf(obj);
            var item = $scope.procure_items[item_index];
            var quantity = (item.quantity != undefined && item.quantity != null) ? parseInt(item.quantity) : 0;
            var total = parseFloat(item.total);
            var tax = 0;

            //debugger;

            if (quantity != "" || quantity == 0) {
                tax = (item.rate * quantity) * (item.gst_per/100);
                total = (item.rate * quantity) + tax;   
            } else {
                total = parseFloat(item.rate);
            }
            

            //debugger;
            item.tax = tax;
            item.total = total.toFixed(2);


        };



        vm.addItems = function() {

            var chargeable_items = [];
            var non_chargeable_items = [];
            var deleted_items = [];

            vm.non_chargeable_items = [];
            vm.chargeable_items = [];
            vm.deleted_items = [];


            var chargeable_tax = 0;
            var chargeable_total = 0;

            var non_chargeable_tax = 0;
            var non_chargeable_total = 0;

            if ($scope.month == undefined || $scope.month == '' || $scope.month == null) {
                SweetAlert.swal("Error!", 'Please select month', "error");
                return;
            }

            if ($scope.site_id == undefined || $scope.site_id == '' || $scope.site_id == null) {
                SweetAlert.swal("Error!", 'Please select site', "error");
                return;
            }

            if ($scope.is_chargeable == undefined) {
                SweetAlert.swal("Error!", 'Please select if items are Chargeable/Non Chargeable?', "error");
                return;
            }



            angular.forEach($scope.procure_items, function(value,key){

                if(value.vendor_total != undefined && value.vendor_total != null && value.vendor_total != "" && value.quantity != 0 ) {

                    if ($scope.is_chargeable == 1) {
                        chargeable_items.push(value);
                    }

                    if ($scope.is_chargeable == 0) {
                        non_chargeable_items.push(value);
                    }

                } else {

                    if (value.quantity == 0 && (value.proc_item_id != "" && value.proc_item_id != undefined && value.proc_item_id != null)) {

                        deleted_items.push(value);

                    }

                }

            });

            if (chargeable_items.length > 0) {

                angular.forEach(chargeable_items, function(value,key){
                    // chargeable_tax = parseFloat(chargeable_tax) + parseFloat(value.tax);
                    chargeable_total = parseFloat(chargeable_total) + parseFloat(value.vendor_total);
                });

                vm.chargeable_items = chargeable_items;

            }

            if (non_chargeable_items.length > 0) {

                angular.forEach(non_chargeable_items, function(value,key){
                    // non_chargeable_tax = parseFloat(non_chargeable_tax) + parseFloat(value.tax);
                    non_chargeable_total = parseFloat(non_chargeable_total) + parseFloat(value.vendor_total);
                });

                vm.non_chargeable_items = non_chargeable_items;

            }

            if (deleted_items.length > 0) {
                vm.deleted_items = deleted_items;
            }

            // vm.chargeable_tax = chargeable_tax.toFixed(2);
            vm.chargeable_total = chargeable_total.toFixed(2);

            // vm.non_chargeable_tax = non_chargeable_tax.toFixed(2);
            vm.non_chargeable_total = non_chargeable_total.toFixed(2);

            if (vm.chargeable_items.length == 0 && vm.non_chargeable_items.length == 0) {
                SweetAlert.swal("Error!", 'Please add some items', "error");
                return;
            }


            vm.is_submit = true;

            console.log(vm.chargeable_items);
            console.log(vm.non_chargeable_items);

        }


        vm.exportPO = function($id) {

            ProcureService.exportPO($id).then(function(response){

                console.log();

                if(response != undefined && response.data != undefined) {

                    var path = response.data.path;
                    var filename = response.data.filename;

                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',path);
                    downloadLink.attr('download', filename);
                    downloadLink[0].click();

                }

            });

        };


        vm.export_by_proc_id = function(id,export_type) {

            var data = {};
            data.id = id;
            data.export_type = export_type;

            ProcureService.export_by_proc_id(data).then(function(response){

                if(response != undefined && response.data != undefined) {

                    var path = response.data.path;
                    var filename = response.data.filename;

                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',path);
                    downloadLink.attr('download', filename);
                    downloadLink[0].click();

                }

            });

        }

        vm.show_requisition_items = function(id) {

            var dialog = ngDialog.open({
                template: '../views/requisition/items.html',
                resolve: {
                    requisition_items: ['ReqService', function(ReqService) {
                        
                        return ReqService.getAllRequisitionItems(id).then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'requisition_items', function($scope, requisition_items) {

                    $scope.items = [];
                    if (requisition_items && requisition_items.data) {
                        $scope.items = requisition_items.data
                    }

                }],
                width: '80%'
            });
        }


        vm.setStatus = function(id) {

            var dialog = ngDialog.open({
                template: '../views/requisition/change_status.html',
                controller: ['$scope', 'ProcureService', function($scope, ProcureService) {

                    $scope.status = 1;

                    $scope.statuses = [
                        {
                            'status': 1,
                            'name': 'Proccesed'
                        },
                        {
                            'status': 2,
                            'name': 'Delivered'
                        }
                    ];


                    $scope.updateStatus = function(){

                        angular.element('.overlay').show();
                        angular.element('.loader').show();                    

                        ProcureService.updateStatus(id,$scope.status).then(function(response){

                            angular.element('.overlay').hide();
                            angular.element('.loader').hide();                    

                            SweetAlert.swal("Success!", 'Updated Successfully!', "success");
                            $scope.closeThisDialog(null);

                        });

                    };


                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getRequisitions();
            });



        }


        $scope.submitRequest = function() {

            var items = [];

            if ($scope.month == undefined || $scope.month == '' || $scope.month == null) {
                SweetAlert.swal("Error!", 'Please select month', "error");
                return;
            }

            if ($scope.site_id == undefined || $scope.site_id == '' || $scope.site_id == null) {
                SweetAlert.swal("Error!", 'Please select site', "error");
                return;
            }

            if ($scope.is_chargeable == undefined) {
                SweetAlert.swal("Error!", 'Please select if items are Chargeable/Non Chargeable?', "error");
                return;
            }


            if ($scope.is_chargeable == 1) {
                items = angular.copy(vm.chargeable_items);
            }

            if ($scope.is_chargeable == 0) {
                items = angular.copy(vm.non_chargeable_items);
            }

            if (items.length <= 0) {

                SweetAlert.swal("Error!", 'Please click on update items', "error");
                return;

            }


            if (vm.is_requisition_editable == false) {

                angular.forEach(items, function(value,key){
                    value.item_id = value.id;
                    value.id = '';
                });

            } else {

                angular.forEach(items, function(value,key){
                    value.item_id = value.id;
                });

            }

            var data = {};

            data.site_id = $scope.site_id;
            data.month = $scope.month;
            data.is_chargeable = $scope.is_chargeable;
            data.selected_vendor = $scope.selected_vendor;
            data.items = angular.toJson(items);
            data.procure_master_id = $scope.procure_master_id;
            data.status = 1;
            if (vm.deleted_items.length > 0) {
                data.deleted_items = angular.toJson(vm.deleted_items);
            } else {
                data.deleted_items = angular.toJson([]);
            }

            var title = '';

            if ($scope.req_status == 2) {
                title = "You cannot edit requisition after confirming this order. Do you really want to confirm?";
            } else {
                title = "Do you really want to submit?";
            }


            SweetAlert.swal({
                  title: title,
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Yes, do it!",
                  closeOnConfirm: false
                },  function(isConfirm){

                if(isConfirm) {

                    angular.element('.overlay').show();
                    angular.element('.loader').show();                    


                    ProcureService.submitRequest(data).then(function(response){

                        angular.element('.overlay').hide();
                        angular.element('.loader').hide();                    

                        SweetAlert.swal("Success!", 'Updated Successfully!', "success");
                        $state.go('requisition_request');

                    });

                }

            });



        };



        function getObjectName(array_obj, id) {

            var name = '';
            angular.forEach(array_obj, function(value, key){
                if(value.id == id) {
                    name = value.name;
                }
            })
            return name;

        };

        function getObjectArrDetails(array_obj) {

            var obj_names = [];
            var obj_ids = [];
            var final_obj = [];

            angular.forEach(array_obj, function(value, key){
                obj_names.push(value.name);
                obj_ids.push(value.id);
            })

            final_obj.names = obj_names;
            final_obj.ids = obj_ids;

            return final_obj;

        }

        
    }

})();