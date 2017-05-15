'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:RepositorioFacturasCtrl
 * @description
 * # RepositorioFacturasCtrl
 * Controller of the nextbook20App
 */
	var app = angular.module('nextbook20App')
    app.controller('RepositorioFacturasCtrl', function($scope) {
        console.log('test');
        // $scope.theme = 'teal';
	      // $scope.changeTheme = function() {
	        $scope.theme = $scope.theme === 'indigo' ? 'lime' : 'indigo'; 
	      // };

    });

    app.controller('repositorio_facturas_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, $filter, menuService) {

        // ------------------------------------inicio generacion vista menu personalizacion------------------------------------
	        var data = menuService.Get_Vistas_Loged_User();
	        $scope.menu = data.respuesta[0].children[0].children[5];
	    // --------------------------------------fin generacion vista menu personalizacion-------------------------------------

    });

    app.controller('repfac_inicio_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, $filter, menuService) {
    	
    	// -----------------------------------INFORMACION GASTOS--------------------------------
    	
	    repositorioFacturas.Get_Totales_Facturas().get({codigo_sri:$localStorage.sucursal.codigo_sri}).$promise.then(function(data) {
	    	$scope.myChartObject = {};
	    	var data = data.respuesta;
	    	var rows = [];	    	
	    	for (var i = 0; i < data.length; i++) {
	    		var valor = repositorioFacturas.money(data[i].total);
	    		var sub_arrow = [{v:data[i].nombre},{v:valor}];
	    		rows.push({c:sub_arrow});
	    	}
	    	var rows = rows;	    	
		    $scope.myChartObject.type = "PieChart";	    
		    $scope.onions = [
		        {v: "Onions"},
		        {v: 3}
		    ];
		    $scope.myChartObject.data = {"cols": [
		        {id: "t", label: "Compras", type: "string"},
		        {id: "s", label: "Gastos", type: "number"}
		    ], rows: rows};
		    $scope.myChartObject.options = {
		        'title': 'GASTOS GENERADOS'
		    };
	    });

	    // Change LANGUAGE
	    $scope.changeLanguage = function (key) {
		    $translate.use(key);
		};
    });
    
    app.controller('subir_factura_electronica_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, IO_BARCODE_TYPES) {

	    $scope.query_tipo_gastos = {
	        filter: '',
	        num_registros: 100,
	        pagina_actual: 1,
	        limit: '100',
	        page_num: 1
	    };

	    // -----------------------------------Leer tipos de Gastos---------------------------------
	    repositorioFacturas.Get_Gastos().get($scope.query_tipo_gastos).$promise.then(function(data) {
	        $localStorage.tipo_consumos = data.respuesta.data;
	        $scope.tipo_consumos = data.respuesta.data;
	    });




	    var buscar_comprobante = function(xml_sin_empresa) {
	        var campos_vector = _.keys(xml_sin_empresa);
	        for (var i = 0; i < campos_vector.length; i++) {
	            if (campos_vector[i] == 'comprobante') {
	                return true;
	                break;
	            }
	        }
	        return false;
	    }

	    $scope.showContent = function($fileContent) {
	    	var clave_acceso = repositorioFacturas.Extraer_Clave_Acceso($fileContent);
	    	revision_factura(clave_acceso);
	    };
	    $scope.buscar_clave_acceso = function() {
	        revision_factura($scope.data);
	    }

	    function revision_factura(data) {
	        repositorioFacturas.Estado_Factura().add(data).$promise.then(function(data) {
			    if (data.numeroComprobantes==0) {
			        $mdDialog.show( {
			            controller: informativo_Ctrl, templateUrl: 'views/app/repositorio_facturas/subir_facturas/modal_informativo.html', 
			            parent: angular.element(document.body), 
			            clickOutsideToClose: false,
			        });
			    }
			    else {
			        $mdDialog.show( {
			            controller: modal_Ctrl, templateUrl: 'views/app/repositorio_facturas/subir_facturas/modal.html', 
			            parent: angular.element(document.body), 
			            clickOutsideToClose: false, 
			            locals: { obj: data, tipo_consumo: $scope.tipo_consumos }
			        });
			    }
			});
	    };

	    var  informativo_Ctrl = function($scope, $mdDialog) {
	    	$scope.cancel = function(){
	    		$mdDialog.cancel();	
	    	}            
        };

	    function modal_Ctrl($scope, $mdDialog, obj, tipo_consumo, IO_BARCODE_TYPES) {
	    	$scope.factura_cabecera = obj.autorizaciones.autorizacion;
			repositorioFacturas.Get_Tipo_Documentos().get().$promise.then(function(data) {
		        $scope.tipo_consumos = data.respuesta.data;
		    });
	        var x2js = new X2JS();
	        var obj = x2js.xml_str2json(obj.autorizaciones.autorizacion.comprobante);
	        $scope.infofactura = obj.factura;
	        $scope.tipo_consumo = tipo_consumo;
	        $scope.types = IO_BARCODE_TYPES
	        $scope.code = $scope.infofactura.infoTributaria.claveAcceso
	        $scope.pagos = $scope.infofactura.infoFactura.pagos;
	        $scope.type = 'CODE128B'


	        $scope.options = {
	            width: 1,
	            height: 40,
	            displayValue: true,
	            font: 'monospace',
	            textAlign: 'center',
	            fontSize: 21.5,
	            // backgroundColor: '#3F51B5',
	            lineColor: '#6D6D6D'
	        }

	         for (var i = 0; i < $scope.tipo_consumo.length; i++) {
			        $scope.tipo_consumo[i].total = 0;
			        $scope.tipo_consumo[i].selected = false;
			    }
			    var vec = [];
			    if (!obj.factura.detalles.detalle.length) {
			        vec[0] = obj.factura.detalles.detalle;
			        $scope.detalle = vec;
			    } else {
			        $scope.detalle = obj.factura.detalles.detalle;
			    }
			    var array_gastos = [];
			    for (var i = 0; i < $scope.tipo_consumo.length; i++) {
			        array_gastos.push({
			            id: $scope.tipo_consumo[i].id,
			            nombre: $scope.tipo_consumo[i].nombre,
			            selected: false
			        });
			    }

			    for (var i = 0; i < $scope.detalle.length; i++) {
			        $scope.detalle[i].gasto = array_gastos;
			    }
	        //-------------------------------------------------------- Sumar y Asignar cada producto a un tipo de gasto -------------------------
	        $scope.valores_sumados = [];
			    $scope.valores_restados = [];
			    $scope.valid_form=true;
			    $scope.select_gasto = function(item, gasto) {
			            var index;
			            var index_valor;
			            var obj_valor_sumado;
			            index = $scope.detalle.indexOf(item);

			            for (var i = 0; i < $scope.tipo_consumo.length; i++) {
			                if ($scope.tipo_consumo[i].total == $scope.Suma_detalles) {
			                    console.log($scope.valores_restados.indexOf(item));
			                    if ($scope.valores_restados.indexOf(item) == -1) {
			                        $scope.valores_restados.push(item);
			                        $scope.tipo_consumo[i].total = (parseFloat($scope.tipo_consumo[i].total) - parseFloat($scope.detalle[index].precioTotalSinImpuesto)).toFixed(2);
			                        $scope.Suma_detalles = $scope.tipo_consumo[i].total;
			                    }

			                    break;
			                }
			            }

			            for (var i = 0; i < $scope.detalle[index].gasto.length; i++) {
			                if ($scope.detalle[index].gasto[i].nombre == gasto.nombre) {
			                    $scope.detalle[index].gasto[i].selected = true;
			                } else {
			                    $scope.detalle[index].gasto[i].selected = false;
			                }
			            }
			            obj_valor_sumado = {};
			            obj_valor_sumado.gasto = gasto.nombre;
			            obj_valor_sumado.index_prod = index;
			            obj_valor_sumado.valor = item.precioTotalSinImpuesto;

			            index_valor = $scope.valores_sumados.map(function(e) {
			                return e.index_prod;
			            }).indexOf(index);
			            if (index_valor == -1) {
			                $scope.valores_sumados.push(obj_valor_sumado);
			            }

			            for (var j = 0; j < $scope.detalle[index].gasto.length; j++) {
			                if ($scope.detalle[index].gasto[j].selected == true) {
			                    for (var k = 0; k < $scope.tipo_consumo.length; k++) {
			                        if ($scope.detalle[index].gasto[j].nombre == $scope.tipo_consumo[k].nombre) {
			                            if (index_valor == -1) {
			                                $scope.tipo_consumo[k].total = (parseFloat($scope.tipo_consumo[k].total) + parseFloat($scope.detalle[index].precioTotalSinImpuesto)).toFixed(2);
			                                // console.log($scope.tipo_consumo[k].total);
			                            } else {
			                                for (var l = 0; l < $scope.tipo_consumo.length; l++) {
			                                    if ($scope.valores_sumados[index_valor].gasto == $scope.tipo_consumo[l].nombre) {
			                                        if (parseFloat($scope.tipo_consumo[l].total) > 0) {
			                                            //console.log('valor actual:'+$scope.valores_sumados[index_valor].gasto+'- valor actual:'+$scope.tipo_consumo[k].nombre+'- restar'+$scope.valores_sumados[index_valor].valor);
			                                            $scope.tipo_consumo[l].total = (parseFloat($scope.tipo_consumo[l].total) - parseFloat($scope.valores_sumados[index_valor].valor)).toFixed(2);
			                                            $scope.tipo_consumo[k].total = (parseFloat($scope.tipo_consumo[k].total) + parseFloat($scope.detalle[index].precioTotalSinImpuesto)).toFixed(2);
			                                            $scope.valores_sumados[index_valor].gasto = $scope.tipo_consumo[k].nombre;
			                                            break;
			                                        }
			                                    }
			                                }
			                            }
			                            //break;
			                        }
			                    }
			                    //break;
			                }
			            }

			            $scope.validar_formulario();


			        }
	            //-------------------------------------------------------- Sumar y Asignar todos los productos a un tipo de gasto -------------------------
	        $scope.select_all_gasto = function(gasto) {

			        $scope.Suma = 0;
			        var index = 0;
			        index = $scope.tipo_consumo.indexOf(gasto);

			        // Sumatoria total
			        for (var i = 0; i < $scope.detalle.length; i++) {
			            $scope.Suma = $scope.Suma + parseFloat($scope.detalle[i].precioTotalSinImpuesto);
			        }
			        $scope.tipo_consumo[index].total = $scope.Suma;

			        for (var i = 0; i < $scope.tipo_consumo.length; i++) {
			            if ($scope.tipo_consumo[i].nombre == gasto.nombre) {
			                $scope.tipo_consumo[i].selected = true;
			            } else {
			                $scope.tipo_consumo[i].total = 0.00;
			                $scope.tipo_consumo[i].selected = false;
			            }
			        }

			        $scope.Suma_detalles = $scope.Suma;
			        $scope.valores_restados = [];

			        $scope.valid_form=false;
			    }
			    //Validar Formulario
			    $scope.validar_formulario=function(){
		            if ($scope.valores_sumados.length==$scope.detalle.length) {
		            	$scope.valid_form=false;
		            }
			    }

	        //--------------------------------------- Guardar Factura ---------------------------------------
			    $scope.guardar_factura = function() {
			        repositorioFacturas.Upload_Factura().add({
			            factura: $scope.infofactura,
			            totales_tipo_gasto: $scope.tipo_consumo
			        }).$promise.then(function(data) {
			            if (data.respuesta) {
			            	$mdDialog.show(
			                    $mdDialog.alert()
			                    .parent(angular.element(document.querySelector('#dialogContainer')))
			                    .clickOutsideToClose(true)
			                    .title('NEXTBOOK')
			                    .textContent('DATOS ALMACENADOS')
			                    .ariaLabel('Factura Subida Correctamente')
			                    .ok('ENTENDIDO')
			                    .openFrom('#left')
			                );

			                $scope.data.clave = '';

			            }else{
			            	$mdDialog.show(
			                    $mdDialog.alert()
			                    .parent(angular.element(document.querySelector('#dialogContainer')))
			                    .clickOutsideToClose(true)
			                    .title('NEXTBOOK')
			                    .textContent('FACTURA YA EXISTE')
			                    .ariaLabel('PROCESO NO PUDO SER REALIZADO')
			                    .ok('ENTENDIDO')
			                    .openFrom('#left')
			                	);
			            }
			        })
			    };

			    $scope.cancel = function() {
			        $mdDialog.cancel();
			    };
	    }
	});

	app.controller('leer_correo_facturas_electronica_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, IO_BARCODE_TYPES, $rootScope, urlService) {

	    // ---------------------------------------------------------PROCESO LLENAR TABLA------------------------------------------------------------- 
		    $scope.selected = [];
		    var bookmark;
		    $scope.selected = [];
		    $scope.query = {
		        filter: '',
		        num_registros: 10,
		        pagina_actual: 1,
		        limit: '10',
		        page_num: 1
		    };

		    function success(desserts) {
		        $scope.total = desserts.respuesta.total;
		        $scope.productos = desserts.respuesta.data;
		    }

		    $scope.data_repfac_correo_get = function() {
		        repositorioFacturas.Leer_Facturas_Correo().get($scope.query, success).$promise;
		    }
		    $rootScope.$on("actualizar_tabla_correo_factura", function() {
		        $scope.data_repfac_correo_get();
		    });

		    $rootScope.$on("actualizar_tabla_productos", function() {
		        $scope.data_repfac_correo_get();
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
		        $scope.data_repfac_correo_get();
		    });
		// ------------------------------------------------------------PROCESANDO FACTURA------------------------------------------------------------
			$scope.procesar = function(item_correo){
				repositorioFacturas.Get_Xml_Factura_Correo().add(item_correo).$promise.then(function(data) {
					if (data.respuesta) {
	                	var clave_acceso = repositorioFacturas.Extraer_Clave_Acceso(data.file);
	                	proceso_factura(clave_acceso, item_correo);
					}else{
						console.log('test revision');
					}
				});				
			}

			function proceso_factura(data, item_correo){
				repositorioFacturas.Estado_Factura().add(data).$promise.then(function(data) {
		            if (data.numeroComprobantes==0) {
				        $mdDialog.show( {
				            controller: informativo_Ctrl, 
				            templateUrl: 'views/app/repositorio_facturas/subir_facturas/modal_informativo.html', 
				            parent: angular.element(document.body), 
				            clickOutsideToClose: false,
				        });
				    }
				    else {
				        $mdDialog.show( {
				            controller: modal_Ctrl, 
				            templateUrl: 'views/app/repositorio_facturas/subir_facturas/modal.html', 
				            parent: angular.element(document.body), 
				            clickOutsideToClose: false, 
				            locals: { obj: data, tipo_consumo: $scope.tipo_consumos, correo: item_correo }
				        });
				    }
		        });
			}
			var  informativo_Ctrl = function($scope, $mdDialog) {
		    	$scope.cancel = function(){
		    		$mdDialog.cancel();	
		    	}            
	        };

			function modal_Ctrl($scope, $mdDialog, obj, IO_BARCODE_TYPES, repositorioFacturas, $localStorage, correo, $rootScope) {
				$scope.item_info_id = correo;
			    $scope.factura_cabecera = obj.autorizaciones.autorizacion;

			    $scope.query_tipo_gastos = {
			        filter: '',
			        num_registros: 100,
			        pagina_actual: 1,
			        limit: '100',
			        page_num: 1
			    };

			    // -----------------------------------Leer tipos de Gastos---------------------------------
			    repositorioFacturas.Get_Gastos().get($scope.query_tipo_gastos).$promise.then(function(data) {
			        $localStorage.tipo_consumos = data.respuesta.data;
			    });
			    var x2js = new X2JS();
			    var obj = x2js.xml_str2json(obj.autorizaciones.autorizacion.comprobante);
			    $scope.infofactura = obj.factura;
			    $scope.tipo_consumo = $localStorage.tipo_consumos;
			    $scope.types = IO_BARCODE_TYPES
			    $scope.code = $scope.infofactura.infoTributaria.claveAcceso
			    $scope.type = 'CODE128B'

			    $scope.options = {
			        width: 1,
		            height: 40,
		            displayValue: true,
		            font: 'monospace',
		            textAlign: 'center',
		            fontSize: 21.5,
		            lineColor: '#6D6D6D'
			    }

			    for (var i = 0; i < $scope.tipo_consumo.length; i++) {
			        $scope.tipo_consumo[i].total = 0;
			    }
			    var vec = [];
			    if (!obj.factura.detalles.detalle.length) {
			        vec[0] = obj.factura.detalles.detalle;
			        $scope.detalle = vec;
			    } else {
			        $scope.detalle = obj.factura.detalles.detalle;
			    }
			    var array_gastos = [];
			    for (var i = 0; i < $scope.tipo_consumo.length; i++) {
			        array_gastos.push({
			            id: $scope.tipo_consumo[i].id,
			            nombre: $scope.tipo_consumo[i].nombre,
			            selected: false
			        });
			    }

			    for (var i = 0; i < $scope.detalle.length; i++) {
			        $scope.detalle[i].gasto = array_gastos;
			    }

			    //-------------------------------------------------------- Sumar y Asignar cada producto a un tipo de gasto -------------------------
			    $scope.valores_sumados = [];
			    $scope.valores_restados = [];
			    $scope.valid_form=true;
			    $scope.select_gasto = function(item, gasto) {
			            var index;
			            var index_valor;
			            var obj_valor_sumado;
			            index = $scope.detalle.indexOf(item);

			            for (var i = 0; i < $scope.tipo_consumo.length; i++) {
			                if ($scope.tipo_consumo[i].total == $scope.Suma_detalles) {
			                    console.log($scope.valores_restados.indexOf(item));
			                    if ($scope.valores_restados.indexOf(item) == -1) {
			                        $scope.valores_restados.push(item);
			                        $scope.tipo_consumo[i].total = (parseFloat($scope.tipo_consumo[i].total) - parseFloat($scope.detalle[index].precioTotalSinImpuesto)).toFixed(2);
			                        $scope.Suma_detalles = $scope.tipo_consumo[i].total;
			                    }

			                    break;
			                }
			            }

			            for (var i = 0; i < $scope.detalle[index].gasto.length; i++) {
			                if ($scope.detalle[index].gasto[i].nombre == gasto.nombre) {
			                    $scope.detalle[index].gasto[i].selected = true;
			                } else {
			                    $scope.detalle[index].gasto[i].selected = false;
			                }
			            }
			            obj_valor_sumado = {};
			            obj_valor_sumado.gasto = gasto.nombre;
			            obj_valor_sumado.index_prod = index;
			            obj_valor_sumado.valor = item.precioTotalSinImpuesto;

			            index_valor = $scope.valores_sumados.map(function(e) {
			                return e.index_prod;
			            }).indexOf(index);
			            if (index_valor == -1) {
			                $scope.valores_sumados.push(obj_valor_sumado);
			            }

			            for (var j = 0; j < $scope.detalle[index].gasto.length; j++) {
			                if ($scope.detalle[index].gasto[j].selected == true) {
			                    for (var k = 0; k < $scope.tipo_consumo.length; k++) {
			                        if ($scope.detalle[index].gasto[j].nombre == $scope.tipo_consumo[k].nombre) {
			                            if (index_valor == -1) {
			                                $scope.tipo_consumo[k].total = (parseFloat($scope.tipo_consumo[k].total) + parseFloat($scope.detalle[index].precioTotalSinImpuesto)).toFixed(2);
			                                // console.log($scope.tipo_consumo[k].total);
			                            } else {
			                                for (var l = 0; l < $scope.tipo_consumo.length; l++) {
			                                    if ($scope.valores_sumados[index_valor].gasto == $scope.tipo_consumo[l].nombre) {
			                                        if (parseFloat($scope.tipo_consumo[l].total) > 0) {
			                                            //console.log('valor actual:'+$scope.valores_sumados[index_valor].gasto+'- valor actual:'+$scope.tipo_consumo[k].nombre+'- restar'+$scope.valores_sumados[index_valor].valor);
			                                            $scope.tipo_consumo[l].total = (parseFloat($scope.tipo_consumo[l].total) - parseFloat($scope.valores_sumados[index_valor].valor)).toFixed(2);
			                                            $scope.tipo_consumo[k].total = (parseFloat($scope.tipo_consumo[k].total) + parseFloat($scope.detalle[index].precioTotalSinImpuesto)).toFixed(2);
			                                            $scope.valores_sumados[index_valor].gasto = $scope.tipo_consumo[k].nombre;
			                                            break;
			                                        }
			                                    }
			                                }
			                            }
			                            //break;
			                        }
			                    }
			                    //break;
			                }
			            }

			            $scope.validar_formulario();


			        }
			        //-------------------------------------------------------- Sumar y Asignar todos los productos a un tipo de gasto -------------------------
			    $scope.select_all_gasto = function(gasto) {

			        $scope.Suma = 0;
			        var index = 0;
			        index = $scope.tipo_consumo.indexOf(gasto);

			        // Sumatoria total
			        for (var i = 0; i < $scope.detalle.length; i++) {
			            $scope.Suma = $scope.Suma + parseFloat($scope.detalle[i].precioTotalSinImpuesto);
			        }
			        $scope.tipo_consumo[index].total = $scope.Suma;

			        for (var i = 0; i < $scope.tipo_consumo.length; i++) {
			            if ($scope.tipo_consumo[i].nombre == gasto.nombre) {
			                $scope.tipo_consumo[i].selected = true;
			            } else {
			                $scope.tipo_consumo[i].total = 0.00;
			                $scope.tipo_consumo[i].selected = false;
			            }
			        }

			        $scope.Suma_detalles = $scope.Suma;
			        $scope.valores_restados = [];

			        $scope.valid_form=false;
			    }
			    //Validar Formulario
			    $scope.validar_formulario=function(){
		            if ($scope.valores_sumados.length==$scope.detalle.length) {
		            	$scope.valid_form=false;
		            }
			    }

			    //--------------------------------------- Guardar Factura ---------------------------------------
			    $scope.guardar_factura = function() {
			        repositorioFacturas.Upload_Factura().add({
			            factura: $scope.infofactura,
			            totales_tipo_gasto: $scope.tipo_consumo,
			            id_factura_correo: $scope.item_info_id.id
			        }).$promise.then(function(data) {
			            if (data.respuesta) {
			            	$mdDialog.show(
			                    $mdDialog.alert()
			                    .parent(angular.element(document.querySelector('#dialogContainer')))
			                    .clickOutsideToClose(true)
			                    .title('NEXTBOOK')
			                    .textContent('DATOS ALMACENADOS')
			                    .ariaLabel('Factura Subida Correctamente')
			                    .ok('ENTENDIDO')
			                    .openFrom('#left')
			                );
			                $rootScope.$emit("actualizar_tabla_correo_factura", {});

			            }else{
			            	$mdDialog.show(
			                    $mdDialog.alert()
			                    .parent(angular.element(document.querySelector('#dialogContainer')))
			                    .clickOutsideToClose(true)
			                    .title('NEXTBOOK')
			                    .textContent('LO SENTIMOS')
			                    .ariaLabel('PROCESO NO PUDO SER REALIZADO')
			                    .ok('ENTENDIDO')
			                    .openFrom('#left')
			                	);
			            }
			        })
			    };

			    $scope.cancel = function() {
			        $mdDialog.cancel();
			    };
			}
	});

	app.controller('rechazadas_facturas_electronica_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, IO_BARCODE_TYPES, $rootScope) {
		repositorioFacturas.Get_Gastos().get().$promise.then(function(data) {
	        $scope.tipo_consumos = data.respuesta.data;
	    });
	    // ---------------------------------------------------------PROCESO LLENAR TABLA------------------------------------------------------------- 
	    $scope.selected = [];
		var bookmark;
		$scope.selected = [];
		$scope.query = {
		    filter: '',
		    num_registros: 10,
		    pagina_actual: 1,
		    limit: '10',
		    page_num: 1
		};

		function success(desserts) {
		    $scope.total = desserts.respuesta.total;
		    $scope.productos = desserts.respuesta.data;
		}

		$scope.data_fac_rechazadas_get = function() {
		    repositorioFacturas.Get_Facturas_Rechazadas().get($scope.query, success).$promise;
		}

		$rootScope.$on("tabla_facturas_rechazadas", function() {
		    $scope.data_fac_rechazadas_get();
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
		    $scope.data_fac_rechazadas_get();
		});

		$scope.procesar = function(item_correo) {
		    $mdDialog.show({
		        controller: modal_view_mensaje_Ctrl,
		        templateUrl: 'views/app/repositorio_facturas/facturas_rechazadas/modal_view_mensaje.html',
		        parent: angular.element(document.body),
		        clickOutsideToClose: false,
		        locals: {
		            obj: item_correo,
		        }
		    });
		}

		function modal_view_mensaje_Ctrl($scope, $mdDialog, obj) {
		    console.log(obj);
		    $scope.correo = obj;
		    $scope.cancel = function() {
		        $mdDialog.cancel();
		    };
		};	    	
	});

	app.controller('mis_facturas_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, IO_BARCODE_TYPES, $rootScope,$window) {

		$scope.ver_clave_acceso = function(data){
			$mdDialog.show({
		        controller: ver_clave_acceso_Ctrl,
		        templateUrl: 'views/app/repositorio_facturas/mis_facturas/modal_copy.html',
		        parent: angular.element(document.body),
		        clickOutsideToClose: true,
		        locals: {
		            obj: data
		        }
		    });
		}

		function ver_clave_acceso_Ctrl($scope, obj){
			$scope.item = obj;
		}



		$scope.filtromoney = function(string){
			return repositorioFacturas.money(string);
		}
		//---------------------------------------------------------LLENADO TIPO DOCUMENTOS-----------------------------------------------------------
		repositorioFacturas.Get_Tipo_Documentos().get().$promise.then(function(data) {
	        $scope.tipo_consumos = data.respuesta;
	    });


		console.log($localStorage.sucursal.codigo_sri);
	    $scope.rep_fac_tipo_doc_filtro = function(data){
	    	$scope.query = {
			    filter: '',
			    num_registros: 10,
			    pagina_actual: 1,
			    limit: '10',
			    page_num: 1,
			    codigo_sucursal: $localStorage.sucursal.codigo_sri,
			    id_tipo_documento:data.id
			};
			$scope.data_mis_facturas_get()
	    }

	    // ---------------------------------------------------------PROCESO LLENAR TABLA------------------------------------------------------------- 
	    $scope.selected = [];
		var bookmark;
		$scope.selected = [];

		$scope.query = {
		    filter: '',
		    num_registros: 10,
		    pagina_actual: 1,
		    limit: '10',
		    page_num: 1,
		    codigo_sucursal: $localStorage.sucursal.codigo_sri,
		    id_tipo_documento:'01'
		};

		function success(desserts) {
		    $scope.total = desserts.respuesta.total;
		    $scope.mis_facturas = desserts.respuesta.data;
		}

		$scope.data_mis_facturas_get = function() {
		    repositorioFacturas.Get_Mis_Facturas().get($scope.query, success).$promise;
		}

		$rootScope.$on("tabla_mis_facturas", function() {
		    $scope.data_mis_facturas_get();
		});
		//Totales
		repositorioFacturas.Get_Totales_Facturas().get().$promise.then(function(data) {
	        $scope.totales = data.respuesta;
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
		    $scope.data_mis_facturas_get();
		});

		$scope.ver_factura = function(factura) {
		    
		    repositorioFacturas.Generar_PDF().get({factura:factura}).$promise.then(function(data) {
	        	if (data.respuesta==true) {
	        		var url = data.url;
    				// $window.open(url, "_blank");
    				$window.open(url, 'C-Sharpcorner', 'width=800,height=700');
	        	}
	    	});
		    
		}

		function modal_view_mensaje_Ctrl($scope, $mdDialog, obj) {
		    console.log(obj);
		    $scope.correo = obj;
		    $scope.cancel = function() {
		        $mdDialog.cancel();
		    };
		};	    	
	});

