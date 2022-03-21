angular.module('bitly-config', ['bitly.generator']).config(['bitlyProvider', function(bitlyProvider) {
	bitlyProvider.cfgBitly({
        login: 'mhctanveer',
        api: 'R_ecc48815861444e49fd89e8b1716f29e'
    });
}]);