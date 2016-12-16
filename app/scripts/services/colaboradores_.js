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
	    	this.Add_Colaborador = function() {
		        return $resource(urlService.server().appnext()+'Add_Colaborador', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Update_Colaborador = function(){
	    		return $resource(urlService.server().appnext()+'Update_Colaborador', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    	this.Get_Colaborador = function() {
		        return $resource(urlService.server().appnext()+'Get_Colaboradores', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Existencia_Colaborador = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Colaborador', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Colaborador = function() {
		        return $resource(urlService.server().appnext()+'Delete_Colaborador', {}
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
