'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.consumirService
 * @description
 * # consumirService
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('consumirService', function ($http, urlService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.ip_public = function() {

        var promise = $http({method: 'GET', url: 'http://ipinfo.io', headers:{ 'Content-type': 'application/json' }}).then(function (response) {
		        // The return value gets picked up by the then in the controller.
		        return response.data;
		    });
		    // Return the promise to the controller
		    return promise;
	    };

  });
