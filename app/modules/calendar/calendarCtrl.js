var App = angular.module("kapcalendar");

App.controller("CalendarCtrl", [
  "$scope",
  "$compile",
  "$rootScope",
  "$state",
  "$route",
  "$stateParams",
  "$timeout",
  "LeadFactory",
  "KAPFactory",
  "CityFactory",
  "SweetAlert",
  "configSettings",
  "uiCalendarConfig",
  function (
    $scope,
    $compile,
    $rootScope,
    $state,
    $route,
    $stateParams,
    $timeout,
    LeadFactory,
    KAPFactory,
    CityFactory,
    SweetAlert,
    configSettings,
    uiCalendarConfig
  ) {
    var user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      $rootScope.authenticated = true;
      $rootScope.currentUser = user;
    } else {
      $rootScope.authenticated = false;
      $state.go("auth");
    }

    $scope.leadData = {};
    $scope.test = "Lead Manager";
    $scope.kap_company = '';
    $scope.companies = [];
    $scope.is_editable = false;

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $scope.events = [];

    getAllKaps();

    function getAllKaps() {
      // $scope.events = [];

      KAPFactory.getAllKAPs().then(function(response){
        console.log(response);
        if(response && response.data && response.data.result) {
          var eventData = response.data.result;
          for(var i=0; i< eventData.length; i++) {
            console.log(eventData[i]);
            $scope.addEvent({
              title: eventData[i].title,
              start: eventData[i].start,
              stick: true,
              id: eventData[i].id,
              kap_date: eventData[i].kap_date,
              lead_id: eventData[i].lead_id
            });
          }
  
        }
      });

    }


    LeadFactory.getCompanies().then(function (response) {
      $scope.companies = response.data.result;
    });

    // KAPFactory.getAllEvents().then(function(response){
    //   console.log(response);
    // });


    /* alert on eventClick */
    $scope.alertOnEventClick = function( date, jsEvent, view){
        $scope.alertMessage = (date.title + ' was clicked ');
        console.log(date);
        $scope.leadData.company_name = date.lead_id + '';
        $scope.leadData.kap_date = date.kap_date;
        $scope.leadData.activity = date.title;
        $scope.is_editable = true;
        $scope.kap_id = date.id;
    };
    /* alert on Drop */
    $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
      $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
      $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function(sources,source) {
      var canAdd = 0;
      angular.forEach(sources,function(value, key){
        if(sources[key] === source){
          sources.splice(key,1);
          canAdd = 1;
        }
      });
      if(canAdd === 0){
        sources.push(source);
      }
    };
    /* add custom event*/
    $scope.addEvent = function(obj) {
      $scope.events.push(obj);
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
    /* Change View */
    $scope.changeView = function(view,calendar) {
      console.log("1");
      uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
    };
    /* Change View */
    $scope.renderCalender = function(calendar) {
      // console.log("1");
      if(uiCalendarConfig.calendars[calendar]){
        uiCalendarConfig.calendars[calendar].fullCalendar('render');
      }
    };
    /* Render Tooltip */
    $scope.eventRender = function( event, element, view ) { 
      
        element.attr({'tooltip': event.title,
                    'tooltip-append-to-body': true});
        $compile(element)($scope);
    };

    $scope.selectEventClick = function(start, end, jsEvent, view) {
      console.log(moment(start).format());
    };


    $scope.uiConfig = {
      calendar:{
        editable: true,
        header:{
          left: 'title',
          center: 'month,agendaWeek,agendaDay',
          right: 'today prev,next'
        },
        selectable: true,
        select: $scope.selectEventClick,
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        eventRender: $scope.eventRender
      }
    };


    // $scope.events = [
    //   {title: 'All Day Event',start: new Date(y, m, 1)},
    //   {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: true},
    //   {title: 'Birthday Party',start: new Date(y, m, 1, 19, 0),end: new Date(y, m, 1, 22, 30),allDay: false},
    //   {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'}
    // ];
    
    $scope.eventSources = [$scope.events];

    $scope.get_all_kaps = function (lead_id, company_name) {
      $scope.lead_id = lead_id;
      $scope.kaps = [];
      $scope.kap_company = company_name;

      LeadFactory.getLeadKAPs(lead_id).then(function (response) {
        $scope.kaps = response.data.result;

        angular.element("#view_kaps").modal("show");
      });
    };

    $scope.add_kap = function () {
      angular.element("#add_kap").modal("show");
    };

    $scope.edit_kap = function (kap) {
      $scope.leadData = kap;
      $scope.kap_id = kap.id;
      angular.element("#edit_kap").modal("show");
    };

    $scope.save_kap = function () {
      if (
        $scope.leadData.company_name == "" ||
        $scope.leadData.company_name == undefined ||
        $scope.leadData.company_name == null
      ) {
        SweetAlert.swal("Error!", "Please select company", "error");
        return;
      }
      
      if (
        $scope.leadData.kap_date == "" ||
        $scope.leadData.kap_date == undefined ||
        $scope.leadData.kap_date == null
      ) {
        SweetAlert.swal("Error!", "Please select your KAP date", "error");
        return;
      }

      if (
        $scope.leadData.activity == "" ||
        $scope.leadData.activity == undefined ||
        $scope.leadData.activity == null
      ) {
        SweetAlert.swal("Error!", "Please enter your activity", "error");
        return;
      }

      var data = {};

      data.activity = $scope.leadData.activity;
      data.kap_date = $scope.leadData.kap_date;
      data.lead_id = $scope.leadData.company_name;
      

      KAPFactory.saveKAP(data).then(function (response) {
        if (response != undefined && response != null) {
          if (response.data != undefined && response.data != null) {
            uiCalendarConfig.calendars.myCalendar.fullCalendar('render');
            // getAllKaps();
            $state.reload();
            // SweetAlert.swal("Success!", response.data.message, "success");
            toastr.success(null, response.data.message);
          }

          var rem_data = {};

          rem_data.id = $scope.leadData.company_name;
          rem_data.reminder = $scope.leadData.kap_date;

          LeadFactory.setLeadReminder(rem_data).then(function (res) {
            $scope.kap_date = "";

            if (res != undefined && res != null) {
              if (res.data != undefined && res.data != null) {
                $scope.leadData = {};
              }
            }
          });
        }
      });
    };

    $scope.update_kap = function () {

      if (
        $scope.leadData.company_name == "" ||
        $scope.leadData.company_name == undefined ||
        $scope.leadData.company_name == null
      ) {
        SweetAlert.swal("Error!", "Please select company", "error");
        return;
      }

      if (
        $scope.leadData.kap_date == "" ||
        $scope.leadData.kap_date == undefined ||
        $scope.leadData.kap_date == null
      ) {
        SweetAlert.swal("Error!", "Please select your KAP date", "error");
        return;
      }

      if (
        $scope.leadData.activity == "" ||
        $scope.leadData.activity == undefined ||
        $scope.leadData.activity == null
      ) {
        SweetAlert.swal("Error!", "Please enter your activity", "error");
        return;
      }

      var data = {};
      data.id = $scope.kap_id;
      data.activity = $scope.leadData.activity;
      data.kap_date = $scope.leadData.kap_date;
      data.lead_id = $scope.leadData.company_name;

      KAPFactory.updateKAP(data).then(function (response) {
        if (response != undefined && response != null) {
          if (response.data != undefined && response.data != null) {
            // SweetAlert.swal("Success!", response.data.message, "success");
            toastr.success(null, response.data.message);
            // angular.element("#edit_kap .close").trigger("click");
            $state.reload();
            // $scope.get_all_kaps($scope.lead_id);
          }

          var rem_data = {};

          rem_data.id = $scope.leadData.company_name;
          rem_data.reminder = $scope.leadData.kap_date;

          LeadFactory.setLeadReminder(rem_data).then(function (res) {
            $scope.kap_date = "";

            if (res != undefined && res != null) {
              if (res.data != undefined && res.data != null) {
                $scope.leadData = {};
                // $scope.searchLeads(1);
              }
            }
          });
        }
      });
    };

  },
]);
