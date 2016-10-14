'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.mainService
 * @description
 * # mainService
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('mainService', function ($resource, urlService) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    //------------------------------------------------------ INICIO BUSQUEDA DE EMPRESAS ------------------------------------------------------
    this.buscar_empresas=function() {
        return $resource(urlService.server().appnext()+'BuscarEmpresas', {},{
            get: {
                method: 'GET', isArray: false,
            }
        });
    };

    //----------------------------------------------------- INICIO BUSQUEDA ID DE EMPRESAS -----------------------------------------------------
    this.info_perfil_busqueda=function() {
        return $resource(urlService.server().appnext()+'getPerfilEmpresas', {}, {
            get: {
                method: 'GET', isArray: false
            }
        });
    };
  });
