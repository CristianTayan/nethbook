'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:InvBienesCtrl
 * @description
 * # InvBienesCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
  	app.controller('inv_bienesCtrl', function (menuService, $scope) {
    	// ------------------------------------inicio generacion vista menu personalizacion------------------------------------
	        var data = menuService.Get_Vistas_Loged_User();
	        $scope.menu = data.respuesta[0].children[0].children[2];
	        console.log($scope.menu);
	        $scope.go_menu=function(menu){
		        $location.path(menu.path);
		    }
  	});

  	app.controller('inv_bienes_menuCtrl', function($scope, inventario_Service, $localStorage) {
	    // $scope.data_inv_tc = {nombre:'', descripcion:''};
	    $scope.data_inv_tc_guardar = function() {
	        inventario_Service.Add_Tipo_Categoria().add($scope.data_inv_tc).$promise.then(function(data) {
	            console.log(data);
	        });
	    }
	    $scope.info_sucursal = $localStorage.sucursal;
	});