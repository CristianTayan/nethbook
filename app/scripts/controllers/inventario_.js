'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:InventarioCtrl
 * @description
 * # InventarioCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')

app.controller('inventario_Ctrl', function($scope, inventario_Service) {
    // $scope.data_inv_tc = {nombre:'', descripcion:''};
    $scope.data_inv_tc_guardar = function() {
        inventario_Service.Add_Tipo_Categoria().add($scope.data_inv_tc).$promise.then(function(data) {
            console.log(data);
        });
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

    $scope.inv_tc_dialog_nuevo = function(event) {
        $mdDialog.show({
                controller: DialogController_nuevo,
                templateUrl: 'views/app/inventario/tipo_categoria/new.html',
                parent: angular.element(document.body),
                targetEvent: event,
                ariaLabel: 'Respuesta Registro',
                clickOutsideToClose: true
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
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

    $scope.inv_tc_dialog_editar = function(categoria) {
        $mdDialog.show({
            controller: DialogController_editar,
            templateUrl: 'views/app/inventario/tipo_categoria/update.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: true,
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

    $scope.inv_tc_dialog_eliminar = function(tipocategoria) {
        $mdDialog.show({
            controller: Dialog_eliminar_Ctrl,
            templateUrl: 'views/app/inventario/tipo_categoria/eliminar.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: true,
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
                    clickOutsideToClose: true
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
                clickOutsideToClose: true,
                locals: {
                    obj: categoria
                }
            });
        }
        function DialogController_editar($scope, $rootScope, inventario_Service, obj) {
            $scope.data_inv_tipo_garantia = obj;
            $scope.data_inv_tipo_garantia_update = function() {
                inventario_Service.Update_Tipo_Garantia().actualizar($scope.data_inv_tipo_garantia).$promise.then(function(data) {
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
                        $rootScope.$emit("actualizar_tabla_tipo_garantia", {});
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
                clickOutsideToClose: true,
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
                    clickOutsideToClose: true
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
                clickOutsideToClose: true,
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
                        $rootScope.$emit("actualizar_tabla_tipo_garantia", {});
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
                clickOutsideToClose: true,
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
                    clickOutsideToClose: true
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
                clickOutsideToClose: true,
                locals: {
                    obj: categoria
                }
            });
        }
        function DialogController_editar($scope, $rootScope, inventario_Service, obj) {
            $scope.data_inv_tipo_productos = obj;
            $scope.data_inv_tipo_productos_update = function() {
                inventario_Service.Update_Tipo_Productos().actualizar($scope.data_inv_tipo_productos).$promise.then(function(data) {
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
                        $rootScope.$emit("actualizar_tabla_tipo_garantia", {});
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
                clickOutsideToClose: true,
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

// Controlador Categorias
app.controller('inv_categoria_Ctrl', function($scope, $rootScope, $mdDialog, inventario_Service) {
    // $scope.data_inv_tc = {nombre:'', descripcion:''};
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
    // //////////

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

    $scope.inv_cat_dialog_nuevo = function(event) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'views/app/inventario/categoria/nuevo.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: true,
            locals: {
                tipos_categoria: $scope.tipo_categorias
            }
        });
    }

    function DialogController($scope, $rootScope, tipos_categoria) {
        $scope.tipos_categoria = tipos_categoria;
        // Nuevo registro tipo inventario
        $scope.data_inv_categoria_guardar = function() {
            inventario_Service.Add_Categoria().add($scope.data_inv_tc).$promise.then(function(data) {
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
    }

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };

    var self = $scope;

    self.simulateQuery = false;
    self.isDisabled    = false;

    // list of `state` value/display objects
    self.states        = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.btn_guardar        =true;

    self.newState = newState;

    function newState(state) {
      
    }

    function querySearch (query) {
      var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }

    function searchTextChange(text) {
      
    }

    function selectedItemChange(item) {
        if (self.data_inv_tc.name!=''&&self.data_inv_tc.descripcion!=''&&JSON.stringify(item)!=undefined) {
            $scope.data_inv_tc.tipo_categoria=item;
            self.btn_guardar=false;
        }else self.btn_guardar=true;
    }
    function loadAll() {
      return tipos_categoria;
    }
    function createFilterFor(query) {
      //var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.nombre.indexOf(query) === 0);
      };

    }



    $scope.inv_categoria_dialog_eliminar = function(categoria) {
        $mdDialog.show({
            controller: Dialog_eliminar_Ctrl,
            templateUrl: 'views/app/inventario/categoria/eliminar.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: true,
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

