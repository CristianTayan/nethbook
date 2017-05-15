'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.urlService
 * @description
 * # urlService
 * Service in the nextbook20App.
 */
angular.module('nextbook20App')
  .service('urlService', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.server=function() {
        return {
            appserviciosnext: function() {
                return "http://186.4.167.12/appserviciosnext/public/index.php/";
            }
            ,appnext: function() {
                // return "http://186.4.167.12/appnext/";
                return "http://186.4.167.12/appnext1.1/public/index.php/";

            },appnextxml: function() {
                // return "http://186.4.167.12/appnextP/";
                return "http://186.4.167.12/appnext1.1";
            },mod_radio: function() {
                // return "http://186.4.167.12/mod_radio/";
                return "http://192.168.0.109/mod_radio/";

            },topmusical: function() {
                // return "http://186.4.167.12/mod_radio/";
                return "http://186.4.167.12/api-admin-oyefm/public/index.php/";
            },search_empresas: function() {
                // return "http://186.4.167.12/mod_radio/";
                return "http://186.4.167.12:3000/";

            }
            ,dir: function() {
                // return "http://186.4.167.12/mod_radio/";
                return "http://186.4.167.12/appnext1.1/";

            }
        }
    };
  });
