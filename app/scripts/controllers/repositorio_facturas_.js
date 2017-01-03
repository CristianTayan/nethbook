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
	    // repositorioFacturas.cmbtipoconsumo().get().$promise.then(function(data) {
	    //     $scope.tipo_consumos = data.respuesta;
	    // });
	    // fin
	    $scope.showContent = function($fileContent) {
	    	var xml = $fileContent;
	    	if (xml.length != 0) {
	            var x2js = new X2JS();
	            var xmltotal = x2js.xml_str2json(xml);
	            var llave = '';
	            for (var key in xmltotal) { llave = key; };
	            var limite = xmltotal[key].comprobante.length;
	            var com = xmltotal[key].comprobante.substring(limite - 3);

	            if (com == ']]>') {
	                var xmlcomprobante = xmltotal[key].comprobante.substring(47, limite - 3);
	            } else { var xmlcomprobante = xmltotal[key].comprobante; }
	            var comprobantejson = x2js.xml_str2json(xmlcomprobante);
	            var claveAcceso = comprobantejson.factura.infoTributaria.claveAcceso;
	            $scope.data = { clave: claveAcceso };
	        }
	    };

	    

	    $scope.guardar_factura_electronica = function() {
	        repositorioFacturas.Upload_XML().add($scope.data).$promise.then(function(data) {
	        	$mdDialog.show({
			      controller: modal_Ctrl,
			      templateUrl: 'views/app/repositorio_facturas/subir_facturas/modal.html',
			      parent: angular.element(document.body),
			      clickOutsideToClose:true,
			      locals: { obj: data }
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
	        });
	    }

	    function modal_Ctrl($scope, $mdDialog, obj) {
	    	$scope.comprobante = obj.comprobante;
	    	console.log(obj.comprobante);
		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };
		}
	});