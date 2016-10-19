'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:RegistroCtrl
 * @description
 * # RegistroCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  	.controller('registro_Ctrl', function ($scope, $location, $mdDialog, mainService, blockUI) {
  		$scope.elementview = false;
  		$scope.elemennotview = true; 		
  		
  		// cargar provincias
  		mainService.item_provincias().get().$promise.then(function(data){
	        $scope.states = data.respuesta;
	    });

  		// buscar servidor externo consulta
  		$scope.searchruc = function() {
  			blockUI.start();
	        mainService.buscar_informacion_ruc().get({ruc: $scope.ruc}).$promise.then(function(data){
	        	blockUI.stop();
	            var x = data.respuesta;
	            if (x == true) {
	                $mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.querySelector('#popupContainer')))
				        .clickOutsideToClose(true)
				        .title('Ya Existe!')
				        .textContent('Este numero de RUC ya se encuentra registrado.')
				        .ariaLabel('Alert Dialog Demo')
				        .ok('Entendido')
				    );
	            } else {
	                var data = data.respuesta;
	                $scope.sucursales=data.establecimientos;
	                var data = data.datosEmpresa;
	                $scope.razon_social = data.razon_social;
	                $scope.nombre_comercial = data.nombre_comercial;
	                $scope.estado_contribuyente = data.estado_contribuyente;
	                $scope.clase_contribuyente = data.clase_contribuyente;
	                $scope.tipo_contribuyente = data.tipo_contribuyente;
	                $scope.obligado_llevar_contabilidad = data.obligado_llevar_contabilidad;
	                $scope.actividad_principal=data.actividad_economica;
	                data['sucursales']=$scope.sucursales;
	                $scope.rucdata = data;
	                $scope.elementview=true;
	                $scope.elemennotview=false;  
	            }
	        });
	    }
	    // logeo ingreso app
  		$scope.ingresar = function() {
	        $scope.data['tipo'] = "E";
	        var obj = {'email':$scope.email, 'password':$scope.password, 'tipo':'E' };
	        LoginE.ingresar(obj).$promise.then(function(data) {
	            if (data.respuesta == false) {
	            	$mdDialog.show(
			            $mdDialog.alert()
			            .parent(angular.element(document.querySelector('#dialogContainer')))
			            .clickOutsideToClose(true)
			            .title('Lo sentimos :(')
			            .textContent('Usuario o password incorrecto, vuelva a intentar')
			            .ok('Entendido')
			            .openFrom('#left')
			        );
	            } else {
		            $localStorage.token = data[0].token;
		            $localStorage.datosE = data.datosE;
		            $localStorage.datosPersona = data.datosPersona;
		            //--------------------cargar imagen perfil-----------
		            servicios.get_img_perfil().get().$promise.then(function(data) {
		            	$localStorage.imgPerfil = data.img;		                
		            },function(error){
		            	$localStorage.imgPerfil="images/users/avatar-001.jpg";
		            });
		            //--------------------cargar imagen Portada-----------
		            servicios.get_img_portada().get().$promise.then(function(data) {
		            	$localStorage.imgPortada = data.img;
		            },function(error){
		            	$localStorage.imgPortada="images/samples/w1.jpg";
		            });
		            // ---------- fin
		            //--------------------cargar imagen Logo-----------
		            servicios.get_img_logo().get().$promise.then(function(data) {
		            	$localStorage.imgLogo = data.img;
		            },function(error){
		            	$localStorage.imgPortada="images/samples/x2.jpg";
		            });
		            // ---------- fin
		            //---------------------- verificar si existe datos de persona-----------
		            servicios.get_propietario().get().$promise.then(function(data) {
		                if (data.respuesta) {
		                    $location.path('/SeleccionarSucursal');
		                } else {
		                    $location.path('/CambioPass');
		                }
		            });
		        }
	        });
	    }

	    $scope.registrar = function() {
	    	$scope.rucdata['telefono'] = $scope.lastName
	        $scope.rucdata['telefono1'] = $scope.lastName2;
	        $scope.rucdata['provincia'] = $scope.myOption;
	        $scope.rucdata['celular'] = $scope.fono;
	        $scope.rucdata['correo'] = $scope.correo;
	        mainService.guardar_datos_ruc($scope.rucdata).save().$promise.then(function(result){
	            if (result.respuesta == true) {
	            	$mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.querySelector('#popupContainer')))
				        .clickOutsideToClose(true)
				        .title('Registro Correcto!')
				        .textContent('En hora buena registro correcto revise su correo para activar su cuenta.')
				        .ariaLabel('Alert Dialog')
				        .ok('Entendido')
				    );
	                $scope.elemennotview = true;
	                $scope.elementview = false;               
	                $scope.ruc = null;
	               // reset();
	            } else {
	            	$mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.querySelector('#popupContainer')))
				        .clickOutsideToClose(true)
				        .title('Lo sentimos!')
				        .textContent('Intente mas Tarde.')
				        .ariaLabel('Alert Dialog')
				        .ok('Entendido')
				    );
	            }   
	        });
	    }
  	})
	.controller('activar_Ctrl', function ($scope, $routeParams, $mdDialog, mainService, blockUI) {
		blockUI.start();
		mainService.activar_cuenta($routeParams).save().$promise.then(function(data){
	        // $scope.states = data.respuesta;
	        blockUI.stop();
	        console.log(data);
	    });
	});
