'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.parametrizacion
 * @description
 * # parametrizacion
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  	.service('parametrizacion', function ($resource, urlService, $localStorage) {
  		this.Add_Impuesto = function() {
	        return $resource(urlService.server().appnext()+'Add_Impuesto', {} , {
	            add: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
	    this.Get_Ambito_Impuestos=function() {
        return $resource(urlService.server().appnext()+'Get_Ambito_Impuestos', {}, {
          get: {
            method: 'POST', isArray: false,
            params: {
                token: $localStorage.token,
            }
          }
        });
	    };
	    this.Existencia_Impuesto = function(){
    		return $resource(urlService.server().appnext()+'Existencia_Impuesto', {} , {
	            consulta: {
	    			method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};

    	this.Get_Tipo_Impuestos = function(){
    		return $resource(urlService.server().appnext()+'Get_Tipo_Impuestos', {} , {
	            consulta: {
	    			method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};

    	
  	});
