'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:InventarioCtrl
 * @description
 * # InventarioCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
 	app.controller('inventario_Ctrl', function ($scope, inventario_Service) {
 		// $scope.data_inv_tc = {nombre:'', descripcion:''};
    	$scope.data_inv_tc_guardar = function(){
    		inventario_Service.Add_Tipo_Categoria().add($scope.data_inv_tc).$promise.then(function(data){
    			console.log(data);
    		});
    	}
	});
	app.controller('inv_tipo_categoria_Ctrl', function ($scope, inventario_Service) {
 		// $scope.data_inv_tc = {nombre:'', descripcion:''};
    	$scope.data_inv_tc_guardar = function(){
    		inventario_Service.Add_Tipo_Categoria().add($scope.data_inv_tc).$promise.then(function(data){
    			console.log(data);
    		});
    	}
	});

