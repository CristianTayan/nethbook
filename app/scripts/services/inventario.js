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
    	
	    // ---------------------------------------------------------------INICIO TIPO CATEGORIA---------------------------------------------------------------//
	    	this.Add_Tipo_Categoria = function() {
		        return $resource(urlService.server().appnext()+'Add_Tipo_Categoria', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Update_Tipo_Categorias = function(){
	    		return $resource(urlService.server().appnext()+'Update_Tipo_Categorias', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    	this.Get_Tipo_Categoria = function() {
		        return $resource(urlService.server().appnext()+'Get_Tipo_Categorias', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Get_Tipo_Categoria = function() {
		        return $resource(urlService.server().appnext()+'Get_Tipo_Categorias', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Existencia_Tipo_Categoria = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Tipo_Categoria', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Tipo_Categoria = function() {
		        return $resource(urlService.server().appnext()+'Delete_Tipo_Categorias', {}
		        , {
		            delete: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // -----------------------------------------------------------------FIN TIPO CATEGORIA-----------------------------------------------------------------//

	    // ------------------------------------------------------------------INICIO CATEGORIA------------------------------------------------------------------//
	    	this.Add_Categoria = function() {
		        return $resource(urlService.server().appnext()+'Add_Categoria', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Categoria = function() {
		        return $resource(urlService.server().appnext()+'Delete_Categoria', {} , {
		            delete: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
			this.Get_Categoria = function() {
		        return $resource(urlService.server().appnext()+'Get_Categorias', {}
		        , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ------------------------------------------------------------------FIN CATEGORIA------------------------------------------------------------------//


	    // ---------------------------------------------------------------INICIO TIPO GARANTIA---------------------------------------------------------------//
	    	this.Add_Tipo_Garantia = function() {
		        return $resource(urlService.server().appnext()+'Add_Tipo_Garantia', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ---------------------------------------------------------------FIN TIPO GARANTIA---------------------------------------------------------------//


	    // ---------------------------------------------------------------INICIO TIPO CONSUMO---------------------------------------------------------------//
	    	this.Add_Tipo_Consumo = function() {
		        return $resource(urlService.server().appnext()+'Add_Tipo_Consumo', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ---------------------------------------------------------------FIN TIPO CONSUMO---------------------------------------------------------------//

	    // ---------------------------------------------------------------INICIO TIPO CONSUMO---------------------------------------------------------------//
	    	this.Add_Tipo_Productos = function() {
		        return $resource(urlService.server().appnext()+'Add_Tipo_Producto', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ---------------------------------------------------------------FIN TIPO CONSUMO---------------------------------------------------------------//



  	});
