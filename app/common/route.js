var App = angular.module('header', []);

App.config([
    '$stateProvider',
    function(
        $stateProvider) {

        $stateProvider.state({
            name: 'header',
            url: '/header',
            templateUrl: 'app/modules/index.html',
            controller: 'HeaderCtrl',
        });
    }
]);
