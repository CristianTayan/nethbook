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

    app.filter('reverse', function() {
      return function(items) {
        if (items) {
            return items.slice().reverse();
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
    // validacion solo numero
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

    // -----------------------------------------------------------CONVERTIR LESTRAS A MAYUSCULAS-----------------------------------------------------------
    app.directive('uppercase', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var capitalize = function(inputValue) {
                    if (inputValue == undefined) inputValue = '';
                    var capitalized = inputValue.toUpperCase();
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }
                modelCtrl.$parsers.push(capitalize);
                capitalize(scope[attrs.ngModel]);
            }
        };
    });

 app.factory('focus', function($timeout, $window) {
    return function(id) {
      // timeout makes sure that it is invoked after any other event has been triggered.
      // e.g. click events that need to run before the focus or
      // inputs elements that are in a disabled state but are enabled when those events
      // are triggered.
      $timeout(function() {
        var element = $window.document.getElementById(id);
        if(element)
          element.focus();
      });
    };
  });

  app.directive('eventFocus', function(focus) {
    return function(scope, elem, attr) {
      elem.on(attr.eventFocus, function() {
        focus(attr.eventFocusId);
      });

      // Removes bound events in the element itself
      // when the scope is destroyed
      scope.$on('$destroy', function() {
        elem.off(attr.eventFocus);
      });
    };
  });

  app.directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            var focusedElement;
            element.on('click', function () {
                if (focusedElement != this) {
                    this.select();
                    focusedElement = this;
                }
            });
            element.on('blur', function () {
                focusedElement = null;
            });
        }
    };
})

app.directive('disableOnPromise',function($parse){
  return {
    restrict:'A',
    compile:function($compile,attr){
      var fn=$parse(attr.disableOnPromise);
      return function clickHandler(scope, element, attrs) {
        var ladda = (attrs.withLadda ? Ladda.create(element[0]) : false);
        element.on('click', function(event) {
          attrs.$set('disabled', true);
          if(ladda) ladda.start();
          scope.$apply(function() {
            fn(scope, {$event:event}).finally(function() {
              attrs.$set('disabled', false);
              if(ladda) ladda.stop();
            });
          });
        });
      };
    }

  };

})