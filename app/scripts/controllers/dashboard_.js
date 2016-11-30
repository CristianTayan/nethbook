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
    	$scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  };

  var list = [];
  for (var i = 0; i < 100; i++) {
    list.push({
      name: 'List Item ' + i,
      idx: i
    });
  }
  $scope.list = list;
  	});
