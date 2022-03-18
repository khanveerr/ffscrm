var App = angular.module("lead_db");

App.controller("LeadDBCtrl", [
  "$scope",
  "$rootScope",
  "$state",
  "$route",
  "$stateParams",
  "$timeout",
  "LeadFactory",
  "KAPFactory",
  "CityFactory",
  "SweetAlert",
  function (
    $scope,
    $rootScope,
    $state,
    $route,
    $stateParams,
    $timeout,
    LeadFactory,
    KAPFactory,
    CityFactory,
    SweetAlert
  ) {
    var user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      $rootScope.authenticated = true;
      $rootScope.currentUser = user;
    } else {
      $rootScope.authenticated = false;
      $state.go("auth");
    }

    $scope.leadData = {};
    $scope.reminder = "";
    $scope.test = "Lead Manager";
    var is_poc = 0;
    $scope.lead_id = 0;
    $scope.c0_total = 0;
    $scope.c1_total = 0;
    $scope.c2_total = 0;
    $scope.c3_total = 0;
    $scope.total_c2_probability_value = 0;
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.show_other_reason = false;
    $scope.show_filter = true;
    $scope.users = [];

    $scope.companies = [];
    $scope.industries = [];
    $scope.leadsources = [];
    $scope.cities = [];
    $scope.states = [];

    getLeads(1);

    $scope.toggle_filter = function () {
      $scope.show_filter = !$scope.show_filter;
    };

    LeadFactory.getCompanies().then(function (response) {
      $scope.companies = response.data.result;
    });

    LeadFactory.getStates().then(function (response) {
      $scope.states = response.data.result;
    });

    LeadFactory.getIndustries().then(function (response) {
      $scope.industries = response.data.result;
    });

    LeadFactory.getLeadsources().then(function (response) {
      $scope.leadsources = response.data.result;
    });

    LeadFactory.getLeadUsers().then(function (response) {
      $scope.users = response.data.result;
    });

    CityFactory.getAllCities().then(function (response) {
      $scope.cities = response.data.result;
    });

    $scope.save_lead = function () {
      if (
        $scope.leadData.company_poc_email == undefined ||
        $scope.leadData.company_poc_email == null ||
        $scope.leadData.company_poc_email == ""
      ) {
      } else {
        is_poc = 1;
      }

      if (
        $scope.leadData.company_poc_mobile == undefined ||
        $scope.leadData.company_poc_mobile == null ||
        $scope.leadData.company_poc_mobile == ""
      ) {
      } else {
        is_poc = 1;
      }

      if (
        ($scope.leadData.company_poc_email == undefined ||
          $scope.leadData.company_poc_email == null ||
          $scope.leadData.company_poc_email == "") &&
        ($scope.leadData.company_poc_mobile == undefined ||
          $scope.leadData.company_poc_mobile == null ||
          $scope.leadData.company_poc_mobile == "")
      ) {
        is_poc = 0;
      }

      if (is_poc == 0) {
        SweetAlert.swal(
          "Error!",
          "Please enter company poc email or mobile",
          "error"
        );
        $scope.leadForm.company_poc_email.$error.min = true;
        return;
      } else {
        $scope.leadForm.company_poc_email.$error.min = false;
      }

      if (
        $scope.leadData.user_id == undefined ||
        $scope.leadData.user_id == null ||
        $scope.leadData.user_id == ""
      ) {
        SweetAlert.swal(
          "Error!",
          "Please select leadowner",
          "error"
        );
        return;
      }

      $scope.leadData.c2_probability_value = 0;

      if (
        $scope.leadData.c2_value != undefined &&
        $scope.leadData.c2_value != null &&
        $scope.leadData.c2_value != ""
      ) {
        if (
          $scope.leadData.c2_probability_perc == undefined ||
          $scope.leadData.c2_probability_perc == null ||
          $scope.leadData.c2_probability_perc == ""
        ) {
          SweetAlert.swal("Error!", "Please enter c2 probability", "error");
          $scope.leadForm.c2_probability_perc.$error.mandatory = true;
          return;
        } else {
          $scope.leadForm.c2_probability_perc.$error.mandatory = false;
        }

        $scope.leadData.c2_probability_value =
          parseFloat($scope.leadData.c2_value) *
          (parseFloat($scope.leadData.c2_probability_perc) / 100);

        $scope.leadData.c2_probability_value = parseFloat(
          $scope.leadData.c2_probability_value
        ).toFixed(1);
      } else {
        $scope.leadForm.c2_probability_perc.$error.mandatory = false;
      }

      LeadFactory.createLead($scope.leadData).then(
        function (response) {
          SweetAlert.swal("Success!", response.data.message, "success");
          // angular.element("#add_lead .close").trigger("click");
          $scope.leadData = {};
          $scope.searchLeads(1);
        },
        function (error) {
          SweetAlert.swal("Error!", error.message, "error");
        }
      );
    };

    $scope.searchLeads = function (page) {
      if (page === undefined) {
        page = "1";
      }
      getLeads(page);
    };

    $scope.show_lead_details = function (id) {
      // $scope.updateLead = true;
      $scope.leadData = {};

      LeadFactory.getLeadDetail(id).then(
        function (response) {
          var data = response.data.result;
          $scope.leadData = data;
          
          // angular.element("#view_lead_details").modal("show");
        },
        function (error) {
          //alert(error.message);
          toastr.error(null, error.message);
        }
      );
    };

    function getLeads(page) {
      $scope.search_data = {};

      $scope.page = page;
      $scope.search_data.page = page;

      if (
        $scope.sales_stage_filter != undefined &&
        $scope.sales_stage_filter != null &&
        $scope.sales_stage_filter != ""
      ) {
        $scope.search_data.sales_stage = $scope.sales_stage_filter;
      }

      if (
        $scope.project_type_filter != undefined &&
        $scope.project_type_filter != null &&
        $scope.project_type_filter != ""
      ) {
        $scope.search_data.project_type = $scope.project_type_filter;
      }

      if (
        $scope.spoc_filter != undefined &&
        $scope.spoc_filter != null &&
        $scope.spoc_filter != ""
      ) {
        $scope.search_data.spoc = $scope.spoc_filter;
      }

      if (
        $scope.leadsource_filter != undefined &&
        $scope.leadsource_filter != null &&
        $scope.leadsource_filter != ""
      ) {
        $scope.search_data.leadsource = $scope.leadsource_filter;
      }

      if (
        $scope.city_filter != undefined &&
        $scope.city_filter != null &&
        $scope.city_filter != ""
      ) {
        $scope.search_data.city = $scope.city_filter;
      }

      if (
        $scope.state_filter != undefined &&
        $scope.state_filter != null &&
        $scope.state_filter != ""
      ) {
        $scope.search_data.state = $scope.state_filter;
      }

      if (
        $scope.user_filter != undefined &&
        $scope.user_filter != null &&
        $scope.user_filter != ""
      ) {
        $scope.search_data.user_id = $scope.user_filter;
      }

      if (
        $scope.keyword != undefined &&
        $scope.keyword != null &&
        $scope.keyword != ""
      ) {
        $scope.search_data.keyword = $scope.keyword;
      }

      if (
        $scope.sort_filter != undefined &&
        $scope.sort_filter != null &&
        $scope.sort_filter != ""
      ) {
        $scope.search_data.sort_order = $scope.sort_filter;
      }

      $scope.search_data.status = "database";
      $scope.loading = true;
      $scope.hasMoreData = true;

      LeadFactory.getAllLeads($scope.search_data).then(function (response) {
        $scope.lead_data = [];

        if (response.data.result.data.length > 0) {
          var leads = response.data.result.data;
          $scope.c0_total = response.data.total_c0_sum;
          $scope.c1_total = response.data.total_c1_sum;
          $scope.c2_total = response.data.total_c2_sum;
          $scope.c3_total = response.data.total_c3_sum;
          $scope.total_c2_probability_value =
            response.data.total_c2_probability_value;

          $scope.totalPages = response.data.result.last_page;
          $scope.currentPage = response.data.result.current_page;

          var pages = [];

          for (var i = 0; i < leads.length; i++) {
            $scope.lead_data.push(leads[i]);
          }

          for (var i = 1; i <= response.data.result.last_page; i++) {
            pages.push(i);
          }

          $scope.range = pages;

          $scope.hasMoreData = true;
          $scope.loading = false;
        } else {
          $scope.hasMoreData = true;
          $scope.loading = false;

          $scope.c0_total = 0;
          $scope.c1_total = 0;
          $scope.c2_total = 0;
          $scope.c3_total = 0;
          $scope.total_c2_probability_value = 0;
        }
      });
    }

    $scope.setImportant = function (value, lead_id) {
      var msg = "";
      var success_msg = "";
      if (value == 1) {
        msg = "Do you really want to make this lead important?";
        success_msg = "Lead marked as important";
      } else {
        msg = "Do you really want to make this lead not important?";
        success_msg = "Lead marked as not important";
      }

      SweetAlert.swal(
        {
          title: msg,
          type: "info",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes",
          closeOnConfirm: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            var data = {};
            data.id = lead_id;
            data.important = parseFloat(value);

            LeadFactory.setLeadImportant(data).then(
              function (res) {
                SweetAlert.swal("Success!", success_msg, "success");
                // $route.reload();
                $scope.searchLeads(1);
              },
              function (error) {
                //alert(error.message);
                SweetAlert.swal("Error!", "Error updating lead", "error");
              }
            );
          }
        }
      );
    };

    $scope.edit_lead = function (id) {
      $scope.updateLead = true;
      $scope.leadData = {};

      LeadFactory.getLeadDetail(id).then(
        function (response) {
          var data = response.data.result;
          $scope.leadData = data;
        },
        function (error) {
          //alert(error.message);
          toastr.error(null, error.message);
        }
      );
    };

    $scope.setLeadId = function (id, reminder = "") {
      $scope.lead_id = id;
      $scope.reminder = reminder;
    };

    $scope.update_reminder = function () {
      var data = {};

      if (
        $scope.reminder == undefined ||
        $scope.reminder == null ||
        $scope.reminder == ""
      ) {
        toastr.error(null, "Please select reminder date");
        return;
      }

      data.id = $scope.lead_id;
      data.reminder = $scope.reminder;

      LeadFactory.setLeadReminder(data).then(
        function (response) {
          if (response != undefined && response != null) {
            if (response.data != undefined && response.data != null) {
              SweetAlert.swal("Success!", response.data.message, "success");
              // angular.element("#update_reminder .close").trigger("click");
              $scope.reminder = "";
              $scope.searchLeads(1);
            }
          }
        },
        function (error) {
          SweetAlert.swal("Error!", error.message, "error");
        }
      );
    };

    $scope.delete_lead = function (lead_id) {
      SweetAlert.swal(
        {
          title: "Do you really want to delete this lead?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            LeadFactory.deleteLead(lead_id).then(
              function (res) {
                SweetAlert.swal("Success!", res.data.message, "success");
                $scope.searchLeads(1);
              },
              function (error) {
                SweetAlert.swal("Error!", error.data.message, "error");
              }
            );
          }
        }
      );
    };

    $scope.edit_won_lead = function (id, c3_value) {
      if (
        c3_value == undefined ||
        c3_value == null ||
        c3_value == "" ||
        c3_value == 0 ||
        c3_value == "0"
      ) {
        SweetAlert.swal("Info!", "Please update c3 value", "info");
        return;
      }

      $scope.leadData = {};
      $scope.is_new_lead = false;
      $scope.leadUpData = {};

      LeadFactory.getLeadDetail(id).then(
        function (response) {
          var data = response.data.result;
          $scope.leadUpData = data;
          $scope.leadData.id = data.id;
          $scope.leadData.company_name = data.company_name;
          $scope.leadData.c3_won_value = data.c3_value;
          $scope.leadData.won_month = data.won_month;

          if (data.c3_value == data.c0_value) {
            $scope.is_new_lead = false;
          } else {
            $scope.is_new_lead = true;
          }

          // angular.element("#add_won_lead").modal("show");
        },
        function (error) {
          SweetAlert.swal("Error!", error.message, "error");
        }
      );
    };

    $scope.save_won_lead = function () {
      if (
        $scope.leadData.company_name == "" ||
        $scope.leadData.company_name == undefined ||
        $scope.leadData.company_name == null
      ) {
        SweetAlert.swal("Error!", "Please enter company name", "error");
        return;
      }

      if (
        $scope.lead_won_type == "" ||
        $scope.lead_won_type == undefined ||
        $scope.lead_won_type == null
      ) {
        SweetAlert.swal("Error!", "Please select lead won status", "error");
        return;
      }

      if (
        $scope.leadData.service_start_date == "" ||
        $scope.leadData.service_start_date == undefined ||
        $scope.leadData.service_start_date == null
      ) {
        SweetAlert.swal("Error!", "Please select service start date", "error");
        return;
      }

      if (
        $scope.leadData.contract_renewal_date == "" ||
        $scope.leadData.contract_renewal_date == undefined ||
        $scope.leadData.contract_renewal_date == null
      ) {
        SweetAlert.swal(
          "Error!",
          "Please enter contract renewal date",
          "error"
        );
        return;
      }

      if (
        $scope.leadData.c3_won_value == "" ||
        $scope.leadData.c3_won_value == undefined ||
        $scope.leadData.c3_won_value == null
      ) {
        SweetAlert.swal("Error!", "Please enter c3 value", "error");
        return;
      }

      if (
        $scope.leadData.bdm_value == "" ||
        $scope.leadData.bdm_value == undefined ||
        $scope.leadData.bdm_value == null
      ) {
        SweetAlert.swal("Error!", "Please enter bdm value", "error");
        return;
      }

      var update_data = $scope.leadUpData;
      update_data.c0_value =
        parseFloat(update_data.c0_value) - parseFloat(update_data.c3_value);
      update_data.c1_value =
        parseFloat(update_data.c1_value) - parseFloat(update_data.c3_value);
      update_data.c2_value =
        parseFloat(update_data.c2_value) - parseFloat(update_data.c3_value);
      update_data.c3_value =
        parseFloat(update_data.c3_value) - parseFloat(update_data.c3_value);

      if ($scope.lead_won_type == -3) {
        update_data.status = -3;
      }

      LeadFactory.createLead(update_data).then(function (res) {
        var data = $scope.leadUpData;
        data.c3_won_value = $scope.leadData.c3_won_value;
        data.contract_renewal_date = $scope.leadData.contract_renewal_date;
        data.service_start_date = $scope.leadData.service_start_date;
        data.work_order_date = $scope.leadData.work_order_date;
        data.bdm_value = $scope.leadData.bdm_value;

        data.agp_percentage_value = $scope.leadData.agp_percentage_value;

        if ($scope.is_new_lead == true) {
          $scope.leadData.id = "";
          data.id = "";
        }

        data.c3_won_value =
          data.c3_won_value != undefined ||
          (data.c3_won_value != null &&
            data.c3_won_value != "" &&
            !isNaN(data.c3_won_value))
            ? parseFloat(data.c3_won_value)
            : 0;
        data.c3_won_value = angular.isNumber(data.c3_won_value)
          ? data.c3_won_value
          : 0;

        data.status = 1;

        LeadFactory.createLead(data).then(
          function (response) {
            if (response != undefined && response != null) {
              if (response.data != undefined && response.data != null) {
                SweetAlert.swal("Success!", response.data.message, "success");
                $scope.searchLeads(1);

                // angular.element("#add_won_lead .close").trigger("click");
              }
            }
          },
          function (error) {
            SweetAlert.swal("Error!", error.message, "error");
          }
        );
      });
    };

    $scope.edit_lost_lead = function (id) {
      $scope.leadData = {};

      LeadFactory.getLeadDetail(id).then(
        function (response) {
          var data = response.data.result;
          $scope.leadData.id = data.id;
          $scope.leadData.company_name = data.company_name;
          // angular.element("#add_lost_lead").f("show");
        },
        function (error) {
          SweetAlert.swal("Error!", error.message, "error");
        }
      );
    };

    $scope.otherReason = function (reason) {
      if (reason == 5) {
        $scope.show_other_reason = true;
      } else {
        $scope.show_other_reason = false;
        $scope.leadData.other_reason = "";
      }
    };

    $scope.save_lost_lead = function () {
      if (
        $scope.leadData.reason == "" ||
        $scope.leadData.reason == undefined ||
        $scope.leadData.reason == null
      ) {
        SweetAlert.swal("Error!", "Please select reason", "error");
        return;
      }

      if ($scope.leadData.reason == 5) {
        if (
          $scope.leadData.other_reason == "" ||
          $scope.leadData.other_reason == undefined ||
          $scope.leadData.other_reason == null
        ) {
          SweetAlert.swal("Error!", "Please enter reason", "error");
          return;
        }
      }

      if (
        $scope.leadData.next_follow_up_date == "" ||
        $scope.leadData.next_follow_up_date == undefined ||
        $scope.leadData.next_follow_up_date == null
      ) {
        SweetAlert.swal("Error!", "Please enter next follow up date", "error");
        return;
      }

      if (
        $scope.leadData.lost_contract_value == "" ||
        $scope.leadData.lost_contract_value == undefined ||
        $scope.leadData.lost_contract_value == null
      ) {
        SweetAlert.swal("Error!", "Please enter contact value", "error");
        return;
      }

      var data = $scope.leadData;

      data.lost_contract_value =
        data.lost_contract_value != undefined ||
        (data.lost_contract_value != null &&
          data.lost_contract_value != "" &&
          !isNaN(data.lost_contract_value))
          ? parseFloat(data.lost_contract_value)
          : 0;
      data.lost_contract_value = angular.isNumber(data.lost_contract_value)
        ? data.lost_contract_value
        : 0;
      data.status = 5;

      LeadFactory.createLead(data).then(
        function (response) {
          if (response != undefined && response != null) {
            if (response.data != undefined && response.data != null) {
              SweetAlert.swal("Success!", response.data.message, "success");
              $scope.searchLeads(1);

              // angular.element("#add_lost_lead .close").trigger("click");
              $scope.leadData = {};
            }
          }
        },
        function (error) {
          //alert(error.message);
          SweetAlert.swal("Error!", error.message, "error");
        }
      );
    };

    $scope.get_all_kaps = function (lead_id) {
      $scope.lead_id = lead_id;
      $scope.kaps = [];

      LeadFactory.getLeadKAPs(lead_id).then(function (response) {
        $scope.kaps = response.data.result;

        // angular.element("#view_kaps").modal("show");
      });
    };

    $scope.add_kap = function () {
      // angular.element("#add_kap").modal("show");
    };

    $scope.edit_kap = function (kap) {
      $scope.leadData = kap;
      $scope.kap_id = kap.id;
      // angular.element("#edit_kap").modal("show");
    };

    $scope.save_kap = function () {
      if (
        $scope.leadData.kap_date == "" ||
        $scope.leadData.kap_date == undefined ||
        $scope.leadData.kap_date == null
      ) {
        SweetAlert.swal("Error!", "Please select your KAP date", "error");
        return;
      }

      if (
        $scope.leadData.activity == "" ||
        $scope.leadData.activity == undefined ||
        $scope.leadData.activity == null
      ) {
        SweetAlert.swal("Error!", "Please enter your activity", "error");
        return;
      }

      var data = {};

      data.activity = $scope.leadData.activity;
      data.kap_date = $scope.leadData.kap_date;
      data.lead_id = $scope.lead_id;

      KAPFactory.saveKAP(data).then(function (response) {
        if (response != undefined && response != null) {
          if (response.data != undefined && response.data != null) {
            SweetAlert.swal("Success!", response.data.message, "success");
            // angular.element("#add_kap .close").trigger("click");
            $scope.get_all_kaps($scope.lead_id);
          }

          var rem_data = {};

          rem_data.id = $scope.lead_id;
          rem_data.reminder = $scope.leadData.kap_date;

          LeadFactory.setLeadReminder(rem_data).then(function (res) {
            $scope.kap_date = "";

            if (res != undefined && res != null) {
              if (res.data != undefined && res.data != null) {
                $scope.leadData = {};
                $scope.searchLeads(1);
              }
            }
          });
        }
      });
    };

    $scope.update_kap = function () {
      if (
        $scope.leadData.kap_date == "" ||
        $scope.leadData.kap_date == undefined ||
        $scope.leadData.kap_date == null
      ) {
        SweetAlert.swal("Error!", "Please select your KAP date", "error");
        return;
      }

      if (
        $scope.leadData.activity == "" ||
        $scope.leadData.activity == undefined ||
        $scope.leadData.activity == null
      ) {
        SweetAlert.swal("Error!", "Please enter your activity", "error");
        return;
      }

      var data = {};
      data.id = $scope.kap_id;
      data.activity = $scope.leadData.activity;
      data.kap_date = $scope.leadData.kap_date;
      data.lead_id = $scope.lead_id;

      KAPFactory.updateKAP(data).then(function (response) {
        if (response != undefined && response != null) {
          if (response.data != undefined && response.data != null) {
            SweetAlert.swal("Success!", response.data.message, "success");
            // angular.element("#edit_kap .close").trigger("click");
            $scope.get_all_kaps($scope.lead_id);
          }

          var rem_data = {};

          rem_data.id = $scope.lead_id;
          rem_data.reminder = $scope.leadData.kap_date;

          LeadFactory.setLeadReminder(rem_data).then(function (res) {
            $scope.kap_date = "";

            if (res != undefined && res != null) {
              if (res.data != undefined && res.data != null) {
                $scope.leadData = {};
                $scope.searchLeads(1);
              }
            }
          });
        }
      });
    };

    $scope.move_to_open_leads = function (id) {
      var data = {};

      data.id = id;
      data.status = 0;

      SweetAlert.swal(
        {
          title: "Do you really want to make this as an open lead?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, do it!",
          closeOnConfirm: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            LeadFactory.createLead(data).then(
              function (response) {
                if (response.data.error == false) {
                  SweetAlert.swal("Success!", response.data.message, "success");
                  $scope.searchLeads(1);
                }
              },
              function (error) {
                SweetAlert.swal("Error!", error.data.message, "error");
              }
            );
          }
        }
      );
    };

    $scope.export_data = function() {

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

      

      LeadFactory.exportLead(data).then(function(response){
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
          // angular.element("#export_lead .close").trigger("click");

        }
      });

    };
    
  },
]);
