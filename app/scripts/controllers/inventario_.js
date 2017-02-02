'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:InventarioCtrl
 * @description
 * # InventarioCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')

app.controller('inventario_Ctrl', function($scope, inventario_Service, $mdDialog) {

    





    
    $mdDialog.show({
        controller: Dialog_procedimiento_Controller,
        templateUrl: 'views/app/inventario/inicio/modal_.html',
        parent: angular.element(document.body),
        targetEvent: event,
        ariaLabel: 'Respuesta Registro',
        clickOutsideToClose: true,
        fullscreen:false
        // locals: {
        //     obj: categoria
        // }
    });
    // $scope.data_inv_tc = {nombre:'', descripcion:''};
    $scope.data_inv_tc_guardar = function() {
        inventario_Service.Add_Tipo_Categoria().add($scope.data_inv_tc).$promise.then(function(data) {
            console.log(data);
        });
    }



    function Dialog_procedimiento_Controller($mdStepper, $timeout, $scope){

        // var steppers = $mdStepper('stepper-demo');
            // console.log(steppers);
        // steppers.next();

        var vm = $scope;

            vm.$mdStepper = $mdStepper;
            vm.$timeout = $timeout;
            vm.isVertical = false;
            vm.isLinear = true;
            vm.isAlternative = true;
            vm.isMobileStepText = true;
            vm.campaign = false;


            $scope.selectCampaign = function () {
                console.log('test');
                var steppers = this.$mdStepper('stepper-demo');
                steppers.next();
                // var _this = this;
                // var steppers = this.$mdStepper('stepper-demo');
                // steppers.showFeedback('Checking, please wait ...');
                // this.$timeout(function () {
                //     if (_this.campaign) {
                //         steppers.clearError();
                //         steppers.next();
                //     }
                //     else {
                //         _this.campaign = !_this.campaign;
                //         steppers.error('Wrong campaign');
                //     }
                // }, 3000);
            };



            $scope.previousStep = function () {
                var steppers = this.$mdStepper('stepper-demo');
                steppers.back();
            };

            $scope.cancel = function () {
                console.log('test');
                var steppers = this.$mdStepper('stepper-demo');
                console.log(steppers);
                steppers.back();
            };


            $scope.nextStep = function () {
                console.log('test');
                var steppers = this.$mdStepper('stepper-demo');
                steppers.next();
            };
            $scope.toggleMobileStepText = function () {
                this.isMobileStepText = !this.isMobileStepText;
            };
            $scope.toggleLinear = function () {
                this.isLinear = !this.isLinear;
            };
            $scope.toggleAlternative = function () {
                this.isAlternative = !this.isAlternative;
            };
            $scope.toggleVertical = function () {
                this.isVertical = !this.isVertical;
            };
            $scope.showError = function () {
                var steppers = this.$mdStepper('stepper-demo');
                steppers.error('Wrong campaign');
            };
            $scope.clearError = function () {
                var steppers = this.$mdStepper('stepper-demo');
                steppers.clearError();
            };
            $scope.showFeedback = function () {
                var steppers = this.$mdStepper('stepper-demo');
                steppers.showFeedback('Step 1 looks great! Step 2 is comming up.');
            };
            $scope.clearFeedback = function () {
                var steppers = this.$mdStepper('stepper-demo');
                steppers.clearFeedback();
            };
            
    }
});
app.controller('inv_menu_Ctrl', function($scope, inventario_Service) {
    // $scope.data_inv_tc = {nombre:'', descripcion:''};
    $scope.data_inv_tc_guardar = function() {
        inventario_Service.Add_Tipo_Categoria().add($scope.data_inv_tc).$promise.then(function(data) {
            console.log(data);
        });
    }
});
app.controller('inv_tipo_categoria_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {
    // ---------------------------------------------------------PROCESO CREAR REGISTRO---------------------------------------------------------
    $scope.inv_tc_dialog_nuevo = function(event) {
        $mdDialog.show({
            controller: DialogController_nuevo,
            templateUrl: 'views/app/inventario/tipo_categoria/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false
        });
    }

    function DialogController_nuevo($scope) {
        // Nuevo registro tipo inventario
        $scope.data_inv_tc_save = function() {
            inventario_Service.Add_Tipo_Categoria().add($scope.data_inv_tc).$promise.then(function(data) {
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

    // ------------------------------------------------------PROCESO ACTUALIZAR REGISTR--------------------------------------------------------
    $scope.inv_tc_dialog_editar = function(categoria) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/tipo_categoria/update.html',
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

    // -------------------------------------------------------PROCESO ELIMINAR RESGISTRO-------------------------------------------------------
    $scope.inv_tc_dialog_eliminar = function(tipocategoria) {
        $mdDialog.show({
            controller: Dialog_eliminar_Ctrl,
            templateUrl: 'views/app/inventario/tipo_categoria/eliminar.html',
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
    // ---------------------------------------------------------PROCESO LLENAR TABLA----------------------------------------------------------
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

app.controller('inv_tipo_garantia_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {
    // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
    $scope.inv_tipo_garantia_dialog_nuevo = function(event) {
        $mdDialog.show({
            controller: DialogController_nuevo,
            templateUrl: 'views/app/inventario/tipo_garantia/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false
        });
    }

    function DialogController_nuevo($scope) {
        // Nuevo registro tipo inventario
        $scope.inv_tipo_garantia_nuevo = function() {
            inventario_Service.Add_Tipo_Garantia().add($scope.data_inv_tg).$promise.then(function(data) {
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

    // -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
    $scope.inv_tipo_garantia_dialog_editar = function(categoria) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/tipo_garantia/update.html',
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

    // --------------------------------------------------------PROCESO ELIMINAR REGISTRO--------------------------------------------------------
    $scope.inv_tipo_garantia_dialog_eliminar = function(tipocategoria) {
        $mdDialog.show({
            controller: Dialog_eliminar_Ctrl,
            templateUrl: 'views/app/inventario/tipo_garantia/eliminar.html',
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

app.controller('inv_tipo_consumo_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {
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
            inventario_Service.Add_Tipo_Consumo().add($scope.data_inv_tipo_consumo).$promise.then(function(data) {
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

app.controller('inv_tipo_productos_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {
    // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
    $scope.inv_tipo_productos_dialog_nuevo = function(event) {
        $mdDialog.show({
            controller: DialogController_nuevo,
            templateUrl: 'views/app/inventario/tipo_productos/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false
        });
    }

    function DialogController_nuevo($scope) {
        // Nuevo registro tipo inventario
        $scope.inv_tipo_productos_nuevo = function() {
            inventario_Service.Add_Tipo_Productos().add($scope.data_inv_tipo_productos).$promise.then(function(data) {
                $rootScope.$emit("actualizar_tabla_tipo_productos", {});
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
    $scope.inv_tipo_productos_dialog_editar = function(categoria) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/tipo_productos/update.html',
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
        $scope.data_inv_tipo_productos = obj;
        $scope.data_inv_tipo_productos_update = function() {
            inventario_Service.Update_Tipo_Productos().actualizar($scope.data_inv_tipo_productos).$promise.then(function(data) {
                $rootScope.$emit("actualizar_tabla_tipo_productos", {});
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
    $scope.inv_tipo_productos_dialog_eliminar = function(tipocategoria) {
        $mdDialog.show({
            controller: Dialog_eliminar_Ctrl,
            templateUrl: 'views/app/inventario/tipo_productos/eliminar.html',
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
        $scope.data_inv_tipo_productos_eliminar = function() {
            inventario_Service.Delete_Tipo_Productos().delete({
                id: obj.id
            }).$promise.then(function(data) {
                if (data.respuesta == true) {
                    $rootScope.$emit("actualizar_tabla_tipo_productos", {});
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
        $scope.tipo_productos = desserts.respuesta.data;
    }

    $scope.data_inv_tipo_productos_get = function() {
        inventario_Service.Get_Tipo_Productos().get($scope.query, success).$promise;
    }

    $rootScope.$on("actualizar_tabla_tipo_productos", function() {
        $scope.data_inv_tipo_productos_get();
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
        $scope.data_inv_tipo_productos_get();
    });
});

app.controller('inv_tipo_catalogo_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {
    // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
    $scope.inv_tipo_catalogo_dialog_nuevo = function(event) {
        $mdDialog.show({
            controller: DialogController_nuevo,
            templateUrl: 'views/app/inventario/tipo_catalogo/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false
        });
    }

    function DialogController_nuevo($scope) {
        // ------------------------------------------------------INICIALIZACION DE PARAMETROS------------------------------------------------------
        var fecha_actual = new Date();
        $scope.data_inv_tipo_catalogo = {
            fecha_inicio: fecha_actual,
            fecha_fin: fecha_actual
        };

        $scope.mindate = fecha_actual;

        // Nuevo registro tipo inventario
        $scope.inv_tipo_catalogo_nuevo = function() {
            inventario_Service.Add_Tipo_Catalogo().add($scope.data_inv_tipo_catalogo).$promise.then(function(data) {
                $rootScope.$emit("actualizar_tabla_tipo_catalogo", {});
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
    $scope.inv_tipo_catalogo_dialog_editar = function(categoria) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/tipo_catalogo/update.html',
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
        $scope.data_inv_tipo_catalogo = obj;
        $scope.data_inv_tipo_catalogo_update = function() {
            inventario_Service.Update_Tipo_Catalogo().actualizar($scope.data_inv_tipo_catalogo).$promise.then(function(data) {
                $rootScope.$emit("actualizar_tabla_tipo_catalogo", {});
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
    $scope.inv_tipo_catalogo_dialog_eliminar = function(tipocategoria) {
        $mdDialog.show({
            controller: Dialog_eliminar_Ctrl,
            templateUrl: 'views/app/inventario/tipo_catalogo/eliminar.html',
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
        $scope.data_inv_tipo_catalogo_eliminar = function() {
            inventario_Service.Delete_Tipo_Catalogo().delete({
                id: obj.id
            }).$promise.then(function(data) {
                if (data.respuesta == true) {
                    $rootScope.$emit("actualizar_tabla_tipo_productos", {});
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
        $scope.tipo_catalogo = desserts.respuesta.data;
    }

    $scope.data_inv_tipo_catalogo_get = function() {
        inventario_Service.Get_Tipo_Catalogo().get($scope.query, success).$promise;
    }

    $rootScope.$on("actualizar_tabla_tipo_catalogo", function() {
        $scope.data_inv_tipo_catalogo_get();
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
        $scope.data_inv_tipo_catalogo_get();
    });
});

app.controller('inv_marcas_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {
    // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
    $scope.inv_marca_dialog_nuevo = function(event) {
        $mdDialog.show({
            controller: DialogController_nuevo,
            templateUrl: 'views/app/inventario/marcas/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false
        });
    }

    function DialogController_nuevo($scope) {
        // Nuevo registro tipo inventario
        $scope.inv_marca_nuevo = function() {
            inventario_Service.Add_Marca().add($scope.data_inv_marca).$promise.then(function(data) {
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

    // -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
    $scope.inv_marca_dialog_editar = function(categoria) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/marcas/update.html',
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
            templateUrl: 'views/app/inventario/marcas/eliminar.html',
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

app.controller('inv_modelos_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {
    // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
    $scope.inv_modelo_dialog_nuevo = function(event) {
        $mdDialog.show({
            controller: DialogController_nuevo,
            templateUrl: 'views/app/inventario/modelos/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false
        });
    }

    function DialogController_nuevo($scope) {
        // Nuevo registro tipo inventario
        $scope.inv_modelo_nuevo = function() {
            inventario_Service.Add_Modelo().add($scope.data_inv_modelo).$promise.then(function(data) {
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

    // -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
    $scope.inv_modelo_dialog_editar = function(categoria) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/modelos/update.html',
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

    // --------------------------------------------------------PROCESO ELIMINAR REGISTRO--------------------------------------------------------
    $scope.inv_modelo_dialog_eliminar = function(tipocategoria) {
        $mdDialog.show({
            controller: Dialog_eliminar_Ctrl,
            templateUrl: 'views/app/inventario/modelos/eliminar.html',
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

app.controller('inv_ubicacion_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {
    // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
    $scope.inv_ubicacion_dialog_nuevo = function(event) {
        $mdDialog.show({
            controller: DialogController_nuevo,
            templateUrl: 'views/app/inventario/ubicacion/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false
        });
    }

    function DialogController_nuevo($scope) {
        // Nuevo registro tipo inventario
        $scope.inv_ubicacion_nuevo = function() {
            inventario_Service.Add_Ubicacion().add($scope.data_inv_ubicacion).$promise.then(function(data) {
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

    // -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
    $scope.inv_ubicacion_dialog_editar = function(categoria) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/ubicacion/update.html',
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

    // --------------------------------------------------------PROCESO ELIMINAR REGISTRO--------------------------------------------------------
    $scope.inv_ubicacion_dialog_eliminar = function(tipocategoria) {
        $mdDialog.show({
            controller: Dialog_eliminar_Ctrl,
            templateUrl: 'views/app/inventario/ubicacion/eliminar.html',
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

app.controller('inv_garantia_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {
    // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
    // ---------------------------------------------------tipo garantia select--------------------------------------------------------------
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
            templateUrl: 'views/app/inventario/garantia/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false,
            locals: {
                select_tipo_garantia: $scope.tipo_garantia
            }
        });
    }

    function DialogController_nuevo($scope, select_tipo_garantia) {

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
    $scope.inv_garantia_dialog_editar = function(categoria) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/garantia/update.html',
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

    // -------------------------------------------------------PROCESO ELIMINAR REGISTRO---------------------------------------------------------
    $scope.inv_garantia_dialog_eliminar = function(tipocategoria) {
        $mdDialog.show({
            controller: Dialog_eliminar_Ctrl,
            templateUrl: 'views/app/inventario/garantia/eliminar.html',
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

    // -------------------------------------------------------PROCESO LLENAR TABLA-------------------------------------------------------------- 
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

app.controller('inv_categoria_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {
    // -----------------------------------------------PROCESO LLENADO TABLA-----------------------------------------------
    var bookmark;
    $scope.selected = [];
    $scope.query = {
        filter: '',
        num_registros: 5,
        pagina_actual: 1,
        limit: '5',
        page_num: 1
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
        $scope.categorias = desserts.respuesta.data;
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

    // -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
    $scope.inv_categoria_dialog_editar = function(tipo_categoria) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/categoria/update.html',
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
            inventario_Service.Update_Categoria().actualizar($scope.data_inv_categoria).$promise.then(function(data) {
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

    // -----------------------------------------------------------------PROCESO CREAR-----------------------------------------------------------------
    $scope.inv_categoria_dialog_nuevo = function(event) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/app/inventario/categoria/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false,
            locals: {
                tipo_categoria: $scope.tipo_categorias
            }
        });
    }

    function DialogController($scope, $rootScope, tipo_categoria) {
        $scope.tipo_categoria = tipo_categoria;
        // Nuevo registro tipo inventario
        $scope.data_inv_categoria_guardar = function() {
            $scope.data_inv_tc.tipo_categoria = vm.selectModel.selectedPerson.id;
            inventario_Service.Add_Categoria().add($scope.data_inv_tc).$promise.then(function(data) {
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
                $rootScope.$emit("actualizar_categoria", {});
            });
        }
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        var vm = $scope;

        vm.selectCallback = selectCallback;

        vm.selectPeople = tipo_categoria;

        vm.selectModel = {
            selectedPerson: undefined,
            selectedPeople: [vm.selectPeople[2], vm.selectPeople[4]],
            selectedPeopleSections: []
        };

        function selectCallback(_newValue, _oldValue) {
            LxNotificationService.notify('Change detected');
            console.log('Old value: ', _oldValue);
            console.log('New value: ', _newValue);
        }
    }

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    //---------------------------------------------------------------PROCESO ELIMINAR ---------------------------------------------------------------
    $scope.inv_categoria_dialog_eliminar = function(categoria) {
        $mdDialog.show({
            controller: Dialog_eliminar_Ctrl,
            templateUrl: 'views/app/inventario/categoria/eliminar.html',
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
        $scope.data_inv_categoria_eliminar = function() {
            inventario_Service.Delete_Categoria().delete({
                id: obj.id
            }).$promise.then(function(data) {
                if (data.respuesta == true) {
                    $rootScope.$emit("actualizar_categoria", {});
                    $mdDialog.hide();
                }
            });
        }
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }
});

app.controller('inv_productos_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {

    // ------------------------------------------------------- INICIO AUTO COMPLETES ---------------------------------------------------------------- 
    // -------------------------------------------------------SELECT TIPO CATEGORIAS------------------------------------------------------------
    function success_categorias(desserts) {
        $scope.categorias = desserts.respuesta.data;
    }
    $scope.data_inv_categoria_get = function() {
        inventario_Service.Get_Categoria().get($scope.query, success_categorias).$promise;
    }
    $scope.data_inv_categoria_get();
     // -------------------------------------------------------SELECT ESTADO DESCRIPTIVO------------------------------------------------------------
    function success_estado_descriptivo(desserts) {
        $scope.estado_descriptivo = desserts.respuesta.data;
    }
    $scope.data_inv_estado_descriptivo_get = function() {
        inventario_Service.Get_Estado_Descriptivo().get($scope.query, success_estado_descriptivo).$promise;
    }
    $scope.data_inv_estado_descriptivo_get();

    // -------------------------------------------------------SELECT GARANTIAS------------------------------------------------------------
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
    // -------------------------------------------------------SELECT MODELOS------------------------------------------------------------
    function success_modelos(desserts) {
        $scope.modelos = desserts.respuesta.data;
    }
    $scope.data_inv_modelos_get = function() {
        inventario_Service.Get_Modelo().get($scope.query, success_modelos).$promise;
    }
    $scope.data_inv_modelos_get();
    // -------------------------------------------------------SELECT UBICACION------------------------------------------------------------
    function success_ubicaciones(desserts) {
        $scope.ubicaciones = desserts.respuesta.data;
    }
    $scope.data_inv_ubicacion_get = function() {
        inventario_Service.Get_Ubicacion().get($scope.query, success_ubicaciones).$promise;
    }
    $scope.data_inv_ubicacion_get();
    // -------------------------------------------------------SELECT TIPO CONSUMO------------------------------------------------------------
    function success_tipo_consumo(desserts) {
        $scope.tipo_consumos = desserts.respuesta.data;
    }
    $scope.data_inv_tipo_consumo_get = function() {
        inventario_Service.Get_Tipo_Consumo().get($scope.query, success_tipo_consumo).$promise;
    }
    $scope.data_inv_tipo_consumo_get();
     // ------------------------------------------------------- FIN SELECTS ----------------------------------------------------------------
    // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
    $scope.customFullscreen = false;
    $scope.inv_producto_dialog_nuevo = function(event) {
        $mdDialog.show({
            controller: DialogController_nuevo,
            templateUrl: 'views/app/inventario/productos/new.html',
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
                select_tipo_consumos:$scope.tipo_consumos
            }
        });
    }

    function DialogController_nuevo($scope, select_tipo_categoria,select_estado_descriptivo,select_garantias,select_marcas,select_modelos,select_ubicaciones,select_tipo_consumos) {
        // ------------------------------------------------------ INICIALIZACION CAMPOS ---------------------------------------------------------
        $scope.data_inv_producto = {precio:0.00,costo: 0.00, cantidad:0}

        // -------------------------------------------------------DIALOGO PRODUCTOS-------------------------------------------------------
        // ------------------------------------------------------- AUTO COMPLETES --------------------------------------------------------
        var vm = $scope;
        vm.selectCallback = selectCallback;
        vm.selectPeople = select_tipo_categoria;
        vm.selectED = select_estado_descriptivo;
        vm.selectGarantias = select_garantias;
        vm.selectMarcas = select_marcas;
        vm.selectModelos = select_modelos;
        vm.selectUbicaciones = select_ubicaciones;
        vm.selectTipoConsumos = select_tipo_consumos;
        vm.selectModel = {
            selectedPerson: undefined,
            selectedPeople: [vm.selectPeople[0]]
        };

        vm.selectModelED = {
            selectedED: undefined,
            selectedPeopleED: [vm.selectED[0]]
        };
        vm.selectModelGarantia = {
            selectedGarantia: undefined,
            selectedGarantiaDefault: [vm.selectGarantias[0]]
        };

        vm.selectModelMarcas = {
            selectedMarca: undefined,
            selectedMarcasDefault: [vm.selectMarcas[0]]
        };
        vm.selectModelModelos = {
            selectedModelo: undefined,
            selectedModeloDefault: [vm.selectModelos[0]]
        };
        vm.selectModelUbicaciones = {
            selectedUbicacion: undefined,
            selectedUbicacionDefault: [vm.selectUbicaciones[0]]
        };

        vm.selectModelTipoConsumos = {
            selectedTipoConsumo: undefined,
            selectedTipoConsumoDefault: [vm.selectTipoConsumos[0]]
        };

        function selectCallback(_newValue, _oldValue) {
            LxNotificationService.notify('Change detected');
        }


        // Nuevo registro Producto
        $scope.inv_producto_nuevo = function() {
            $scope.data_inv_producto.categoria = vm.selectModel.selectedPerson.id;
            $scope.data_inv_producto.estado_descriptivo = vm.selectModelED.selectedED.id;
            $scope.data_inv_producto.garantia = vm.selectModelGarantia.selectedGarantia.id;
            $scope.data_inv_producto.marca = vm.selectModelMarcas.selectedMarca.id;
            $scope.data_inv_producto.modelo = vm.selectModelModelos.selectedModelo.id;
            $scope.data_inv_producto.ubicacion = vm.selectModelUbicaciones.selectedUbicacion.id;
            $scope.data_inv_producto.tipo_consumo = vm.selectModelTipoConsumos.selectedTipoConsumo.id;
            if ($scope.data_inv_producto.comprable==undefined) {
                $scope.data_inv_producto.comprable=false;
            }else $scope.data_inv_producto.comprable=true;

            if ($scope.data_inv_producto.vendible==undefined) {
                $scope.data_inv_producto.vendible=false;
            }else $scope.data_inv_producto.vendible=true;
            console.log($scope.data_inv_producto);
            inventario_Service.Add_Producto().add($scope.data_inv_producto).$promise.then(function(data) {
                $rootScope.$emit("actualizar_tabla_productos", {});
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

app.controller('inv_estado_descriptivo_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {

    // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------
    $scope.customFullscreen = false;
    $scope.inv_estado_descriptivo_nuevo = function(event) {
        $mdDialog.show({
            controller: DialogController_nuevo,
            templateUrl: 'views/app/inventario/estado_descriptivo/new.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false,
            fullscreen: $scope.customFullscreen
        });
    }

    function DialogController_nuevo($scope) {

        // -------------------------------------------------------DIALOGO ESTADO ESTADO DESCRIPTIVO-------------------------------------------------------

        // Nuevo registro tipo inventario
        $scope.inv_estado_descriptivo_nuevo = function() {
            inventario_Service.Add_Estado_Descriptivo().add($scope.data_inv_estado_descriptivo).$promise.then(function(data) {
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

    // -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
    $scope.inv_estado_descriptivo_editar = function(estadodescriptivo) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/estado_descriptivo/update.html',
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
            templateUrl: 'views/app/inventario/estado_descriptivo/eliminar.html',
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

app.controller('inv_bodegas_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service,establecimientosService) {
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
            templateUrl: 'views/app/inventario/bodega/new.html',
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
        var vm=$scope;
        vm.selectSucursales = obj;
        vm.selectModelSucursal = {
            selectedSucursal: undefined,
            selectedSucursalDefault: [vm.selectSucursales[0]]
        };
        // Nuevo registro Bodega
        $scope.data_inv_bodega_guardar = function() {
            $scope.data_inv_bodega.id_sucursal=vm.selectModelSucursal.selectedSucursal.id;
            inventario_Service.Add_Bodega().add($scope.data_inv_bodega).$promise.then(function(data) {
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

    // -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
    $scope.inv_bodega_dialog_editar = function(bodega) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/bodega/update.html',
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
            templateUrl: 'views/app/inventario/bodega/eliminar.html',
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