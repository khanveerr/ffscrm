angular.module('Invoice', []).controller('InvoiceController', function($scope,$rootScope,$routeParams,$route,$window,$location,SweetAlert,$filter) {


	console.log("In invoice");
	var invoice_obj = JSON.parse($window.localStorage.getItem('invoice_obj'));
	console.log(invoice_obj);
	$scope.cdate = $filter('date')(new Date(), 'medium');;
	console.log($scope.cdate);
	$scope.invoiceobj = invoice_obj;

	var service_tax_breakup = [];


    var cnt = 1;
    var pre_taxed_cost_total = 0;
    var service_tax = 0;
    var sb_tax = 0;
    var kk_tax = 0;
    var taxed_cost_total = 0;
    if (invoice_obj.hasOwnProperty('servicedata') && invoice_obj.servicedata.servicenames.length>0) {

		angular.forEach(invoice_obj.servicedata.servicenames,function(value,key){

			service_tax_breakup.push({'cnt': cnt, 'value': value, 'quantity': '1','pre_taxed_cost': invoice_obj.servicedata.price[cnt-1].pre_taxed_cost, 'pre_taxed_cost_1': invoice_obj.servicedata.price[cnt-1].pre_taxed_cost });

			pre_taxed_cost_total += invoice_obj.servicedata.price[cnt-1].pre_taxed_cost;
			service_tax += invoice_obj.servicedata.price[cnt-1].service_tax;
			sb_tax += invoice_obj.servicedata.price[cnt-1].cess_tax;
			kk_tax += invoice_obj.servicedata.price[cnt-1].kk_tax;
			taxed_cost_total += invoice_obj.servicedata.price[cnt-1].client_payment_expected;

			cnt++;

	    });

    };


    if (invoice_obj.hasOwnProperty('amcdata')) {
        var amccnt =0;
      	angular.forEach(invoice_obj.amcdata.servicenames,function(value,key){

			service_tax_breakup.push({'cnt': cnt, 'value': value, 'quantity': '1','pre_taxed_cost': invoice_obj.amcdata.price[amccnt].pre_taxed_cost, 'pre_taxed_cost_1': invoice_obj.amcdata.price[amccnt].pre_taxed_cost });

			pre_taxed_cost_total += invoice_obj.amcdata.price[amccnt].pre_taxed_cost;
			service_tax += invoice_obj.amcdata.price[amccnt].service_tax;
			sb_tax += invoice_obj.amcdata.price[amccnt].cess_tax;
			kk_tax += invoice_obj.amcdata.price[amccnt].kk_tax;
			taxed_cost_total += invoice_obj.amcdata.price[amccnt].client_payment_expected;

			cnt++;
			amccnt++;

	    });
    };


    $scope.service_tax_breakup = service_tax_breakup;
    $scope.pre_taxed_cost_total = Math.floor(pre_taxed_cost_total);
    $scope.service_tax = Math.floor(service_tax);
    $scope.sb_tax = Math.floor(sb_tax);
    $scope.kk_tax = Math.floor(kk_tax);
    $scope.taxed_cost_total = taxed_cost_total;

});