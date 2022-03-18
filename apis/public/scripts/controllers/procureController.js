(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('ProcureController', ProcureController);

    function ProcureController(ItemService, $rootScope, $scope, ngDialog, SweetAlert, $location, ProcureService, ItemTypeService, SiteService, $state, $stateParams, ReqService) {

        var vm = this;

        vm.users;
        vm.error;
        vm.loading = false;
        vm.months = [];
        var months = [];
        vm.sites = [];
        vm.non_chargeable_items = [];
        vm.chargeable_items = [];
        $scope.procure_master_id = '';

        vm.chargeable_options = [
            {
                value: 1,
                name: 'Yes'
            }, {
                value: 0,
                name: 'No'
            }
        ];

        const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        var current_date = new Date();
        var current_month = current_date.getMonth()+1;
        vm.budgeted_amount = 0;

        for (var i = current_month; i <= current_month+1; i++) {
            months.push({ name: monthNames[i], value: i });
        }

        vm.months = months;

        // Grab the user from local storage and parse it to an object
        var user = JSON.parse(localStorage.getItem('user')); 
        if(user) {
            $rootScope.authenticated = true;
            $rootScope.currentUser = user;
        } else {
            $location.path( "/user/login" );

        }

        ItemTypeService.getItemTypes().then(function(response){
            console.log(response);
            vm.item_types = response.data.data;
        });

        SiteService.getAllSites().then(function(response){
            console.log(response);
            vm.sites = response.data;
        });

        vm.setSite = function(site_id) {

            var site = getSiteById(site_id,vm.sites);
            vm.budgeted_amount = parseFloat(site.budgeted_amount);
            vm.billing_type = parseFloat(site.billing_type);

        };

        vm.getItems = function() {

            vm.loading = true;

            angular.element('.overlay').show();
            angular.element('.loader').show();


            ProcureService.getItems(null).then(function(response){

                if (response != null && response != undefined) {
                    vm.items = response.data;    
                    vm.loading = false;
                }

                if ($state.current.action == 'procure_items_edit') {

                    // debugger;

                    if($stateParams.requisitionId != null && $stateParams.requisitionId != undefined && $stateParams.requisitionId != "") {

                        var requisitionId = $stateParams.requisitionId;

                        // debugger;
                        $scope.procure_master_id = requisitionId;

                        ReqService.getRequisitionItems(requisitionId).then(function(response){

                            // debugger;

                            console.log(response.data);
                            var req_items = response.data.data;
                            var req_detail = response.data.details;
                            var zone_id = 0;

                            $scope.month = parseInt(req_detail.month);
                            $scope.site_id = parseInt(req_detail.site_id);
                            $scope.is_chargeable = parseInt(req_detail.is_chargeable);
                            $scope.req_status = parseInt(req_detail.status);
                            zone_id = parseInt(req_detail.zone_id);

                            // debugger;

                            angular.forEach(vm.items, function(value,key){

                                angular.forEach(req_items,function(dbvalue,dbkey){

                                    if(value.id == dbvalue.item_id) {
                                        // value.total = 0;
                                        value.quantity = parseFloat(dbvalue.quantity);
                                        value.proc_item_id = dbvalue.id;
                                        console.log(dbvalue.id);
                                        vm.calculateRate(value);

                                    } 

                                });

                            });

                            angular.element('.overlay').hide();
                            angular.element('.loader').hide();

                        });

                    }

                } else {

                    angular.element('.overlay').hide();
                    angular.element('.loader').hide();

                }

            });

        };

        vm.calculateRate = function(obj) {

            //debugger;

            var item_index = vm.items.indexOf(obj);
            var item = vm.items[item_index];
            var quantity = (item.quantity != undefined && item.quantity != null) ? parseInt(item.quantity) : 0;
            var total = parseFloat(item.total);
            var tax = 0;
            var pre_gst_amount = 0;

            //debugger;

            if (quantity != "") {
                tax = (item.rate * quantity) * (item.gst_per/100);
                total = (item.rate * quantity) + tax;   
                pre_gst_amount = (item.rate * quantity);
            } else {
                total = 0;
                pre_gst_amount = 0;
            }
            

            //debugger;
            item.pre_gst_amount = pre_gst_amount.toFixed(2);
            item.tax = tax;
            item.total = total.toFixed(2);


        };

        vm.addItems = function() {

            var chargeable_items = [];
            var non_chargeable_items = [];

            vm.non_chargeable_items = [];
            vm.chargeable_items = [];


            var chargeable_tax = 0;
            var chargeable_total = 0;
            var chargeable_pre_gst_amount = 0;

            var non_chargeable_tax = 0;
            var non_chargeable_total = 0;
            var non_chargeable_pre_gst_amount = 0;

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


            angular.forEach(vm.items, function(value,key){

                if(value.total != undefined && value.total != null && value.total != "" && value.total != 0) {

                    if ($scope.is_chargeable == 1) {
                        chargeable_items.push(value);
                    }

                    if ($scope.is_chargeable == 0) {
                        non_chargeable_items.push(value);
                    }

                }

            });

            if (chargeable_items.length > 0) {

                angular.forEach(chargeable_items, function(value,key){
                    chargeable_tax = parseFloat(chargeable_tax) + parseFloat(value.tax);
                    chargeable_total = parseFloat(chargeable_total) + parseFloat(value.total);
                    chargeable_pre_gst_amount = parseFloat(chargeable_pre_gst_amount) + parseFloat(value.pre_gst_amount);
                });

                vm.chargeable_items = chargeable_items;

            }

            if (non_chargeable_items.length > 0) {

                angular.forEach(non_chargeable_items, function(value,key){
                    non_chargeable_tax = parseFloat(non_chargeable_tax) + parseFloat(value.tax);
                    non_chargeable_total = parseFloat(non_chargeable_total) + parseFloat(value.total);
                    non_chargeable_pre_gst_amount = parseFloat(non_chargeable_pre_gst_amount) + parseFloat(value.pre_gst_amount);
                });

                vm.non_chargeable_items = non_chargeable_items;

            }

            vm.chargeable_pre_gst_amount = chargeable_pre_gst_amount.toFixed(2);
            vm.chargeable_tax = chargeable_tax.toFixed(2);
            vm.chargeable_total = chargeable_total.toFixed(2);


            vm.non_chargeable_pre_gst_amount = non_chargeable_pre_gst_amount.toFixed(2);
            vm.non_chargeable_tax = non_chargeable_tax.toFixed(2);
            vm.non_chargeable_total = non_chargeable_total.toFixed(2);

            if (vm.chargeable_items.length == 0 && vm.non_chargeable_items.length == 0) {
                SweetAlert.swal("Error!", 'Please add some items', "error");
            }

            if (vm.chargeable_pre_gst_amount != 0 && vm.chargeable_pre_gst_amount > vm.budgeted_amount && vm.budgeted_amount != 0) {
                if (vm.billing_type == '0' || vm.billing_type == 0) {
                    SweetAlert.swal("Error!", 'Total amount cannot exceed site budgeted amount.', "error");
                    vm.chargeable_items = [];
                    vm.chargeable_pre_gst_amount = 0;
                    vm.chargeable_tax = 0;
                    vm.chargeable_total = 0;
                    return;
                }

                if (vm.billing_type == '3' || vm.billing_type == 3) {

                    SweetAlert.swal({
                      title: 'Total amount cannot exceed site budgeted amount. Do you still want to continue?',
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "Yes",
                      closeOnConfirm: true
                    });

                }
            }

            if (vm.non_chargeable_pre_gst_amount != 0 && vm.non_chargeable_pre_gst_amount > vm.budgeted_amount && vm.budgeted_amount != 0) {
                if (vm.billing_type == '0' || vm.billing_type == 0) {
                    SweetAlert.swal("Error!", 'Total amount cannot exceed site budgeted amount.', "error");
                    vm.non_chargeable_items = [];
                    vm.non_chargeable_pre_gst_amount = 0;
                    vm.non_chargeable_tax = 0;
                    vm.non_chargeable_total = 0;
                    return;
                }

                if (vm.billing_type == '3' || vm.billing_type == 3) {

                    SweetAlert.swal({
                      title: 'Total amount cannot exceed site budgeted amount. Do you still want to continue?',
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#DD6B55",
                      confirmButtonText: "Yes",
                      closeOnConfirm: true
                    });

                }
            }

        }


        $scope.submitRequest = function(type) {

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

                SweetAlert.swal("Error!", 'Please click on add items', "error");
                return;

            }

            angular.forEach(items, function(value,key){
                value.item_id = value.id;
                value.id = '';
            });

            var data = {};

            data.site_id = $scope.site_id;
            data.month = $scope.month;
            data.is_chargeable = $scope.is_chargeable;
            data.items = angular.toJson(items);
            data.procure_master_id = $scope.procure_master_id;


            var title = '';
            if (type == 'draft') {
                data.status = -1;
                title = 'Do you really want to save this as a draft?'
            } else {
                data.status = 0;
                title = 'Do you really want to submit?'
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

                    if (type == 'draft') {

                        ProcureService.submitDraftRequest(data).then(function(response){


                            angular.element('.overlay').hide();
                            angular.element('.loader').hide();

                            SweetAlert.swal("Success!", 'Request Successfully Submitted!', "success");
                            $state.go('requisition_request');

                        });

                    } else {


                        ProcureService.submitRequest(data).then(function(response){

                            angular.element('.overlay').hide();
                            angular.element('.loader').hide();

                            SweetAlert.swal("Success!", 'Request Successfully Submitted!', "success");
                            $state.go('requisition_request');

                        });



                    }

                }

            });



        };


        // function getItemById(id) {

        //     angular.forEach(vm.items, function(value,key){

        //         if(value.id == id) {
        //             return value;
        //         }

        //     });

        // }


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


        vm.export = function(export_type) {

            var data = {};
            data.export_type = export_type;
            data.site_id = $scope.site_id;
            if (vm.chargeable_items.length > 0) {
                data.items = angular.toJson(vm.chargeable_items);
                data.tax = vm.chargeable_tax;
                data.total = vm.chargeable_total;
            }

            if (vm.non_chargeable_items.length > 0) {
                data.items = angular.toJson(vm.non_chargeable_items);
                data.tax = vm.non_chargeable_tax;
                data.total = vm.non_chargeable_total;
            }


            ProcureService.export(data).then(function(response){

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


        function getSiteById(id,sites) {

            var site = {};

            for (var i = 0; i < sites.length; i++) {
                if (sites[i].id == id) {
                    site = sites[i];
                    break;
                }
            }

            return site;

        }


    }


})();