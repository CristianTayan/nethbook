'use strict';

/**
 * @ngdoc directive
 * @name nextbook20App.directive:parametrizacion
 * @description
 * # parametrizacion
 */
angular.module('nextbook20App')
  .directive('parametrizacion', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the parametrizacion directive');
      }
    };
  });
