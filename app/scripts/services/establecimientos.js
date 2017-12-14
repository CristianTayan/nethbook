'use strict';

angular.module('nextbook20App')
  .service('establecimientosService', function ($resource, urlService, $localStorage) {
    this.Get_Establecimientos=function() {
      return $resource(urlService.server().appnext()+'Get_Establecimientos', {}, {
        get: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token,
          }
        }
      });
    };

    this.Update_Giro_Actividad=function() {
      return $resource(urlService.server().appnext()+'Update_Giro_Actividad', {}, {
        send: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token,
          }
        }
      });
    };

    this.UpdateAddSucursal=function() {
      return $resource(urlService.server().appnext()+'UpdateAddSucursal', {}, {
        send: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token,
          }
        }
      });
    };
    
    this.updateGiroNegocio=function() {
      return $resource(urlService.server().appnext()+'updateGiroNegocio', {}, {
        send: {
            method: 'POST', isArray: false,
            params: {
                token: $localStorage.token,
            }
        }
      });
    };
    this.UpdateAddDatosCorreo=function() {
      return $resource(urlService.server().appnext()+'UpdateAddDatosCorreo', {}, {
        send: {
            method: 'POST', isArray: false,
            params: {
                token: $localStorage.token,
            }
        }
      });
    };
    
    this.getDatosAdicionales=function() {
      return $resource(urlService.server().appnext()+'getDatosAdicionales', {}, {
        get: {
            method: 'POST', isArray: false,
            params: {
                token: $localStorage.token,
            }
        }
      });
    };
    
    this.getGiroNegocio=function() {
      return $resource(urlService.server().appnext()+'getGiroNegocio', {}, {
        get: {
          method: 'POST', isArray: false,
          params: {
            token: $localStorage.token,
          }
        }
      });
    };

    this.getDatosAdicionalesSucursal=function() {
      return $resource(urlService.server().appnext()+'getDatosAdicionalesSucursal', {}, {
        get: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token,
          }
        }
      });
    };
    
    this.addInformacionSucursal=function() {
      return $resource(urlService.server().appnext()+'addInformacionSucursal', {}, {
        get: {
          method: 'POST', isArray: false, 
          params: { token: $localStorage.token }
        }
      });
    };

    

    this.getIdDatosAdicionales=function() {
      return $resource(urlService.server().appnext()+'getIdDatosAdicionales', {}, {
        send: {
          method: 'POST', isArray: false,
          params: {
            token: $localStorage.token,
          }
        }
      });
    };


   
    this.Add_Img_Perfil=function() {
      return $resource(urlService.server().appnext()+'Add_Img_Perfil', {}, {
        send: {
          method: 'POST', isArray: false,
          params: {
              token: $localStorage.token,
          }
        }
      });
    };

  });
