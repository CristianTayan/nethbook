'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.mainService
 * @description
 * # mainService
 * Service in the nextbook20App.
 */
var app = angular.module('nextbook20App');
    app.service('mainService', function ($resource, urlService, $localStorage) {

        // AngularJS will instantiate a singleton by calling "new" on this function
        //------------------------------------------------------    INICIO BUSQUEDA DE EMPRESAS -------------------------------------------------------
        this.buscar_empresas = function() {
            return $resource(urlService.server().appnext()+'Buscar_Empresas', {},{
                get: {
                    method: 'POST', isArray: false,
                }
            });
        };

        //------------------------------------------------------    INICIO BUSQUEDA ID DE EMPRESAS -----------------------------------------------------
        this.info_perfil_busqueda = function() {
            return $resource(urlService.server().appnext()+'Get_Perfil_Empresas', {}, {
                get: {
                    method: 'POST', isArray: false
                }
            });
        };

        //------------------------------------------------------    GET PROVINCIAS  --------------------------------------------------------------------
        this.item_provincias = function() {
            return $resource(urlService.server().appnext()+'Get_Provincias', {}, {
                get: {
                    method: 'POST', isArray: false
                }
            });
        };

        // -----------------------------------------------------    BUSCAR INFORMACION RUC   -----------------------------------------------------------
        this.buscar_informacion_ruc = function() {
            return $resource(urlService.server().appnext()+'Buscar_Informacion_Ruc', {}, {
            get:    {
                        method: 'POST', isArray: false
                    }
            });
        };

        // -----------------------------------------------------    BUSCAR INFORMACION RUC   -----------------------------------------------------------
        this.guardar_datos_ruc = function($data) {
            return $resource(urlService.server().appnext()+'Save_Datos_Ruc', {}, {
            save:   {
                        method: 'POST', isArray: false, params: $data
                    }
            });
        };
        
        this.activar_cuenta = function($data) {
            return $resource(urlService.server().appnext()+'Activar_Cuenta', {}, {
            save:   {
                        method: 'POST', isArray: false, params: $data
                    }
            });
        };
        this.ingresar = function($data) {
            return $resource(urlService.server().appnext()+'Acceso', {}, {
            acceso:   {
                            method: 'POST', isArray: false, params: $data // params: {token: $localStorage.token}
                        }
            });
        };

        // -----------------------------------------------------    Requerir Imagenes generales perfil   ------------------------------------------------
        this.Get_Img_Perfil=function() {
            return $resource(urlService.server().appnext()+'Get_Img_Perfil', {}
            , {
                get: {
                    method: 'POST', isArray: false, 
                    params: {
                        token:$localStorage.token
                    }
                }
            });
        };
        this.Get_Img_Logo=function() {
            return $resource(urlService.server().appnext()+'Get_Img_Logo', {}
            , {
                get: {
                    method: 'POST', isArray: false, 
                    params: {
                        token: $localStorage.token
                    }
                }
            });
        };
        this.Get_Img_Portada=function() {
            return $resource(urlService.server().appnext()+'Get_Img_Portada', {}
            ,   {
                get: {
                    method: 'POST', isArray: false, 
                    params: {
                        token: $localStorage.token
                    }
                }
            });
        };

        this.Get_Img_Logo=function() {
            return $resource(urlService.server().appnext()+'Get_Img_Logo', {}
            , {
                get: {
                    method: 'POST', isArray: false, 
                    params: {
                        token: $localStorage.token
                    }
                }
            });
        };
        this.Get_Datos_Empresa=function() {
            return $resource(urlService.server().appnext()+'Get_Datos_Empresa', {}
            , {
                get: {
                    method: 'POST', isArray: false, 
                    params: {
                        token: $localStorage.token
                    }
                }
            });
        };

        this.Update_Password = function() {
            return $resource(urlService.server().appnext()+'Update_Password', {} , {
                get: {
                    method: 'POST', isArray: false,
                    params: {
                        token: $localStorage.token
                    }
                }
            });
        };

        this.gettop10 = function() {
            return $resource(urlService.server().topmusical()+'gettop10', {} , {
                get: {
                    method: 'GET', isArray: false,
                    params: {
                        // token: $localStorage.token
                    }
                }
            });
        };

        
    });
app.factory('mySocket', function (socketFactory) {
    // console.log(socketFactory());
    // console.log(io);
    // var myIoSocket = io.connect('');
  // return socketFactory();
});


// app.factory('mySocket', function($rootScope) {
//     var socket = io.connect();
//     function on(eventName, callback) {
//         socket.on(eventName, function() {
//             var args = arguments;

//             $rootScope.$apply(function() {
//                 callback.apply(socket, args);
//             });
//         });

//         // Remove duplicate listeners
//         socket.removeListener(eventName, callback);
//     }
//     function emit(eventName, data, callback) {
//         socket.emit(eventName, data, function() {
//             var args = arguments;

//             $rootScope.$apply(function() {
//                 if (callback) {
//                     callback.apply(socket, args);
//                 }
//             });
//         });
//         // Remove duplicate listeners
//         socket.removeListener(eventName, callback);
//     }
//     return {
//         on: on,
//         emit: emit
//     };
// });