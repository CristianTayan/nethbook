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

    function success(desserts) {
        $scope.total = desserts.respuesta.total;
        $scope.tipo_categorias = desserts.respuesta.data;
    }

    $scope.data_inv_tc_get = function() {
        inventario_Service.Get_Tipo_Categoria().get($scope.query, success).$promise;
    }

    $rootScope.$on("actualizar_tipo_categoria", function() {
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

    $scope.nuevo = function(event) {
        $mdDialog.show({
                controller: DialogController,
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

    function DialogController($scope) {

        // Nuevo registro tipo inventario
        $scope.data_inv_tc_save = function() {
            inventario_Service.Add_Tipo_Categoria().add($scope.data_inv_tc).$promise.then(function(data) {
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

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
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
                    $rootScope.$emit("actualizar_tipo_categoria", {});
                    $mdDialog.hide();
                }
            });
        }
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }
});
// Controlador Categorias
app.controller('inv_categoria_Ctrl', function ($scope,$rootScope, $mdDialog, inventario_Service) {
        // $scope.data_inv_tc = {nombre:'', descripcion:''};
          var bookmark;
        $scope.selected=[];
         $scope.query = {
            filter: '',
            num_registros: 5,
            pagina_actual:1,
            limit: '5',
            page_num: 1
        };

        function success(desserts) {
            $scope.total=desserts.respuesta.total;
            $scope.categorias = desserts.respuesta.data;
          }

        $scope.data_inv_categoria_get = function(){
            inventario_Service.Get_Categoria().get($scope.query,success).$promise;
        }

        $rootScope.$on("actualizar_categoria", function(){
           $scope.data_inv_categoria_get();
         });

        $scope.removeFilter = function () {
        $scope.filter.show = false;
        $scope.query.filter = '';
        
        if($scope.filter.form.$dirty) {
          $scope.filter.form.$setPristine();
        }
      };

    $scope.$watch('query.filter', function (newValue, oldValue) {
        if(!oldValue) {
          bookmark = $scope.query.page;
        }
        
        if(newValue !== oldValue) {
          $scope.query.page = 1;
        }
        
        if(!newValue) {
          $scope.query.page = bookmark;
        }
        $scope.data_inv_categoria_get();
    });
    

        $scope.nuevo = function(event) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'views/app/inventario/categoria/nuevo.html',
                parent: angular.element(document.body),
                targetEvent: event,
                ariaLabel:'Respuesta Registro',
                clickOutsideToClose: true
            });
        }
        
        
        function DialogController($scope) {
            
            // Nuevo registro tipo inventario
            $scope.data_inv_categoria_guardar = function() {
                console.log($scope.data_inv_tc);
                inventario_Service.Add_Tipo_Categoria().add($scope.data_inv_tc).$promise.then(function(data) {
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

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }


        $scope.inv_categoria_dialog_eliminar=function(categoria){
            $mdDialog.show({
                controller: Dialog_eliminar_Ctrl,
                templateUrl: 'views/app/inventario/tipo_categoria/eliminar.html',
                parent: angular.element(document.body),
                targetEvent: event,
                ariaLabel:'Respuesta Registro',
                clickOutsideToClose: true,
                locals : {
                    obj : categoria
                }
            });
        }

        function Dialog_eliminar_Ctrl($scope,$rootScope, obj) { 
            $scope.data_inv_tc_eliminar=function(){
               inventario_Service.Delete_Tipo_Categoria().delete({id:obj.id}).$promise.then(function(data){
                if (data.respuesta==true) {
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
