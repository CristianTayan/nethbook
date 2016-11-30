'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  	.controller('dashboard_Ctrl', function ($scope, $mdSidenav) {
    	$scope.toggleLeft = buildToggler('left');
	    $scope.toggleRight = buildToggler('right');

	    function buildToggler(componentId) {
	      return function() {
	        $mdSidenav(componentId).toggle();
	      }
	    }
  	});
