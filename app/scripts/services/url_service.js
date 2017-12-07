'use strict';
angular.module('nextbook20App') .service('urlService', function () {
    this.server=function() {
        let dominio=window.location.origin;
        if ('http://localhost:9000'===dominio) {
            dominio='http://localhost';
        }
        return {
            appserviciosnext: function() {
                return dominio + '/nethbook/servicios/public/index.php/';
            }, appnext: function() {
                return dominio + '/nethbook/server/public/index.php/';
            }, appnextxml: function() {
                return dominio + '/server/';
            }, mod_radio: function() {
                return "http://192.168.0.109/mod_radio/";
            }, topmusical: function() {
                return "http://186.4.167.12/api-admin-oyefm/public/index.php/";
            }, search_empresas: function() {
                return dominio + '/empresas/';
            }, dir: function() {
                return dominio + '/nethbook/server';
            }
        };
    }
    ;
}

);