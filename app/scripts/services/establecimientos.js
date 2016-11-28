'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.establecimientos
 * @description
 * # establecimientos
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('establecimientos', function ($resource, urlService, $localStorage) {
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
  });
