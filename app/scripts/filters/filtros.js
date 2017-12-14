'use strict';

var app = angular.module('nextbook20App');
  app.filter('split', function() {
    return function(input, splitChar, splitIndex) {
      return input.split(splitChar)[splitIndex];
    }
  });
