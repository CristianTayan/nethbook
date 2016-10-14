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
            appserviosnext: function() {
                return "http://186.33.168.251/appserviosnext/";
            }
            ,appnext: function() {
                // return "http://186.33.168.251/appnext/";
                return "http://186.33.168.251/appnext1.1/public/";

            },appnextPersonas: function() {
                // return "http://186.33.168.251/appnextP/";
                return "http://192.168.0.109/appnextP/";
            },mod_radio: function() {
                // return "http://186.33.168.251/mod_radio/";
                return "http://192.168.0.109/mod_radio/";

            }
        }
    };
  });
