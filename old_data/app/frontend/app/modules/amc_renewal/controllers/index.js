angular.module('AMCRenew', []).controller('AMCRenewController', function($scope,$rootScope,$window,AMCRenewService,$timeout,$route,$location,CacheService,LeadManagerService,SweetAlert,SMSService,AuthService) {

	$scope.orders = [];

    $scope.lead_stage_options = {};
    $scope.services_options = {};
    $scope.lead_source_options = {};
    var service_categories_options = {};
    $scope.variant_options = {};
    $scope.cities = {};
    $scope.vendors = [];
  	var order_details = {};
  	$scope.isStartJob = false;
  	$scope.isStopJob = false;
  	$scope.startId = "";
  	var offset = 0;
  	var limit = 100;
  	var page = 0;
  	$scope.hasMoreData = true;
    $scope.loading = true;
    var selected_order_id = 0;
    var selected_service_id = 0;
    var selected_order_index = 0;
    $scope.job_status = "";
    var filterSearchArr = {};
    $scope.selected_order_obj = {};
    $scope.teamleaders = "";
    $scope.janitors = "";
    $scope.supervisors = "";
    var payment_status_val = "";
    $scope.vendor_options = {};

    $scope.serviceQuality = 0;
    $scope.punctuality = 0;
    $scope.grooming = 0;
    $scope.detailAttention = 0;
    $scope.productKnowledge = 0;
    $scope.commsCoords = 0;
    $scope.mobile_no = '';

    var rateObj = {};

    // $scope.ratingQuality = 1;
    // $scope.ratingTime = 1;
  // var date1 = "2016-11-28T00:00:00.000Z";
  // var date2 = (new Date()).toISOString();

  // if(parseISO(date1) < parseISO(date2)) {
  //   console.log("date1 service done");
  // }



	CacheService.getCache({key: ['leadstage','leadsource','pricelist','varianttype','city','category_pricelist','vendor']}).then(function(response){
      var vendors_obj = [];
      //console.log(response.data.message);
      $scope.lead_stage_options = response.data.message.leadstage;
      $scope.services_options = response.data.message.pricelist;
      $scope.lead_source_options = response.data.message.leadsource;
      service_categories_options = response.data.message.category_pricelist;
      $scope.variant_options = response.data.message.varianttype;
      $scope.cities = response.data.message.city;
      // angular.forEach(response.data.message.vendor,function(value,key){
      //   vendors_obj.push({id: key,name: value});
      // });
      $scope.vendors = response.data.message.vendor;
      //console.log($scope.vendors);

      console.log($scope.variant_options);

    });

    $scope.currentUser = AuthService.currentUser();
    if($scope.currentUser.role == "operations") {
      filterSearchArr.city = $scope.currentUser.city;
    }

    if($scope.currentUser.name.search(/envocare/i) != -1 || $scope.currentUser.email.search(/envocare/i) != -1) {
      filterSearchArr.vendor_allocated = 100;
    }

    $scope.startJob = function(id,service_id,index) {
      // console.log(id);
      // console.log("."+id+" > .startBtn")
      // angular.element("."+id+" > button.startBtn").hide();
      // angular.element("."+id+" > button.stopBtn").show();

      selected_service_id = service_id;

      var updateVal = {
        job_start_timestamp: (new Date()).toISOString()
      };

      AMCRenewService.updatedOrder(updateVal,id).then(function(response){
        if(response.data.message.ok == 1) {
          //$location.path('/orders');

          var updateValService = {
            service_status: 1
          };


            LeadManagerService.updateServiceInfo(updateValService,selected_service_id).then(function(resp){
                if(resp.data.message.ok == 1) {

                  SweetAlert.swal("Job Started!", "Job started successfully.", "success");
                  $scope.orders[index].job_start_timestamp = updateVal['job_start_timestamp'];
                }
            });

        }
      });

      console.log("Job Started");
    };

    $scope.stopJob = function(order_id,service_id,index) {

      selected_order_id = order_id;
      selected_service_id = service_id;
      selected_order_index = index;      
      //console.log(service_id);

    }

    $scope.updateOrderDetails = function() {

      var updateVal = {
        job_end_timestamp: (new Date()).toISOString(),
        material_cost: parseInt($scope.material_cost),
        travel_cost: parseInt($scope.travel_cost)
      };

      console.log(selected_order_id);

      AMCRenewService.updatedOrder(updateVal,selected_order_id).then(function(response){
        if(response.data.message.ok == 1) {

        var updateValService = {
          service_status: 2
        };


          LeadManagerService.updateServiceInfo(updateValService,selected_service_id).then(function(resp){
              if(resp.data.message.ok == 1) {

                SweetAlert.swal("Updated!", "Order details updated.", "success");
                //$route.reload();

                angular.element('#order_costing_details').closeModal();
                $scope.orders[selected_order_index].job_end_timestamp = updateVal['job_end_timestamp'];
              }
          });

        }

      });

    }


    $scope.updateServiceStatus = function(service_id,val,order){

      selected_service_id = service_id;
      selected_order_obj = order;
      selected_order_id = order._id;

      var updateVal = {
        service_status: parseInt(val)
      };

      console.log(selected_order_id);
      console.log(service_id);

      // if(val == -1) {

      //   $scope.firstname = order.client_details.firstname;
      //   $scope.lastname = order.client_details.lastname;

      //   angular.element('#complaint_order_modal').openModal();

      // } else {

        LeadManagerService.updateServiceInfo(updateVal,service_id).then(function(resp){
            if(resp.data.message.ok == 1) {

              SweetAlert.swal("Updated!", "Job status updated.", "success");
              //$route.reload();
            }
        });

      // }



    };

    $scope.addComplaint = function() {

      var complaint_remark_arr = [];

      if(selected_order_obj.hasOwnProperty('complaint_remark') && selected_order_obj.complaint_remark.length > 0) {
        complaint_remark_arr = selected_order_obj.complaint_remark;
      }

      var complaint_remark_obj = {
        remark: $scope.client_feedback,
        added_by: $scope.currentUser.name,
      };

      complaint_remark_arr.push(complaint_remark_obj);

      var updateVal = {
        service_status: -1,
        is_complaint: 1,
        complaint_remark: complaint_remark_arr
      };

      AMCRenewService.updatedOrder(updateVal,selected_order_id).then(function(response){
        if(response.data.message.ok == 1) {

          var complaint_orders_arr = [];

          if(selected_order_obj.service_details.hasOwnProperty('complaint_orders') && selected_order_obj.service_details.complaint_orders.length > 0) {
            complaint_orders_arr = selected_order_obj.service_details.complaint_orders;
          }

          complaint_orders_arr.push(selected_order_id);

          var updateValService = {
            complaint_orders: complaint_orders_arr
          }

          LeadManagerService.updateServiceInfo(updateValService,selected_service_id).then(function(resp){
              if(resp.data.message.ok == 1) {

                SweetAlert.swal("Updated!", "Order complaint raised.", "success");
                angular.element('#complaint_order_modal').closeModal();

              }
          });

        }
      });      

    };

    $scope.setJobStatus = function(val){
      console.log(val);
    };

    $scope.getVariantType = function(service) {

      console.log(service);

      var temp_service_variant_type = [];

      LeadManagerService.getVariant({name: $scope.services_options[service]}).then(function(response){
          //console.log(response.data.message);

          angular.forEach(response.data.message,function(value,key){
            //variant_type_ids.push(value.varianttype);
            variant_type_ids = {
              id: value.varianttype,
              name: $scope.variant_options[value.varianttype]
            };
            temp_service_variant_type.push(variant_type_ids);
            //variant_type_ids[value.varianttype] = variant_options[value.varianttype];
          });


          $scope.service_varianttype = temp_service_variant_type;

          //console.log($scope.service_varianttype);
          //angular.element('#variant_type_id').material_select();

      });

      //console.log($scope.services_options[service]);
    };

    $scope.setOrderId = function(order_id,type,order_obj,index) {
      selected_order_id = order_id;
      selected_order_index = index;
      if(type == 'supervisor') {

        $scope.supervisor_name = order_obj.supervisor_name.join(",");

      } else if(type == 'teamleader') {

        $scope.teamleader_name = order_obj.team_leader_name.join(",");

      } else if(type == 'janitor') {

        $scope.janitor_name = order_obj.janitor_name.join(",");
      }


      console.log(order_id);
    };

    $scope.updateTeamleader = function() {

      var updateVal = {
        team_leader_name: $scope.teamleader_name.split(",")
      };

      AMCRenewService.updatedOrder(updateVal,selected_order_id).then(function(response){

        if(response.data.message.ok == 1) {
          SweetAlert.swal("Updated!", "Teamleader updated.", "success");
          angular.element("#update_teamleader").closeModal();
          $scope.orders[selected_order_index].team_leader_name = $scope.teamleader_name.split(",");
        }

      });



    };

    $scope.updateJanitor = function() {

      var updateVal = {
        janitor_name: $scope.janitor_name.split(",")
      };

      AMCRenewService.updatedOrder(updateVal,selected_order_id).then(function(response){
        if(response.data.message.ok == 1) {
          SweetAlert.swal("Updated!", "Janitor updated.", "success");
          angular.element("#update_janitor").closeModal();
          $scope.orders[selected_order_index].janitor_name = $scope.janitor_name.split(",");
        }
      });



    };

    $scope.updateSupervisor = function() {

      var updateVal = {
        supervisor_name: $scope.supervisor_name.split(",")
      };

      AMCRenewService.updatedOrder(updateVal,selected_order_id).then(function(response){
        if(response.data.message.ok == 1) {
          SweetAlert.swal("Updated!", "Supervisor updated.", "success");
          angular.element("#update_supervisor").closeModal();
          $scope.orders[selected_order_index].supervisor_name = $scope.supervisor_name.split(",");
        }
      });




    };

    $scope.updatePaymentMode = function(order_id,payment_mode,index) {

      selected_order_id = order_id;
      selected_order_index = index;

      console.log(order_id);
      console.log(payment_mode);
      if(payment_mode == 'cheque') {

        angular.element('#order_payment_info').openModal();
        $scope.payment_remark = $scope.orders[selected_order_index].payment_remark;

      } else {

        var updateVal = {
          payment_mode: payment_mode
        };

        console.log(updateVal);
        console.log(selected_order_id);

        AMCRenewService.updatedOrder(updateVal,selected_order_id).then(function(response){
          if(response.data.message.ok == 1) {
            SweetAlert.swal("Updated!", "Payment mode updated.", "success");
            $scope.orders[selected_order_index].payment_mode = payment_mode;
            $scope.orders[selected_order_index].payment_remark = "";
            //angular.element("#update_supervisor").closeModal();
          }
        });

      }
    };

    $scope.updatePaymentModeDetails = function() {

      var updateVal = {
        payment_mode: 'cheque',
        payment_remark: $scope.payment_remark
      };

      AMCRenewService.updatedOrder(updateVal,selected_order_id).then(function(response){
        if(response.data.message.ok == 1) {
          SweetAlert.swal("Updated!", "Payment mode updated.", "success");
          $scope.orders[selected_order_index].payment_mode = 'cheque';
          $scope.orders[selected_order_index].payment_remark = $scope.payment_remark;
          angular.element("#order_payment_info").closeModal();
        }
      });

    };

    $scope.updatePaymentStatus = function(order,payment_status,index) {

      selected_order_id = order._id;
      selected_order_obj = order;
      selected_order_index = index;
      payment_status_val = payment_status;
      console.log(payment_status_val);
      $scope.acount_payment_status = order.acount_payment_status;
      angular.element('#order_account_remark').openModal();

      $scope.acount_payment_status = "";
      $scope.account_payment_mode = "";

      $scope.account_remarks = [];

      if(selected_order_obj.service_details.hasOwnProperty('accounts_remark') && selected_order_obj.service_details.accounts_remark.length > 0) {
        $scope.account_remarks = selected_order_obj.service_details.accounts_remark;
      }


      console.log(order);
      console.log($scope.acount_payment_status);
      console.log(payment_status);

    };

    $scope.updatePaymentStatusDetails = function() {

      if(payment_status_val == "" || $scope.acount_payment_status == "") {
        SweetAlert.swal("Required", "Payment status or Account payment remark cannot be empty.", "error");
      } else {

        var updateVal = {
          payment_status: payment_status_val,
          acount_payment_status: $scope.acount_payment_status
        };

        AMCRenewService.updatedOrder(updateVal,selected_order_id).then(function(response){

          console.log(updateVal);
          console.log(selected_order_id);
          console.log(response);

          if(response.data.message.ok == 1) {

            $scope.orders[selected_order_index].payment_status = payment_status_val;
            $scope.orders[selected_order_index].acount_payment_status = $scope.acount_payment_status;

            var accounts_remark_arr = [];

            var accounts_remark_obj = {
              payment_mode: $scope.account_payment_mode,
              remark: $scope.acount_payment_status
            };


            if(selected_order_obj.service_details.hasOwnProperty('accounts_remark') && selected_order_obj.service_details.accounts_remark.length > 0) {
              accounts_remark_arr = selected_order_obj.service_details.accounts_remark;
            }

            accounts_remark_arr.push(accounts_remark_obj);

            var accountsUpdateVal = {
              accounts_remark: accounts_remark_arr
            }

            LeadManagerService.updateServiceInfo(accountsUpdateVal,selected_order_obj.service_details._id).then(function(resp){
              SweetAlert.swal("Updated!", "Payment status updated.", "success");
              angular.element("#order_account_remark").closeModal();            
            });

          }
        });

      }

    }

    //$scope.vendor_allocated = 103;

    $scope.updateVendor = function(order_id,vendor_allocated,index) {

      console.log(vendor_allocated);

      if(vendor_allocated == 1) {

        var ova_id = "#other_vendor_allocated" + order_id;

        angular.element(ova_id).css({"visibility": "visible"});

      }

      if(vendor_allocated == 0) {

        var updateVal = {
          vendor_allocated: -1
        };

      } else {

        var updateVal = {
          vendor_allocated: parseInt(vendor_allocated)
        };

      }

      console.log(updateVal);

      AMCRenewService.updatedOrder(updateVal,order_id).then(function(response){
        if(response.data.message.ok == 1) {
          SweetAlert.swal("Updated!", "Vendor updated.", "success");
          $scope.orders[index].vendor_allocated = vendor_allocated;
        }
      });

    };

    $scope.loadAllAMC = function(id) {
      console.log(id);

      var amc_services_obj = [];
      var currentDate = (new Date()).toISOString();

      LeadManagerService.getAMCRenewServices(id).then(function(response){

        angular.forEach(response.data.message,function(value,key){

          if(parseISO(value.service_date[0]) < parseISO(currentDate)) {
            value.is_done = 1;
          } else {
            value.is_done = 0;
          }

          amc_services_obj.push(value);

        });

        console.log(amc_services_obj);
        $scope.amc_services = amc_services_obj;
        //console.log(response);
      });

      // AMCRenewService.latestAmcOrders({service_id: id}).then(function(response){
      //   console.log(response);
      // });

    };

    $scope.setOrderDetails = function(order){

      $scope.selected_order_obj = order;

      $scope.teamleaders = order.team_leader_name.join(" + ");
      $scope.supervisors = order.supervisor_name.join(" + ");
      $scope.janitors = order.janitor_name.join(" + ");
      if(order.service_details.service_date.length==1) {

      } else if(order.amc_service_details != undefined && order.amc_service_details.service_date.length>0 && order.order_no==1){

      } else if(order.service_details.service_date.length>1&&order.order_no==1) {

      } else {
        $scope.selected_order_obj.service_details.client_payment_expected = 0;
      }

      //console.log($scope.selected_order_obj);


    };

    $scope.selectCannedSMS = function(val) {

      console.log(val);

      if(val == 1) {
        $scope.sms_message = "Mr. Homecare tried reaching you for your service request but couldn't get through. Kindly call us on 9022070070 or email us your query on customercare@mrhomecare.in";
      } else if(val == 2) {
        $scope.sms_message = "We tried reaching you but couldn't get through regarding your service request. Please feel free to call us on 9022070070.";
      } else if(val == 3) {
        $scope.sms_message = "Hi, Mr. Homecare tried reaching you for your cleaning service schedule for tomorrow but could not get through. Please call us on 9022-070-070. If the service is cancelled on the same day, 50% of the service charge will be applicable as cancellation charges.";
      }

    }

    $scope.sendCannedSMS = function() {

      SMSService.sendSMS($scope.mobile_no,$scope.sms_message).then(function(response){
        console.log(response);
        if(response.status == 200 && response.statusText == "OK") {
          SweetAlert.swal("Sent!", "SMS sent successfully.", "success");
          angular.element('#send_sms_modal').closeModal();
        }
        
      });

    };

    $scope.setOrder = function(order) {
      resetSMSForm($scope);
      selected_order_obj = order;
      selected_service_id = order.service_details._id;
      $scope.ops_remark = selected_order_obj.service_details.ops_remark;
      $scope.mobile_no = order.client_details.primary_contact_no;
      console.log(selected_service_id);
    };

    $scope.updateOpsRemark = function() {

      var ops_remark_arr = [];

      if(selected_order_obj.service_details.hasOwnProperty('ops_remark') && selected_order_obj.service_details.ops_remark.length > 0) {
        ops_remark_arr = selected_order_obj.service_details.ops_remark;
      }

      var ops_remark_obj = {
        remark: $scope.operation_remarks,
        added_by: $scope.currentUser.name,
        added_on: (new Date()).toISOString()
      };

      ops_remark_arr.push(ops_remark_obj);

      var updateValService = {
        ops_remark: ops_remark_arr
      };


        LeadManagerService.updateServiceInfo(updateValService,selected_service_id).then(function(resp){
            if(resp.data.message.ok == 1) {
              SweetAlert.swal("Job Started!", "Ops remark added successfully.", "success");
              $scope.ops_remark = ops_remark_arr;
            }
        });

    };

    $scope.exportToPDF = function() {

      html2canvas(document.getElementById('printThisElement'), {
            onrendered: function (canvas) {
                var data = canvas.toDataURL();
                var docDefinition = {
                    content: [{
                        image: data,
                        width: 800,
                    }]
                };
                pdfMake.createPdf(docDefinition).download("Work_Order.pdf");
            }
        });


    };

    $scope.updateOtherVendor = function(order_id) {
        
        var val = angular.element('#other_vendor_allocated'+order_id).val();
        console.log(val);

        var updateVal = {
          other_vendor_allocated: val
        };

        //console.log(updateVal);

        AMCRenewService.updatedOrder(updateVal,order_id).then(function(response){
          // if(response.data.message.ok == 1) {
          //   //$scope.orders[index].other_vendor_allocated = vendor_allocated;
          // }
        });

    }

    $scope.printWorkOrder = function() {

      console.log("printing");

      angular.element('#printThisElement').print();

      // var printContents = document.getElementById('print_area').innerHTML;
      // var popupWin = window.open('', '_blank', 'width=800,height=800,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,top=50');
      // popupWin.window.focus();
      // popupWin.document.open();
      // popupWin.document.write('<!DOCTYPE html><html><head><title>TITLE OF THE PRINT OUT</title>'
      //                         +'<link rel="stylesheet" type="text/css" href="app/directory/file.css" />'
      //                         +'</head><body onload="window.print(); window.close();"><div>'
      //                         + printContents + '</div></html>');
      // popupWin.document.close();

    };

    if($route.current != undefined) {

        filterSearchArr.is_amc = 1;
        loadMore();

    }

		$scope.nextPage = function() {


        filterSearchArr.is_amc = 1;
        loadMore();

    };


    function loadMore() {

      offset = limit * page;

      var paginationSettings = {
        limit: limit,
        offset: offset
      };
      var orderBy = {
        created_on: -1
      };
      //console.log(paginationSettings);
      filterSearchArr.is_amc = 1;


      var data = {
        searchVal: filterSearchArr,
        paginationSettings: paginationSettings,
        orderBy: orderBy
      };

      console.log(data);

      debugger;

      AMCRenewService.filterAllOrders(data).then(function(response){
          console.log(response.data.message);
          debugger;
          // $scope.orders = [];
          // $scope.orders = response.data.message;
          if(response.data.message.length > 0) {

            $scope.loading = false;

            var orderData = response.data.message;

            if($scope.from_date != undefined && $scope.to_date != undefined) {

              var start_date = moment($scope.from_date).unix();
              var end_date = moment($scope.to_date).unix();

              for (var i = 0; i < orderData.length; i++) {


                  var s_date = moment(orderData[i]['service_details']['contract_end_date']).unix();

                  //console.log(sdate + " > =" + start_date + " && " + s_date + " <= " + end_date);

                  if(s_date >= start_date && s_date <= end_date) {
                    $scope.orders.push(orderData[i]);
                  }

              }

            } else {

              for (var i = 0; i < orderData.length; i++) {

                var s_date = moment(orderData[i]['service_details']['contract_end_date']);
                var c_date = moment();

                var days = s_date.diff(c_date,'days');

                //console.log("Date: " + c_date.format('YYYY-MM-DD') + " | s_date: " + s_date.format('YYYY-MM-DD') + " | Difference: " + days);
                
                if(days >= 13 && days <= 16) {

                  $scope.orders.push(orderData[i]);

                }


              }

            }


            // if(($scope.from_date == $scope.to_date) && $scope.from_date != undefined) {

            //   for (var i = 0; i < orderData.length; i++) {

            //     if(orderData[i]['service_details']['service_date'].length > 1) {

            //       var service_date_arr = orderData[i]['service_details']['service_date'];
            //       var service_date_arr_length = service_date_arr.length;

            //       var order_no = getOrderNo($scope.from_date,service_date_arr,service_date_arr_length);

            //       if(orderData[i]['order_no'] == order_no) {

            //         $scope.orders.push(orderData[i]);

            //       }


            //     } else {

            //       $scope.orders.push(orderData[i]);

            //     }

            //   }



            // } else {

            //   for (var i = 0; i < orderData.length; i++) {
            //     $scope.orders.push(orderData[i]);
            //   }

            // }





            //$scope.hasMoreData = false;

          } else {
            $scope.hasMoreData = false
          }
      });

      page++;


    }

    $scope.filterOrders = function(val) {
  			console.log("Hi i am called by filter");
  			if (val==1) {
  				$scope.orders =[];
  				page=1;
  				offset =0;
  				// fromfilter =0;
  			}

        $scope.hasMoreData = true;
        $scope.loading = true;

      var emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var mobilePattern = /^\d+$/;

      var name="";
      var primary_contact_no = "";
      var primary_email_id = "";

      var keyword = {};
      var temp_filterSearchArr = {};



      if($scope.keyword != undefined && $scope.keyword != null && $scope.keyword != "") {

        if(emailPattern.test($scope.keyword)) {
          temp_filterSearchArr.primary_email_id = $scope.keyword;
        } else if(mobilePattern.test($scope.keyword)) {
          temp_filterSearchArr.primary_contact_no = $scope.keyword;
        } else {
          temp_filterSearchArr.name = $scope.keyword;
        }

        if(temp_filterSearchArr.name == "") {
          delete temp_filterSearchArr.name;
        }

        if(temp_filterSearchArr.primary_contact_no == "") {
          delete temp_filterSearchArr.primary_contact_no;
        }

      }

      // else {
      //   $scope.keyValueObj = {};
      //   $scope.keyValueObj.primary_contact_no = "";
      //   $scope.keyValueObj.primary_email_id = "";
      //   $scope.keyValueObj.firstname = $scope.searchVal;
      // }

      if($scope.service_name_filter != undefined && $scope.service_name_filter != null && $scope.service_name_filter != "")
      temp_filterSearchArr.service_id =  $scope.service_name_filter;

      if($scope.variant_type_filter != undefined && $scope.variant_type_filter != null && $scope.variant_type_filter != "")
      temp_filterSearchArr.variant_type_id =  $scope.variant_type_filter;

      if($scope.lead_source_filter != undefined && $scope.lead_source_filter != null && $scope.lead_source_filter != "")
      temp_filterSearchArr.leadsource =  $scope.lead_source_filter;

      if($scope.lead_owner_filter != undefined && $scope.lead_owner_filter != null && $scope.lead_owner_filter != "")
      temp_filterSearchArr.leadowner =  $scope.lead_owner_filter;

      if($scope.vendor_filter != undefined && $scope.vendor_filter != null && $scope.vendor_filter != "")
      temp_filterSearchArr.vendor_allocated =  $scope.vendor_filter;

      if($scope.payment_status_filter != undefined && $scope.payment_status_filter != null && $scope.payment_status_filter != "")
      temp_filterSearchArr.payment_status =  $scope.payment_status_filter;

      if($scope.payment_mode_filter != undefined && $scope.payment_mode_filter != null && $scope.payment_mode_filter != "")
      temp_filterSearchArr.payment_mode =  $scope.payment_mode_filter;

      if($scope.city_filter != undefined && $scope.city_filter != null && $scope.city_filter != "")
      temp_filterSearchArr.city =  parseInt($scope.city_filter);

      if($scope.from_date != undefined && $scope.from_date != null && $scope.from_date != "") {
        temp_filterSearchArr.from_inquiry_date =  (new Date($scope.from_date)).toISOString();
        temp_filterSearchArr.to_inquiry_date =  (new Date($scope.from_date)).toISOString();
      }

      if($scope.to_date != undefined && $scope.to_date != null && $scope.to_date != "")
      temp_filterSearchArr.to_inquiry_date =  (new Date($scope.to_date)).toISOString();


      if($scope.type_filter == "address") {
        if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
        temp_filterSearchArr.address = $scope.type_keyword;
      }

      if($scope.type_filter == "invoice") {
        if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
        temp_filterSearchArr.taxed_cost = $scope.type_keyword;
      }

      if($scope.type_filter == "billing_name") {
        if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
        temp_filterSearchArr.billing_name = $scope.type_keyword;
      }

      if($scope.type_filter == "billing_address") {
        if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
        temp_filterSearchArr.billing_address = $scope.type_keyword;
      }

      if($scope.type_filter == "supervisor") {
        if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
        temp_filterSearchArr.supervisor = $scope.type_keyword;
      }

      if($scope.type_filter == "teamleader") {
        if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
        temp_filterSearchArr.teamleader = $scope.type_keyword;
      }

      if($scope.type_filter == "janitor") {
        if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
        temp_filterSearchArr.janitor = $scope.type_keyword;
      }

      if($scope.type_filter == "leadid") {
        if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
        temp_filterSearchArr.leadid = $scope.type_keyword;
      }

      if($scope.type_filter == "orderid") {
        if($scope.type_keyword != undefined && $scope.type_keyword != null && $scope.type_keyword != "")
        temp_filterSearchArr.orderid = $scope.type_keyword;
      }


      if($scope.currentUser.name.search(/envocare/i) != -1 || $scope.currentUser.email.search(/envocare/i) != -1) {
        temp_filterSearchArr.vendor_allocated = 100;
      }


        temp_filterSearchArr.is_amc = 1;


      filterSearchArr =  temp_filterSearchArr;
      console.log(filterSearchArr);

      var paginationSettings = {
          limit: limit,
          offset: offset
        }

      var orderBy = {
        created_on: -1
      };

      var data = {
        'searchVal':filterSearchArr,
        'paginationSettings': paginationSettings,
        'orderBy': orderBy
      }

      AMCRenewService.filterAllOrders(data).then(function(response){
          $scope.orders = [];
          //$scope.orders = response.data.message;

          var orderData = response.data.message;

          if(orderData.length > 0) {

            debugger;

            if(($scope.from_date != undefined && $scope.from_date != null && $scope.from_date != "") && ($scope.to_date != undefined && $scope.to_date != null && $scope.to_date != "")) {

              debugger;
              var start_date = moment($scope.from_date).unix();
              var end_date = moment($scope.to_date).unix();


              for (var i = 0; i < orderData.length; i++) {

                    var s_date = moment(orderData[i]['service_details']['contract_end_date']).unix();

                    //console.log(sdate + " > =" + start_date + " && " + s_date + " <= " + end_date);

                    if(s_date >= start_date && s_date <= end_date) {

                      $scope.orders.push(orderData[i]);

                    }

              }



            } else {


              for (var i = 0; i < orderData.length; i++) {

                var s_date = moment(orderData[i]['service_details']['contract_end_date']);
                var c_date = moment();

                var days = s_date.diff(c_date,'days');

                if(days >= 13 && days <= 16) {
                  $scope.orders.push(orderData[i]);

                }


              }

            }

          }


          console.log($scope.orders);
          //debugger;
          //$scope.hasMoreData = false;
          $scope.loading = false;
          //debugger;

      });

    };

  if($route.current != undefined) {
  	//console.log($route.current.action);

  	if($route.current.action == 'all') {

        angular.element('.button-collapse').sideNav('hide');
			// var paginationSettings = {
   //      limit: limit,
   //      offset: offset
   //    };
   //    //console.log(paginationSettings);
   //    var data = {
   //      searchVal: {},
   //      paginationSettings: paginationSettings
   //    };
  	// 	AMCRenewService.getAllOrders(data).then(function(response){

  	// 		console.log(response.data.message);
  	// 		$scope.orders = response.data.message;

  	// 		// angular.forEach(response.data.message,function(value,key){

  	// 		// 	order_details.client_details = value.client_details;
  	// 		// 	order_details.billing_address = value.billing_address;
  	// 		// 	order_details.billing_name = value.billing_name;
  	// 		// 	order_details.invoice_mode = value.invoice_mode;
  	// 		// 	order_details.invoice_type = value.invoice_type;
  	// 		// 	order_details.reminder = value.reminder;


  	// 		// 	angular.forEach(value.service_obj,function(valObj,keyObj){

			// 		// order_details.service_obj =  valObj;

			// 		// $scope.orders.push(order_details);

  	// 		// 	});


  	// 		//});
  	// 		//console.log($scope.orders);
   //        	//$scope.orders = response.data.message;
   //      });

  	}

  }

  // $scope.rateQuality = function(rating) {
  //   console.log(rating);
  // };

  $scope.setServiceQuality = function(val) {

      if(val == true) {
        rateObj.serviceQuality = 1;
      } else {
        rateObj.serviceQuality = 0;
      }

  };

  $scope.setPunctuality = function(val) {

      if(val == true) {
        rateObj.punctuality = 1;
      } else {
        rateObj.punctuality = 0;
      }

  };


  $scope.setGrooming = function(val) {

      if(val == true) {
        rateObj.grooming = 1;
      } else {
        rateObj.grooming = 0;
      }

  };


  $scope.setDA = function(val) {

      if(val == true) {
        rateObj.detailAttention = 1;
      } else {
        rateObj.detailAttention = 0;
      }

  };


  $scope.setPK = function(val) {

    if(val == true) {
      rateObj.productKnowledge = 1;
    } else {
      rateObj.productKnowledge = 0;
    }

  };


  $scope.setCC = function(val) {

    if(val == true) {
      rateObj.commsCoords = 1;
    } else {
      rateObj.commsCoords = 0;
    }

  };

  $scope.getRating = function() {

    console.log(rateObj);

  };

});

function parseISO(s) {
  s = s.split(/\D/);
  return new Date(Date.UTC(s[0],--s[1],s[2],s[3],s[4],s[5],s[6]));
}

function resetSMSForm(scope) {
  scope.canned_sms_template = "";
  scope.sms_message = "";
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