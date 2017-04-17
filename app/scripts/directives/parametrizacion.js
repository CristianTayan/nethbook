'use strict';

/**
 * @ngdoc directive
 * @name nextbook20App.directive:parametrizacion
 * @description
 * # parametrizacion
 */
var app = angular.module('nextbook20App')
	app.directive('impuestosValidator', function($q, parametrizacion) {
		return {
		  require: 'ngModel',
		  link: function(scope, element, attrs, ngModel) {
		      ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
		        return parametrizacion.Existencia_Impuesto().consulta({nombre: viewValue}).$promise.then(function(data){
		              if (!data.respuesta) {
		                  return $q.reject('proceso');
		              }
		        return true;
		        });
		      };
		  }
		};
    });
