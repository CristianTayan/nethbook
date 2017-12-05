'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.establecimientos
 * @description
 * # establecimientos
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('establecimientosService', function ($resource, urlService, $localStorage) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.Get_Establecimientos=function() {
        return $resource(urlService.server().appnext()+'Get_Establecimientos', {}
        , {
            get: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };

    this.Update_Giro_Actividad=function() {
        return $resource(urlService.server().appnext()+'Update_Giro_Actividad', {}
        , {
            send: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };

    this.UpdateAddSucursal=function() {
    return $resource(urlService.server().appnext()+'UpdateAddSucursal', {}
    , {
        send: {
            method: 'POST', isArray: false,
            params: {
                token: $localStorage.token,
            }
        }
    });
    };
    
    this.getDatosAdicionales=function() {
    return $resource(urlService.server().appnext()+'getDatosAdicionales', {}
    , {
        get: {
            method: 'POST', isArray: false,
            params: {
                token: $localStorage.token,
            }
        }
    });
    };



    //-------------------------------------------------------------- PORTADA --------------------------------------------------------------
    //-------------------------------------------------------------- Añadir imagen de portada
     this.Add_Img_Portada=function() {
        return $resource(urlService.server().appnext()+'Add_Img_Portada', {}
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
    this.Load_Imgs_Portada=function() {
        return $resource(urlService.server().appnext()+'Load_Imgs_Portada', {}
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
    this.Set_Img_Portada=function() {
        return $resource(urlService.server().appnext()+'Set_Img_Portada', {}
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
    this.Delete_Img_Portada=function() {
        return $resource(urlService.server().appnext()+'Delete_Img_Portada', {}
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
    //-------------------------------------------------------------- PERFIL --------------------------------------------------------------
    //-------------------------------------------------------------- Añadir imagen de Perfil
     this.Add_Img_Perfil=function() {
        return $resource(urlService.server().appnext()+'Add_Img_Perfil', {}
        , {
            send: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };
    //----------------------------------------------------------------- Get Imagenes de Perfil
    this.Load_Imgs_Perfil=function() {
        return $resource(urlService.server().appnext()+'Load_Imgs_Perfil', {}
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

     //----------------------------------------------------------------- Set Imagen de Perfil
    this.Set_Img_Perfil=function() {
        return $resource(urlService.server().appnext()+'Set_Img_Perfil', {}
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
    //----------------------------------------------------------------- Delete Imagen de Perfil
    this.Delete_Img_Perfil=function() {
        return $resource(urlService.server().appnext()+'Delete_Img_Perfil', {}
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
