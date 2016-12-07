'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  	.controller('dashboard_Ctrl', function ($scope, $mdSidenav, $localStorage) {
    	$scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
      };
      $scope.nom_perfil = $localStorage.datosE.nombre_comercial;


  	});
