'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:ColaboradoresCtrl
 * @description
 * # ColaboradoresCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
	app.controller('ColaboradoresCtrl', function () {
	    this.awesomeThings = [
	      'HTML5 Boilerplate',
	      'AngularJS',
	      'Karma'
	    ];
	});

	app.controller('col_usuario_Ctrl', function ($scope, colaboradores_Service, $rootScope, $mdDialog) {
        function selectCallback(_newValue, _oldValue) {
            LxNotificationService.notify('Change detected');
            console.log('Old value: ', _oldValue);
            console.log('New value: ', _newValue);
        }
		// -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------

			function success_vistas(data){
						$scope.vistas=data.respuesta;
						// console.log($scope.vistas);
					}
			colaboradores_Service.Get_Vistas().get({},success_vistas).$promise;

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
		                tipo_documento: $scope.tipo_documento,
		                vistas: $scope.vistas
		            }
		        })
		    }

		    function DialogController_nuevo($scope, tipo_usuario, tipo_documento,vistas) {
				// ------------------------ GENERACION DE VISTAS PRIVILEG---------------------------

					var stuff = vistas;
					$scope.stuff0 = stuff;//angular.copy(stuff);
					console.log(stuff);
					$scope.stuff1 = stuff;//angular.copy(stuff);
					$scope.stuff2 = stuff;//angular.copy(stuff);

					
		    	// ------------------------------SELECT TIPO DOCUMENTO------------------------------
			        var vm = $scope;
			        vm.selectCallback = selectCallback;
			        vm.selectDocument = tipo_documento;
			        vm.selectModelDocument = {
			            selectedPerson: undefined,
			            selectedPeople: [vm.selectDocument[2], vm.selectDocument[4]],
			            selectedPeopleSections: []
			        };

			        $scope.tipe_document = function(event){
			        	$scope.tipodocumento = vm.selectModelDocument.selectedPerson.nombre;
			        	// vm.selectCocument.selectedPerson.id
			        }


		    	// ---------------------------SELECT BUSQUEDA TIPO USUARIO---------------------------
				var vd = $scope;
		        vd.selectCallback = selectCallback;
		        vd.selectPeople = tipo_usuario;
		        vd.selectModel = {
		            selectedPerson: undefined,
		            selectedPeople: [vd.selectPeople[2], vd.selectPeople[4]],
		            selectedPeopleSections: []
		        };

		        // Nuevo registro tipo inventario
		        $scope.colaboradores_nuevo = function() {
		            colaboradores_Service.Add_col_usuario().add($scope.data_inv_tipo_consumo).$promise.then(function(data) {
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
		// -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
		    $scope.inv_tipo_consumo_dialog_editar = function(categoria) {
		        $mdDialog.show({
		            controller: DialogController_editar,
		            templateUrl: 'views/app/inventario/tipo_consumo/update.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                obj: categoria
		            }
		        });
		    }

		    function DialogController_editar($scope, $rootScope, colaboradores_Service, obj) {
		        $scope.data_inv_tipo_consumo = obj;
		        $scope.data_inv_tipo_consumo_update = function() {
		            colaboradores_Service.Update_Tipo_Consumo().actualizar($scope.data_inv_tipo_consumo).$promise.then(function(data) {
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
		    $scope.inv_tipo_consumo_dialog_eliminar = function(tipocategoria) {
		        $mdDialog.show({
		            controller: Dialog_eliminar_Ctrl,
		            templateUrl: 'views/app/inventario/tipo_consumo/eliminar.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                obj: tipocategoria
		            }
		        });
		    }

		    function Dialog_eliminar_Ctrl($scope, $rootScope, obj) {
		        $scope.data_inv_tipo_consumo_eliminar = function() {
		            colaboradores_Service.Delete_Tipo_Consumo().delete({
		                id: obj.id
		            }).$promise.then(function(data) {
		                if (data.respuesta == true) {
		                    $rootScope.$emit("actualizar_tabla_col_usuario", {});
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
		    //SELECT TIPO USUARIO
		    function success_tipo_usuario(desserts) {
		        $scope.tipo_usuario = desserts.respuesta.data;
		    }

		    $scope.data_tipo_usuario_get = function() {
		        colaboradores_Service.Get_Tipo_Usuario().get($scope.query, success_tipo_usuario).$promise;
		    }
		    $scope.data_tipo_usuario_get();


		    //SELECT TIPO DOCUMENTO
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
		        $scope.categorias = desserts.respuesta.data;
		    }

		    $scope.data_colaborado_get = function() {
		        colaboradores_Service.Get_Colaborador().get($scope.query, success).$promise;
		    }

		    $rootScope.$on("actualizar_categoria", function() {
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

	app.controller('col_tipo_usuario_Ctrl', function ($scope, colaboradores_Service, $rootScope, $mdDialog) {
		// -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
		    $scope.col_tipo_usuario_dialog_nuevo = function(event) {
		        $mdDialog.show({
		            controller: DialogController_nuevo,
		            templateUrl: 'views/app/colaboradores/tipo_usuario/new.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false
		        })
		    }

		    function DialogController_nuevo($scope) {
		        // Nuevo registro tipo inventario
		        $scope.col_tipo_usuario_nuevo = function() {
		            colaboradores_Service.Add_Tipo_Usuario().add($scope.data_col_tipo_usuario).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_tipo_usuario", {});
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
		                obj: categoria
		            }
		        });
		    }

		    function DialogController_editar($scope, $rootScope, colaboradores_Service, obj) {
		        $scope.data_inv_tipo_consumo = obj;
		        $scope.data_col_tipo_usuario_update = function() {
		            colaboradores_Service.Update_Tipo_Usuario().actualizar($scope.data_inv_tipo_consumo).$promise.then(function(data) {
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
