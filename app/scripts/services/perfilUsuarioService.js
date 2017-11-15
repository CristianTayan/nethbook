'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.PerfilUsuarioService
 * @description
 * # PerfilUsuarioService
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('PerfilUsuarioService', function ($resource, urlService, $localStorage) {


    //---------------------------------imagen perfil usuario

    this.Add_Img_PerfilUsuario=function() {
        return $resource(urlService.server().appnext()+'Add_Img_PerfilUsuario', {}
        , {
            send: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };
    //----------------------------------------------------------------- Get Imagenes de PerfilUsuario
    this.Load_Imgs_PerfilUsuario=function() {
        return $resource(urlService.server().appnext()+'Load_Imgs_PerfilUsuario', {}
        , {
            get: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                    sucursal:$localStorage.sucursal.id
                }
            }
        });
    };

     //----------------------------------------------------------------- Set Imagen de PerfilUsuario
    this.Set_Img_PerfilUsuario=function() {
        return $resource(urlService.server().appnext()+'Set_Img_PerfilUsuario', {}
        , {
            send: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                    sucursal:$localStorage.sucursal.id
                }
            }
        });
    };
    //----------------------------------------------------------------- Delete Imagen de PerfilUsuario
    this.Delete_Img_PerfilUsuario=function() {
        return $resource(urlService.server().appnext()+'Delete_Img_PerfilUsuario', {}
        , {
            send: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                    sucursal:$localStorage.sucursal.id
                }
            }
        });
    };
    //---------------------------------------------Portada

    this.Add_Img_PortadaUsuario=function() {
        return $resource(urlService.server().appnext()+'Add_Img_PortadaUsuario', {}
        , {
            send: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };
    //----------------------------------------------------------------- Get Imagenes de Portada
    this.Load_Imgs_PortadaUsuario=function() {
        return $resource(urlService.server().appnext()+'Load_Imgs_PortadaUsuario', {}
        , {
            get: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                    sucursal:$localStorage.sucursal.id
                }
            }
        });
    };

     //----------------------------------------------------------------- Set Imagen de Portada
    this.Set_Img_PortadaUsuario=function() {
        return $resource(urlService.server().appnext()+'Set_Img_PortadaUsuario', {}
        , {
            send: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                    sucursal:$localStorage.sucursal.id
                }
            }
        });
    };
    //----------------------------------------------------------------- Delete Imagen de Portada
    this.Delete_Img_PortadaUsuario=function() {
        return $resource(urlService.server().appnext()+'Delete_Img_PortadaUsuario', {}
        , {
            send: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                    sucursal:$localStorage.sucursal.id
                }
            }
        });
    };

});