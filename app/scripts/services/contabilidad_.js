'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.contabilidad
 * @description
 * # contabilidad
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('Contabilidad_Service', function ($localStorage, $resource, urlService) {
    
    	// ---------------------------------------------------------------IMPUESTOS-----------------------------------------------------------------//
	    this.Get_Impuestos = function() {
		        return $resource(urlService.server().appnext()+'Get_Impuestos', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};

  });
