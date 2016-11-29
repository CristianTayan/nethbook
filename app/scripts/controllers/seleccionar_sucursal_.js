'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:SeleccionarSucursalCtrl
 * @description
 * # SeleccionarSucursalCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
	.controller('seleccionar_sucursal_Ctrl', function ($scope, $location, establecimientos) {
		establecimientos.Get_Establecimientos().get().$promise.then(function(data){
	        $scope.data_establecimiento = data.respuesta;
	        console.log(data.respuesta);
	    });
	    $scope.Select_Sucursal = function(index) {
	        $localStorage.sucursal = $scope.products[index];
	        $location.path('/My-space/Inicio');
	    }
  	});
