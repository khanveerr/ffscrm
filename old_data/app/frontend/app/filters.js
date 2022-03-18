angular.module('FilterHelper', []).filter('joinBy', function () {
    return function (input,delimiter) {
        return (input || []).join(delimiter || ',');
    };
}).filter('isCloseService',function(){
	return function(input) {

		for (var i = 0; i < input.length; i++) {
			if(input[i].is_order == 1) {
				return 1;
			}
		};

		return 0;

	}
}).filter('isNotCloseService',function(){
	return function(input) {

		for (var i = 0; i < input.length; i++) {
			if(input[i].is_order == 0) {
				return 1;
			}
		};

		return 0;

	}
}).filter('isInvoiceSent',function(){
	return function(input) {

		for (var i = 0; i < input.length; i++) {
			if(input[i].invoice_sent == 1) {
				return 1;
			}
		};

		return 0;

	}
});