'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:RepositorioFacturasCtrl
 * @description
 * # RepositorioFacturasCtrl
 * Controller of the nextbook20App
 */
	var app = angular.module('nextbook20App')
    app.controller('facturacion_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, $filter, menuService) {
    	
    	// -------------------------------------GENERACION MENU-------------------------------------
        menuService.Get_Vistas_By_Tipo_User().get().$promise.then(function(data) {
            $scope.menu = data.respuesta[0].children[2].children[2];
        });

    });

	app.controller('fac_mis_facturas_venta_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, $filter, menuService) {
    	
    	console.log('mis facturas');

    });

    app.controller('fac_nueva_factura_venta_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, $filter, menuService) {
    	
    	console.log('nueva factura facturas');

    });
   

