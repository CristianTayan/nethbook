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

    app.controller('subir_factura_electronica_Ctrl', function($mdDialog, $scope, repositorioFacturas, $timeout, $localStorage) {
	    repositorioFacturas.Get_Gastos().get().$promise.then(function(data) {
	        $scope.tipo_consumos = data.respuesta.data;
	    });
	    // fin
	    $scope.showContent = function($fileContent) {
	    	var xml = $fileContent;
	    	if (xml.length != 0) {
	            var x2js = new X2JS();
	            var xmltotal = x2js.xml_str2json(xml);
	            console.log(xmltotal);
	            var xml2 = x2js.xml_str2json(xmltotal.autorizacion);
	            var llave = '';
	            for (var key in xmltotal) { llave = key; };
	            var resultado = xmltotal[key];
	        	var xml;
	            var final = x2js.xml_str2json(resultado.comprobante);
	            if (final) {
	            	xml = final;
	            }else{
	            	var f = resultado.comprobante;
	            	var m = f.replace("<![CDATA[", "");
	            	var m = m.replace("]]>", "");
	            	var final = x2js.xml_str2json(m);
	            	xml = final;
	            }
	            $scope.xml = xml;
	            $scope.guardar_factura_electronica();
	            // var limite = xmltotal[key].comprobante.length;
	            // var com = xmltotal[key].comprobante.substring(limite - 3);

	            // if (com == ']]>') {
	            //     var xmlcomprobante = xmltotal[key].comprobante.substring(47, limite - 3);
	            // } else { var xmlcomprobante = xmltotal[key].comprobante; }
	            // var comprobantejson = x2js.xml_str2json(xmlcomprobante);
	            // $scope.xml = xmltotal.comprobante;
	            // var claveAcceso = comprobantejson.factura.infoTributaria.claveAcceso;
	        }
	    };
	    

	    $scope.guardar_factura_electronica = function() {
	        // repositorioFacturas.Upload_XML().add($scope.data).$promise.then(function(data) {
	        	$mdDialog.show({
			      controller: modal_Ctrl,
			      templateUrl: 'views/app/repositorio_facturas/subir_facturas/modal.html',
			      parent: angular.element(document.body),
			      clickOutsideToClose:true,
			      locals: 	{ 
			      				obj: $scope.xml,
			      				tipo_consumo: $scope.tipo_consumos
			      		 	}
			    });
	            // if (data.respuesta == true) {
	            //     $mdDialog.show(
	            //         $mdDialog.alert()
	            //         .parent(angular.element(document.querySelector('#dialogContainer')))
	            //         .clickOutsideToClose(true)
	            //         .title('NextBook')
	            //         .textContent('Registro Agregado Correctamente')
	            //         .ariaLabel('Registro Agregado Correctamente')
	            //         .ok('Ok!')
	            //         .openFrom('#left')
	            //     );
	            // } else {
	            //     if (data.respuesta == false) {
	            //         $mdDialog.show(
	            //             $mdDialog.alert()
	            //             .parent(angular.element(document.querySelector('#dialogContainer')))
	            //             .clickOutsideToClose(true)
	            //             .title('NextBook')
	            //             .textContent('Clave de Acceso no Válida ')
	            //             .ariaLabel('Clave de Acceso no Válida')
	            //             .ok('Ok!')
	            //             .openFrom('#left')
	            //         );
	            //     }
	            // }
	        // });
	    }

	    function modal_Ctrl($scope, $mdDialog, obj, tipo_consumo) {
	    	$scope.infofactura = obj.factura;
	    	$scope.tipo_consumo = tipo_consumo;

	    	for (var i = 0; i < $scope.tipo_consumo.length; i++) {
	    		$scope.tipo_consumo[i].total=0;
	    	}

	    	var vec = [];
	    	if(!obj.factura.detalles.detalle.length){
	    		vec[0] = obj.factura.detalles.detalle;
	    		$scope.detalle = vec;
	    	}else{
	    		$scope.detalle = obj.factura.detalles.detalle;
	    	}
	    	var array_gastos=[];
	    	for (var i = 0; i < tipo_consumo.length; i++) {
	    		array_gastos.push({id:tipo_consumo[i].id,nombre:tipo_consumo[i].nombre,selected:false});
	    	}

	    	for (var i = 0; i < $scope.detalle.length; i++) {
	    		$scope.detalle[i].gasto=array_gastos;
	    	}

	    	//-------------------------------------------------------- Sumar y Asignar cada producto a un tipo de gasto -------------------------
	    	$scope.valores_sumados=[];
	    	$scope.select_gasto=function(item,gasto){
	    		var index;
	    		var index_valor;
	    		var obj_valor_sumado;

	    		 index=$scope.detalle.indexOf(item);
	    		for (var i = 0; i < $scope.detalle[index].gasto.length; i++) {
	    			if ($scope.detalle[index].gasto[i].nombre==gasto.nombre) {
	    				$scope.detalle[index].gasto[i].selected=true;
	    			}else{
	    				$scope.detalle[index].gasto[i].selected=false;
	    			}
	    		}
	    		obj_valor_sumado={};
	    		obj_valor_sumado.gasto=gasto.nombre;
	    		obj_valor_sumado.valor=item.precioTotalSinImpuesto;

	    		index_valor= $scope.valores_sumados.map(function(e) { return e.valor; }).indexOf(item.precioTotalSinImpuesto);
	    		if (index_valor==-1) {
	    			$scope.valores_sumados.push(obj_valor_sumado);
	    		}
	    		
	    			for (var j = 0; j < $scope.detalle[index].gasto.length; j++) {
	    				if ($scope.detalle[index].gasto[j].selected==true) {
	    					for (var k = 0; k < $scope.tipo_consumo.length; k++) {
	    						if ($scope.detalle[index].gasto[j].nombre==$scope.tipo_consumo[k].nombre) {
	    							if (index_valor==-1) {
	    								$scope.tipo_consumo[k].total=(parseFloat($scope.tipo_consumo[k].total)+parseFloat($scope.detalle[index].precioTotalSinImpuesto)).toFixed(2);
	    								// console.log($scope.tipo_consumo[k].total);
	    							}else{
	    								for (var l = 0; l < $scope.tipo_consumo.length; l++) {
				    						if ($scope.valores_sumados[index_valor].gasto==$scope.tipo_consumo[l].nombre) {
				    							if (parseFloat($scope.tipo_consumo[l].total)>0) {
				    							// console.log('valor actual:'+$scope.valores_sumados[index_valor].gasto+'- valor actual:'+$scope.tipo_consumo[k].nombre+'- restar'+$scope.valores_sumados[index_valor].valor);
				    							$scope.tipo_consumo[l].total=(parseFloat($scope.tipo_consumo[l].total)-parseFloat($scope.valores_sumados[index_valor].valor)).toFixed(2);
				    							$scope.tipo_consumo[k].total=(parseFloat($scope.tipo_consumo[k].total)+parseFloat($scope.detalle[index].precioTotalSinImpuesto)).toFixed(2);
				    							$scope.valores_sumados[index_valor].gasto=$scope.tipo_consumo[k].nombre;
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
		    $scope.select_all_gasto=function(gasto){

		   	$scope.Suma=0;
	    	var index=0;
	    	index= $scope.tipo_consumo.indexOf(gasto);
		    	switch(gasto.nombre) {
		    		case 'ALIMENTACION':
			    	for (var i = 0; i < $scope.detalle.length; i++) {
	    					$scope.Suma=$scope.Suma+parseFloat($scope.detalle[i].precioTotalSinImpuesto);
	    				}
	    				$scope.tipo_consumo[index].total=$scope.Suma;
		    			break;
		    		case 'EDUCACION':
		    			for (var i = 0; i < $scope.detalle.length; i++) {
	    					$scope.Suma=$scope.Suma+parseFloat($scope.detalle[i].precioTotalSinImpuesto);
	    				}
	    				$scope.tipo_consumo[index].total=$scope.Suma;
		    			break;
		    		case 'SALUD':
		    			for (var i = 0; i < $scope.detalle.length; i++) {
	    					$scope.Suma=$scope.Suma+parseFloat($scope.detalle[i].precioTotalSinImpuesto);
	    				}
	    				$scope.tipo_consumo[index].total=$scope.Suma;
		    			break;
		    		case 'VESTIMENTA':
		    			for (var i = 0; i < $scope.detalle.length; i++) {
	    					$scope.Suma=$scope.Suma+parseFloat($scope.detalle[i].precioTotalSinImpuesto);
	    				}
	    				$scope.tipo_consumo[index].total=$scope.Suma;
		    			break;
		    		case 'VIVIENDA':
		    			for (var i = 0; i < $scope.detalle.length; i++) {
	    					$scope.Suma=$scope.Suma+parseFloat($scope.detalle[i].precioTotalSinImpuesto);
	    				}
	    				$scope.tipo_consumo[index].total=$scope.Suma;
		    			break;
		    	}

	    	for (var i = 0; i < $scope.tipo_consumo.length; i++) {
	    		if ($scope.tipo_consumo[i].nombre==gasto.nombre) {
	    			$scope.tipo_consumo[i].selected=true;
	    			//$scope.tipo_consumo[i].total=$scope.Suma;
	    		}else{
	    			$scope.tipo_consumo[i].total=0;
	    			$scope.tipo_consumo[i].selected=false;
	    		}
	    	}
	    	
	    	// console.log($scope.tipo_consumo);
	    	}

	    	//--------------------------------------- GUardar Factura ---------------------------------------
	    	$scope.guardar_factura= function() {
		      console.log($scope.tipo_consumo);

		      repositorioFacturas.Upload_Factura().add({factura:$scope.infofactura,totales_tipo_gasto:$scope.tipo_consumo}).$promise.then(function(data){
		      	console.log(data);
		      })
		    };

		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };
		}
	});