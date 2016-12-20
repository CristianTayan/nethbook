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
  	// ---------------------------------------------------------------INICIO TIPO USUARIO--------------------------------------------------------------//
    	this.Add_Tipo_Usuario = function() {
	        return $resource(urlService.server().appnext()+'Add_Tipo_Usuario', {} , {
	            add: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	this.Update_Tipo_Usuario = function(){
    		return $resource(urlService.server().appnext()+'Update_Tipo_Usuario', {} , {
	            actualizar: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	}
    	this.Get_Tipo_Usuario = function() {
	        return $resource(urlService.server().appnext()+'Get_Tipo_Usuarios', {} , {
	            get: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	this.Get_Tipo_Documento = function() {
	        return $resource(urlService.server().appnext()+'Get_Tipo_Documentos', {} , {
	            get: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	this.Existencia_Tipo_Usuario = function(){
    		return $resource(urlService.server().appnext()+'Existencia_Tipo_Usuario', {} , {
	            consulta: {
	    			method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	this.Delete_Tipo_Usuario = function() {
	        return $resource(urlService.server().appnext()+'Delete_Tipo_Usuario', {}
	        , {
	            delete: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
	// ---------------------------------------------------------------FIN TIPO USUARIO-----------------------------------------------------------------//

  	// ---------------------------------------------------------------INICIO USUARIO--------------------------------------------------------------//
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
	// ---------------------------------------------------------------FIN USUARIO-----------------------------------------------------------------//
	// ---------------------------------------------------------------INICIO VISTAS--------------------------------------------------------------//
	this.Get_Vistas = function() {
	        return $resource(urlService.server().appnext()+'Get_Vistas', {} , {
	            get: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
	// ---------------------------------------------------------------FIN VISTAS-----------------------------------------------------------------//

  });
