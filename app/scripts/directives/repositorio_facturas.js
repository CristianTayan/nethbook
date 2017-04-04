'use strict';

/**
 * @ngdoc directive
 * @name nextbook20App.directive:repositorioFacturas
 * @description
 * # repositorioFacturas
 */
angular.module('nextbook20App')
  	.directive('repositorioFacturas', function () {
	    return {
	      template: '<div></div>',
	      restrict: 'E',
	      link: function postLink(scope, element, attrs) {
	        element.text('this is the repositorioFacturas directive');
	      }
	    };
 	});

  	app.directive('onReadFile', function ($parse) {
		return {
			restrict: 'A',
			scope: false,
			link: function(scope, element, attrs) {
	            var fn = $parse(attrs.onReadFile);
	            
				element.on('change', function(onChangeEvent) {
					var reader = new FileReader();
					reader.onload = function(onLoadEvent) {
						scope.$apply(function() {
							fn(scope, {$fileContent:onLoadEvent.target.result});
						});
					};
					if ((onChangeEvent.srcElement || onChangeEvent.target).files[0]) {
						reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
					}
				});
			}
		};
	});
