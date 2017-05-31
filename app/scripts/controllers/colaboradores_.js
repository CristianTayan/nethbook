'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:ColaboradoresCtrl
 * @description
 * # ColaboradoresCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
	app.controller('colaboradores_Ctrl', function ($scope, menuService) {
  		// ------------------------------------inicio generacion vista menu personalizacion------------------------------------
	      	var data = menuService.Get_Vistas_Loged_User();
	      	$scope.menu = data.respuesta[0].children[0].children[0];
	    // --------------------------------------fin generacion vista menu personalizacion-------------------------------------
	});

	app.controller('col_usuario_Ctrl', function ($scope, colaboradores_Service, $rootScope, $mdDialog) {
        function selectCallback(_newValue, _oldValue) {
            LxNotificationService.notify('Change detected');
            console.log('Old value: ', _oldValue);
            console.log('New value: ', _newValue);
        }
		// -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------

		    $scope.colaboradores_dialog_nuevo = function(event) {
		        $mdDialog.show({
		            controller: DialogController_nuevo,
		            templateUrl: 'views/app/colaboradores/usuario/new.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            fullscreen: true,
		            locals: {
		                tipo_usuario: $scope.tipo_usuario,
		                //tipo_documento: $scope.tipo_documento,
		                //vistas: $scope.vistas,
		                ciudades: $scope.ciudades
		                //operadora: $scope.operadora
		            }
		        })
		    }

		    function DialogController_nuevo($scope, tipo_usuario,ciudades,$mdToast,mainService) {
				
		    	$scope.procesando=false; // pone boton espera si no a retornado el resultado esperado
					
		    	// ------------------------------SELECT TIPO DOCUMENTO------------------------------
			        // var vm = $scope;
			        // vm.selectCallback = selectCallback;
			        // vm.selectDocument = tipo_documento;
			        // vm.selectModelDocument = {
			        //     selectedPerson: undefined,
			        //     selectedPeople: [vm.selectDocument[2], vm.selectDocument[4]],
			        //     selectedPeopleSections: []
			        // };

			        // $scope.tipe_document = function(event){
			        // 	$scope.tipodocumento = vm.selectModelDocument.selectedPerson.nombre;
			        // 	// vm.selectCocument.selectedPerson.id
			        // }

			    // ------------------------------SELECT CIUDADES------------------------------
			        var cm = $scope;
			        cm.selectCallback = selectCallback;
			        cm.selectCiudades = ciudades;
			        cm.selectModelCiudad = {
			            selectedCiudades: undefined
			        };

			    // // ------------------------------SELECT OPERADORAS TELEFONICA------------------
			    //     var om = $scope;
			    //     om.selectCallback = selectCallback;
			    //     om.selectOperadora = operadora;
			    //     om.selectModelOperadora = {
			    //         selectedOperadora: undefined,
			    //         selectedPeople: [om.selectOperadora[2], om.selectOperadora[4]],
			    //         selectedPeopleSections: []
			    //     };

		    	// ---------------------------SELECT BUSQUEDA TIPO USUARIO---------------------
					var vd = $scope;
			        vd.selectCallback = selectCallback;
			        vd.selectPeople = tipo_usuario;
			        vd.selectModel = {
			            selectedPerson: undefined,
			            selectedPeople: [vd.selectPeople[2], vd.selectPeople[4]],
			            selectedPeopleSections: []
			        };

			    function success_buscar_colaborador(result){

                    if (result.respuesta==true) {
	                    if (result.data) {
	                    		$scope.data_usuario=result.data;
	                    		$scope.data_usuario.nombres_completos=result.data.primer_apellido+' '+result.data.segundo_apellido+' '+result.data.primer_nombre+' '+result.data.segundo_nombre;
	                    		$scope.data_usuario.nick=result.data.numero_documento;
	                    		for (var i = 0; i < ciudades.length; i++) {
	                    			if (ciudades[i].id==result.data.id_localidad||ciudades[i].nombre_bus==result.data.id_localidad) {
	                    				$scope.selectModelCiudad.selectedCiudades=ciudades[i];
	                    				break;
	                    			}
	                    		}
	                    }
                    }

                }
	            $scope.buscar_persona=function(){
	                if ($scope.data_usuario&&$scope.data_usuario.numero_documento) {
	                    if ($scope.data_usuario.numero_documento.length==10) {
	                        // if ($scope.data_usuario.numero_documento.length==10) {
	                            var datos={numero_documento:$scope.data_usuario.numero_documento,tipodocumento:'CEDULA'};
	                            $scope.tipo_cliente='P';
	                        // };
	                        // if ($scope.data_usuario.numero_documento.length==13) {
	                        //     var datos={nrodocumento:$scope.data_usuario.numero_documento,tipodocumento:'RUC'};
	                        //     $scope.tipo_cliente='E';
	                        // };
	                           colaboradores_Service.Existencia_Colaborador().get(datos,success_buscar_colaborador).$promise;
	                        }
	                }else{
	                    $scope.data_usuario={};
	                    cm.selectModelCiudad.selectedCiudades=undefined;
	                }
	            }

		        // Nuevo registro tipo inventario
		        $scope.col_usuario_nuevo = function() {
		        	$scope.data_usuario.id_localidad=cm.selectModelCiudad.selectedCiudades.id;
		        	$scope.procesando=true; 
		        	// pone boton espera si no a retornado el resultado esperado
		        	// $scope.data_usuario.id_tipo_documento=vm.selectModelDocument.selectedPerson.id;
		        	$scope.data_usuario.id_tipo_usuario=vd.selectModel.selectedPerson.id;
		        	// $scope.data_usuario.id_operadora_telefonica=om.selectModelOperadora.selectedOperadora.id;
		        	// el return evita el error de desvordamiento en el boton de espera
		            return colaboradores_Service.Add_Col_Usuario().add($scope.data_usuario).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_usuario", {});
		                $scope.procesando=false;
		                if (data.respuesta == true) {
						        $mdDialog.cancel();
				                    $mdToast.show({
				                      hideDelay   : 5000,
				                      position    : 'bottom right',
				                      controller  : 'notificacionCtrl',
				                      templateUrl : 'views/notificaciones/guardar.html'
				                    });
		                }
		                if (data.respuesta == false) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('LO SENTIMOS :(')
		                        .textContent('Intente mas tarde.')
		                        .ariaLabel('Respuesta Registro')
		                        .ok('Entendido')
		                        .targetEvent()
		                    );
		                }
		                if (data.respuesta == true && data.respuesta == false) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('LO SENTIMOS :(')
		                        .textContent('Proceso no permitido intente mas tarde.')
		                        .ariaLabel('Respuesta Registro')
		                        .ok('Entendido')
		                        .targetEvent()
		                    );
		                }
		            });
		        }
		        $scope.cancel = function() {
		            $mdDialog.cancel();
		        };
		    }
		// -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
		    $scope.usuarios_dialog_modificar = function(col_usuario) {
		        $mdDialog.show({
		            controller: DialogController_editar,
		            templateUrl: 'views/app/colaboradores/usuario/update.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		            	col_usuario:col_usuario,
		                tipo_usuario: $scope.tipo_usuario,
		                ciudades:$scope.ciudades
		            }
		        });
		    }

		    function DialogController_editar($scope, tipo_usuario,colaboradores_Service, col_usuario,ciudades) {				
		    	//$scope.data_usuario=col_usuario;
				
		    	function succes_data_usuario(data){
		    		$scope.data_usuario=data.respuesta;
		    		$scope.selected_ciudad=$scope.data_usuario.id_localidad;
		    		// ------------------------------SELECT CIUDADES------------------------------
			        var cm = $scope;
			        cm.selectCallback = selectCallback;
			        cm.selectCiudades = ciudades;
			        cm.selectModelCiudad = {
			            selectedCiudades: $scope.selected_ciudad,
			            selectedPeople: [cm.selectCiudades[2], cm.selectCiudades[4]],
			            selectedPeopleSections: []
			        };
		    	}

		    	$scope.Get_Data_Usuario=function(){
		    		colaboradores_Service.Get_Col_Usuario_Update().get({id:col_usuario.id},succes_data_usuario).$promise;
		    	}
		    	$scope.Get_Data_Usuario();
		    	for (var i = 0; i < tipo_usuario.length; i++) {
		    		if (tipo_usuario[i].id==col_usuario.id_tipo_usuario) {
		    			$scope.selected_tipo_user=tipo_usuario[i];
		    		}
		    	}
		    	// ---------------------------SELECT BUSQUEDA TIPO USUARIO---------------------
					var vd = $scope;
			        vd.selectCallback = selectCallback;
			        vd.selectPeople = tipo_usuario;
			        vd.selectModel = {
			            selectedPerson: $scope.selected_tipo_user,
			            selectedPeople: [vd.selectPeople[2], vd.selectPeople[4]],
			            selectedPeopleSections: []
			        };

			    

		        // Nuevo registro tipo inventario
		        $scope.col_usuario_nuevo = function() {
		        	$scope.data_usuario.id_tipo_usuario=vd.selectModel.selectedPerson.id;
		            colaboradores_Service.Update_Col_Usuario().actualizar($scope.data_usuario).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_usuario", {});
		                if (data.respuesta == true) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('EN HORA BUENA :)')
		                        .textContent('Su registro se a realizado con exito.')
		                        .ariaLabel('Respuesta Registro')
		                        .ok('Entendido')
		                        .targetEvent()
		                    );
		                }
		                if (data.respuesta == false) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('LO SENTIMOS :(')
		                        .textContent('Intente mas tarde.')
		                        .ariaLabel('Respuesta Registro')
		                        .ok('Entendido')
		                        .targetEvent()
		                    );
		                }
		                if (data.respuesta == true && data.respuesta == false) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('LO SENTIMOS :(')
		                        .textContent('Proceso no permitido intente mas tarde.')
		                        .ariaLabel('Respuesta Registro')
		                        .ok('Entendido')
		                        .targetEvent()
		                    );
		                }
		            });
		        }
		        $scope.cancel = function() {
		            $mdDialog.cancel();
		        };
		    }
		// --------------------------------------------------------PROCESO ELIMINAR REGISTRO--------------------------------------------------------
		    $scope.usuarios_dialog_eliminar = function(usuario) {
		        $mdDialog.show({
		            controller: Dialog_eliminar_Ctrl,
		            templateUrl: 'views/app/colaboradores/usuario/eliminar.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                obj: usuario
		            }
		        });
		    }

		    function Dialog_eliminar_Ctrl($scope, $rootScope, obj) {
		        $scope.data_usuario_eliminar = function() {
		            colaboradores_Service.Delete_Col_Usuario().delete({
		                id: obj.id
		            }).$promise.then(function(data) {
		                if (data.respuesta == true) {
		                    $rootScope.$emit("actualizar_tabla_usuario", {});
		                    $mdDialog.cancel();
		                }
		            });
		        }
		        $scope.cancel = function() {
		            $mdDialog.cancel();
		        };
		    }
		// -------------------------------------------------------------PROCESO LLENAR TABLA--------------------------------------------------------
		// ------------------------------------------------------------PROCESO LLENADO TABLA---------------------------------------------------------
		    var bookmark;
		    $scope.selected = [];
		    $scope.query = {
		        filter: '',
		        num_registros: 5,
		        pagina_actual: 1,
		        limit: '5',
		        page_num: 1
		    };
		    //----------SELECT TIPO USUARIO-----------------//
			    function success_tipo_usuario(desserts) {
			        $scope.tipo_usuario = desserts.respuesta.data;
			    }

			    $scope.data_tipo_usuario_get = function() {
			        colaboradores_Service.Get_Tipo_Usuario().get($scope.query, success_tipo_usuario).$promise;
			    }
			    $scope.data_tipo_usuario_get();

		    //----------------SELECT CIUDADES---------------//
			    function success_ciudades(desserts) {
			        $scope.ciudades = desserts.respuesta;
			    }

			    $scope.data_ciudades = function() {
			        colaboradores_Service.Get_Ciudades().get($scope.query, success_ciudades).$promise;
			    }
			    $scope.data_ciudades();
			//----------------SELECT OPERADORA TELEFONICA---//
			    function success_operadora(desserts) {
			        $scope.operadora = desserts.respuesta;
			    }

			    $scope.data_operadoras = function() {
			        colaboradores_Service.Get_Operadoras().get($scope.query, success_operadora).$promise;
			    }
			    $scope.data_operadoras();
		    //----------SELECT TIPO DOCUMENTO-----------------//
			    function success_tipo_documento(desserts) {
			        $scope.tipo_documento = desserts.respuesta;
			    }

			    $scope.data_tipo_documento_get = function() {
			        colaboradores_Service.Get_Tipo_Documento().get($scope.query, success_tipo_documento).$promise;
			    }
			    $scope.data_tipo_documento_get();


		    $rootScope.$on("actualizar_tabla_categoria", function() {
		        $scope.data_colaborado_get();
		    });

		    function success(desserts) {
		        $scope.total = desserts.respuesta.total;
		        $scope.usuarios = desserts.respuesta.data;
		    }

		    $scope.data_colaborado_get = function() {
		        colaboradores_Service.Get_Col_Usuario().get($scope.query, success).$promise;
		    }

		    $rootScope.$on("actualizar_tabla_usuario", function() {
		        $scope.data_colaborado_get();
		    });

		    $scope.removeFilter = function() {
		        $scope.filter.show = false;
		        $scope.query.filter = '';

		        if ($scope.filter.form.$dirty) {
		            $scope.filter.form.$setPristine();
		        }
		    };

		    $scope.$watch('query.filter', function(newValue, oldValue) {
		        if (!oldValue) {
		            bookmark = $scope.query.page;
		        }

		        if (newValue !== oldValue) {
		            $scope.query.page = 1;
		        }

		        if (!newValue) {
		            $scope.query.page = bookmark;
		        }
		        $scope.data_colaborado_get();
		    });
	});

	app.controller('notificacionCtrl', function($scope, $mdToast) {
		    $scope.closeToast = function() {

		        $mdToast
		            .hide()

		    };
		});

	app.controller('col_tipo_usuario_Ctrl', function ($scope, colaboradores_Service, $rootScope, $mdDialog) {
		// -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
		    $scope.col_tipo_usuario_dialog_nuevo = function(event) {
		        $mdDialog.show({
		            controller: DialogController_nuevo,
		            templateUrl: 'views/app/colaboradores/tipo_usuario/new.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                vistas: $scope.vistas,
		                combinacion_privilegios:$scope.combinacion_privilegios
		            }
		        })
		    }

			function success_vistas(data){
			$scope.vistas=data.menu;
			}
			colaboradores_Service.Get_Vistas().get({},success_vistas).$promise;

			function success_combinacion_privilegios(data){
			$scope.combinacion_privilegios=data.respuesta;
			}
			colaboradores_Service.Get_Combinacion_Privilegios().get({},success_combinacion_privilegios).$promise;

		    function DialogController_nuevo($scope,vistas,combinacion_privilegios, $mdDialog, $mdToast) {
		    	$scope.selected=[];
		    	$scope.procesando=false;
		    	// ------------------------ GENERACION DE VISTAS PRIVILEGIOS---------------------------
					$scope.stuff0 = vistas;//angular.copy(stuff);
					$scope.combinacion_privilegios = combinacion_privilegios;
		        // Nuevo registro tipo inventario
		        $scope.col_tipo_usuario_nuevo = function() {
		        	$scope.data_col_tipo_usuario.vistas = $scope.stuff0;
		        	$scope.procesando=true;
		            return colaboradores_Service.Add_Tipo_Usuario().add($scope.data_col_tipo_usuario).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_tipo_usuario", {});
		                $scope.procesando=false;
		                if (data.respuesta == true) {
		                    $mdDialog.cancel();
			                    $mdToast.show({
			                        hideDelay: 5000,
			                        position: 'bottom right',
			                        controller: 'notificacionCtrl',
			                        templateUrl: 'views/notificaciones/guardar.html'
			                    });
		                }
		                if (data.respuesta == false) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('LO SENTIMOS :(')
		                        .textContent('Intente mas tarde.')
		                        .ariaLabel('Respuesta Registro')
		                        .ok('Entendido')
		                        .targetEvent()
		                    );
		                }
		                if (data.respuesta == true && data.respuesta == false) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('LO SENTIMOS :(')
		                        .textContent('Proceso no permitido intente mas tarde.')
		                        .ariaLabel('Respuesta Registro')
		                        .ok('Entendido')
		                        .targetEvent()
		                    );
		                }
		            });
		        }
		        $scope.cancel = function() {
		            $mdDialog.cancel();
		        };

		        $scope.select_modulo = function(modulo) {
		        	$scope.modulo=modulo;
		        	for (var i = 0; i < $scope.combinacion_privilegios.length; i++) {
		        		if ($scope.combinacion_privilegios[i].id==$scope.modulo.permisos.id) {
		        			$scope.selected=[];
		        			$scope.selected.push($scope.combinacion_privilegios[i]);
		        			break;
		        		}
		        	}
		        };

		        $scope.select_permiso = function(permisos) {
		        	for (var i = 0; i < $scope.stuff0.length; i++) {
		        		//NIVEL 0
		        		if ($scope.stuff0[i].children.length>0) {
		        			//NIVEL 1
		        			for (var j = 0; j < $scope.stuff0[i].children.length; j++) {
		        				if ($scope.stuff0[i].children[j].id==$scope.modulo.id) {
		        					$scope.stuff0[i].children[j].permisos=permisos;
		        					break;
		        				}else{
		        					if ($scope.stuff0[i].children[j].children.length>0) {
		        						//NIVEL 2
		        						for (var k = 0; k < $scope.stuff0[i].children[j].children.length; k++) {
		        							if ($scope.stuff0[i].children[j].children[k].id==$scope.modulo.id) {
					        					$scope.stuff0[i].children[j].children[k].permisos=permisos;
					        					break;
					        				}else{
					        					if ($scope.stuff0[i].children[j].children[k].children.length>0) {
					        						//NIVEL 3
					        						for (var l = 0; l < $scope.stuff0[i].children[j].children[k].children.length; l++) {
					        							if ($scope.stuff0[i].children[j].children[k].children[l].id==$scope.modulo.id) {
															$scope.stuff0[i].children[j].children[k].children[l].permisos=permisos;
					        							}
					        						}
					        					}
					        				}
		        						}
		        					}
		        				}
		        			}
		        		}
		        	}
		        };


		    }
	    // -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------

		    $scope.col_tipo_usuario_dialog_editar = function(categoria) {

		        $mdDialog.show({
		            controller: DialogController_editar,
		            templateUrl: 'views/app/colaboradores/tipo_usuario/update.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                obj: categoria,
		                combinacion_privilegios:$scope.combinacion_privilegios
		            }
		        });
		    }

		    function DialogController_editar($scope, $rootScope, colaboradores_Service, obj,combinacion_privilegios) {
		        $scope.data_tipo_usuario = obj;
		        $scope.selected=[];
		        var vm=$scope;

		    	function success_vistas_By_Tipo_User(result){
					vm.vistas_tipo_user=result.respuesta;
				}
				colaboradores_Service.Get_Vistas_Tip_User_Update().get({id:obj.id},success_vistas_By_Tipo_User).$promise;

		    	// ------------------------ GENERACION DE VISTAS PRIVILEGIOS---------------------------
					$scope.combinacion_privilegios = combinacion_privilegios;
		        $scope.data_col_tipo_usuario_update = function() {
		        	$scope.data_tipo_usuario.vistas = $scope.vistas_tipo_user;
		            colaboradores_Service.Update_Tipo_Usuario().actualizar($scope.data_tipo_usuario).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_tipo_consumo", {});
		                if (data.respuesta == true) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('EN HORA BUENA :)')
		                        .textContent('Su registro se a realizado con exito.')
		                        .ariaLabel('Respuesta Registro')
		                        .ok('Entendido')
		                        .targetEvent()
		                    );
		                }
		                if (data.respuesta == false) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('LO SENTIMOS :(')
		                        .textContent('Intente mas tarde.')
		                        .ariaLabel('Respuesta Registro')
		                        .ok('Entendido')
		                        .targetEvent()
		                    );
		                }
		                if (data.respuesta == true && data.respuesta == false) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('LO SENTIMOS :(')
		                        .textContent('Proceso no permitido intente mas tarde.')
		                        .ariaLabel('Respuesta Registro')
		                        .ok('Entendido')
		                        .targetEvent()
		                    );
		                }
		            });
		        }
		        $scope.cancel = function() {
		            $mdDialog.cancel();
		        };
		        $scope.select_modulo = function(modulo) {
		        	$scope.modulo=modulo;
		        	for (var i = 0; i < $scope.combinacion_privilegios.length; i++) {
		        		if ($scope.combinacion_privilegios[i].id==$scope.modulo.permisos.id) {
		        			$scope.selected=[];
		        			$scope.selected.push($scope.combinacion_privilegios[i]);
		        			break;
		        		}
		        	}
		        };

		        $scope.select_permiso = function(permisos) {

		        	for (var i = 0; i < $scope.vistas_tipo_user.length; i++) {
		        		//NIVEL 0
		        		if ($scope.vistas_tipo_user[i].children.length>0) {
		        			//NIVEL 1
		        			for (var j = 0; j < $scope.vistas_tipo_user[i].children.length; j++) {
		        				if ($scope.vistas_tipo_user[i].children[j].id==$scope.modulo.id) {
		        					$scope.vistas_tipo_user[i].children[j].permisos=permisos;
		        					// console.log(permisos);
		        					break;
		        				}else{
		        					if ($scope.vistas_tipo_user[i].children[j].children.length>0) {
		        						//NIVEL 2
		        						for (var k = 0; k < $scope.vistas_tipo_user[i].children[j].children.length; k++) {
		        							if ($scope.vistas_tipo_user[i].children[j].children[k].id==$scope.modulo.id) {
					        					$scope.vistas_tipo_user[i].children[j].children[k].permisos=permisos;
					        					break;
					        				}else{
					        					if ($scope.vistas_tipo_user[i].children[j].children[k].children.length>0) {
					        						//NIVEL 3
					        						for (var l = 0; l < $scope.vistas_tipo_user[i].children[j].children[k].children.length; l++) {
					        							if ($scope.vistas_tipo_user[i].children[j].children[k].children[l].id==$scope.modulo.id) {
																$scope.vistas_tipo_user[i].children[j].children[k].children[l].permisos=permisos;
					        							}
					        						}
					        					}
					        				}
		        						}
		        					}
		        				}
		        			}
		        		}
		        	}
		        };

		    }
	    // --------------------------------------------------------PROCESO ELIMINAR REGISTRO--------------------------------------------------------
		    $scope.col_tipo_usuario_dialog_eliminar = function(tipo_usuario) {
		        $mdDialog.show({
		            controller: Dialog_eliminar_Ctrl,
		            templateUrl: 'views/app/colaboradores/tipo_usuario/eliminar.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                obj: tipo_usuario
		            }
		        });
		    }

		    function Dialog_eliminar_Ctrl($scope, $rootScope, obj) {
		        $scope.data_inv_tipo_consumo_eliminar = function() {
		            colaboradores_Service.Delete_Tipo_Usuario().delete({
		                id: obj.id
		            }).$promise.then(function(data) {
		                if (data.respuesta == true) {
		                    $rootScope.$emit("actualizar_tabla_tipo_usuario", {});
		                    $mdDialog.cancel();
		                }
		            });
		        }
		        $scope.cancel = function() {
		            $mdDialog.cancel();
		        };
		    }
	    // -------------------------------------------------------------PROCESO LLENAR TABLA--------------------------------------------------------- 
		    var bookmark;
		    $scope.selected = [];
		    $scope.query = {
		        filter: '',
		        num_registros: 5,
		        pagina_actual: 1,
		        limit: '5',
		        page_num: 1
		    };

		    function success(desserts) {
		        $scope.total = desserts.respuesta.total;
		        $scope.tipo_usuario = desserts.respuesta.data;
		    }

		    $scope.data_col_tipo_usuario_get = function() {
		        colaboradores_Service.Get_Tipo_Usuario().get($scope.query, success).$promise;
		    }

		    $rootScope.$on("actualizar_tabla_tipo_usuario", function() {
		        $scope.data_col_tipo_usuario_get();
		    });

		    $scope.removeFilter = function() {
		        $scope.filter.show = false;
		        $scope.query.filter = '';
		        if ($scope.filter.form.$dirty) {
		            $scope.filter.form.$setPristine();
		        }
		    };

		    $scope.$watch('query.filter', function(newValue, oldValue) {
		        if (!oldValue) {
		            bookmark = $scope.query.page;
		        }
		        if (newValue !== oldValue) {
		            $scope.query.page = 1;
		        }

		        if (!newValue) {
		            $scope.query.page = bookmark;
		        }
		        $scope.data_col_tipo_usuario_get();
		    });
	});
