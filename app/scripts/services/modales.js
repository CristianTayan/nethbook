'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.inventario
 * @description
 * # inventario
 * Factory in the nextbook20App.
 */
var app=angular.module('nextbook20App');
//------------------------------------ SERVICIOS COMPARTIDOS DE INVENTARIO DE BIENES --------------------------------------
app.factory('Servicios_Modal_Bienes', function($rootScope,$mdDialog,inventario_Service) {
    var obj_serv_modal = {};
    var query = {
            filter: '',
            num_registros: 5,
            pagina_actual: 1,
            limit: '15',
            page_num: 1
        };
    
    obj_serv_modal.id_modal = '';
    obj_serv_modal.registro_nuevo = '';
    obj_serv_modal.lista = {};

    obj_serv_modal.abrir_modal = function(id_modal) {
        this.id_modal = id_modal;
        switch(id_modal){
            case "CAT":
                $mdDialog.show({
                    controller: Controller_add_cat_padre,
                    multiple:true,
                    templateUrl: 'views/app/finanzas/inventario_root/categoria/new_cat_padre.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    ariaLabel: 'Respuesta Registro',
                    clickOutsideToClose: false
                });
            break;
            case'TIPOCONSUMO':
                $mdDialog.show({
                    controller: DialogController_nuevo,
                    multiple:true,
                    templateUrl: 'views/app/finanzas/inventario_root/tipo_consumo/new.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    ariaLabel: 'Respuesta Registro',
                    clickOutsideToClose: false
                })
            break;
            case'ESTADODESCRIP':
                   $mdDialog.show({
                        controller: DialogController_nuevo,
                        multiple:true,
                        templateUrl: 'views/app/finanzas/inventario_root/estado_descriptivo/new.html',
                        parent: angular.element(document.body),
                        targetEvent: event,
                        ariaLabel: 'Respuesta Registro',
                        clickOutsideToClose: false,
                        fullscreen: true
                    });
            break;
            case'MARCA':

                $mdDialog.show({
                    controller: DialogController_nuevo,
                    multiple:true,
                    templateUrl: 'views/app/finanzas/inventario_root/marcas/new.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    ariaLabel: 'Respuesta Registro',
                    clickOutsideToClose: false
                });
            break;
            case'MODELO':

            $mdDialog.show({
                controller: DialogController_nuevo,
                multiple:true,
                templateUrl: 'views/app/finanzas/inventario_root/modelos/new.html',
                parent: angular.element(document.body),
                targetEvent: event,
                ariaLabel: 'Respuesta Registro',
                clickOutsideToClose: false
            });

            break;
            case'UBICACION':

            $mdDialog.show({
                controller: DialogController_nuevo,
                multiple:true,
                templateUrl: 'views/app/finanzas/inventario_root/ubicacion/new.html',
                parent: angular.element(document.body),
                targetEvent: event,
                ariaLabel: 'Respuesta Registro',
                clickOutsideToClose: false
            });

            break;
            case'GARANTIA':
                // var tipo_garantia;
                // ---------------------------------------------------tipo garantia select--------------------------------------------------------------
                obj_serv_modal.data_inv_tipo_garantia_get = function() {
                    inventario_Service.Get_Tipo_Garantia().get(query, success_tipo_garantia).$promise;
                }
                obj_serv_modal.data_inv_tipo_garantia_get();
            break;
        }
        
    };
    function success_tipo_garantia(desserts) {
        var tipo_garantia = desserts.respuesta.data;
        $mdDialog.show({
            controller: DialogController_nueva_garantia,
            multiple:true,
            templateUrl: 'views/app/finanzas/inventario_root/garantia/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false,
            locals: {
                select_tipo_garantia: tipo_garantia
            }
        });
    }

    //-----------------------------------------------------------------CONTROLADOR CATEGORIA PADRE //-----------------------------------------------------------------
       function Controller_add_cat_padre($scope,$mdToast,inventario_Service){
        //
        $scope.data_inv_categoria_guardar = function() {
            $scope.data_inv_categoria.id_padre=3;
            inventario_Service.Add_Categoria_Padre().add($scope.data_inv_categoria).$promise.then(function(data) {
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_categoria;
                    if (data.respuesta == true) {
                         $mdDialog.cancel();
                        $mdToast.show({
                          hideDelay   : 5000,
                          position    : 'bottom right',
                          controller  : 'notificacionCtrl',
                          templateUrl : 'views/notificaciones/guardar.html'
                        });
                    }
            },function(error){
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

        function DialogController_nuevo($scope, $mdToast) {
            // //----------------------------------------------------------------- Nuevo registro tipo consumo //-----------------------------------------------------------------
            $scope.inv_tipo_consumo_nuevo = function() {
                inventario_Service.Add_Tipo_Consumo().add($scope.data_inv_tipo_consumo).$promise.then(function(data) {
                    //$rootScope.$emit("actualizar_tabla_tipo_consumo", {});
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_tipo_consumo;
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

             // //----------------------------------------------------------------- Nuevo registro estado descriptivo
            $scope.inv_estado_descriptivo_nuevo = function() {
                inventario_Service.Add_Estado_Descriptivo().add($scope.data_inv_estado_descriptivo).$promise.then(function(data) {
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_estado_descriptivo;
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

            // //----------------------------------------------------------------- MARCAS
            $scope.inv_marca_nuevo = function() {
                inventario_Service.Add_Marca().add($scope.data_inv_marca).$promise.then(function(data) {
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_marca;

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

            // //----------------------------------------------------------------- MODELOS
            $scope.inv_modelo_nuevo = function() {
                inventario_Service.Add_Modelo().add($scope.data_inv_modelo).$promise.then(function(data) {
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_modelo;
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

            // //----------------------------------------------------------------- UBICACION
            $scope.inv_ubicacion_nuevo = function() {
                inventario_Service.Add_Ubicacion().add($scope.data_inv_ubicacion).$promise.then(function(data) {
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_ubicacion;
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


        function DialogController_nueva_garantia($scope, select_tipo_garantia, $mdToast) {

        // -------------------------------------------------------tipo_garantia-------------------------------------------------------
        console.log(select_tipo_garantia);
        var vm = $scope;
        vm.selectCallback = selectCallback;
        vm.selectPeople = select_tipo_garantia;
        vm.selectModel = {
            selectedPerson: undefined
        };

        function selectCallback(_newValue, _oldValue) {
            LxNotificationService.notify('Change detected');
        }

        // Nuevo registro tipo inventario
        $scope.inv_garantia_nuevo = function() {
            $scope.data_inv_garantia.tipo_garantia = vm.selectModel.selectedPerson.id;
            inventario_Service.Add_Garantia().add($scope.data_inv_garantia).$promise.then(function(data) {
                obj_serv_modal.actualizar_select();
                obj_serv_modal.registro_nuevo=$scope.data_inv_garantia;
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
        

        
        // ------------------------------------------------------- INICIO AUTO COMPLETES ---------------------------------------------------------------- 
                // -------------------------------------------------------SELECT TIPO CATEGORIAS------------------------------------------------------------
        function success_categorias(desserts) {
            obj_serv_modal.lista = desserts.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_categoria_get = function() {
            inventario_Service.Get_Categoria_Bienes().get(query, success_categorias).$promise;
        }
         // -------------------------------------------------------SELECT ESTADO DESCRIPTIVO------------------------------------------------------------
        function success_estado_descriptivo(desserts) {
            obj_serv_modal.lista = desserts.respuesta.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_estado_descriptivo_get = function() {
            inventario_Service.Get_Estado_Descriptivo().get(query, success_estado_descriptivo).$promise;
        }

        // -------------------------------------------------------SELECT GARANTIAS------------------------------------------------------------
        function success_garantias(desserts) {
            obj_serv_modal.lista = desserts.respuesta.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_garantias_get = function() {
            inventario_Service.Get_Garantia().get(query, success_garantias).$promise;
        }

        // -------------------------------------------------------SELECT MARCAS------------------------------------------------------------
        function success_marcas(desserts) {
             obj_serv_modal.lista = desserts.respuesta.data;
             $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_marcas_get = function() {
            inventario_Service.Get_Marca().get(query, success_marcas).$promise;
        }
        // -------------------------------------------------------SELECT MODELOS------------------------------------------------------------
        function success_modelos(desserts) {
            obj_serv_modal.lista = desserts.respuesta.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_modelos_get = function() {
            inventario_Service.Get_Modelo().get(query, success_modelos).$promise;
        }
        // -------------------------------------------------------SELECT UBICACION------------------------------------------------------------
        function success_ubicaciones(desserts) {
            obj_serv_modal.lista = desserts.respuesta.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_ubicacion_get = function() {
            inventario_Service.Get_Ubicacion().get(query, success_ubicaciones).$promise;
        }
        // -------------------------------------------------------SELECT TIPO CONSUMO------------------------------------------------------------
        function success_tipo_consumo(desserts) {
            obj_serv_modal.lista = desserts.respuesta.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_tipo_consumo_get = function() {
            inventario_Service.Get_Tipo_Consumo().get(query, success_tipo_consumo).$promise;
        }

     // ------------------------------------------------------- FIN SELECTS ----------------------------------------------------------------
               
    obj_serv_modal.actualizar_select = function() {
           switch(this.id_modal){
            case "CAT":
                obj_serv_modal.data_inv_categoria_get();
            break;
            case'TIPOCONSUMO':
                 obj_serv_modal.data_inv_tipo_consumo_get();   
            break;
            case'ESTADODESCRIP':
                obj_serv_modal.data_inv_estado_descriptivo_get();
            break;
            case'MARCA':
                obj_serv_modal.data_inv_marcas_get();
            break;
            case'MODELO':
                obj_serv_modal.data_inv_modelos_get();
            break;
            case'UBICACION':
                obj_serv_modal.data_inv_ubicacion_get();
            break;
            case'GARANTIA':
                obj_serv_modal.data_inv_garantias_get();
            break;

        }
    };

    return obj_serv_modal;
});

//------------------------------------ SERVICIOS COMPARTIDOS DE INVENTARIO DE BIENES --------------------------------------
app.factory('Servicios_Modal_Servicios', function($rootScope,$mdDialog,inventario_Service) {
    var obj_serv_modal = {};
    var query = {
            filter: '',
            num_registros: 5,
            pagina_actual: 1,
            limit: '15',
            page_num: 1
        };
    
    obj_serv_modal.id_modal = '';
    obj_serv_modal.registro_nuevo = '';
    obj_serv_modal.lista = {};

    obj_serv_modal.abrir_modal = function(id_modal) {
        this.id_modal = id_modal;
        switch(id_modal){
            case "CAT":
                $mdDialog.show({
                    controller: Controller_add_cat_padre,
                    multiple:true,
                    templateUrl: 'views/app/finanzas/inventario_root/categoria/new_cat_padre.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    ariaLabel: 'Respuesta Registro',
                    clickOutsideToClose: false
                });
            break;
            case'TIPOCONSUMO':
                $mdDialog.show({
                    controller: DialogController_nuevo,
                    multiple:true,
                    templateUrl: 'views/app/finanzas/inventario_root/tipo_consumo/new.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    ariaLabel: 'Respuesta Registro',
                    clickOutsideToClose: false
                })
            break;
            case'ESTADODESCRIP':
                   $mdDialog.show({
                        controller: DialogController_nuevo,
                        multiple:true,
                        templateUrl: 'views/app/finanzas/inventario_root/estado_descriptivo/new.html',
                        parent: angular.element(document.body),
                        targetEvent: event,
                        ariaLabel: 'Respuesta Registro',
                        clickOutsideToClose: false,
                        fullscreen: true
                    });
            break;
            case'MARCA':

                $mdDialog.show({
                    controller: DialogController_nuevo,
                    multiple:true,
                    templateUrl: 'views/app/finanzas/inventario_root/marcas/new.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    ariaLabel: 'Respuesta Registro',
                    clickOutsideToClose: false
                });
            break;
            case'MODELO':

            $mdDialog.show({
                controller: DialogController_nuevo,
                multiple:true,
                templateUrl: 'views/app/finanzas/inventario_root/modelos/new.html',
                parent: angular.element(document.body),
                targetEvent: event,
                ariaLabel: 'Respuesta Registro',
                clickOutsideToClose: false
            });

            break;
            case'UBICACION':

            $mdDialog.show({
                controller: DialogController_nuevo,
                multiple:true,
                templateUrl: 'views/app/finanzas/inventario_root/ubicacion/new.html',
                parent: angular.element(document.body),
                targetEvent: event,
                ariaLabel: 'Respuesta Registro',
                clickOutsideToClose: false
            });

            break;
            case'GARANTIA':
                // var tipo_garantia;
                // ---------------------------------------------------tipo garantia select--------------------------------------------------------------
                obj_serv_modal.data_inv_tipo_garantia_get = function() {
                    inventario_Service.Get_Tipo_Garantia().get(query, success_tipo_garantia).$promise;
                }
                obj_serv_modal.data_inv_tipo_garantia_get();
            break;
        }
    };
    function success_tipo_garantia(desserts) {
        var tipo_garantia = desserts.respuesta.data;
        $mdDialog.show({
            controller: DialogController_nueva_garantia,
            multiple:true,
            templateUrl: 'views/app/finanzas/inventario_root/garantia/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false,
            locals: {
                select_tipo_garantia: tipo_garantia
            }
        });
    }

    //-----------------------------------------------------------------CONTROLADOR CATEGORIA PADRE //-----------------------------------------------------------------
       function Controller_add_cat_padre($scope,$mdToast,inventario_Service){
        //
        $scope.data_inv_categoria_guardar = function() {
            $scope.data_inv_categoria.id_padre=2;
            inventario_Service.Add_Categoria_Padre().add($scope.data_inv_categoria).$promise.then(function(data) {
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_categoria;
                    if (data.respuesta == true) {
                         $mdDialog.cancel();
                        $mdToast.show({
                          hideDelay   : 5000,
                          position    : 'bottom right',
                          controller  : 'notificacionCtrl',
                          templateUrl : 'views/notificaciones/guardar.html'
                        });
                    }
            },function(error){
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

        function DialogController_nuevo($scope, $mdToast) {
            // //----------------------------------------------------------------- Nuevo registro tipo consumo //-----------------------------------------------------------------
            $scope.inv_tipo_consumo_nuevo = function() {
                inventario_Service.Add_Tipo_Consumo().add($scope.data_inv_tipo_consumo).$promise.then(function(data) {
                    //$rootScope.$emit("actualizar_tabla_tipo_consumo", {});
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_tipo_consumo;
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

             // //----------------------------------------------------------------- Nuevo registro estado descriptivo
            $scope.inv_estado_descriptivo_nuevo = function() {
                inventario_Service.Add_Estado_Descriptivo().add($scope.data_inv_estado_descriptivo).$promise.then(function(data) {
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_estado_descriptivo;
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

            // //----------------------------------------------------------------- MARCAS
            $scope.inv_marca_nuevo = function() {
                inventario_Service.Add_Marca().add($scope.data_inv_marca).$promise.then(function(data) {
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_marca;

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

            // //----------------------------------------------------------------- MODELOS
            $scope.inv_modelo_nuevo = function() {
                inventario_Service.Add_Modelo().add($scope.data_inv_modelo).$promise.then(function(data) {
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_modelo;
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

            // //----------------------------------------------------------------- UBICACION
            $scope.inv_ubicacion_nuevo = function() {
                inventario_Service.Add_Ubicacion().add($scope.data_inv_ubicacion).$promise.then(function(data) {
                    obj_serv_modal.actualizar_select();
                    obj_serv_modal.registro_nuevo=$scope.data_inv_ubicacion;
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


        function DialogController_nueva_garantia($scope, select_tipo_garantia, $mdToast) {

        // -------------------------------------------------------tipo_garantia-------------------------------------------------------
        console.log(select_tipo_garantia);
        var vm = $scope;
        vm.selectCallback = selectCallback;
        vm.selectPeople = select_tipo_garantia;
        vm.selectModel = {
            selectedPerson: undefined
        };

        function selectCallback(_newValue, _oldValue) {
            LxNotificationService.notify('Change detected');
        }

        // Nuevo registro tipo inventario
        $scope.inv_garantia_nuevo = function() {
            $scope.data_inv_garantia.tipo_garantia = vm.selectModel.selectedPerson.id;
            inventario_Service.Add_Garantia().add($scope.data_inv_garantia).$promise.then(function(data) {
                obj_serv_modal.actualizar_select();
                obj_serv_modal.registro_nuevo=$scope.data_inv_garantia;
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
        

        
        // ------------------------------------------------------- INICIO AUTO COMPLETES ---------------------------------------------------------------- 
                // -------------------------------------------------------SELECT TIPO CATEGORIAS------------------------------------------------------------
        function success_categorias(desserts) {
            obj_serv_modal.lista = desserts.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_categoria_get = function() {
            inventario_Service.Get_Categoria_Bienes().get(query, success_categorias).$promise;
        }
         // -------------------------------------------------------SELECT ESTADO DESCRIPTIVO------------------------------------------------------------
        function success_estado_descriptivo(desserts) {
            obj_serv_modal.lista = desserts.respuesta.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_estado_descriptivo_get = function() {
            inventario_Service.Get_Estado_Descriptivo().get(query, success_estado_descriptivo).$promise;
        }

        // -------------------------------------------------------SELECT GARANTIAS------------------------------------------------------------
        function success_garantias(desserts) {
            obj_serv_modal.lista = desserts.respuesta.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_garantias_get = function() {
            inventario_Service.Get_Garantia().get(query, success_garantias).$promise;
        }

        // -------------------------------------------------------SELECT MARCAS------------------------------------------------------------
        function success_marcas(desserts) {
             obj_serv_modal.lista = desserts.respuesta.data;
             $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_marcas_get = function() {
            inventario_Service.Get_Marca().get(query, success_marcas).$promise;
        }
        // -------------------------------------------------------SELECT MODELOS------------------------------------------------------------
        function success_modelos(desserts) {
            obj_serv_modal.lista = desserts.respuesta.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_modelos_get = function() {
            inventario_Service.Get_Modelo().get(query, success_modelos).$promise;
        }
        // -------------------------------------------------------SELECT UBICACION------------------------------------------------------------
        function success_ubicaciones(desserts) {
            obj_serv_modal.lista = desserts.respuesta.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_ubicacion_get = function() {
            inventario_Service.Get_Ubicacion().get(query, success_ubicaciones).$promise;
        }
        // -------------------------------------------------------SELECT TIPO CONSUMO------------------------------------------------------------
        function success_tipo_consumo(desserts) {
            obj_serv_modal.lista = desserts.respuesta.data;
            $rootScope.$broadcast('actualizar_select');
        }
        obj_serv_modal.data_inv_tipo_consumo_get = function() {
            inventario_Service.Get_Tipo_Consumo().get(query, success_tipo_consumo).$promise;
        }

     // ------------------------------------------------------- FIN SELECTS ----------------------------------------------------------------
               
    obj_serv_modal.actualizar_select = function() {
           switch(this.id_modal){
            case "CAT":
                obj_serv_modal.data_inv_categoria_get();
            break;
            case'TIPOCONSUMO':
                 obj_serv_modal.data_inv_tipo_consumo_get();   
            break;
            case'ESTADODESCRIP':
                obj_serv_modal.data_inv_estado_descriptivo_get();
            break;
            case'MARCA':
                obj_serv_modal.data_inv_marcas_get();
            break;
            case'MODELO':
                obj_serv_modal.data_inv_modelos_get();
            break;
            case'UBICACION':
                obj_serv_modal.data_inv_ubicacion_get();
            break;
            case'GARANTIA':
                obj_serv_modal.data_inv_garantias_get();
            break;

        }
    };

    return obj_serv_modal;
});

//------------------------------------ SERVICIOS COMPARTIDOS DE PERSONAS --------------------------------------
app.factory('Servicios_Modal_Personas', function($rootScope,$mdDialog,colaboradores_Service) {
    var obj_serv_modal = {};

    var query = {
            filter: '',
            num_registros: 5,
            pagina_actual: 1,
            limit: '15',
            page_num: 1
        };
           
    obj_serv_modal.abrir_modal = function() {
            $mdDialog.show({
                    controller: DialogController_nuevo,
                    templateUrl: 'views/app/finanzas/ventas/facturacion/personas/new.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    ariaLabel: 'Respuesta Registro',
                    clickOutsideToClose: false,
                    fullscreen: true
                })
    }

    function DialogController_nuevo($scope, $mdToast,mainService,Clientes_Service,Facturacion_Service) {
            var cm = $scope;
            $scope.tipo_cliente='';
            function selectCallback(_newValue, _oldValue) {
                    LxNotificationService.notify('Change detected');
                    console.log('Old value: ', _oldValue);
                    console.log('New value: ', _newValue);
                }
            // ----------------------------------------------------------- Buscar Persona 
            function success_buscar_cliente(result){
                    if (result.datosPersona) {
                        if (result.datosPersona.valid==true) {
                            var array_nombres = result.datosPersona.name.split(" ");
                            $scope.data_usuario.nombres_completos=result.datosPersona.name;
                            $scope.data_usuario.primer_nombre=array_nombres[2];
                            $scope.data_usuario.segundo_nombre=array_nombres[3];
                            $scope.data_usuario.primer_apellido=array_nombres[0];
                            $scope.data_usuario.segundo_apellido=array_nombres[1];
                        }
                    }
                    if (result.datosEmpresa) {
                        $scope.data_usuario.nombres_completos = result.datosEmpresa.razon_social;
                        $scope.data_usuario.establecimientos=result.establecimientos;
                        $scope.data_usuario.datosEmpresa=result.datosEmpresa;
                    }

                }
            $scope.buscar_persona=function(){
                if ($scope.data_usuario&&$scope.data_usuario.numero_documento) {
                    if ($scope.data_usuario.numero_documento.length==10||$scope.data_usuario.numero_documento.length==13) {
                        if ($scope.data_usuario.numero_documento.length==10) {
                            var datos={nrodocumento:$scope.data_usuario.numero_documento,tipodocumento:'CEDULA'};
                            $scope.tipo_cliente='P';
                        };
                        if ($scope.data_usuario.numero_documento.length==13) {
                            var datos={nrodocumento:$scope.data_usuario.numero_documento,tipodocumento:'RUC'};
                            $scope.tipo_cliente='E';
                        };
                            mainService.buscar_informacion_cedula().get(datos,success_buscar_cliente).$promise;
                        }
                }else{
                    $scope.data_usuario={};
                    cm.selectModelCiudad.selectedCiudades=undefined;
                }
            }
             //----------------SELECT CIUDADES---------------//
                function success_ciudades(desserts) {
                    cm.selectCallback = selectCallback;
                    cm.selectCiudades = desserts.respuesta;
                    cm.selectModelCiudad = {
                        selectedCiudades: undefined,
                        selectedPeople: [cm.selectCiudades[2], cm.selectCiudades[4]],
                        selectedPeopleSections: []
                    };
                }
                $scope.data_ciudades = function() {
                    colaboradores_Service.Get_Ciudades().get(query, success_ciudades).$promise;
                }
                $scope.data_ciudades();
                // fin

                //----------------SELECT TIPO DOCUMETO---------------//
                // function success_tipo_documento(desserts) {
                //     cm.selectCallback = selectCallback;
                //     cm.selectTipoDocument = desserts.respuesta;
                //     cm.selectModelTipoDocumento = {
                //         selectedTipoDocumento: undefined
                //     };
                // }
                // $scope.data_tipo_documento = function() {
                //     Facturacion_Service.Tipo_Documentos_Persona().get(query, success_tipo_documento).$promise;
                // }
                // $scope.data_tipo_documento();
                // fin
 

                $scope.procesando=false; // pone boton espera si no a retornado el resultado esperado

                // Nuevo registro Persona
                $scope.col_usuario_nuevo = function() {
                    $scope.data_usuario.id_localidad=cm.selectModelCiudad.selectedCiudades.id;
                    $scope.procesando=true; // pone boton espera si no a retornado el resultado esperado
                    // el return evita el error de desvordamiento en el boton de espera
                    // GUARDAR DATOS DE PERSONA
                    if ($scope.tipo_cliente=='P') {
                    return Clientes_Service.Add_Persona().add($scope.data_usuario).$promise.then(function(data) {
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
                    },function(error){
                        $scope.procesando=false;
                    });
                    }
                    //GUARDAT DATOS DE EMPRESA
                    if ($scope.tipo_cliente=='E') {
                    return Clientes_Service.Add_Empresa().add($scope.data_usuario).$promise.then(function(data) {
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
                    },function(error){
                        $scope.procesando=false;
                    });
                    }
                }
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

        }

    return obj_serv_modal;
});

