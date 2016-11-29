'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.inventario
 * @description
 * # inventario
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  	.service('inventario_Service', function ($localStorage, $resource, urlService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    	this.Add_Tipo_Categoria = function() {
	        return $resource(urlService.server().appnext()+'Add_Tipo_Categoria', {}
	        , {
	            add: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
  	});
