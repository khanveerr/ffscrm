var App = angular.module("kapcalendar", ["ngRoute"]);

App.config([
  "$stateProvider",
  function ($stateProvider) {
    $stateProvider.state({
      name: "all_calendar_kaps",
      url: "/kap/calendar",
      templateUrl: "app/modules/calendar/list.html",
      controller: "CalendarCtrl",
      action: "all_calendar_kaps",
    });
  },
]);
