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
    	
	    // ---------------------------------------------------------------INICIO TIPO CATEGORIA--------------------------------------------------------------//
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
	    // ---------------------------------------------------------------FIN TIPO CATEGORIA-----------------------------------------------------------------//

	    // ---------------------------------------------------------------INICIO CATEGORIA-------------------------------------------------------------------//
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
	    	this.Existencia_Categoria = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Categoria', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Update_Categoria = function(){
	    		return $resource(urlService.server().appnext()+'Update_Categoria', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    // ---------------------------------------------------------------FIN CATEGORIA-----------------------------------------------------------------//

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
	    	this.Update_Tipo_Garantia = function(){
	    		return $resource(urlService.server().appnext()+'Update_Tipo_Garantia', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    	this.Get_Tipo_Garantia = function() {
		        return $resource(urlService.server().appnext()+'Get_Tipo_Garantias', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Existencia_Tipo_Garantia = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Tipo_Garantia', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Tipo_Garantia = function() {
		        return $resource(urlService.server().appnext()+'Delete_Tipo_Garantia', {}
		        , {
		            delete: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ---------------------------------------------------------------FIN TIPO GARANTIA------------------------------------------------------------------//

	    // ---------------------------------------------------------------INICIO TIPO PRODUCTOS--------------------------------------------------------------//
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
	    	this.Update_Tipo_Productos = function(){
	    		return $resource(urlService.server().appnext()+'Update_Tipo_Producto', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    	this.Get_Tipo_Productos = function() {
		        return $resource(urlService.server().appnext()+'Get_Tipo_Productos', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Existencia_Tipo_Productos = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Tipo_Producto', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Tipo_Productos = function() {
		        return $resource(urlService.server().appnext()+'Delete_Tipo_Producto', {}
		        , {
		            delete: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ---------------------------------------------------------------FIN TIPO PRODUCTOS-----------------------------------------------------------------//

	    // ---------------------------------------------------------------INICIO TIPO CONSUMO----------------------------------------------------------------//
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
	    	this.Update_Tipo_Consumo = function(){
	    		return $resource(urlService.server().appnext()+'Update_Tipo_Consumo', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    	this.Get_Tipo_Consumo = function() {
		        return $resource(urlService.server().appnext()+'Get_Tipo_Consumos', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Existencia_Tipo_Consumo = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Tipo_Consumo', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Tipo_Consumo = function() {
		        return $resource(urlService.server().appnext()+'Delete_Tipo_Consumo', {}
		        , {
		            delete: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ---------------------------------------------------------------FIN TIPO CONSUMO-------------------------------------------------------------------//

	    // ---------------------------------------------------------------INICIO TIPO CATALOGO---------------------------------------------------------------//
	    	this.Add_Tipo_Catalogo = function() {
		        return $resource(urlService.server().appnext()+'Add_Tipo_Catalogo', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Update_Tipo_Catalogo = function(){
	    		return $resource(urlService.server().appnext()+'Update_Tipo_Catalogo', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    	this.Get_Tipo_Catalogo = function() {
		        return $resource(urlService.server().appnext()+'Get_Tipo_Catalogos', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Existencia_Tipo_Catalogo = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Tipo_Catalogo', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Tipo_Catalogo = function() {
		        return $resource(urlService.server().appnext()+'Delete_Tipo_Catalogo', {}
		        , {
		            delete: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ---------------------------------------------------------------FIN TIPO CATALOGO------------------------------------------------------------------//

	    // ---------------------------------------------------------------INICIO TIPO MARCAS----------------------------------------------------------------//
	    	this.Add_Marca = function() {
		        return $resource(urlService.server().appnext()+'Add_Marca', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Update_Marca = function(){
	    		return $resource(urlService.server().appnext()+'Update_Marca', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    	this.Get_Marca = function() {
		        return $resource(urlService.server().appnext()+'Get_Marcas', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Existencia_Marca = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Marca', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Marca = function() {
		        return $resource(urlService.server().appnext()+'Delete_Marca', {}
		        , {
		            delete: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ---------------------------------------------------------------FIN TIPO MARCAS-------------------------------------------------------------------//

	    // ---------------------------------------------------------------INICIO TIPO MODELOS----------------------------------------------------------------//
	    	this.Add_Modelo = function() {
		        return $resource(urlService.server().appnext()+'Add_Modelo', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Update_Modelo = function(){
	    		return $resource(urlService.server().appnext()+'Update_Modelo', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    	this.Get_Modelo = function() {
		        return $resource(urlService.server().appnext()+'Get_Modelos', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Existencia_Modelo = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Modelo', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Modelo = function() {
		        return $resource(urlService.server().appnext()+'Delete_Modelo', {}
		        , {
		            delete: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ---------------------------------------------------------------FIN TIPO MODELOS-------------------------------------------------------------------//
	    // ---------------------------------------------------------------INICIO TIPO UBICACION--------------------------------------------------------------//
	    	this.Add_Ubicacion = function() {
		        return $resource(urlService.server().appnext()+'Add_Ubicacion', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Update_Ubicacion = function(){
	    		return $resource(urlService.server().appnext()+'Update_Ubicacion', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    	this.Get_Ubicacion = function() {
		        return $resource(urlService.server().appnext()+'Get_Ubicaciones', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Existencia_Ubicacion = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Ubicacion', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Ubicacion = function() {
		        return $resource(urlService.server().appnext()+'Delete_Ubicacion', {}
		        , {
		            delete: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ---------------------------------------------------------------FIN TIPO UBICACION-----------------------------------------------------------------//
	    // ---------------------------------------------------------------INICIO TIPO GARANTIA--------------------------------------------------------------//
	    	this.Add_Garantia = function() {
		        return $resource(urlService.server().appnext()+'Add_Garantia', {} , {
		            add: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Update_Garantia = function(){
	    		return $resource(urlService.server().appnext()+'Update_Garantia', {} , {
		            actualizar: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	}
	    	this.Get_Garantia = function() {
		        return $resource(urlService.server().appnext()+'Get_Garantias', {} , {
		            get: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Existencia_Garantia = function(){
	    		return $resource(urlService.server().appnext()+'Existencia_Garantia', {} , {
		            consulta: {
		    			method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    	this.Delete_Garantia = function() {
		        return $resource(urlService.server().appnext()+'Delete_Garantia', {}
		        , {
		            delete: {
		                method: 'POST', isArray: false,
		                params: {
		                    token: $localStorage.token
		                }
		            }
		        });
	    	};
	    // ---------------------------------------------------------------FIN TIPO GARANTIA-----------------------------------------------------------------//

  	});
