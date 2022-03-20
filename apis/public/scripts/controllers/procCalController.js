(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('ProcCalController', ProcCalController);

    function ProcCalController(ProcCalService, CompanyService, ItemTypeService, SiteService, $rootScope, $scope, ngDialog, SweetAlert, $location, $state, $stateParams) {

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

        vm.totalPages = 0;
        vm.currentPage = 1;
        vm.range = [];
        vm.showPagination = false;
        $rootScope.companies = [];
        $rootScope.item_types = [];
        $rootScope.sites = [];
        vm.is_proc_items_editable = false;

        // if($state.action == 'proc_add') {

        //     CompanyService.getCompanies().then(function(response){
        //         $rootScope.companies = response.data.data;
        //     });

        //     ItemTypeService.getItemTypes().then(function(response){
        //         $rootScope.item_types = response.data.data;
        //     });

        //     SiteService.getSites().then(function(response){
        //         $rootScope.sites = response.data.data;
        //     });

        // }

        console.log($state.current.action);

        if($state.current.action != undefined && $state.current.action == 'proc_edit') {

            if($stateParams.procId != null && $stateParams.procId != undefined && $stateParams.procId != "") {

                var proc_id = $stateParams.procId;

                vm.is_proc_items_editable = true;
            
                ProcCalService.getProcItems(proc_id).then(function(response){

                    console.log(response.data);
                    $rootScope.items = response.data.data;
                    var proc_detail = response.data.details;

                    $rootScope.company_name = proc_detail.company_name;
                    $rootScope.company_id = proc_detail.company_id;
                    
                    $rootScope.cost_centre_name = proc_detail.cost_centre_name;
                    $rootScope.cost_centre_id = proc_detail.cost_centre_id;

                    $rootScope.month = proc_detail.month;
                    $rootScope.year = proc_detail.year;
                    
                    $rootScope.type_names = proc_detail.type;


                });

            }

        }


        vm.getProcDetails = function(pageNumber){

            if(pageNumber===undefined){
              pageNumber = '1';
            }

            angular.element('.overlay').show();
            angular.element('.loader').show();


            ProcCalService.getProcDetails(pageNumber).then(function(response){

            // Old pagination style using http
            // $http.get('/posts-json?page='+pageNumber).success(function(response) { 
              vm.proc_details        = response.data.data;
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


        vm.addProcCalc = function() {

            var dialog = ngDialog.open({
                template: '../views/proc-calc/short_add.html',
                resolve: {
                    companies_obj: ['CompanyService', function(CompanyService) {
                        
                        return CompanyService.getCompanies().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    types_obj: ['ItemTypeService', function(ItemTypeService) {
                        
                        return ItemTypeService.getItemTypes().then(function(response){
                            return response.data.data;
                        });
                    
                    }],
                    cost_centres_obj: ['CostCentreService', function(CostCentreService) {

                        return CostCentreService.getAllCostCentres().then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', '$rootScope', 'ProcCalService', 'companies_obj', 'types_obj', 'cost_centres_obj', function($scope, $rootScope, ProcCalService, companies_obj, types_obj, cost_centres_obj) {

                    $scope.companies = companies_obj;
                    $scope.item_types = types_obj;
                    $scope.cost_centres = cost_centres_obj;

                    var years = [];

                    var current_date = new Date();
                    var current_year = current_date.getFullYear();

                    for (var i = current_year; i <= current_year+3; i++) {
                        years.push({ name: i, value: i });
                    }

                    $scope.years = years;


                    $scope.getTypes = function(query) {
                        return types_obj;
                    };

                    $scope.types = [];
                    
                    $scope.addProcCalc = function() {

                        var data = {};

                        data.id = '';
                        $rootScope.company_id = $scope.company_id;
                        $rootScope.company_name = getObjectName(companies_obj, $scope.company_id);

                        var type_details = getObjectArrDetails($scope.types);
                        var names = type_details.names.join(",");
                        names = names.replace("-"," ");
                        names = names.replace("-"," ");

                        var ids = type_details.ids.join(",");

                        $rootScope.type_id = ids;
                        $rootScope.type_names = names;

                        $rootScope.cost_centre_id = $scope.cost_centre_id;
                        $rootScope.cost_centre_name = getObjectName(cost_centres_obj, $scope.cost_centre_id);
                        $rootScope.month = $scope.month;
                        $rootScope.year = $scope.year;


                        console.log($rootScope.company_name);
                        console.log($rootScope.site_name);

                        $scope.closeThisDialog(null);

                        $state.go('proc_calc_add');

                    };

                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getProcDetails();
            });

        };

        vm.edit_item = function(item) {

            var dialog = ngDialog.open({
                template: '../views/proc-calc/edit.html',
                controller: ['$scope', 'ProcCalService', '$timeout', '$state', function($scope, ProcCalService, $timeout, $state) {

                    $scope.is_mrp_entry = false;
                    $scope.is_valid_mpc = true;
                    $scope.is_valid_pm = true;
                    $scope.image_file = '';
                    $scope.selectedItem = {
                        originalObject: {}
                    };

                    //$timeout(function(){
                        $scope.description = item.description;
                    //},1000);
                    $scope.brand = item.brand;
                    $scope.unit = item.unit;
                    $scope.hsn_code = item.hsn_code;
                    $scope.gst_perc = item.gst_perc;
                    $scope.cost_pre_gst = item.cost_pre_gst;
                    $scope.mrp = item.mrp;
                    $scope.mrp_pre_gst = item.mrp_pre_gst;
                    $scope.maximum_profit_chargeable = item.maximum_profit_chargeable;
                    $scope.profit_margin = item.profit_margin;
                    $scope.selling_price = item.selling_price;
                    $scope.old_image_file = item.image_file;
                    $scope.item_id = item.id;

                    $scope.updateItem = function() {

                        var formData = {};

                        if($scope.image_file != undefined && $scope.image_file != null && $scope.image_file != "") {
                            formData.image_file = $scope.image_file;
                        } else {
                            formData.image_file = $scope.old_image_file;
                        }
                        formData.brand = $scope.brand;
                        formData.unit = $scope.unit;
                        formData.hsn_code = $scope.hsn_code;
                        formData.gst_perc = $scope.gst_perc;
                        formData.cost_pre_gst = $scope.cost_pre_gst;
                        formData.mrp = $scope.mrp;
                        formData.mrp_pre_gst = $scope.mrp_pre_gst;
                        formData.maximum_profit_chargeable = $scope.maximum_profit_chargeable;
                        formData.profit_margin = $scope.profit_margin;
                        formData.selling_price = $scope.selling_price;
                        formData.item_id = $scope.item_id;

                        ProcCalService.updateItem(formData).then(function(response){
                            console.log(response);
                            SweetAlert.swal("Success!", "Updated successfully.", "success");
                            $scope.closeThisDialog(null);
                            $state.reload();
                        });

                    };

                    
                    $scope.calcSellingPrice = function() {


                        var mrp = $scope.mrp;

                        var profit_margin = ($scope.profit_margin == undefined || $scope.profit_margin == null || $scope.profit_margin == '') ? 0 : parseFloat($scope.profit_margin);

                        var b = 0;

                        if(mrp == undefined || mrp == null || mrp == '') {

                            //debugger;

                            if (profit_margin < 0.01) {

                                //debugger;

                                b = 1;

                                $scope.is_valid_pm = false;
                                $scope.itemForm.profit_margin.$error.minvalue = true;
                                $scope.itemForm.profit_margin.$invalid = true;
                                $scope.selling_price = '';

                            } else {

                                //debugger;

                                b = 2;

                                $scope.is_valid_pm = true;
                                $scope.itemForm.profit_margin.$error.minvalue = false;
                                $scope.itemForm.profit_margin.$invalid = false;

                                var total_sp = 0;
                                var tax = (parseFloat(profit_margin) / 100) * parseFloat($scope.cost_pre_gst);
                                total_sp = parseFloat($scope.cost_pre_gst) + tax;

                                $scope.selling_price = total_sp.toFixed(2);

                            }

                            

                        }

                        //debugger;

                        console.log(b);

                    };

                    $scope.calculateCharges = function() {

                        var mrp = $scope.mrp;
                        if(mrp != undefined && mrp != null && mrp != "") {
                            $scope.calcPreGSTMRP();
                        } else {
                            $scope.calcSellingPrice
                        }

                    };

                    $scope.calcPreGSTMRP = function() {

                        var mrp = $scope.mrp;

                        if(mrp != undefined && mrp != null && mrp != "") {

                            $scope.is_mrp_entry = true;

                            var gst_perc_value = (parseFloat($scope.gst_perc / 100)).toFixed(2);
                            //console.log(gst_perc_value);
                            var tax = 1 + parseFloat(gst_perc_value);
                            //console.log(tax);
                            var pre_gst_mrp = (mrp * (1/tax)).toFixed(2);
                            //console.log(pre_gst_mrp);

                            $scope.mrp_pre_gst = pre_gst_mrp;
                            var maximum_profit_chargeable = (pre_gst_mrp - $scope.cost_pre_gst).toFixed(2);
                            var profit_margin = (maximum_profit_chargeable * 0.75).toFixed(2);

                            $scope.maximum_profit_chargeable = maximum_profit_chargeable;
                            if (maximum_profit_chargeable < 0.01) {
                                $scope.itemForm.maximum_profit_chargeable.$error.minvalue = true;
                                $scope.itemForm.maximum_profit_chargeable.$invalid = true;
                                $scope.is_valid_mpc = false;
                            } else {
                                $scope.itemForm.maximum_profit_chargeable.$error.minvalue = false;
                                $scope.itemForm.maximum_profit_chargeable.$invalid = false;
                                $scope.is_valid_mpc = true;
                            }

                            var a=0;
                            $scope.profit_margin = parseFloat(profit_margin);
                            
                            if (profit_margin < 0.01) {
                                a = 1;
                                $scope.is_valid_pm = false;
                                $scope.itemForm.profit_margin.$error.minvalue = true;
                                $scope.itemForm.profit_margin.$invalid = true;
                            } else {
                                a = 2;
                                $scope.is_valid_pm = true;
                                $scope.itemForm.profit_margin.$error.minvalue = false;
                                $scope.itemForm.profit_margin.$invalid = false;
                            }

                            console.log(a);

                            var selling_price = (parseFloat(profit_margin) + parseFloat($scope.cost_pre_gst)).toFixed(2);
                            $scope.selling_price = selling_price;

                        } else {

                            $scope.is_mrp_entry = false;
                            $scope.mrp_pre_gst = '';
                            $scope.maximum_profit_chargeable = '';
                            $scope.profit_margin = '';
                            $scope.selling_price = '';

                            $scope.is_valid_mpc = true;
                            $scope.is_valid_pm = true;

                        }

                    };


                    $scope.uploadImage = function(files) {

                        // var formData = new FormData();
                        console.log(files[0]);
                        if(files.length > 0) {
                            var image_file = files[0];

                            var frmdata = new FormData();
                            frmdata.append("image_file", image_file);

                            var objXhr = new XMLHttpRequest();

                            angular.element('.overlay').show();
                            angular.element('.loader').show();


                            objXhr.addEventListener("load", transferComplete, false);

                              objXhr.onreadystatechange = function() {

                                  if(objXhr.status == 400 ) {

                                    var res = JSON.parse(objXhr.response);
                                    SweetAlert.swal("Error!", res.message, "error");

                                  }

                                  if(objXhr.status == 500 ) {

                                    var res = JSON.parse(objXhr.response);
                                    console.log(res);
                                    SweetAlert.swal("Error!", res.message, "error");

                                  }

                                  if (objXhr.readyState == 4 && objXhr.status == 200) {

                                      //console.log(objXhr.response);

                                      var res = JSON.parse(objXhr.response);
                                      console.log(res);
                                      $scope.image_file = res;
                                    angular.element('.overlay').hide();
                                    angular.element('.loader').hide();

                                  }

                              };

                            objXhr.open("POST", 'http://demo.local/api/proc_calc/upload/image', true);

                            objXhr.send(frmdata);

                            // ProcCalService.uploadImage(formData).then(function(response){
                            //     console.log(response);
                            // });
                        }

                    };

                    function transferComplete(e) {

                    }


                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getProcDetails();
            });

        }

        vm.addProcItems = function() {

            var dialog = ngDialog.open({
                template: '../views/proc-calc/add.html',
                controller: ['$scope', 'ProcCalService', function($scope, ProcCalService) {

                    $scope.is_mrp_entry = false;
                    $scope.is_valid_mpc = true;
                    $scope.is_valid_pm = true;
                    $scope.image_file = '';
                    
                    $scope.calcSellingPrice = function() {


                        var mrp = $scope.mrp;

                        var profit_margin = ($scope.profit_margin == undefined || $scope.profit_margin == null || $scope.profit_margin == '') ? 0 : parseFloat($scope.profit_margin);

                        var b = 0;

                        if(mrp == undefined || mrp == null || mrp == '') {

                            //debugger;

                            if (profit_margin < 0.01) {

                                //debugger;

                                b = 1;

                                $scope.is_valid_pm = false;
                                $scope.itemForm.profit_margin.$error.minvalue = true;
                                $scope.itemForm.profit_margin.$invalid = true;
                                $scope.selling_price = '';

                            } else {

                                //debugger;

                                b = 2;

                                $scope.is_valid_pm = true;
                                $scope.itemForm.profit_margin.$error.minvalue = false;
                                $scope.itemForm.profit_margin.$invalid = false;

                                var total_sp = 0;
                                var tax = (parseFloat(profit_margin) / 100) * parseFloat($scope.cost_pre_gst);
                                total_sp = parseFloat($scope.cost_pre_gst) + tax;

                                $scope.selling_price = total_sp.toFixed(2);

                            }

                            

                        }

                        //debugger;

                        console.log(b);

                    };

                    $scope.calcPreGSTMRP = function() {

                        var mrp = $scope.mrp;

                        if(mrp != undefined && mrp != null && mrp != "") {

                            $scope.is_mrp_entry = true;

                            var gst_perc_value = (parseFloat($scope.gst_perc / 100)).toFixed(2);
                            //console.log(gst_perc_value);
                            var tax = 1 + parseFloat(gst_perc_value);
                            //console.log(tax);
                            var pre_gst_mrp = (mrp * (1/tax)).toFixed(2);
                            //console.log(pre_gst_mrp);

                            $scope.mrp_pre_gst = pre_gst_mrp;
                            var maximum_profit_chargeable = (pre_gst_mrp - $scope.cost_pre_gst).toFixed(2);
                            var profit_margin = (maximum_profit_chargeable * 0.75).toFixed(2);

                            $scope.maximum_profit_chargeable = maximum_profit_chargeable;
                            if (maximum_profit_chargeable < 0.01) {
                                $scope.itemForm.maximum_profit_chargeable.$error.minvalue = true;
                                $scope.itemForm.maximum_profit_chargeable.$invalid = true;
                                $scope.is_valid_mpc = false;
                            } else {
                                $scope.itemForm.maximum_profit_chargeable.$error.minvalue = false;
                                $scope.itemForm.maximum_profit_chargeable.$invalid = false;
                                $scope.is_valid_mpc = true;
                            }

                            var a=0;
                            $scope.profit_margin = parseFloat(profit_margin);
                            
                            if (profit_margin < 0.01) {
                                a = 1;
                                $scope.is_valid_pm = false;
                                $scope.itemForm.profit_margin.$error.minvalue = true;
                                $scope.itemForm.profit_margin.$invalid = true;
                            } else {
                                a = 2;
                                $scope.is_valid_pm = true;
                                $scope.itemForm.profit_margin.$error.minvalue = false;
                                $scope.itemForm.profit_margin.$invalid = false;
                            }

                            console.log(a);

                            var selling_price = (parseFloat(profit_margin) + parseFloat($scope.cost_pre_gst)).toFixed(2);
                            $scope.selling_price = selling_price;

                        } else {

                            $scope.is_mrp_entry = false;
                            $scope.mrp_pre_gst = '';
                            $scope.maximum_profit_chargeable = '';
                            $scope.profit_margin = '';
                            $scope.selling_price = '';

                            $scope.is_valid_mpc = true;
                            $scope.is_valid_pm = true;

                        }

                    };


                    $scope.addItem = function() {

                        var item_obj = {};
                        var mrp = $scope.mrp;

                        item_obj.description = $scope.selectedItem.originalObject.name;
                        if($scope.brand != undefined && $scope.brand != null && $scope.brand != "") {
                            item_obj.brand = $scope.brand;
                        } else {
                            item_obj.brand = '';
                        }
                        if($scope.unit != undefined && $scope.unit != null && $scope.unit != "") {
                            item_obj.unit = $scope.unit;
                        } else {
                            item_obj.unit = '';
                        }
                        item_obj.hsn_code = $scope.hsn_code;
                        item_obj.gst_perc = $scope.gst_perc;
                        item_obj.cost_pre_gst = $scope.cost_pre_gst;
                        if(mrp != undefined && mrp != null && mrp != "") {
                            item_obj.mrp = mrp;
                            item_obj.mrp_pre_gst = $scope.mrp_pre_gst;
                            item_obj.maximum_profit_chargeable = $scope.maximum_profit_chargeable;
                        } else {

                            item_obj.mrp = '';
                            item_obj.mrp_pre_gst = '';
                            item_obj.maximum_profit_chargeable = '';

                        }
                        item_obj.profit_margin = $scope.profit_margin;
                        item_obj.selling_price = $scope.selling_price;
                        item_obj.image_file = $scope.image_file;

                        $rootScope.items.push(item_obj);
                        $scope.closeThisDialog(null);

                        console.log($rootScope.items);
                        console.log($scope.image_file);

                        // $scope.image_file = '';

                    };


                    $scope.uploadImage = function(files) {

                        // var formData = new FormData();
                        console.log(files[0]);
                        if(files.length > 0) {
                            var image_file = files[0];

                            angular.element('.overlay').show();
                            angular.element('.loader').show();

                            var frmdata = new FormData();
                            frmdata.append("image_file", image_file);

                            var objXhr = new XMLHttpRequest();

                            objXhr.addEventListener("load", transferComplete, false);

                              objXhr.onreadystatechange = function() {

                                  if(objXhr.status == 400 ) {

                                    var res = JSON.parse(objXhr.response);
                                    SweetAlert.swal("Error!", res.message, "error");
                                    angular.element('.overlay').hide();
                                    angular.element('.loader').hide();

                                  }

                                  if(objXhr.status == 500 ) {

                                    angular.element('.overlay').hide();
                                    angular.element('.loader').hide();

                                    var res = JSON.parse(objXhr.response);
                                    console.log(res);
                                    SweetAlert.swal("Error!", res.message, "error");

                                  }

                                  if (objXhr.readyState == 4 && objXhr.status == 200) {

                                      //console.log(objXhr.response);
                                        angular.element('.overlay').hide();
                                        angular.element('.loader').hide();
                                        
                                      console.log(objXhr.response);

                                      var res = JSON.parse(objXhr.response);
                                      console.log(res);
                                      $scope.image_file = res;


                                  }

                              };

                            objXhr.open("POST", 'http://demo.local/api/proc_calc/upload/image', true);

                            objXhr.send(frmdata);

                            // ProcCalService.uploadImage(formData).then(function(response){
                            //     console.log(response);
                            // });
                        }

                    };

                    function transferComplete(e) {

                    }


                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getProcDetails();
            });

        };


        vm.export = function(proc_calc_id, type) {


            ProcCalService.export(proc_calc_id, type).then(function(response){

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


        vm.saveProcCalc = function() {

            var data = {};

            data.company_id = $rootScope.company_id;
            data.type = $rootScope.type_names;
            data.cost_centre_id = $rootScope.cost_centre_id;
            data.month = $rootScope.month;
            data.year = $rootScope.year;
            data.items = angular.toJson($rootScope.items);
            if(vm.is_proc_items_editable == true) {
                data.proc_calc_id = $stateParams.procId;
            } 

            if($rootScope.items.length > 0) {

                SweetAlert.swal({
                  title: "Do you really want to submit?",
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Yes, do it!",
                  closeOnConfirm: false
                },  function(isConfirm){

                  if(isConfirm) {

                    ProcCalService.addProcCalc(data).then(function(response){
                        if(response.status == 200) {
                            SweetAlert.swal("Success!", "Submit successfully.", "success");
                            if(vm.is_proc_items_editable == true) {



                            } else {
                                $state.go('proc_calc');
                            }
                            
                        }
                    });

                  }

              });



            } else {

                SweetAlert.swal("Error!", "Please add atleast one item.", "error");

            }

        };


        vm.edit_proc_calc = function(id) {

            var dialog = ngDialog.open({
                template: '../views/proc-calc/add.html',
                resolve: {
                    proc_cal_obj: ['ProcCalService', function(ProcCalService) {
                        
                        return ProcCalService.getProCalc(id).then(function(response){
                            return response.data;
                        });
                    
                    }]
                },
                controller: ['$scope', 'ProcCalService', 'proc_cal_obj', function($scope, ProcCalService, proc_cal_obj) {
                    
                    $scope.brand_id = proc_cal_obj.id;
                    $scope.name = proc_cal_obj.name;

                    $scope.addProcCalc = function() {

                        var data = {};

                        data.id = $scope.brand_id;
                        data.name = $scope.name;

                        ProcCalService.addProcCalc(data).then(function(response){
                            console.log(response);

                            if(response.status == 200) {
                                $scope.closeThisDialog(null);
                                SweetAlert.swal("Success!", "Record updated.", "success");
                            }
                        });                        

                    }
                    
                }],
                width: '40%'
            });

            dialog.closePromise.then(function (data) {
                vm.getProcDetails();
            });


        };

        vm.delete_proc_calc = function(id) {

            SweetAlert.swal({
              title: "Do you really want to delete this record?",
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Yes, delete it!",
              closeOnConfirm: false
            },  function(isConfirm){

              if(isConfirm) {

                ProcCalService.deleteProcCalc(id).then(function(response){
                    if(response.status == 200) {
                        SweetAlert.swal("Success!", "Record deleted.", "success");
                        vm.getProcDetails();
                    }
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