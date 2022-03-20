(function() {

    'use strict';

    angular
        .module('authApp')
        .controller('RegisterController', RegisterController);  

    function RegisterController(RegistrationService, $http, $rootScope, $location, SweetAlert, toastr, $state) {

        var vm = this;
        vm.registerData = {};
        vm.errors = {};


        vm.registerUser = function(data) {

            console.log(data);

            RegistrationService.registerUser(data).then(function(response){
                console.log(response);

                if(response.data.status == false) {
                    vm.errors = response.data.errors;
                    toastr.error('Cannot register');
                }
                if(response.data.status == true) {
                    vm.errors = {};
                    SweetAlert.swal("Sucess!", 'User added!', "success");
                    $state.go('auth');
                }
            });

        }
    }

})();