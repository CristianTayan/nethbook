'use strict';

/**
 * @ngdoc service
 * @name nextbook20App.inventario
 * @description
 * # inventario
 * Factory in the nextbook20App.
 */
var app=angular.module('nextbook20App');
//servicios compartidos de inventario
app.factory('Servicios_Modal', function($rootScope,$mdDialog,inventario_Service) {
    var obj_serv_modal = {};
    var query = {
            filter: '',
            num_registros: 5,
            pagina_actual: 1,
            limit: '15',
            page_num: 1
        };
    
    obj_serv_modal.id_modal = '';
    obj_serv_modal.lista = {};

    obj_serv_modal.abrir_modal = function(id_modal) {
        this.id_modal = id_modal;

        $mdDialog.show({
            controller: obj_serv_modal.Controller_add_cat_padre,
            multiple:true,
            templateUrl: 'views/app/inventario/categoria/new_cat_padre.html',
            parent: angular.element(document.body),
            targetEvent: event,
            ariaLabel: 'Respuesta Registro',
            clickOutsideToClose: false
        });

        
    };

    //-----------------------------------------------------------------CONTROLADOR PADRE //-----------------------------------------------------------------
       obj_serv_modal.Controller_add_cat_padre=function ($scope,$mdToast,inventario_Service){
        // Nuevo registro 
        $scope.data_inv_categoria_guardar = function() {
            $scope.data_inv_categoria.id_padre=3;
            // console.log($scope.data_inv_categoria);
            // obj_serv_modal.broadcastItem();
            inventario_Service.Add_Categoria_Padre().add($scope.data_inv_categoria).$promise.then(function(data) {
                    obj_serv_modal.actualizar_select();
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

        
        // -------------------------------------------------------SELECT TIPO CATEGORIAS------------------------------------------------------------
        function success_categorias(desserts) {
            obj_serv_modal.lista = desserts.data;
            $rootScope.$broadcast('actualizar_select_categorias');
        }
        obj_serv_modal.data_inv_categoria_get = function() {
            inventario_Service.Get_Categoria_Bienes().get(query, success_categorias).$promise;
        }
               
    obj_serv_modal.actualizar_select = function() {
        obj_serv_modal.data_inv_categoria_get();
        
    };

    return obj_serv_modal;
});
