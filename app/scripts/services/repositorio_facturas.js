'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.repositorioFacturas
 * @description
 * # repositorioFacturas
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
    .service('repositorioFacturas', function ($resource, urlService, $localStorage) {

        // --------------------------------FACTURAS CORREOS--------------------------------//

        this.Leer_Facturas_Correo = function() {
            return $resource(urlService.server().appnext()+'Leer_Facturas_Correo', {} , {
                get: {
                    method: 'POST', isArray: false,
                    params: {
                        token: $localStorage.token
                    }
                }
            });
        };


        this.Estado_Factura = function() {
            return $resource(urlService.server().appserviciosnext()+'estado_factura', {} , {
                add: {
                    method: 'POST', isArray: false,
                    // params: {
                    //     token: $localStorage.token
                    // }
                }
            });
        };

        this.Upload_XML = function() {
            return $resource(urlService.server().appnext()+'Upload_XML', {} , {
                add: {
                    method: 'POST', isArray: false,
                    params: {
                        token: $localStorage.token
                    }
                }
            });
        };

    	this.Get_Gastos = function() {
            return $resource(urlService.server().appnext()+'Get_Gastos', {} , {
                get: {
                    method: 'POST', isArray: false,
                    params: {
                        token: $localStorage.token
                    }
                }
            });
    	};
    });
