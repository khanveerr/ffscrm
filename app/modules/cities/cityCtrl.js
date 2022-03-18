var App = angular.module("city");

App.controller("CityCtrl", [
  "$scope",
  "$rootScope",
  "$state",
  "$route",
  "$stateParams",
  "$timeout",
  "CityFactory",
  "SweetAlert",
  function (
    $scope,
    $rootScope,
    $state,
    $route,
    $stateParams,
    $timeout,
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

    if ($rootScope.currentUser.user_type != "A") {
      $state.go("cities");
    }

    $scope.cityData = {};
    $scope.city_id = 0;
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.updateCity = false;
    $scope.show_filter = false;

    getCities(1);

    $scope.toggle_filter = function () {
      $scope.show_filter = !$scope.show_filter;
    };

    $scope.resetForm = function() {
      $scope.cityData = {};
    };

    $scope.save_city = function () {
      if (
        $scope.cityData.name == undefined ||
        $scope.cityData.name == null ||
        $scope.cityData.name == ""
      ) {
        SweetAlert.swal("Error!", "Please enter city name", "error");
      }

      if (
        $scope.cityData.status == undefined ||
        $scope.cityData.status == null ||
        $scope.cityData.status == ""
      ) {
        SweetAlert.swal("Error!", "Please select status", "error");
      }

      CityFactory.createCity($scope.cityData).then(
        function (response) {
          SweetAlert.swal("Success!", response.data.message, "success");
          // angular.element("#add_city .close").trigger("click");
          $scope.cityData = {};
          $scope.searchCities(1);
        },
        function (error) {
          SweetAlert.swal("Error!", error.message, "error");
        }
      );
    };

    $scope.searchCities = function (page) {
      if (page === undefined) {
        page = "1";
      }
      getCities(page);
    };

    function getCities(page) {
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

      $scope.loading = true;
      $scope.hasMoreData = true;

      CityFactory.getCities($scope.search_data).then(function (response) {
        console.log(response);
        $scope.city_data = [];

        if (response.data.result.data.length > 0) {
          var cities = response.data.result.data;

          $scope.totalPages = response.data.result.last_page;
          $scope.currentPage = response.data.result.current_page;

          var pages = [];

          for (var i = 0; i < cities.length; i++) {
            $scope.city_data.push(cities[i]);
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
        }
      });
    }

    $scope.edit_city = function (id) {
      $scope.updateCity = true;
      $scope.cityData = {};

      CityFactory.getCityDetail(id).then(
        function (response) {
          var data = response.data.result;
          $scope.cityData = data;
        },
        function (error) {
          //alert(error.message);
          toastr.error(null, error.message);
        }
      );
    };

    $scope.setCityId = function (id) {
      $scope.city_id = id;
    };

    $scope.delete_city = function (city_id) {
      SweetAlert.swal(
        {
          title: "Do you really want to delete this city?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            CityFactory.deleteCity(city_id).then(
              function (res) {
                SweetAlert.swal("Success!", res.data.message, "success");
                $scope.searchCities(1);
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
