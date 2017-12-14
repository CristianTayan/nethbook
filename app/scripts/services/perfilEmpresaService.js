'use strict';
angular.module('nextbook20App')
.service('perfilEmpresaService', function ($resource, urlService, $localStorage) {

  this.Add_Img_PerfilEmpresa=function() {
    return $resource(urlService.server().appnext()+'Add_Img_PerfilEmpresa', {}, {
        send: {
            method: 'POST', isArray: false,
            params: {
              token: $localStorage.token,
              sucursal:$localStorage.sucursal.id
            }
        }
    });
  };

  this.Load_Imgs_PerfilEmpresa=function() {
    return $resource(urlService.server().appnext()+'Load_Imgs_PerfilEmpresa', {}, {
        get: {
            method: 'POST', isArray: false,
            params: {
                token: $localStorage.token,
                sucursal:$localStorage.sucursal.id
            }
        }
    });
  };

  this.Set_Img_PerfilEmpresa=function() {
    return $resource(urlService.server().appnext()+'Set_Img_PerfilEmpresa', {}, {
        send: {
            method: 'POST', isArray: false,
            params: {
                token: $localStorage.token,
                sucursal:$localStorage.sucursal.id
            }
        }
    });
  };

  this.Delete_Img_PerfilEmpresa=function() {
    return $resource(urlService.server().appnext()+'Delete_Img_PerfilEmpresa', {}, {
        send: {
            method: 'POST', isArray: false,
            params: {
                token: $localStorage.token,
                sucursal:$localStorage.sucursal.id
            }
        }
    });
  };

  this.Add_Img_PortadaEmpresa=function() {
    return $resource(urlService.server().appnext()+'Add_Img_PortadaEmpresa', {}, {
        send: {
            method: 'POST', isArray: false,
            params: {
              token: $localStorage.token,
              sucursal:$localStorage.sucursal.id
            }
        }
    });
  };

  this.Load_Imgs_PortadaEmpresa=function() {
    return $resource(urlService.server().appnext()+'Load_Imgs_PortadaEmpresa', {}, {
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
  this.Set_Img_PortadaEmpresa=function() {
    return $resource(urlService.server().appnext()+'Set_Img_PortadaEmpresa', {}, {
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
  this.Delete_Img_PortadaEmpresa=function() {
    return $resource(urlService.server().appnext()+'Delete_Img_PortadaEmpresa', {}, {
        send: {
            method: 'POST', isArray: false,
            params: {
                token: $localStorage.token,
                sucursal:$localStorage.sucursal.id
            }
        }
    });
  };

  this.getImgPerfilAndPortadaEmpresa = function() {
    return $resource(urlService.server().appnext() + 'getImgPerfilAndPortadaEmpresa', {}, {
      get: {
        method: 'POST', isArray: false,
        params: { token: $localStorage.token }
      }
    });
  };
});