'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.facturacion
 * @description
 * # facturacion
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('Clientes_Service', function ($resource, urlService, $localStorage) {
    // AngularJS will instantiate a singleton by calling "new" on this function

     this.Add_Persona=function() {
        return $resource(urlService.server().appnext()+'Add_Persona', {}
        , {
            add: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };

    this.Add_Empresa=function() {
        return $resource(urlService.server().appnext()+'Add_Empresa', {}
        , {
            add: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token,
                }
            }
        });
    };

  });
