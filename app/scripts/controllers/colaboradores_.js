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

		app.controller('col_nuevo_Ctrl', function ($scope, colaboradores_Service, $rootScope) {
			// -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
			    $scope.inv_tipo_consumo_dialog_nuevo = function(event) {
			        $mdDialog.show({
			            controller: DialogController_nuevo,
			            templateUrl: 'views/app/inventario/tipo_consumo/new.html',
			            parent: angular.element(document.body),
			            targetEvent: event,
			            ariaLabel: 'Respuesta Registro',
			            clickOutsideToClose: false
			        })
			    }

			    function DialogController_nuevo($scope) {
			        // Nuevo registro tipo inventario
			        $scope.inv_tipo_consumo_nuevo = function() {
			            colaboradores_Service.Add_col_usuario().add($scope.data_inv_tipo_consumo).$promise.then(function(data) {
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
			// -------------------------------------------------------------PROCESO LLENAR TABLA------------------------------------------------------------- 
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

			    $scope.data_col_usuario_get = function() {
			        colaboradores_Service.Get_Tipo_Consumo().get($scope.query, success).$promise;
			    }

			    $rootScope.$on("actualizar_tabla_col_usuario", function() {
			        $scope.data_col_usuario_get();
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
			        $scope.data_col_usuario_get();
			    });    
		});
