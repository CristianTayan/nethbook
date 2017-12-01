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
	
    app.directive('numbersOnly', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var validateNumber = function (inputValue) {
                var maxLength = 6;
                if (attrs.max) {
                    maxLength = attrs.max;
                }
                if (inputValue === undefined) {
                    return '';
                }
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                if (transformedInput.length > maxLength) {
                    transformedInput = transformedInput.substring(0, maxLength);
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                var isNotEmpty = (transformedInput.length === 0) ? true : false;
                ctrl.$setValidity('notEmpty', isNotEmpty);
                return transformedInput;
            };

            ctrl.$parsers.unshift(validateNumber);
            ctrl.$parsers.push(validateNumber);
            attrs.$observe('notEmpty', function () {
                validateNumber(ctrl.$viewValue);
            });
        }
    };
});
