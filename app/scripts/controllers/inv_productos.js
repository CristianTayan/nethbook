'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:InvProductosCtrl
 * @description
 * # InvProductosCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
  	app.controller('inv_productosCtrl', function (menuService, $scope, $location) {
    	// ------------------------------------inicio generacion vista menu personalizacion------------------------------------
	        var data = menuService.Get_Vistas_Loged_User();
	        // console.log(data);
	        $scope.menu = data.respuesta[0].children[0].children[3];
	        $scope.go_menu=function(menu){
		        $location.path(menu.path);
		    }
  	});

  	app.controller('inv_productos_menuCtrl', function($scope, inventario_Service, $localStorage, $location) {
	    $scope.data_inv_tc_guardar = function() {
	        inventario_Service.Add_Tipo_Categoria().add($scope.data_inv_tc).$promise.then(function(data) {
	            // console.log(data);
	        });
	    }
	    $scope.info_sucursal = $localStorage.sucursal;
	});
	app.controller('inv_productos_categoriasCtrl', function($scope, $rootScope, inventario_Service, $localStorage, $mdDialog) {
  		// -----------------------------------------------PROCESO LLENADO TABLA-----------------------------------------------
			var bookmark;
			$scope.guardar_categorias = false;
			$scope.selected = [];
			$scope.query = {
			    filter: '',
			    num_registros: 5,
			    pagina_actual: 1,
			    limit: '10',
			    page_num: 1,
			    id: 2
			};
			//Tipos categorias
			function success_tipo_categorias(desserts) {
			    $scope.tipo_categorias = desserts.respuesta.data;
			}

			$scope.data_inv_tipo_categoria_get = function() {
			    inventario_Service.Get_Tipo_Categoria().get($scope.query, success_tipo_categorias).$promise;
			}
			$scope.data_inv_tipo_categoria_get();

			$rootScope.$on("actualizar_tabla_categoria", function() {
			    $scope.data_inv_categoria_get();
			});

			function success(desserts) {
			    $scope.total = desserts.respuesta.total;
			    $scope.categorias = desserts.data;
			}

			$scope.data_inv_categoria_get = function() {
			    inventario_Service.Get_Categoria().get($scope.query, success).$promise;
			}

			$rootScope.$on("actualizar_categoria", function() {
			    $scope.data_inv_categoria_get();
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
			    $scope.data_inv_categoria_get();
			});
		// -----------------------------------------------PROCESO EDITAR REGISTRO---------------------------------------------
			$scope.inv_categoria_dialog_editar = function(tipo_categoria) {
			    $mdDialog.show({
			        controller: DialogController_editar,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/categorias/update.html',
			        parent: angular.element(document.body),
			        targetEvent: event,
			        ariaLabel: 'Respuesta Registro',
			        clickOutsideToClose: false,
			        locals: {
			            obj: tipo_categoria,
			            select_tipo_categoria: $scope.tipo_categorias
			        }
			    });
			}

			function DialogController_editar($scope, $rootScope, inventario_Service, obj, select_tipo_categoria) {
			    var vm = $scope;
			    vm.selectCallback = selectCallback;
			    vm.selectPeople = select_tipo_categoria;
			    vm.selectModel = {
			        selectedPerson: obj.tipo_categoria,
			        selectedPeople: [vm.selectPeople[2], vm.selectPeople[4]],
			        selectedPeopleSections: []
			    };

			    function selectCallback(_newValue, _oldValue) {
			        LxNotificationService.notify('Change detected');
			    }

			    $scope.data_inv_categoria = obj;
			    $scope.data_inv_categoria_update = function() {
			        $scope.data_inv_categoria.tipo_categoria = vm.selectModel.selectedPerson.id;
			        return inventario_Service.Update_Categoria().actualizar($scope.data_inv_categoria).$promise.then(function(data) {
			            $rootScope.$emit("actualizar_tabla_categoria", {});
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
		// -----------------------------------------------CREAR PADRE---------------------------------------------------------
			$scope.comprimir = function(node) {
			    node.icon = (node.icon == "add_circle_outline") ? "remove_circle_outline" : "add_circle_outline";
			    view_cambiar(node.nodes);
			}

			function view_cambiar(nodes) {
			    for (var i = 0; i < nodes.length; i++) {
			        if (nodes[i].open == true) {
			            nodes[i].open = false;
			        } else nodes[i].open = true;

			        view_cambiar(nodes[i].nodes);
			    }
			}
		// -----------------------------------------------CREAR PADRE---------------------------------------------------------
			$scope.inv_categoria_padre_dialog_nuevo = function(event) {
			        $mdDialog.show({
			            controller: Controller_add_cat_padre,
			            templateUrl: 'views/app/finanzas/inventario/inv_productos/categorias/new_cat_padre.html',
			            parent: angular.element(document.body),
			            targetEvent: event,
			            ariaLabel: 'Respuesta Registro',
			            clickOutsideToClose: false
			        });
			    }
		//------------------------------------------------CREAR HIJO----------------------------------------------------------
			$scope.inv_categoria_hijo_dialog_nuevo = function(padre) {
			        $mdDialog.show({
			            controller: Controller_add_cat_hijo,
			            templateUrl: 'views/app/finanzas/inventario/inv_productos/categorias/new_cat_hijo.html',
			            parent: angular.element(document.body),
			            targetEvent: event,
			            ariaLabel: 'Respuesta Registro',
			            clickOutsideToClose: false,
			            locals: {
			                tipo_categoria: $scope.tipo_categorias,
			                padre: padre
			            }
			        });
			    }
		//------------------------------------------------CONTROLADOR PADRE --------------------------------------------------
			function Controller_add_cat_padre($scope, $mdToast) {
			    $scope.data_inv_categoria_guardar = function() {
			        $scope.data_inv_categoria.id_padre = 2;

			        inventario_Service.Add_Categoria_Padre().add($scope.data_inv_categoria).$promise.then(function(data) {
			            $rootScope.$emit("actualizar_tabla_categoria", {});
			            if (data.respuesta == true) {
			                $mdDialog.cancel();
			                $mdToast.show({
			                    hideDelay: 5000,
			                    position: 'bottom right',
			                    controller: 'notificacionCtrl',
			                    templateUrl: 'views/notificaciones/guardar.html'
			                });
			            }
			        }, function(error) {
			            $mdDialog.show(
			                $mdDialog.alert()
			                .parent(angular.element(document.querySelector('#popupContainer')))
			                .clickOutsideToClose(true)
			                .title('LO SENTIMOS :(')
			                .textContent('Intentelo Nuevamente')
			                .ariaLabel('Respuesta Registro')
			                .ok('Entendido')
			                .targetEvent()
			            );
			        });
			    }
			    $scope.cancel = function() {
			        $mdDialog.hide();
			    };
			}
		//------------------------------------------------CONTROLADOR HIJO ---------------------------------------------------
			function Controller_add_cat_hijo($scope, tipo_categoria, padre, $mdToast) {

			    var vm = $scope;
			    vm.lista_tipos_categorias = tipo_categoria;
			    vm.ModelTipo_Cat = {
			        selectedTipo_Cat: vm.lista_tipos_categorias[0]
			    }

			    // Nuevo registro 
			    $scope.data_inv_categoria_guardar = function() {
			        $scope.data_inv_categoria.id_padre = padre.id;
			        $scope.data_inv_categoria.tipo_categoria = vm.ModelTipo_Cat.selectedTipo_Cat.id;

			        inventario_Service.Add_Categoria_Hijo().add($scope.data_inv_categoria).$promise.then(function(data) {
			            $rootScope.$emit("actualizar_tabla_categoria", {});
			            if (data.respuesta == true) {
			                $mdDialog.cancel();
			                $mdToast.show({
			                    hideDelay: 5000,
			                    position: 'bottom right',
			                    controller: 'notificacionCtrl',
			                    templateUrl: 'views/notificaciones/guardar.html'
			                });
			            }
			        }, function(error) {
			            $mdDialog.show(
			                $mdDialog.alert()
			                .parent(angular.element(document.querySelector('#popupContainer')))
			                .clickOutsideToClose(true)
			                .title('LO SENTIMOS :(')
			                .textContent('Intentelo Nuevamente')
			                .ariaLabel('Respuesta Registro')
			                .ok('Entendido')
			                .targetEvent()
			            );
			        });
			    }
			    $scope.cancel = function() {
			        $mdDialog.hide();
			    };

			}
		//------------------------------------------------PROCESO ELIMINAR ---------------------------------------------------
			$scope.inv_categoria_dialog_eliminar = function(categoria) {
			    $mdDialog.show({
			        controller: Dialog_eliminar_Ctrl,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/categorias/eliminar.html',
			        parent: angular.element(document.body),
			        targetEvent: event,
			        ariaLabel: 'Respuesta Registro',
			        clickOutsideToClose: false,
			        locals: {
			            obj: categoria
			        }
			    });
			}

			function Dialog_eliminar_Ctrl($scope, $rootScope, obj) {

			    $scope.tipo_eliminar = (obj.estado == 'I') ? 'ACTIVAR' : 'DESACTIVAR';

			    $scope.data_inv_categoria_eliminar = function() {
			        inventario_Service.Delete_Categoria().delete({
			            id: obj.id,
			            estado: obj.estado
			        }).$promise.then(function(data) {
			            if (data.respuesta == true) {
			                $rootScope.$emit("actualizar_categoria", {});
			                $mdDialog.hide();
			            }
			        });
			    }
			    $scope.cancel = function() {
			        $rootScope.$emit("actualizar_tabla_categoria", {});
			        $mdDialog.cancel();
			    };
			}

			$scope.toggle = function(node) {
			    // console.log(node);
			};
	});
	app.controller('inv_productos_tipo_categoriasCtrl', function($scope, $rootScope, inventario_Service, $localStorage, $mdDialog, $location) {
		// ------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
			$scope.inv_tc_dialog_nuevo = function(event) {
			    $mdDialog.show({
			        controller: DialogController_nuevo,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_categorias/new.html',
			        parent: angular.element(document.body),
			        targetEvent: event,
			        ariaLabel: 'Respuesta Registro',
			        clickOutsideToClose: false
			    });
			}

			function DialogController_nuevo($scope, $mdToast) {
			    // Nuevo registro tipo inventario
			    $scope.data_inv_tc_save = function() {
			        inventario_Service.Add_Tipo_Categoria().add($scope.data_inv_tc).$promise.then(function(data) {
			            $rootScope.$emit("actualizar_tabla_tipo_categoria", {});
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
			}
		// ------------------------------------------------------PROCESO ACTUALIZAR REGISTR--------------------------------------------------------
			$scope.inv_tc_dialog_editar = function(categoria) {
			    $mdDialog.show({
			        controller: DialogController_editar,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_categorias/update.html',
			        parent: angular.element(document.body),
			        targetEvent: event,
			        ariaLabel: 'Respuesta Registro',
			        clickOutsideToClose: false,
			        locals: {
			            obj: categoria
			        }
			    });
			}

			function DialogController_editar($scope, $rootScope, inventario_Service, obj) {
			    $scope.data_inv_tc = obj;
			    $scope.data_inv_tc_update = function() {
			        inventario_Service.Update_Tipo_Categorias().actualizar($scope.data_inv_tc).$promise.then(function(data) {
			            $rootScope.$emit("actualizar_tabla_tipo_categoria", {});
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
		// ------------------------------------------------------PROCESO ELIMINAR RESGISTRO--------------------------------------------------------
			$scope.inv_tc_dialog_eliminar = function(tipocategoria) {
			    $mdDialog.show({
			        controller: Dialog_eliminar_Ctrl,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_categorias/eliminar.html',
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
			    $scope.data_inv_tc_eliminar = function() {
			        inventario_Service.Delete_Tipo_Categoria().delete({
			            id: obj.id
			        }).$promise.then(function(data) {
			            if (data.respuesta == true) {
			                $rootScope.$emit("actualizar_tabla_tipo_categoria", {});
			                $mdDialog.hide();
			            }
			        });
			    }
			    $scope.cancel = function() {
			        $mdDialog.cancel();
			    };
			}
		// ------------------------------------------------------PROCESO LLENAR TABLA--------------------------------------------------------------
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
			    $scope.tipo_categorias = desserts.respuesta.data;
			}

			$scope.data_inv_tc_get = function() {
			    inventario_Service.Get_Tipo_Categoria().get($scope.query, success).$promise;
			}

			$rootScope.$on("actualizar_tabla_tipo_categoria", function() {
			    $scope.data_inv_tc_get();
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
			    $scope.data_inv_tc_get();
			});
	});
	app.controller('inv_productos_garantiaCtrl', function($scope, $rootScope, inventario_Service, $localStorage, $mdDialog) {
		// ---------------------------------------------------TIPO GARANTIA SELECT--------------------------------------------------------------
			function success_tipo_garantia(desserts) {
			    $scope.tipo_garantia = desserts.respuesta.data;
			}
			$scope.data_inv_tipo_garantia_get = function() {
			    inventario_Service.Get_Tipo_Garantia().get($scope.query, success_tipo_garantia).$promise;
			}
			$scope.data_inv_tipo_garantia_get();

			$scope.inv_garantia_dialog_nuevo = function(event) {
			    $scope.data_inv_tipo_garantia_get();
			    $mdDialog.show({
			        controller: DialogController_nuevo,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/garantia/new.html',
			        parent: angular.element(document.body),
			        targetEvent: event,
			        ariaLabel: 'Respuesta Registro',
			        clickOutsideToClose: false,
			        locals: {
			            select_tipo_garantia: $scope.tipo_garantia
			        }
			    });
			}

			function DialogController_nuevo($scope, select_tipo_garantia, $mdToast) {

			   	// -------------------------------------------------------tipo_garantia-------------------------------------------------------

			    var vm = $scope;
			    vm.selectCallback = selectCallback;
			    vm.selectPeople = select_tipo_garantia;
			    vm.selectModel = {
			        selectedPerson: undefined,
			        selectedPeople: [vm.selectPeople[2], vm.selectPeople[4]],
			        selectedPeopleSections: []
			    };

			    function selectCallback(_newValue, _oldValue) {
			        LxNotificationService.notify('Change detected');
			    }

			    // Nuevo registro tipo inventario
			    $scope.inv_garantia_nuevo = function() {
			        $scope.data_inv_garantia.tipo_garantia = vm.selectModel.selectedPerson.id;
			        inventario_Service.Add_Garantia().add($scope.data_inv_garantia).$promise.then(function(data) {
			            $rootScope.$emit("actualizar_tabla_garantia", {});
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
			                    .title('LO SENTIMOS 😞')
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
			                    .title('LO SENTIMOS 😞')
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
		// ---------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
			$scope.inv_garantia_dialog_editar = function(categoria) {
			    $mdDialog.show({
			        controller: DialogController_editar,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/garantia/update.html',
			        parent: angular.element(document.body),
			        targetEvent: event,
			        ariaLabel: 'Respuesta Registro',
			        clickOutsideToClose: false,
			        locals: {
			            obj: categoria,
			            select_tipo_garantia: $scope.tipo_garantia
			        }
			    });
			}

			function DialogController_editar($scope, $rootScope, inventario_Service, obj, select_tipo_garantia) {
			    var vm = $scope;
			    vm.selectCallback = selectCallback;
			    vm.selectPeople = select_tipo_garantia;
			    vm.selectModel = {
			        selectedPerson: obj.tipo_garantia,
			        selectedPeople: [vm.selectPeople[2], vm.selectPeople[4]],
			        selectedPeopleSections: []
			    };

			    function selectCallback(_newValue, _oldValue) {
			        LxNotificationService.notify('Change detected');
			    }

			    $scope.data_inv_garantia = obj;
			    $scope.data_inv_garantia_update = function() {
			        $scope.data_inv_garantia.tipo_garantia = vm.selectModel.selectedPerson.id;
			        inventario_Service.Update_Garantia().actualizar($scope.data_inv_garantia).$promise.then(function(data) {
			            $rootScope.$emit("actualizar_tabla_garantia", {});
			            if (data.respuesta == true) {
			                $mdDialog.show(
			                    $mdDialog.alert()
			                    .parent(angular.element(document.querySelector('#popupContainer')))
			                    .clickOutsideToClose(true)
			                    .title('EN HORA BUENA 🙂')
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
			                    .title('LO SENTIMOS 😞')
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
			                    .title('LO SENTIMOS 😞')
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
		// ---------------------------------------------------PROCESO ELIMINAR REGISTRO---------------------------------------------------------
			$scope.inv_garantia_dialog_eliminar = function(tipocategoria) {
			    $mdDialog.show({
			        controller: Dialog_eliminar_Ctrl,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/garantia/eliminar.html',
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
			    $scope.data_inv_garantia_eliminar = function() {
			        inventario_Service.Delete_Garantia().delete({
			            id: obj.id
			        }).$promise.then(function(data) {
			            if (data.respuesta == true) {
			                $rootScope.$emit("actualizar_tabla_garantia", {});
			                $mdDialog.cancel();
			            }
			        });
			    }
			    $scope.cancel = function() {
			        $mdDialog.cancel();
			    };
			}
		// ---------------------------------------------------PROCESO LLENAR TABLA--------------------------------------------------------------
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
			    $scope.garantia = desserts.respuesta.data;
			}

			$scope.data_inv_garantia_get = function() {
			    inventario_Service.Get_Garantia().get($scope.query, success).$promise;
			}

			$rootScope.$on("actualizar_tabla_garantia", function() {
			    $scope.data_inv_garantia_get();
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
			    $scope.data_inv_garantia_get();
			});
	});
	app.controller('inv_productos_ubicacionCtrl', function($scope, $rootScope, inventario_Service, $localStorage, $mdDialog) {
		// -------------------------------------------------------PROCESO CREAR REGISTRO--------------------------------------
			$scope.inv_ubicacion_dialog_nuevo = function(event) {
			    $mdDialog.show({
			        controller: DialogController_nuevo,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/ubicacion/new.html',
			        parent: angular.element(document.body),
			        targetEvent: event,
			        ariaLabel: 'Respuesta Registro',
			        clickOutsideToClose: false
			    });
			}

			function DialogController_nuevo($scope, $mdToast) {
			    // Nuevo registro tipo inventario
			    $scope.inv_ubicacion_nuevo = function() {
			        inventario_Service.Add_Ubicacion().add($scope.data_inv_ubicacion).$promise.then(function(data) {
			            $rootScope.$emit("actualizar_tabla_ubicacion", {});
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
			}
		// -------------------------------------------------------PROCESO EDITAR REGISTRO-------------------------------------
			$scope.inv_ubicacion_dialog_editar = function(categoria) {
			    $mdDialog.show({
			        controller: DialogController_editar,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/ubicacion/update.html',
			        parent: angular.element(document.body),
			        targetEvent: event,
			        ariaLabel: 'Respuesta Registro',
			        clickOutsideToClose: false,
			        locals: {
			            obj: categoria
			        }
			    });
			}

			function DialogController_editar($scope, $rootScope, inventario_Service, obj) {
			    $scope.data_inv_ubicacion = obj;
			    $scope.data_inv_ubicacion_update = function() {
			        inventario_Service.Update_Ubicacion().actualizar($scope.data_inv_ubicacion).$promise.then(function(data) {
			            $rootScope.$emit("actualizar_tabla_ubicacion", {});
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
		// -------------------------------------------------------PROCESO ELIMINAR REGISTRO-----------------------------------
			$scope.inv_ubicacion_dialog_eliminar = function(tipocategoria) {
			    $mdDialog.show({
			        controller: Dialog_eliminar_Ctrl,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/ubicacion/eliminar.html',
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
			    $scope.data_inv_ubicacion_eliminar = function() {
			        inventario_Service.Delete_Ubicacion().delete({
			            id: obj.id
			        }).$promise.then(function(data) {
			            if (data.respuesta == true) {
			                $rootScope.$emit("actualizar_tabla_ubicacion", {});
			                $mdDialog.cancel();
			            }
			        });
			    }
			    $scope.cancel = function() {
			        $mdDialog.cancel();
			    };
			}
		// -------------------------------------------------------PROCESO LLENAR TABLA----------------------------------------
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
			    $scope.ubicacion = desserts.respuesta.data;
			}

			$scope.data_inv_ubicacion_get = function() {
			    inventario_Service.Get_Ubicacion().get($scope.query, success).$promise;
			}

			$rootScope.$on("actualizar_tabla_ubicacion", function() {
			    $scope.data_inv_ubicacion_get();
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
			    $scope.data_inv_ubicacion_get();
			});
	});
	app.controller('inv_productos_modeloCtrl', function($scope, $rootScope, inventario_Service, $localStorage, $mdDialog) {
		// -------------------------------------------------------PROCESO CREAR REGISTRO--------------------------------------
			$scope.inv_modelo_dialog_nuevo = function(event) {
			    $mdDialog.show({
			        controller: DialogController_nuevo,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/modelos/new.html',
			        parent: angular.element(document.body),
			        targetEvent: event,
			        ariaLabel: 'Respuesta Registro',
			        clickOutsideToClose: false
			    });
			}

			function DialogController_nuevo($scope, $mdToast) {
			    // Nuevo registro
			    $scope.inv_modelo_nuevo = function() {
			        inventario_Service.Add_Modelo().add($scope.data_inv_modelo).$promise.then(function(data) {
			            $rootScope.$emit("actualizar_tabla_modelo", {});
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
			}
		// -------------------------------------------------------PROCESO EDITAR REGISTRO-------------------------------------
			$scope.inv_modelo_dialog_editar = function(categoria) {
			    $mdDialog.show({
			        controller: DialogController_editar,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/modelos/update.html',
			        parent: angular.element(document.body),
			        targetEvent: event,
			        ariaLabel: 'Respuesta Registro',
			        clickOutsideToClose: false,
			        locals: {
			            obj: categoria
			        }
			    });
			}

			function DialogController_editar($scope, $rootScope, inventario_Service, obj) {
			    $scope.data_inv_modelo = obj;
			    $scope.data_inv_modelo_update = function() {
			        inventario_Service.Update_Modelo().actualizar($scope.data_inv_modelo).$promise.then(function(data) {
			            $rootScope.$emit("actualizar_tabla_modelo", {});
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
		// -------------------------------------------------------PROCESO ELIMINAR REGISTRO-----------------------------------
			$scope.inv_modelo_dialog_eliminar = function(tipocategoria) {
			    $mdDialog.show({
			        controller: Dialog_eliminar_Ctrl,
			        templateUrl: 'views/app/finanzas/inventario/inv_productos/modelos/eliminar.html',
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
			    $scope.data_inv_modelo_eliminar = function() {
			        inventario_Service.Delete_Modelo().delete({
			            id: obj.id
			        }).$promise.then(function(data) {
			            if (data.respuesta == true) {
			                $rootScope.$emit("actualizar_tabla_modelo", {});
			                $mdDialog.cancel();
			            }
			        });
			    }
			    $scope.cancel = function() {
			        $mdDialog.cancel();
			    };
			}
		// -------------------------------------------------------PROCESO LLENAR TABLA----------------------------------------
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
			    $scope.modelo = desserts.respuesta.data;
			}

			$scope.data_inv_modelo_get = function() {
			    inventario_Service.Get_Modelo().get($scope.query, success).$promise;
			}

			$rootScope.$on("actualizar_tabla_modelo", function() {
			    $scope.data_inv_modelo_get();
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
			    $scope.data_inv_modelo_get();
			});
	});
	app.controller('inv_productos_tipo_consumoCtrl', function($scope, $rootScope, inventario_Service, $localStorage, $mdDialog) {
		// -------------------------------------------------------PROCESO CREAR REGISTRO-----------------------------------------
		    $scope.inv_tipo_consumo_dialog_nuevo = function(event) {
		        $mdDialog.show({
		            controller: DialogController_nuevo,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_consumo/new.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false
		        })
		    }

		    function DialogController_nuevo($scope, $mdToast) {
		        // Nuevo registro tipo consumo
		        $scope.inv_tipo_consumo_nuevo = function() {
		            inventario_Service.Add_Tipo_Consumo().add($scope.data_inv_tipo_consumo).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_tipo_consumo", {});
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
		// -------------------------------------------------------PROCESO EDITAR REGISTRO----------------------------------------
		    $scope.inv_tipo_consumo_dialog_editar = function(categoria) {
		        $mdDialog.show({
		            controller: DialogController_editar,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_consumo/update.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                obj: categoria
		            }
		        });
		    }

		    function DialogController_editar($scope, $rootScope, inventario_Service, obj) {
		        $scope.data_inv_tipo_consumo = obj;
		        $scope.data_inv_tipo_consumo_update = function() {
		            inventario_Service.Update_Tipo_Consumo().actualizar($scope.data_inv_tipo_consumo).$promise.then(function(data) {
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
		// -------------------------------------------------------PROCESO ELIMINAR REGISTRO--------------------------------------
		    $scope.inv_tipo_consumo_dialog_eliminar = function(tipocategoria) {
		        $mdDialog.show({
		            controller: Dialog_eliminar_Ctrl,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_consumo/eliminar.html',
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
		            inventario_Service.Delete_Tipo_Consumo().delete({
		                id: obj.id
		            }).$promise.then(function(data) {
		                if (data.respuesta == true) {
		                    $rootScope.$emit("actualizar_tabla_tipo_consumo", {});
		                    $mdDialog.cancel();
		                }
		            });
		        }
		        $scope.cancel = function() {
		            $mdDialog.cancel();
		        };
		    }
		// -------------------------------------------------------PROCESO LLENAR TABLA-------------------------------------------
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
		        $scope.tipo_consumo = desserts.respuesta.data;
		    }

		    $scope.data_inv_tipo_consumo_get = function() {
		        inventario_Service.Get_Tipo_Consumo().get($scope.query, success).$promise;
		    }

		    $rootScope.$on("actualizar_tabla_tipo_consumo", function() {
		        $scope.data_inv_tipo_consumo_get();
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
		        $scope.data_inv_tipo_consumo_get();
		    });
	});
	app.controller('inv_productos_estado_descriptivoCtrl', function($scope, $rootScope, inventario_Service, $localStorage, $mdDialog) {
		// -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
		    $scope.customFullscreen = false;
		    $scope.inv_estado_descriptivo_nuevo = function(event) {
		        $mdDialog.show({
		            controller: DialogController_nuevo,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/estado_descriptivo/new.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            fullscreen: $scope.customFullscreen
		        });
		    }

		    function DialogController_nuevo($scope, $mdToast) {

		        // -------------------------------------------------------DIALOGO ESTADO ESTADO DESCRIPTIVO-------------------------------------------------------

		        // Nuevo registro tipo inventario
		        $scope.inv_estado_descriptivo_nuevo = function() {
		            inventario_Service.Add_Estado_Descriptivo().add($scope.data_inv_estado_descriptivo).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_estado_descriptivo", {});
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
		                        .title('LO SENTIMOS 😞')
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
		                        .title('LO SENTIMOS 😞')
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
		    $scope.inv_estado_descriptivo_editar = function(estadodescriptivo) {
		        $mdDialog.show({
		            controller: DialogController_editar,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/estado_descriptivo/update.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                obj: estadodescriptivo
		            }
		        });
		    }

		    function DialogController_editar($scope, $rootScope, inventario_Service, obj) {

		        $scope.data_inv_estado_descriptivo = obj;
		        $scope.data_inv_estado_descriptivo_update = function() {
		            inventario_Service.Update_Estado_Descriptivo().actualizar($scope.data_inv_estado_descriptivo).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_estado_descriptivo", {});
		                if (data.respuesta == true) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('EN HORA BUENA 🙂')
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
		                        .title('LO SENTIMOS 😞')
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
		                        .title('LO SENTIMOS 😞')
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

		    // -------------------------------------------------------PROCESO ELIMINAR REGISTRO---------------------------------------------------------
		    $scope.inv_estado_descriptivo_eliminar = function(estadodescriptivo) {
		        $mdDialog.show({
		            controller: Dialog_eliminar_Ctrl,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/estado_descriptivo/eliminar.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                obj: estadodescriptivo
		            }
		        });
		    }

		    function Dialog_eliminar_Ctrl($scope, $rootScope, obj) {
		        $scope.data_inv_estado_descriptivo_eliminar = function() {
		            inventario_Service.Delete_Estado_Descriptivo().delete({
		                id: obj.id
		            }).$promise.then(function(data) {
		                if (data.respuesta == true) {
		                    $rootScope.$emit("actualizar_tabla_estado_descriptivo", {});
		                    $mdDialog.cancel();
		                }
		            });
		        }
		        $scope.cancel = function() {
		            $mdDialog.cancel();
		        };
		    }

		    // ---------------------------------------------------------PROCESO LLENAR TABLA------------------------------------------------------------- 
		    $scope.selected = [];
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
		        $scope.estados_descriptivos = desserts.respuesta.data;
		    }

		    $scope.data_estado_descriptivo_get = function() {
		        inventario_Service.Get_Estado_Descriptivo().get($scope.query, success).$promise;
		    }

		    $rootScope.$on("actualizar_tabla_estado_descriptivo", function() {
		        $scope.data_estado_descriptivo_get();
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
		        $scope.data_estado_descriptivo_get();
		    });
	});
	app.controller('inv_productos_tipo_garantiaCtrl', function($scope, $rootScope, inventario_Service, $localStorage, $mdDialog) {
		// -------------------------------------------------------PROCESO CREAR REGISTRO-------------------------------------------
		    $scope.inv_tipo_garantia_dialog_nuevo = function(event) {
		        $mdDialog.show({
		            controller: DialogController_nuevo,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_garantia/new.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false
		        });
		    }

		    function DialogController_nuevo($scope, $mdToast) {
		        // Nuevo registro tipo inventario
		        $scope.inv_tipo_garantia_nuevo = function() {
		            inventario_Service.Add_Tipo_Garantia().add($scope.data_inv_tg).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_tipo_garantia", {});
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

		// -------------------------------------------------------PROCESO EDITAR REGISTRO------------------------------------------
		    $scope.inv_tipo_garantia_dialog_editar = function(categoria) {
		        $mdDialog.show({
		            controller: DialogController_editar,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_garantia/update.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                obj: categoria
		            }
		        });
		    }

		    function DialogController_editar($scope, $rootScope, inventario_Service, obj) {
		        $scope.data_inv_tipo_garantia = obj;
		        $scope.data_inv_tipo_garantia_update = function() {
		            inventario_Service.Update_Tipo_Garantia().actualizar($scope.data_inv_tipo_garantia).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_tipo_garantia", {});
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

		// -------------------------------------------------------PROCESO ELIMINAR REGISTRO----------------------------------------
		    $scope.inv_tipo_garantia_dialog_eliminar = function(tipocategoria) {
		        $mdDialog.show({
		            controller: Dialog_eliminar_Ctrl,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_garantia/eliminar.html',
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
		        $scope.data_inv_tipo_garantia_eliminar = function() {
		            inventario_Service.Delete_Tipo_Garantia().delete({
		                id: obj.id
		            }).$promise.then(function(data) {
		                if (data.respuesta == true) {
		                    $rootScope.$emit("actualizar_tabla_tipo_garantia", {});
		                    $mdDialog.cancel();
		                }
		            });
		        }
		        $scope.cancel = function() {
		            $mdDialog.cancel();
		        };
		    }

		// -------------------------------------------------------PROCESO LLENAR TABLA---------------------------------------------
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
		        $scope.tipo_garantia = desserts.respuesta.data;
		    }

		    $scope.data_inv_tipo_garantia_get = function() {
		        inventario_Service.Get_Tipo_Garantia().get($scope.query, success).$promise;
		    }

		    $rootScope.$on("actualizar_tabla_tipo_garantia", function() {
		        $scope.data_inv_tipo_garantia_get();
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
		        $scope.data_inv_tipo_garantia_get();
		    });
	});
	app.controller('inv_productos_productosCtrl', function($scope, $rootScope, $mdDialog, inventario_Service,Contabilidad_Service,Servicios_Modal_Servicios) {
	    // -------------------------------------------------------SELECT TIPO CATEGORIAS-----------------------------------------------------
		    function success_categorias(desserts) {
		        $scope.categorias = desserts.data;
		    }
		    $scope.data_inv_categoria_get = function() {
		        inventario_Service.Get_Categoria_Productos().get($scope.query, success_categorias).$promise;
		    }
		    $scope.data_inv_categoria_get();
		// -------------------------------------------------------SELECT ESTADO DESCRIPTIVO--------------------------------------------------
		    function success_estado_descriptivo(desserts) {
		        $scope.estado_descriptivo = desserts.respuesta.data;
		    }
		    $scope.data_inv_estado_descriptivo_get = function() {
		        inventario_Service.Get_Estado_Descriptivo().get($scope.query, success_estado_descriptivo).$promise;
		    }
		    $scope.data_inv_estado_descriptivo_get();
	    // -------------------------------------------------------SELECT GARANTIAS-----------------------------------------------------------
		    function success_garantias(desserts) {
		        $scope.garantias = desserts.respuesta.data;
		    }
		    $scope.data_inv_garantias_get = function() {
		        inventario_Service.Get_Garantia().get($scope.query, success_garantias).$promise;
		    }
		    $scope.data_inv_garantias_get();

	     // -------------------------------------------------------SELECT MARCAS------------------------------------------------------------
		    function success_marcas(desserts) {
		        $scope.marcas = desserts.respuesta.data;
		    }
		    $scope.data_inv_marcas_get = function() {
		        inventario_Service.Get_Marca().get($scope.query, success_marcas).$promise;
		    }
		    $scope.data_inv_marcas_get();
	    // -------------------------------------------------------SELECT MODELOS-------------------------------------------------------------
		    function success_modelos(desserts) {
		        $scope.modelos = desserts.respuesta.data;
		    }
		    $scope.data_inv_modelos_get = function() {
		        inventario_Service.Get_Modelo().get($scope.query, success_modelos).$promise;
		    }
		    $scope.data_inv_modelos_get();
	    // -------------------------------------------------------SELECT UBICACION-----------------------------------------------------------
		    function success_ubicaciones(desserts) {
		        $scope.ubicaciones = desserts.respuesta.data;
		    }
		    $scope.data_inv_ubicacion_get = function() {
		        inventario_Service.Get_Ubicacion().get($scope.query, success_ubicaciones).$promise;
		    }
		    $scope.data_inv_ubicacion_get();
	    // -------------------------------------------------------SELECT TIPO CONSUMO--------------------------------------------------------
		    function success_tipo_consumo(desserts) {
		        $scope.tipo_consumos = desserts.respuesta.data;
		    }
		    $scope.data_inv_tipo_consumo_get = function() {
		        inventario_Service.Get_Tipo_Consumo().get($scope.query, success_tipo_consumo).$promise;
		    }
		    $scope.data_inv_tipo_consumo_get();
	    // -------------------------------------------------------SELECT IMPUESTOS-----------------------------------------------------------

	        function success_impuestos(result){ 
	            $scope.impuestos=result.respuesta.data;
	        }

	        $scope.get_impuestos=function(){
	            Contabilidad_Service.Get_Impuestos().get({},success_impuestos).$promise;
	        }
	        
	        $scope.get_impuestos();
	    // -------------------------------------------------------PROCESO CREAR REGISTRO-----------------------------------------------------
		    $scope.customFullscreen = false;
		    $scope.inv_producto_dialog_nuevo = function(event) {
		        $mdDialog.show({
		            controller: DialogController_nuevo,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/productos/new.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            fullscreen: $scope.customFullscreen,
		            locals: {
		                select_tipo_categoria: $scope.categorias,
		                select_estado_descriptivo: $scope.estado_descriptivo,
		                select_garantias: $scope.garantias,
		                select_marcas: $scope.marcas,
		                select_modelos: $scope.modelos,
		                select_ubicaciones: $scope.ubicaciones,
		                select_tipo_consumos:$scope.tipo_consumos,
		                select_impuestos:$scope.impuestos
		            }
		        });
		    }

		    function DialogController_nuevo($scope, $localStorage, $mdExpansionPanel, select_impuestos,select_tipo_categoria,select_estado_descriptivo,select_garantias,select_marcas,select_modelos,select_ubicaciones,select_tipo_consumos, $mdToast,Servicios_Modal_Servicios) {
		        $mdExpansionPanel().waitFor('expansionPanelOne').then(function (instance) { instance.expand(); });
		        $scope.inf_sucursal = $localStorage.sucursal;
		        var vm = $scope;
		        //------------------------------------------------------ abrir modal remotamente------------------------------------------------------
		        var servicios_remotos=Servicios_Modal_Servicios;
		        $scope.abrir_modal=function(id_modal){
		            servicios_remotos.abrir_modal(id_modal);
		        }
		        $scope.$on('actualizar_select', function() {
		            
		            var index=0;

		            for (var i = 0; i < servicios_remotos.lista.length; i++) {
		                if (servicios_remotos.lista[i].nombre==servicios_remotos.registro_nuevo.nombre) {
		                    index=i;
		                    break;
		                }
		            }

		              switch(servicios_remotos.id_modal){
		                case "CAT":
		                    vm.categorias_list=servicios_remotos.lista;
		                    vm.categorias=servicios_remotos.lista;
		                    vm.selectModel.selectedPerson=[vm.categorias_list[index]];
		                break;
		                case'TIPOCONSUMO':
		                    vm.selectTipoConsumos=servicios_remotos.lista;
		                    vm.selectModelTipoConsumos.selectedTipoConsumo=vm.selectTipoConsumos[index];
		                break;
		                case'ESTADODESCRIP':
		                    vm.selectED=servicios_remotos.lista;
		                    vm.selectModelED.selectedED=vm.selectED[index]

		                break;
		                case'MARCA':
		                    vm.selectMarcas=servicios_remotos.lista;
		                    vm.selectModelMarcas.selectedMarca=vm.selectMarcas[index]

		                break;
		                case'MODELO':
		                    vm.selectModelos=servicios_remotos.lista;
		                    vm.selectModelModelos.selectedModelo=vm.selectModelos[index]

		                break;
		                case'UBICACION':
		                    vm.selectUbicaciones=servicios_remotos.lista;
		                    vm.selectModelUbicaciones.selectedUbicacion=vm.selectUbicaciones[index]

		                break;
		                case'GARANTIA':
		                    vm.selectGarantias=servicios_remotos.lista;
		                    vm.selectModelGarantia.selectedGarantia=vm.selectGarantias[index]

		                break;

		            }
		        });
		        // ------------------------------------------------------ INICIALIZACION CAMPOS ---------------------------------------------------------
		        $scope.data_inv_producto = {precio:0.00,costo: 0.00, cantidad:1}
		        $scope.data_inv_producto.categoria;

		        $scope.change_categoria=function(categoria){
		            $scope.data_inv_producto.categoria=categoria;
		            $scope.selected_cat=categoria.nombre;
		        }
		        
		        // ------------------------------------------------------ SELEC CATEGORIA ---------------------------------------------------------
		        vm.categorias=select_tipo_categoria;
		        vm.categorias_list=vm.categorias;

		        $scope.change_hijo=function(){
		            
		             if (vm.selectModel.selectedPerson.length==0) {
		                vm.categorias_list=vm.categorias;
		            }
		            if (vm.selectModel.selectedPerson.length>=1) {
		                var limit=vm.selectModel.selectedPerson.length;
		                vm.categorias_list=vm.selectModel.selectedPerson[limit-1].nodes;
		            }
		        }
		        
		        vm.selectModel = {
		            selectedPerson:[vm.categorias_list[0]]
		        };

		        // -------------------------------------------------------DIALOGO PRODUCTOS-------------------------------------------------------
		        // ------------------------------------------------------- AUTO COMPLETES --------------------------------------------------------
		        
		        vm.selectCallback = selectCallback;
		        vm.selectED = select_estado_descriptivo;
		        vm.selectGarantias = select_garantias;
		        vm.selectMarcas = select_marcas;
		        vm.selectModelos = select_modelos;
		        vm.selectUbicaciones = select_ubicaciones;
		        vm.selectTipoConsumos = select_tipo_consumos;
		        vm.selectImpuestos = select_impuestos;


		        vm.selectModelED = {
		            selectedED: vm.selectED[2]
		        };
		        vm.selectModelGarantia = {
		            selectedGarantia: vm.selectGarantias[0]
		        };

		        vm.selectModelMarcas = {
		            selectedMarca: vm.selectMarcas[0]
		        };
		        vm.selectModelModelos = {
		            selectedModelo: vm.selectModelos[0]
		        };
		        vm.selectModelUbicaciones = {
		            selectedUbicacion: vm.selectUbicaciones[0],
		            selectedUbicacionDefault: [vm.selectUbicaciones[0]]
		        };

		        vm.selectModelTipoConsumos = {
		            selectedTipoConsumo: vm.selectTipoConsumos[2]
		        };

		        vm.selectModelImpuestos = {
		            selectedImpuestos: [vm.selectImpuestos[2]]
		        };

		        function selectCallback(_newValue, _oldValue) {
		            LxNotificationService.notify('Change detected');
		        }


		        // Nuevo registro Producto
		        $scope.inv_producto_nuevo = function() {
		            $scope.data_inv_producto.categoria = vm.selectModel.selectedPerson;
		            $scope.data_inv_producto.estado_descriptivo = vm.selectModelED.selectedED.id;
		            $scope.data_inv_producto.garantia = vm.selectModelGarantia.selectedGarantia.id;
		            $scope.data_inv_producto.marca = vm.selectModelMarcas.selectedMarca.id;
		            $scope.data_inv_producto.modelo = vm.selectModelModelos.selectedModelo.id;
		            $scope.data_inv_producto.ubicacion = vm.selectModelUbicaciones.selectedUbicacion.id;
		            $scope.data_inv_producto.tipo_consumo = vm.selectModelTipoConsumos.selectedTipoConsumo.id;
		            $scope.data_inv_producto.impuestos=$scope.selectModelImpuestos.selectedImpuestos;
		                $scope.data_inv_producto.comprable=true;

		                $scope.data_inv_producto.vendible=false;
		            // console.log($scope.data_inv_producto);

		            inventario_Service.Add_Producto().add($scope.data_inv_producto).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_productos", {});
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
		                        .title('LO SENTIMOS 😞')
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
		                        .title('LO SENTIMOS 😞')
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
	    // -------------------------------------------------------PROCESO LLENAR TABLA-------------------------------------------------------
	    $scope.selected = [];
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
	        $scope.productos = desserts.respuesta.data;
	    }

	    $scope.data_inv_producto_get = function() {
	        inventario_Service.Get_Producto().get($scope.query, success).$promise;
	    }

	    $rootScope.$on("actualizar_tabla_productos", function() {
	        $scope.data_inv_producto_get();
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
	        $scope.data_inv_producto_get();
	    });
	});	
	app.controller('inv_productos_bodegasCtrl', function($scope, $rootScope, $mdDialog, inventario_Service,establecimientosService) {
		// -------------------------------------------------------GET SUCURSALES------------------------------------------------------------
		    function success_sucursales(data){
		        $scope.sucursales=data.respuesta.data;
		    }
		    establecimientosService.Get_Establecimientos().get({},success_sucursales).$promise;
		// -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
		    $scope.customFullscreen = false;
		    $scope.inv_bodega_dialog_nuevo = function(event) {
		        $mdDialog.show({
		            controller: DialogController_nuevo,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/bodega/new.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            fullscreen: $scope.customFullscreen,
		            locals:{obj:$scope.sucursales}
		        });
		    }

		    function DialogController_nuevo($scope,$localStorage,obj) {

		        // -------------------------------------------------------DIALOGO BODEGAS-------------------------------------------------------
		        $scope.procesando=false; // pone boton espera si no a retornado el resultado esperado
		        var vm=$scope;
		        vm.selectSucursales = obj;
		        vm.selectModelSucursal = {
		            selectedSucursal: undefined,
		            selectedSucursalDefault: [vm.selectSucursales[0]]
		        };
		        // Nuevo registro Bodega
		        $scope.data_inv_bodega_guardar = function() {
		            $scope.data_inv_bodega.id_sucursal=vm.selectModelSucursal.selectedSucursal.id;
		            $scope.procesando=true; // pone boton espera si no a retornado el resultado esperado
		            return inventario_Service.Add_Bodega().add($scope.data_inv_bodega).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_bodega", {});
		                $scope.procesando=false;
		                if (data.respuesta == true) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('EN HORA BUENA 🙂')
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
		                        .title('LO SENTIMOS 😞')
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
		                        .title('LO SENTIMOS 😞')
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
		    $scope.inv_bodega_dialog_editar = function(bodega) {
		        $mdDialog.show({
		            controller: DialogController_editar,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/bodega/update.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                obj: bodega
		            }
		        });
		    }

		    function DialogController_editar($scope, $rootScope, inventario_Service, obj) {

		        $scope.data_inv_bodega = obj;
		        $scope.data_inv_bodega_update = function() {
		            inventario_Service.Update_Bodega().actualizar($scope.data_inv_bodega).$promise.then(function(data) {
		                $rootScope.$emit("actualizar_tabla_bodega", {});
		                if (data.respuesta == true) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#popupContainer')))
		                        .clickOutsideToClose(true)
		                        .title('EN HORA BUENA 🙂')
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
		                        .title('LO SENTIMOS 😞')
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
		                        .title('LO SENTIMOS 😞')
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

		// -------------------------------------------------------PROCESO ELIMINAR REGISTRO---------------------------------------------------------
		    $scope.inv_bodega_dialog_eliminar = function(bodega) {
		        $mdDialog.show({
		            controller: Dialog_eliminar_Ctrl,
		            templateUrl: 'views/app/finanzas/inventario/inv_productos/bodega/eliminar.html',
		            parent: angular.element(document.body),
		            targetEvent: event,
		            ariaLabel: 'Respuesta Registro',
		            clickOutsideToClose: false,
		            locals: {
		                obj: bodega
		            }
		        });
		    }

		    function Dialog_eliminar_Ctrl($scope, $rootScope, obj) {
		        $scope.data_inv_bodega_eliminar = function() {
		            inventario_Service.Delete_Bodega().delete({
		                id: obj.id
		            }).$promise.then(function(data) {
		                if (data.respuesta == true) {
		                    $rootScope.$emit("actualizar_tabla_bodega", {});
		                    $mdDialog.cancel();
		                }
		            });
		        }
		        $scope.cancel = function() {
		            $mdDialog.cancel();
		        };
		    }

		// ---------------------------------------------------------PROCESO LLENAR TABLA------------------------------------------------------------- 
		    $scope.selected = [];
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
		        $scope.bodegas = desserts.respuesta.data;
		    }

		    $scope.data_bodega_get = function() {
		        inventario_Service.Get_Bodega().get($scope.query, success).$promise;
		    }

		    $rootScope.$on("actualizar_tabla_bodega", function() {
		        $scope.data_bodega_get();
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
		        $scope.data_bodega_get();
		    });
	});
	app.controller('inv_productos_marcasCtrl', function($scope, $rootScope, $mdDialog, inventario_Service, $mdToast) {
	    // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
	    $scope.inv_marca_dialog_nuevo = function(event) {
	        $mdDialog.show({
	            controller: DialogController_nuevo,
	            templateUrl: 'views/app/finanzas/inventario/inv_productos/marcas/new.html',
	            parent: angular.element(document.body),
	            targetEvent: event,
	            ariaLabel: 'Respuesta Registro',
	            clickOutsideToClose: false
	        });
	    }

	    function DialogController_nuevo($scope, $mdToast) {
	        // Nuevo registro tipo inventario
	        $scope.inv_marca_nuevo = function() {
	            inventario_Service.Add_Marca().add($scope.data_inv_marca).$promise.then(function(data) {
	                $rootScope.$emit("actualizar_tabla_marca", {});

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
	    }

	    // -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
	    $scope.inv_marca_dialog_editar = function(categoria) {
	        $mdDialog.show({
	            controller: DialogController_editar,
	            templateUrl: 'views/app/finanzas/inventario/inv_productos/marcas/update.html',
	            parent: angular.element(document.body),
	            targetEvent: event,
	            ariaLabel: 'Respuesta Registro',
	            clickOutsideToClose: false,
	            locals: {
	                obj: categoria
	            }
	        });
	    }

	    function DialogController_editar($scope, $rootScope, inventario_Service, obj) {
	        $scope.data_inv_marca = obj;
	        $scope.data_inv_marca_update = function() {
	            inventario_Service.Update_Marca().actualizar($scope.data_inv_marca).$promise.then(function(data) {
	                $rootScope.$emit("actualizar_tabla_marca", {});
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
	    $scope.inv_marca_dialog_eliminar = function(tipocategoria) {
	        $mdDialog.show({
	            controller: Dialog_eliminar_Ctrl,
	            templateUrl: 'views/app/finanzas/inventario/inv_productos/marcas/eliminar.html',
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
	        $scope.data_inv_marca_eliminar = function() {
	            inventario_Service.Delete_Marca().delete({
	                id: obj.id
	            }).$promise.then(function(data) {
	                if (data.respuesta == true) {
	                    $rootScope.$emit("actualizar_tabla_marca", {});
	                    $mdDialog.cancel();
	                }
	            });
	        }
	        $scope.cancel = function() {
	            $mdDialog.cancel();
	        };
	    }

	    // ---------------------------------------------------------PROCESO LLENAR TABLA------------------------------------------------------------- 
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
	        $scope.marca = desserts.respuesta.data;
	    }

	    $scope.data_inv_marca_get = function() {
	        inventario_Service.Get_Marca().get($scope.query, success).$promise;
	    }

	    $rootScope.$on("actualizar_tabla_marca", function() {
	        $scope.data_inv_marca_get();
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
	        $scope.data_inv_marca_get();
	    });
	});