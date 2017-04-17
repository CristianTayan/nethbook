'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:RepositorioFacturasCtrl
 * @description
 * # RepositorioFacturasCtrl
 * Controller of the nextbook20App
 */
	var app = angular.module('nextbook20App')
    app.controller('facturacion_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, $filter, menuService) {
    	
    	// ------------------------------------inicio generacion vista menu personalizacion------------------------------------
            var data = menuService.Get_Vistas_Loged_User();
            $scope.menu = data.respuesta[0].children[0].children[1];
        // --------------------------------------fin generacion vista menu personalizacion-------------------------------------

    });

    app.controller('fac_personas_Ctrl', function ($scope, colaboradores_Service, $rootScope, $mdDialog,Servicios_Modal_Personas) {

        var modal=Servicios_Modal_Personas;

        function selectCallback(_newValue, _oldValue) {
            LxNotificationService.notify('Change detected');
            console.log('Old value: ', _oldValue);
            console.log('New value: ', _newValue);
        }
        // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------

            $scope.colaboradores_dialog_nuevo = function(event) {
                modal.abrir_modal();
            }

        // -------------------------------------------------------PROCESO EDITAR REGISTRO-----------------------------------------------------------
            $scope.usuarios_dialog_modificar = function(col_usuario) {
                $mdDialog.show({
                    controller: DialogController_editar,
                    templateUrl: 'views/app/facturacion/personas/update.html',
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
                    templateUrl: 'views/app/facturacion/personas/eliminar.html',
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




    app.controller('fac_cajas_Ctrl', function($mdDialog, $scope,$rootScope,Facturacion_Service) {
        
        function selectCallback(_newValue, _oldValue) {
            LxNotificationService.notify('Change detected');
            console.log('Old value: ', _oldValue);
            console.log('New value: ', _newValue);
        }

        var bookmark;
            $scope.selected = [];
            $scope.query = {
                filter: '',
                num_registros: 5,
                pagina_actual: 1,
                limit: '5',
                page_num: 1
            };

        // -------------------------------------------------------PROCESO CREAR REGISTRO------------------------------------------------------------

            $scope.cajas_dialog_nuevo = function(event) {
                $mdDialog.show({
                    controller: DialogController_nuevo,
                    templateUrl: 'views/app/facturacion/cajas/new.html',
                    parent: angular.element(document.body),
                    targetEvent: event,
                    ariaLabel: 'Respuesta Registro',
                    clickOutsideToClose: false,
                    fullscreen: true,
                    locals: {
                            empleados:$scope.empleados
                    }
                })
            }

            $scope.usuarios_dialog_asignar = function(caja) {
                 $mdDialog.show({
                            controller: DialogController_asignar,
                            templateUrl: 'views/app/facturacion/cajas/asignacion_usuario.html',
                            parent: angular.element(document.body),
                            targetEvent: event,
                            ariaLabel: 'Respuesta Registro',
                            clickOutsideToClose: false,
                            fullscreen: true,
                            locals: {
                                    caja:caja
                            }
                        })
            }
            

            function DialogController_nuevo($scope, $mdToast,Facturacion_Service,$localStorage) {
                $scope.data_caja={};
                $scope.data_caja.inicio_numeracion=1;
                $scope.data_caja.fin_numeracion=$scope.data_caja.inicio_numeracion+1;
                $scope.procesando=false;


                $scope.caja_nuevo = function() {
                    $scope.data_caja.id_sucursal=$localStorage.sucursal.id;
                    $scope.procesando=true;
                     return Facturacion_Service.Add_Caja().send($scope.data_caja).$promise.then(function(data) {
                        $rootScope.$emit("actualizar_tabla_cajas", {});
                        $scope.procesando=false;
                        if (data.respuesta == true) {
                                // $mdDialog.cancel();
                                //     $mdToast.show({
                                //       hideDelay   : 5000,
                                //       position    : 'bottom right',
                                //       controller  : 'notificacionCtrl',
                                //       templateUrl : 'views/notificaciones/guardar.html'
                                //     });

                                $mdDialog.show({
                                    controller: DialogController_asignar,
                                    templateUrl: 'views/app/facturacion/cajas/asignacion_usuario.html',
                                    parent: angular.element(document.body),
                                    targetEvent: event,
                                    ariaLabel: 'Respuesta Registro',
                                    clickOutsideToClose: false,
                                    fullscreen: true,
                                    locals: {
                                            caja:$scope.data_caja
                                    }
                                })
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
                };

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
            }

            function DialogController_asignar($scope, $mdToast,Facturacion_Service,$localStorage,caja) {
                    $scope.caja=caja;
                    $scope.cancel = function() {
                        $mdDialog.cancel();
                    };

                     function success_buscar_empleado(result){
                    if (result.respuesta==true) {
                        $scope.data_empleado=result.empleado;
                    $scope.data_empleado.ruc_ci=result.empleado.numero_identificacion;
                    $scope.data_empleado.nombres=result.empleado.primer_nombre+' '+result.empleado.segundo_nombre;
                    $scope.data_empleado.apellidos=result.empleado.primer_apellido+' '+result.empleado.segundo_apellido;
                    $scope.data_empleado.direccion=result.empleado.calle+', '+result.empleado.transversal+', '+result.empleado.numero;
                    }

                }

                $scope.buscar_empleado=function(){
                    if ($scope.data_empleado&&$scope.data_empleado.ruc_ci) {
                        if ($scope.data_empleado.ruc_ci.length==10||$scope.data_empleado.ruc_ci.length==13) {
                                Facturacion_Service.Get_Empleado_By_Ruc_Ci().send({ruc_ci:$scope.data_empleado.ruc_ci},success_buscar_empleado).$promise;
                            }
                    }else{
                        $scope.data_empleado={};
                        cm.ModelLocalizacion.selectedLocalizacion=undefined;
                    }
                }

                    $scope.asignar_usuario_caja = function() {
                    $scope.data_caja.id_sucursal=$localStorage.sucursal.id;
                     Facturacion_Service.Add_Caja().send($scope.data_caja).$promise.then(function(data) {
                        $rootScope.$emit("actualizar_tabla_cajas", {});
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
                };

                }

            //-------------------------------------------------------PROCESO GET REGISTROS------------------------------------------------------------

            $rootScope.$on("actualizar_tabla_cajas", function() {
                $scope.data_cajas_get();
            });

            function success(desserts) {
                $scope.total = desserts.respuesta.total;
                $scope.cajas = desserts.respuesta.data;
            }

            $scope.data_cajas_get = function() {
                Facturacion_Service.Get_Cajas().get($scope.query, success).$promise;
            }

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
                $scope.data_cajas_get();
            });
    });

	app.controller('fac_mis_facturas_venta_Ctrl', function($mdDialog, $scope) {
    	
    	console.log('mis facturas');

    });

    app.controller('fac_nueva_factura_venta_Ctrl', function($mdDialog,$document, $scope,inventario_Service,Contabilidad_Service,$rootScope,$localStorage,colaboradores_Service,Facturacion_Service,$timeout) {
            function selectCallback(_newValue, _oldValue) {
                console.log('Old value: ', _oldValue);
                console.log('New value: ', _newValue);
            }
        $scope.detalles_fac=[];
        //------------------------------------------- MODAL AÑADIR PRODUCTO -------------------------------

        $scope.dialog_add_prod = function(event) {
            $mdDialog.show({
                controller: DialogController_add,
                templateUrl: 'views/app/facturacion/nueva_factura_venta/modales/add_prod.html',
                parent: angular.element(document.body),
                targetEvent: event,
                ariaLabel: 'Respuesta Registro',
                clickOutsideToClose: false,
                locals:{detalles_fac:$scope.detalles_fac}
            });
        }

        function DialogController_add($scope,detalles_fac,$rootScope,Facturacion_Service, $mdStepper,$timeout,focus) {
            $scope.add_prods=(detalles_fac.length>0) ?detalles_fac:[];
            
            var vm = $scope;
            vm.$mdStepper = $mdStepper;
            vm.$timeout = $timeout;
            vm.isVertical = false;
            vm.isLinear = true;
            vm.isAlternative = true;
            vm.isMobileStepText = true;
            vm.campaign = false;


            $scope.previousStep = function () {
                var steppers = this.$mdStepper('stepper-demo');
                steppers.back();
            };

            $scope.nextStep = function (e) {
                if(e.which === 13) {
                    
                    var steppers = this.$mdStepper('stepper-demo');
                    if (steppers.currentStep==steppers.steps.length-1) {
                        // focus('txt_buscar');
                        $scope.ok_add_prods();
                    }else{
                        focus('txt_cantidad');
                        $scope.prod_selected=$scope.productos[0];
                        steppers.next();
                    }
                    
                }
                
            };

            

            $rootScope.decimales=2;
             //------------------------------------------------- LLENADO DE TABLA PRODUCTOS-----------------------------------------
            var bookmark;
            $scope.query = {
                    filter: '',
                    num_registros: 5,
                    pagina_actual: 1,
                    limit: '15',
                    page_num: 1
                };

            function success_tabla(result){
                $scope.productos=result.respuesta.data;

                for (var i = 0; i < $scope.productos.length; i++) {
                                $scope.productos[i].cantidad_fac=1;
                                $scope.productos[i].total_fac=0;
                        for (var j = 0; j < $scope.add_prods.length; j++) {
                            if ($scope.productos[i].id==$scope.add_prods[j].id) {
                                $scope.productos[i].cantidad_fac=$scope.add_prods[j].cantidad_fac;
                                $scope.productos[i].total_fac=$scope.add_prods[j].total_fac;
                            }
                            
                        }
                }

            }
            $scope.get_tabla=function(){
                Facturacion_Service.Buscar_Productos_Facturacion().get($scope.query,success_tabla).$promise.then(function(){},function(error){
                    $scope.get_tabla();
                    focus('txt_buscar');
                })
            }

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

                $scope.get_tabla();
            });

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $timeout(function() {
                focus('txt_buscar');
            }, 700);

            //------------------------------------------------- FUNCIONES PARA MODODAL ADD PRODUCTOS  -------------------------------------------------
            // $scope.add_prod_fac=function(prod){

            //     if (Facturacion_Service.ObjIndexOf($scope.add_prods,prod)==-1) {
            //         prod.cantidad_fac=1;
            //         prod.total_fac=parseFloat(prod.precio.replace('$','')).toFixed($rootScope.decimales);
            //         $scope.add_prods.push(prod);
            //     }else{
            //         var index=Facturacion_Service.ObjIndexOf($scope.add_prods,prod);
            //         if ($scope.add_prods[index].cantidad_fac<$scope.add_prods[index].cantidad) {
            //             $scope.add_prods[index].cantidad_fac=$scope.add_prods[index].cantidad_fac+1;
            //             prod.cantidad_fac=$scope.add_prods[index].cantidad_fac;
            //             $scope.add_prods[index].total_fac=parseFloat(parseFloat($scope.add_prods[index].precio.replace('$','')).toFixed($rootScope.decimales)*$scope.add_prods[index].cantidad_fac).toFixed($rootScope.decimales);
            //         }
            //     }
                    
            // }

            // $scope.remove_prod_fac=function(prod){

            //     var index=Facturacion_Service.ObjIndexOf($scope.add_prods,prod);
            //     if (index!=-1) {
            //         if ($scope.add_prods[index].cantidad_fac>1) {
            //             $scope.add_prods[index].cantidad_fac=$scope.add_prods[index].cantidad_fac-1;
            //             prod.cantidad_fac=$scope.add_prods[index].cantidad_fac;
            //             $scope.add_prods[index].total_fac=parseFloat(parseFloat($scope.add_prods[index].precio.replace('$','')).toFixed($scope.decimales)*$scope.add_prods[index].cantidad_fac).toFixed($rootScope.decimales);
            //         }
            //     }

            // }


            $scope.add_prod_fac_from_input=function(){
                    
                    if ($scope.prod_selected.cantidad_fac==null||$scope.prod_selected.cantidad_fac==""||$scope.prod_selected.cantidad_fac==undefined) {
                        $scope.prod_selected.cantidad_fac=1;
                    }

                     if ($scope.prod_selected.cantidad_fac>$scope.prod_selected.cantidad) {
                        $scope.prod_selected.cantidad_fac=$scope.cantidad_fac;
                        $scope.prod_selected.total_fac=parseFloat(parseFloat($scope.prod_selected.precio.replace('$','')).toFixed($rootScope.decimales)*$scope.prod_selected.cantidad_fac).toFixed($rootScope.decimales);
                    }else{
                        $scope.prod_selected.total_fac=parseFloat(parseFloat($scope.prod_selected.precio.replace('$','')).toFixed($rootScope.decimales)*$scope.prod_selected.cantidad_fac).toFixed($rootScope.decimales);
                    }

                    if (Facturacion_Service.ObjIndexOf($scope.add_prods,$scope.prod_selected)==-1) {
                    // $scope.prod_selected.cantidad_fac=1;
                    $scope.prod_selected.total_fac=parseFloat($scope.prod_selected.precio.replace('$','')).toFixed($rootScope.decimales);
                    $scope.add_prods.push($scope.prod_selected);
                    }else{
                        var index=Facturacion_Service.ObjIndexOf($scope.add_prods,$scope.prod_selected);
                        // if ($scope.add_prods[index].cantidad_fac<$scope.add_prods[index].cantidad) {
                            $scope.add_prods[index].cantidad_fac=$scope.prod_selected.cantidad_fac;
                            // $scope.prod_selected.cantidad_fac=$scope.add_prods[index].cantidad_fac;
                            $scope.add_prods[index].total_fac=parseFloat(parseFloat($scope.add_prods[index].precio.replace('$','')).toFixed($rootScope.decimales)*$scope.add_prods[index].cantidad_fac).toFixed($rootScope.decimales);
                        // }
                    }
            }

            $scope.ok_add_prods=function(){

                $rootScope.$emit("update_detalles_fac", $scope.add_prods);
                $mdDialog.cancel();
            }

            
            // -------------------------------------------------FIN DIALOG ADD-------------------------------------------------

        }

        //-----------------------------------------------------FUNCIONES ROOT//-----------------------------------------------------
        $rootScope.$on("actualizar_tabla", function() {
                $scope.get_tabla();
            });

        $rootScope.$on("update_detalles_fac", function(evt,prod) {
                $scope.update_detalles_fac(prod);
            });
        //-----------------------------------------------------FUNCIONES TECLADO-----------------------------------------------------
        var handler = function(e){
            if(e.keyCode === 107||e.keyCode === 187) {
              $scope.dialog_add_prod();
            }
        };

        var $doc = angular.element(document);

        $doc.on('keydown', handler);
        $scope.$on('$destroy',function(){
          $doc.off('keydown', handler);
        })

        $timeout(function() {
                focus($doc);
            }, 800);


        //----------------------------------------------------- DETALLES DE FACTURA -----------------------------------------

        //------------------------------------------------- FUNCIONES PARA DETALLE DE FACTURA -------------------------------------------------
            $scope.totales=$localStorage.totales;
            $scope.update_detalles_fac=function(prods){
                $scope.detalles_fac=prods;  
                $scope.calc_totales($scope.detalles_fac);
            }

            
            $scope.add_prod_fac=function(prod){
                if (Facturacion_Service.ObjIndexOf($scope.detalles_fac,prod)==-1) {
                    prod.cantidad_fac=1;
                    prod.total_fac=parseFloat(prod.precio.replace('$','')).toFixed($scope.decimales);
                    $scope.detalles_fac.push(prod);
                }else{
                    var index=Facturacion_Service.ObjIndexOf($scope.detalles_fac,prod);
                    if ($scope.detalles_fac[index].cantidad_fac<$scope.detalles_fac[index].cantidad) {
                        $scope.detalles_fac[index].cantidad_fac=$scope.detalles_fac[index].cantidad_fac+1;
                        $scope.detalles_fac[index].total_fac=parseFloat(parseFloat($scope.detalles_fac[index].precio.replace('$','')).toFixed($scope.decimales)*$scope.detalles_fac[index].cantidad_fac).toFixed(2);
                    }
                }

                $scope.calc_totales($scope.detalles_fac);
            }

            $scope.remove_prod_fac=function(prod){
                    var index=$scope.detalles_fac.indexOf(prod);
                    if ($scope.detalles_fac[index].cantidad_fac>1) {
                        $scope.detalles_fac[index].cantidad_fac=$scope.detalles_fac[index].cantidad_fac-1;
                        $scope.detalles_fac[index].total_fac=parseFloat(parseFloat($scope.detalles_fac[index].precio.replace('$','')).toFixed($scope.decimales)*$scope.detalles_fac[index].cantidad_fac).toFixed(2);
                    }

                $scope.calc_totales($scope.detalles_fac);
            }

            $scope.delete_prod_fac=function(prod){
                var index=$scope.detalles_fac.indexOf(prod);
                $scope.detalles_fac.splice(index,1);
                $scope.calc_totales($scope.detalles_fac);
            }

            $scope.add_prod_fac_from_input=function(prod){
                if (prod.cantidad_fac=="") {
                    prod.cantidad_fac=1;
                }
                if (prod.cantidad_fac>prod.cantidad) {
                    prod.cantidad_fac=prod.cantidad;
                    prod.total_fac=parseFloat(parseFloat(prod.precio.replace('$','')).toFixed($rootScope.decimales)*prod.cantidad_fac).toFixed($rootScope.decimales);
                }else{
                    prod.total_fac=parseFloat(parseFloat(prod.precio.replace('$','')).toFixed($rootScope.decimales)*prod.cantidad_fac).toFixed($rootScope.decimales);
                }
                $scope.calc_totales($scope.detalles_fac);
            }


            $scope.calc_totales=function(detalles_fac){
                $scope.subtotal_12=0.00;
                $scope.subtotal_14=0.00;
                $scope.subtotal_0=0.00;
                $scope.subtotal_No_Objeto=0.00;
                $scope.subtotal_Excento=0.00;
                $scope.Total_Sin_Impuesto=0.00;
                $scope.Total_Con_Impuesto=0.00;
                $scope.iva_0=0.00;
                $scope.iva_12=0.00;
                $scope.iva_14=0.00;
                for (var i = 0; i < detalles_fac.length; i++) {
                    switch(detalles_fac[i].impuesto) {
                        case 0:
                            $scope.subtotal_0=parseFloat(parseFloat($scope.subtotal_0)+parseFloat(detalles_fac[i].total_fac)).toFixed($rootScope.decimales);
                            break;
                        case 2:
                        $scope.subtotal_12=parseFloat(parseFloat($scope.subtotal_12)+parseFloat(detalles_fac[i].total_fac)).toFixed($rootScope.decimales);
                            break;
                        case 3:
                        $scope.subtotal_14=parseFloat(parseFloat($scope.subtotal_14)+parseFloat(detalles_fac[i].total_fac)).toFixed($rootScope.decimales);
                            break;
                            case 6:
                        $scope.subtotal_No_Objeto=parseFloat(parseFloat($scope.subtotal_No_Objeto)+parseFloat(detalles_fac[i].total_fac)).toFixed($rootScope.decimales);
                            break;
                            case 7:
                        $scope.subtotal_Excento=parseFloat(parseFloat($scope.subtotal_Excento)+parseFloat(detalles_fac[i].total_fac)).toFixed($rootScope.decimales);
                            break;
                    }

                    $scope.Total_Sin_Impuesto=parseFloat(parseFloat($scope.Total_Sin_Impuesto)+parseFloat(detalles_fac[i].total_fac)).toFixed($rootScope.decimales);
                }


                for (var i = 0; i < $scope.totales.length; i++) {
                    switch($scope.totales[i].codigo) {
                        case 0:
                        $scope.totales[i].valor=$scope.subtotal_0;
                            break;
                        case 2:
                        $scope.totales[i].valor=$scope.subtotal_12;
                            break;
                        case 3:
                        $scope.totales[i].valor=$scope.subtotal_14;
                            break;
                            case 6:
                        $scope.totales[i].valor=$scope.subtotal_No_Objeto;
                            break;
                            case 7:
                        $scope.totales[i].valor=$scope.subtotal_Excento;
                            break;
                            case 'iva0':
                            for (var j = 0; j < $scope.totales.length; j++) {
                                if ($scope.totales[j].codigo==0) {
                                    $scope.iva_0=parseFloat(($scope.totales[j].valor*$scope.totales[j].porcentaje)/100).toFixed($rootScope.decimales);
                                    $scope.totales[i].valor=$scope.iva_0;

                                }
                            }
                            break;
                            case 'iva3':
                            for (var j = 0; j < $scope.totales.length; j++) {
                                if ($scope.totales[j].codigo==3) {
                                    $scope.iva_14=parseFloat(($scope.totales[j].valor*$scope.totales[j].porcentaje)/100).toFixed($rootScope.decimales);
                                    $scope.totales[i].valor=$scope.iva_14;
                                }
                            }
                            break;
                            case 'total_sin_impuestos':
                            $scope.totales[i].valor=parseFloat($scope.Total_Sin_Impuesto).toFixed($rootScope.decimales);
                            break;

                            case 'total_con_impuestos':
                            $scope.Total_Con_Impuesto=(parseFloat($scope.Total_Sin_Impuesto) + parseFloat($scope.iva_14)).toFixed($rootScope.decimales);
                            $scope.totales[i].valor=$scope.Total_Con_Impuesto;
                            break;
                    }
                }

            }

        // ------------------------------------------------- LOAD IMPUESTOS-----------------------------------------

        function success_impuestos(result){ 
                $scope.totales =[];

                for (var i = 0; i < result.respuesta.data.length; i++) {
                    $scope.totales.push({'label':result.respuesta.data[i].nombre,codigo:result.respuesta.data[i].id,porcentaje:result.respuesta.data[i].cantidad,valor:0});
                }
                
                $scope.totales.push({'label':'Total sin Impuesto ',codigo:'total_sin_impuestos',valor:0});
                $scope.totales.push({'label':'Total con Impuestos ',codigo:'total_con_impuestos',valor:0});

                $localStorage.totales =$scope.totales;
            }

            $scope.get_impuestos=function(){
                Contabilidad_Service.Get_Impuestos().get({},success_impuestos).$promise;
            }
            
            $scope.get_impuestos();

            //---------------------------------------------------------- LLENAR DATOS DEL CLIENTE ---------------------------------------//
                var cm = $scope;
                //----------------SELECT CIUDADES---------------//
                function success_ciudades(result) {
                    cm.selectCallback = selectCallback;
                        cm.ListLocalizacion = result.respuesta;
                        cm.ModelLocalizacion = {
                            selectedLocalizacion: undefined
                        };
                }

                $scope.data_ciudades = function() {
                    colaboradores_Service.Get_Ciudades().get($scope.query, success_ciudades).$promise;
                }
                $scope.data_ciudades();

                function success_buscar_cliente(result){
                    if (result.respuesta==true) {
                        $scope.data=result.persona;
                    $scope.data.nombres=result.persona.primer_nombre+' '+result.persona.segundo_nombre;
                    $scope.data.apellidos=result.persona.primer_apellido+' '+result.persona.segundo_apellido;
                    $scope.data.direccion=result.persona.calle+', '+result.persona.transversal+', '+result.persona.numero;

                    for (var i = 0; i < cm.ListLocalizacion.length; i++) {
                        if (cm.ListLocalizacion[i].id==result.persona.id_localidad) {
                            cm.ModelLocalizacion.selectedLocalizacion=cm.ListLocalizacion[i];
                            break;
                        }
                    }
                    }

                }

            $scope.buscar_cliente=function(){
                if ($scope.data&&$scope.data.ruc_ci) {
                    if ($scope.data.ruc_ci.length==10||$scope.data.ruc_ci.length==13) {
                            Facturacion_Service.Get_Cliente_By_Ruc_Ci().send({ruc_ci:$scope.data.ruc_ci},success_buscar_cliente).$promise;
                        }
                }else{
                    $scope.data={};
                    cm.ModelLocalizacion.selectedLocalizacion=undefined;
                }
            }

            $scope.cambiar_tipo_cliente=function(){
                if ($scope.cliente=='SI') {
                    $scope.cliente=='NO';
                    $scope.data.ruc_ci=="";
                    $scope.data={};
                }else{
                    $scope.data={
                        ruc_ci:'999999999',
                        nombres:"COSUMIDOR FINAL",
                        apellidos:"",
                        telefono:"999999",
                        correo:"",
                        direccion:"",
                    }
                }
            }

            $scope.cambiar_tipo_cliente();

            
            
    	

    });
   

