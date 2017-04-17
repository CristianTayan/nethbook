'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:ParametrizacionCtrl
 * @description
 * # ParametrizacionCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
  	app.controller('ParametrizacionCtrl', function () {
	    
	});
  	app.controller('param_impuestos_Ctrl', function ($scope, inventario_Service, establecimientosService, $rootScope, $mdDialog, parametrizacion, Contabilidad_Service) {
  	// -------------------------------------------------------GET AMBITO------------------------------------------------------------
	    function success_ambito_impuestos(data){
	        $scope.ambito_impuestos=data.respuesta;
	    }
	    parametrizacion.Get_Ambito_Impuestos().get({},success_ambito_impuestos).$promise;

	// -------------------------------------------------------GET TIPO IMPUESTO------------------------------------------------------------
	    function success_tipo_impuestos(data){
	        $scope.tipo_impuestos = data.respuesta;
	    }
	    parametrizacion.Get_Tipo_Impuestos().get({},success_tipo_impuestos).$promise;
    // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
	    $scope.customFullscreen = false;
	    $scope.param_impuesto_dialog_nuevo = function(event) {
	        $mdDialog.show({
	            controller: DialogController_nuevo,
	            templateUrl: 'views/app/parametrizacion/impuestos/new.html',
	            parent: angular.element(document.body),
	            targetEvent: event,
	            ariaLabel: 'Respuesta Registro',
	            clickOutsideToClose: false,
	            fullscreen: $scope.customFullscreen,
	            locals:{obj:{ambito: $scope.ambito_impuestos, tipo_impuesto : $scope.tipo_impuestos}}
	        });
	    }

	    function DialogController_nuevo($scope,$localStorage,obj,Contabilidad_Service, parametrizacion) {
	        //-------------------------------------------------------DIALOGO SELECT AMBITO IMPUESTO-------------------------------------------------------
		        var vm=$scope;
			        vm.selectAmbito = obj.ambito;
			        vm.selectModelAmbito_impuesto = {
			            selectedAmbito: undefined,
			            selectedAmbitoDefault: [vm.selectAmbito[0]]
			        };
	        //-------------------------------------------------------DIALOGO SELECT TIPO IMPUESTO-------------------------------------------------------
		        var vm=$scope;
			        vm.selectAmbito = obj.tipo_impuesto;
			        vm.selectModelTipo_impuesto = {
			            selectedTipo: undefined,
			            selectedTipoDefault: [vm.selectTipo[0]]
			        };
	        // ---------------------------------------------------Nuevo registro Bodega---------------------------------------------------
	        $scope.data_param_impuesto_guardar = function() {

	            $scope.data_param_impuesto.ambito = vm.selectModelAmbito.selectedAmbito.id;
	            parametrizacion.Add_Impuesto().add($scope.data_param_impuesto).$promise.then(function(data) {
	                $rootScope.$emit("actualizar_tabla_ambito_impuesto", {});
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
	    // $scope.inv_bodega_dialog_editar = function(bodega) {
	    //     $mdDialog.show({
	    //         controller: DialogController_editar,
	    //         templateUrl: 'views/app/inventario/bodega/update.html',
	    //         parent: angular.element(document.body),
	    //         targetEvent: event,
	    //         ariaLabel: 'Respuesta Registro',
	    //         clickOutsideToClose: false,
	    //         locals: {
	    //             obj: bodega
	    //         }
	    //     });
	    // }

	    function DialogController_editar($scope, $rootScope, inventario_Service, obj) {

	        $scope.data_param_impuesto = obj;
	        $scope.data_param_impuesto_update = function() {
	            inventario_Service.Update_Bodega().actualizar($scope.data_param_impuesto).$promise.then(function(data) {
	                $rootScope.$emit("actualizar_tabla_ambito_impuesto", {});
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
	    // $scope.inv_bodega_dialog_eliminar = function(bodega) {
	    //     $mdDialog.show({
	    //         controller: Dialog_eliminar_Ctrl,
	    //         templateUrl: 'views/app/inventario/bodega/eliminar.html',
	    //         parent: angular.element(document.body),
	    //         targetEvent: event,
	    //         ariaLabel: 'Respuesta Registro',
	    //         clickOutsideToClose: false,
	    //         locals: {
	    //             obj: bodega
	    //         }
	    //     });
	    // }

	    // function Dialog_eliminar_Ctrl($scope, $rootScope, obj) {
	    //     $scope.data_param_impuesto_eliminar = function() {
	    //         inventario_Service.Delete_Bodega().delete({
	    //             id: obj.id
	    //         }).$promise.then(function(data) {
	    //             if (data.respuesta == true) {
	    //                 $rootScope.$emit("actualizar_tabla_ambito_impuesto", {});
	    //                 $mdDialog.cancel();
	    //             }
	    //         });
	    //     }
	    //     $scope.cancel = function() {
	    //         $mdDialog.cancel();
	    //     };
	    // }

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

		    function success_impuestos(desserts) {
		        $scope.total = desserts.respuesta.total;
		        $scope.bodegas = desserts.respuesta.data;
		    }

		    $scope.data_param_ambito_impuesto_get = function() {
		        Contabilidad_Service.Get_Impuestos().get({},success_impuestos).$promise;
		    }

		    $rootScope.$on("actualizar_tabla_ambito_impuesto", function() {
		        $scope.data_param_ambito_impuesto_get();
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
		        $scope.data_param_ambito_impuesto_get();
		    });
	});