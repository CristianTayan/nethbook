'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:RepositorioFacturasCtrl
 * @description
 * # RepositorioFacturasCtrl
 * Controller of the nextbook20App
 */
	var app = angular.module('nextbook20App')
    app.controller('RepositorioFacturasCtrl', function() {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });



    
    app.controller('subir_factura_electronica_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, IO_BARCODE_TYPES) {
	    repositorioFacturas.Get_Gastos().get().$promise.then(function(data) {
	        $scope.tipo_consumos = data.respuesta.data;
	    });
	    // $scope.data = 	{
					//         clave: '1201201701170674050100120020100000187700000015911'
					//     };

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
	        var xml = $fileContent;
	        if (xml.length != 0) {
	            var x2js = new X2JS();
	            var xml_final = x2js.xml_str2json(xml);
	            var nombre_empresa = _.keys(xml_final);

	            var xml_sin_empresa = xml_final[nombre_empresa[0]];
	            var xml_final;
	            var resultado = buscar_comprobante(xml_sin_empresa);
	            if (resultado) { // Verdadero
	                xml_final = xml_sin_empresa.comprobante;
	            } else {
	                var campos_vector = _.keys(xml_sin_empresa);
	                for (var i = 0; i < campos_vector.length; i++) {
	                    var entrada1 = xml_sin_empresa[campos_vector[i]];
	                    if (typeof entrada1 == "object") {
	                        var vector_secundario = entrada1[_.keys(entrada1)];
	                        var resultado2 = buscar_comprobante(vector_secundario);
	                        xml_final = vector_secundario.comprobante;
	                    }
	                }
	            }
	            
	            var data;
	            if (typeof xml_final == "object") {
	            	data = [{
		                clave: xml_final.factura.infoTributaria.claveAcceso
		            }];
	            }else{
	            	var xml;
		            var xml_filter = x2js.xml_str2json(xml_final);
		            if (!xml_filter) {
		                var f = xml_final;
		                var m = f.replace("<![CDATA[", "");
		                var m = m.replace("]]>", "");
		                var xml_filter = x2js.xml_str2json(m);
		            }
		            data = [{
		                clave: xml_filter.factura.infoTributaria.claveAcceso
		            }];		            
	            }
	            revision_factura(data);	            
	        }
	    };
	    $scope.buscar_clave_acceso = function() {
	        revision_factura($scope.data);
	    }

	    function revision_factura(data) {
	        repositorioFacturas.Estado_Factura().add(data[0]).$promise.then(function(data) {
	            $mdDialog.show({
	                controller: modal_Ctrl,
	                templateUrl: 'views/app/repositorio_facturas/subir_facturas/modal.html',
	                parent: angular.element(document.body),
	                clickOutsideToClose: false,
	                locals: {
	                    obj: data,
	                    tipo_consumo: $scope.tipo_consumos
	                }
	            });
	            if (data.respuesta == true) {
	                $mdDialog.show(
	                    $mdDialog.alert()
	                    .parent(angular.element(document.querySelector('#dialogContainer')))
	                    .clickOutsideToClose(true)
	                    .title('NextBook')
	                    .textContent('Registro Agregado Correctamente')
	                    .ariaLabel('Registro Agregado Correctamente')
	                    .ok('Ok!')
	                    .openFrom('#left')
	                );
	            } else {
	                if (data.respuesta == false) {
	                    $mdDialog.show(
	                        $mdDialog.alert()
	                        .parent(angular.element(document.querySelector('#dialogContainer')))
	                        .clickOutsideToClose(true)
	                        .title('NextBook')
	                        .textContent('Clave de Acceso no Válida ')
	                        .ariaLabel('Clave de Acceso no Válida')
	                        .ok('Ok!')
	                        .openFrom('#left')
	                    );
	                }
	            }
	        });
	    };

	    function modal_Ctrl($scope, $mdDialog, obj, tipo_consumo, IO_BARCODE_TYPES) {
	    	$scope.factura_cabecera = obj.autorizaciones.autorizacion;

			repositorioFacturas.Get_Tipo_Documentos().get().$promise.then(function(data) {
		        // $scope.tipo_consumos = data.respuesta.data;
		        console.log(data);
		    });

	        var x2js = new X2JS();
	        var obj = x2js.xml_str2json(obj.autorizaciones.autorizacion.comprobante);
	        $scope.infofactura = obj.factura;
	        $scope.tipo_consumo = tipo_consumo;
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
	            // backgroundColor: '#3F51B5',
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
	        for (var i = 0; i < tipo_consumo.length; i++) {
	            array_gastos.push({
	                id: tipo_consumo[i].id,
	                nombre: tipo_consumo[i].nombre,
	                selected: false
	            });
	        }

	        for (var i = 0; i < $scope.detalle.length; i++) {
	            $scope.detalle[i].gasto = array_gastos;
	        }

	        //-------------------------------------------------------- Sumar y Asignar cada producto a un tipo de gasto -------------------------
	        $scope.valores_sumados = [];
	        $scope.select_gasto = function(item, gasto) {

	        		$scope.reset_all_gastos();
	                var index;
	                var index_valor;
	                var obj_valor_sumado;

	                index = $scope.detalle.indexOf(item);
	                for (var i = 0; i < $scope.detalle[index].gasto.length; i++) {
	                    if ($scope.detalle[index].gasto[i].nombre == gasto.nombre) {
	                        $scope.detalle[index].gasto[i].selected = true;
	                    } else {
	                        $scope.detalle[index].gasto[i].selected = false;
	                    }
	                }
	                obj_valor_sumado = {};
	                obj_valor_sumado.gasto = gasto.nombre;
	                obj_valor_sumado.valor = item.precioTotalSinImpuesto;

	                index_valor = $scope.valores_sumados.map(function(e) {
	                    return e.valor;
	                }).indexOf(item.precioTotalSinImpuesto);
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
	                                                // console.log('valor actual:'+$scope.valores_sumados[index_valor].gasto+'- valor actual:'+$scope.tipo_consumo[k].nombre+'- restar'+$scope.valores_sumados[index_valor].valor);
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

	            }
	            //-------------------------------------------------------- Sumar y Asignar todos los productos a un tipo de gasto -------------------------
	        $scope.select_all_gasto = function(gasto) {

	            $scope.Suma = 0;
	            var index = 0;
	            index = $scope.tipo_consumo.indexOf(gasto);
	            switch (gasto.nombre) {
	                case 'ALIMENTACION':
	                    for (var i = 0; i < $scope.detalle.length; i++) {
	                        $scope.Suma = $scope.Suma + parseFloat($scope.detalle[i].precioTotalSinImpuesto);
	                    }
	                    $scope.tipo_consumo[index].total = $scope.Suma;
	                    break;
	                case 'EDUCACION':
	                    for (var i = 0; i < $scope.detalle.length; i++) {
	                        $scope.Suma = $scope.Suma + parseFloat($scope.detalle[i].precioTotalSinImpuesto);
	                    }
	                    $scope.tipo_consumo[index].total = $scope.Suma;
	                    break;
	                case 'SALUD':
	                    for (var i = 0; i < $scope.detalle.length; i++) {
	                        $scope.Suma = $scope.Suma + parseFloat($scope.detalle[i].precioTotalSinImpuesto);
	                    }
	                    $scope.tipo_consumo[index].total = $scope.Suma;
	                    break;
	                case 'VESTIMENTA':
	                    for (var i = 0; i < $scope.detalle.length; i++) {
	                        $scope.Suma = $scope.Suma + parseFloat($scope.detalle[i].precioTotalSinImpuesto);
	                    }
	                    $scope.tipo_consumo[index].total = $scope.Suma;
	                    break;
	                case 'VIVIENDA':
	                    for (var i = 0; i < $scope.detalle.length; i++) {
	                        $scope.Suma = $scope.Suma + parseFloat($scope.detalle[i].precioTotalSinImpuesto);
	                    }
	                    $scope.tipo_consumo[index].total = $scope.Suma;
	                    break;
	            }

	            for (var i = 0; i < $scope.tipo_consumo.length; i++) {
	                if ($scope.tipo_consumo[i].nombre == gasto.nombre) {
	                    $scope.tipo_consumo[i].selected = true;
	                    //$scope.tipo_consumo[i].total=$scope.Suma;
	                } else {
	                    $scope.tipo_consumo[i].total = 0;
	                    $scope.tipo_consumo[i].selected = false;
	                }
	            }

	            // console.log($scope.tipo_consumo);
	        }
	        $scope.reset_all_gastos = function(gasto) {

	        	for (var i = 0; i < $scope.tipo_consumo.length; i++) {
	                    $scope.tipo_consumo[i].selected = false;
	            }
	        }

	        //--------------------------------------- GUardar Factura ---------------------------------------
	        $scope.guardar_factura = function() {
	            console.log($scope.tipo_consumo);

	            repositorioFacturas.Upload_Factura().add({
	                factura: $scope.infofactura,
	                totales_tipo_gasto: $scope.tipo_consumo
	            }).$promise.then(function(data) {
	                console.log(data);
	            })
	        };

	        $scope.cancel = function() {
	            $mdDialog.cancel();
	        };
	    }
	});

	app.controller('leer_correo_facturas_electronica_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage, IO_BARCODE_TYPES, $rootScope) {

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

		    $scope.data_inv_producto_get = function() {
		        repositorioFacturas.Leer_Facturas_Correo().get($scope.query, success).$promise;
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
			$scope.procesar = function(data){
				repositorioFacturas.Estado_Factura().add({clave:data}).$promise.then(function(data) {
		            $mdDialog.show({
		                controller: modal_Ctrl,
		                templateUrl: 'views/app/repositorio_facturas/subir_facturas/modal.html',
		                parent: angular.element(document.body),
		                clickOutsideToClose: false,
		                locals: {
		                    obj: data,
		                    tipo_consumo: $scope.tipo_consumos
		                }
		            });
		            if (data.respuesta == true) {
		                $mdDialog.show(
		                    $mdDialog.alert()
		                    .parent(angular.element(document.querySelector('#dialogContainer')))
		                    .clickOutsideToClose(true)
		                    .title('NextBook')
		                    .textContent('Registro Agregado Correctamente')
		                    .ariaLabel('Registro Agregado Correctamente')
		                    .ok('Ok!')
		                    .openFrom('#left')
		                );
		            } else {
		                if (data.respuesta == false) {
		                    $mdDialog.show(
		                        $mdDialog.alert()
		                        .parent(angular.element(document.querySelector('#dialogContainer')))
		                        .clickOutsideToClose(true)
		                        .title('NextBook')
		                        .textContent('Clave de Acceso no Válida ')
		                        .ariaLabel('Clave de Acceso no Válida')
		                        .ok('Ok!')
		                        .openFrom('#left')
		                    );
		                }
		            }
		        });
			}

			function modal_Ctrl($scope, $mdDialog, obj, IO_BARCODE_TYPES,repositorioFacturas,$localStorage) {
	    	$scope.factura_cabecera = obj.autorizaciones.autorizacion;

	    	$scope.query_tipo_gastos = {
		        filter: '',
		        num_registros: 100,
		        pagina_actual: 1,
		        limit: '100',
		        page_num: 1
		    };

		    		/// Leer tipos de Gastos---------------------------------
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
	            height: 50,
	            displayValue: false,
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
	        $scope.select_gasto = function(item, gasto) {
	                var index;
	                var index_valor;
	                var obj_valor_sumado;
	                index = $scope.detalle.indexOf(item);
	                
	                for (var i = 0; i < $scope.tipo_consumo.length; i++) {
	                	if ($scope.tipo_consumo[i].total==$scope.Suma_detalles) {
	                		console.log($scope.valores_restados.indexOf(item));
	                		if ($scope.valores_restados.indexOf(item)==-1) {
	                			$scope.valores_restados.push(item);
	                			$scope.tipo_consumo[i].total=(parseFloat($scope.tipo_consumo[i].total) - parseFloat($scope.detalle[index].precioTotalSinImpuesto)).toFixed(2);
	                			$scope.Suma_detalles=$scope.tipo_consumo[i].total;
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

	             $scope.Suma_detalles=$scope.Suma;
	             $scope.valores_restados = [];
	        }

	        //--------------------------------------- GUardar Factura ---------------------------------------
	        $scope.guardar_factura = function() {
	            console.log($scope.tipo_consumo);

	            repositorioFacturas.Upload_Factura().add({
	                factura: $scope.infofactura,
	                totales_tipo_gasto: $scope.tipo_consumo
	            }).$promise.then(function(data) {
	                console.log(data);
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

