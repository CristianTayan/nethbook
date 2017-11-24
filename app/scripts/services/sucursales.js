'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.colaboradores
 * @description
 * # colaboradores
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('sucursales_Service', function ($localStorage, $resource, urlService) {
  	this.Update_Giro_Actividad = function(){
    		return $resource(urlService.server().appnext()+'Update_Giro_Actividad', {} , {
	            actualizar: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	}
  }