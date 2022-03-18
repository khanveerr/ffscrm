var App = angular.module("user");

App.controller("UserCtrl", [
  "$scope",
  "$rootScope",
  "$state",
  "$route",
  "$stateParams",
  "$timeout",
  "UserFactory",
  "SweetAlert",
  function (
    $scope,
    $rootScope,
    $state,
    $route,
    $stateParams,
    $timeout,
    UserFactory,
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
      if($state.current.action == 'change_password') {

      } else {
        $state.go("all_leads");
      }
    }

    // console.log($state.current.action);

    $scope.userData = {};
    $scope.user_id = 0;
    $scope.totalPages = 0;
    $scope.currentPage = 1;
    $scope.range = [];
    $scope.updateUser = false;
    $scope.show_filter = false;

    getUsers(1);

    $scope.toggle_filter = function () {
      $scope.show_filter = !$scope.show_filter;
    };

    $scope.save_user = function () {
      if (
        $scope.userData.name == undefined ||
        $scope.userData.name == null ||
        $scope.userData.name == ""
      ) {
        SweetAlert.swal("Error!", "Please enter user name", "error");
      }

      if (
        $scope.userData.email == undefined ||
        $scope.userData.email == null ||
        $scope.userData.email == ""
      ) {
        SweetAlert.swal("Error!", "Please enter user email", "error");
      }

      if (
        $scope.userData.password == undefined ||
        $scope.userData.password == null ||
        $scope.userData.password == ""
      ) {
        SweetAlert.swal("Error!", "Please enter user password", "error");
      }

      if (
        $scope.userData.user_type == undefined ||
        $scope.userData.user_type == null ||
        $scope.userData.user_type == ""
      ) {
        SweetAlert.swal("Error!", "Please select user type", "error");
      }

      UserFactory.createUser($scope.userData).then(
        function (response) {
          SweetAlert.swal("Success!", response.data.message, "success");
          // angular.element("#add_user .close").trigger("click");
          $scope.userData = {};
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
      getUsers(page);
    };

    function getUsers(page) {
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

      UserFactory.getAllUsers($scope.search_data).then(function (response) {
        console.log(response);
        $scope.user_data = [];

        if (response.data.result.data.length > 0) {
          var users = response.data.result.data;

          $scope.totalPages = response.data.result.last_page;
          $scope.currentPage = response.data.result.current_page;

          var pages = [];

          for (var i = 0; i < users.length; i++) {
            $scope.user_data.push(users[i]);
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

    $scope.edit_user = function (id) {
      $scope.updateUser = true;
      $scope.userData = {};

      UserFactory.getUserDetail(id).then(
        function (response) {
          var data = response.data.result;
          $scope.userData = data;
        },
        function (error) {
          //alert(error.message);
          toastr.error(null, error.message);
        }
      );
    };

    $scope.setUserId = function (id) {
      $scope.user_id = id;
    };

    $scope.delete_user = function (user_id) {
      SweetAlert.swal(
        {
          title: "Do you really want to delete this user?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!",
          closeOnConfirm: false,
        },
        function (isConfirm) {
          if (isConfirm) {
            UserFactory.deleteUser(user_id).then(
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

    $scope.change_password = function() {

      if($scope.new_password != $scope.confirm_new_password) {
        toastr.error(null, "Password doesn't match!");
        return;
      }

      var data = {};
      data.old_password = $scope.old_password;
      data.new_password = $scope.new_password;

      UserFactory.changePassword(data).then(function(response){
        console.log(response);
        toastr.success(null, response.data.message);
        $scope.old_password = '';
        $scope.new_password = '';
        $scope.confirm_new_password = '';
      }, function(errors){
        console.log(errors);
        if(errors) {

          if(errors.data.error == 'invalid_credentials') {
            toastr.error(null, "Incorrect password.");
          }

          if(errors.data.error == 'user_not_found') {
            toastr.error(null, "Please login again.");
          }

        }
      })

    }

  },
]);
