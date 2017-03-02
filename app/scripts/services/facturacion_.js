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
            get: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };

  });
