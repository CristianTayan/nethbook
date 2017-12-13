'use strict';
angular.module('nextbook20App')
.service('perfilSucursalService', function ($resource, urlService, $localStorage) {
  this.Get_Img_Perfil=function() {
    return $resource(urlService.server().appnext()+'Get_Img_Perfil', {}, {
      get: {
        method: 'POST', isArray: false, 
        params: { token:$localStorage.token }
      }
    });
  };

  this.Get_Img_PerfilUsuario =function() {
    return $resource(urlService.server().appnext()+'Get_Img_PerfilUsuario', {}, {
      get: {
        method: 'POST', isArray: false, 
        params: { token:$localStorage.token }
      }
    });
  };

  this.Get_Img_PerfilEmpresa =function() {
    return $resource(urlService.server().appnext()+'Get_Img_PerfilEmpresa', {}, {
      get: {
        method: 'POST', isArray: false, 
        params: { token:$localStorage.token }
      }
    });
  };
  // IMAGENES DE PORTADA
  this.Get_Img_Portada=function() {
    return $resource(urlService.server().appnext()+'Get_Img_Portada', {}, {
      get: {
        method: 'POST', isArray: false, 
        params: { token: $localStorage.token }
      }
    });
  };

  this.Get_Img_PortadaUsuario=function() {
    return $resource(urlService.server().appnext()+'Get_Img_PortadaUsuario', {}, {
      get: {
        method: 'POST', isArray: false, 
        params: { token: $localStorage.token }
      }
    });
  };

  this.Get_Img_PortadaEmpresa=function() {
    return $resource(urlService.server().appnext()+'Get_Img_PortadaEmpresa', {}, {
      get: {
        method: 'POST', isArray: false, 
        params: { token: $localStorage.token }
      }
    });
  };
});