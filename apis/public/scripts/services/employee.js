(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('EmployeeService', EmployeeService);  

    function EmployeeService($http) {

        var urlBase = 'http://demo.local/api';
        var Employee = {};

        Employee.getEmployees = function (page) {
            return $http.get(urlBase+'/employee/all?page='+page);
        };

        Employee.addEmployee = function (data) {
            return $http.post(urlBase + '/employee/add', data);
        };

        Employee.getEmployee = function(id) {
            return $http.get(urlBase + '/employee/get/'+id);
        };

        Employee.deleteEmployee = function(id) {
            return $http.get(urlBase + '/employee/delete/'+id);
        };

        return Employee;


    }

})();