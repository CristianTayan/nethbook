'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.configuracionService
 * @description
 * # configuracionService
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  	.service('configuracionService', function () {
    	// AngularJS will instantiate a singleton by calling "new" on this function
    	this.ico_sidemenu_2 = function(item) {
    		var ruta = item.name;
    		var ruta = ruta.split('.')
	        if (ruta[1]=='app') {
	            return true;
	        }else{
	            return false;
	        }
	    };
  	});
