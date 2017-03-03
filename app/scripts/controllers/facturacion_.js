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
    	
    	// -------------------------------------GENERACION MENU-------------------------------------
        menuService.Get_Vistas_By_Tipo_User().get().$promise.then(function(data) {
            $scope.menu = data.respuesta[0].children[2].children[2];
        });

    });

	app.controller('fac_mis_facturas_venta_Ctrl', function($mdDialog, $scope) {
    	
    	console.log('mis facturas');

    });

    app.controller('fac_nueva_factura_venta_Ctrl', function($mdDialog,$document, $scope,inventario_Service,Contabilidad_Service,$rootScope,$localStorage,colaboradores_Service,Facturacion_Service) {
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

        function DialogController_add($scope,detalles_fac,$rootScope,Facturacion_Service) {
            $scope.add_prods=(detalles_fac.length>0) ?detalles_fac:[];

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
                                $scope.productos[i].cantidad_fac=0;
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
                inventario_Service.Get_Producto().get($scope.query,success_tabla).$promise.then(function(){},function(error){
                    $scope.get_tabla();
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

            //------------------------------------------------- FUNCIONES PARA MODODAL ADD PRODUCTOS  -------------------------------------------------
            $scope.add_prod_fac=function(prod){

                if (Facturacion_Service.ObjIndexOf($scope.add_prods,prod)==-1) {
                    prod.cantidad_fac=1;
                    prod.total_fac=parseFloat(prod.precio.replace('$','')).toFixed($rootScope.decimales);
                    $scope.add_prods.push(prod);
                }else{
                    var index=Facturacion_Service.ObjIndexOf($scope.add_prods,prod);
                    if ($scope.add_prods[index].cantidad_fac<$scope.add_prods[index].cantidad) {
                        $scope.add_prods[index].cantidad_fac=$scope.add_prods[index].cantidad_fac+1;
                        prod.cantidad_fac=$scope.add_prods[index].cantidad_fac;
                        $scope.add_prods[index].total_fac=parseFloat(parseFloat($scope.add_prods[index].precio.replace('$','')).toFixed($rootScope.decimales)*$scope.add_prods[index].cantidad_fac).toFixed($rootScope.decimales);
                    }
                }
                    
            }

            $scope.remove_prod_fac=function(prod){

                var index=Facturacion_Service.ObjIndexOf($scope.add_prods,prod);
                if (index!=-1) {
                    if ($scope.add_prods[index].cantidad_fac>1) {
                        $scope.add_prods[index].cantidad_fac=$scope.add_prods[index].cantidad_fac-1;
                        prod.cantidad_fac=$scope.add_prods[index].cantidad_fac;
                        $scope.add_prods[index].total_fac=parseFloat(parseFloat($scope.add_prods[index].precio.replace('$','')).toFixed($scope.decimales)*$scope.add_prods[index].cantidad_fac).toFixed($rootScope.decimales);
                    }
                }

            }


            $scope.add_prod_fac_from_input=function(prod){
                    if (prod.cantidad_fac==null||prod.cantidad_fac==""||prod.cantidad_fac==undefined) {
                        prod.cantidad_fac=1;
                    }

                     if (prod.cantidad_fac>prod.cantidad) {
                        prod.cantidad_fac=prod.cantidad;
                        prod.total_fac=parseFloat(parseFloat(prod.precio.replace('$','')).toFixed($rootScope.decimales)*prod.cantidad_fac).toFixed($rootScope.decimales);
                    }else{
                        prod.total_fac=parseFloat(parseFloat(prod.precio.replace('$','')).toFixed($rootScope.decimales)*prod.cantidad_fac).toFixed($rootScope.decimales);
                    }

                    if (Facturacion_Service.ObjIndexOf($scope.add_prods,prod)==-1) {
                    // prod.cantidad_fac=1;
                    prod.total_fac=parseFloat(prod.precio.replace('$','')).toFixed($rootScope.decimales);
                    $scope.add_prods.push(prod);
                    }else{
                        var index=Facturacion_Service.ObjIndexOf($scope.add_prods,prod);
                        // if ($scope.add_prods[index].cantidad_fac<$scope.add_prods[index].cantidad) {
                            $scope.add_prods[index].cantidad_fac=prod.cantidad_fac;
                            // prod.cantidad_fac=$scope.add_prods[index].cantidad_fac;
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

                    $scope.data=result.respuesta;
                    var res = result.respuesta.razon_social.split(" ");
                    if (res.length==4) {
                        $scope.data.nombres=res[0]+' '+res[1];
                        $scope.data.apellidos=res[2]+' '+res[3];
                    }else{
                        $scope.data.nombres=res[0];
                        $scope.data.apellidos=res[1];
                    }

                    for (var i = 0; i < cm.ListLocalizacion.length; i++) {
                        if (cm.ListLocalizacion[i].id==result.respuesta.id_localizacion) {
                            cm.ModelLocalizacion.selectedLocalizacion=cm.ListLocalizacion[i];
                            break;
                        }
                    }

                }

            $scope.buscar_cliente=function(){
                if ($scope.data&&$scope.data.ruc_ci) {
                    if ($scope.data.ruc_ci.length==10||$scope.data.ruc_ci.length==13) {
                            Facturacion_Service.Clientes().Get_By_Ruc_Ci().send({ruc_ci:$scope.data.ruc_ci},success_buscar_cliente).$promise;
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
   

