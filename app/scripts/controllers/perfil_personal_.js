'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:PerfilPersonalCtrl
 * @description
 * # PerfilPersonalCtrl
 * Controller of the nextbook20App
 */
	var app = angular.module('nextbook20App');
  	app.controller('perfil_personal_Ctrl', function ($scope, $localStorage, colaboradores_Service, $mdDialog) {
    	$scope.data_usuario = $localStorage.datosPersona;
    	//----------------SELECT CIUDADES---------------//
	    function success_ciudades(desserts) {
		    var cm = $scope;
	        cm.selectCallback = $scope.data_usuario.id_localidad.id;
	        cm.selectCiudades = desserts.respuesta;
	        cm.selectModelCiudad = {
	            selectedCiudades: $scope.data_usuario.id_localidad,
	            selectedPeople: [cm.selectCiudades[2], cm.selectCiudades[4]],
	            selectedPeopleSections: []
	        };
	    }

	    $scope.data_ciudades = function() {
	        colaboradores_Service.Get_Ciudades().get($scope.query, success_ciudades).$promise;
	    }
	    $scope.data_ciudades();

		$scope.cambiar_datos_password = function(){
			$mdDialog.show( {
			    controller: DialogController,
			    templateUrl: 'views/dashboard/modal_updat_pass.html',
			    parent: angular.element(document.body),
			    clickOutsideToClose: false, // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			    locals: {data:$scope.data}
			});
	    }

	    function DialogController($scope, $mdDialog, mainService, $localStorage, data) {
		    $scope.verificar = function(){
		    	mainService.Verificar_Pass().get({pass:$scope.pass}).$promise.then(function(response){
		    		console.log(response);
		    		if (response.respuesta) {
		    			$mdDialog.hide();
			    		mainService.Update_Password().get({pass:$scope.password}).$promise.then(function(data){
			    			console.log('test');
					   //      if (data.respuesta == true) {
					   //        $location.path('/Seleccionar_Sucursal');
					   //      }else{
								// console.log('test');
					   //      }
					    });
		    		}else{
		    			// console.log('testtisng');
		    			$scope.pass = '';
		    			// $scope.verificar();
		    		}
		    	});
		    }
		};

  	});
