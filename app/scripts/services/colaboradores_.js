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
    	this.Add_Col_Usuario = function() {
	        return $resource(urlService.server().appnext()+'Add_Col_Usuario', {} , {
	            add: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	this.Update_Col_Usuario = function(){
    		return $resource(urlService.server().appnext()+'Update_Col_Usuario', {} , {
	            actualizar: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	}
    	this.Get_Col_Usuario = function() {
	        return $resource(urlService.server().appnext()+'Get_Col_Usuario', {} , {
	            get: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	this.Get_Col_Usuario_Update = function() {
	        return $resource(urlService.server().appnext()+'Get_Col_Usuario_Update', {} , {
	            get: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	this.Existencia_Usuario_Cedula = function(){
    		return $resource(urlService.server().appnext()+'Existencia_Usuario_Cedula', {} , {
	            consulta: {
	    			method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	this.Existencia_Usuario_Correo = function(){
    		return $resource(urlService.server().appnext()+'Existencia_Usuario_Correo', {} , {
	            consulta: {
	    			method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	this.Existencia_Usuario_Nick = function(){
    		return $resource(urlService.server().appnext()+'Existencia_Usuario_Nick', {} , {
	            consulta: {
	    			method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	this.Delete_Col_Usuario = function() {
	        return $resource(urlService.server().appnext()+'Delete_Col_Usuario', {}
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

	// ---------------------------------------------------------------INICIO LOCALIZACION--------------------------------------------------------------//
		this.Get_Ciudades = function() {
	        return $resource(urlService.server().appnext()+'Get_Ciudades', {} , {
	            get: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
	// ---------------------------------------------------------------FIN LOCALIZACION-----------------------------------------------------------------//
	// ---------------------------------------------------------------INICIO OPERADORA TELEFONICA------------------------------------------------------//
		this.Get_Operadoras = function() {
	        return $resource(urlService.server().appnext()+'Get_Operadoras', {} , {
	            get: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
	// ---------------------------------------------------------------FIN OPERADORA TELEFONICA---------------------------------------------------------//

	// ---------------------------------------------------------------PRIVILEGIOS USUARIOS------------------------------------------------------//
		this.Get_Combinacion_Privilegios = function() {
	        return $resource(urlService.server().appnext()+'Get_Combinacion_Privilegios', {} , {
	            get: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
	// ---------------------------------------------------------------FIN PRIVILEGIOS USUARIOS---------------------------------------------------------//

	// ---------------------------------------------------------------VISTAS Y PRIVILEGIOS POR TIPO DE USUARIO ----------------------------------------//
		this.Get_Vistas_Loged_User = function() {
	        return $resource(urlService.server().appnext()+'Get_Vistas_Loged_User', {} , {
	            get: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	this.Get_Vistas_Tip_User_Update = function() {
	        return $resource(urlService.server().appnext()+'Get_Vistas_Tip_User_Update', {} , {
	            get: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};
    	
	// ---------------------------------------------------------------FIN VISTAS Y PRIVILEGIOS POR TIPO DE USUARIO -------------------------------------------//

	//---------------------------------------------------------------- INGRESO COLABORADORES ----------------------------------------------------------------//
	
	this.Ingresar_Colaborador = function() {
	        return $resource(urlService.server().appnext()+'Acceso_Colaborador', {} , {
	            acceso: {
	                method: 'POST', isArray: false,
	                params: {
	                    token: $localStorage.token
	                }
	            }
	        });
    	};

    	this.Get_Data_By_Ruc = function() {
	        return $resource(urlService.server().appnext()+'Get_Data_By_Ruc', {} , {
	            get: {
	                method: 'POST', isArray: false,
	                params: {
	                   // token: $localStorage.token
	                }
	            }
	        });
    	};

  });
