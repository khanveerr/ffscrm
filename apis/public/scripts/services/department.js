(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('DepartmentService', DepartmentService);  

    function DepartmentService($http) {

        var urlBase = 'http://demo.local/api';
        var Department = {};

        Department.getDepartments = function (page) {
            return $http.get(urlBase+'/department/all?page='+page);
        };

        Department.addDepartment = function (data) {
            return $http.post(urlBase + '/department/add', data);
        };

        Department.getDepartment = function(id) {
            return $http.get(urlBase + '/department/get/'+id);
        };

        Department.deleteDepartment = function(id) {
            return $http.get(urlBase + '/department/delete/'+id);
        };

        return Department;


    }

})();