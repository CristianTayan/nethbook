'use strict';

/**
 * @ngdoc directive
 * @name nextbook20App.directive:inventarioDirective
 * @description
 * # inventarioDirective
 */
var app = angular.module('nextbook20App');
  
  //------------------------------------------------------------------ INICIO PERSONA ------------------------------------------------------------------//
    app.directive('personaValidator', function($q, Facturacion_Service) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, ngModel) {
              ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
                // if (viewValue.length==10||viewValue.length==13) {
                return Facturacion_Service.Existencia_Persona().send({di: viewValue}).$promise.then(function(data){
                      if (!data.respuesta) {
                          return $q.reject('proceso');
                      }
                return true;
                });
              // };
              }
          }
      };
    });
  //-------------------------------------------------------------------- FIN PERSONA ------------------------------------------------------------------//