angular.module('Header', []).controller('HeaderController', function($scope,$rootScope,$window,$http,LeadManagerService,ManpowerService,$timeout,$routeParams,$route,$location,ClientService,CacheService,OrderService,InspectionService,SweetAlert,$filter,serverConfig,bitly,SMSService,AuthService) {

  $scope.mumbai_deployment_total = 0;
  $scope.bangalore_deployment_total = 0;
  $scope.delhi_deployment_total = 0;

	// InspectionService.getInspections({status: 0}).then(function(response) {
 //      $scope.open_inspection_count = response.data.message.length;
 //    });

 //    InspectionService.getInspections({status: 1}).then(function(response) {
 //      $scope.closed_inspection_count = response.data.message.length;
 //    });


     $scope.currentUser = AuthService.currentUser();

    $scope.logout = function() {
	    AuthService.logout();
	    $window.location.href = '/login';
	  };

    $scope.goToPath = function(path) {
      $window.location.href = path;
    };

  //   getCapacityFunction();

  // $scope.getCapacity = function() {
  //   getCapacityFunction();
  // };

  // function getCapacityFunction() {

  //   //debugger;

  //   var today_date = "";
  //   var tomorrow_date = "";
  //   var temp_capacitySearchArr = {};
  //   var keyValueObj = {};
  //   var keyValueArr = {};
  //   var current_date = "";

  //   if($scope.service_date != undefined && $scope.service_date != "" && $scope.service_date != null) {

  //     today_date = moment((new Date($scope.service_date + ' 00:00:00'))).toDate();
  //     tomorrow_date = moment(today_date).add(1,'days').toDate();
  //     keyValueArr['service_date'] = (new Date($scope.service_date + ' 00:00:00')).toISOString();
  //     current_date = $scope.service_date;

  //   } else {

  //     today_date =  new Date(moment().format('YYYY-MM-DD') + ' 00:00:00');
  //     tomorrow_date = moment(today_date).add(1,'days').toDate();
  //     keyValueArr['service_date'] = (new Date(moment().format('YYYY-MM-DD') + ' 00:00:00')).toISOString()
  //     current_date = moment().format('YYYY-MM-DD');
  //   }

  //   temp_capacitySearchArr.from_inquiry_date = today_date.toISOString();
  //   temp_capacitySearchArr.to_inquiry_date = tomorrow_date.toISOString();

  //   //keyValueObj['service_date'] = {"$gte": temp_capacitySearchArr['from_inquiry_date'], "$lt": temp_capacitySearchArr['to_inquiry_date']};
  //   keyValueObj['from_inquiry_date'] = today_date.toISOString();
  //   keyValueObj['to_inquiry_date'] = tomorrow_date.toISOString();
  //   keyValueObj['is_order'] = 1;
  //   keyValueObj['status'] = 0;
  //   keyValueObj['not_amc'] = 1;

  //   var paginationSettings = {
  //     limit: 0,
  //     offset: 0
  //   }

  //   var orderBy = {
  //     created_on: -1
  //   };


  //   var serviceData = {
  //     'searchVal': keyValueObj,
  //     'paginationSettings': paginationSettings,
  //     'orderBy': orderBy
  //   };

  //   var manpower_data = {
  //     'service_date': current_date
  //   };

  //   // LeadManagerService.getManpowerCapacity(angular.toJson(manpower_data)).then(function(response){
      
  //   //   var manpower_details = response.data;
  //   //   console.log(manpower_details);

  //   //   angular.forEach(manpower_details,function(value,key){

  //   //     if(value.id == 1) {
  //   //       $scope.mumbai_deployment_count = value.used;
  //   //       $scope.mumbai_deployment_total = value.no_of_manpower;  
  //   //     }

  //   //     if(value.id == 2) {
  //   //       $scope.bangalore_deployment_count = value.used;
  //   //       $scope.bangalore_deployment_total = value.no_of_manpower;
  //   //     }

  //   //     if(value.id == 3) {
  //   //       $scope.delhi_deployment_count = value.used;
  //   //       $scope.delhi_deployment_total = value.no_of_manpower;
  //   //     }



  //   //   })

  //   // });



  // }


});



function checkNullOrEmpty(val) {
  if(val == null || val == undefined || val == "") {
    return 0;
  } else {
    return val;
  }
}


function isServiceCancelled(service_history_arr) {

  for (var i = 0; i < service_history_arr.length; i++) {
    
    if(service_history_arr[i].lead_stage == 35) {
      return 1;
    }

  };

  return 0;

}

function getOrderNo(current_date,service_date_arr,service_date_arr_length) {

 for (var k = 0; k < service_date_arr_length; k++) {
    // console.log(current_date + "==" + service_date_arr[k].substr(0,10) + " ->" + (current_date == service_date_arr[k].substr(0,10)));    
    if(current_date == service_date_arr[k].substr(0,10)) {
      break;
    }

  };

  return (k+1);

}