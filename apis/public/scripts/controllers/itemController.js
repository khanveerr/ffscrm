(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('ItemController', ItemController);

    function ItemController(ItemService, $rootScope, $scope, ngDialog, SweetAlert, $location, ItemTypeService, ZoneService) {

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

        vm.item_types = [];
        vm.zones = [];

        ItemTypeService.getItemTypes().then(function(response){
            vm.item_types = response.data.data;
        });


        ZoneService.getZones().then(function(response){
            vm.zones = response.data.data;
        });

        vm.filterResult = function(page) {

                if(page===undefined){
                  page = '1';
                }

                vm.getItems(page,$scope.keyword,$scope.zone_id_filter,$scope.type_id_filter);
        }


        vm.getItems = function(pageNumber, keyword, zone_id, type_id){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            if(zone_id===undefined){
              zone_id = 0;
            }

            if(type_id===undefined){
              type_id = 0;
            }

            if(keyword===undefined){
              keyword = '';
            }

            // debugger;

            ItemService.getItems(pageNumber, keyword, zone_id, type_id).then(function(response){

                // debugger;

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.items        = response.data.data;
              vm.totalPages   = response.data.last_page;
              vm.currentPage  = response.data.current_page;

              if((response.data.current_page != response.data.last_page && response.data.last_page != 0) && vm.items.length > 0) {
                vm.showPagination = true
              }

              var pages = [];

              for(var i=1;i<=response.data.last_page;i++) {          
                pages.push(i);
              }

              vm.range = pages; 

            });

        };


        vm.addItem = function() {


            var dialog = ngDialog.open({
                template: '../views/requisition_items/add.html',
                resolve: {
                    types_obj: ['ItemTypeService', function(ItemTypeService) {
                        
                        return ItemTypeService.getItemTypes().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    zones_obj: ['ZoneService', function(ZoneService) {
                        
                        return ZoneService.getZones().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'ItemService', 'types_obj', 'zones_obj', function($scope, ItemService, types_obj, zones_obj) {

                    $scope.image_file = '';
                    $scope.item_types = types_obj;
                    $scope.zones = zones_obj;
                    
                    $scope.addItem = function() {

                        var frmdata = new FormData();
                        frmdata.append("id", "");
                        //frmdata.append("alias_code", $scope.alias_code);
                        frmdata.append("description", $scope.description);
                        frmdata.append("hsn_code", $scope.hsn_code);
                        frmdata.append("gst_perc", $scope.gst_perc);
                        frmdata.append("rates", parseFloat($scope.rates));
                        frmdata.append("type_id", $scope.type_id);
                        frmdata.append("zone_id", $scope.zone_id);
                        frmdata.append("image_file", $scope.image_file);

                        var objXhr = new XMLHttpRequest();

                        objXhr.addEventListener("load", transferComplete, false);

                        objXhr.onreadystatechange = function() {

                            if(objXhr.status == 400 ) {

                                var res = JSON.parse(objXhr.response);
                                SweetAlert.swal("Error!", res.message, "error");

                            }

                            if(objXhr.status == 500 ) {

                                var res = JSON.parse(objXhr.response);
                                SweetAlert.swal("Error!", res.message, "error");

                            }

                            if (objXhr.readyState == 4 && objXhr.status == 200) {

                                //console.log(objXhr.response);

                                SweetAlert.swal("Success!", "Item Added successfully.", "success");
                                $scope.closeThisDialog(null);

                            }

                        };

                        objXhr.open("POST", 'http://demo.local/api/item/add', true);

                        objXhr.send(frmdata);

                        // ItemService.addZone(data).then(function(response){
                        //     console.log(response);

                        //     if(response.status == 200) {
                        //         $scope.closeThisDialog(null);
                        //         SweetAlert.swal("Sent!", "Zone added.", "success");
                        //     }
                        // });

                    };

                    function transferComplete(e) {

                    }

                    $scope.uploadImage = function(files) {

                        var image_file = files[0];
                        $scope.image_file = image_file;

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getItems();
            });

        };

        vm.add_vendor_rate = function(id,zone_id,type_id){

            var dialog = ngDialog.open({
                template: '../views/requisition_items/vendor_price.html',
                resolve: {
                    vendor_obj: ['ReqVendorService', function(ReqVendorService) {
                        
                        return ReqVendorService.getAllVendors(zone_id,type_id).then(function(response){
                            return response.data;
                        });
                    
                    }],
                    item_prices_obj: ['ItemPriceService', function(ItemPriceService) {
                        
                        return ItemPriceService.getItemPrices(id).then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'ItemPriceService', 'vendor_obj', 'item_prices_obj', 'toastr', function($scope, ItemPriceService, vendor_obj, item_prices_obj, toastr) {
                    
                    $scope.vendors = vendor_obj;
                    $scope.item_prices = item_prices_obj;
                    $scope.is_price_update = false;

                    console.log(item_prices_obj);


                    $scope.update_price = function(obj) {

                        $scope.is_price_update = true;

                        $scope.vendor_id = obj.vendor_id;
                        $scope.rate = obj.rate;
                        $scope.item_price_id = obj.id;

                    };

                    $scope.update_status = function(obj, status) {

                        obj.status = status;
                        ItemPriceService.addItemPrice(obj).then(function(response){

                            if (status == 1) {
                                toastr.success('Price activated!!');
                            } else {
                                toastr.success('Price deactivated!!');
                            }
                            console.log(response);
                            getItemPrices();


                        }, function(error){

                            //SweetAlert.swal("Error!", error.data, "error");
                            toastr.error(error.data);

                        });

                    };

                    $scope.savePrice = function() {

                        var data = {};
                        data.item_id = id;
                        data.vendor_id = $scope.vendor_id;
                        data.rate = $scope.rate;
                        data.status = 0;
                        if ($scope.is_price_update == true) {
                            data.id = $scope.item_price_id;
                        }

                        ItemPriceService.addItemPrice(data).then(function(response){

                            console.log(response);
                            getItemPrices();


                        }, function(error){

                            //SweetAlert.swal("Error!", error.data, "error");
                            toastr.error(error.data);

                        });



                    };


                    function getItemPrices() {

                        ItemPriceService.getItemPrices(id).then(function(response){
                            $scope.item_prices = response.data;
                        });

                    }

                    
                }],
                width: '60%'
            });

            dialog.closePromise.then(function (data) {
                // vm.getItems();
            });


        };


        vm.edit_item = function(id) {

            var dialog = ngDialog.open({
                template: '../views/requisition_items/add.html',
                resolve: {
                    item_obj: ['ItemService', function(ItemService) {
                        
                        return ItemService.getItem(id).then(function(response){
                            return response.data;
                        });
                    
                    }],
                    types_obj: ['ItemTypeService', function(ItemTypeService) {
                        
                        return ItemTypeService.getItemTypes().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    zones_obj: ['ZoneService', function(ZoneService) {
                        
                        return ZoneService.getZones().then(function(response){
                            return response.data.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'ItemService', 'item_obj', 'types_obj', 'zones_obj', function($scope, ItemService, item_obj, types_obj, zones_obj) {
                    
                    $scope.image_file = '';
                    $scope.item_types = types_obj;
                    $scope.zones = zones_obj;

                    $scope.item_id = item_obj.id;
                    // $scope.alias_code = item_obj.alias_code;
                    $scope.description = item_obj.description;
                    $scope.hsn_code = item_obj.hsn_code;
                    $scope.gst_perc = item_obj.gst_per;
                    $scope.rates = item_obj.rate;
                    $scope.type_id = item_obj.type_id != "" ? parseInt(item_obj.type_id) : undefined;
                    $scope.zone_id = item_obj.zone_id != "" ? parseInt(item_obj.zone_id) : undefined;
                    $scope.old_image_file = item_obj.image;

                    $scope.addItem = function() {

                        var frmdata = new FormData();
                        frmdata.append("id", $scope.item_id);
                        // frmdata.append("alias_code", $scope.alias_code);
                        frmdata.append("description", $scope.description);
                        frmdata.append("hsn_code", $scope.hsn_code);
                        frmdata.append("gst_perc", $scope.gst_perc);
                        frmdata.append("rates", parseFloat($scope.rates));
                        frmdata.append("type_id", $scope.type_id);
                        frmdata.append("zone_id", $scope.zone_id);
                        frmdata.append("image_file", $scope.image_file);
                        frmdata.append("old_image_file", $scope.old_image_file);

                        var objXhr = new XMLHttpRequest();

                        objXhr.addEventListener("load", transferComplete, false);

                        objXhr.onreadystatechange = function() {

                            if(objXhr.status == 400 ) {

                                var res = JSON.parse(objXhr.response);
                                SweetAlert.swal("Error!", res.message, "error");

                            }

                            if(objXhr.status == 500 ) {

                                var res = JSON.parse(objXhr.response);
                                SweetAlert.swal("Error!", res.message, "error");

                            }

                            if (objXhr.readyState == 4 && objXhr.status == 200) {

                                //console.log(objXhr.response);

                                SweetAlert.swal("Success!", "Item Updated successfully.", "success");
                                $scope.closeThisDialog(null);

                            }

                        };

                        objXhr.open("POST", 'http://demo.local/api/item/add', true);

                        objXhr.send(frmdata);

                        // ItemService.addZone(data).then(function(response){
                        //     console.log(response);

                        //     if(response.status == 200) {
                        //         $scope.closeThisDialog(null);
                        //         SweetAlert.swal("Sent!", "Item updated.", "success");
                        //     }
                        // });                        

                    }

                    function transferComplete(e) {

                    }

                    $scope.uploadImage = function(files) {

                        var image_file = files[0];
                        $scope.image_file = image_file;

                    };
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getItems();
            });


        };

        vm.delete_item = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this item?",
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

                ItemService.deleteItem(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Item deleted.", "success");
                        vm.getItems();
                    }
                });

              }

          });

        };

        // vm.getItems = function() {

        //     // This request will hit the index method in the ItemController
        //     // on the Laravel side and will return the list of zones

        // }
    }


})();