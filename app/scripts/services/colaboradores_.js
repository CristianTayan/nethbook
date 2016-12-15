'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.colaboradores
 * @description
 * # colaboradores
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('colaboradores_Service', function ($localStorage, $resource, urlService) {
  	// ---------------------------------------------------------------INICIO TIPO CATEGORIA--------------------------------------------------------------//
	    	this.Add_Usuario = function() {
		        return $resource(urlService.server().appnext()+'Add_Usuario', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Update_Usuario = function(){
	    		return $resource(urlService.server().appnext()+'Update_Usuario', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    	this.Get_Usuario = function() {
		        return $resource(urlService.server().appnext()+'Get_Usuarios', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Existencia_Usuario = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Usuario', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Usuario = function() {
		        return $resource(urlService.server().appnext()+'Delete_Usuario', {}
		        , {
		            delete: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	// ---------------------------------------------------------------FIN TIPO CATEGORIA-----------------------------------------------------------------//
  });
