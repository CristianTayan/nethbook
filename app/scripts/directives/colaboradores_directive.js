'use strict';

/**
 * @ngdoc directive
 * @name nextbook20App.directive:colaboradoresDirective
 * @description
 * # colaboradoresDirective
 */
var app = angular.module('nextbook20App')
	app.directive('colaboradoresDirective', function () {
	    return {
	      template: '<div></div>',
	      restrict: 'E',
	      link: function postLink(scope, element, attrs) {
	        element.text('this is the colaboradoresDirective directive');
	      }
	    };
	});
	// ----------------------------------------------INICIO USUARIO----------------------------------------------
	app.directive('numdocumentValidator', function($q, colaboradores_Service) {
	    return {
	        require: 'ngModel',
	        link: function(scope, element, attrs, ngModel) {
	            ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
	            	return colaboradores_Service.Existencia_Usuario_Cedula().consulta({numero_identificacion: viewValue}).$promise.then(function(data){
                    if (!data.respuesta) {
                        return $q.reject('proceso');
                    }
        			return true;
		    	     });
	            };
	        }
	    };
	});
	app.directive('correoelectronicoValidator', function($q, colaboradores_Service) {
	    return {
	        require: 'ngModel',
	        link: function(scope, element, attrs, ngModel) {
	            ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
	            	return colaboradores_Service.Existencia_Usuario_Correo().consulta({nombre: viewValue}).$promise.then(function(data){
                    if (!data.respuesta) {
                        return $q.reject('proceso');
                    }
        			return true;
		    	     });
	            };
	        }
	    };
	});
	app.directive('correoelectronicoValidator', function($q, colaboradores_Service) {
	    return {
	        require: 'ngModel',
	        link: function(scope, element, attrs, ngModel) {
	            ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
	            	return colaboradores_Service.Existencia_Usuario_Nick().consulta({nombre: viewValue}).$promise.then(function(data){
                    if (!data.respuesta) {
                        return $q.reject('proceso');
                    }
        			return true;
		    	     });
	            };
	        }
	    };
	});
	
	// ----------------------------------------------FIN USUARIO----------------------------------------------------
	
