angular.module('LostLead', []).controller('LostLeadController', function($scope,$rootScope,$window,$http,LeadService,CityService,$timeout,$routeParams,$route,$location,ClientService,CacheService,OrderService,InspectionService,SweetAlert,$filter,serverConfig,bitly,SMSService,AuthService,ManpowerService, KAPService) {

    //console.log(serverConfig.apiUrl);

    $scope.lead_data = [];
    $scope.updateLead = false;
    $scope.page = 1;
    $scope.leadData = {};
    $scope.lead_id = '';
    $scope.lead_status = 0;
    $scope.leadDetails = {};
    $scope.contract_status = {
      1: 'Contract Won',
      2: 'Contract Partially Won',
      3: 'Contract Lost'
    };
    $scope.lost_reason = {
      1: 'Going to competitor',
      2: 'Too Expensive',
      3: 'Lead just gone cold',
      4: 'Waiting for the response',
      5: 'Other'
    };
    $scope.show_remarks = false;
    $scope.isEnableDealSize = false;
    $scope.leadData.deal_size = 0;
    $scope.leadData.probability = 0;
    $scope.leadData.weighted = 0;
    $scope.deal_size_annual = 0;

    $scope.c0_total = 0;
    $scope.c1_total = 0;
    $scope.c2_total = 0;
    $scope.c3_total = 0;


    $scope.currentUser = AuthService.currentUser();
    $scope.lead_owner = $scope.currentUser.name;

    CityService.getCities({}).then(function(response){
      if(response.data != undefined && response.data != null) {
        var data = response.data.result;      
        $scope.cities = data;
      }
    });

    var search_data = {};

    search_data.email = $scope.currentUser.email;

    KAPService.getAllCompanies(search_data).then(function(response){

      $scope.companies = response.data.result;

      $scope.autocomplete_options = {
        suggest: suggest_state
      };
      
      console.log($scope.companies);

    });

    function suggest_state(term) {
      var q = term.toLowerCase().trim();
      var results = [];

      // Find first 10 states that start with `term`.
      for (var i = 0; i < $scope.companies.length && results.length < 10; i++) {
        var company = $scope.companies[i];
        if (company.name.toLowerCase().indexOf(q) === 0)
          results.push({ label: company.name, value: company.name });
      }

      return results;
    }

    // if($scope.currentUser.email == "lui@skarma.com") {
    //   AuthService.logout();
    //   $window.location.href = '/login';
    // }

    // if($scope.currentUser.role == "operations") {
    //   $window.location.href = '/orders';
    // }

    // InspectionService.getInspections({status: 0}).then(function(response) {
    //   $scope.open_inspection_count = response.data.message.length;
    // });

    // InspectionService.getInspections({status: 1}).then(function(response) {
    //   $scope.closed_inspection_count = response.data.message.length;
    // });

    $scope.goToPath = function(path) {
      $window.location.href = path;
    };

    $scope.open_add_lead = function() {

      $scope.leadData.id = '';
      $scope.leadData.cname = '';
      $scope.leadData.company_name = '';
      $scope.leadData.company_poc = '';
      $scope.leadData.company_poc_email = '';
      $scope.leadData.company_poc_mobile = '';
      // $scope.leadData.division = '';
      $scope.leadData.city = '';
      $scope.leadData.spoc = '';
      $scope.leadData.email = '';
      $scope.leadData.client_type = '';
      // $scope.leadData.relevant = '';
      // $scope.leadData.leadsource = '';
      $scope.leadData.industry = '';
      $scope.leadData.c0_value = '';
      $scope.leadData.c1_value = '';
      $scope.leadData.c2_value = '';
      $scope.leadData.c3_value = '';
      $scope.lead_owners = '';
      angular.element('#add_lead').openModal({ dismissible: false });

    };

    $scope.showValue = function() {

      debugger;

      if($scope.leadData.deal_type == 'monthly') {
        $scope.isMonthly = true;
      } else {
        $scope.isMonthly = false;
      }

      debugger;

      console.log($scope.deal_type);

    };

    // $scope.selectedValues = function() {

    //   console.log($scope.leadData.spoc);

    // };

    // LeadService.authenticateUser().then(function(response){
    //   console.log(response);
    //   if(response.data == "") {
    //     window.location.href = "http://engine.mrhomecare.net/index.html";
    //   }
    // });

    $scope.deleteLeadData = function(lead_id) {

      console.log(lead_id);

      SweetAlert.swal({
          title: "Do you really want to delete this lead?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false
        },  function(isConfirm){

          if(isConfirm) {

            LeadService.deleteLeadData(lead_id).then(function(res){
              
              SweetAlert.swal("Success!", res.data.message, "success");
              // $route.reload();
              $scope.searchLeads(1);

              // $scope.page = 1;

              // LeadService.getAllLeads({ page: $scope.page }).then(function(response){
              //   $scope.lead_data = response.data.result.data;
              //   $scope.hasMoreData = true;
              //   $scope.loading = false;
              //   //$scope.leadData = {};
              //   //angular.element('#lead_form').reset();
              // });

            }, function(error) {
              //alert(error.message);
              SweetAlert.swal("Error!", error.message, "error");
            });

          }

      });

    };

    // var is_poc = 0;

    // $scope.saveLeadData = function(){

    //   debugger;

    //   if($scope.leadData.company_name == '' || $scope.leadData.company_name == undefined || $scope.leadData.company_name == null) {
    //     SweetAlert.swal("Error!", 'Please enter company name', "error");
    //     return;
    //   }

    //   if($scope.leadData.company_poc == '' || $scope.leadData.company_poc == undefined || $scope.leadData.company_poc == null) {
    //     SweetAlert.swal("Error!", 'Please enter company poc', "error");
    //     return;
    //   }


    //     if($scope.leadData.company_poc_email == '' || $scope.leadData.company_poc_email == undefined || $scope.leadData.company_poc_email == null) {
    //     } else {
    //       is_poc = 1;
    //     }


    //     if($scope.leadData.company_poc_mobile == '' || $scope.leadData.company_poc_mobile == undefined || $scope.leadData.company_poc_mobile == null) {
    //     } else {
    //       is_poc = 1;          
    //     }

    //     if(($scope.leadData.company_poc_email == '' || $scope.leadData.company_poc_email == undefined || $scope.leadData.company_poc_email == null) && ($scope.leadData.company_poc_mobile == '' || $scope.leadData.company_poc_mobile == undefined || $scope.leadData.company_poc_mobile == null)) {
    //       is_poc = 0;
    //     }

    //   if(is_poc == 0) {
    //       SweetAlert.swal("Error!", 'Please enter company poc email or mobile', "error");
    //       return;
    //   }

    //   if($scope.leadData.division == '' || $scope.leadData.division == undefined || $scope.leadData.division == null) {
    //     SweetAlert.swal("Error!", 'Please select division', "error");
    //     return;
    //   }

    //   if($scope.leadData.city == '' || $scope.leadData.city == undefined || $scope.leadData.city == null) {
    //     SweetAlert.swal("Error!", 'Please select city', "error");
    //     return;
    //   }

    //   if($scope.leadData.spoc == '' || $scope.leadData.spoc == undefined || $scope.leadData.spoc == null || $scope.leadData.spoc.length <=0) {
    //     SweetAlert.swal("Error!", 'Please select spoc', "error");
    //     return;
    //   }

    //   if($scope.leadData.email == '' || $scope.leadData.email == undefined || $scope.leadData.email == null) {
    //     SweetAlert.swal("Error!", 'Please enter email', "error");
    //     return;
    //   }


    //   //$scope.leadData.relevant = '';
    //   if($scope.leadData.leadsource == '' || $scope.leadData.leadsource == undefined || $scope.leadData.leadsource == null) {
    //     SweetAlert.swal("Error!", 'Please select leadsource', "error");
    //     return;
    //   }

    //   if($scope.leadData.industry == '' || $scope.leadData.industry == undefined || $scope.leadData.industry == null) {
    //     SweetAlert.swal("Error!", 'Please select industry', "error");
    //     return;
    //   }

    //   if($scope.leadData.sales_stage == '' || $scope.leadData.sales_stage == undefined || $scope.leadData.sales_stage == null) {
    //     SweetAlert.swal("Error!", 'Please select sales stage', "error");
    //     return;
    //   }

    //   if($scope.leadData.sales_stage == "In The Zone"  || $scope.leadData.sales_stage == "Verbal Yes") {

    //     if($scope.leadData.deal_type == '' || $scope.leadData.deal_type == undefined || $scope.leadData.deal_type == null) {
    //       SweetAlert.swal("Error!", 'Please select deal type', "error");
    //       return;
    //     } 
        
    //     if($scope.leadData.deal_size == '' || $scope.leadData.deal_size == undefined || $scope.leadData.deal_size == null) {
    //       SweetAlert.swal("Error!", 'Please enter deal size', "error");
    //       return;
    //     }  

    //     if($scope.leadData.deal_size_annual == '' || $scope.leadData.deal_size_annual == undefined || $scope.leadData.deal_size_annual == null) {
    //       SweetAlert.swal("Error!", 'Please enter annual deal size', "error");
    //       return;
    //     }

    //     if($scope.leadData.probability == '' || $scope.leadData.probability == undefined || $scope.leadData.probability == null) {
    //       SweetAlert.swal("Error!", 'Please enter probability', "error");
    //       return;
    //     }

    //     if($scope.leadData.weighted == '' || $scope.leadData.weighted == undefined || $scope.leadData.weighted == null) {
    //       SweetAlert.swal("Error!", 'Please enter weighted value', "error");
    //       return;
    //     }

    //     var cost_schedule_file = '';

    //     if($scope.leadData.cost_schedule == "undefined" || $scope.leadData.cost_schedule == undefined || $scope.leadData.cost_schedule == '' || $scope.leadData.cost_schedule == null) {
  
    //       cost_schedule_file = angular.element("#cost_schedule")[0].files[0];
    //       if(cost_schedule_file == "" || cost_schedule_file == undefined || cost_schedule_file == null) {
    //         SweetAlert.swal("Error!", 'Please attach your cost schedule', "error");
    //         return;
    //       }

    //     }

    //   }

    //   // $scope.leadData.deal_size = '';
    //   // $scope.leadData.deal_size_annual = '';
    //   // $scope.leadData.probability = '';
    //   // $scope.leadData.weighted = '';
    //   if($scope.leadData.target_date == '' || $scope.leadData.target_date == undefined || $scope.leadData.target_date == null) {
    //     SweetAlert.swal("Error!", 'Please enter target date', "error");
    //     return;
    //   }



    //   var data = $scope.leadData;
    //   var temp_date = $scope.leadData.target_date;

    //   data.cost_schedule = cost_schedule_file;
    //   data.old_cost_schedule = $scope.leadData.old_cost_schedule;
      
    //   data.deal_size =  (data.deal_size != undefined || data.deal_size != null && data.deal_size != "") ? parseFloat(data.deal_size) : 0;
    //   data.deal_size_annual =  (data.deal_size_annual != undefined || data.deal_size_annual != null && data.deal_size_annual != "") ? parseFloat(data.deal_size_annual) : 0;
    //   data.probability = (data.probability != undefined || data.probability != null && data.probability != "") ? parseFloat(data.probability) : 0;
    //   data.weighted = (data.weighted != undefined || data.weighted != null && data.weighted != "") ? parseFloat(data.weighted) : 0;
    //   data.gross_profit = (data.gross_profit != undefined || data.gross_profit != null && data.gross_profit != "") ? parseFloat(data.gross_profit) : 0;

    //   data.deal_size = angular.isNumber(data.deal_size) ? data.deal_size : 0;
    //   data.deal_size_annual = angular.isNumber(data.deal_size_annual) ? data.deal_size_annual : 0;
    //   data.probability = angular.isNumber(data.probability) ? data.probability : 0;
    //   data.weighted = angular.isNumber(data.weighted) ? data.weighted : 0;
    //   data.gross_profit = angular.isNumber(data.gross_profit) ? data.gross_profit : 0;

    //   //data.status = parseInt(0);

    //   if(data.target_date != undefined && data.target_date != null && data.target_date != "") {

    //     var dt = new Date(data.target_date);
    //     dt.setDate(dt.getDate());
    //     data.target_date = dt.toISOString();

    //   } else {

    //     data.target_date = "";

    //   }

    //     var spoc_list_arr = [];
    //   var spoc = '';
    //   if($scope.leadData.spoc.length > 0) {
    //     spoc_list_arr = $scope.leadData.spoc;
    //     spoc = spoc_list_arr.join("/");
    //   }

    //   data.spoc = spoc;


    //   // if($scope.updateLead == false) {
    //   //   data.status = parseInt(0);
    //   // }

    //   if(data.id == undefined || data.id == null || data.id == '') {
    //     data.status = 0;
    //   }

    //   var frmdata = new FormData();

    //   console.log(data);

    //   angular.forEach(data,function(value,key){

    //     // console.log(key);
    //     // console.log(value);
    //     frmdata.append(key,value);

    //   });

    //   var objXhr = new XMLHttpRequest();

    //   //objXhr.addEventListener("progress", updateProgress, false);

    //   objXhr.addEventListener("load", transferComplete, false);

    //   objXhr.onreadystatechange = function() {

    //       if(objXhr.status == 400 ) {

    //         var res = JSON.parse(objXhr.response);
    //         SweetAlert.swal("Error!", res.message, "error");
    //         data.target_date = temp_date;

    //       }

    //       if(objXhr.status == 500 ) {

    //         var res = JSON.parse(objXhr.response);
    //         SweetAlert.swal("Error!", res.message, "error");
    //         data.target_date = temp_date;

    //       }

    //       if (objXhr.readyState == 4 && (objXhr.status == 200 || objXhr.status == 201)) {

    //           //console.log(objXhr.response);
    //           data.target_date = temp_date;

    //           var res = JSON.parse(objXhr.response);
    //           SweetAlert.swal("Success!", res.message, "success");
    //           // $route.reload();
    //           $scope.searchLeads(1);
    //           //angular.element('#update_lead_details_partial').closeModal();

    //           angular.element('#add_lead').closeModal();
    //           $scope.leadData.id = '';
    //           $scope.leadData.company_name = '';
    //           $scope.leadData.company_poc = '';
    //           $scope.leadData.company_poc_email = '';
    //           $scope.leadData.company_poc_mobile = '';
    //           $scope.leadData.division = '';
    //           $scope.leadData.city = '';
    //           $scope.leadData.spoc = '';
    //           $scope.leadData.email = '';
    //           $scope.leadData.relevant = '';
    //           $scope.leadData.leadsource = '';
    //           $scope.leadData.industry = '';
    //           $scope.leadData.sales_stage = '';
    //           $scope.leadData.deal_size = '';
    //           $scope.leadData.deal_size_annual = '';
    //           $scope.leadData.probability = '';
    //           $scope.leadData.weighted = '';
    //           $scope.leadData.remarks = '';
    //           $scope.leadData.target_date = '';
    //           $scope.leadData.gross_profit = '';
    //           angular.element('#spoc_list').val([]).material_select(); 
    //           angular.element("#cost_schedule").val("");

    //       }

    //   };

    //   objXhr.open("POST", 'http://engine.silagroup.co.in/api/public/lead/save', true);

    //   objXhr.send(frmdata);


    // };


    

    var is_poc = 0;
    var is_ss = 0;

    $scope.saveLeadData = function(){

      // debugger;
      if($scope.leadData.cname == '' || $scope.leadData.cname == undefined || $scope.leadData.cname == null) {
        SweetAlert.swal("Error!", 'Please enter company name', "error");
        return;
      }

      if($scope.leadData.company_poc_email == '' || $scope.leadData.company_poc_email == undefined || $scope.leadData.company_poc_email == null) {
        } else {
          is_poc = 1;
        }


        if($scope.leadData.company_poc_mobile == '' || $scope.leadData.company_poc_mobile == undefined || $scope.leadData.company_poc_mobile == null) {
        } else {
          is_poc = 1;          
        }

        if(($scope.leadData.company_poc_email == '' || $scope.leadData.company_poc_email == undefined || $scope.leadData.company_poc_email == null) && ($scope.leadData.company_poc_mobile == '' || $scope.leadData.company_poc_mobile == undefined || $scope.leadData.company_poc_mobile == null)) {
          is_poc = 0;
        }

      if(is_poc == 0) {
          SweetAlert.swal("Error!", 'Please enter company poc email or mobile', "error");
          return;
      }

      if($scope.lead_owners == '' || $scope.lead_owners == undefined || $scope.lead_owners == null) {
        SweetAlert.swal("Error!", 'Please select lead owner', "error");
        return;
      }

      if($scope.leadData.city == '' || $scope.leadData.city == undefined || $scope.leadData.city == null) {
        SweetAlert.swal("Error!", 'Please select city', "error");
        return;
      }

      if($scope.leadData.industry == '' || $scope.leadData.industry == undefined || $scope.leadData.industry == null) {
        SweetAlert.swal("Error!", 'Please select industry', "error");
        return;
      }

      if($scope.leadData.leadsource == '' || $scope.leadData.leadsource == undefined || $scope.leadData.leadsource == null) {
        SweetAlert.swal("Error!", 'Please select leadsource', "error");
        return;
      }

      $scope.leadData.email = $scope.currentUser.email;
      $scope.leadData.company_name = $scope.leadData.cname;
      delete $scope.leadData.cname;

      console.log($scope.leadData);

      var data = $scope.leadData;

      data.c0_value =  (data.c0_value != undefined || data.c0_value != null && data.c0_value != "" && !isNaN(data.c0_value)) ? parseFloat(data.c0_value) : 0;
      data.c1_value =  (data.c0_value != undefined || data.c1_value != null && data.c1_value != "" && !isNaN(data.c1_value)) ? parseFloat(data.c1_value) : 0;
      data.c2_value =  (data.c0_value != undefined || data.c2_value != null && data.c2_value != "" && !isNaN(data.c2_value)) ? parseFloat(data.c2_value) : 0;
      data.c3_value =  (data.c0_value != undefined || data.c3_value != null && data.c3_value != "" && !isNaN(data.c3_value)) ? parseFloat(data.c3_value) : 0;

      data.c0_value = angular.isNumber(data.c0_value) ? data.c0_value : 0;
      data.c1_value = angular.isNumber(data.c1_value) ? data.c1_value : 0;
      data.c2_value = angular.isNumber(data.c2_value) ? data.c2_value : 0;
      data.c3_value = angular.isNumber(data.c3_value) ? data.c3_value : 0;


      $scope.getCheckedSPOCValues();

      var spoc_list_arr = [];
      var spoc = '';
      if($scope.leadData.spoc.length > 0) {
        spoc_list_arr = $scope.leadData.spoc;
        spoc = spoc_list_arr.join("/");
      }

      data.spoc = spoc;

      if(data.id == undefined || data.id == null || data.id == '') {
        data.status = 0;
      } else {
        data.status = 5;
      }

      data.important = 0.0;
      data.is_assigned_lead = $scope.is_assigned_lead == true ? 1 : 0;

      LeadService.saveLeadData(data).then(function(response){

        // debugger;

        console.log(data);
        console.log(response.data);
        if(response != undefined && response != null) {

          if(response.data != undefined && response.data != null) {

            SweetAlert.swal("Success!", response.data.message, "success");

            $scope.searchLeads(1);


            angular.element('#add_lead').closeModal();
            $scope.leadData.id = '';
            $scope.leadData.company_name = '';
            $scope.leadData.company_poc = '';
            $scope.leadData.company_poc_email = '';
            $scope.leadData.company_poc_mobile = '';
            // $scope.leadData.division = '';
            $scope.leadData.city = '';
            $scope.leadData.spoc = '';
            $scope.leadData.email = '';
            $scope.leadData.client_type = '';
            // $scope.leadData.relevant = '';
            // $scope.leadData.leadsource = '';
            $scope.leadData.industry = '';
            $scope.leadData.c0_value = '';
            $scope.leadData.c1_value = '';
            $scope.leadData.c2_value = '';
            $scope.leadData.c3_value = '';
            $scope.lead_owners = '';

          }

        }
        
      }, function(error) {
        //alert(error.message);
        SweetAlert.swal("Error!", error.message, "error");
      });


    };




    $scope.resetLeadForm = function() {

      $scope.leadData.id = '';
      $scope.leadData.company_name = '';
      $scope.leadData.company_poc = '';
      $scope.leadData.company_poc_email = '';
      $scope.leadData.company_poc_mobile = '';
      $scope.leadData.division = '';
      $scope.leadData.city = '';
      $scope.leadData.spoc = [];
      $scope.leadData.email = '';
      $scope.leadData.relevant = '';
      $scope.leadData.leadsource = '';
      $scope.leadData.industry = '';
      $scope.leadData.sales_stage = '';
      $scope.leadData.deal_size = '';
      $scope.leadData.deal_size_annual = '';
      $scope.leadData.probability = '';
      $scope.leadData.weighted = '';
      $scope.leadData.remarks = '';
      $scope.leadData.target_date = '';
      angular.element('#spoc_list').val([]).material_select(); 

    };



    $scope.setDealSize = function(sales_stage) {

      $scope.isEnableDealSize = false;

      //debugger;

      if(sales_stage == "In The Zone" || sales_stage == "Verbal Yes") {

        $scope.isEnableDealSize = true;

      }

      //debugger;

    };

     $scope.change_to_open_status = function(id) {

      console.log(id);

      var data = {};

      data.lead_id = id;
      data.status = 0;

      SweetAlert.swal({
          title: "Do you really want to make this as an open lead?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, do it!",
          closeOnConfirm: false
        },  function(isConfirm){

          if(isConfirm) {

            LeadService.updateStatus(data).then(function(response){
              console.log(response);
              if(response.data.error == false) {
                SweetAlert.swal("Success!", response.data.message, "success");
                $scope.searchLeads(1);
              }
            }, function(error) {
                SweetAlert.swal("Error!", error.data.message, "error");
            });
          }

        });

    };


    $scope.change_status = function(status) {

      console.log($scope.lead_data[$scope.leadIndex]._id);

      $scope.lead_id = $scope.lead_data[$scope.leadIndex]._id;
      $scope.lead_status = status;

      //console.log($scope.leadIndex);
      //console.log($scope.lead_data[$scope.leadIndex]);
      //console.log(status);

      if(status == 1) {
        angular.element('#update_lead_details').openModal();
      }

      if(status == 2) {
        angular.element('#update_lead_details_partial').openModal();
      }

      if(status == 3) {
        angular.element('#update_lead_details_lost').openModal();
      }

    };

    $scope.otherRemarks = function(reason) {
      if(reason == 4) {

        $scope.show_remarks = true;

      } else {

        $scope.show_remarks = false;
        $scope.leadDetails.other_reason = '';

      }
    }

    $scope.updateReminder = function() {

      var data = {};

      data.id = $scope.lead_id;
      data.reminder = (new Date($scope.reminder)).toISOString();

      LeadService.setReminder(data).then(function(response){

        if(response != undefined && response != null) {

          if(response.data != undefined && response.data != null) {

            //var res = JSON.parse(response.data);
            //console.log(response.data.message);
            SweetAlert.swal("Success!", response.data.message, "success");

            // $scope.page = 1;

            // LeadService.getAllLeads({ page: $scope.page }).then(function(response){
            //   $scope.lead_data = response.data.result.data;
            //   $scope.hasMoreData = true;
            //   $scope.loading = false;
            //   //$scope.leadData = {};
            //   angular.element('#add_reminder').closeModal();
            //   $scope.reminder = '';

            // });

            angular.element('#add_reminder').closeModal();
            $scope.searchLeads(1);

          }

        }


      }, function(error) {
        //alert(error.message);
        SweetAlert.swal("Error!", error.message, "error");
      });



    }


    $scope.saveLeadDetailsLost = function() {

      var data = new FormData();

      // console.log($scope.lead_id);
      // console.log($scope.leadDetails);
      // return;

      data.append("lead_id", $scope.lead_id);
      data.append("status", parseInt($scope.lead_status));
      data.append("reason", parseInt($scope.leadDetails.reason));
      data.append("other_reason", $scope.leadDetails.other_reason);

      var dt = new Date($scope.leadDetails.reminder_lost);
      dt.setDate(dt.getDate());
      data.append("reminder", dt.toISOString());
      
      // var work_order_file = angular.element("#work_order_partial")[0].files[0];
      // data.append("work_order",work_order_file);

      var objXhr = new XMLHttpRequest();

      //objXhr.addEventListener("progress", updateProgress, false);

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

              var res = JSON.parse(objXhr.response);
              SweetAlert.swal("Success!", res.message, "success");
              angular.element('#update_lead_details_lost').closeModal();
              // $route.reload();
              $scope.searchLeads(1);
          }

      };

      objXhr.open("POST", 'http://engine.silagroup.co.in/api/public/lead_status_lost/update', true);

      objXhr.send(data);


    };


    $scope.saveLeadDetailsPartial = function() {

      var data = new FormData();

      data.append("lead_id", $scope.lead_id);
      data.append("status", parseInt($scope.lead_status));
      data.append("contract_value", parseInt($scope.leadDetails.contract_value));

      var dt = new Date($scope.leadDetails.start_date);
      dt.setDate(dt.getDate());
      data.append("start_date", dt.toISOString());
      
      var work_order_file = angular.element("#work_order_partial")[0].files[0];
      data.append("work_order",work_order_file);

      var contract_partial_doc = angular.element("#contract_partial_doc")[0].files[0];
      data.append("contract_partial_doc",contract_partial_doc);

      var objXhr = new XMLHttpRequest();

      //objXhr.addEventListener("progress", updateProgress, false);

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

              var res = JSON.parse(objXhr.response);
              SweetAlert.swal("Success!", res.message, "success");
              angular.element('#update_lead_details_partial').closeModal();
              // $route.reload();
              $scope.searchLeads(1);
          }

      };

      objXhr.open("POST", 'http://engine.silagroup.co.in/api/public/lead_status_partial/update', true);

      objXhr.send(data);


    };

    $scope.calculateAnnualDealSize = function(deal_size) {

      if(deal_size != undefined && deal_size != '' && deal_size != null && deal_size != 0) {
        $scope.leadData.deal_size_annual = deal_size * 12;
      } else {
        $scope.leadData.deal_size_annual = 0;
      }

    };

    $scope.saveLeadDetails = function() {

      var data = new FormData();

      data.append("lead_id", $scope.lead_id);
      data.append("status", parseInt($scope.lead_status));
      data.append("contract_value", parseInt($scope.leadDetails.contract_value));

      var dt = new Date($scope.leadDetails.contract_reminder);
      dt.setDate(dt.getDate());
      data.append("contract_reminder", dt.toISOString());
      
      var work_order_file = angular.element("#work_order")[0].files[0];
      data.append("work_order",work_order_file);

      var contract_doc = angular.element("#contract_doc")[0].files[0];
      data.append("contract_doc",contract_doc);


      var objXhr = new XMLHttpRequest();

      //objXhr.addEventListener("progress", updateProgress, false);

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

              var res = JSON.parse(objXhr.response);
              SweetAlert.swal("Success!", res.message, "success");
              angular.element('#update_lead_details').closeModal();
              // $route.reload();
              $scope.searchLeads(1);

              //console.log(res);

              // if(res.status == 200) {

                  // SweetAlert.swal("Success!", res.message, "error");
                  // 

                  // $scope.subject = '';

                  // $scope.email = '';

                  // $scope.department = '';

                  // $scope.category_issue = '';

                  // $scope.issue_detail = '';


                  // alert(res.message);
                  // console.log(res);
                  // //$scope.edit_button_work = true;
                  // $scope.showTickets = true;
                  // $scope.showForm = false;
              // }


              //$scope.getAllProjectDetails();

          }

      };

      objXhr.open("POST", 'http://engine.silagroup.co.in/api/public/lead_status/update', true);

      objXhr.send(data);


    };

    function transferComplete(e) {
    }

    $scope.export_modal = function() {
      angular.element('#export_view').openModal({ dismissible: false });
    }

    $scope.exportData = function() {

      var data = {};

      data.export_type = $scope.export_type;
      data.lead_type = 'database';

      if ($scope.export_type == undefined|| $scope.export_type == null || $scope.export_type == '') {
          SweetAlert.swal("Error!", 'Please select export type', "error");
          return;
        }

      if ($scope.export_type == 2) {

        if ($scope.start_date == undefined|| $scope.start_date == null || $scope.start_date == '') {
          SweetAlert.swal("Error!", 'Please enter your start date', "error");
          return;
        }

        if ($scope.end_date == undefined|| $scope.end_date == null || $scope.end_date == '') {
          SweetAlert.swal("Error!", 'Please enter your end date', "error");
          return;
        }

        if ($scope.start_date != undefined && $scope.start_date != '') {
          data.start_date = $scope.start_date;        
        }

        if ($scope.end_date != undefined && $scope.end_date != '') {
          data.end_date = $scope.end_date;
        }
          
      }

      

      LeadService.exportLead(data).then(function(response){
        console.log(response);
        if(response != undefined && response.data != undefined) {

          var path = response.data.path;
          var filename = response.data.filename;

          var downloadLink = angular.element('<a></a>');
          downloadLink.attr('href',path);
          downloadLink.attr('download', filename);
          downloadLink[0].click();

          $scope.export_type = '';
          $scope.start_date = '';
          $scope.end_date = '';
          angular.element('#export_view').closeModal();

        }
      });

    };

    $scope.edit_lead = function(id) {

      $scope.updateLead = true;
      $scope.leadData = {};

      var spocs = {
          'LV': 'Leejohn Vaz',
          'RV': 'Rushabh Vora',
          'RK': 'Raghav Kapoor',
          'RD': 'Rahul Doshi',
          'KL': 'Kunal Lala',
          'NJ': 'Nishtha Jain',
          'KM': 'Kaivalya Mehta',
          'AM': 'Ankit Maheswari',
          'NS': 'Neermohi Shah',
          'MS': 'Milap Shah',
          'NK': 'Nishant Kumar',
          'AV': 'Ankur Vaid',
          'AS': 'Anand Sarolkar',
          'PB': 'Paresh Badhiya',
          'SB': 'Suresh Baria',
          'SS': 'Satnam Sethi',
          'NM': 'Nonita Mehta',
          'PM': 'Pratham Mehta',
          'SR': 'Subhasis Roy',
          'AH': 'Anish Hamsa',
          'KP': 'Kailash Parihar',
          'NC': 'Naveen Chandra',
          'RS': 'Regan Simon',
          'VV': 'Varun Vaz',
          'SSH': 'Sanket Sheth'
        };

        var selected_spoc = [];

        debugger;

      LeadService.getLeadDetail(id).then(function(response){

        debugger;

        var data = response.data.result;
        data.id = data._id;
        $scope.leadData.company_name = data.company_name;
        $scope.company_name = data.company_name;
        $scope.checkStatus = (data.is_assigned_lead != undefined && data.is_assigned_lead == 1 && data.is_assigned_lead == '1') ? true : false;

        // $scope.isEnableDealSize = false;

        // if(data.sales_stage == "In The Zone" || data.sales_stage == "Verbal Yes") {
        //   $scope.isEnableDealSize = true;
        // }

        debugger;
        $scope.leadData = data;
        debugger;
        //$scope.leadData.deal_size = data.c0_value;

        // if(data.cost_schedule != undefined && data.cost_schedule != null && data.cost_schedule != "") {
        //   //angular.element("#cost_schedule").val(data.cost_schedule);
        //   $scope.leadData.old_cost_schedule = data.cost_schedule;
        // }

        var spoc_list_arr = [];

        if(data.spoc != undefined && data.spoc != null && data.spoc != "" && data.spoc.length > 0) {
          spoc_list_arr = data.spoc.split("/");
        }

        debugger;

        var checkboxes = document.getElementsByName('selectedSpoc[]');
        for (var i=0, n=checkboxes.length;i<n;i++)
        {
              checkboxes[i].checked = false;
        }

        for (var i=0, n=checkboxes.length;i<n;i++)
        {
          debugger;
            // if (checkboxes[i].checked)
            // {
            //     //vals += ","+checkboxes[i].value;
            //     // console.log(checkboxes[i].value);
            //     sIds.push(checkboxes[i].value);
            //     selected_spoc.push(spocs[checkboxes[i].value]);
            // }
            if(spoc_list_arr.indexOf(checkboxes[i].value) != -1) {
              checkboxes[i].checked = true;
              selected_spoc.push(spocs[checkboxes[i].value]);
            }
        }

        debugger;

        if(selected_spoc.length > 0) {
          $scope.lead_owners = selected_spoc.join(",");
        }

        $scope.leadData.spoc = spoc_list_arr;

        debugger;

        //angular.element('#spoc_list').val(spoc_list_arr).material_select();

        angular.element('#add_lead').openModal({ dismissible: false });

        $scope.leadData.cname = $scope.company_name;

        console.log($scope.leadData);

        debugger;

      }, function(error) {
        //alert(error.message);
        SweetAlert.swal("Error!", error.message, "error");
      });

    };

    $scope.open_backdrop = function() {
      angular.element('#demoModal').openModal({ dismissible: false });
        //demoModal
    };


    $scope.getCheckedSPOCValues = function() {

      debugger;

        var spocs = {
          'DM': 'Dilip Murkute',
          'LV': 'Leejohn Vaz',
          'NS': 'Neermohi Shah',
          'RK': 'Raghav Kapoor',
          'RD': 'Rahul Doshi',
          'RV': 'Rushabh Vora',
          'SV': 'Sahil Vora',
          'SG': 'Saarang Ganpathi',
          'KL': 'Kunal Lala',
          'NJ': 'Nishtha Jain',
          'KM': 'Kaivalya Mehta',
          'AM': 'Ankit Maheswari',
          'MS': 'Milap Shah',
          'NK': 'Nishant Kumar',
          'AV': 'Ankur Vaid',
          'AS': 'Anand Sarolkar',
          'PB': 'Paresh Badhiya',
          'SB': 'Suresh Baria',
          'SS': 'Satnam Sethi',
          'NM': 'Nonita Mehta',
          'PM': 'Pratham Mehta',
          'SR': 'Subhasis Roy',
          'AH': 'Anish Hamsa',
          'KP': 'Kailash Parihar',
          'NC': 'Naveen Chandra',
          'RS': 'Regan Simon',
          'VV': 'Varun Vaz',
          'SSH': 'Sanket Sheth'
        };

        var selected_spoc = [];

        var checkboxes = document.getElementsByName('selectedSpoc[]');
        var sIds = [];

        debugger;
        //var vals = "";
        for (var i=0, n=checkboxes.length;i<n;i++)
        {
            if (checkboxes[i].checked)
            {
                //vals += ","+checkboxes[i].value;
                // console.log(checkboxes[i].value);
                sIds.push(checkboxes[i].value);
                selected_spoc.push(spocs[checkboxes[i].value]);
            }
        }


      debugger;

      if(sIds.length > 1) {
        SweetAlert.swal("Error!", 'Please select only one lead owner.', "error");
        return;
      }

      if(sIds.length > 0) {

        console.log(sIds);
        $scope.leadData.spoc = sIds;
        $scope.lead_owners = selected_spoc.join(",");

      }

      debugger;

    };

    $scope.calcWeight = function() {

      if($scope.leadData.deal_size != 0 && $scope.leadData.deal_size != "" && $scope.leadData.deal_size != undefined) {
        $scope.leadData.weighted = ((parseFloat($scope.leadData.deal_size) * parseFloat($scope.leadData.probability)) / 100);
      } else {
        $scope.leadData.weighted = 0;
      }

    };

    $scope.checkAllServices = function() {

      if(bool) {

        $scope.isCheckAll = true;
        checkFlagLabel = "all";
        bool = false;
        getAllChecked(true);

        var sIdsArr = getSelectedValues();

        if(sIdsArr.length > 0) {

          var invoiceInput = {
            lead_id: $scope.leads[$scope.leadIndex]._id,
            serviceid_arr: sIdsArr,
            send_sms: 'false',
            invoice_type: $scope.customer_invoice_type
          };

          //var lead_id = $scope.leads[$scope.leadIndex]._id;


          // var invoiceData = {};

          console.log(invoiceInput);

          var invoice_data = {
            lead_id: $scope.leads[$scope.leadIndex]._id,
            serviceid_arr: sIdsArr
          };

          // LeadService.generateInvoice(invoiceInput).then(function(response){
          //   invoiceobj = response.data.message;
          //   $scope.isNextEnabled = false;
          //   console.log(invoiceobj);
          // });

          LeadService.getInvoiceData(invoice_data).then(function(response){
            console.log(response.data); 
            invoiceobj = response.data;
            $scope.isNextEnabled = false;           
          });

        }


      } else {
        $scope.isCheckAll = false;
        checkFlagLabel = "";
        bool = true;
        getAllChecked(false);
      }

    }

    $scope.sendPaymentLink = function() {

      if($scope.leads[$scope.leadIndex].client_details.primary_contact_no != "") {

        if(invoiceobj.hasOwnProperty('payment_link') || invoiceobj.payment_link != undefined) {

          bitly.getShortUrl(invoiceobj.payment_link).then(function(data){
              console.log(data);

              var message = createSMSTemplate(data);
              console.log(message);

              SMSService.sendSMS($scope.leads[$scope.leadIndex].client_details.primary_contact_no,message).then(function(response){

                if(response.status == 200 && response.statusText == "OK") {
                  SweetAlert.swal("Sent!", "Payment link sent successfully.", "success");
                  angular.element('#view_all_services_sms').closeModal();
                }

              });

              if($scope.leads[$scope.leadIndex].client_details.primary_email_id != "" && $scope.leads[$scope.leadIndex].client_details.primary_email_id != undefined && $scope.leads[$scope.leadIndex].client_details.primary_email_id != null) {

                var emailData = {
                  'to': $scope.leads[$scope.leadIndex].client_details.primary_email_id,
                  'subject': 'Payment Link - Mr. Homecare',
                  'cc': 'customercare@mrhomecare.in',
                  'body': message
                };

                //console.log(data);

                LeadService.sendEmail(emailData).then(function(res){
                    if(res.status == 200 && res.statusText == "OK") {
                      //SweetAlert.swal("Success!", "Quotation sent to user.", "success");
                    }
                });


                var sIdsArr = getSelectedValues();

                for (var i = 0; i < sIdsArr.length; i++) {

                  var serviceUpdateVal = {
                    'payment_link_sent': 1
                  };

                  

                  if(sIdsArr[i] != undefined && sIdsArr[i] != null && sIdsArr[i] != "") {
                  
                    LeadService.updateServiceInfo(serviceUpdateVal,sIdsArr[i]).then(function(){

                    });

                  }


                };


              }

              // $http({
              //     method: 'POST',
              //     url: 'http://engine.mrhomecare.net/send_sms.php',
              //     data: $.param({ mobile: '7045118387,8291103270,9920779799', msg: message }),
              //     headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              // }).success(function(data){
              //   console.log(data);
              // });


          }, function(e){
              console.log(e);
          });        


        }

      } else {
        SweetAlert.swal("Error", "Cannot send sms. Mobile number is empty.", "error");
      }

    };

    $scope.sendQuote = function(index) {

      var service_obj_arr = [];
      var firstname = $scope.leads[index].client_details.firstname;
      var email = $scope.leads[index].client_details.primary_email_id;

      angular.forEach($scope.leads[index].service_obj,function(value,key){
        service_obj_arr.push({'service_name': $scope.services_options[value['service_id']], 'invoice_amount': value['client_payment_expected']});
      });


      var message = createQuoteTemplate(firstname,service_obj_arr);
      
      var data = {
        'to': email,
        'subject': 'Quotation - Mr. Homecare',
        'cc': '',
        'body': message
      };

      //console.log(data);

      SweetAlert.swal({
          title: "Do you really want to send quotation to client?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, send it!",
          closeOnConfirm: false
        },  function(isConfirm){

          if(isConfirm) {

            LeadService.sendEmail(data).then(function(res){
              console.log();
                if(res.status == 200 && res.statusText == "OK") {
                  SweetAlert.swal("Success!", "Quotation sent to user.", "success");
                }
            });

          }

      });


    };


    $scope.getVariantType = function(service) {

      var temp_service_variant_type = [];

      LeadService.getVariant({name: $scope.services_options[service]}).then(function(response){
          //console.log(response.data.message);

          angular.forEach(response.data.message,function(value,key){
            //variant_type_ids.push(value.varianttype);
            variant_type_ids = {
              id: value.varianttype,
              name: $scope.variant_options[value.varianttype]
            };
            temp_service_variant_type.push(variant_type_ids);
            //variant_type_ids[value.varianttype] = variant_options[value.varianttype];
          });


          $scope.service_varianttype = temp_service_variant_type;

          //console.log($scope.service_varianttype);
          angular.element('#variant_type_id').material_select();

      });

      //console.log($scope.services_options[service]);
    };

    $scope.getServicePrice = function(vt) {

      var cityVal = ($scope.client_details.defaultAddress != undefined) ? $scope.client_details.defaultAddress.city : $scope.client_details.city;

      var keyValueObj = {
        service: $scope.services_options[$scope.service_inquiry],
        variantid: parseInt(vt),
        city: cityVal
      };

      console.log(keyValueObj);

      var temp_price_data = {};

      //console.log($scope.client_details);

      LeadService.getServicePrice(keyValueObj).then(function(response){
        console.log(response);
        temp_price_data = response.data.message[0];

        $scope.pre_taxed_cost = temp_price_data.pre_taxed_cost;
        $scope.base_rate = temp_price_data.taxed_cost;
        $scope.client_payment_expected = temp_price_data.taxed_cost;
        $scope.janitor = temp_price_data.janitor_deployment;
        $scope.teamleader = temp_price_data.teamleader_deployment;
        $scope.supervisor = temp_price_data.supervisor_deployment;

        // Client wallet amount deduction logic.

        console.log($scope.client_details);


      });

      //console.log(keyValueObj);

    };

    $scope.calcNoOfService = function() {

      // console.log($scope.contract_start_date);
      // console.log($scope.contract_end_date);
      var no_of_services = 0;
      var value = 0;

      var formatted_contract_start_date = moment($scope.contract_start_date).format('D MMM YYYY');
      var formatted_contract_end_date = moment($scope.contract_end_date).format('D MMM YYYY');

      console.log(formatted_contract_start_date);
      console.log(formatted_contract_end_date);
      console.log($scope.frequency);

      value = $scope.frequency;

      if(value == 5) {

        no_of_services = moment().isoWeekdayCalc({
          rangeStart: formatted_contract_start_date,
          rangeEnd: formatted_contract_end_date,
          weekdays: [1,2,3,4,5]
        });
      //no_of_services_arr[elemid].readOnly = true;

      } else if(value == 6) {

          no_of_services = moment().isoWeekdayCalc({
            rangeStart: formatted_contract_start_date,
            rangeEnd: formatted_contract_end_date,
            weekdays: [1,2,3,4,5,6]
          });
        //no_of_services_arr[elemid].readOnly = true;

      } else if(value == 2) {

          no_of_services = moment().isoWeekdayCalc({
            rangeStart: formatted_contract_start_date,
            rangeEnd: formatted_contract_end_date,
            weekdays: [6,7]
          });
        //no_of_services_arr[elemid].readOnly = true;

      } else if(value == 1) {

          no_of_services = moment().isoWeekdayCalc({
            rangeStart: formatted_contract_start_date,
            rangeEnd: formatted_contract_end_date,
            weekdays: [1,2,3,4,5,6,7]
          });
        //no_of_services_arr[elemid].readOnly = true;

      } else if(value == 7) {

        no_of_services = moment(formatted_contract_end_date).diff(formatted_contract_start_date, 'weeks');
        //no_of_services_arr[elemid].readOnly = true;

      } else if(value == 15) {

        no_of_services = Math.floor((moment(formatted_contract_end_date).diff(formatted_contract_start_date, 'days'))/value);
        //no_of_services_arr[elemid].readOnly = true;

      } else if(value == 30) {

        no_of_services = Math.floor(moment(formatted_contract_end_date).diff(formatted_contract_start_date, 'months')) + 1;
        //no_of_services_arr[elemid].readOnly = true;

      } else if(value == 90) {

        no_of_services = Math.floor((moment(formatted_contract_end_date).diff(formatted_contract_start_date, 'days'))/value);
        //no_of_services_arr[elemid].readOnly = true;

      }

      $scope.no_of_service = no_of_services;

      console.log(no_of_services);

    };

    // loadMore();


    // $scope.nextPage = function() {

    //     loadMore();

    // };


    // function loadMore() {

    //   offset = limit * page;

    //   var paginationSettings = {
    //     limit: limit,
    //     offset: offset
    //   };
    //   //console.log(paginationSettings);
    //   var data = {
    //     searchVal: filterSearchArr,
    //     paginationSettings: paginationSettings
    //   };


    //   LeadService.filterLeads(data).then(function(response){

    //     console.log(response);
    //       $scope.loading = false;

    //     if(response.data.message.length > 0) {

    //       $scope.loading = false;

    //       var leadData = response.data.message;

    //       for (var i = 0; i < leadData.length; i++) {
    //         $scope.leads.push(leadData[i]);
    //       }

    //       $scope.hasMoreData = false;

    //     } else {

    //       $scope.hasMoreData = false;

    //     }
        
    //   });

    //   page++;


    // }

    if($route.current != undefined) {



      if($route.current.action == 'edit') {




          $scope.isUpdateLead = true;

          //console.log($scope.leadId);
          var keyValueObj = {
            '_id': $scope.leadId
          };

          page = 0;

          if(offset == 0) {
            offset = limit * page;
          }

          var paginationSettings = {
            limit: limit,
            offset: offset
          };

          var data = {
            searchVal: keyValueObj,
            paginationSettings: paginationSettings
          };

          debugger;

          LeadService.getLeads(data).then(function(response){

            debugger;

            console.log(response.data.message[0]);
            $scope.leadDetails = response.data.message[0];
            $scope.client_details = $scope.leadDetails.client_details;

            console.log("---------------------------------" + $scope.client_details.rating);

            if($scope.client_details.rating != 0 && $scope.client_details.rating != "" && $scope.client_details.rating != undefined) {
              $scope.client_rating = $scope.client_details.rating;
            }

            console.log($scope.client_rating);

            $scope.client_details.city = $scope.client_details.city != undefined ? $scope.client_details.city : $scope.leadDetails.city;
            $scope.invoice_mode = $scope.leadDetails.invoice_mode;
            $scope.customer_label = $scope.leadDetails.customer_label;
            $scope.customerId = $scope.leadDetails.customer_id;
            $scope.invoice_type = $scope.leadDetails.invoice_type;
            $scope.cust_type = $scope.leadDetails.client_type;
            $scope.lead_owner = $scope.leadDetails.leadowner;
            $scope.lead_source = $scope.leadDetails.leadsource;
            $scope.reminder = $scope.leadDetails.reminder;
            $scope.service_details_arr = $scope.leadDetails.service_obj;

            $scope.wallet_balance = parseInt($scope.client_details.total_amount) - parseInt($scope.client_details.used_amount)
            $scope.used_amount = parseInt($scope.client_details.used_amount);

            $scope.billing_name = $scope.leadDetails.billing_name;
            $scope.billing_email = $scope.leadDetails.client_details.primary_email_id;
            $scope.billing_address = $scope.leadDetails.billing_address;

            if(($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) && $scope.leadDetails.service_obj[0].discount != 0 && $scope.leadDetails.service_obj[0].discount != "") {
              $scope.base_rate = $scope.leadDetails.service_obj[0].taxed_cost;
            } else {
              $scope.base_rate = 0;
            }
            if(($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) && $scope.leadDetails.service_obj[0].pre_taxed_cost != 0) {
              $scope.pre_taxed_cost = $scope.leadDetails.service_obj[0].pre_taxed_cost;
            }

            if(($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) && $scope.leadDetails.service_obj[0].partner_payment_payable > 0) {
              $scope.partner_comission = $scope.leadDetails.service_obj[0].partner_payment_payable;
            } else if(($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) && $scope.leadDetails.service_obj[0].partner_payment_recievable > 0) {
              $scope.partner_comission = $scope.leadDetails.service_obj[0].partner_payment_payable * -1;
            } else {
              $scope.partner_comission = 0;
            }
            $scope.discount =  ($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) ? $scope.leadDetails.service_obj[0].discount : 0;
            $scope.client_payment_expected = ($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) ? $scope.leadDetails.service_obj[0].client_payment_expected : 0;

            if($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) {

            angular.forEach($scope.leadDetails.service_obj[0].lead_history, function(value,key){
              if(value.lead_stage == 17) {
                $scope.isServiceClosed = true;
              }
            });

            }

            $scope.lead_history_obj = ($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) ? $scope.leadDetails.service_obj[0].lead_history : [];
            selected_service_id = ($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) ? $scope.leadDetails.service_obj[0]._id : '';
            selected_service_obj = ($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) ? $scope.leadDetails.service_obj[0] : {};

            if($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) {

            angular.forEach($scope.leadDetails.service_obj, function(value,key){
              old_service_id_arr.push(value._id);
            });

            }

            //console.log(keyValueServiceObj);
            if(($scope.leadDetails.service_obj != undefined && $scope.leadDetails.service_obj.length > 0) &&  $scope.leadDetails.service_obj[0].service_address != undefined) {

              var keyValueServiceObj = {
                '_id': $scope.leadDetails.service_obj[0].service_address
              };

              LeadService.getServiceAddress(keyValueServiceObj).then(function(resp){
                console.log(resp);
                //console.log(old_service_id_arr);
                $scope.client_details.defaultAddress = resp.data.message[0];
                $scope.client_details.city = $scope.client_details.city != undefined ? $scope.client_details.city : $scope.client_details.defaultAddress.city;
              });

            }

            var client_data = {};
            client_data = { id: $scope.client_details._id };

            LeadService.getClientPromocode(client_data).then(function(response){

              console.log(response.data.data);

              if(response.data != undefined && response.data != null && response.data.data != undefined && response.data.data != null) {
                $scope.promocode = response.data.data.promocode;
                $scope.referrals = response.data.data.referrals;
              }

              debugger;


            });

            ClientService.getAllClients({'_id': $scope.client_details._id, 'status': 0}).then(function(client){
              //$scope.clients = client.data.message;
              debugger;
              angular.forEach(client.data.message[0].address_details,function(value,key){
                  client_all_address[value._id] = value;
              });

              $scope.client_details.alternate_contact_no = client.data.message[0].alternate_contact_no;

          if($scope.client_details.hasOwnProperty('primary_contact_no') && $scope.client_details.primary_contact_no != "") {
            $scope.contacts.push($scope.client_details.primary_contact_no);
          }


          if($scope.client_details.hasOwnProperty('alternate_contact_no')) {
            if($scope.client_details.alternate_contact_no.length > 0 ) {

              angular.forEach($scope.client_details.alternate_contact_no,function(value,key){
                $scope.contacts.push(value);
              });

            }
          }

          var my_client_details = client.data.message[0];
          //$scope.client_details.alternate_email_id = client.data.message[0].alternate_email_id;
          if(my_client_details.hasOwnProperty('primary_email_id') && my_client_details.primary_email_id.length > 0) {
            console.log("not blank 1");
            $scope.emails.push(my_client_details.primary_email_id);
          }
          if($scope.client_details.hasOwnProperty('alternate_email_id')) {
            console.log("not property 2");
            if(my_client_details.alternate_email_id.length > 0 ) {
              console.log("not empty 3");
              angular.forEach(my_client_details.alternate_email_id,function(value,key){
                $scope.emails.push(value);
              });

            }
          }

          $scope.city = my_client_details.city;

              //console.log(client_all_address);
            //$scope.client_details.city = leadCity;


            });

          });

      } else if($route.current.action == 'add') {

        if($rootScope.client_details == undefined || $rootScope.client_details == null) {
          $scope.client_details = JSON.parse($window.localStorage.getItem("client_details"));
        } else {
          $scope.client_details = $rootScope.client_details;
        }

        console.log($scope.client_details);



        if($scope.client_details != undefined) {
          $scope.billing_name = $scope.client_details.firstname + ' ' + $scope.client_details.lastname;
          $scope.billing_email = $scope.client_details.primary_email_id;
          //$scope.billing_address = $scope.client_details.defaultAddress.address + ', ' + $scope.client_details.defaultAddress.landmark + ', ' + $scope.cities[$scope.client_details.defaultAddress.city];
          leadCity = $scope.client_details.city == undefined ? (($scope.client_details.address_details == undefined) ? 1 : $scope.client_details.address_details[0].city) : $scope.client_details.city;
          $scope.customerId = 'C' + ($scope.client_details.firstname == undefined ? '' : $scope.client_details.firstname[0]) + ($scope.client_details.lastname == undefined ? '' : $scope.client_details.lastname[0]) + getRandomFromRange(111111,999999) + moment().format('YY');
        }

        ClientService.getAllClients({'_id': $scope.client_details._id, 'status': 0}).then(function(client){
          //$scope.clients = client.data.message;
          angular.forEach(client.data.message[0].address_details,function(value,key){
              client_all_address[value._id] = value;
          });

          $scope.client_details.alternate_contact_no = client.data.message[0].alternate_contact_no;

          if($scope.client_details.hasOwnProperty('primary_contact_no') && $scope.client_details.primary_contact_no != "") {
            $scope.contacts.push($scope.client_details.primary_contact_no);
          }


          if($scope.client_details.hasOwnProperty('alternate_contact_no')) {
            if($scope.client_details.alternate_contact_no.length > 0 ) {

              angular.forEach($scope.client_details.alternate_contact_no,function(value,key){
                $scope.contacts.push(value);
              });

            }
          }

          $scope.client_details = client.data.message[0];
          $scope.billing_name = $scope.client_details.firstname + ' ' + $scope.client_details.lastname;
          //$scope.client_details.alternate_email_id = client.data.message[0].alternate_email_id;
          if($scope.client_details.hasOwnProperty('primary_email_id') && $scope.client_details.primary_email_id.length > 0) {
            console.log("not blank 1");
            $scope.emails.push($scope.client_details.primary_email_id);
          }
          if($scope.client_details.hasOwnProperty('alternate_email_id')) {
            console.log("not property 2");
            if($scope.client_details.alternate_email_id.length > 0 ) {
              console.log("not empty 3");
              angular.forEach($scope.client_details.alternate_email_id,function(value,key){
                $scope.emails.push(value);
              });

            }
          };


          console.log(leadCity);

          $scope.client_details.city = leadCity;
          $scope.city = leadCity;

          if($scope.client_details.city != undefined && $scope.client_details.city != null && $scope.client_details.city != "" && $scope.client_details.city != 0) {
            $scope.city_val = $scope.client_details.city;
          } else {
            $scope.city_val = 0;
          }


          //console.log(client_all_address);

        });

        console.log($scope.client_details);


        console.log($scope.contacts);
        console.log($scope.emails);

      } else if($route.current.action == 'all') {
        angular.element('.button-collapse').sideNav('hide');

            // InspectionService.getInspections({status: 0}).then(function(response) {
            //   $scope.open_inspection_count = response.data.message.length;
            // });

            // InspectionService.getInspections({status: 1}).then(function(response) {
            //   $scope.closed_inspection_count = response.data.message.length;
            // });


      }

    }

    $scope.sendOnGoingMsg = function(index) {

      var email = $scope.leads[index].client_details.primary_email_id;
      var mobile_no = $scope.leads[index].client_details.primary_contact_no;
      var firstname = $scope.leads[index].client_details.firstname;
      var lead_id = $scope.leads[index]['_id'];

      var message = createOngoingEmailTemplate(firstname,lead_id);
      var sms_message = createOngoingSMSTemplate(firstname);

      var data = {
        'to': email,
        'subject': 'Ongoing Feedback',
        'cc': '',
        'body': message
      };

      //console.log(data);

      SweetAlert.swal({
          title: "Do you really want to send ongoing mail to client?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, send it!",
          closeOnConfirm: false
        },  function(isConfirm){

          if(isConfirm) {

            LeadService.sendEmail(data).then(function(res){
              SMSService.sendSMS(mobile_no,sms_message).then(function(response){
                console.log(response);
                if(response.status == 200 && response.statusText == "OK") {
                  SweetAlert.swal("Success!", "Email and SMS send to user.", "success");
                }
              });
            });

          }

    }); 



    };

    // $scope.$watch('open_inspection_count',function(newValue,oldValue){
    //   $scope.open_inspection_count = newValue;
    //   console.log(newValue);
    // });

    // $scope.$watch('closed_inspection_count',function(newValue,oldValue){
    //   $scope.closed_inspection_count = newValue;
    //   console.log(newValue);
    // });

    // $scope.setClient = function(client_id) {
    //   selected_client_id = client_id;
    // }

    $scope.setPhoneNo = function(value) {
      console.log(value);
      $scope.client_details.primary_contact_no = value;
    };



    $scope.setEmail = function(value) {
      console.log(value);
      var old_primary_email_id ='';
      var alternate_email_id = $scope.client_details.alternate_email_id;

      if ($scope.client_details.hasOwnProperty('primary_email_id') && $scope.client_details.primary_email_id != "" ) {
         old_primary_email_id = $scope.client_details.primary_email_id;
         alternate_email_id.push(old_primary_email_id);
          var index = alternate_email_id.indexOf(value);
          alternate_email_id.splice(index, 1);
      };


      if(old_primary_email_id!= "") {
        var updateVal = {
          primary_email_id: value,
          alternate_email_id: alternate_email_id
        }

        ClientService.updateClientInfo(updateVal,selected_client_id).then(function(response){

             $scope.client_details.primary_email_id = value;


        });


      }

    };

    $scope.editEmail = function(value,index) {
      $scope.email_id = value;
      $scope.emailIndex = index;
      $scope.isEmailEdit = true;
    };

    $scope.editMobile = function(value,index) {
      $scope.mobile_no = value;
      $scope.contactIndex = index;
      $scope.isEditMobile = true;
    };



    $scope.editEmailId = function() {

      var e_index = $scope.emailIndex;

      if(e_index == 0) {

        var updateEmail = {
          'primary_email_id': $scope.email_id
        };

      } else {

        var alternate_email_id = $scope.client_details.alternate_email_id;
        alternate_email_id[e_index-1] = $scope.email_id;

        var updateEmail = {
          'alternate_email_id': alternate_email_id
        };

      }


        ClientService.updateClientInfo(updateEmail,selected_client_id).then(function(response){


           $scope.emails = [];
           $scope.isEmailEdit = false;

           ClientService.getAllClients({'_id': $scope.client_details._id, 'status': 0}).then(function(client){

            console.log(client);

            $scope.client_details.firstname = client.data.message[0].firstname;
            $scope.client_details.lastname = client.data.message[0].lastname;
            $scope.client_details.primary_contact_no = client.data.message[0].primary_contact_no;
            $scope.client_details.primary_email_id = client.data.message[0].primary_email_id;

            if($scope.client_details.hasOwnProperty('primary_email_id') && $scope.client_details.primary_email_id != "") {
              $scope.emails.push($scope.client_details.primary_email_id);
            }
            if($scope.client_details.hasOwnProperty('alternate_email_id')) {
              if($scope.client_details.alternate_email_id.length > 0 ) {

                angular.forEach($scope.client_details.alternate_email_id,function(value,key){
                  $scope.emails.push(value);
                });

                $scope.email_id = "";

              }
            }

          });

        });        




    }

        $scope.editMobileNumber = function() {

      var c_index = $scope.contactIndex;

      if(c_index == 0) {

        var updateContact = {
          'primary_contact_no': $scope.mobile_no
        };

      } else {

        var alternate_contact_no = $scope.client_details.alternate_contact_no;
        alternate_contact_no[c_index-1] = $scope.mobile_no;

        var updateContact = {
          'alternate_contact_no': alternate_contact_no
        };

      }


        ClientService.updateClientInfo(updateContact,selected_client_id).then(function(response){

         $scope.contacts = [];

         ClientService.getAllClients({'_id': $scope.client_details._id, 'status': 0}).then(function(client){
          //$scope.clients = client.data.message;

          $scope.client_details.alternate_contact_no = client.data.message[0].alternate_contact_no;

          if($scope.client_details.hasOwnProperty('primary_contact_no')) {
            $scope.contacts.push($scope.client_details.primary_contact_no);
          }

          if($scope.client_details.hasOwnProperty('alternate_contact_no')) {
            if($scope.client_details.alternate_contact_no.length > 0 ) {

              angular.forEach($scope.client_details.alternate_contact_no,function(value,key){
                $scope.contacts.push(value);
              });

            }
          }

          //console.log(client_all_address);

        });



        });        




    }



    $scope.updateClientRating = function() {

      var updateVal = {
        rating: $scope.client_rating,
      }

      ClientService.updateClientInfo(updateVal,selected_client_id).then(function(response){
           if(response.data.message.ok == 1) {
            angular.element('#rate_customer_modal').closeModal();
            SweetAlert.swal("Success", "Client has been rated.", "success");
           }
      });

    }

    $scope.addMobileNumber = function() {

      console.log("Hiiii");
      console.log($scope.client_details.alternate_contact_no);

      var alternate_contact_no = $scope.client_details.alternate_contact_no;
      alternate_contact_no.push($scope.mobile_no);

      var updateVal = {
        alternate_contact_no: alternate_contact_no
      }

      ClientService.updateClientInfo(updateVal,selected_client_id).then(function(response){

          $scope.contacts = [];

         ClientService.getAllClients({'_id': $scope.client_details._id, 'status': 0}).then(function(client){
          //$scope.clients = client.data.message;

          $scope.client_details.alternate_contact_no = client.data.message[0].alternate_contact_no;

          if($scope.client_details.hasOwnProperty('primary_contact_no')) {
            $scope.contacts.push($scope.client_details.primary_contact_no);
          }

          if($scope.client_details.hasOwnProperty('alternate_contact_no')) {
            if($scope.client_details.alternate_contact_no.length > 0 ) {

              angular.forEach($scope.client_details.alternate_contact_no,function(value,key){
                $scope.contacts.push(value);
              });

            }
          }

          //console.log(client_all_address);

        });


      });

    }

    $scope.addEmailId = function() {

      console.log("Hiiii");
      console.log($scope.client_details.alternate_email_id);

      var alternate_email_id = [];

      if($scope.client_details != undefined && $scope.client_details != null && $scope.client_details.alternate_email_id != undefined && $scope.client_details.alternate_email_id != null && $scope.client_details.alternate_email_id.length > 0) {
        alternate_email_id = $scope.client_details.alternate_email_id;
      }
      
      if($scope.email_id != undefined && $scope.email_id != null && $scope.email_id != "") {
        alternate_email_id.push($scope.email_id);
      }

      if($scope.client_details != undefined && $scope.client_details != null && $scope.client_details.primary_email_id != undefined && $scope.client_details.primary_email_id != null && $scope.client_details.primary_email_id != "") {
        var updateVal = {
          alternate_email_id: alternate_email_id
        }
      } else {
        var updateVal = {
          primary_email_id: $scope.email_id
        }
      }

      //console.log(updateVal);
      debugger;

      ClientService.updateClientInfo(updateVal,selected_client_id).then(function(response){

          $scope.emails = [];
          $scope.isEmailEdit = false;

          debugger;

         ClientService.getAllClients({'_id': $scope.client_details._id, 'status': 0}).then(function(client){

          console.log(client);
          debugger;

          $scope.client_details.firstname = client.data.message[0].firstname;
          $scope.client_details.lastname = client.data.message[0].lastname;
          $scope.client_details.primary_contact_no = client.data.message[0].primary_contact_no;
          $scope.client_details.primary_email_id = client.data.message[0].primary_email_id;

          if(client.data.message[0].hasOwnProperty('alternate_email_id') && client.data.message[0].alternate_email_id.length > 0) {
            $scope.client_details.alternate_email_id = client.data.message[0].alternate_email_id;
          }

          debugger;

          if($scope.client_details.hasOwnProperty('primary_email_id') && $scope.client_details.primary_email_id != "") {
            $scope.emails.push($scope.client_details.primary_email_id);

            $scope.email_id = "";

          }

          debugger;

          if($scope.client_details.hasOwnProperty('alternate_email_id')) {
            if($scope.client_details.alternate_email_id.length > 0 ) {

              debugger;

              angular.forEach($scope.client_details.alternate_email_id,function(value,key){
                $scope.emails.push(value);
              });

              $scope.email_id = "";

            }
          }

          debugger;

        });


      });


    }


    $scope.loadAddress = function(id){
      //console.log(id);

      var keyValueObj = {};
      keyValueObj._id = id;

      ClientService.getAllClients(keyValueObj).then(function(client){
        //$scope.clients = client.data.message;
        $scope.client_details.address_details = client.data.message[0].address_details;
      });


    };


    $scope.showLeadHistory = function(service){
    	$scope.service_lead_stage = {};
    	$scope.service_lead_stage = service;
    	console.log(service);
    };


    $scope.lead_stage_color = {
    	'Hot': 'red',
    	'Closed': 'green',
      'Cold': 'orange',
      'Closed Already': 'brown',
      'Followup1': 'black',
      'Followup2': 'blue',
      'Followup3': 'grey',
      'Warm': 'yellow',
      'Rescheduled': 'purple',
      'Cancelled Order': 'pink'
    };



    $scope.doIfChecked = function(status) {
          $scope.is_amc = status;
    };

    $scope.promocodeDiscountStatus = function(status) {
      $scope.isPromoDiscount = status;
      console.log(status);
      if(status == true) {

        if($scope.base_rate != undefined && $scope.base_rate != null && $scope.base_rate != "") {

          var amount_deduct = $scope.base_rate / 2;
          var total_amount = 0;

          if($scope.client_details != undefined && $scope.client_details != null && $scope.client_details.total_amount != undefined && $scope.client_details.total_amount != null) {
            total_amount = $scope.client_details.total_amount;

            if($scope.client_details.used_amount != undefined && $scope.client_details.used_amount != null) {
              total_amount = total_amount - $scope.client_details.used_amount;
            }

            if(total_amount != 0) {

              $scope.isPromoDiscount = true;

              if(total_amount < amount_deduct) {
                $scope.discount = total_amount;
              } else {
                $scope.discount = amount_deduct;
              }

            } else {

              $scope.isPromoDiscount = false;
              $scope.discount = 0;

            }

          } else {

            $scope.isPromoDiscount = false;
            $scope.discount = 0;

          }

        } else {

          $scope.isPromoDiscount = false;
          $scope.discount = 0;

        }


      } else {

        $scope.isPromoDiscount = status;
        $scope.discount = 0;

      }
    };

    var idx =0;
    $scope.saveService = function() {

      if($scope.city_val == undefined || $scope.city_val == null || $scope.city_val == "" || $scope.city_val == 0) {
        SweetAlert.swal("Error", "City cannot be empty", "error");
        return;
      }

      if($scope.lead_source == undefined || $scope.lead_source == null || $scope.lead_source == "") {
        SweetAlert.swal("Error", "Select Leadsource", "error");
        return;
      }

      console.log($scope.lead_stage);
      console.log($scope.client_details);
      console.log($scope.service_date);

      var service_id = parseInt($scope.service_inquiry);
      var service_category = parseInt(service_categories_options[$scope.services_options[service_id]]);

      if($scope.lead_stage == 17 && $scope.is_amc==false && ($scope.client_details.hasOwnProperty('defaultAddress')==false || ($scope.service_date == undefined || $scope.service_date==''))) {

        SweetAlert.swal("Error", "Service Address or Service Date is empty", "error");

      } else {





        // debugger;

    		//console.log(temp_service_details);
        // $scope.service_details = temp_service_details;

        var capacity_city = 0;

        if($scope.client_details.defaultAddress != undefined) {
          capacity_city = checkNullOrEmpty($scope.client_details.defaultAddress.city);
        } else {
          capacity_city = 0;
        }

        debugger;
        getCapacity($scope.service_date,capacity_city,function(rm){
          console.log(rm);

          debugger;

          var t_manpower = rm['rem'] + parseInt($scope.teamleader) + parseInt($scope.supervisor) + parseInt($scope.janitor);

          debugger;
          
          if(t_manpower > rm['total'] && rm['total'] != 0 && $scope.lead_stage == 17 && (service_category != 11 && service_category != 6 && service_category != 7 && service_category != 10)) {
            
            SweetAlert.swal("Error", "There is not enough manpower to add this service. Please contact operations.", "error");
            return;

          } else {

        $scope.isServiceAdded = true;

        //console.log($scope.client_details);
        if ($scope.service_details_arr.length >0) {
            temp_service_details_arr = $scope.service_details_arr;
        }

        $scope.lead_details = {
          'lead_stage': parseInt($scope.lead_stage),
          'lead_remark': $scope.lead_stage_remark,
          'updated_by': $scope.currentUser.name,
          'updated_on': new Date()
        };

        //console.log($scope.lead_details);

        $scope.comm_remarks = {
          'remark': $scope.additional_notes,
          'added_by': $scope.currentUser.name
        };

        $scope.lead_history.push($scope.lead_details);
        $scope.lead_history_obj = $scope.lead_history;

        if($scope.additional_notes != "" && $scope.additional_notes != undefined) {
         $scope.crm_remark.push($scope.comm_remarks);
        }
      // debugger;
        if($scope.is_amc == true) {
          
          console.log($scope.contract_start_date);
          console.log($scope.contract_end_date);

          temp_service_details.contract_start_date = $scope.contract_start_date;
          temp_service_details.contract_end_date = $scope.contract_end_date;
          temp_service_details.frequency = parseInt($scope.frequency);
          temp_service_details.no_of_service = parseInt($scope.no_of_service);

          var dt1 = new Date($scope.contract_start_date + ' ' + $scope.service_time);
          $scope.service_time_arr.push(dt1.toISOString());

          temp_service_details.service_time = $scope.service_time_arr;


          // $scope.service_time_arr = [];
          $scope.service_date_arr = [];

        } else {

            if(($scope.service_date != "" && $scope.service_date != undefined) && ($scope.service_time != "" && $scope.service_time != undefined)) {

              for (var i = 0; i < $scope.duration; i++) {

                var dt = new Date($scope.service_date);
                dt.setDate(dt.getDate() + i);
                $scope.service_date_arr.push(dt.toISOString());

                var dt1 = new Date($scope.service_date + ' ' + $scope.service_time);
                dt1.setDate(dt1.getDate() + i);
                $scope.service_time_arr.push(dt1.toISOString());

              };

            }

          // if(($scope.service_date != "" && $scope.service_date != undefined) && ($scope.service_time != "" && $scope.service_time != undefined)) {
          //   $scope.service_time_arr.push(new Date($scope.service_date + ' ' + $scope.service_time).toISOString());
          //   $scope.service_date_arr.push(new Date($scope.service_date).toISOString());
          // }
        }

        if($scope.client_details.hasOwnProperty('defaultAddress') && $scope.client_details.defaultAddress != undefined) {
          temp_service_details.service_address =  $scope.client_details.defaultAddress._id;
          temp_service_details.address = $scope.client_details.defaultAddress.address;
          temp_service_details.city = $scope.client_details.defaultAddress.city;
        }

        temp_service_details.service_id = parseInt($scope.service_inquiry);
        temp_service_details.variant_type_id = parseInt($scope.variant_type);
        temp_service_details.variant_type_name = $scope.variant_options[parseInt($scope.variant_type)];
        temp_service_details.additional_variant = $scope.additional_variant;
        temp_service_details.is_amc = $scope.is_amc == true ? 1 : 0;
        temp_service_details.duration_of_service = $scope.duration;
        temp_service_details.no_of_team_leader = parseInt($scope.teamleader);
        temp_service_details.no_of_supervisor = parseInt($scope.supervisor);
        temp_service_details.no_of_janitor = parseInt($scope.janitor);
        
        var team_leader_arr = [];
        var supervisor_arr = [];
        var janitor_arr = [];

        if($scope.duration > 1) {

          for (var i = 0; i < $scope.duration; i++) {
            
            team_leader_arr.push(parseInt($scope.teamleader));
            supervisor_arr.push(parseInt($scope.supervisor));
            janitor_arr.push(parseInt($scope.janitor));

          };


          temp_service_details.team_leader = team_leader_arr;
          temp_service_details.supervisor = supervisor_arr;
          temp_service_details.janitor = janitor_arr;

        }

        temp_service_details.invoice_sent = 0;
        temp_service_details.service_rating = 0;
        temp_service_details.crm_rating = 0;
        temp_service_details.service_status = 0;
        temp_service_details.is_order = 0;
        temp_service_details.service_tax = (parseFloat($scope.pre_taxed_cost) * parseInt($scope.taxes_options[0].value))/100;
        temp_service_details.kk_tax = (parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[2].value))/100;
        temp_service_details.cess_tax = (parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[1].value))/100;
        //if($scope.currentUser.email == 'tanveer.khan@mrhomecare.in') {
          temp_service_details.gst_tax = (parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[5].value))/100;
          temp_service_details.cgst_tax = (parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[3].value))/100;
          temp_service_details.sgst_tax = (parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[4].value))/100;
        //}
        temp_service_details.created_by = 0;
        temp_service_details.updated_by = 0;
        temp_service_details.status = 0;
        temp_service_details.partner_payment_recievable = $scope.partner_comission < 0 ? $scope.partner_comission : 0;
        temp_service_details.partner_payment_payable = $scope.partner_comission > 0 ? $scope.partner_comission : 0;
        temp_service_details.client_payment_expected = parseInt($scope.client_payment_expected);
        temp_service_details.taxed_cost = parseInt($scope.post_taxed_cost);
        temp_service_details.pre_taxed_cost =  $scope.pre_taxed_cost;
        temp_service_details.crm_remark = $scope.crm_remark;
        temp_service_details.service_time = $scope.service_time_arr;
        temp_service_details.service_date = $scope.service_date_arr;
        temp_service_details.lead_history = $scope.lead_history;
        temp_service_details.discount = $scope.discount;
        temp_service_details.partner_id = $scope.partner_id;
        temp_service_details.leadsource = $scope.lead_source;
        temp_service_details.client_type = $scope.cust_type;
        temp_service_details.service_category_id = parseInt(service_categories_options[$scope.services_options[service_id]]);
        temp_service_details.promo_code = $scope.promo_code;

        var order_lead_obj = {};

        order_lead_obj = {
          leadsource: parseInt($scope.lead_source),
          leadowner: $scope.lead_owner,
          billing_name: $scope.billing_name,
          billing_address: $scope.billing_address
        };

        var order_service_obj = {};
        order_service_obj = {
          service_id: parseInt($scope.service_inquiry),
          service_date: ($scope.is_amc == true) ? [$scope.contract_start_date] : $scope.service_date_arr,
          taxed_cost: parseInt($scope.post_taxed_cost),
          variant_type_id: parseInt($scope.variant_type) 
        };

        temp_service_details.service_obj = order_service_obj;
        temp_service_details.leadmanager_obj = order_lead_obj;
        
        var full_name = "";
        if($scope.client_details.firstname != undefined && $scope.client_details.firstname != null && $scope.client_details.firstname != "") {
          full_name = $scope.client_details.firstname;
        }

        if($scope.client_details.lastname != undefined && $scope.client_details.lastname != null && $scope.client_details.lastname != "") {
          full_name += ' ' + $scope.client_details.lastname;
        }
        
        temp_service_details.firstname =  full_name;
        temp_service_details.primary_contact_no = $scope.client_details.primary_contact_no;
        temp_service_details.primary_email_id = $scope.client_details.primary_email_id;

          debugger;

          if($scope.client_details != undefined && $scope.client_details != null && $scope.isPromoDiscount == true) {
            var used_amount = 0;
            if($scope.client_details.used_amount != undefined && $scope.client_details.used_amount != null) {
              used_amount = $scope.client_details.used_amount;
            }

            debugger;

            if($scope.discount != undefined && $scope.discount != null && $scope.discount != "" && $scope.discount != 0) {

              used_amount = used_amount + $scope.discount;

              var updateVal = {
                used_amount: used_amount
              };

              debugger;

              ClientService.updateClientInfo(updateVal,$scope.client_details._id).then(function(response){
                $scope.client_details.used_amount = used_amount;
                debugger;
              });

            }

          }



            temp_service_details_arr.push(temp_service_details);
            new_service_details_arr.push(temp_service_details);
            update_service_details_arr.push(temp_service_details);
            // temp_service_details_arr[idx] = temp_service_details;
            // idx++;
            // debugger;
            $scope.service_details_arr = temp_service_details_arr;
            // $scope.$apply();

            console.log($scope.service_details_arr);




            angular.element('select').material_select();
            angular.element('#add_service').closeModal();
            resetAddLeadForm();
            // resetAddLeadForm ();


            function resetAddLeadForm (){
                      console.log("I am in resetAddLeadForm");
                      temp_service_details= {};
                      $scope.lead_details = {};
                      $scope.comm_remarks = {};
                      $scope.lead_history = [];
                      $scope.crm_remark = [];
                      $scope.service_inquiry = "";
                      $scope.variant_type = "";
                      $scope.additional_variant = "";
                      $scope.is_amc = false;
                      $scope.duration = 1;
                      $scope.teamleader = 0;
                      $scope.supervisor = 0;
                      $scope.janitor = 0;
                      $scope.partner_comission = 0;
                      $scope.client_payment_expected = 0;
                      $scope.base_rate = 0;
                      $scope.pre_taxed_cost = 0;
                      $scope.post_taxed_cost = 0;
                      $scope.service_time_arr = [];
                      $scope.service_date_arr = [];
                      $scope.lead_stage = "";
                      $scope.lead_stage_remark = "";
                      $scope.service_inquiry = "";
                      $scope.variant_type = "";
                      $scope.service_date = "";
                      $scope.service_time = "";
                      $scope.additional_notes = "";
                      $scope.discount = 0;



                            // LeadService.addService($scope.service_details).then(function(response){
                            //  console.log(response);
                            // });


                }



          }




        });



		//console.log($scope.service_details);

    	// $scope.service_details = {};

    	// $scope.service_address = {
     //      "address" : $scope.address,
     //      "landmark" : $scope.landmark,
     //      "city" : $scope.city,
     //      "is_primary" : true,
     //      "status" : 0
     //    }

     //    $scope.service_details.service_address = $scope.service_address


    	// if($scope.is_amc == true) {

    	// }

      }

    };

    $scope.saveLead = function() {

    	$scope.lead_details_obj = {
        firstname: $scope.client_details.firstname,
        primary_contact_no: $scope.client_details.primary_contact_no,
        primary_email_id: $scope.client_details.primary_email_id,
    		client_details: $scope.client_details._id,
    		reminder: $scope.reminder,
    		leadsource: parseInt($scope.lead_source),
    		leadowner: $scope.lead_owner,
    		billing_name: $scope.billing_name,
    		billing_email: $scope.billing_email,
    		billing_address: $scope.billing_address,
    		invoice_mode: $scope.invoice_mode,
        customer_label: $scope.customer_label,
    		invoice_type: $scope.invoice_type,
        customer_id: $scope.customerId,
        client_type: $scope.cust_type
    	};

      if($scope.client_details.hasOwnProperty('defaultAddress') && $scope.client_details.defaultAddress != undefined) {
        $scope.lead_details_obj.city = $scope.client_details.defaultAddress.city;
        $scope.lead_details_obj.address = $scope.client_details.defaultAddress.address;
      }


    	$scope.leadData = {
    		leadObj: $scope.lead_details_obj,
    		serviceObjArr: $scope.service_details_arr
    	};

        LeadService.saveLead($scope.leadData).then(function(response){

            $location.path('/leads');
        });

    	//console.log($scope.lead_details_obj);
    };

    $scope.createInspection = function(inspection_obj_arr) {
      if(inspection_obj_arr.length > 0) {
        InspectionService.addInspections(inspection_obj_arr).then(function(response){

        });
      }
    };

    $scope.updateLead = function() {

      $scope.leadUpdateData = {
        leadid: $scope.leadId,
        serviceObjArr: update_service_details_arr,
        service_id_arr: old_service_id_arr,
        service_obj_arr: $scope.leadDetails.service_obj,
        client_id: $scope.client_details._id
      };

      console.log($scope.leadUpdateData);

      LeadService.updateLead($scope.leadUpdateData).then(function(response){
          console.log(response);
          if(response.data.message.ok == 1) {
            angular.element('#update_leadstage').closeModal();
            SweetAlert.swal("Success", "Lead updated", "success");
          }
      });

      var leadowners = [];
      var leadowner_length = 0;
      var lead_owner_new = "";

      if($scope.lead_owner == "API") {

        var updateLeadVal = {
          leadowner: $scope.currentUser.name
        };

        if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

          LeadService.updateLeadInfo(updateLeadVal,$scope.leadId).then(function(response){
              //SweetAlert.swal("Updated!", "Lead city has been updated.", "success");
          });

        }


      } else {

        if($scope.lead_owner != "") {
          leadowners.push($scope.lead_owner);
          leadowner_length = leadowners.length;
        }

        if(leadowners.length > 0) {
          if($scope.lead_owner.indexOf($scope.currentUser.name) == -1) {
            leadowners.push($scope.currentUser.name);
          }
        }

        if(leadowners.length > leadowner_length) {

          lead_owner_new = leadowners.join(" / ");

          var updateLeadVal = {
            leadowner: lead_owner_new
          };

          if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

            LeadService.updateLeadInfo(updateLeadVal,$scope.leadId).then(function(response){
                //SweetAlert.swal("Updated!", "Lead city has been updated.", "success");
            });

          }

        }

      }


      var updateVal = {};

      updateVal = { invoice_sent: 0 };

      angular.forEach($scope.leadDetails.service_obj,function(value,key){

        if(value._id != undefined && value._id != null && value._id != "") {

          LeadService.updateServiceInfo(updateVal,value._id).then(function(){
          });

          OrderService.updatedLeadOrder(updateVal,value._id).then(function(res){              
          });

        }

      });


    }

    $scope.deleteLead = function(leadObj) {

      var temp_leads = $scope.leads;


      // console.log(leadObj);
      // console.log(temp_leads.length);
      var deleteddata = $.grep(temp_leads, function(e){
            return e._id != leadObj['_id'];
        });

        // console.log(deleteddata.length);

      var templeadDeleteData = {
        _id: leadObj['_id'],
      };



      $scope.leadDeleteData = templeadDeleteData;

      // console.log($scope.leadDeleteData);
      SweetAlert.swal({
        title: getRandomValue(myArray),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },  function(isConfirm){

        if(isConfirm) {

          LeadService.deleteLead(templeadDeleteData).then(function(response){
              console.log(response);
              // angular.element()
              // need to close the modal after OK
              SweetAlert.swal("Success", "Lead deleted", "success");
              $scope.leads = deleteddata;
          });

      } else {

        SweetAlert.swal("Cancelled", "Service not deleted", "error");

      }
    });


    }

    $scope.print= function() {
      angular.element('#invoice_html_content').html($scope.invoice_html_content);
      angular.element('#invoice_html_content').print();
    };

    $scope.setBillingDetails = function() {
      //console.log($scope.email);
      angular.element('#set_email_modal').closeModal();
    };

    $scope.sendInvoice = function() {

      var sIdsArr = getSelectedValues();

      var city = $scope.leads[$scope.leadIndex].city;
      var billing_name = $scope.leads[$scope.leadIndex].billing_name;
      var billing_address = $scope.leads[$scope.leadIndex].billing_address;

      if(city == undefined || city == null || city == '') {

        SweetAlert.swal("Error!", "Please update city or invoice will not sent.", "error");
        return;

      } else if(billing_name == undefined || billing_name == null || billing_name == '') {

        SweetAlert.swal("Error!", "Please update billing name or invoice will not sent.", "error");
        return;

      } else if(billing_address == undefined || billing_address == null || billing_address == '') {

        SweetAlert.swal("Error!", "Please update billing address or invoice will not sent.", "error");
        return;

      } else {

      // var data = {
      //   'to': $scope.email,
      //   'lead_id': $scope.leads[$scope.leadIndex]._id,
      //   'serviceid_arr': sIdsArr,
      //   'send_sms': 'False',
      //   'invoice_type': $scope.customer_invoice_type
      // };

      // console.log(data);

      var invoice_data = {
        lead_id: $scope.leads[$scope.leadIndex]._id,
        serviceid_arr: sIdsArr,
        to: $scope.email,
        city: city
      };

      console.log(invoice_data);


      LeadService.sendInvoiceData(angular.toJson(invoice_data)).then(function(response){
        console.log(response);
        SweetAlert.swal("Success!", "Invoice sent to customer.", "success");
      });

      }



      //var sIdsArr = getSelectedValues();

      // for (var i = 0; i < sIdsArr.length; i++) {

      //   var serviceUpdateVal = {
      //     'invoice_sent': 1,
      //     'invoice_date': $scope.invoice_date
      //   };
        
      //   LeadService.updateServiceInfo(serviceUpdateVal,sIdsArr[i]).then(function(){

      //   });


      // };


    };

    $scope.exportInvoiceToPdf = function() {

       // html2canvas(angular.element('#invoice_html_content'), {
       //      onrendered: function (canvas) {
       //          var data = canvas.toDataURL();
       //          var docDefinition = {
       //              content: [{
       //                  image: data,
       //                  width: 800,
       //              }]
       //          };
       //          pdfMake.createPdf(docDefinition).download("print_invoice.pdf");
       //      }
       //  });

        console.log(invoiceobj);

        //$rootScope.invoice_obj = invoiceobj;
        $timeout(function () {
            $window.localStorage.setItem("invoice_obj", angular.toJson(invoiceobj));
            window.location.href = "http://localhost:3000/invoice";
        }, 2000);
        

    };

    $scope.getSelectedServices = function() {

      // var firstname = $scope.leads[$scope.leadIndex].client_details.firstname;
      // var lastname = $scope.leads[$scope.leadIndex].client_details.lastname;
      // var serviceDetailsArr = [];
      // //var address = $scope.leads[index].client_details.defaultAddress;
      // var email = $scope.leads[$scope.leadIndex].client_details.primary_email_id;
      // var phone = $scope.leads[$scope.leadIndex].client_details.primary_contact_no;
      // var sdt = '';

      //   selectedServiceIdsArr = $scope.services_obj;

        $scope.isNextClick = true;
        $scope.isNextVisible = false;
        $scope.email =  (invoiceobj['billing_email_id'] != undefined) ? invoiceobj['billing_email_id'] : $scope.leads[$scope.leadIndex].client_details.primary_email_id;

      //   console.log(selectedServiceIdsArr);
      //   console.log(selectedServiceIdsArr.length)


      // if(selectedServiceIdsArr.length > 0) {

      //   angular.forEach(selectedServiceIdsArr,function(value,key){
      //     sdt = $scope.services_options[value.service_id] + " - " + $filter('date')(value.service_date[0],'dd MMMM, yyyy');
      //     if(value.service_time[0] != undefined) {
      //       sdt += ' at ' + $filter('date')(value.service_time[0],'HH:mm a');
      //     }
      //     serviceDetailsArr.push(sdt);
      //   });



      // }

    var htmlcontent = "";
    var inv_date = "";

  //   htmlcontent = '<div bgcolor="#f6f8f1; color:#500050 !important"><table cellspacing="0" cellpadding="0" border="1" align="center" style="width:80%">';
  //   htmlcontent += '<tbody>';
  //   htmlcontent += '<tr>';
  //   htmlcontent += '<td bgcolor="white" style="padding:0px 30px 0px 30px">';
  //   htmlcontent += '<table cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" align="center" style="margin-top:10px;width:100%;max-width:600px;padding:0px 0 0px 0px">';
  //   htmlcontent += '<tbody>';
  //   htmlcontent += '<tr>';
  //   htmlcontent += '<td style="padding: 0px;">';
  //   htmlcontent += '<table cellspacing="0" cellpadding="0" border="0" align="left" style="width:40%;padding:0px 0 0 0">';
  //   htmlcontent += '<tbody>';
  //   htmlcontent += '<tr>';
  //   htmlcontent += '<td style="padding:0 0 0px 5px;font-family:Neris Light,arial;font-size:18px;min-height:auto;width:50px"></td>';
  //   htmlcontent += '<td style="padding: 0px;">';
  //   htmlcontent += 'Hello <span style="padding:0px 0 0 0px;font-family:Neris Semibold,arial;font-size:14px;width:50px;min-height:0px">';
  //   htmlcontent +=  invoiceobj['billing_name'];
  //   htmlcontent += '</span>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '</tbody>';
  //   htmlcontent += '</table>';
  //   htmlcontent += '<table border="0" align="right" style="width:50%;max-width:100%;float:right">';
  //   htmlcontent += '<tbody>';
  //   htmlcontent += '<tr>';
  //   htmlcontent += '<td align="right" style="padding:0px 0 0px 0px;font-family:Neris Light,arial;font-size:12px">';
  //   htmlcontent += 'TAX INVOICE ';
  //   htmlcontent += '<span style="padding:0px 0 0px 0px;border:none;border-collapse:collapse;font-family:Roboto,sans-serif;font-size:12px;font-weight:700;width:80px;text-align:right">';
  //   htmlcontent +=  invoiceobj['invoice_id'];
  //   htmlcontent += '</span>';
  //   htmlcontent += '<p align="right" valign="top" style="padding:0px 0 0px 0px;border:none;font-family:Roboto,sans-serif;font-size:12px;width:100px;text-align:right"></p>';

  //   debugger;

  //   if(invoiceobj['invoice_date'] != undefined && invoiceobj['invoice_date'] != null && invoiceobj['invoice_date'] != "") {

  //     debugger;
  //     //htmlcontent += moment(invoiceobj['invoice_date']).format("Do MMMM, YYYY");
  //     $scope.invoice_date = invoiceobj['invoice_date'];

  //   } else {

  //     debugger;

  //     if(invoiceobj['servicedata']['servicenames'].length > 0 && invoiceobj['servicedata']['servicenames'].length < 2) {

  //       debugger;

  //       inv_date = getMaxDate(invoiceobj['servicedata']['service_date']);

  //       if(moment().unix() < moment(inv_date).unix()) {

  //         debugger;

  //         $scope.invoice_date = (new Date()).toISOString();
  //       } else {

  //         debugger;
  //         $scope.invoice_date = inv_date;
  //         //htmlcontent += moment(invoiceobj['servicedata']['service_date'][0][0]).format("Do MMMM, YYYY");
  //       }

  //     } else {

  //       debugger;

  //       $scope.invoice_date = (new Date()).toISOString();

  //     }

  //     // if(invoiceobj['servicedata']['servicenames'].length > 0 && invoiceobj['servicedata']['servicenames'].length < 2) {
        
  //     // } else {
  //     //   htmlcontent += moment().format('Do MMMM, YYYY');
  //     // }

  //   }

  //   debugger;

  //   htmlcontent += moment($scope.invoice_date).format("Do MMMM, YYYY");

  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '</tbody>';
  //   htmlcontent += '</table>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '<tr>';
  //   htmlcontent += '<td style="padding:10px 0 10px 0">';
  //   htmlcontent += '<hr width="100%" size="1" color="#fec11f">';
  //   htmlcontent += '<div class="" style="width:40%;float:left">';
  //   htmlcontent += '  <a target="_blank" href="http://www.mrhomecare.in">';
  //   htmlcontent += '  <img height="35" width="156" alt="Mr Home Care logo" src="http://crm.mrhomecare.net/img/logo.png" class="CToWUd">';
  //   htmlcontent += '  </a>';
  //   htmlcontent += '  <p style="font-size:12px;font-family:Roboto,sans-serif;">';
  //   htmlcontent += '    <span style="font-weight:700">Mister Homecare Services Private Limited</span> <br>Gordhan Building, 2nd Floor,<br>';
  //   htmlcontent += '    Dr. Parekh Street, Prathana Samaj <br>Mumbai - 400004<br/>';
  //   htmlcontent += '    <span style="font-weight:700;">Ph: </span>9022070070<br/>';
  //   htmlcontent += '     <span style="font-weight:700;">Email ID: </span>customercare@mrhomecare.in';
  //   htmlcontent += '  </p>';
  //   htmlcontent += '</div>';
  //   htmlcontent += '<table border="0" align="right" style="padding:0 24px 10px 9px;width:55%;max-width:60%">';
  //   htmlcontent += '<tbody><tr>';
  //   htmlcontent += '<td>';
  //   htmlcontent += '<table border="0" style="width:50%;max-width:100%;">';
  //   htmlcontent += '<tbody>';
  //   htmlcontent += '<tr>';

  //   htmlcontent += '</tr>';
  //   htmlcontent += '</tbody>';
  //   htmlcontent += '</table>';
  //   htmlcontent += '<table border="0" style="" align="right" valign="top">';
  //   htmlcontent += '<tbody>';
  //   htmlcontent += '<tr><td valign="top" align="left" style="padding:0px 0 0px 10px;font-family:Roboto,sans-serif;font-size:14px;font-weight:700;line-height:1em">';
  //   htmlcontent += 'Bill To:';
  //   htmlcontent += '</td></tr>';
  //   htmlcontent += '<tr>';
  //   htmlcontent += '<td style="padding:0 0 0px 0px">';
  //   htmlcontent += '<p align="left" style="padding:0px 0 0px 0px;border:none;overflow:hidden;font-family:Roboto,sans-serif;font-size:12px;width:200px;min-height:120px">';
  //   htmlcontent += '<b>'+ invoiceobj['billing_name'] +'</b>';
  //   htmlcontent += '<br>';
  //   htmlcontent += '<br>';
  //   htmlcontent += invoiceobj['billing_address'];
  //   htmlcontent += '<br>';
  //   htmlcontent += '<b>Ph:</b> <a target="_blank" value="'+invoiceobj['billing_phone_no']+'" href="tel:'+invoiceobj['billing_phone_no']+'">'+invoiceobj['billing_phone_no']+'</a>';
  //   htmlcontent += '<br>';
  //   htmlcontent += '<b>Email ID:</b> '+ invoiceobj['billing_email_id'];
  //   htmlcontent += '<br>';
  //   htmlcontent += '</p>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '</tbody>';
  //   htmlcontent += '</table>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '</tbody></table>';
  //   htmlcontent += '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0px 0 0px 0">';
  //   htmlcontent += '<tbody><tr>';
  //   htmlcontent += '<td style="width:100px">';
  //   htmlcontent += '<hr width="100%" size="1px" color="#fec11f" align="left" style="display:inline-block">';
  //   htmlcontent += '</td>';
  //   htmlcontent += '<td style="width:50px !important;text-align:center !important;">';
  //   htmlcontent += '<h6 style="display:inline;color:#fec11f;font-size:18px;padding:0 0px 0 0px">Booking Details</h6>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '<td style="width:100px">';
  //   htmlcontent += '<hr width="100%" size="1px" color="#fec11f" align="right" style="display:inline-block">';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '</tbody></table>';
  //   htmlcontent += '<span style="font-family:Neris Thin,arial;font-size:15px;font-weight:400;padding:0px 0 0px 0px">';
  //   htmlcontent += '<table border="0" style="color:black;font-size:14px;font-family:Neris Thin,arial">';
  //   htmlcontent += '<tbody><tr>';
  //   htmlcontent += '<td style="padding: 0px 5px;">Service:</td>';
  //   htmlcontent += '<td style="padding: 0px 5px;">';
    
  //   if(invoiceobj['servicedata']['servicenames'].length > 0) {

  //     for (var p = 0; p < invoiceobj['servicedata']['servicenames'].length; p++) {
  //       if(p == (invoiceobj['servicedata']['servicenames'].length-1)) {
  //         htmlcontent += invoiceobj['servicedata']['servicenames'][p] + " (" + invoiceobj['servicedata']['variantnames'][p] +")" + " - " + moment(invoiceobj['servicedata']['service_date'][p][0]).format("Do MMMM, YYYY") + " at " + moment(invoiceobj['servicedata']['service_time'][p][0]).format("h:mm a");
  //       } else {
  //         htmlcontent += invoiceobj['servicedata']['servicenames'][p] + " (" + invoiceobj['servicedata']['variantnames'][p] +")" + " - " + moment(invoiceobj['servicedata']['service_date'][p][0]).format("Do MMMM, YYYY") + " at " + moment(invoiceobj['servicedata']['service_time'][p][0]).format("h:mm a") + ", ";
  //       }
  //     };

  //     //htmlcontent +=  invoiceobj['servicedata']['servicenames'].join(", ");
  //   }

  //   if(invoiceobj.hasOwnProperty('amcdata') ) {
  //        if(invoiceobj['servicedata']['servicenames'].length > 0) {
  //         htmlcontent += ',' ;
  //         }

  //       if(invoiceobj['amcdata']['servicenames'].length > 0) {

  //         for (var p = 0; p < invoiceobj['amcdata']['servicenames'].length; p++) {
  //           if(p == (invoiceobj['amcdata']['servicenames'].length-1)) {
  //             htmlcontent += invoiceobj['amcdata']['servicenames'][p];
  //           } else {
  //             htmlcontent += invoiceobj['amcdata']['servicenames'][p] + ", ";
  //           }
  //         };

  //       }
  //   }

  //   if(invoiceobj.hasOwnProperty('client_name') ) {
  //     htmlcontent += " for " + invoiceobj['client_name'];
  //   }

  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '<tr>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '</tbody></table>';
  //   htmlcontent += '</span>';
  //   htmlcontent += '<table width="100%" border="0" style="border-collapse:collapse;font-family:Roboto,sans-serif;color:black;font-size:12px">';
  //   htmlcontent += '<tbody><tr width="100%" style="font-weight:500;font-size:12px;background:#fec11f;color:white;">';
  //   htmlcontent += '<td align="center" style="width:10px">';
  //   htmlcontent += '<strong>Sr.No.</strong>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '<td align="center">';
  //   htmlcontent += '<strong>Service Breakup</strong>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '<td align="center">';
  //   htmlcontent += '<strong>Quantity</strong>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '<td align="center">';
  //   htmlcontent += '<strong>Rate</strong>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '<td align="center">';
  //   htmlcontent += '<strong>Amount</strong>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   // htmlcontent += '<tr cellpadding="1">';
  //   // htmlcontent += '<td></td>';
  //   // htmlcontent += '<td align="center" style="font-weight:700;font-size:14px;padding-top:1%;padding-bottom:1%" colspan="1">';

  //   // htmlcontent += '</td>';
  //   // htmlcontent += '</tr>';

  //   var cnt = 1;
  //   var pre_taxed_cost_total = 0;
  //   var service_tax = 0;
  //   var sb_tax = 0;
  //   var kk_tax = 0;
  //   var gst_tax = 0;
  //   var taxed_cost_total = 0;
  //   if (invoiceobj.hasOwnProperty('servicedata') && invoiceobj.servicedata.servicenames.length>0) {

  //     angular.forEach(invoiceobj.servicedata.servicenames,function(value,key){

  //       htmlcontent += '<tr>';
  //       htmlcontent += '  <td style="padding: 5px 5px;" align="center">'+ cnt +'</td>';
  //       htmlcontent += '  <td style="padding: 5px 5px;" align="left">'+ value +'</td>';
  //       htmlcontent += '  <td style="padding: 5px 5px;" align="center">1</td>';
  //       htmlcontent += '  <td style="padding: 5px 5px;" align="center">Rs. '+ invoiceobj.servicedata.price[cnt-1].pre_taxed_cost +'</td>';
  //       htmlcontent += '  <td style="padding: 5px 5px;" align="right">Rs. '+ invoiceobj.servicedata.price[cnt-1].pre_taxed_cost +'</td>';
  //       htmlcontent += '</tr>';

  //       pre_taxed_cost_total += invoiceobj.servicedata.price[cnt-1].pre_taxed_cost;
  //       service_tax += invoiceobj.servicedata.price[cnt-1].service_tax;
  //       sb_tax += invoiceobj.servicedata.price[cnt-1].cess_tax;
  //       kk_tax += invoiceobj.servicedata.price[cnt-1].kk_tax;
  //       //gst_tax += invoiceobj.servicedata.price[cnt-1].gst_tax;

  //       if($scope.customer_invoice_type == 1) {
  //         taxed_cost_total += invoiceobj.servicedata.price[cnt-1].pre_taxed_cost;
  //       } else {

  //         //if(invoiceobj.servicedata.price[cnt-1].discount != undefined && invoiceobj.servicedata.price[cnt-1].discount != 0) {
  //           //taxed_cost_total += (invoiceobj.servicedata.price[cnt-1].taxed_cost - invoiceobj.servicedata.price[cnt-1].discount);  
  //         //} else {
  //           taxed_cost_total += invoiceobj.servicedata.price[cnt-1].taxed_cost;
  //         //}

          
  //       }

  //       cnt++;

  //     });

  //   };

  //   if (invoiceobj.hasOwnProperty('amcdata')) {
  //       var amccnt =0;
  //     angular.forEach(invoiceobj.amcdata.servicenames,function(value,key){

  //     htmlcontent += '<tr>';
  //     htmlcontent += '  <td style="padding: 5px 5px;" align="center">'+ cnt +'</td>';
  //     htmlcontent += '  <td style="padding: 5px 5px;" align="left">'+ value +'</td>';
  //     htmlcontent += '  <td style="padding: 5px 5px;" align="center">1</td>';
  //     htmlcontent += '  <td style="padding: 5px 5px;" align="center">Rs. '+ invoiceobj.amcdata.price[amccnt].pre_taxed_cost +'</td>';
  //     htmlcontent += '  <td style="padding: 5px 5px;" align="right">Rs. '+ invoiceobj.amcdata.price[amccnt].pre_taxed_cost +'</td>';
  //     htmlcontent += '</tr>';

  //     console.log(invoiceobj.amcdata.price[amccnt].pre_taxed_cost);

  //     pre_taxed_cost_total += invoiceobj.amcdata.price[amccnt].pre_taxed_cost;
  //     service_tax += invoiceobj.amcdata.price[amccnt].service_tax;
  //     sb_tax += invoiceobj.amcdata.price[amccnt].cess_tax;
  //     kk_tax += invoiceobj.amcdata.price[amccnt].kk_tax;
  //     //gst_tax += invoiceobj.amcdata.price[amccnt].gst_tax;
  //     taxed_cost_total += invoiceobj.amcdata.price[amccnt].client_payment_expected;

  //     cnt++;
  //     amccnt++;

  //   });
  //   };




  //   htmlcontent += '<tr>';
  //   htmlcontent += '  <td style="padding: 5px 5px;"align="center"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="left"><strong>Pre Tax Total</strong</td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="center"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="center"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="right">Rs. '+ Math.floor(pre_taxed_cost_total) +'</td>';
  //   htmlcontent += '</tr>';

  //   // htmlcontent += '<tr>';
  //   // htmlcontent += '  <td style="padding: 5px 5px;" align="center"></td>';
  //   // htmlcontent += '  <td style="padding: 5px 5px;" align="left">GST Tax @ 18 % 2017-18</td>';
  //   // htmlcontent += '  <td style="padding: 5px 5px;"></td>';
  //   // htmlcontent += '  <td style="padding: 5px 5px;"></td>';
  //   // htmlcontent += '  <td style="padding: 5px 5px;" align="right">Rs. '+ Math.floor(gst_tax) +'</td>';
  //   // htmlcontent += '</tr>';

  //   htmlcontent += '<tr>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="center"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="left">Service Tax @ 14 % 2017-18</td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="right">Rs. '+ Math.floor(service_tax) +'</td>';
  //   htmlcontent += '</tr>';

  //   htmlcontent += '<tr>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="center"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="left">Swachh Bharat Cess @ 0.5 % 2017-18</td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="right">Rs. '+ Math.floor(sb_tax) +'</td>';
  //   htmlcontent += '</tr>';

  //   htmlcontent += '<tr>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="center"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="left">Krishi Kalyan Cess @ 0.5 % 2017-18</td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;"></td>';
  //   htmlcontent += '  <td style="padding: 5px 5px;" align="right">Rs. '+ Math.floor(kk_tax) +'</td>';
  //   htmlcontent += '</tr>';

  //   htmlcontent += '<tr>';
  //   htmlcontent += '<td style="padding: 0px 5px;" style="width:50px"></td>';
  //   htmlcontent += '<td style="padding: 0px 5px;"></td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '<tr style="border-bottom:1px solid #fec11f">';
  //   htmlcontent += '<td style="padding: 0px 5px;"></td>';
  //   htmlcontent += '<td style="padding: 0px 5px;"></td>';
  //   htmlcontent += '<td align="right" style="padding:0 0px 0 0" colspan="2">';
  //   htmlcontent += '</td>';
  //   htmlcontent += '<td style="padding:0px;">';
  //   htmlcontent += '<strong>';
  //   htmlcontent += '<p style="border:none;float:center;text-align:center">';

  //   htmlcontent += '</p>';
  //   htmlcontent += '</strong>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '<tr style="border-bottom:1px solid #fec11f">';
  //   htmlcontent += '<td style="padding: 0px 5px;"></td>';
  //   htmlcontent += '<td style="padding: 0px 5px;"></td>';
  //   htmlcontent += '<td style="padding: 0px 5px;"></td>';
  //   htmlcontent += '<td align="right" style="padding:0 0px 0 0">';
  //   htmlcontent += '<strong>Net Payable</strong>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '<td align="right" style="padding: 0px 5px;">';
  //   htmlcontent += '<p style="border:none;float:center;font-weight:700;text-align:right;">';
  //   htmlcontent += 'Rs. '+ taxed_cost_total;
  //   htmlcontent += '</p>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '<tr>';
  //   htmlcontent += '<td colspan="2" style="padding: 10px 5px;">MHC ST No.: AAJCM6704HSD001</td>';
  //   htmlcontent += '<td style="padding: 10px 5px;"></td>';
  //   htmlcontent += '<td align="right" style="font-size:14px;padding:10px 0px 0 0"></td>';
  //   htmlcontent += '<td style="padding: 10px 5px;">';
  //   htmlcontent += '<strong>';
  //   htmlcontent += '<p type="text" style="border:none;float:center;text-align:center;font-weight:700">';
  //   htmlcontent += '</p>';
  //   htmlcontent += '</strong>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '<tr>';
  //   htmlcontent += '<td colspan="2" style="padding: 0px 5px;">Company PAN No.: AAJCM6704H</td>';
  //   htmlcontent += '<td align="right" colspan="3" style="padding: 0px 5px;">';
  //   htmlcontent += '<a target="_blank" style="padding:1%;border:1px solid #fec11f;color:black;background-color:#fec11f;text-decoration:none" href="'+invoiceobj['payment_link']+'">';
  //   htmlcontent += 'Click to pay online';
  //   htmlcontent += '</a>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';

  //   var vat_no = '27185308368V';

  //   if(invoiceobj['city'] == 2) {
  //     vat_no = '29521364516';
  //   } else if(invoiceobj['city'] == 3) {
  //     vat_no = '7687166938';
  //   }

  //   htmlcontent += '<tr>';
  //   htmlcontent += '<td colspan="2" style="padding: 10px 5px;">VAT No.: '+ vat_no +'</td>';
  //   htmlcontent += '<td style="padding: 10px 5px;"></td>';
  //   htmlcontent += '<td align="right" style="font-size:14px;padding:10px 0px 0 0"></td>';
  //   htmlcontent += '<td style="padding: 10px 5px;">';
  //   htmlcontent += '<strong>';
  //   htmlcontent += '<p type="text" style="border:none;float:center;text-align:center;font-weight:700">';
  //   htmlcontent += '</p>';
  //   htmlcontent += '</strong>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';


  //   // htmlcontent += '<tr>';
  //   // htmlcontent += '<td colspan="4" style="padding: 0px 5px;"></td>';
  //   // htmlcontent += '<td>';
  //   // htmlcontent += '</td>';
  //   // htmlcontent += '</tr>';
  //   // htmlcontent += '<tr>';
  //   // htmlcontent += '<td colspan="4" style="padding: 0px 5px;"></td>';
  //   // htmlcontent += '<td>';
  //   // htmlcontent += '</td>';
  //   // htmlcontent += '</tr>';
  //   htmlcontent += '</tbody></table>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '</tbody>';
  //   htmlcontent += '</table>';
  //   htmlcontent += '<div class="" style="margin-left:5%;width:95%">';
  //   htmlcontent += '  <p style=" text-decoration: underline; font-size: 12px;">Declaration</p>';
  //   htmlcontent += '  <p style="font-size: 12px;"> We declare that this invoice shows the actual price of the service provided and that all the particulars are true and correct.</p>';
  //   htmlcontent += '</div>';
  //   htmlcontent += '<table style="margin-left:5%;width:95%" border="0" align="center">';
  //   htmlcontent += '<tbody><tr>';
  //   htmlcontent += '<td style="padding:0px 0 0px 0">';
  //   htmlcontent += '  <p style="font-size: 13px; padding: 0px; margin: 0px;">Kindly address the cheque to - <b>Mister Homecare Services Pvt. Ltd.</b></p>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '<td style="padding: 0px;">';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '</tbody></table>';
  //   htmlcontent += '<table width="100%" border="0" align="center">';
  //   htmlcontent += '<tbody><tr>';
  //   htmlcontent += '<td>';
  //   // htmlcontent += '<h2 align="center" width="100%" style="border-collapse:collapse;font-family:Roboto,sans-serif;color:black;font-weight:300;font-size:12px" border="0">';
  //   // htmlcontent += '</h2>';
  //   // htmlcontent += '<table align="center">';
  //   // htmlcontent += '<tbody>';
  //   // htmlcontent += '<tr>';
  //   // htmlcontent += '<td style="padding:0px;">';
  //   // htmlcontent += '<a target="_blank" href="https://twitter.com/misterhomecare">';
  //   // htmlcontent += '<img alt="Twitter" src="http://engine.mrhomecare.net/images/twitter.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
  //   // htmlcontent += '</a>';
  //   // htmlcontent += '<a target="_blank" href="https://www.facebook.com/MisterHomecare/">';
  //   // htmlcontent += '<img alt="Facebook" src="http://engine.mrhomecare.net/images/facebook.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
  //   // htmlcontent += '</a>';
  //   // htmlcontent += '<a target="_blank" href="https://www.linkedin.com/company/mr-homecare">';
  //   // htmlcontent += '<img alt="Facebook" src="http://engine.mrhomecare.net/images/linkedin.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
  //   // htmlcontent += '</a>';
  //   // htmlcontent += '<a target="_blank" href="https://www.instagram.com/mrhomecare/">';
  //   // htmlcontent += '<img alt="Facebook" src="http://engine.mrhomecare.net/images/instagram.png" style="width:20px;padding:2px 0 0 0;border:0;display:inline" class="CToWUd">';
  //   // htmlcontent += '</a>';
  //   // htmlcontent += '</td>';
  //   // htmlcontent += '</tr>';
  //   // htmlcontent += '</tbody></table>';
  //   htmlcontent += '<p align="center" style="font-family:Roboto,sans-serif;color:black;font-weight:300;font-size:13px">';
  //   htmlcontent += '<i>Thanks for using our service!</i>';
  //   htmlcontent += '</p>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '</tbody></table>';
  //   htmlcontent += '</td>';
  //   htmlcontent += '</tr>';
  //   htmlcontent += '</tbody>';
  //   htmlcontent += '</table><div class="yj6qo"></div><div class="adL">';
  //   htmlcontent += '</div>';
  // htmlcontent += '</div>';

  htmlcontent += '<table align="center" border="0" width="90%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
      htmlcontent += '<tr>';
        htmlcontent += '<td style="padding: 0px; text-align: center;" align="center">Tax Invoice</td>';
      htmlcontent += '</tr>';
      htmlcontent += '<tr>';
        htmlcontent += '<td style="border: 1px solid #000000; padding: 0px;">';
          htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
              htmlcontent += '<tr>';
                htmlcontent += '<td style="width: 50%; padding: 0px; border-right: 1px solid #000000;">';
                  htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 12px;" valign="top">';
                        htmlcontent += '<span style="font-weight: 700">Mister Homecare Services Privated Limited</span><br />';
                        if(invoiceobj['city'] == 1) {
                          htmlcontent += 'Gordhan Building, 2nd Floor,<br />';
                          htmlcontent += 'Dr. Parekh Street, Prarthana Samaj,<br />';
                          htmlcontent += 'Mumbai - 400004<br />';
                          htmlcontent += 'GSTIN/UIN: 27AAJCM6704H1ZC<br />';
                          htmlcontent += 'State Code: 27<br />&nbsp;<br />&nbsp;';
                        } else if(invoiceobj['city'] == 2) {                          
                          htmlcontent += 'No. 52, 2nd Floor,<br />';
                          htmlcontent += 'St. Johns Road,<br />';
                          htmlcontent += 'Bangalore - 560042<br />';
                          htmlcontent += 'GSTIN/UIN: 29AAJCM6704H1Z8<br />';
                          htmlcontent += 'State Code: 29<br />&nbsp;<br />';
                        } else if(invoiceobj['city'] == 3) {                          
                          htmlcontent += 'B 44/2, Freedom Fighter Colony,<br />';
                          htmlcontent += 'Neb Sarai,<br />';
                          htmlcontent += 'New Delhi - 110068<br />';
                          htmlcontent += 'GSTIN/UIN: 07AAJCM6704H1ZE<br />';
                          htmlcontent += 'State Code: 07<br />&nbsp;<br />&nbsp;';
                        } else {
                          htmlcontent += 'Gordhan Building, 2nd Floor,<br />';
                          htmlcontent += 'Dr. Parekh Street, Prarthana Samaj,<br />';
                          htmlcontent += 'Mumbai - 400004<br />';
                          htmlcontent += 'GSTIN/UIN: 27AAJCM6704H1ZC<br />';
                          htmlcontent += 'State Code: 27<br /><br />';
                        }
                          htmlcontent += '<span style="font-weight: 700">Contact No.:</span> 9022-070-070<br />';
                          htmlcontent += '<span style="font-weight: 700">Email Id:</span> customercare@mrhomecare.in<br />&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="padding: 3px; font-size: 12px;" valign="top">';
                        htmlcontent += 'Details of Receiver (Bill To)<br />';
                        htmlcontent += '<span style="font-weight: 700">'+ invoiceobj['billing_name'] +'</span><br /><br />';
                        htmlcontent += invoiceobj['billing_address'] + '<br /><br />';
                        htmlcontent += '<span style="font-weight: 700">Contact No.: </span>';
                        htmlcontent += invoiceobj['billing_phone_no'] + '<br />';
                        htmlcontent += '<span style="font-weight: 700">Email Id.: </span>';
                        htmlcontent += invoiceobj['billing_email_id'] + '<br />&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                  htmlcontent += '</table>';
                htmlcontent += '</td>';
                htmlcontent += '<td style="width: 50%; padding: 0px; vertical-align: top;" valign="top">';
                  htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; font-size: 12px;">';
                        htmlcontent += 'Invoice No.<br />';
                        htmlcontent += '<span style="font-weight: 700;">'+ invoiceobj['invoice_id'] +'</span>';
                      htmlcontent += '</td>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 12px;">';
                        htmlcontent += 'Dated<br />';

                        // if(invoiceobj['invoice_date'] != undefined && invoiceobj['invoice_date'] != null && invoiceobj['invoice_date'] != "") {

                        //       $scope.invoice_date = moment(invoiceobj['invoice_date']);

                        //     } else {

                        //       if(invoiceobj['servicedata']['servicenames'].length > 0 && invoiceobj['servicedata']['servicenames'].length < 2) {

                        //         inv_date = getMaxDate(invoiceobj['servicedata']['service_date']);

                        //         if(moment().unix() < moment(inv_date).unix()) {
                        //           $scope.invoice_date = (new Date()).toISOString();
                        //         } else {

                        //           $scope.invoice_date = inv_date;
                        //         }

                        //       } else {

                        //         $scope.invoice_date = (new Date()).toISOString();

                        //       }

                        // }                       


                        htmlcontent += '<span style="font-weight: 700;">'+ invoiceobj['invoice_date'] +'</span>';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; font-size: 12px;">';
                        htmlcontent += 'Delivery Note<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 12px;">';
                        htmlcontent += 'Model/Terms of Payment<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; font-size: 12px;">';
                        htmlcontent += 'Buyers Order No.<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 12px;">';
                        htmlcontent += 'Dated<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; font-size: 12px;">';
                        htmlcontent += 'Despatch Document No.<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 12px;">';
                        htmlcontent += 'Delivery Note Date<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; font-size: 12px;">';
                        htmlcontent += 'Despatched through<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                      htmlcontent += '<td style="border-bottom: 1px solid #000000; padding: 3px; font-size: 12px;">';
                        htmlcontent += 'Destination<br />';
                        htmlcontent += '&nbsp;';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td colspan="2" style="padding: 3px; font-size: 12px;">';
                        htmlcontent += 'Terms of Delivery';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                  htmlcontent += '</table>';
                htmlcontent += '</td>';
              htmlcontent += '</tr>';

              htmlcontent += '<tr>';
                htmlcontent += '<td style="padding: 0px; border-right: 1px solid #000000;" colspan="2">';
                  htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">Sr No.</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">Description of Services<br />&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">HSN/SAC<br />&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">Quantity<br />&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">Rate<br />&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">per<br />&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">Amount<br />&nbsp;</td>';
                    htmlcontent += '</tr>';
                    
                    // htmlcontent += '<tr>';
                    //   htmlcontent += '<td style="border-right: 1px solid #000000;">&nbsp;</td>';
                    //   htmlcontent += '<td style="border-right: 1px solid #000000;">&nbsp;</td>';
                    //   htmlcontent += '<td style="border-right: 1px solid #000000;">&nbsp;</td>';
                    //   htmlcontent += '<td style="border-right: 1px solid #000000;">&nbsp;</td>';
                    //   htmlcontent += '<td style="border-right: 1px solid #000000;">&nbsp;</td>';
                    //   htmlcontent += '<td style="border-right: 1px solid #000000;">&nbsp;</td>';
                    //   htmlcontent += '<td style="border-right: 1px solid #000000;">&nbsp;</td>';
                    // htmlcontent += '</tr>';

                    var cnt = 1;
                      var pre_taxed_cost_total = 0;
                      var service_tax = 0;
                      var sb_tax = 0;
                      var kk_tax = 0;
                      var cgst_tax = 0;
                      var sgst_tax = 0;
                      var gst_tax = 0;
                      var taxed_cost_total = 0;
                      var client_payment_expected_total = 0;
                      var discount_total = 0;

                      if (invoiceobj.hasOwnProperty('servicedata') && invoiceobj.servicedata.servicenames.length>0) {

                          angular.forEach(invoiceobj.servicedata.servicenames,function(value,key){

                        htmlcontent += '<tr>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; vertical-align: top; text-align: right; font-size: 12px;" valign="top" align="right">'+ cnt +'.</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 12px; vertical-align: top;">';
                          if(invoiceobj.servicedata.service_category_id[cnt-1] == 6 || invoiceobj.servicedata.service_category_id[cnt-1] == 7) {
                            htmlcontent += 'Maintenance and repair services<br />';
                            htmlcontent += '<small>('+ value +')</small>';
                          } else if(invoiceobj.servicedata.service_category_id[cnt-1] == 9 || invoiceobj.servicedata.service_category_id[cnt-1] == 11) {
                            htmlcontent += 'Cleaning services<br />';
                            htmlcontent += '<small>('+ value +')</small>';
                          } else if(invoiceobj.servicedata.service_category_id[cnt-1] == 10) {
                            if(value.indexOf('water') !== -1) {
                              htmlcontent += 'Painting and waterproofing services<br />';
                              htmlcontent += '<small>('+ value +')</small>';
                            } else {
                              htmlcontent += 'Painting and waterproofing services<br />';
                              htmlcontent += '<small>('+ value +')</small>';                              
                            }
                          }
                          htmlcontent += '</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 12px; vertical-align: top;">';
                          if(invoiceobj.servicedata.service_category_id[cnt-1] == 6 || invoiceobj.servicedata.service_category_id[cnt-1] == 7) {
                            htmlcontent += '998719';
                          } else if(invoiceobj.servicedata.service_category_id[cnt-1] == 9 || invoiceobj.servicedata.service_category_id[cnt-1] == 11) {
                            htmlcontent += '998533';
                          } else if(invoiceobj.servicedata.service_category_id[cnt-1] == 10) {
                            if(value.toLowerCase().indexOf('water') !== -1) {
                              htmlcontent += '995453';
                            } else {
                              htmlcontent += '995473';
                            }
                          }
                          htmlcontent += '</td>';
                          htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px; vertical-align: top;">1</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                          htmlcontent += '<td align="right" style="text-align: right; font-size: 12px; vertical-align: top;"><span style="font-weight: 700; padding: 3px; ">'+ parseFloat(invoiceobj.servicedata.price[cnt-1].pre_taxed_cost).toFixed(2) +'</span></td>';
                        htmlcontent += '</tr>';

                        pre_taxed_cost_total += parseFloat(invoiceobj.servicedata.price[cnt-1].pre_taxed_cost);
                            // service_tax += invoiceobj.servicedata.price[cnt-1].service_tax;
                            // sb_tax += invoiceobj.servicedata.price[cnt-1].cess_tax;
                            // kk_tax += invoiceobj.servicedata.price[cnt-1].kk_tax;
                            cgst_tax += invoiceobj.servicedata.price[cnt-1].cgst_tax;
                            sgst_tax += invoiceobj.servicedata.price[cnt-1].sgst_tax;
                            gst_tax += invoiceobj.servicedata.price[cnt-1].gst_tax;

                            if($scope.customer_invoice_type == 1) {
                              taxed_cost_total += invoiceobj.servicedata.price[cnt-1].pre_taxed_cost;
                            } else {

                              //if(invoiceobj.servicedata.price[cnt-1].discount != undefined && invoiceobj.servicedata.price[cnt-1].discount != 0) {
                                //taxed_cost_total += (invoiceobj.servicedata.price[cnt-1].taxed_cost - invoiceobj.servicedata.price[cnt-1].discount);  
                              //} else {
                                taxed_cost_total += invoiceobj.servicedata.price[cnt-1].taxed_cost;
                              //}

                              
                            }

                            discount_total += invoiceobj.servicedata.price[cnt-1].discount;
                            client_payment_expected_total += invoiceobj.servicedata.price[cnt-1].client_payment_expected;

                            cnt++;

                      });

                        }


                        if (invoiceobj.hasOwnProperty('amcdata') && invoiceobj.amcdata.servicenames.length>0) {
                          var amccnt =0;
                          angular.forEach(invoiceobj.amcdata.servicenames,function(value,key){

                        htmlcontent += '<tr>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;" valign="top" align="right">'+ cnt +'.</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 12px;">';
                          if(invoiceobj.amcdata.service_category_id[amccnt] == 6 || invoiceobj.amcdata.service_category_id[amccnt] == 7) {
                            htmlcontent += 'Maintenance and repair services<br />';
                            htmlcontent += '<small>('+ value +')</small>';
                          } else if(invoiceobj.amcdata.service_category_id[amccnt] == 9 || invoiceobj.amcdata.service_category_id[amccnt] == 11) {
                            htmlcontent += 'Cleaning services<br />';
                            htmlcontent += '<small>('+ value +')</small>';
                          } else if(invoiceobj.amcdata.service_category_id[amccnt] == 10) {
                            if(value.indexOf('water') !== -1) {
                              htmlcontent += 'Painting and waterproofing services<br />';
                              htmlcontent += '<small>('+ value +')</small>';
                            } else {
                              htmlcontent += 'Painting and waterproofing services<br />';
                              htmlcontent += '<small>('+ value +')</small>';                              
                            }
                          }
                          htmlcontent += '</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 12px;">';
                          if(invoiceobj.amcdata.service_category_id[amccnt] == 6 || invoiceobj.amcdata.service_category_id[amccnt] == 7) {
                            htmlcontent += '998719';
                          } else if(invoiceobj.amcdata.service_category_id[amccnt] == 9 || invoiceobj.amcdata.service_category_id[amccnt] == 11) {
                            htmlcontent += '998533';
                          } else if(invoiceobj.amcdata.service_category_id[amccnt] == 10) {
                            if(value.toLowerCase().indexOf('water') !== -1) {
                              htmlcontent += '995453';
                            } else {
                              htmlcontent += '995473';
                            }
                          }
                          htmlcontent += '</td>';
                          htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">1</td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                          htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                          htmlcontent += '<td align="right" style="text-align: right;"><span style="font-weight: 700; padding: 3px; font-size: 12px;">'+ invoiceobj.amcdata.price[amccnt].pre_taxed_cost.toFixed(2) +'</span></td>';
                        htmlcontent += '</tr>';

                        pre_taxed_cost_total += invoiceobj.amcdata.price[amccnt].pre_taxed_cost;
                            // service_tax += invoiceobj.amcdata.price[amccnt].service_tax;
                            // sb_tax += invoiceobj.amcdata.price[amccnt].cess_tax;
                            // kk_tax += invoiceobj.amcdata.price[amccnt].kk_tax;
                            cgst_tax += invoiceobj.amcdata.price[amccnt].cgst_tax;
                            sgst_tax += invoiceobj.amcdata.price[amccnt].sgst_tax;
                            gst_tax += invoiceobj.amcdata.price[amccnt].gst_tax;

                            if($scope.customer_invoice_type == 1) {
                              taxed_cost_total += invoiceobj.amcdata.price[amccnt].pre_taxed_cost;
                            } else {

                              //if(invoiceobj.servicedata.price[cnt-1].discount != undefined && invoiceobj.servicedata.price[cnt-1].discount != 0) {
                                //taxed_cost_total += (invoiceobj.servicedata.price[cnt-1].taxed_cost - invoiceobj.servicedata.price[cnt-1].discount);  
                              //} else {
                                taxed_cost_total += invoiceobj.amcdata.price[amccnt].taxed_cost;
                              //}

                              
                            }

                            discount_total += invoiceobj.amcdata.price[amccnt].discount;
                            client_payment_expected_total += invoiceobj.amcdata.price[amccnt].client_payment_expected;

                            cnt++;
                            amccnt++;

                      });

                        }


                        // if(discount_total !=0 && discount_total != "") {
                        //   taxed_cost_total = taxed_cost_total - discount_total;
                        // }

                        if(client_payment_expected_total != 0 && client_payment_expected_total < taxed_cost_total && discount_total !=0) {
                          taxed_cost_total = client_payment_expected_total;
                        }


                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;" valign="top" align="right">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 12px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 12px;">&nbsp;</td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td align="right" style="text-align: right; border-top: 1px solid #000000; font-size: 12px;">'+ pre_taxed_cost_total.toFixed(2) +'</td>';
                    htmlcontent += '</tr>';

                    if(invoiceobj.is_igst == 1) {

                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;" align="right"><span style="font-weight: 700"><em>OUTPUT IGST</em></span></td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">18</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 12px;">%</td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;"><span style="font-weight: 700;">'+ gst_tax.toFixed(2) +'</span></td>';
                    htmlcontent += '</tr>';

                    } else {

                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;" align="right"><span style="font-weight: 700"><em>OUTPUT CGST</em></span></td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">9</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 12px;">%</td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;"><span style="font-weight: 700;">'+ cgst_tax.toFixed(2) +'</span></td>';
                    htmlcontent += '</tr>';
                    
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;" align="right"><span style="font-weight: 700"><em>OUTPUT SGST</em></span></td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;"></td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">9</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px; font-size: 12px;">%</td>';
                      htmlcontent += '<td align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;"><span style="font-weight: 700;">'+ sgst_tax.toFixed(2) +'</span></td>';
                    htmlcontent += '</tr>';

                    }

                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td style="border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                    htmlcontent += '</tr>';

                    htmlcontent += '<tr>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;" align="right">Total</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td align="center" valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px;">&nbsp;</td>';
                      htmlcontent += '<td valign="top" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;" align="right"><span style="font-weight: 700;">Rs. '+ taxed_cost_total +'</span></td>';
                    htmlcontent += '</tr>';
                    
                  htmlcontent += '</table>';

                htmlcontent += '</td>';

              htmlcontent += '</tr>';

              htmlcontent += '<tr>';
                htmlcontent += '<td valign="top" style="padding: 3px; font-size: 12px; vertical-align: top;">';
                  htmlcontent += '<small>Amount Chargeable (in words)</small><br />';
                  htmlcontent += '<span style="font-weight: 700;">INR '+ inWords(taxed_cost_total) +'</span>';
                htmlcontent += '</td>';
                htmlcontent += '<td valign="top" align="right" style="padding: 3px; font-size: 12px; vertical-align: top; text-align: right;">';
                  htmlcontent += '<em>E. & O.E</em>';
                htmlcontent += '</td>';
              htmlcontent += '</tr>';

              htmlcontent += '<tr>';
                htmlcontent += '<td style="padding: 0px;" colspan="2">';

                  htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    
                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="width: 40%; border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;" valign="top" align="center">HSN/SAC</td>';
                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">Taxable<br />Value</td>';
                      
                      if(invoiceobj.is_igst == 1) {

                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 0px; font-size: 12px;">';
                        htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td colspan="2" align="center" style="border-bottom: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">Integrated Tax</td>';
                          htmlcontent += '</tr>';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td align="center" align="center" style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">Rate</td>';
                            htmlcontent += '<td align="center" style="width: 50%; padding: 3px; text-align: center; font-size: 12px;">Amount</td>';
                          htmlcontent += '</tr>';
                        htmlcontent += '</table>';
                      htmlcontent += '</td>';

                      } else {

                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; padding: 0px; font-size: 12px;">';
                        htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td colspan="2" align="center" style="border-bottom: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">Central Tax</td>';
                          htmlcontent += '</tr>';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td align="center" align="center" style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">Rate</td>';
                            htmlcontent += '<td align="center" style="width: 50%; padding: 3px; text-align: center; font-size: 12px;">Amount</td>';
                          htmlcontent += '</tr>';
                        htmlcontent += '</table>';
                      htmlcontent += '</td>';
                      
                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000; padding: 0px; font-size: 12px;">';
                        htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td colspan="2" align="center" style="border-bottom: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">State Tax</td>';
                          htmlcontent += '</tr>';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td align="center"  style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: center; font-size: 12px;">Rate</td>';
                            htmlcontent += '<td align="center" style="width: 50%; padding: 3px; text-align: center; font-size: 12px;">Amount</td>';
                          htmlcontent += '</tr>';
                        htmlcontent += '</table>';
                      htmlcontent += '</td>';

                      }
                    
                    htmlcontent += '</tr>';

                    var cnt = 0;
                    var pre_taxed_cost_total = 0;
                    var cgst_tax = 0;
                    var sgst_tax = 0;
                    var igst_tax = 0;

                    if (invoiceobj.hasOwnProperty('servicedata') && invoiceobj.servicedata.servicenames.length>0) {

                          angular.forEach(invoiceobj.servicedata.servicenames,function(value,key){

                        htmlcontent += '<tr>';
                          htmlcontent += '<td style="width: 40%; border-right: 1px solid #000000; padding: 3px; font-size: 12px;" valign="top">';
                            if(invoiceobj.servicedata.service_category_id[cnt] == 6 || invoiceobj.servicedata.service_category_id[cnt] == 7) {
                              htmlcontent += '998719';
                            } else if(invoiceobj.servicedata.service_category_id[cnt] == 9 || invoiceobj.servicedata.service_category_id[cnt] == 11) {
                              htmlcontent += '998533';
                            } else if(invoiceobj.servicedata.service_category_id[cnt] == 10) {
                              if(value.toLowerCase().indexOf('water') !== -1) {
                                htmlcontent += '995453';
                              } else {
                                htmlcontent += '995473';
                              }
                            }
                          htmlcontent += '</td>';
                          htmlcontent += '<td valign="top" align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">'+ parseFloat(invoiceobj.servicedata.price[cnt].pre_taxed_cost).toFixed(2) +'</td>';
                          
                          if(invoiceobj.is_igst == 1) {

                            htmlcontent += '<td valign="top" align="center" style="border-right: 1px solid #000000; padding: 0px; font-size: 12px;">';
                              htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                                htmlcontent += '<tr>';
                                  htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">18%</td>';
                                  htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 12px;">'+ invoiceobj.servicedata.price[cnt].gst_tax.toFixed(2) +'</td>';
                                htmlcontent += '</tr>';
                              htmlcontent += '</table>';
                            htmlcontent += '</td>';


                          } else {

                          htmlcontent += '<td valign="top" align="center" style="border-right: 1px solid #000000; padding: 0px; font-size: 12px;">';
                            htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                              htmlcontent += '<tr>';
                                htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">9%</td>';
                                htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 12px;">'+ invoiceobj.servicedata.price[cnt].cgst_tax.toFixed(2) +'</td>';
                              htmlcontent += '</tr>';
                            htmlcontent += '</table>';
                          htmlcontent += '</td>';
                          
                          htmlcontent += '<td valign="top" align="center" style="padding: 0px; font-size: 12px;">';
                            htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                              htmlcontent += '<tr>';
                                htmlcontent += '<td align="right"  style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">9%</td>';
                                htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 12px;">'+ invoiceobj.servicedata.price[cnt].cgst_tax.toFixed(2) +'</td>';
                              htmlcontent += '</tr>';
                            htmlcontent += '</table>';
                          htmlcontent += '</td>';

                          }

                        htmlcontent += '</tr>';

                        pre_taxed_cost_total += parseFloat(invoiceobj.servicedata.price[cnt].pre_taxed_cost);
                            cgst_tax += invoiceobj.servicedata.price[cnt].cgst_tax;
                            sgst_tax += invoiceobj.servicedata.price[cnt].sgst_tax;
                            igst_tax += invoiceobj.servicedata.price[cnt].gst_tax;

                        cnt++;

                      });

                        }

                        var amccnt = 0;

                        if (invoiceobj.hasOwnProperty('amcdata') && invoiceobj.amcdata.servicenames.length>0) {

                          angular.forEach(invoiceobj.amcdata.servicenames,function(value,key){

                        htmlcontent += '<tr>';
                          htmlcontent += '<td style="width: 40%; border-right: 1px solid #000000; padding: 3px; font-size: 12px;" valign="top">';
                            if(invoiceobj.amcdata.service_category_id[amccnt] == 6 || invoiceobj.amcdata.service_category_id[amccnt] == 7) {
                              htmlcontent += '998719';
                            } else if(invoiceobj.amcdata.service_category_id[amccnt] == 9 || invoiceobj.amcdata.service_category_id[amccnt] == 11) {
                              htmlcontent += '998533';
                            } else if(invoiceobj.amcdata.service_category_id[amccnt] == 10) {
                              if(value.toLowerCase().indexOf('water') !== -1) {
                                htmlcontent += '995453';
                              } else {
                                htmlcontent += '995473';
                              }
                            }
                          htmlcontent += '</td>';
                          htmlcontent += '<td valign="top" align="right" style="border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">'+ invoiceobj.amcdata.price[amccnt].pre_taxed_cost.toFixed(2) +'</td>';
                          
                          if(invoiceobj.is_igst == 1) {

                          htmlcontent += '<td valign="top" align="center" style="border-right: 1px solid #000000;  padding: 0px; font-size: 12px;">';
                            htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                              htmlcontent += '<tr>';
                                htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">18%</td>';
                                htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 12px;">'+ invoiceobj.amcdata.price[amccnt].gst_tax.toFixed(2) +'</td>';
                              htmlcontent += '</tr>';
                            htmlcontent += '</table>';
                          htmlcontent += '</td>';

                          } else {

                          htmlcontent += '<td valign="top" align="center" style="border-right: 1px solid #000000;  padding: 0px; font-size: 12px;">';
                            htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                              htmlcontent += '<tr>';
                                htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">9%</td>';
                                htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 12px;">'+ invoiceobj.amcdata.price[amccnt].cgst_tax.toFixed(2) +'</td>';
                              htmlcontent += '</tr>';
                            htmlcontent += '</table>';
                          htmlcontent += '</td>';
                          
                          htmlcontent += '<td valign="top" align="center" style="padding: 0px; font-size: 12px;">';
                            htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                              htmlcontent += '<tr>';
                                htmlcontent += '<td align="right"  style="width: 50%; border-right: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">9%</td>';
                                htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 12px;">'+ invoiceobj.amcdata.price[amccnt].cgst_tax.toFixed(2) +'</td>';
                              htmlcontent += '</tr>';
                            htmlcontent += '</table>';
                          htmlcontent += '</td>';

                          }
                        
                        htmlcontent += '</tr>';

                        pre_taxed_cost_total += parseFloat(invoiceobj.amcdata.price[amccnt].pre_taxed_cost);
                            cgst_tax += invoiceobj.amcdata.price[amccnt].cgst_tax;
                            sgst_tax += invoiceobj.amcdata.price[amccnt].sgst_tax;
                            igst_tax += invoiceobj.amcdata.price[amccnt].gst_tax;

                        amccnt++;

                      });

                        }

                    // htmlcontent += '<tr>';
                    //  htmlcontent += '<td style="width: 40%; border-right: 1px solid #000000; padding: 3px;" valign="top">998724</td>';
                    //  htmlcontent += '<td valign="top" align="right" style="border-right: 1px solid #000000; padding: 3px;">5,000.00</td>';
                    //  htmlcontent += '<td valign="top" align="center" style="border-right: 1px solid #000000;">';
                    //    htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    //      htmlcontent += '<tr>';
                    //        htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000; padding: 3px;">9%</td>';
                    //        htmlcontent += '<td align="right" style="width: 50%; padding: 3px;">450.00</td>';
                    //      htmlcontent += '</tr>';
                    //    htmlcontent += '</table>';
                    //  htmlcontent += '</td>';
                    //  htmlcontent += '<td valign="top" align="center">';
                    //    htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    //      htmlcontent += '<tr>';
                    //        htmlcontent += '<td align="right"  style="width: 50%; border-right: 1px solid #000000; padding: 3px;">9%</td>';
                    //        htmlcontent += '<td align="right" style="width: 50%; padding: 3px;">450.00</td>';
                    //      htmlcontent += '</tr>';
                    //    htmlcontent += '</table>';
                    //  htmlcontent += '</td>';
                    // htmlcontent += '</tr>';

                    // htmlcontent += '<tr>';
                    //  htmlcontent += '<td style="width: 40%; border-right: 1px solid #000000;padding: 3px;" valign="top">995479</td>';
                    //  htmlcontent += '<td valign="top" align="right" style="border-right: 1px solid #000000;">5,000.00</td>';
                    //  htmlcontent += '<td valign="top" align="center" style="border-right: 1px solid #000000;">';
                    //    htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    //      htmlcontent += '<tr>';
                    //        htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000;padding: 3px;">9%</td>';
                    //        htmlcontent += '<td align="right" style="width: 50%;padding: 3px;">450.00</td>';
                    //      htmlcontent += '</tr>';
                    //    htmlcontent += '</table>';
                    //  htmlcontent += '</td>';
                    //  htmlcontent += '<td valign="top" align="center">';
                    //    htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    //      htmlcontent += '<tr>';
                    //        htmlcontent += '<td align="right"  style="width: 50%; border-right: 1px solid #000000;padding: 3px;">9%</td>';
                    //        htmlcontent += '<td align="right" style="width: 50%; padding: 3px;">450.00</td>';
                    //      htmlcontent += '</tr>';
                    //    htmlcontent += '</table>';
                    //  htmlcontent += '</td>';
                    // htmlcontent += '</tr>';

                    htmlcontent += '<tr>';
                      htmlcontent += '<td style="width: 40%; border-top: 1px solid #000000; border-right: 1px solid #000000;padding: 3px; text-align: right; font-size: 12px;" valign="top" align="right"><span style="font-weight: 700">Total</span></td>';
                      htmlcontent += '<td valign="top" align="right" style="border-top: 1px solid #000000; border-right: 1px solid #000000;padding: 3px; text-align: right; font-size: 12px;"><span style="font-weight: 700">'+ pre_taxed_cost_total.toFixed(2) +'</span></td>';
                      
                      if(invoiceobj.is_igst == 1) {

                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; border-right: 1px solid #000000; padding: 0px; font-size: 12px;">';
                        htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000;padding: 3px;">&nbsp;</td>';
                            htmlcontent += '<td align="right" style="width: 50%;padding: 3px; text-align: right; font-size: 12px;"><span style="font-weight: 700">'+ igst_tax.toFixed(2) +'</span></td>';
                          htmlcontent += '</tr>';
                        htmlcontent += '</table>';
                      htmlcontent += '</td>';

                      } else {

                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; border-right: 1px solid #000000; padding: 0px; font-size: 12px;">';
                        htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td align="right" align="center" style="width: 50%; border-right: 1px solid #000000;padding: 3px;">&nbsp;</td>';
                            htmlcontent += '<td align="right" style="width: 50%;padding: 3px; text-align: right; font-size: 12px;"><span style="font-weight: 700">'+ cgst_tax.toFixed(2) +'</span></td>';
                          htmlcontent += '</tr>';
                        htmlcontent += '</table>';
                      htmlcontent += '</td>';
                      
                      htmlcontent += '<td valign="top" align="center" style="border-top: 1px solid #000000; padding: 0px; font-size: 12px;">';
                        htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                          htmlcontent += '<tr>';
                            htmlcontent += '<td align="right"  style="width: 50%; border-right: 1px solid #000000;padding: 3px;">&nbsp;</td>';
                            htmlcontent += '<td align="right" style="width: 50%; padding: 3px; text-align: right; font-size: 12px;"><span style="font-weight: 700">'+ sgst_tax.toFixed(2) +'</span></td>';
                          htmlcontent += '</tr>';
                        htmlcontent += '</table>';
                      htmlcontent += '</td>';

                      }
                    
                    htmlcontent += '</tr>';

                  htmlcontent += '</table>';
                  
                htmlcontent += '</td>';
              htmlcontent += '</tr>';

              if(invoiceobj.is_igst == 1) {

              htmlcontent += '<tr>';
                htmlcontent += '<td style="border-top: 1px solid #000000; padding: 3px; font-size: 12px;" colspan="2">';
                  htmlcontent += '<small>Tax Amount (in words) : <span style="font-weight: 700">INR '+ inWords(igst_tax) +' Only</span></small>';
                htmlcontent += '</td>';
              htmlcontent += '</tr>';                

              } else {

              htmlcontent += '<tr>';
                htmlcontent += '<td style="border-top: 1px solid #000000; padding: 3px; font-size: 12px;" colspan="2">';
                  htmlcontent += '<small>Tax Amount (in words) : <span style="font-weight: 700">INR '+ inWords(cgst_tax + sgst_tax) +' Only</span></small>';
                htmlcontent += '</td>';
              htmlcontent += '</tr>';

              }

              htmlcontent += '<tr>';
                htmlcontent += '<td colspan="2" style="padding: 3px;">';
                  htmlcontent += '&nbsp;';
                htmlcontent += '</td>';
              htmlcontent += '</tr>';

              htmlcontent += '<tr>';
                htmlcontent += '<td style="width: 50%; padding: 3px; font-size: 12px;">';
                  // htmlcontent += 'Companys PAN : <span style="font-weight: 700">AAJCM6704H</span><br /><br />';
                  htmlcontent += '<span style="text-decoration: underline;">Declaration</span><br />';
                  htmlcontent += 'We declare that this invoice shows the actual price of the service provided and that all the particulars are tru and correct.<br /><br />';
                  htmlcontent += 'Kindly address the cheque to - <span style="font-weight: 700">Mister Homecare Services Pvt. Ltd.</span><br />';
                  htmlcontent += 'For online payment- <a href="'+ invoiceobj.payment_link +'">Click here</a>';
                htmlcontent += '</td>';
                htmlcontent += '<td style="width: 50%; padding: 0px; vertical-align: bottom; font-size: 12px;" valign="bottom">';
                  
                  htmlcontent += '<table align="center" border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">';
                    htmlcontent += '<tr>';
                      htmlcontent += '<td align="right" style="border-top: 1px solid #000000; border-left: 1px solid #000000; padding: 3px; text-align: right; font-size: 12px;">';
                        htmlcontent += 'for Mister Homecare Services Private Limited<br /><br /><br /><br />';
                        htmlcontent += 'Varun Vaz - CRM Account Manager<br />';
                        htmlcontent += 'Authorised Signatory';
                      htmlcontent += '</td>';
                    htmlcontent += '</tr>';
                  htmlcontent += '</table>';

                htmlcontent += '</td>';
              htmlcontent += '</tr>';


          htmlcontent += '</table>';


        htmlcontent += '</td>';
      htmlcontent += '</tr>';
    htmlcontent += '</table>';





        angular.element('#invoice_html_content').html(htmlcontent);
      $scope.invoice_html_content = htmlcontent;



    }

    $scope.setCustomerInvoiceType = function(invoice_type_val){
      $scope.customer_invoice_type = invoice_type_val;
    };

    $scope.printInvoice = function(index) {

      // debugger;
      var serviceIdsArr = [];
      $scope.leadIndex = index;
      $scope.customer_invoice_type = 0;

      console.log($scope.leads[index]);

      invoice_mode = $scope.leads[index].invoice_mode;
      bool = true;
      $scope.isNextClick = false;
      $scope.isNextVisible = true;
      $scope.isNextEnabled = true;

      console.log("Print Invoice Button Clicked");
      console.log($scope.isCheckAll);
      getAllChecked(false);

      document.getElementById('all').checked = false;


      // var checkedValues = angular.element('input[name="selectedService"]:checked').map(function() {
      //     return this.value;
      // }).get();

      // console.log(checkedValues);






      // angular.forEach($scope.leads[index].service_obj,function(value,key){
      //   serviceIdsArr.push(value._id);
      // });





      $scope.services_obj = $scope.leads[index].service_obj;

      // //console.log($scope.leads[index]);

      // console.log(selectedServiceIdsArr.length)
      // console.log(selectedServiceIdsArr);




    };

    // $scope.$watch('isCheckAll',function(newValue,oldValue){
    //   console.log(newValue);
    //   console.log(invoice_mode);
    //   //debugger;
    //   if(newValue == true && invoice_mode == 1) {
    //     //debugger;
    //     getAllChecked(true);
    //   }
    // });

    $scope.getCheckedValues = function() {

      var sIdsArr = getSelectedValues();

      if(sIdsArr.length > 0) {

        var invoiceInput = {
          lead_id: $scope.leads[$scope.leadIndex]._id,
          serviceid_arr: sIdsArr,
          send_sms: 'False',
          invoice_type: $scope.customer_invoice_type
        };

        //var invoiceData = {};
        //var lead_id = $scope.leads[$scope.leadIndex]._id;

        console.log(invoiceInput);

        // LeadService.generateInvoice(invoiceInput).then(function(response){
        //   invoiceobj = response.data.message;
        //   $scope.isNextEnabled = false;
        //   console.log(invoiceobj);
        // });

        var invoice_data = {
          lead_id: $scope.leads[$scope.leadIndex]._id,
          serviceid_arr: sIdsArr
        };

        console.log(invoice_data);

        LeadService.getInvoiceData(angular.toJson(invoice_data)).then(function(response){
            console.log(response.data);
            invoiceobj = response.data;
            $scope.isNextEnabled = false;          
        });

      }

    }

    $scope.search = function() {

      var searchFilters = {};

      if($scope.filter1 != "" && $scope.filter_keyword1 != "") {
        if($scope.filter1 == "leadowner") {
          searchFilters.leadowner = $scope.filter_keyword1;
        } else if($scope.filter1 == "leadsource") {
          searchFilters.leadsource = $scope.filter_keyword1;
        }
      }

      if($scope.filter2 != "" && $scope.filter_keyword2 != "") {
        if($scope.filter2 == "leadowner") {
          searchFilters.leadowner = $scope.filter_keyword2;
        } else if($scope.filter2 == "leadsource") {
          searchFilters.leadsource = $scope.filter_keyword2;
        }
      }

      if($scope.filter_date != "") {
        searchFilters.created_on = (new Date($scope.filter_date)).toISOString();
      }

    console.log(searchFilters);


      console.log($scope.filter1);
      console.log($scope.filter_keyword1);
      console.log($scope.filter2);
      console.log($scope.filter_keyword2);
      console.log($filter('date')($scope.filter_date,'yyyy-MM-dd'));
    };

    $scope.resetSelect = function() {
    	angular.element('select').material_select();
    }

    // $scope.calcDiscount = function() {
    // 	$scope.partner_comission = (parseInt($scope.client_payment_expected) - parseInt($scope.base_rate)) - parseInt($scope.discount);
    // 	$scope.pre_taxed_cost = (parseInt($scope.base_rate)/1.15).toFixed(2);
    // }

    // $scope.$watch(
    //   'client_payment_expected',
    //   function(newValue,oldValue){
    //     console.log("CPE: "+newValue);
    //     $scope.partner_comission = parseInt(newValue) - (parseInt($scope.base_rate) - parseInt($scope.discount));
    //     $scope.post_taxed_cost = parseInt(newValue);
    //   }
    // );

    // $scope.$watch(
    //   'discount',
    //   function(newValue,oldValue){
    //     console.log("D: "+newValue);
    //     //$scope.discount = newValue;
    //     c = parseInt($scope.base_rate) - parseInt(newValue);
    //     $scope.client_payment_expected = parseInt($scope.base_rate) - (parseInt(newValue) + parseInt($scope.promocode_discount));
    //     $scope.partner_comission = parseInt($scope.client_payment_expected) - (parseInt($scope.base_rate) - (parseInt(newValue) + parseInt($scope.promocode_discount)));
    //   }
    // );

    // $scope.$watch(
    //   'promocode_discount',
    //   function(newValue,oldValue){
    //     console.log("D: "+newValue);
    //     //$scope.discount = newValue;
    //     c = parseInt($scope.base_rate) - parseInt(newValue);
    //     $scope.client_payment_expected = parseInt($scope.base_rate) - (parseInt(newValue) + parseInt($scope.discount));
    //     $scope.partner_comission = parseInt($scope.client_payment_expected) - (parseInt($scope.base_rate) - (parseInt(newValue) + parseInt($scope.discount)));
    //   }
    // );

    // $scope.$watch(
    //   'base_rate',
    //   function(newValue,oldValue){
    //     console.log("BR: "+newValue);
    //     $scope.post_taxed_cost = parseInt(newValue) - (parseInt($scope.discount) + parseInt($scope.promocode_discount));
    //     $scope.client_payment_expected = parseInt(newValue) - (parseInt($scope.discount) + parseInt($scope.promocode_discount));
    //     $scope.partner_comission = parseInt($scope.client_payment_expected) - (parseInt(newValue) - (parseInt($scope.discount) + parseInt($scope.promocode_discount)));
    //   }
    // );

    // $scope.$watch(
    //   'post_taxed_cost',
    //   function(newValue,oldValue){
    //     console.log("PTC: "+newValue);
    //     $scope.pre_taxed_cost = (parseInt(newValue)/1.18).toFixed(2);
    //   }
    // );

    // $scope.updatePrice = function() {
    //   $scope.client_payment_expected = $scope.base_rate;
    // };

    $scope.setLeadSource = function(ls) {
    	$scope.lead_source = ls;

      var updateVal = {
        leadsource: ls
      }

      var update_order_lead_obj = {
        leadsource: ls,
        leadowner: $scope.leadDetails.leadowner,
        billing_name: $scope.leadDetails.billing_name,
        billing_address: $scope.leadDetails.billing_address
      };

      var order_lead_obj = {
        leadmanager_obj: update_order_lead_obj
      };

      if($scope.isUpdateLead == true) {

        SweetAlert.swal({
        title: 'Do you want to change lead source?',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, do it.",
        closeOnConfirm: false
      },  function(isConfirm){

        if(isConfirm) {

          if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {        

            LeadService.updateLeadInfo(updateVal,$scope.leadId).then(function(response){

                if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

                  OrderService.updatedLeadOrder(order_lead_obj,selected_service_id).then(function(res){              
                  });

                }

                angular.forEach($scope.service_details_arr,function(value,key){

                  if(value._id != undefined && value._id != null && value._id != "") {

                    LeadService.updateServiceInfo(updateVal,value._id).then(function(r2){
                      console.log("Service Updated");
                    });

                  }

                });

                SweetAlert.swal("Updated!", "Lead source has been updated.", "success");
            });

          }

        } else {

        swal("Cancelled", "Lead source not updated", "error");

      }

      });

        angular.forEach($scope.leadDetails.service_obj,function(value,key){

          if(value._id != undefined && value._id != null && value._id != "") {

            LeadService.updateServiceInfo(updateVal,value._id).then(function(){

            });

          }

        });


      }

    }

    $scope.updateCity = function() {
      $scope.client_details.city = $scope.lead_city;

      var updateVal = {
        city: $scope.lead_city
      };

      if($scope.isUpdateLead == true) {

        if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

          LeadService.updateLeadInfo(updateVal,$scope.leadId).then(function(response){
              SweetAlert.swal("Updated!", "Lead city has been updated.", "success");
              angular.element('#city_modal').closeModal();
          });

        }

        angular.forEach($scope.leadDetails.service_obj,function(value,key){

          if(value._id != undefined && value._id != null && value._id != "") {

            LeadService.updateServiceInfo(updateVal,value._id).then(function(){
            });

            OrderService.updatedLeadOrder(updateVal,value._id).then(function(res){              
            });

          }

        });


      }


    };

    $scope.updateCityView = function(key) {
      $scope.client_details.city = key;
    }

    $scope.updateBillingName = function() {

      var updateVal = {
        billing_name: $scope.billing_name
      }

      var update_order_lead_obj = {
        leadsource: $scope.leadDetails.leadsource,
        leadowner: $scope.leadDetails.leadowner,
        billing_name: $scope.billing_name,
        billing_address: $scope.leadDetails.billing_address
      };

      var order_lead_obj = {
        leadmanager_obj: update_order_lead_obj
      };

      //if($scope.isUpdateLead == true) {

        if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

          LeadService.updateLeadInfo(updateVal,$scope.leadId).then(function(response){

              if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

                OrderService.updatedLeadOrder(order_lead_obj,selected_service_id).then(function(res){              
                });

              }

              SweetAlert.swal("Updated!", "Billing name has been updated.", "success");
              angular.element('#billing_name_temp').closeModal();
          });

        }

      //}
    }

    $scope.updateCustomerId = function() {

      var updateVal = {
        customer_id: $scope.customerId
      }

      //if($scope.isUpdateLead == true) {

        if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

          LeadService.updateLeadInfo(updateVal,$scope.leadId).then(function(response){
              SweetAlert.swal("Updated!", "Customer id has been updated.", "success");
              angular.element('#customer_id_temp').closeModal();
          });

        }

      //}
    }

    $scope.updateBillingAddress = function() {

      var updateVal = {
        billing_address: $scope.billing_address
      }

      var update_order_lead_obj = {
        leadsource: $scope.leadDetails.leadsource,
        leadowner: $scope.leadDetails.leadowner,
        billing_name: $scope.leadDetails.billing_name,
        billing_address: $scope.billing_address
      };

      var order_lead_obj = {
        leadmanager_obj: update_order_lead_obj
      };


      //if($scope.isUpdateLead == true) {

        if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

          LeadService.updateLeadInfo(updateVal,$scope.leadId).then(function(response){

              if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

                OrderService.updatedLeadOrder(order_lead_obj,selected_service_id).then(function(res){              
                });

              }

              SweetAlert.swal("Updated!", "Billing address has been updated.", "success");
              angular.element('#billing_address_temp').closeModal();
          });

        }

      //}
    }

    // $scope.editLead = function() {
    //   $scope.isUpdateLead = true;
    // };

    $scope.setInvoiceMode = function(im) {
    	$scope.invoice_mode = im;

      var updateVal = {
        invoice_mode: im
      }

      if($scope.isUpdateLead == true) {

        if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

          LeadService.updateLeadInfo(updateVal,$scope.leadId).then(function(response){
              SweetAlert.swal("Updated!", "Invoice mode has been updated.", "success");
          });

        }

      }
    };

    $scope.setClientType = function(cl) {
      
      $scope.customer_label = cl;

      var updateVal = {
        customer_label: cl
      }

      if($scope.isUpdateLead == true) {

        if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

          LeadService.updateLeadInfo(updateVal,$scope.leadId).then(function(response){
              SweetAlert.swal("Updated!", "Customer type has been updated.", "success");
          });

        }

      }

    };

    $scope.setReminder = function() {
    	console.log($scope.reminder);

      var updateVal = {};

      if($scope.reminder != "") {
        updateVal = {
          reminder: (new Date($scope.reminder)).toISOString()
        };
      } else {
        updateVal = {
          reminder: ""
        };       
      }

      if($scope.isUpdateLead == true) {

        if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

          LeadService.updateLeadInfo(updateVal,$scope.leadId).then(function(response){
              angular.element('#add_reminder').closeModal();
              SweetAlert.swal("Updated!", "Reminder set", "success");
          });

        }

      }

    }


    $scope.setLeadId = function(id){
      $scope.lead_id = id;
      //$scope.leadIndex = index;
    };

    $scope.updateBaseRate = function() {


      var service_tax = (parseFloat($scope.pre_taxed_cost) * parseInt($scope.taxes_options[0].value))/100;
      var kk_tax = (parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[2].value))/100;
      var cess_tax = (parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[1].value))/100;

      //if($scope.currentUser.email == 'tanveer.khan@mrhomecare.in') {
        var cgst_tax = (parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[3].value))/100;
        var sgst_tax = (parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[4].value))/100;
        var gst_tax = (parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[5].value))/100;

        var updateVal = {
          taxed_cost: parseInt($scope.base_rate),
          pre_taxed_cost: parseFloat($scope.pre_taxed_cost),
          client_payment_expected: parseInt($scope.client_payment_expected),
          service_tax: service_tax,
          kk_tax: kk_tax,
          cess_tax: cess_tax,
          cgst_tax: cgst_tax,
          sgst_tax: sgst_tax,
          gst_tax: gst_tax
        };

        console.log(updateVal);


      // } else {

      //   var updateVal = {
      //     taxed_cost: parseInt($scope.base_rate),
      //     pre_taxed_cost: $scope.pre_taxed_cost,
      //     service_tax: service_tax,
      //     kk_tax: kk_tax,
      //     cess_tax: cess_tax        
      //   };

      // }



      console.log(updateVal);

      var lead_service_obj_arr = $scope.leadDetails.service_obj_arr;

      console.log("Service Index: " + $scope.serviceIndex);
      console.log("Service Array: " + lead_service_obj_arr);

      var old_base_rate = lead_service_obj_arr[$scope.serviceIndex].taxed_cost;
      var client_name = $scope.leadDetails.client_details.firstname + ' ' + $scope.leadDetails.client_details.lastname;
      var client_contact = $scope.leadDetails.client_details.primary_contact_no;
      var new_base_rate = $scope.base_rate;

      lead_service_obj_arr[$scope.serviceIndex].taxed_cost = $scope.base_rate;

      console.log(selected_service_obj);

      var update_service_lead_obj = {
        service_id: selected_service_obj['service_id'],
        variant_type_id: selected_service_obj['variant_type_id'],
        taxed_cost: lead_service_obj_arr[$scope.serviceIndex].taxed_cost,
        service_date: selected_service_obj['service_date']
      };



      var service_order_obj = {
        service_obj: update_service_lead_obj
      };

      var updateValLead = {
        service_obj_arr: lead_service_obj_arr
      };

      if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

        LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){
              
              if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

                LeadService.updateLeadInfo(updateValLead,$scope.leadId).then(function(res){
                  //console.log(res);
                });

              }

              OrderService.updatedLeadOrder(service_order_obj,selected_service_id).then(function(resp){
              });


              if($scope.base_rate != 0 && $scope.base_rate != undefined && $scope.base_rate != null && $scope.base_rate != "") {

                var message = 'Customer Name: ' + client_name + '<br />';
                message += 'Client Contact No.: ' + client_contact + '<br />';
                message += 'Old Base Rate: ' + old_base_rate + '<br />';
                message += 'New Base Rate: ' + new_base_rate + '<br />';
                message += 'Updated by: ' + $scope.currentUser.name;

                var emailData = {
                  'to': 'tanveer.khan@mrhomecare.in',
                  'subject': 'Base Rate Changed - Mr. Homecare',
                  'cc': '',
                  'body': message
                };

                //console.log(data);

                LeadService.sendEmail(emailData).then(function(res){
                    if(res.status == 200 && res.statusText == "OK") {
                      //SweetAlert.swal("Success!", "Quotation sent to user.", "success");
                    }
                });

              }


              angular.element('#base_rate_temp').closeModal();

              SweetAlert.swal("Updated!", "Base rate updated.", "success");

              //$route.reload();
        });

      }


    };

    $scope.apply_promocode_not_closed = function(service,index) {

      if($scope.client_details == undefined || $scope.client_details._id == undefined || $scope.client_details._id == null || $scope.client_details._id == "") {
        return;
      }

      if($scope.promo_code == undefined && $scope.promo_code == null && $scope.promo_code == '') {

        SweetAlert.swal("Error!", "Please enter promocode", "error");

      }

      if($scope.promo_code != undefined && $scope.promo_code != null && $scope.promo_code != '') {


        SweetAlert.swal({
          title: 'Do you really want to apply this promocode?',
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes",
          closeOnConfirm: false,
          showLoaderOnConfirm: true
        },  function(isConfirm){

          if(isConfirm) {

            var referred_id = $scope.client_details._id;
            var discount_t = (parseInt(service.taxed_cost) * parseInt($scope.discount_percentage)) / 100;
            $scope.discount = discount_t;
            var promocode = $scope.promo_code[index];

            var promocode_data = {
              'referred_id': referred_id,
              'amount': discount_t,
              'promocode': promocode 
            };      


            LeadService.checkPromocode(angular.toJson(promocode_data)).then(function(response){

              console.log(response);
              if(response.data != undefined && response.data != null) {

                if(response.data.data != undefined && response.data.data != null && response.data.data == 1 && response.data.code == 200) {
                  //$scope.discount = 0;
                  SweetAlert.swal("Warning!", response.data.msg, "info");
                }

                if(response.data.data != undefined && response.data.data != null && response.data.data == 0 && response.data.code == 200) {
                  //$scope.discount = parseInt(discount_t);
                  $scope.client_payment_expected = parseInt(service.taxed_cost) - parseInt($scope.discount);

                  console.log(promocode_data);
                  $scope.base_rate = service.taxed_cost;
                  $scope.pre_taxed_cost = ($scope.client_payment_expected / 1.18).toFixed(2);
                  $scope.post_taxed_cost = $scope.client_payment_expected;

                  $scope.service_details_arr[index].discount = $scope.discount;
                  $scope.service_details_arr[index].client_payment_expected = $scope.client_payment_expected;
                  $scope.service_details_arr[index].base_rate = service.taxed_cost;
                  $scope.service_details_arr[index].pre_taxed_cost = parseFloat($scope.pre_taxed_cost);
                  $scope.service_details_arr[index].post_taxed_cost = $scope.post_taxed_cost;

                  var pre_taxed_cost = parseFloat($scope.pre_taxed_cost);
                  var sgst = (pre_taxed_cost * 9) / 100;
                  var cgst = (pre_taxed_cost * 9) / 100;
                  var gst = (pre_taxed_cost * 18) / 100;

                  var updateVal = {
                    'discount': $scope.discount,
                    'client_payment_expected': $scope.client_payment_expected,
                    'taxed_cost': service.taxed_cost,
                    'pre_taxed_cost': parseFloat($scope.pre_taxed_cost),
                    'promo_code': promocode,
                    'sgst_tax': sgst,
                    'cgst_tax': cgst,
                    'gst': gst
                  };

                  if(service._id != undefined && service._id != null && service._id != "") {

                    LeadService.updateServiceInfo(updateVal,service._id).then(function(){
                    });

                  }

                  
                  SweetAlert.swal("Success!", response.data.msg, "success");
                }

                if(response.data.code == 202) {
                  //$scope.discount = 0;
                  SweetAlert.swal("Warning!", response.data.msg, "info");
                }

              }

            });




          } else {


          }

        });



      }

    };

     $scope.apply_promocode = function() {

      //$scope.service_details_arr[index] =

      if($scope.client_details == undefined || $scope.client_details._id == undefined || $scope.client_details._id == null || $scope.client_details._id == "") {
        return;
      }

      var referred_id = $scope.client_details._id;
      var discount_t;

      if($scope.promo_code != undefined && $scope.promo_code != null && $scope.promo_code != '') {

        SweetAlert.swal({
          title: 'Do you really want to apply this promocode?',
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes",
          closeOnConfirm: false,
          showLoaderOnConfirm: true
        },  function(isConfirm){

          if(isConfirm) {

            if($scope.discount != undefined && $scope.discount != null && $scope.discount != "") {
              discount_t = ((parseInt($scope.base_rate) - parseInt($scope.discount)) * parseInt($scope.discount_percentage)) / 100;
            } else {
              discount_t = (parseInt($scope.base_rate) * parseInt($scope.discount_percentage)) / 100;
            }
            
            $scope.discount = parseInt(discount_t);


            var amount = 0;

            if(discount_t != undefined && discount_t != null && discount_t != "" && discount_t != 0) { 
              amount = ((parseInt($scope.base_rate) - parseInt(discount_t)) * parseInt($scope.discount_percentage)) / 100;
            }

            var promocode = $scope.promo_code;

            var promocode_data = {
              'referred_id': referred_id,
              'amount': amount,
              'promocode': promocode 
            };

            console.log(promocode_data);

            LeadService.checkPromocode(angular.toJson(promocode_data)).then(function(response){

              console.log(response);
              if(response.data != undefined && response.data != null) {

                if(response.data.data != undefined && response.data.data != null && response.data.data == 1 && response.data.code == 200) {
                  $scope.discount = 0;
                  SweetAlert.swal("Warning!", response.data.msg, "info");
                }

                if(response.data.data != undefined && response.data.data != null && response.data.data == 0 && response.data.code == 200) {
                  $scope.discount = parseInt(discount_t);
                  SweetAlert.swal("Success!", response.data.msg, "success");
                }

                if(response.data.code == 202) {
                  $scope.discount = 0;
                  SweetAlert.swal("Warning!", response.data.msg, "info");
                }

              }

            });

          } else {

            $scope.discount = 0;

          }

        });

        
      } else {

        $scope.discount = 0;

      }






      //console.log($scope.client_details);

      //debugger;

      //$scope.discount = 0;


      //debugger;

      //console.log(index);
      //console.log($scope.discount);

      //$scope.discount = service.discount + discount_t;

      // $scope.promocode_discount = discount_t;

      // $scope.client_payment_expected = parseInt(service.taxed_cost) - (parseInt(discount_t) + $scope.discount);

      // // // $scope.discount = discount_t;

      // // $scope.client_payment_expected = parseInt(service.taxed_cost) - parseInt(discount_t);
      //$scope.base_rate = service.taxed_cost;
      //$scope.pre_taxed_cost = ($scope.client_payment_expected / 1.18).toFixed(2);
      //$scope.post_taxed_cost = $scope.client_payment_expected;


      // // console.log($scope.discount);

      // $scope.service_details_arr[index].discount = $scope.discount;
      // $scope.service_details_arr[index].client_payment_expected = $scope.client_payment_expected;
      // $scope.service_details_arr[index].base_rate = service.taxed_cost;
      // $scope.service_details_arr[index].pre_taxed_cost = parseFloat($scope.pre_taxed_cost);
      // $scope.service_details_arr[index].post_taxed_cost = $scope.post_taxed_cost;
      // $scope.service_details_arr[index].promocode_discount = $scope.promocode_discount;

      //debugger;
      //$scope.discount = $scope.discount;

      //debugger;


    };

    $scope.updateDiscount = function() {

      var updateVal = {
        discount: parseInt($scope.discount)
      };

      var lead_service_obj_arr = $scope.leadDetails.service_obj_arr;

      var old_discount = lead_service_obj_arr[$scope.serviceIndex].discount;
      var client_name = $scope.leadDetails.client_details.firstname + ' ' + $scope.leadDetails.client_details.lastname;
      var client_contact = $scope.leadDetails.client_details.primary_contact_no;
      var new_discount = $scope.discount;

      if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

        LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){
              angular.element('#discount_temp').closeModal();

              if($scope.discount != 0 && $scope.discount != undefined && $scope.discount != null && $scope.discount != "") {

                var message = 'Customer Name: ' + client_name + '<br />';
                message += 'Client Contact No.: ' + client_contact + '<br />';
                message += 'Old Discount: ' + old_discount + '<br />';
                message += 'New Discount: ' + new_discount + '<br />';
                message += 'Updated by: ' + $scope.currentUser.name;

                var emailData = {
                  'to': 'tanveer.khan@mrhomecare.in',
                  'subject': 'Discount Changed - Mr. Homecare',
                  'cc': '',
                  'body': message
                };

                //console.log(data);

                LeadService.sendEmail(emailData).then(function(res){
                    if(res.status == 200 && res.statusText == "OK") {
                      //SweetAlert.swal("Success!", "Quotation sent to user.", "success");
                    }
                });

              }


              SweetAlert.swal("Updated!", "Discount updated.", "success");
              // $route.reload();
        });

      }

    };

    $scope.updateClientPaymentExpected = function() {

      var updateVal = {
        client_payment_expected: parseInt($scope.client_payment_expected),
        partner_payment_payable: parseInt($scope.partner_comission)
      };

      var lead_service_obj_arr = $scope.leadDetails.service_obj_arr;

      var old_client_payment_expected = lead_service_obj_arr[$scope.serviceIndex].client_payment_expected;
      var client_name = $scope.leadDetails.client_details.firstname + ' ' + $scope.leadDetails.client_details.lastname;
      var client_contact = $scope.leadDetails.client_details.primary_contact_no;
      var new_client_payment_expected = $scope.client_payment_expected;

      if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

        LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){
              angular.element('#cpe_temp').closeModal();

              if($scope.client_payment_expected != 0 && $scope.client_payment_expected != undefined && $scope.client_payment_expected != null && $scope.client_payment_expected != "") {

                var message = 'Customer Name: ' + client_name + '<br />';
                message += 'Client Contact No.: ' + client_contact + '<br />';
                message += 'Old Client Payment Expected: ' + old_client_payment_expected + '<br />';
                message += 'New Client Payment Expected: ' + new_client_payment_expected + '<br />';
                message += 'Updated by: ' + $scope.currentUser.name;

                var emailData = {
                  'to': 'tanveer.khan@mrhomecare.in',
                  'subject': 'Client Payment Expected Changed - Mr. Homecare',
                  'cc': '',
                  'body': message
                };

                //console.log(data);

                LeadService.sendEmail(emailData).then(function(res){
                    if(res.status == 200 && res.statusText == "OK") {
                      //SweetAlert.swal("Success!", "Quotation sent to user.", "success");
                    }
                });

              }

              SweetAlert.swal("Updated!", "Client payment expected updated.", "success");
              //$route.reload();
        });

      }

    };

    $scope.setInvoiceType = function(it) {
    	$scope.invoice_type = it;

      var updateVal = {
        invoice_type: it
      }

      if($scope.isUpdateLead == true) {

        if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

          LeadService.updateLeadInfo(updateVal,$scope.leadId).then(function(response){
              SweetAlert.swal("Updated!", "Invoice type has been updated.", "success");
          });

        }

      }

    }

    $scope.setCustType = function(type) {
      //$scope.client_details.city = $scope.lead_city;

      $scope.cust_type = type;

      var updateVal = {
        client_type: $scope.cust_type
      };

      if($scope.isUpdateLead == true) {

        if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

          LeadService.updateLeadInfo(updateVal,$scope.leadId).then(function(response){
              SweetAlert.swal("Updated!", "Client type has been updated.", "success");
          });

        }

        angular.forEach($scope.leadDetails.service_obj,function(value,key){

          if(value._id != undefined && value._id != null && value._id != "") {

            LeadService.updateServiceInfo(updateVal,value._id).then(function(){
            });

            OrderService.updatedLeadOrder(updateVal,value._id).then(function(res){              
            });

          }

        });


      }


    };




    $scope.setService = function(single_service_obj) {


      console.log(single_service_obj);
      console.log(client_all_address);

      $scope.isServiceClosed = false;


      //var keyValueObj = {
        //'_id': id
      //}

      //var single_service_obj = {};

      //LeadService.getAllServices(keyValueObj).then(function(response){

          $scope.base_rate = 0;
          $scope.pre_taxed_cost = 0;
          $scope.partner_comission = 0;
          $scope.discount = 0;
          $scope.client_payment_expected = 0;

          //if($scope.isUpdateLead == true) {
            $scope.client_details.defaultAddress = client_all_address[single_service_obj.service_address];
          // } else {
          //   //$scope.client_details.defaultAddress = 
          // }
          //if(single_service_obj.discount != 0 && single_service_obj.discount != "") {
            //$scope.base_rate = parseInt(single_service_obj.taxed_cost) + parseInt(single_service_obj.discount);
          //} else {
            $scope.base_rate = single_service_obj.taxed_cost;
          //}
          $scope.pre_taxed_cost = single_service_obj.pre_taxed_cost;
          if(single_service_obj.partner_payment_payable > 0) {
            $scope.partner_comission = single_service_obj.partner_payment_payable;
          } else if(single_service_obj.partner_payment_recievable > 0) {
            $scope.partner_comission = single_service_obj.partner_payment_recievable * -1;
          }
          $scope.discount = single_service_obj.discount;
          $scope.client_payment_expected = single_service_obj.client_payment_expected;

          angular.forEach(single_service_obj.lead_history, function(value,key){
              if(value.lead_stage == 17) {
                $scope.isServiceClosed = true;
              }
            });

          $scope.lead_history_obj = single_service_obj.lead_history;
          selected_service_id = single_service_obj._id;
          selected_service_obj = single_service_obj;

      //});

    }

    $scope.calcPostTax = function() {
    	$scope.post_taxed_cost = parseInt($scope.base_rate) - parseInt($scope.discount);
    };

    $scope.changeAddress = function(address) {
    	console.log(address);

      var billing_address = "";

      $scope.isAddressSelected = true;

    	$scope.defaultAddress = address;
    	$scope.client_details.defaultAddress = address;

      if($scope.client_details.hasOwnProperty('defaultAddress') && $scope.client_details.defaultAddress != undefined) {

        billing_address = $scope.client_details.defaultAddress.address;
        
        if($scope.client_details.defaultAddress.location != "") {
          billing_address += ', ' + $scope.client_details.defaultAddress.location;
        }

        if($scope.client_details.defaultAddress.landmark != "") {
          billing_address += ', ' + $scope.client_details.defaultAddress.landmark;
        }

        if($scope.cities[$scope.client_details.defaultAddress.city] != "") {
          billing_address += ', ' + $scope.cities[$scope.client_details.defaultAddress.city];
        }

      }

      $scope.billing_address =  billing_address;

    	console.log($scope.client_details.defaultAddress);
    };

    $scope.addNewAddress = function() {
      $scope.isNewAddress = true;
      $scope.address = "";
      $scope.location = "";
      $scope.landmark = "";
    };

    $scope.cancelAddAddress = function() {
      $scope.isNewAddress = false;
      $scope.isEditAddress = false;
    };

    $scope.saveAddress = function() {

      $scope.clientAddress = {};

      $scope.old_address_id = [];
      $scope.client_id = $scope.client_details._id;
      $scope.addressObj = {
        'address': $scope.address,
        'landmark': $scope.landmark,
        'pincode': $scope.pincode,
        'location': $scope.location,
        'city': $scope.city
      };

      if($scope.client_details.address_details.length > 0) {

        angular.forEach($scope.client_details.address_details, function(value,key){
          $scope.old_address_id.push(value._id);
        });

      }

      $scope.clientAddress.old_address_id = $scope.old_address_id;
      $scope.clientAddress.client_id = $scope.client_id;
      $scope.clientAddress.addressObj = $scope.addressObj;

      ClientService.addClientAddress($scope.clientAddress).then(function(response){
        //$scope.clients = client.data.message;
        console.log(response);
        if(response.data.message.ok == 1) {
          //$rootScope.client_details.address_details.push($scope.addressObj);
          $scope.addresses.push(response.data.message.resp);
          $scope.client_details.address_details.push(response.data.message.resp);

          //console.log($scope.client_details.address_details);
          angular.forEach($scope.client_details.address_details,function(value,key){
              client_all_address[value._id] = value;
          });

          $scope.isNewAddress = false;
        }

      });


    };

    $scope.editAddress = function(ad,index) {
      $scope.isEditAddress = true;
      $scope.address = ad.address;
      $scope.pincode = ad.pincode;
      $scope.location = ad.location;
      $scope.landmark = ad.landmark;
      $scope.city = parseInt(ad.city);
      selected_address_id = ad._id;
      selected_address_index = index;
    };

    $scope.updateAddress = function() {
      var updateVal = {
        'address': $scope.address,
        'landmark': $scope.landmark,
        'pincode': $scope.pincode,
        'location': $scope.location,
        'city': $scope.city
      };

      ClientService.updateAddressInfo(updateVal,selected_address_id).then(function(response){
        console.log(response);

        $scope.client_details.address_details[selected_address_index] = response.data.message.resp;
        $scope.isEditAddress = false;
        // ClientService.getAllClients({'_id': $scope.client_details._id, 'status': 0}).then(function(client){
        //   //$scope.clients = client.data.message;
        //   // angular.forEach(client.data.message[0].address_details,function(value,key){
        //   //     client_all_address[value._id] = value;
        //   // });
        // });


      });

    }

    $scope.checkLeadStage = function(ls) {
      if(ls == 17) {
        $scope.isClosedService = true;
      } else {
        $scope.isClosedService = false;
      }
    }

    $scope.setServiceIndex = function(index) {
      $scope.serviceIndex = index;
    }

    $scope.updateServiceName = function() {

      var service_id = parseInt($scope.service_inquiry);

      //gst_tax:  ($scope.pre_taxed_cost != "" && $scope.pre_taxed_cost != undefined && $scope.pre_taxed_cost != 0) ? ((parseFloat($scope.pre_taxed_cost) * parseInt($scope.taxes_options[3].value))/100) : 0,

      //if($scope.currentUser.email == 'tanveer.khan@mrhomecare.in') {

        var updateVal = {
          service_id: parseInt($scope.service_inquiry),
          variant_type_id: parseInt($scope.variant_type),
          service_category_id: parseInt(service_categories_options[$scope.services_options[service_id]]),
          additional_variant: $scope.additional_variant,
          service_tax:  ($scope.pre_taxed_cost != "" && $scope.pre_taxed_cost != undefined && $scope.pre_taxed_cost != 0) ? ((parseFloat($scope.pre_taxed_cost) * parseInt($scope.taxes_options[0].value))/100) : 0,
          kk_tax: ($scope.pre_taxed_cost != "" && $scope.pre_taxed_cost != undefined && $scope.pre_taxed_cost != 0) ? ((parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[2].value))/100) : 0,
          cess_tax: ($scope.pre_taxed_cost != "" && $scope.pre_taxed_cost != undefined && $scope.pre_taxed_cost != 0) ? ((parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[1].value))/100) : 0,
          cgst_tax:  ($scope.pre_taxed_cost != "" && $scope.pre_taxed_cost != undefined && $scope.pre_taxed_cost != 0) ? ((parseFloat($scope.pre_taxed_cost) * parseInt($scope.taxes_options[3].value))/100) : 0,
          sgst_tax: ($scope.pre_taxed_cost != "" && $scope.pre_taxed_cost != undefined && $scope.pre_taxed_cost != 0) ? ((parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[4].value))/100) : 0,
          gst_tax: ($scope.pre_taxed_cost != "" && $scope.pre_taxed_cost != undefined && $scope.pre_taxed_cost != 0) ? ((parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[5].value))/100) : 0,
          partner_payment_recievable: $scope.partner_comission < 0 ? $scope.partner_comission : 0,
          partner_payment_payable: $scope.partner_comission > 0 ? $scope.partner_comission : 0,
          client_payment_expected: parseInt($scope.client_payment_expected),
          taxed_cost: parseInt($scope.post_taxed_cost),
          pre_taxed_cost: ($scope.pre_taxed_cost!="") ? $scope.pre_taxed_cost : 0
        }


      // } else {

      //   var updateVal = {
      //     service_id: parseInt($scope.service_inquiry),
      //     variant_type_id: parseInt($scope.variant_type),
      //     service_category_id: parseInt(service_categories_options[$scope.services_options[service_id]]),
      //     additional_variant: $scope.additional_variant,
      //     service_tax:  ($scope.pre_taxed_cost != "" && $scope.pre_taxed_cost != undefined && $scope.pre_taxed_cost != 0) ? ((parseFloat($scope.pre_taxed_cost) * parseInt($scope.taxes_options[0].value))/100) : 0,
      //     kk_tax: ($scope.pre_taxed_cost != "" && $scope.pre_taxed_cost != undefined && $scope.pre_taxed_cost != 0) ? ((parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[2].value))/100) : 0,
      //     cess_tax: ($scope.pre_taxed_cost != "" && $scope.pre_taxed_cost != undefined && $scope.pre_taxed_cost != 0) ? ((parseFloat($scope.pre_taxed_cost) * parseFloat($scope.taxes_options[1].value))/100) : 0,
      //     partner_payment_recievable: $scope.partner_comission < 0 ? $scope.partner_comission : 0,
      //     partner_payment_payable: $scope.partner_comission > 0 ? $scope.partner_comission : 0,
      //     client_payment_expected: parseInt($scope.client_payment_expected),
      //     taxed_cost: parseInt($scope.post_taxed_cost),
      //     pre_taxed_cost: ($scope.pre_taxed_cost!="") ? $scope.pre_taxed_cost : 0
      //   }


      // }


      if(angular.isNumber(updateVal['service_tax']) != true) {
        updateVal['service_tax'] = 0;
      }

      if(angular.isNumber(updateVal['kk_tax']) != true) {
        updateVal['kk_tax'] = 0;
      }

      if(angular.isNumber(updateVal['cess_tax']) != true) {
        updateVal['cess_tax'] = 0;
      }

      if(angular.isNumber(updateVal['cgst_tax']) != true) {
        updateVal['cgst_tax'] = 0;
      }

      if(angular.isNumber(updateVal['sgst_tax']) != true) {
        updateVal['sgst_tax'] = 0;
      }

      if(angular.isNumber(updateVal['gst_tax']) != true) {
        updateVal['gst_tax'] = 0;
      }

      var updateValOrder = {}

      if(updateVal['service_category_id'] == 11) {
        updateValOrder['vendor_allocated'] = 100;
      } else {
        updateValOrder['vendor_allocated'] = '';
      }


      console.log(selected_service_id);
      console.log(updateVal);

      if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

        LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){

          if(response.data.message.ok == 1) {

          angular.element('#service_name_modal').closeModal();
          SweetAlert.swal("Updated!", "Service details has been updated.", "success");
          $scope.service_details_arr[$scope.serviceIndex].service_id = $scope.service_inquiry;
          $scope.service_details_arr[$scope.serviceIndex].variant_type_id = $scope.variant_type;

          OrderService.updatedLeadOrder(updateValOrder,selected_service_id).then(function(resp){          
          });


          }

        });

      }



    }

    $scope.updateServiceAddress = function() {

      if($scope.defaultAddress != "" && $scope.defaultAddress != undefined && $scope.defaultAddress != null) {
        var updateVal = {
          service_address: $scope.defaultAddress._id
        }

        var updateValOrder = {
          address_details: $scope.defaultAddress._id
        }

        if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

          LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(){
            OrderService.updatedLeadOrder(updateValOrder,selected_service_id).then(function(resp){          
            });
            SweetAlert.swal("Updated!", "Service address has been updated.", "success");
          });

        }

      }

    };

    $scope.updateLeadStage = function() {

      var lead_stage_new_obj = {};
      var order_obj = {};
      var temp_service_date = [];
      var temp_service_time = [];
      var service_date_var = "";
      var service_time_var = "";
      var updateVal = {};


      if($scope.lead_stage != undefined) {

        lead_stage_new_obj = {
          lead_stage: parseInt($scope.lead_stage),
          lead_remark: $scope.lead_stage_remark,
          updated_on: (new Date()).toISOString(),
          updated_by: $scope.currentUser.name
        };

        angular.forEach($scope.lead_history_obj,function(value,key){
          delete value._id;
          delete value.$$hashKey;
        });


        $scope.lead_history_obj.push(lead_stage_new_obj);

      

        if($scope.lead_stage_options[$scope.lead_stage] == 'Closed') {

          var order_lead_obj = {};
          order_lead_obj = {
            leadsource: $scope.leadDetails.leadsource,
            leadowner: $scope.leadDetails.leadowner,
            billing_name: $scope.leadDetails.billing_name,
            billing_address: $scope.billing_address
          };

          if($scope.is_amc == true) {
          
            updateVal.contract_start_date = $scope.contract_start_date;
            updateVal.contract_end_date = $scope.contract_end_date;
            updateVal.frequency = parseInt($scope.frequency);
            updateVal.no_of_service = parseInt($scope.no_of_service);


            order_obj.contract_start_date = $scope.contract_start_date;
            order_obj.contract_end_date = $scope.contract_end_date;
            order_obj.frequency = parseInt($scope.frequency);
            order_obj.no_of_service = parseInt($scope.no_of_service);


            var dt1 = new Date($scope.contract_start_date + ' ' + $scope.service_time);
            $scope.service_time_arr.push(dt1.toISOString());

            temp_service_time = $scope.service_time_arr;


            // $scope.service_time_arr = [];
            temp_service_date = [];

          } else {

            if(($scope.service_date != "" && $scope.service_date != undefined) && ($scope.service_time != "" && $scope.service_time != undefined)) {

              for (var i = 0; i < $scope.duration; i++) {

                var dt = new Date($scope.service_date);
                dt.setDate(dt.getDate() + i);
                temp_service_date.push(dt.toISOString());

                var dt1 = new Date($scope.service_date + ' ' + $scope.service_time);
                dt1.setDate(dt1.getDate() + i);
                temp_service_time.push(dt1.toISOString());

              };

            }

          }



          var order_service_obj = {};
          order_service_obj = {
            service_id: parseInt(selected_service_obj.service_id),
            service_date: temp_service_date,
            taxed_cost: parseInt(selected_service_obj.taxed_cost),
            variant_type_id: (selected_service_obj.variant_type_id != undefined && selected_service_obj.variant_type_id != "") ? parseInt(selected_service_obj.variant_type_id) : ""
          };


          var full_name = '';

          if($scope.client_details.firstname != undefined && $scope.client_details.firstname != null && $scope.client_details.firstname != "") {
            full_name = $scope.client_details.firstname;
          }

          if($scope.client_details.lastname != undefined && $scope.client_details.lastname != null && $scope.client_details.lastname != "") {
            if(full_name != "") {
              full_name += ' ' + $scope.client_details.lastname;
            } else {
              full_name = $scope.client_details.lastname;
            }
          }

          order_obj.firstname = full_name;
          order_obj.primary_contact_no = $scope.client_details.primary_contact_no;
          order_obj.primary_email_id = $scope.client_details.primary_email_id;
          order_obj.address = $scope.client_details.defaultAddress.address;
          order_obj.city = ($scope.client_details.city != undefined && $scope.client_details.city != "") ? $scope.client_details.city : $scope.client_details.defaultAddress.city;
          order_obj.leadmanager_details = $scope.leadId;
          order_obj.client_details = $scope.client_details._id;
          order_obj.service_details = selected_service_id;
          order_obj.address_details = (selected_service_obj.service_address != undefined && selected_service_obj.service_address != "") ? selected_service_obj.service_address : $scope.client_details.defaultAddress._id;
          order_obj.service_obj = order_service_obj;
          order_obj.leadmanager_obj = order_lead_obj;
          order_obj.service_date = temp_service_date;
          order_obj.service_time = temp_service_time;
          order_obj.duration_of_service = $scope.duration;
          order_obj.is_amc = $scope.is_amc == true ? 1 : 0;
          order_obj.is_order = 1;
          order_obj.service_category_id = parseInt(service_categories_options[$scope.services_options[selected_service_obj.service_id]]);

          updateVal.lead_history = $scope.lead_history_obj,
          updateVal.service_date = temp_service_date,
          updateVal.service_time = temp_service_time,
          updateVal.is_order = 1,
          updateVal.status = 0,
          updateVal.leadsource = $scope.leadDetails.leadsource,
          updateVal.created_on = (new Date()).toISOString(),
          updateVal.is_amc = $scope.is_amc == true ? 1 : 0;
          updateVal.duration_of_service = $scope.duration;


          var dataObj = {
            orderData: order_obj,
            serviceData: updateVal
          }

          var lead_service_obj_arr = $scope.leadDetails.service_obj_arr;

          lead_service_obj_arr[$scope.serviceIndex].lead_history = $scope.lead_history_obj;
          lead_service_obj_arr[$scope.serviceIndex].service_date = temp_service_date;
          lead_service_obj_arr[$scope.serviceIndex].service_time = temp_service_time;

          var updateValLead = {
            service_obj_arr: lead_service_obj_arr
          };

          console.log(dataObj);

          console.log(updateValLead);

          LeadService.updateServiceLeadStage(dataObj).then(function(response){

            if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

              LeadService.updateLeadInfo(updateValLead,$scope.leadId).then(function(res){
                //console.log(res);
              });

            }

            angular.element('#update_leadstage').closeModal();
            SweetAlert.swal("Updated!", "Service details has been updated.", "success");
          });

          //console.log(order_obj);

        } else {

          var updateVal = {
            lead_history: $scope.lead_history_obj,
            status: 0
          }

          var lead_service_obj_arr = $scope.leadDetails.service_obj_arr;
          lead_service_obj_arr[$scope.serviceIndex].lead_history = $scope.lead_history_obj;

          var updateValLead = {
            service_obj_arr: lead_service_obj_arr
          };

          if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

            LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){

              if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

                LeadService.updateLeadInfo(updateValLead,$scope.leadId).then(function(res){
                  //console.log(res);
                });

              }

              angular.element('#update_leadstage').closeModal();
              SweetAlert.swal("Updated!", "Service details has been updated.", "success");
            });

          }


        }





      }


      var leadowners = [];
      var leadowner_length = 0;
      var lead_owner_new = "";

      if($scope.lead_owner == "API") {

        var updateLeadVal = {
          leadowner: $scope.currentUser.name
        };

        if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

          LeadService.updateLeadInfo(updateLeadVal,$scope.leadId).then(function(response){
              //SweetAlert.swal("Updated!", "Lead city has been updated.", "success");
          });

        }


      } else {

        if($scope.lead_owner != "") {
          leadowners.push($scope.lead_owner);
          leadowner_length = leadowners.length;
        }

        if(leadowners.length > 0) {
          if($scope.lead_owner.indexOf($scope.currentUser.name) == -1) {
            leadowners.push($scope.currentUser.name);
          }
        }

        if(leadowners.length > leadowner_length) {

          lead_owner_new = leadowners.join(" / ");

          var updateLeadVal = {
            leadowner: lead_owner_new
          };

          if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

            LeadService.updateLeadInfo(updateLeadVal,$scope.leadId).then(function(response){
                //SweetAlert.swal("Updated!", "Lead city has been updated.", "success");
            });

          }

        }

      }


      
      // console.log(lead_stage_new_obj);
      // console.log(selected_service_obj);




    };

    $scope.getAllServices = function() {



    };

    $scope.loadAllAMC = function(id) {

      console.log(id);

      var amc_services_obj = [];
      var currentDate = (new Date()).toISOString();

      LeadService.getAmcServices(id).then(function(response){

        angular.forEach(response.data.message,function(value,key){

          if(parseISO(value.service_date[0]) < parseISO(currentDate)) {
            value.is_done = 1;
          } else {
            value.is_done = 0;
          }

          amc_services_obj.push(value);

        });

        console.log(amc_services_obj);
        $scope.amc_services = amc_services_obj;
        //console.log(response);
      });

    };

    $scope.editService = function(service_id) {
      $scope.isServiceEditable = true;
      $scope.selected_service_id = service_id;
    };

    $scope.deleteService = function(index) {
      SweetAlert.swal({
        title: getRandomValue(myResArray),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },  function(isConfirm){

        if(isConfirm) {

        $scope.service_details_arr.splice(index,1);

        LeadService.deleteServiceInfo(selected_service_id).then(function(response){
          SweetAlert.swal("Deleted!", "Service has been deleted.", "success");
        });

      } else {

        swal("Cancelled", "Service not deleted", "error");

      }

      });
    }

    $scope.checkCancellation = function(val) {

      console.log(val);

      if($scope.cancellation_reasons[val] == 'Others') {
        $scope.isOther = true;
      } else {
        $scope.isOther = false;
      }

    };

    $scope.setCancellation = function() {

      angular.element('#cancel_service_modal').openModal();

    }

    $scope.cancelService = function() {

      if($scope.cancellation_reasons[$scope.cancellation_reason] != 'Others') {
        $scope.other_cancellation_reason = '';
      }
      

      SweetAlert.swal({
        title: getRandomValue(myResArray),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, cancel it!",
        closeOnConfirm: false
      },  function(isConfirm){

        if(isConfirm) {


        lead_stage_new_obj = {
          lead_stage: 35,
          lead_remark: 13,
          updated_on: (new Date()).toISOString(),
          updated_by: $scope.currentUser.name
        };

        angular.forEach($scope.lead_history_obj,function(value,key){
          delete value._id;
          delete value.$$hashKey;
        });


        $scope.lead_history_obj.push(lead_stage_new_obj);

        var updateVal = {
          lead_history: $scope.lead_history_obj,
          status: -1,
          cancellation_reason: $scope.cancellation_reason,
          other_cancellation_reason: $scope.other_cancellation_reason
        }

        if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

          LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){

              var email = $scope.client_details.primary_email_id;
              var firstname = $scope.client_details.firstname;
              var message = createRescheduledCancelledOrder(firstname);

              angular.element('#cancel_service_modal').closeModal();


              var updateValOrder = {
                'status': -1
              };

              OrderService.updatedLeadOrder(updateValOrder,selected_service_id).then(function(resp){          
              });


              SweetAlert.swal("Cancelled!", "Service has been cancelled.", "success");
              $route.reload();

              // var data = {
              //   'to': email,
              //   'subject': 'Cancelled/Rescheduled Service',
              //   'cc': 'customercare@mrhomecare.in',
              //   'body': message
              // };

              // LeadService.sendEmail(data).then(function(res){
              //   if(response.status == 200 && response.statusText == "OK") {

                  

              //     //SweetAlert.swal("Success!", "Email and SMS send to user.", "success");
              //   }
              // });

          });

        }


      } else {

        swal("Cancelled", "Service not cancelled", "error");

      }

      });

    }

    $scope.setServiceDate = function(index) {
      $scope.serviceIndex = index;
    };

    $scope.addServiceDate = function(index) {
      $scope.serviceIndex = index;
    };

    $scope.setAMCServiceDate = function(index,id,amc_service) {
      $scope.serviceIndex = index;
      $scope.selected_amc_service_id = id;
      $scope.selected_amc_service_obj = amc_service;

      console.log(id);
      console.log(amc_service);
    };

    $scope.setLeadServiceDate = function(index,id,lead_service_obj,serviceIndex) {
      $scope.serviceIndex = serviceIndex;
      $scope.serviceDateIndex = index;
      selected_service_id = id;
      console.log(id);
      console.log(lead_service_obj);
      selected_service_obj = lead_service_obj;
    };

    $scope.rescheduleService = function() {

      var service_date_obj = [];
      var service_time_obj = [];

      service_date_obj.push((new Date($scope.service_date)).toISOString());
      service_time_obj.push((new Date($scope.service_date + ' ' +$scope.service_time)).toISOString());


      lead_stage_new_obj = {
          lead_stage: 36,
          lead_remark: 12,
          updated_on: (new Date()).toISOString(),
          updated_by: $scope.currentUser.name
        };

        angular.forEach($scope.lead_history_obj,function(value,key){
          delete value._id;
          delete value.$$hashKey;
        });


        $scope.lead_history_obj.push(lead_stage_new_obj);

        var updateVal = {
          lead_history: $scope.lead_history_obj,
          service_date: service_date_obj,
          service_time: service_time_obj,
          status: 0
        }

        var lead_service_obj_arr = $scope.leadDetails.service_obj_arr;

        lead_service_obj_arr[$scope.serviceIndex].lead_history = $scope.lead_history_obj;
        lead_service_obj_arr[$scope.serviceIndex].service_date = service_date_obj;
        lead_service_obj_arr[$scope.serviceIndex].service_time = service_time_obj;

        var updateValLead = {
          service_obj_arr: lead_service_obj_arr
        };

        var update_service_lead_obj = {
          service_id: selected_service_obj['service_id'],
          variant_type_id: selected_service_obj['variant_type_id'],
          taxed_cost: selected_service_obj['taxed_cost'],
          service_date: service_date_obj
        };

        var service_order_obj = {
          service_obj: update_service_lead_obj
        };


        console.log(updateVal);

        if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

          LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){

            if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

              LeadService.updateLeadInfo(updateValLead,$scope.leadId).then(function(res){
                //console.log(res);
              });

            }

            OrderService.updatedLeadOrder(service_order_obj,selected_service_id).then(function(resp){          
            });

            var email = $scope.client_details.primary_email_id;
            var firstname = $scope.client_details.firstname;
            var message = createRescheduledCancelledOrder(firstname);

            angular.element('#reschedule_service').closeModal();
            swal("Success", "Service updated", "success");      

            // var data = {
            //   'to': email,
            //   'subject': 'Cancelled/Rescheduled Service',
            //   'cc': '',
            //   'body': message
            // };

            // LeadService.sendEmail(data).then(function(res){
            //   if(response.status == 200 && response.statusText == "OK") {
            //     //SweetAlert.swal("Success!", "Email and SMS send to user.", "success");
            //   }
            // });


          });

        }

      selected_service_obj.service_date = service_date_obj;
      selected_service_obj.service_time = service_time_obj;
      selected_service_obj.lead_history = $scope.lead_history_obj;

      // var data = {
      //   'to': email,
      //   'subject': 'Ongoing Feedback',
      //   'cc': '',
      //   'body': message
      // };

      // LeadService.sendEmail(data).then(function(res){
      //   if(response.status == 200 && response.statusText == "OK") {
      //     //SweetAlert.swal("Success!", "Email and SMS send to user.", "success");
      //   }
      // });


    };

    $scope.rescheduleLeadService = function() {

      var service_date_obj = [];
      var service_time_obj = [];
      var lead_history_obj = [];

      console.log($scope.service_date);
      console.log($scope.service_time);

      if(($scope.service_date == undefined && $scope.service_date == null) || ($scope.service_time == undefined && $scope.service_time == null)) {

          swal("Error", "Please enter service date and service time", "error");      

      } else {

        service_date_obj = selected_service_obj.service_date;
        service_time_obj = selected_service_obj.service_time;
        lead_history_obj = selected_service_obj.lead_history;

        for(var i=0;i<service_date_obj.length; i++) {
          if(i == $scope.serviceDateIndex) {
            service_date_obj[i] = (new Date($scope.service_date)).toISOString();
            service_time_obj[i] =  (new Date($scope.service_date + ' ' +$scope.service_time)).toISOString();
          }
        }

        lead_stage_new_obj = {
            lead_stage: 36,
            lead_remark: 12,
            updated_on: (new Date()).toISOString(),
            updated_by: $scope.currentUser.name
          };

          angular.forEach(lead_history_obj,function(value,key){
            delete value._id;
            delete value.$$hashKey;
          });


          lead_history_obj.push(lead_stage_new_obj);

          var updateVal = {
            lead_history: lead_history_obj,
            service_date: service_date_obj,
            service_time: service_time_obj,
            status: 0
          }

          var lead_service_obj_arr = $scope.leads[$scope.leadIndex].service_obj_arr;

          lead_service_obj_arr[$scope.serviceIndex].lead_history = lead_history_obj;
          lead_service_obj_arr[$scope.serviceIndex].service_date = service_date_obj;
          lead_service_obj_arr[$scope.serviceIndex].service_time = service_time_obj;

          var order_lead_obj = {
            service_date: service_date_obj
          };

          var update_order_lead_obj = {
            service_id: selected_service_obj['service_id'],
            variant_type_id: selected_service_obj['variant_type_id'],
            taxed_cost: selected_service_obj['taxed_cost'],
            service_date: service_date_obj
          };


          var update_order_obj = {
            service_date: service_date_obj,
            service_time: service_time_obj,
            service_obj: update_order_lead_obj,
            status: 0
          };

          var updateValLead = {
            service_obj_arr: lead_service_obj_arr
          };


          SweetAlert.swal({
            title: getRandomValue(myArray),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, reschedule!",
            closeOnConfirm: false,
          },  function(isConfirm){
            if (isConfirm) {

              if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

                LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){
                    if(response.data.message.ok == 1) {

                      if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

                        LeadService.updateLeadInfo(updateValLead,$scope.leads[$scope.leadIndex]._id).then(function(res){
                          //console.log(res);
                        });

                      }

                      OrderService.updatedLeadOrder(update_order_obj,selected_service_id).then(function(response){
                      });

                      var email = $scope.leads[$scope.leadIndex].client_details.primary_email_id;
                      var firstname = $scope.leads[$scope.leadIndex].client_details.firstname;
                      var message = createRescheduledCancelledOrder(firstname);

                      angular.element('#reschedule_service').closeModal();
                      swal("Success", "Service updated", "success");

                      // var data = {
                      //   'to': email,
                      //   'subject': 'Cancelled/Rescheduled Service',
                      //   'cc': '',
                      //   'body': message
                      // };

                      // LeadService.sendEmail(data).then(function(res){
                      //   if(response.status == 200 && response.statusText == "OK") {
                      //     //SweetAlert.swal("Success!", "Email and SMS send to user.", "success");
                          
                      //   }
                      // });

                      console.log("Service updated");
                    } else {
                      swal("Failed", "Service not updated", "error");      
                    }
                });

              }

            } else {

              swal("Cancelled", "Service not reschedule", "error");

            }

        });

        selected_service_obj.service_date = service_date_obj;
        selected_service_obj.service_time = service_time_obj;
        selected_service_obj.lead_history = lead_history_obj;




      }










    };

    $scope.rescheduleAMCService = function() {

      var amc_service_date_obj = [];
      var amc_service_time_obj = [];
      var amc_lead_history_obj = [];
      var selected_lead_service_obj = [];

      var amc_service_obj = {};

      console.log($scope.selected_amc_service_obj);

      amc_service_date_obj = $scope.selected_amc_service_obj.service_date;
      amc_service_time_obj = $scope.selected_amc_service_obj.service_time;
      selected_lead_service_obj = $scope.leads[$scope.leadIndex].service_obj[$scope.serviceIndex];

      console.log($scope.leads[$scope.leadIndex]);
      console.log(selected_lead_service_obj);

      if(selected_lead_service_obj.hasOwnProperty('lead_history')) {
        amc_lead_history_obj = selected_lead_service_obj.lead_history;
      }

      //console.log();

      console.log(amc_lead_history_obj);
      console.log(amc_service_date_obj);
      console.log(amc_service_date_obj.length)
      console.log($scope.serviceIndex);

      for(var i=0;i<amc_service_date_obj.length; i++) {
        if(i == $scope.serviceIndex) {
          console.log(i + " === " + $scope.serviceIndex);
          amc_service_date_obj[i] = (new Date($scope.amc_service_date)).toISOString();
          amc_service_time_obj[i] =  (new Date($scope.amc_service_date + ' ' +$scope.amc_service_time)).toISOString();
        }
      }

      console.log(amc_service_date_obj.length);
      console.log($scope.amc_service_date);
      console.log(amc_service_date_obj);

      lead_stage_new_obj = {
          lead_stage: 36,
          lead_remark: 12,
          updated_on: (new Date()).toISOString(),
          updated_by: $scope.currentUser.name
        };

        angular.forEach(amc_lead_history_obj,function(value,key){
          delete value._id;
          delete value.$$hashKey;
        });


        amc_lead_history_obj.push(lead_stage_new_obj);


        var updateVal = {
          service_date: amc_service_date_obj,
          service_time: amc_service_time_obj
        }

        if($scope.amc_type == 0) {
            updateVal.status = 1;
        } else {
            updateVal.status = 0;
        }

        amc_service_obj['variant_type_id'] =  $scope.selected_amc_service_obj.variant_type_id;
        amc_service_obj['service_id'] = $scope.selected_amc_service_obj.service_id;
        amc_service_obj['taxed_cost'] = 0;
        amc_service_obj['service_date'] = amc_service_date_obj;

        var order_service_obj_update = {
          service_obj: amc_service_obj,
          service_date: amc_service_date_obj,
          service_time: amc_service_time_obj,
          status: 0
        };

        if($scope.amc_type == 0) {
            order_service_obj_update.is_amc = -1;
        } else {
            order_service_obj_update.is_amc = 1;
        }

        var updateValLeadLabel = {
          lead_history: amc_lead_history_obj
        };

        console.log(updateVal);

        console.log($scope.selected_amc_service_id);
        console.log(order_service_obj_update);

        LeadService.updateAMCServiceInfo(updateVal,$scope.selected_amc_service_id).then(function(response){
            angular.element('#reschedule_amc_service').closeModal();

            OrderService.updatedOrderByAMCId(order_service_obj_update,$scope.selected_amc_service_id).then(function(resp){

            });

        });

        if($scope.selected_amc_service_obj != undefined && $scope.selected_amc_service_obj != null && $scope.selected_amc_service_obj != "" && $scope.selected_amc_service_obj.amc_id != undefined && $scope.selected_amc_service_obj.amc_id != null && $scope.selected_amc_service_obj.amc_id != "") {

          LeadService.updateServiceInfo(updateValLeadLabel,$scope.selected_amc_service_obj.amc_id).then(function(response){
              console.log(response);
          });

        }

      $scope.selected_amc_service_obj.service_date = amc_service_date_obj;
      $scope.selected_amc_service_obj.service_time = amc_service_time_obj;

      console.log($scope.selected_amc_service_obj);


    };

    $scope.rescheduleEditLeadAMCService = function() {

      var amc_service_date_obj = [];
      var amc_service_time_obj = [];
      var amc_lead_history_obj = [];
      var selected_lead_service_obj = [];

      var amc_service_obj = {};
      console.log($scope.selected_amc_service_obj);

      amc_service_date_obj = $scope.selected_amc_service_obj.service_date;
      amc_service_time_obj = $scope.selected_amc_service_obj.service_time;
      selected_lead_service_obj = selected_service_obj;

      console.log($scope.leads[$scope.leadIndex]);
      console.log(selected_lead_service_obj);

      if(selected_lead_service_obj.hasOwnProperty('lead_history')) {
        amc_lead_history_obj = selected_lead_service_obj.lead_history;
      }

      console.log();

      console.log(amc_lead_history_obj);
      console.log(amc_service_date_obj);
      console.log(amc_service_date_obj.length)
      console.log($scope.serviceIndex);

      for(var i=0;i<amc_service_date_obj.length; i++) {
        if(i == $scope.serviceIndex) {
          console.log(i + " === " + $scope.serviceIndex);
          amc_service_date_obj[i] = (new Date($scope.amc_service_date)).toISOString();
          amc_service_time_obj[i] =  (new Date($scope.amc_service_date + ' ' +$scope.amc_service_time)).toISOString();
        }
      }

      console.log(amc_service_date_obj.length);
      console.log($scope.amc_service_date);
      console.log(amc_service_date_obj);

      lead_stage_new_obj = {
          lead_stage: 36,
          lead_remark: 12,
          updated_on: (new Date()).toISOString(),
          updated_by: $scope.currentUser.name
        };

        angular.forEach(amc_lead_history_obj,function(value,key){
          delete value._id;
          delete value.$$hashKey;
        });


        amc_lead_history_obj.push(lead_stage_new_obj);


        var updateVal = {
          service_date: amc_service_date_obj,
          service_time: amc_service_time_obj,
          status: 1
        }

        amc_service_obj['variant_type_id'] =  $scope.selected_amc_service_obj.variant_type_id;
        amc_service_obj['service_id'] = $scope.selected_amc_service_obj.service_id;
        amc_service_obj['taxed_cost'] = 0;
        amc_service_obj['service_date'] = amc_service_date_obj;

        var order_service_obj_update = {
          service_obj: amc_service_obj,
          service_date: amc_service_date_obj,
          service_time: amc_service_time_obj,
          status: 0,
          is_amc: -1
        };

        var updateValLeadLabel = {
          lead_history: amc_lead_history_obj
        };

        console.log(updateVal);

        LeadService.updateAMCServiceInfo(updateVal,$scope.selected_amc_service_id).then(function(response){
            console.log(response);

            OrderService.updatedOrderByAMCId(order_service_obj_update,$scope.selected_amc_service_id).then(function(resp){

            });


        });

        if($scope.selected_amc_service_obj != undefined && $scope.selected_amc_service_obj != null && $scope.selected_amc_service_obj != "" && $scope.selected_amc_service_obj.amc_id != undefined && $scope.selected_amc_service_obj.amc_id != null && $scope.selected_amc_service_obj.amc_id != "") {

          LeadService.updateServiceInfo(updateValLeadLabel,$scope.selected_amc_service_obj.amc_id).then(function(response){
              console.log(response);
          });

        }

      $scope.selected_amc_service_obj.service_date = amc_service_date_obj;
      $scope.selected_amc_service_obj.service_time = amc_service_time_obj;
      selected_service_obj.lead_history = amc_lead_history_obj;
      console.log($scope.selected_amc_service_obj);


    };

    $scope.setLeadIndex = function(index) {
      $scope.leadIndex = index;
      console.log(index);
    };

    $scope.show_company_details = function(index) {
      $scope.company_details = $scope.lead_data[index];
      angular.element('#company_details_modal').openModal();

    }

    $scope.show_documents = function(index) {
      
      $scope.lead_documents = {};

      $scope.lead_documents = $scope.lead_data[index];
      console.log($scope.lead_documents.cost_schedule + ' | ' + $scope.lead_documents.work_order + ' | ' + $scope.lead_documents.contract_doc);

      $scope.lead_documents.has_documents = 1;

      if(($scope.lead_documents.cost_schedule == '' || $scope.lead_documents.cost_schedule == undefined || $scope.lead_documents.cost_schedule == null) && ($scope.lead_documents.work_order == '' || $scope.lead_documents.work_order == undefined || $scope.lead_documents.work_order == null) && ($scope.lead_documents.contract_doc == undefined || $scope.lead_documents.contract_doc == '' || $scope.lead_documents.contract_doc == null)) {
        $scope.lead_documents.has_documents = 0;
      }

      angular.element('#documents_modal').openModal();
    }

    $scope.deleteLeadService = function(id,index,service){

      SweetAlert.swal({
        title: getRandomValue(myResArray),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },  function(isConfirm){

        if(isConfirm) {

          $scope.leads[$scope.leadIndex].service_obj.splice(index,1);

          LeadService.deleteServiceInfo(id).then(function(response){
            SweetAlert.swal("Deleted!", "Service has been deleted.", "success");
          });

        } else {

          swal("Cancelled", "Service not deleted", "error");

        }

      });

    };

    $scope.deleteLeadAMCService = function(id,index){

      SweetAlert.swal({
        title: getRandomValue(myResArray),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },  function(isConfirm){

        if(isConfirm) {

          $scope.amc_services.splice(index,1);

          LeadService.deleteAMCService(id).then(function(response){
            SweetAlert.swal("Deleted!", "AMC Service has been deleted.", "success");
          });

        } else {

          SweetAlert.swal("Cancelled", "AMC Service not deleted", "error");

        }

      });

    };

    $scope.setDeployment = function(tl,sv,jt) {
      $scope.teamleader = tl;
      $scope.supervisor = sv;
      $scope.janitor = jt;
    }

    $scope.setDeploymentDuration = function(tl,sv,jt,index) {

      $scope.teamleader = tl;
      $scope.supervisor = sv;
      $scope.janitor = jt;
      $scope.deploymentIndex = index;




    }

    $scope.updateDeploymentDuration = function() {


      var team_leader_arr = [];
      var supervisor_arr = [];
      var janitor_arr = [];

      team_leader_arr = selected_service_obj.team_leader;
      supervisor_arr = selected_service_obj.supervisor;
      janitor_arr = selected_service_obj.janitor;

      team_leader_arr[$scope.deploymentIndex] = parseInt($scope.teamleader);
      supervisor_arr[$scope.deploymentIndex] = parseInt($scope.supervisor);
      janitor_arr[$scope.deploymentIndex] = parseInt($scope.janitor);


      selected_service_obj.janitor = janitor_arr;
      selected_service_obj.supervisor = supervisor_arr;
      selected_service_obj.team_leader = team_leader_arr;

        var updateVal = {
          janitor: janitor_arr,
          supervisor: supervisor_arr,
          team_leader: team_leader_arr
        }

        if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

          LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){
              console.log(response);
              if(response.data.message.ok == 1) {
                angular.element('#update_deployment_duration').closeModal();
                SweetAlert.swal("Success", "Deployment updated", "success");
              }
          });

        }


    }

    $scope.updateDeployment = function() {

      selected_service_obj.no_of_janitor = $scope.janitor;
      selected_service_obj.no_of_supervisor = $scope.supervisor;
      selected_service_obj.no_of_team_leader = $scope.teamleader;

        var updateVal = {
          no_of_janitor: parseInt($scope.janitor),
          no_of_supervisor: parseInt($scope.supervisor),
          no_of_team_leader: parseInt($scope.teamleader)
        }


        
        if(selected_service_obj.is_amc == 1) {

          if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

            LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){
                console.log(response);
                if(response.data.message.ok == 1) {
                  angular.element('#update_deployment').closeModal();
                  SweetAlert.swal("Success", "Deployment updated", "success");

                  LeadService.updateAMCByAMCId(updateVal,selected_service_id).then(function(res){

                  });

                }
            });

          }

        } else {

          if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

            LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){
                console.log(response);
                if(response.data.message.ok == 1) {
                  angular.element('#update_deployment').closeModal();
                  SweetAlert.swal("Success", "Deployment updated", "success");
                }
            });

          }


        }


    }

    $scope.confirmService = function(service_id) {

        var updateVal = {
          service_status: 3
        }

        if(service_id != undefined && service_id != null && service_id != "") {

          LeadService.updateServiceInfo(updateVal,service_id).then(function(response){
              if(response.data.message.ok == 1) {
                SweetAlert.swal("Success", "Service confirmed", "success");
              }
              //console.log(response);
          }); 

        }       

    };


    $scope.unconfirmService = function(service_id) {

        var updateVal = {
          service_status: 0
        }

        if(service_id != undefined && service_id != null && service_id != "") {

          LeadService.updateServiceInfo(updateVal,service_id).then(function(response){
              if(response.data.message.ok == 1) {
                SweetAlert.swal("Success", "Service Unconfirmed", "success");
              }
              //console.log(response);
          });        

        }

    };

    $scope.confirmAMCService = function(amc_id) {

      //updateAMCServiceInfo
      var updateVal = {
        service_status: 3
      }

      LeadService.updateAMCServiceInfo(updateVal,amc_id).then(function(response){
          if(response.data.message.ok == 1) {
            SweetAlert.swal("Success", "AMC Service confirmed", "success");
          }
          //console.log(response);
      });
      

    };
    
    $scope.unconfirmAMCService = function(amc_id) {

      //updateAMCServiceInfo
      var updateVal = {
        service_status: 0
      }

      LeadService.updateAMCServiceInfo(updateVal,amc_id).then(function(response){
          if(response.data.message.ok == 1) {
            SweetAlert.swal("Success", "AMC Service confirmed", "success");
          }
          //console.log(response);
      });
      

    };


    $scope.setRemarkService = function(index,service) {

      $scope.additional_notes = "";
      selected_service_id = service['_id'];
      selected_service_obj = service;
      $scope.serviceIndex = index;
      if(service.hasOwnProperty('crm_remark') && service.crm_remark.length > 0 && service.crm_remark != undefined) {
        $scope.crm_remark_arr = service.crm_remark
      } else {
        $scope.crm_remark_arr = [];
      }

    };


    $scope.updateLeadServiceRemark = function() {

      var crm_remark_obj = [];

      var crm_remark_new_obj = {
        remark: $scope.additional_notes,
        added_by: $scope.currentUser.name,
        added_on: (new Date()).toISOString()
      };

      if(selected_service_obj.crm_remark != undefined && selected_service_obj.crm_remark.length > 0 && selected_service_obj.crm_remark != undefined) {
        crm_remark_obj = selected_service_obj.crm_remark;
      }
      crm_remark_obj.push(crm_remark_new_obj);

      selected_service_obj.crm_remark = crm_remark_obj;

      var updateVal = {
        crm_remark: crm_remark_obj
      };

      if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

        LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){
            if(response.data.message.ok == 1) {
              SweetAlert.swal("Success", "New remark added!", "success");
              //angular.element('#update_remark').closeModal();
              $scope.leads[$scope.leadIndex].service_obj[$scope.serviceIndex].crm_remark = crm_remark_obj;
            }
        });

      }

    }

    $scope.updateServiceRemarkStatus = function(index,select_option) {

      var crm_remark_obj = [];

      $scope.select_option = select_option;

      crm_remark_obj = selected_service_obj.crm_remark;
      crm_remark_obj[index]['show'] = parseInt($scope.select_option);

      console.log(select_option);
      console.log(crm_remark_obj);

      selected_service_obj.crm_remark = crm_remark_obj;

      var updateVal = {
        crm_remark: crm_remark_obj
      };

      SweetAlert.swal({
        title: 'Do want to add/remove remark from W/O?',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, do it.",
        closeOnConfirm: false
      },  function(isConfirm){

        if(isConfirm) {

          if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

            LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){
                if(response.data.message.ok == 1) {
                  if($scope.select_option == 1) {
                    SweetAlert.swal("Success", "Remark added in work order!", "success");  
                  } else {
                    SweetAlert.swal("Success", "Remark will not show in work order!", "success");  
                  }
                  //angular.element('#update_remark').closeModal();
                  $scope.leads[$scope.leadIndex].service_obj[$scope.serviceIndex].crm_remark = crm_remark_obj;
                }
            });

          }

        }

      });

    };


    $scope.updateRemark = function() {

      var crm_remark_obj = [];

      var crm_remark_new_obj = {
        remark: $scope.additional_notes,
        added_by: $scope.currentUser.name,
      };

      if(selected_service_obj.hasOwnProperty('crm_remark') && selected_service_obj.crm_remark.length > 0 && selected_service_obj.crm_remark != undefined) {
        crm_remark_obj = selected_service_obj.crm_remark;
      }
      crm_remark_obj.push(crm_remark_new_obj);

      selected_service_obj.crm_remark = crm_remark_obj;

      var updateVal = {
        crm_remark: crm_remark_obj
      };

      if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

        LeadService.updateServiceInfo(updateVal,selected_service_id).then(function(response){
            //console.log(response);
        });

      }

    }

 //    $scope.getClientInfo = function(client){
	// 	//console.log(client);
	// 	//$window.localStorage.setItem("client_details", angular.toJson(client));
	// 	//$rootScope.client_details = client;
	// 	$scope.addresses = client.address_details;
	// 	angular.element('#add_lead_modal').closeModal();
	// 	angular.element('#select_address').openModal();
	// 	//$location.path('/leads/add');
	// 	// $scope.$apply();
	// 	// $scope.keyValueObj = {};
	// 	// $scope.keyValueObj['_id'] = id;

	// 	// ClientService.getAllClients($scope.keyValueObj).then(function(client){


	// 	// 	//$scope.clients = client.data.message;
	// 	// 	//console.log($scope.clients);
	// 	// });

	// }

//   $scope.showFilter = false;
//   var isFilter = false;
//   $scope.ctrlDown = false;
//   $scope.ctrlKey = 17, $scope.fKey = 89;

//   $scope.keyDownFunc = function($event) {
//     if ($scope.ctrlDown && ($event.keyCode == $scope.fKey)) {
//       alert('Ctrl + Y');
//         //$event.preventDefault();
//         // if(isFilter == false) {
//           $scope.showFilter = true;
//           //isFilter = true;
//         // } else {
//         //   $scope.showFilter = false;
//         //   isFilter = false;
//         // }
//     }
// };

  // $scope.showFilter = function() {
  //   $scope.showFilter = true;
  //   console.log("showFilter");
  // };

  $scope.clearFilter = function() {
    filterSearchArr = {};
    $scope.lead_stage_filter = "-1";
    $scope.lead_owner_filter = "-1";
    $scope.lead_source_filter = "-1";
    $scope.keyword = "";
    $scope.from_date = "";
    $scope.to_date = "";
//    $scope.showFilter = false;

    console.log("Clear Filter");
    $scope.filterLeads();

  }

  $scope.filterLeads = function(val) {

    if (val==1) {
      $scope.leads =[];
      page=1;
      debugger;
      offset=0;
      // fromfilter =0;
    }

    $scope.hasMoreData = true;
    $scope.loading = true;


    var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var mobilePattern = /^\d+$/;

    var name="";
    var primary_contact_no = "";
    var primary_email_id = "";

    var keyword = {};
    var temp_filterSearchArr = {};



    if($scope.keyword != undefined && $scope.keyword != null && $scope.keyword != "") {

      if(emailPattern.test($scope.keyword)) {
        temp_filterSearchArr.primary_email_id = $scope.keyword;
      } else if(mobilePattern.test($scope.keyword)) {
        temp_filterSearchArr.primary_contact_no = $scope.keyword;
      } else {
        temp_filterSearchArr.name = $scope.keyword;
      }

      if(temp_filterSearchArr.name == "") {
        delete temp_filterSearchArr.name;
      }

      if(temp_filterSearchArr.primary_contact_no == "") {
        delete temp_filterSearchArr.primary_contact_no;
      }

    }

    // else {
    //   $scope.keyValueObj = {};
    //   $scope.keyValueObj.primary_contact_no = "";
    //   $scope.keyValueObj.primary_email_id = "";
    //   $scope.keyValueObj.firstname = $scope.searchVal;
    // }

    if($scope.lead_stage_filter != undefined && $scope.lead_stage_filter != null && $scope.lead_stage_filter != "")
    temp_filterSearchArr.lead_stage =  $scope.lead_stage_filter;

    if($scope.lead_owner_filter != undefined && $scope.lead_owner_filter != null && $scope.lead_owner_filter != "")
    temp_filterSearchArr.leadowner =  $scope.lead_owner_filter;

    if($scope.lead_source_filter != undefined && $scope.lead_source_filter != null && $scope.lead_source_filter != "")
    temp_filterSearchArr.leadsource =  $scope.lead_source_filter;

    if($scope.from_date != undefined && $scope.from_date != null && $scope.from_date != "")
    temp_filterSearchArr.from_inquiry_date =  (new Date($scope.from_date)).toISOString();

    if($scope.to_date != undefined && $scope.to_date != null && $scope.to_date != "")
    temp_filterSearchArr.to_inquiry_date =  (new Date($scope.to_date)).toISOString();

    if($scope.from_sdate != undefined && $scope.from_sdate != null && $scope.from_sdate != "")
    temp_filterSearchArr.from_inquiry_sdate =  (new Date($scope.from_sdate)).toISOString();

    if($scope.to_sdate != undefined && $scope.to_sdate != null && $scope.to_sdate != "")
    temp_filterSearchArr.to_inquiry_sdate =  (new Date($scope.to_sdate)).toISOString();

    if($scope.city_filter != undefined && $scope.city_filter != null && $scope.city_filter != "")
    temp_filterSearchArr.city_filter = $scope.city_filter;

    if($scope.service_filter != undefined && $scope.service_filter != null && $scope.service_filter != "")
    temp_filterSearchArr.service_filter = $scope.service_filter;

    if($scope.type_filter == "address") {
      if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
      temp_filterSearchArr.address = $scope.type_keyword;
    }

    if($scope.type_filter == "invoice") {
      if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
      temp_filterSearchArr.taxed_cost = parseInt($scope.type_keyword);
    }

    if($scope.type_filter == "billing_name") {
      if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
      temp_filterSearchArr.billing_name = $scope.type_keyword;
    }

    if($scope.type_filter == "billing_address") {
      if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
      temp_filterSearchArr.billing_address = $scope.type_keyword;
    }

    if($scope.type_filter == "id") {
      if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
      temp_filterSearchArr.lead_id = $scope.type_keyword;
    }

    filterSearchArr =  temp_filterSearchArr;
    console.log(filterSearchArr);

    var paginationSettings = {
        limit: limit,
        offset: offset
      }

    var data = {
      'searchVal':filterSearchArr,
      'paginationSettings': paginationSettings
    }

    LeadService.filterLeads(data).then(function(response){
        console.log(response.data.message);
        $scope.leads = [];
        $scope.leads = response.data.message;
        $scope.loading = false;

    });

  }

  // $scope.getCapacity = function() {
  //   getCapacityFunction();
  // };

  // function getCapacityFunction() {

  //   //debugger;

  //   var today_date = "";
  //   var tomorrow_date = "";
  //   var temp_capacitySearchArr = {};
  //   var keyValueObj = {};

  //   if($scope.service_date != undefined && $scope.service_date != "" && $scope.service_date != null) {

  //     today_date = moment((new Date($scope.service_date + ' 00:00:00'))).add(1,'days').toDate();
  //     tomorrow_date = moment(today_date).add(1,'days').toDate();

  //   } else {

  //     today_date =  new Date(moment().add(1,'days').format('YYYY-MM-DD') + ' 00:00:00');
  //     tomorrow_date = moment(today_date).add(1,'days').toDate();

  //   }

  //   temp_capacitySearchArr.from_inquiry_date = today_date.toISOString();
  //   temp_capacitySearchArr.to_inquiry_date = tomorrow_date.toISOString();

  //   keyValueObj['service_date'] = {"$gte": temp_capacitySearchArr['from_inquiry_date'], "$lt": temp_capacitySearchArr['to_inquiry_date']};
  //   keyValueObj['is_order'] = 1;

  //   var serviceData = {
  //     'searchVal': keyValueObj
  //   };

  //   //debugger;
    
  //   LeadService.getAllServices(serviceData).then(function(response){

  //     var data_count = response.data.message.length;
  //     var capacity_data = response.data.message;
  //     var capacity_data_arr = {};
  //     var sum_m = 0;
  //     var sum_b = 0;
  //     var sum_d = 0;

  //     if(data_count > 0 ) {

  //       for (var i = 0; i < data_count; i++) {

  //         if(capacity_data[i].city == 1) {
  //           sum_m = sum_m + capacity_data[i].no_of_janitor + capacity_data[i].no_of_supervisor + capacity_data[i].no_of_team_leader;
  //         } else if(capacity_data[i].city == 2) {
  //           sum_b = sum_b + capacity_data[i].no_of_janitor + capacity_data[i].no_of_supervisor + capacity_data[i].no_of_team_leader;
  //         } else if(capacity_data[i].city == 3) {
  //           sum_d = sum_d + capacity_data[i].no_of_janitor + capacity_data[i].no_of_supervisor + capacity_data[i].no_of_team_leader;
  //         }

  //       };

  //       $scope.mumbai_deployment_count = sum_m;
  //       $scope.bangalore_deployment_count = sum_b;
  //       $scope.delhi_deployment_count = sum_d;

  //     }


  //   });



  // }

  $scope.setClient = function(client) {
    selected_client_id = client._id;
    $scope.firstname = client.firstname;
    $scope.lastname = client.lastname;
  };

  $scope.updateClientDetails = function() {

    var updateVal = {
      firstname: $scope.firstname,
      lastname: $scope.lastname
    };

    console.log(selected_service_id);


    ClientService.updateClientInfo(updateVal,selected_client_id).then(function(response){
      console.log(response);
        if(response.data.message.ok == 1) {

          if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

            LeadService.updateLeadInfo({ firstname: $scope.firstname },$scope.leadId).then(function(res){
              //console.log(res);
            });

          }

          if(selected_service_id != undefined && selected_service_id != null && selected_service_id != "") {

            OrderService.updatedLeadOrder({ firstname: $scope.firstname },selected_service_id).then(function(resp){

            });

          }


          SweetAlert.swal("Updated!", "Client details updated.", "success");
          $scope.client_details.firstname = $scope.firstname;
          $scope.client_details.lastname = $scope.lastname;
        }
    });

  };

  $scope.setCity = function() {
    //console.log($scope.client_details.city);
    $scope.city_val = $scope.client_details.city;
  };

  $scope.updateCity = function() {

    var updateVal = {
      city: parseInt($scope.city_val)
    };

    if($scope.leadId != undefined && $scope.leadId != null && $scope.leadId != "") {

      LeadService.updateLeadInfo(updateVal,$scope.leadId).then(function(res){
        if(res.data.message.ok == 1) {
          SweetAlert.swal("Updated!", "City updated.", "success");
        }
      });

    }

    angular.forEach($scope.service_details_arr,function(value,key){

      if(value._id != undefined && value._id != null && value._id != "") {
      
        OrderService.updatedLeadOrder(updateVal,value._id).then(function(r1){
          console.log("Order Updated");
        });

        LeadService.updateServiceInfo(updateVal,value._id).then(function(r2){
          console.log("Service Updated");
        });

      }

    });

    //console.log(updateVal);

  };


// angular.element($window).bind("keyup", function($event) {
//     if ($event.keyCode == $scope.ctrlKey)
//         $scope.ctrlDown = false;
//     $scope.$apply();
// });

// angular.element($window).bind("keydown", function($event) {
//     if ($event.keyCode == $scope.ctrlKey)
//         $scope.ctrlDown = true;
//     $scope.$apply();
// });
  
  $scope.logout = function() {
    AuthService.logout();
    $window.location.href = '/login';
  };


var spocs_by_email = {
    'rushabh.vora@silagroup.co.in': 'RV',
    'ankit.maheswari@silagroup.co.in': 'AM',
    'kunal.lala@silagroup.co.in': 'KL',
    'neermohi.shah@silagroup.co.in': 'NS',
    'kaivalya.mehta@silagroup.co.in': 'KM',
    'leejohn.vaz@silagroup.co.in': 'LV',
    'nishtha.jain@silagroup.co.in': 'NJ',
    'rahul.doshi@silagroup.co.in': 'RD',
    'raghav.kapur@silagroup.co.in': 'RK',
    'nishant.kumar@silagroup.co.in': 'NK',
    'ankur.vaid@silagroup.co.in': 'AV',
    'anand.sarolkar@silagroup.co.in': 'AS',
    'paresh.badhiya@silagroup.co.in': 'PB',
    'suresh.baria@silagroup.co.in': 'SB',
    'satnam.sethi@silagroup.co.in': 'SS',
    'nonita.mehta@silagroup.co.in': 'NM',
    'pratham.mehta@silagroup.co.in': 'PM',
    'subhasis.roy@silagroup.co.in': 'SR',
    'anish.hamsa@silagroup.co.in': 'AH',
    'kailash.parihar@silagroup.co.in': 'KP',
    'naveen.chandra@silagroup.co.in': 'NC',
    'priyanka.asher@silagroup.co.in': 'PA',
    'tanveer.khan@mrhomecare.in': 'TK',
    'simon.regan@silagroup.co.in': 'SR',
    'regan.simon@silagroup.co.in': 'RS',
    'varun.vaz@silagroup.co.in': 'VV',
    'sanket.sheth@silagroup.co.in': 'SSH'
  };


$scope.search_data = {};
$scope.search_data.status = 'database';
// if($scope.currentUser.email != 'rushabh.vora@silagroup.co.in' && $scope.currentUser.email != 'tanveer.khan@mrhomecare.in' && $scope.currentUser.email != 'sv@silagroup.co.in' && $scope.currentUser.email != 'payal.sondhi@silagroup.co.in' && $scope.currentUser.email != 'daneeshd@gmail.com' && $scope.currentUser.email != 'delnaavari30@gmail.com' && $scope.currentUser.email != 'delnaavari30@gmail.com' &&  $scope.currentUser.email != 'demo@silagroup.co.in'  && $scope.currentUser.email != 'satyajit.nalawade@silagroup.co.in' && $scope.currentUser.email != 'nonita.mehta@silagroup.co.in') {
//   $scope.search_data.spoc = spocs_by_email[$scope.currentUser.email];
// }
$scope.search_data.page = $scope.page;

LeadService.getAllLeads($scope.search_data).then(function(response){


  $scope.lead_data = response.data.result.data;

  $scope.c0_total = response.data.total_c0_sum;
  $scope.c1_total = response.data.total_c1_sum;
  $scope.c2_total = response.data.total_c2_sum;
  $scope.c3_total = response.data.total_c3_sum;
  
  angular.element("body").css({"overflow-y":"scroll"});
  $scope.hasMoreData = true;
  $scope.loading = false;
});

$scope.show_more_data = function() {

  debugger;

  $scope.page++;
  $scope.loading = true;

  $scope.search_data.status = 'database';
  $scope.search_data.page = $scope.page;
  
  LeadService.getAllLeads($scope.search_data).then(function(response){

    if(response.data.result.data.length > 0) {

      $scope.lead_data =  $scope.lead_data.concat(response.data.result.data);
      $scope.hasMoreData = true;
      $scope.loading = false;

    } else {

      $scope.hasMoreData = false;
      $scope.loading = false;

    }

  });  


};

$scope.searchLeads = function(page) {

  debugger;

  var spocs_by_email = {
          'rushabh.vora@silagroup.co.in': 'RV',
          'ankit.maheswari@silagroup.co.in': 'AM',
          'kunal.lala@silagroup.co.in': 'KL',
          'neermohi.shah@silagroup.co.in': 'NS',
          'kaivalya.mehta@silagroup.co.in': 'KM',
          'leejohn.vaz@silagroup.co.in': 'LV',
          'nishtha.jain@silagroup.co.in': 'NJ',
          'rahul.doshi@silagroup.co.in': 'RD',
          'raghav.kapur@silagroup.co.in': 'RK',
          'nishant.kumar@silagroup.co.in': 'NK',
          'ankur.vaid@silagroup.co.in': 'AV',
          'anand.sarolkar@silagroup.co.in': 'AS',
          'paresh.badhiya@silagroup.co.in': 'PB',
          'suresh.baria@silagroup.co.in': 'SB',
          'satnam.sethi@silagroup.co.in': 'SS',
          'nonita.mehta@silagroup.co.in': 'NM',
          'pratham.mehta@silagroup.co.in': 'PM',
          'subhasis.roy@silagroup.co.in': 'SR',
          'anish.hamsa@silagroup.co.in': 'AH',
          'kailash.parihar@silagroup.co.in': 'KP',
          'naveen.chandra@silagroup.co.in': 'NC',
          'priyanka.asher@silagroup.co.in': 'PA',
          'tanveer.khan@mrhomecare.in': 'TK',
          'simon.regan@silagroup.co.in': 'SR',
          'regan.simon@silagroup.co.in': 'RS',
          'varun.vaz@silagroup.co.in': 'VV',
          'sanket.sheth@silagroup.co.in': 'SSH'
        };


  $scope.search_data = {};

  $scope.page = 1;
  $scope.search_data.page = 1;

  if($scope.sales_stage_filter != undefined && $scope.sales_stage_filter != null && $scope.sales_stage_filter != "") {
    $scope.search_data.sales_stage = $scope.sales_stage_filter;
  }

  if($scope.spoc_filter != undefined && $scope.spoc_filter != null && $scope.spoc_filter != "") {
    $scope.search_data.spoc = $scope.spoc_filter;
  }

  if($scope.client_type_filter != undefined && $scope.client_type_filter != null && $scope.client_type_filter != "") {
    $scope.search_data.client_type = $scope.client_type_filter;
  }

  if($scope.city_filter != undefined && $scope.city_filter != null && $scope.city_filter != "") {
    $scope.search_data.city = $scope.city_filter;
  }

  if($scope.industry_filter != undefined && $scope.industry_filter != null && $scope.industry_filter != "") {
    $scope.search_data.industry = $scope.industry_filter;
  }

  // if($scope.currentUser.email != 'rushabh.vora@silagroup.co.in' && $scope.currentUser.email != 'tanveer.khan@mrhomecare.in' && $scope.currentUser.email != 'sv@silagroup.co.in' && $scope.currentUser.email != 'payal.sondhi@silagroup.co.in' && $scope.currentUser.email != 'daneeshd@gmail.com' && $scope.currentUser.email != 'delnaavari30@gmail.com' && $scope.currentUser.email != 'delnaavari30@gmail.com' &&  $scope.currentUser.email != 'demo@silagroup.co.in'  && $scope.currentUser.email != 'satyajit.nalawade@silagroup.co.in' && $scope.currentUser.email != 'nonita.mehta@silagroup.co.in') {
  //   $scope.search_data.spoc = spocs_by_email[$scope.currentUser.email];
  // }

  if($scope.keyword != undefined && $scope.keyword != null && $scope.keyword != "") {
    $scope.search_data.keyword = $scope.keyword;
  }

  $scope.search_data.status = 'database';

  debugger;

  LeadService.getAllLeads($scope.search_data).then(function(response){

    $scope.lead_data = [];

    if(response.data.result.data.length > 0) {

      debugger;

      var leads = response.data.result.data;
      $scope.c0_total = response.data.total_c0_sum;
      $scope.c1_total = response.data.total_c1_sum;
      $scope.c2_total = response.data.total_c2_sum;
      $scope.c3_total = response.data.total_c3_sum;

      for (var i = 0; i < leads.length; i++) {
        $scope.lead_data.push(leads[i]);
      }

      //$scope.lead_data =  $scope.lead_data.concat(response.data.result.data);
      $scope.hasMoreData = true;
      $scope.loading = false;

    } else {

      $scope.hasMoreData = false;
      $scope.loading = false;

    }

  }); 
  


}


function getCapacity(selected_date,selected_city,callback) {

    debugger;

    if(selected_date != undefined && selected_date != "" && selected_date != null) {

    var today_date = "";
    var tomorrow_date = "";
    var temp_capacitySearchArr = {};
    var keyValueObj = {};
    var keyValueArr = {};
    var current_date = "";

    today_date = moment((new Date(selected_date + ' 00:00:00'))).toDate();
    tomorrow_date = moment(today_date).add(1,'days').toDate();
    keyValueArr['service_date'] = (new Date(selected_date + ' 00:00:00')).toISOString();
    current_date = selected_date;


    temp_capacitySearchArr.from_inquiry_date = today_date.toISOString();
    temp_capacitySearchArr.to_inquiry_date = tomorrow_date.toISOString();

    //keyValueObj['service_date'] = {"$gte": temp_capacitySearchArr['from_inquiry_date'], "$lt": temp_capacitySearchArr['to_inquiry_date']};
    keyValueObj['from_inquiry_date'] = today_date.toISOString();
    keyValueObj['to_inquiry_date'] = tomorrow_date.toISOString();
    keyValueObj['is_order'] = 1;
    keyValueObj['status'] = 0;
    keyValueObj['not_amc'] = 1;

    var paginationSettings = {
      limit: 0,
      offset: 0
    }

    var orderBy = {
      created_on: -1
    };

    var serviceData = {
      'searchVal': keyValueObj,
      'paginationSettings': paginationSettings,
      'orderBy': orderBy
    };

    var res_manpower = {};

    
    // LeadService.getAllServices(serviceData).then(function(response){

    //   var data_count = response.data.message.length;
    //   var capacity_data = response.data.message;
    //   var capacity_data_arr = {};
    //   var sum_m = 0;
    //   var sum_b = 0;
    //   var sum_d = 0;
    //   var c_janitor = 0;
    //   var c_supervisor = 0;
    //   var c_teamleader = 0;
    //   var res_manpower = {};

    //   if(data_count > 0 ) {

    //     for (var i = 0; i < data_count; i++) {

    //       var service_date_arr = capacity_data[i].service_date;
    //       var service_date_arr_length = service_date_arr.length;
    //       var service_date_index = 0;

    //       for (var k = 0; k < service_date_arr_length; k++) {
            
    //         if(today_date == service_date_arr[k].substr(0,10)) {
    //           service_date_index = k;
    //           break;
    //         }

    //       };


    //       if(capacity_data[i].duration_of_service > 1) {

    //         c_janitor = checkNullOrEmpty(capacity_data[i].janitor[service_date_index]);
    //         c_supervisor = checkNullOrEmpty(capacity_data[i].supervisor[service_date_index]);
    //         c_teamleader = checkNullOrEmpty(capacity_data[i].team_leader[service_date_index]);

    //       } else {

    //         c_janitor = checkNullOrEmpty(capacity_data[i].no_of_janitor);
    //         c_supervisor = checkNullOrEmpty(capacity_data[i].no_of_supervisor);
    //         c_teamleader = checkNullOrEmpty(capacity_data[i].no_of_team_leader);

    //       }


    //       if(capacity_data[i].city == 1) {
    //         sum_m = sum_m + c_janitor + c_supervisor + c_teamleader;
    //       } else if(capacity_data[i].city == 2) {
    //         sum_b = sum_b + c_janitor + c_supervisor + c_teamleader;
    //       } else if(capacity_data[i].city == 3) {
    //         sum_d = sum_d + c_janitor + c_supervisor + c_teamleader;
    //       }

    //     };


    //     if(selected_city == 1) {
    //       res_manpower['rem'] = sum_m;
    //     } else if(selected_city == 2) {
    //       res_manpower['rem'] = sum_b;
    //     } else if(selected_city == 3) {
    //       res_manpower['rem'] = sum_d;
    //     } else {
    //       res_manpower['rem'] = 0;
    //     }


    //   } else {

    //     res_manpower['rem'] = 0;
    //   }


    //   ManpowerService.getManpower(keyValueArr).then(function(response){
    //     var manpower_data_count = response.data.message.length;

    //     if(manpower_data_count > 0) {

    //       if(selected_city == 1) {
    //         res_manpower['total'] = response.data.message[0].manpower_details[0].no_of_manpower;
    //       } else if(selected_city == 2) {
    //         res_manpower['total'] = response.data.message[0].manpower_details[1].no_of_manpower;
    //       } else if(selected_city == 3) {
    //         res_manpower['total'] = response.data.message[0].manpower_details[2].no_of_manpower;
    //       } else {
    //         res_manpower['total'] = 0;
    //       }

    //     } else {
    //         res_manpower['total'] = 0;
    //     }

    //     callback(res_manpower);

    //   });   



    // });



    //  OrderService.filterAllOrders(serviceData).then(function(response){


    //   //console.log(response);

    //   var data_count = response.data.message.length;
    //   var capacity_data = response.data.message;
    //   var capacity_data_arr = {};
    //   var sum_m = 0;
    //   var sum_b = 0;
    //   var sum_d = 0;
    //   var c_janitor = 0;
    //   var c_supervisor = 0;
    //   var c_teamleader = 0;
    //   var res_manpower = {};

    //   console.log(capacity_data);

    //    if(data_count > 0 ) {

    //       for (var i = 0; i < data_count; i++) {

    //         if(capacity_data[i]['service_details'] != undefined) {


    //           if(isServiceCancelled(capacity_data[i]['service_details']['lead_history'])) {

                

    //           } else {

    //               if(capacity_data[i]['service_details']['service_date'].length > 1) {

    //                 var service_date_arr = capacity_data[i]['service_details']['service_date'];
    //                 var service_date_arr_length = service_date_arr.length;
    //                 var service_date_index = 0;

    //                 // for (var k = 0; k < service_date_arr_length; k++) {

    //                 //   // console.log(current_date + "==" + service_date_arr[k].substr(0,10) + " ->" + (current_date == service_date_arr[k].substr(0,10)));
                      
    //                 //   if(current_date == service_date_arr[k].substr(0,10)) {
    //                 //     service_date_index = k;
    //                 //     break;
    //                 //   }

    //                 // };

    //                 var order_no = getOrderNo(current_date,service_date_arr,service_date_arr_length);

    //                 console.log("Date : " + service_date_arr[capacity_data[i]['order_no']-1] + "Calculated: " + capacity_data[i]['order_no'] + " | Order No: " + order_no);

    //                 if(capacity_data[i]['order_no'] == order_no) {

    //                   c_janitor = checkNullOrEmpty(capacity_data[i]['service_details'].janitor[capacity_data[i]['order_no']-1]);
    //                   c_supervisor = checkNullOrEmpty(capacity_data[i]['service_details'].supervisor[capacity_data[i]['order_no']-1]);
    //                   c_teamleader = checkNullOrEmpty(capacity_data[i]['service_details'].team_leader[capacity_data[i]['order_no']-1]);

    //                   // console.log(capacity_data[i]['service_details']['service_date'][capacity_data[i]['order_no']-1]);
    //                   console.log("Service ID: " + capacity_data[i]['service_details']['_id'] +", " + "Service Date Length: " + capacity_data[i]['service_details']['service_date'].length +", City: "+ capacity_data[i]['service_details'].city  +" | "+ capacity_data[i].city +", Janitor: " + c_janitor + " | Supervisor: " + c_supervisor + " | Team Leader: " + c_teamleader + "--- AMC: " + capacity_data[i].is_amc + "===" + capacity_data[i]['service_details'].is_amc);


    //                   if(capacity_data[i]['service_details'].city == 1) {
    //                     sum_m = sum_m + c_janitor + c_supervisor + c_teamleader;
    //                   } else if(capacity_data[i]['service_details'].city == 2) {
    //                     sum_b = sum_b + c_janitor + c_supervisor + c_teamleader;
    //                     console.log(sum_b);
    //                   } else if(capacity_data[i]['service_details'].city == 3) {
    //                     sum_d = sum_d + c_janitor + c_supervisor + c_teamleader;
    //                   }



    //                 }


    //               } else {


    //                 c_janitor = checkNullOrEmpty(capacity_data[i]['service_details'].no_of_janitor);
    //                 c_supervisor = checkNullOrEmpty(capacity_data[i]['service_details'].no_of_supervisor);
    //                 c_teamleader = checkNullOrEmpty(capacity_data[i]['service_details'].no_of_team_leader);

    //                 // if(capacity_data[i].is_amc == 1) {
    //                 //   console.log(capacity_data[i]['service_date'][0]);
    //                 // } else {
    //                 //   console.log(capacity_data[i]['service_details']['service_date'][0]);
    //                 // }
    //                 console.log("Service ID: " + capacity_data[i]['service_details']['_id'] +", " + "Service Date Length: " + capacity_data[i]['service_details']['service_date'].length +", City: "+ capacity_data[i]['service_details'].city  + " | "+ capacity_data[i].city + ", Janitor: " + c_janitor + " | Supervisor: " + c_supervisor + " | Team Leader: " + c_teamleader + "--- AMC: " + capacity_data[i].is_amc + "===" + capacity_data[i]['service_details'].is_amc);                



    //                 if(capacity_data[i]['service_details'].city == 1) {
    //                   sum_m = sum_m + c_janitor + c_supervisor + c_teamleader;
    //                 } else if(capacity_data[i]['service_details'].city == 2) {
    //                   sum_b = sum_b + c_janitor + c_supervisor + c_teamleader;
    //                   console.log(sum_b);
    //                 } else if(capacity_data[i]['service_details'].city == 3) {
    //                   sum_d = sum_d + c_janitor + c_supervisor + c_teamleader;
    //                 }


    //               }

    //           }

    //         }



    //     };

    //     if(selected_city == 1) {
    //       res_manpower['rem'] = sum_m;
    //     } else if(selected_city == 2) {
    //       res_manpower['rem'] = sum_b;
    //     } else if(selected_city == 3) {
    //       res_manpower['rem'] = sum_d;
    //     }

    //     // $scope.mumbai_deployment_count = sum_m;
    //     // $scope.bangalore_deployment_count = sum_b;
    //     // $scope.delhi_deployment_count = sum_d;

    //   } else {

    //     res_manpower['rem'] = 0;
    //   }


    //   ManpowerService.getManpower(keyValueArr).then(function(response){
    //     var manpower_data_count = response.data.message.length;

    //     if(manpower_data_count > 0) {

    //       if(selected_city == 1) {
    //         res_manpower['total'] = response.data.message[0].manpower_details[0].no_of_manpower;
    //       } else if(selected_city == 2) {
    //         res_manpower['total'] = response.data.message[0].manpower_details[1].no_of_manpower;
    //       } else if(selected_city == 3) {
    //         res_manpower['total'] = response.data.message[0].manpower_details[2].no_of_manpower;
    //       } else {
    //         res_manpower['total'] = 0;
    //       }

    //     } else {
    //         res_manpower['total'] = 0;
    //     }

    //     callback(res_manpower);

    //   }); 


    // });


    var manpower_data = {
      'service_date': current_date
    };

    LeadService.getManpowerCapacity(angular.toJson(manpower_data)).then(function(response){
      
      var manpower_details = response.data;
      console.log(manpower_details);

      angular.forEach(manpower_details,function(value,key){

        if(value.id == selected_city) {
          res_manpower['rem'] = value.used;
          res_manpower['total'] = value.no_of_manpower;  
        }

        if(value.id == selected_city) {
          res_manpower['rem'] = value.used;
          res_manpower['total'] = value.no_of_manpower;
        }

        if(value.id == selected_city) {
          res_manpower['rem'] = value.used;
          res_manpower['total'] = value.no_of_manpower;
        }
        

      });

      callback(res_manpower);  


    });




  } else {

    callback({ 'rem': 0, 'total': 0 });

  }

}



});



function parseISO(s) {
  s = s.split(/\D/);
  return new Date(Date.UTC(s[0],--s[1],s[2],s[3],s[4],s[5],s[6]));
}

function getRandomValue(myArray) {
  return myArray[Math.floor(Math.random() * myArray.length)];
}

function getRandomFromRange(minimum,maximum) {
  var randomNo = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  return randomNo;
}


function getSelectedValues() {

  var checkboxes = document.getElementsByName('selectedService[]');
  var sIds = [];
  //var vals = "";
  for (var i=0, n=checkboxes.length;i<n;i++)
  {
      if (checkboxes[i].checked)
      {
          //vals += ","+checkboxes[i].value;
          // console.log(checkboxes[i].value);
          sIds.push(checkboxes[i].value);
      }
  }

  return sIds;

}

function getAllChecked(flag) {

  var checkboxes = document.getElementsByName('selectedService[]');
  //var vals = "";
  for (var i=0, n=checkboxes.length;i<n;i++)
  {
    checkboxes[i].checked = flag;
  }

}

function isClosedService(lead_history_arr) {
  for (var i = 0; i < lead_history_arr.length; i++) {
    if(lead_history_arr[i].lead_stage == 17) {
      return 1;
    }
  }
  return 0;
}

function createSMSTemplate(link) {
  var msg = ' You can pay Mr. Homecare for the services rendered by clicking on this link: ';
  msg += link;
  return msg;
}

function createOngoingEmailTemplate(firstname,lead_id) {

  var msg = 'Dear ' + firstname + '<br /><br />';
  msg += '<p style="font-size: 15px;">Is the service proceeding smoothly?</p>';
  msg += '<table cellspacing="0">';
    msg += '<tr>';
      msg += '<td style="padding: 5px;">';
      msg += '<a href="http://crm.mrhomecare.net/feedback/ongoing/1/'+ lead_id +'" style="text-decoration: none;display: inline-block;background: #3cb371;padding: 10px;padding-left: 20px;padding-right: 20px;color: #ffffff;font-weight: bold;font-size: 16px;border-radius: 4px; box-shadow: 0px 3px #2e9059; -webkit-box-shadow: 0px 3px #2e9059;">Yes</a>';
      msg += '</td>';
      msg += '<td>&nbsp;&nbsp;&nbsp;</td>';
      msg += '<td style="padding: 5px;">';
      msg += '<a href="http://crm.mrhomecare.net/feedback/ongoing/2/' + lead_id +'" style="text-decoration: none;display: inline-block;background: #ec4141;padding: 10px;padding-left: 20px;padding-right: 20px;color: #ffffff;font-weight: bold;font-size: 16px;border-radius: 4px; box-shadow: 0px 3px #c12d2d; -webkit-box-shadow: 0px 3px #c12d2d;">No</a>';
      msg += '</td>';
    msg += '</tr>';
  msg += '</table><br /><br />';
  msg += 'Thank You';

  return msg;

}

function createOngoingSMSTemplate(firstname) {
  var msg = 'Dear ' + firstname;
  msg += 'Is the service proceeding smoothly? ';
  msg += 'If no, call 9022070070 now for further assistance.';
  return msg;
}

function createRescheduledCancelledOrder(firstname) {
  var msg = 'Dear ' + firstname + '<br /><br />';
  msg += 'Please note that your order has been canceled from your current order of booking. If this is a reschedule, please ';
  msg += 'allow us to send you a confirmation for a new service date. If this is a cancellation, kindly treat this email as a ';
  msg += 'confirmation. If you have neither rescheduled nor canceled, kindly reply to this email and let us know.<br /><br />';
  msg += 'Thank you.'
  return msg;
}

function createQuoteTemplate(firstname,service_obj_arr) {
  var msg = 'Dear ' + firstname + '<br /><br />';
  msg += 'Please find our quotation for the services requested: <br /><br />';
  msg += '<ul>';
  for (var i = service_obj_arr.length - 1; i >= 0; i--) {
    msg += '<li>For ' + service_obj_arr[i].service_name + ': Rs.' + service_obj_arr[i].invoice_amount + ' (inclusive of service tax)</li>';
  };
  msg += '</ul><br />';
  msg += 'Notes:';
  msg += '<ul>';
  msg += '<li>Please ensure that there is no maintenance work taking place in the same area, since it hampers the process of cleaning</li>';
  msg += '<li>We would request you to highlight any areas that need special handling, so that we may take care of the same.</li>'
  msg += '</ul><br />';
  msg += 'Should you have any queries, please do get in touch with us. Looking forward to be of service. Thank you.';

  return msg;

}




function checkNullOrEmpty(val) {
  if(val == null || val == undefined || val == "") {
    return 0;
  } else {
    return val;
  }
}


function getMaxDate(service_dates_array) {

  var new_service_dates_array = [];
  var max_date_in_unix = 0;
  var max_date = "";
  var return_arr = [];

  for (var i = 0; i < service_dates_array.length; i++) {
    var dt = moment(service_dates_array[i][0]).unix();
    if(dt > max_date_in_unix) {
      max_date_in_unix = dt;
      max_date = service_dates_array[i][0];
    }
  };

  return max_date;

}

function inWords (totalRent) {

    var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];
    var number = parseFloat(totalRent).toFixed(2).split(".");
    var num = parseInt(number[0]);
    var digit = parseInt(number[1]);
    //console.log(num);
    if ((num.toString()).length > 9)  return 'overflow';
    var n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    var d = ('00' + digit).substr(-2).match(/^(\d{2})$/);;
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupee ' : '';
    str += (d[1] != 0) ? ((str != '' ) ? "and " : '') + (a[Number(d[1])] || b[d[1][0]] + ' ' + a[d[1][1]]) + 'Paise ' : '';
    console.log(str);
    return str;

  
}


function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}