var App = angular.module("login");

App.controller("LoginCtrl", [
  "$auth",
  "$scope",
  "$rootScope",
  "$state",
  "$http",
  "$stateParams",
  "$timeout",
  "LoginFactory",
  function (
    $auth,
    $scope,
    $rootScope,
    $state,
    $http,
    $stateParams,
    $timeout,
    LoginFactory
  ) {
    var user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      $rootScope.authenticated = true;
      $rootScope.currentUser = user;
      $state.go("all_leads");
    } else {
      $rootScope.authenticated = false;
      $state.go("auth");
    }

    $scope.password_type = "password";

    $scope.show_password = function () {
      $scope.password_type = "text";
    };

    $scope.hide_password = function () {
      $scope.password_type = "password";
    };

    $scope.formData = {};
    $scope.invalid_login = false;

    $scope.authenticate = function () {
      $auth
        .login($scope.formData)
        .then(
          function () {
            return $http.get("apis/public/api/authenticate/user");
          },
          function (errors) {
            if (errors.data) {
              var invalid = 0;

              if (errors.data.msg) {
                angular.forEach(errors.data.msg, function (value, key) {
                  if (key == "email" && value != "" && value.length > 0) {
                    $scope.loginForm.email.$error.invalid = true;
                  } else if (
                    key == "email" &&
                    value == "" &&
                    value.length == 0
                  ) {
                    $scope.loginForm.email.$error.invalid = false;
                  }

                  if (key == "password" && value != "" && value.length > 0) {
                    $scope.loginForm.password.$error.min = true;
                  } else if (
                    key == "password" &&
                    value == "" &&
                    value.length == 0
                  ) {
                    $scope.loginForm.password.$error.min = false;
                  }

                  if (key == "invalid") {
                    invalid = 1;
                  }
                });

                if (invalid == 1) {
                  $scope.invalid_login = true;
                }
              }
            }
          }
        )
        .then(function (response) {
          console.log(response);
          if(response == undefined) {
            toastr.error(null, 'Incorrect usernme or password.');
            return;
          }
          if (response.data != undefined && response.data != null) {
            var user = response.data.user;

            // Set the stringified user data into local storage
            localStorage.setItem("user", JSON.stringify(user));

            // The user's authenticated state gets flipped to
            // true so we can now show parts of the UI that rely
            // on the user being logged in
            $rootScope.authenticated = true;

            // Putting the user's data on $rootScope allows
            // us to access it anywhere across the app
            $rootScope.currentUser = user;

            $state.go("all_leads");
          }
        }, function(errors){
          console.log(errors);
          if(errors) {
            toastr.error(null, 'Incorrect usernme or password.');
          }
        });
    };
  },
]);
