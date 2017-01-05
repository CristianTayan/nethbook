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
	    	console.log(obj.factura);
	    	$scope.tipo_consumo = tipo_consumo;
	    	var vec = [];
	    	if(!obj.factura.detalles.detalle.length){
	    		vec[0] = obj.factura.detalles.detalle;
	    		$scope.detalle = vec;
	    	}else{
	    		$scope.detalle = obj.factura.detalles.detalle;
	    	}

	    	// $scope.comprobante = obj.factura.detalles;
	    	// console.log($scope.comprobante);

		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };
		}
	});