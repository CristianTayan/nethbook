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
	app.directive('numdocumentValidator', function($q, colaboradores_Service) {
	    return {
	        require: 'ngModel',
	        link: function(scope, element, attrs, ngModel) {
	            ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
	            	return colaboradores_Service.Existencia_Colaborador().consulta({numero_identificacion: viewValue}).$promise.then(function(data){
                    if (!data.respuesta) {
                        return $q.reject('proceso');
                    }
        			return true;
		    	     });
	            };
	        }
	    };
	});

	app.directive('tipousuarioValidator', function($q, colaboradores_Service) {
	    return {
	        require: 'ngModel',
	        link: function(scope, element, attrs, ngModel) {
	            ngModel.$asyncValidators.campo = function(modelValue, viewValue) {
	            	return colaboradores_Service.Existencia_Tipo_Usuario().consulta({nombre: viewValue}).$promise.then(function(data){
                    if (!data.respuesta) {
                        return $q.reject('proceso');
                    }
        			return true;
		    	     });
	            };
	        }
	    };
	});
	
	app.directive('mdBox', function(ivhTreeviewMgr) {
    return {
        restrict: 'AE',
        template: [
            '<span class="ascii-box">',
		        '<span ng-show="node.selected" class="x"><md-checkbox style="min-height: 100%; line-height: 0" aria-label="checked" ng-checked="true"></md-checkbox></span>',
		        '<span ng-show="node.__ivhTreeviewIndeterminate" class="y"><md-checkbox style="min-height: 100%; line-height: 0" aria-label="checked" ng-checked="false"></md-checkbox></span>',
		        '<span ng-hide="node.selected || node.__ivhTreeviewIndeterminate"><md-checkbox style="min-height: 100%; line-height: 0" aria-label="checked" ng-checked="false"></md-checkbox></span>',
		    '</span>',
        ].join(''),
        link: function(scope, element, attrs) {
            element.on('click', function() {
                ivhTreeviewMgr.select(stuff, scope.node, !scope.node.selected);
                scope.$apply();
            });
        }
    };
});