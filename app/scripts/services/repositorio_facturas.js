'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.repositorioFacturas
 * @description
 * # repositorioFacturas
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('repositorioFacturas', function ($resource, urlService, $localStorage) {
    this.Upload_Factura = function() {
        return $resource(urlService.server().appnext()+'Upload_Factura', {} , {
            add: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token
                }
            }
        });
	};

	this.Get_Gastos = function() {
        return $resource(urlService.server().appnext()+'Get_Gastos', {} , {
            get: {
                method: 'POST', isArray: false,
                params: {
                    token: $localStorage.token
                }
            }
        });
	};
  });
