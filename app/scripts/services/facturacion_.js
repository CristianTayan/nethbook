'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.facturacion
 * @description
 * # facturacion
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('Facturacion_Service', function ($resource, urlService, $localStorage) {
    // AngularJS will instantiate a singleton by calling "new" on this function

     this.Get_Cliente_By_Ruc_Ci=function() {
        return $resource(urlService.server().appnext()+'Get_Cliente_By_Ruc_Ci', {}
        , {
            send: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };

    this.Get_Empleado_By_Ruc_Ci=function() {
        return $resource(urlService.server().appnext()+'Get_Empleado_By_Ruc_Ci', {}
        , {
            send: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };

    this.Add_Caja=function() {
        return $resource(urlService.server().appnext()+'Add_Caja', {}
        , {
            send: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };

    this.Get_Cajas=function() {
        return $resource(urlService.server().appnext()+'Get_Cajas', {}
        , {
            get: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };

     this.ObjIndexOf=function(arr, obj){
                for(var i = 0; i < arr.length; i++){
                    if(arr[i].id== obj.id){
                        return i;
                    }
                };
        return -1;
    }

    this.Buscar_Productos_Facturacion= function() {
        return $resource(urlService.server().appnext()+'Buscar_Productos_Facturacion', {} , {
            get: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token
                }
            }
        });
    };

  });
