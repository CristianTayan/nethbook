'use strict';
angular.module('nextbook20App')
  .service('urlService', function () {
    this.server=function() {
      const dominio = window.location.origin;
        return {
            appserviciosnext: function() {
              return dominio + '/nethbook/servicios/public/index.php/';
            }
            ,appnext: function() {
              return dominio + '/nethbook/server/public/index.php/';

            },appnextxml: function() {
              return dominio + '/server/';
            },mod_radio: function() {
              // return "http://186.4.167.12/mod_radio/";
              return "http://192.168.0.109/mod_radio/";

            },topmusical: function() {
              // return "http://186.4.167.12/mod_radio/";
              return "http://186.4.167.12/api-admin-oyefm/public/index.php/";
            },search_empresas: function() {
              // return "http://186.4.167.12/mod_radio/";
              return dominio + ':3000/empresas/';
            }
            ,dir: function() {
              // return "http://186.4.167.12/mod_radio/";
              return "http://localhost:8000/";
            }
        }
    };
  });




//http://localhost:8000/index.php/Get_Provincias