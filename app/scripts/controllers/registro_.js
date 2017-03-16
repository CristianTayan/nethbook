'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:RegistroCtrl
 * @description
 * # RegistroCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
  	app.controller('registro_Ctrl', function ($scope, $location, $mdDialog, mainService, consumirService, $localStorage, colaboradores_Service, menuService) {
  		$scope.update_phone = function() {
		    var tel = $scope.rucdata.telefono;
		    var tel1 = $scope.rucdata.telefono1;
		    var cel = $scope.rucdata.celular;
		    var num_sin_extension = '';
		    var num_sin_extension1 = '';
		    var celular = '';
		    if(void 0!=tel&&tel.length>=6){var num=tel.split(")");num_sin_extension=num[1].replace(" ","")}
		    if(void 0!=tel1&&tel1.length>=6){var num=tel1.split(")");num_sin_extension1=num[1].replace(" ","")}

		    void 0!=cel?$scope.rucdata.celular=cel:$scope.rucdata.celular="09";
		    

		    var extension = $scope.rucdata.provincia.codigo_telefonico;
		    $scope.rucdata['telefono'] = extension + ' ' + num_sin_extension;
		    $scope.rucdata['telefono1'] = extension + ' ' + num_sin_extension1;

		}

		$scope.elementview = false;
		$scope.elemennotview = true;
		$scope.elemennotviewimg = true;
		$scope.elemennotviesession = false;

  		// RECORDATORIO SESSION
  		session_open_();
  		function session_open_(){
	  		if ($localStorage.cook_session_init) {
	  			$scope.session = $localStorage.cook_session_init;
	  			if ($scope.session.length != 0) {
	  				$scope.elemennotviewimg = false;
	  				$scope.elemennotviewsession = true;
	  			}
	  		}
	  	}
  		$scope.entrar_recordatorio = function(item) {
		    $mdDialog.show({
	            controller: DialogController,
	            templateUrl: 'views/acceso-colaboradores/modal.html',
	            parent: angular.element(document.body),
	            clickOutsideToClose: false,
	            fullscreen: true,
	            locals: {item:item}
	        });
		};

		$scope.quitar_recordatorio = function(index, item) {
			var session = $localStorage.cook_session_init;
			var x = session.splice(0, index);

			console.log(x);
			// $localStorage.cook_session_init = session
		}



		function DialogController($scope, item, menuService){
			$scope.nick = item;
			$scope.ingresar_colaborador = function() {
				var obj = {'ruc' : $scope.nick.ruc_empresa, clave: $scope.clave, 'nick':$scope.nick.nick};
		        colaboradores_Service.Ingresar_Colaborador().acceso({acceso:obj,info_servidor:'', ip_cliente:'192.168.0.1', macadress:'00:00:00:00:00'}).$promise.then(function(data) {
		        	$mdDialog.cancel();
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
		            } if (data.respuesta == true) {
			            $localStorage.token = data.token;
			            $localStorage.datosE = data.datosE;
			            $localStorage.datosPersona = data.datosPersona;
			            //--------------------cargar imagen perfil-----------
			            mainService.Get_Img_Perfil().get().$promise.then(function(data) {
			            	$localStorage.imgPerfil = data.img;		                
			            },function(error){
			            	$localStorage.imgPerfil="images/users/avatar-001.jpg";
			            });
			            //--------------------cargar imagen Portada-----------
			            mainService.Get_Img_Portada().get().$promise.then(function(data) {
			            	$localStorage.imgPortada = data.img;
			            },function(error){
			            	$localStorage.imgPortada="images/samples/w1.jpg";
			            });
			            // -------------------------	 fin
			            //--------------------cargar imagen Logo-----------
			            mainService.Get_Img_Logo().get().$promise.then(function(data) {
			            	$localStorage.imgLogo = data.img;
			            },function(error){
			            	$localStorage.imgPortada="images/samples/x2.jpg";
			            });
			            // ----------------------------- fin -----------------------------------

			            // generacion acceso personalizado
			            menuService.Generar_Vista().get().$promise.then(function(data) {
					        $localStorage.menu = data;
					    });
			            //---------------------- verificar si existe datos de persona-----------
			            mainService.Get_Datos_Empresa().get().$promise.then(function(data) {
			                if (data.respuesta) {
			                    $location.path('/Seleccionar_Sucursal');
			                } else {
			                    $location.path('/Actualizar_Datos');
			                }
			            });
			        }
		        });
		    }
			$scope.cancel = function() {
		      $mdDialog.cancel();
		    };
		}
  		
  		// cargar provincias
  		mainService.item_provincias().get().$promise.then(function(data){
	        $scope.states = data.respuesta;
	    });
  		$scope.formdata = {ruc: ''}
  		$scope.rucdata = {telefono: '', telefono1:'', celular:'', provincia:'', correo:''};
  		// buscar servidor externo consulta
  		$scope.buscar_ruc = function() {
  			// $scope.elementview = false;
  			// $scope.elemennotview = true;
  			// $scope.elemennotviewimg = true;
	        mainService.buscar_informacion_ruc().get({ruc: $scope.formdata.ruc}).$promise.then(function(data){
	        	session_open_();
	            var x = data.respuesta;
	            if (x == false ) {
	                $mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.querySelector('#popupContainer')))
				        .clickOutsideToClose(true)
				        .title('Ya Existe!')
				        .textContent('Este numero de RUC ya se encuentra registrado.')
				        .ariaLabel('Alert Dialog Demo')
				        .ok('Entendido')
				    );
	                $scope.formdata = {ruc: ''}
	            }
	            if (x == 'false-sri' ) {
	                $mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.querySelector('#popupContainer')))
				        .clickOutsideToClose(true)
				        .title('Invalido!')
				        .textContent('Este numero de RUC no es valido.')
				        .ariaLabel('Alert Dialog Demo')
				        .ok('Entendido')
				    );
	            }
	            if (x != false && x != 'false-sri') {
	            	$scope.elemennotviewsession = false;
	                $scope.razon_social = x.razon_social;
	                $scope.nombre_comercial = x.nombre_comercial;
	                $scope.estado_contribuyente = x.estado_contribuyente;
	                $scope.clase_contribuyente = x.clase_contribuyente;
	                $scope.tipo_contribuyente = x.tipo_contribuyente;
	                $scope.obligado_llevar_contabilidad = x.obligado_llevar_contabilidad;
	                $scope.actividad_principal=x.actividad_economica;
	                $scope.rucdata = x;
	                $scope.elementview=true;
	                $scope.elemennotview=false;
	                $scope.elemennotviewimg=false;
	            }
	        });
	    }
	    // logeo ingreso app
  		$scope.ingresar = function() {
  			var ruc = $scope.email+'001'
  			colaboradores_Service.Get_Data_By_Ruc().get({ruc:ruc}).$promise.then(function(data){
  				if (data.respuesta) {
  					$location.path('/Colaboradores/'+$scope.email+'001');
  				}else{
  					$mdDialog.show(
			            $mdDialog.alert()
			            .parent(angular.element(document.querySelector('#dialogContainer')))
			            .clickOutsideToClose(true)
			            .title('LO SENTIMOS :(')
			            .textContent('NÚMERO DE RUC NO EXISTE')
			            .ok('ENTENDIDO')
			            .openFrom('#left')
			        );
  				}
  			});
	    }

	    // registro ruc en el sistema
	    $scope.registrar = function() {
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
	                $scope.formdata = {ruc: ''}
	               	$scope.rucdata = {telefono: '', telefono1:'', celular:'', provincia:'', correo:''};
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
				    $scope.rucdata = {telefono: '', telefono1:'', celular:'', provincia:'', correo:''};
	            }   
	        });
	    }
	   
  	});
	app.controller('activar_Ctrl', function ($scope, $routeParams, $mdDialog, mainService, $location) {
		mainService.activar_cuenta($routeParams).save().$promise.then(function(data){
	        if (data.respuesta == true) {
	        	$mdDialog.show(
		            $mdDialog.alert()
		            .parent(angular.element(document.querySelector('#dialogContainer')))
		            .clickOutsideToClose(true)
		            .title('Proceso realizado con exito')
		            .textContent('Su Usuario y Clave fueron enviados a su correo electrónico')
		            .ok('Entendido')
		            .openFrom('#left')
		        );
	        };
	        if (data.respuesta==false) {
	        	$mdDialog.show(
		            $mdDialog.alert()
		            .parent(angular.element(document.querySelector('#dialogContainer')))
		            .clickOutsideToClose(true)
		            .title('Lo sentimos >:(')
		            .textContent('Este proceso ya fue realizado')
		            .ok('Entendido')
		            .openFrom('#left')
		        );
		        $location.path('/Registro');
	        };
	        if (data.respuesta != true && data.respuesta != false) {
	        	$mdDialog.show(
		            $mdDialog.alert()
		            .parent(angular.element(document.querySelector('#dialogContainer')))
		            .clickOutsideToClose(true)
		            .title('Lo sentimos :(')
		            .textContent('Ninguna accion para este proceso')
		            .ok('Entendido')
		            .openFrom('#left')
		        );
	    	}
	    	$location.path('/Registro');
	    });
	});
