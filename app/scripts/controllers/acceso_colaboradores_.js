'use strict';
var app = angular.module('nextbook20App')
  	app.controller('acceso_colaboradores_Ctrl', function ($scope, $rootScope,$location, $routeParams,$mdDialog, mainService, colaboradores_Service,consumirService, $localStorage, menuService) {
  		function success_data_ruc(data){
  			$scope.datosE=data.respuesta;
  		}
  		colaboradores_Service.Get_Data_By_Ruc().get({ruc:$routeParams.ruc},success_data_ruc).$promise;
  		var listcolor = ['#F34235','#E81D62','#3E50B4', '#2095F2','#4BAE4F', '#8AC249'];
  		var random = Math.floor(Math.random()*(5 - 0 + 1)) + 0;
  		$scope.color = listcolor[random];
  		var contadorIngreso = 0;
	    // LOGUEO INGRESO
  		$scope.ingresar_colaborador = function() {
  		//inicializa varibles del mapa
       $localStorage.lat = 0.3422316189213578; 
       $localStorage.log = -78.12643224518979;
      //proceso de acceso
			$scope.data_ingreso_colaborador.ruc=$routeParams.ruc;
			var obj = $scope.data_ingreso_colaborador;
	        colaboradores_Service.Ingresar_Colaborador().acceso({acceso:obj,info_servidor:'', ip_cliente:'192.168.0.1', macadress:'00:00:00:00:00'}).$promise.then(function(data) {
	        	if (data.respuesta === false && contadorIngreso <= 3) {
	            	$mdDialog.show(
			            $mdDialog.alert()
			            .parent(angular.element(document.querySelector('#dialogContainer')))
			            .clickOutsideToClose(true)
			            .title('Lo sentimos :(')
			            .textContent('Usuario o password incorrecto, vuelva a intentar')
			            .ok('Entendido')
			            .openFrom('#left')
			        );
	            contadorIngreso++;
	            } if (data.respuesta == true) {
                $rootScope.sessionStatus = true;
	            }
						if (data.respuesta === false && contadorIngreso > 3) {	
								var obje1 = {'ruc' : null , 'nick': null, 'correo': null, 'ci' : null};
		        			var confirm = $mdDialog.prompt()
							      .title('¿Recuperar Clave/password de acceso?')
							      .textContent('Ingrese su Nick o Correo electronico')
							      .placeholder('Nick ó E-mail')				
							      // .initialValue('Nick ó ejemplo@nethbook.com')							    
							      .required(true)
							      .ok('RECUPERAR')
							      .cancel('CANCELAR');
							    	$mdDialog.show(confirm).then(function(result) {
							    	if (result.indexOf("@") > 0) 
							    	{
							    		obje1.correo = result;
							    		obje1.nick = -1;
						    			obje1.ruc = $routeParams.ruc;				    			            			
							    	}
							    	if (result.indexOf("@") < 0) {
							    		obje1.nick = result;
							    		obje1.correo = -1;
							    		obje1.ruc = $routeParams.ruc;
							    	}
							    	mainService.recuperaClave().get(obje1).$promise.then(function(data){
						        	if (data.respuesta) {
							    		$mdDialog.show(
								         $mdDialog.alert()
							            .parent(angular.element(document.querySelector('#dialogContainer')))
							            .clickOutsideToClose(true)
							            .title('Envio de Credenciales')
							            .textContent('Revice el Correo Electronico Propietario de su Cueunta')
							            .ok('Entendido')
							            .openFrom('#left')
								        );				        		
						        	}
						        	if (!data.respuesta) {
						        		$mdDialog.show(
								         $mdDialog.alert()
							            .parent(angular.element(document.querySelector('#dialogContainer')))
							            .clickOutsideToClose(true)
							            .title('Envio de Credenciales')
							            .textContent('Las Credenciales ingresadas no son Validas')
							            .ok('Entendido')
							            .openFrom('#left')
								        );
						        	}
						        });					    	
							    }, function() {								    	
									    $location.path('/Registro');
							    });				            
		        		}
	             if (data.respuesta == true) {
		            $localStorage.token = data.token;
		            $localStorage.datosE = data.datosE;
		            $localStorage.datosPersona = data.datosPersona;
		            //datos para control de session
		            $localStorage.hsesion={hora_fin:new Date(data.hora_fin).getTime() / 1000,estado_token:1};			     
	                //fin
		            // ----------------------------- fin -----------------------------------
		            //---------------------- verificar si existe datos de persona-----------
		            mainService.Get_Datos_Empresa().get().$promise.then(function(data) {
		                if (data.respuesta) {
		                	//iniciar sesion
		                	$rootScope.$emit('start_session',{});
		                    $location.path('/Seleccionar_Sucursal');
		                } else {
		                    $location.path('/Actualizar_Datos');
		                }
		            });
		            // generacion acceso personalizado
		            menuService.Generar_Vista().get().$promise.then(function(data) {
				        $localStorage.menu = data.respuesta;
				    });

		            if (!$localStorage.cook_session_init) {
		            	var obj  =	[{
					    		'id_empresa': $localStorage.datosE.id,
					    		'ruc_empresa': $routeParams.ruc,
					    		'razon_social': $localStorage.datosE.razon_social,
					    		'datos_usuario': $localStorage.datosPersona.primer_nombre+' '+$localStorage.datosPersona.primer_apellido,
					    		'nick': $scope.data_ingreso_colaborador.nick
							}]
		            	$localStorage.cook_session_init = obj;
		            }else{
		            	obj  =	{
						    		'id_empresa': $localStorage.datosE.id,
						    		'ruc_empresa': $routeParams.ruc,
						    		'razon_social': $localStorage.datosE.razon_social,
						    		'datos_usuario': $localStorage.datosPersona.primer_nombre+' '+$localStorage.datosPersona.primer_apellido,
						    		'nick': $scope.data_ingreso_colaborador.nick
								}
		            	var acumulador = $localStorage.cook_session_init;				            		
		            		var resultado = buscar_existencia(acumulador, obj);
		            		if (!resultado) {
		            			acumulador.push(obj);
		            			$localStorage.cook_session_init = acumulador;
		            		}
		            }
		        }
	        });
	    }
	    function buscar_existencia(acumulador, obj){
    		for (var i = 0; i < acumulador.length; i++) {
    			if ( acumulador[i].ruc_empresa == obj.ruc_empresa && acumulador[i].nick == obj.nick) 
    				return true;
    		}
    	}
  	});
