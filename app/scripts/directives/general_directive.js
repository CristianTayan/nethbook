'use strict';

/**
 * @ngdoc directive
 * @name nextbook20App.directive:General
 * @description
 * # General
 */
var app = angular.module('nextbook20App');
    app.directive('validPasswordC', function() {
        return {
            require: 'ngModel',
            scope: {
                reference: '=validPasswordC'
            },
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function(viewValue, $scope) {
                    var noMatch = viewValue != scope.reference
                    ctrl.$setValidity('noMatch', !noMatch);
                    return (noMatch) ? noMatch : !noMatch;
                });
                scope.$watch("reference", function(value) {;
                    ctrl.$setValidity('noMatch', value === ctrl.$viewValue);

                });
            }
        }
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

    app.directive('numbersOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }            
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });
