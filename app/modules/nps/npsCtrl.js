var App = angular.module("nps");

App.controller("NPSCtrl", [
  "$scope",
  "$rootScope",
  "$state",
  "$route",
  "$stateParams",
  "$timeout",
  "NPSFactory",
  "SweetAlert",
  "LeadFactory",
  "CityFactory",
  function (
    $scope,
    $rootScope,
    $state,
    $route,
    $stateParams,
    $timeout,
    NPSFactory,
    SweetAlert,
    LeadFactory,
    CityFactory
  ) {
    var user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      $rootScope.authenticated = true;
      $rootScope.currentUser = user;
    } else {
      $rootScope.authenticated = false;
      $state.go("auth");
    }

    if ($rootScope.currentUser.user_type != "A") {
      $state.go("nps_survey");
    }

    $scope.companies = [];
    $scope.cities = [];
    $scope.industries = [];
    $scope.users = [];
    $scope.lead_cities = [];
    $scope.npsData = {};
    $scope.nps_id = 0;
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.updateNPS = false;
    $scope.show_filter = true;

    $scope.score_NA = 0;
    $scope.score_0_3 = 0;
    $scope.score_4_6 = 0;
    $scope.score_7_8 = 0;
    $scope.score_9_10 = 0;
    $scope.average_nps_score = 0;

    getAllNPS(1);

    // LeadFactory.getCompanies().then(function (response) {
    //   $scope.companies = response.data.result;
    // });

    LeadFactory.getIndustries().then(function (response) {
      $scope.industries = response.data.result;
    });

    LeadFactory.getActiveLeadUsers().then(function (response) {
      $scope.users = response.data.result;
    });

    CityFactory.getAllCities(null).then(function (response) {
      console.log(response.data.result)
      $scope.cities = response.data.result;
      $scope.lead_cities = response.data.result;
    });

    $scope.toggle_filter = function () {
      $scope.show_filter = !$scope.show_filter;
    };

    $scope.resetForm = function() {
      $scope.npsData = {};
    };

    $scope.save_nps = function () {
      if (
        $scope.npsData.company_name == undefined ||
        $scope.npsData.company_name == null ||
        $scope.npsData.company_name == ""
      ) {
        SweetAlert.swal("Error!", "Please enter company name", "error");
      }

      if (
        $scope.npsData.client_spoc == undefined ||
        $scope.npsData.client_spoc == null ||
        $scope.npsData.client_spoc == ""
      ) {
        SweetAlert.swal("Error!", "Please enter client spoc", "error");
      }

      if (
        $scope.npsData.interaction_date == undefined ||
        $scope.npsData.interaction_date == null ||
        $scope.npsData.interaction_date == ""
      ) {
        SweetAlert.swal("Error!", "Please select interaction date", "error");
      }

      if (
        $scope.npsData.interaction_type == undefined ||
        $scope.npsData.interaction_type == null ||
        $scope.npsData.interaction_type == ""
      ) {
        SweetAlert.swal("Error!", "Please select interaction type", "error");
      }

      if (
        $scope.npsData.city == undefined ||
        $scope.npsData.city == null ||
        $scope.npsData.city == ""
      ) {
        SweetAlert.swal("Error!", "Please select city", "error");
      }

      if (
        $scope.npsData.industry == undefined ||
        $scope.npsData.industry == null ||
        $scope.npsData.industry == ""
      ) {
        SweetAlert.swal("Error!", "Please select industry", "error");
      }

      console.log($scope.npsData);

      NPSFactory.createNPS($scope.npsData).then(
        function (response) {
          SweetAlert.swal("Success!", response.data.message, "success");
          // angular.element("#add_nps .close").trigger("click");
          $scope.npsData = {};
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
      getAllNPS(page);
    };

    function getAllNPS(page) {
      $scope.search_data = {};

      $scope.page = page;
      $scope.search_data.page = page;

      if (
        $scope.keyword != undefined &&
        $scope.keyword != null &&
        $scope.keyword != ""
      ) {
        $scope.search_data.keyword = $scope.keyword;
      }

      if (
        $scope.city_filter != undefined &&
        $scope.city_filter != null &&
        $scope.city_filter != ""
      ) {
        $scope.search_data.city = $scope.city_filter;
      }

      if (
        $scope.industry_filter != undefined &&
        $scope.industry_filter != null &&
        $scope.industry_filter != ""
      ) {
        $scope.search_data.industry = $scope.industry_filter;
      }

      if (
        $scope.user_filter != undefined &&
        $scope.user_filter != null &&
        $scope.user_filter != ""
      ) {
        $scope.search_data.user_id = $scope.user_filter;
      }

      if (
        $scope.from_date != undefined &&
        $scope.from_date != null &&
        $scope.from_date != ""
      ) {
        $scope.search_data.from_date = $scope.from_date;
      }

      if (
        $scope.to_date != undefined &&
        $scope.to_date != null &&
        $scope.to_date != ""
      ) {
        $scope.search_data.to_date = $scope.to_date;
      }

      if (
        $scope.score_cat_filter != undefined &&
        $scope.score_cat_filter != null &&
        $scope.score_cat_filter != ""
      ) {
        $scope.search_data.score_cat = $scope.score_cat_filter;
      }

      $scope.loading = true;
      $scope.hasMoreData = true;

      NPSFactory.getAllNPS($scope.search_data).then(function (response) {
        console.log(response);
        $scope.nps_data = [];

        if (response.data.result.data.length > 0) {
          var nps = response.data.result.data;

          $scope.totalPages = response.data.result.last_page;
          $scope.currentPage = response.data.result.current_page;

          var pages = [];

          for (var i = 0; i < nps.length; i++) {
            $scope.nps_data.push(nps[i]);
          }

          for (var i = 1; i <= response.data.result.last_page; i++) {
            pages.push(i);
          }


          $scope.score_NA = response.data.score_NA;
          $scope.score_0_3 = response.data.score_0_3;
          $scope.score_4_6 = response.data.score_4_6;
          $scope.score_7_8 = response.data.score_7_8;
          $scope.score_9_10 = response.data.score_9_10;

          $scope.average_nps_score = response.data.average_nps_score;

          $scope.range = pages;

          $scope.hasMoreData = true;
          $scope.loading = false;
        } else {
          $scope.hasMoreData = true;
          $scope.loading = false;

          $scope.score_0_3 = 0;
          $scope.score_4_6 = 0;
          $scope.score_7_8 = 0;
          $scope.score_9_10 = 0;
          $scope.average_nps_score = 0;

        }
      });
    }

    $scope.edit_nps = function (id) {
      $scope.updateNPS = true;
      $scope.npsData = {};

      NPSFactory.getNPSDetail(id).then(
        function (response) {
          var data = response.data.result;
          $scope.npsData = data;
        },
        function (error) {
          //alert(error.message);
          toastr.error(null, error.message);
        }
      );
    };

    $scope.setNPSId = function (id) {
      $scope.nps_id = id;
    };

    $scope.delete_nps = function (nps_id) {
      SweetAlert.swal(
        {
          title: "Do you really want to delete this nps?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            NPSFactory.deleteNPS(nps_id).then(
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
  },
]);
