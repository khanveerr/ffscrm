(function() {

    'use strict';

    angular
        .module('authApp')
        .factory('CategoryService', CategoryService);  

    function CategoryService($http) {

        var urlBase = 'http://demo.local/api';
        var Category = {};

        Category.getCategories = function (page) {
            return $http.get(urlBase+'/category/all?page='+page);
        };

        Category.addCategory = function (data) {
            return $http.post(urlBase + '/category/add', data);
        };

        Category.getCategory = function(id) {
            return $http.get(urlBase + '/category/get/'+id);
        };

        Category.deleteCategory = function(id) {
            return $http.get(urlBase + '/category/delete/'+id);
        };

        return Category;


    }

})();