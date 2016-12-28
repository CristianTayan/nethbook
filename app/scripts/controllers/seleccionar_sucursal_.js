'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:SeleccionarSucursalCtrl
 * @description
 * # SeleccionarSucursalCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
	.controller('seleccionar_sucursal_Ctrl', function ($scope, $location, $localStorage, establecimientosService) {
		establecimientosService.Get_Establecimientos().get().$promise.then(function(data){
	        $scope.data_establecimiento = data.respuesta.data;
	    });
	    $scope.Select_Sucursal = function(index) {
	        $localStorage.sucursal = index;
	        $location.path('/Colaborador/Dash');
	    }

	    $scope.escapeRegExp = function(str) {
			return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		}
  	});
