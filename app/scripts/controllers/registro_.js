'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:RegistroCtrl
 * @description
 * # RegistroCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  	.controller('registro_Ctrl', function ($scope, $location, $mdDialog, mainService, consumirService) {
  		$scope.elementview = false;
  		$scope.elemennotview = true; 	
  		
  		// cargar provincias
  		mainService.item_provincias().get().$promise.then(function(data){
	        $scope.states = data.respuesta;
	    });

  		// buscar servidor externo consulta
  		$scope.searchruc = function() {
  			$scope.elementview = false;
  			$scope.elemennotview = true;
	        mainService.buscar_informacion_ruc().get({ruc: $scope.ruc}).$promise.then(function(data){
	            var x = data.respuesta;
	            if (x == false ) {
	                $mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.querySelector('#popupContainer')))
				        .clickOutsideToClose(true)
				        .title('Ya Existe!')
				        .textContent('Este numero de RUC ya se encuentra registrado.')
				        .ariaLabel('Alert Dialog Demo')
				        .ok('Entendido')
				    );
	            }
	            if (x == 'false-sri' ) {
	                $mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.querySelector('#popupContainer')))
				        .clickOutsideToClose(true)
				        .title('Invalido!')
				        .textContent('Este numero de RUC no es valido.')
				        .ariaLabel('Alert Dialog Demo')
				        .ok('Entendido')
				    );
	            }
	            if (x != false && x != 'false-sri') {
	                $scope.razon_social = x.razon_social;
	                $scope.nombre_comercial = x.nombre_comercial;
	                $scope.estado_contribuyente = x.estado_contribuyente;
	                $scope.clase_contribuyente = x.clase_contribuyente;
	                $scope.tipo_contribuyente = x.tipo_contribuyente;
	                $scope.obligado_llevar_contabilidad = x.obligado_llevar_contabilidad;
	                $scope.actividad_principal=x.actividad_economica;
	                $scope.rucdata = x;
	                $scope.elementview=true;
	                $scope.elemennotview=false;  
	            }
	        });
	    }
	    // logeo ingreso app
  		$scope.ingresar = function() {
  			consumirService.ip_public().then(function(data) {
  				getIPs(function(ip){
  					var obj = {'nick':$scope.email, 'clave':$scope.password};
			        mainService.ingresar({acceso:obj,info_servidor:data, ip_cliente:ip, macadress:'00:00:00:00:00'}).acceso().$promise.then(function(data) {
			        	console.log(data);
			        	if (data.respuesta == false) {
			            	$mdDialog.show(
					            $mdDialog.alert()
					            .parent(angular.element(document.querySelector('#dialogContainer')))
					            .clickOutsideToClose(true)
					            .title('Lo sentimos :(')
					            .textContent('Usuario o password incorrecto, vuelva a intentar')
					            .ok('Entendido')
					            .openFrom('#left')
					        );
			            } else {
				            $localStorage.token = data[0].token;
				            $localStorage.datosE = data.datosE;
				            $localStorage.datosPersona = data.datosPersona;
				            //--------------------cargar imagen perfil-----------
				            servicios.get_img_perfil().get().$promise.then(function(data) {
				            	$localStorage.imgPerfil = data.img;		                
				            },function(error){
				            	$localStorage.imgPerfil="images/users/avatar-001.jpg";
				            });
				            //--------------------cargar imagen Portada-----------
				            servicios.get_img_portada().get().$promise.then(function(data) {
				            	$localStorage.imgPortada = data.img;
				            },function(error){
				            	$localStorage.imgPortada="images/samples/w1.jpg";
				            });
				            // ---------- fin
				            //--------------------cargar imagen Logo-----------
				            servicios.get_img_logo().get().$promise.then(function(data) {
				            	$localStorage.imgLogo = data.img;
				            },function(error){
				            	$localStorage.imgPortada="images/samples/x2.jpg";
				            });
				            // ---------- fin
				            //---------------------- verificar si existe datos de persona-----------
				            servicios.get_propietario().get().$promise.then(function(data) {
				                if (data.respuesta) {
				                    $location.path('/SeleccionarSucursal');
				                } else {
				                    $location.path('/CambioPass');
				                }
				            });
				        }
			        });
  				});				
			});
	    }

	    // registro ruc en el sistema
	    $scope.registrar = function() {
	    	$scope.rucdata['telefono'] = $scope.lastName
	        $scope.rucdata['telefono1'] = $scope.lastName2;
	        $scope.rucdata['provincia'] = $scope.myOption;
	        $scope.rucdata['celular'] = $scope.fono;
	        $scope.rucdata['correo'] = $scope.correo;
	        mainService.guardar_datos_ruc($scope.rucdata).save().$promise.then(function(result){
	            if (result.respuesta == true) {
	            	$mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.querySelector('#popupContainer')))
				        .clickOutsideToClose(true)
				        .title('Registro Correcto!')
				        .textContent('En hora buena registro correcto revise su correo para activar su cuenta.')
				        .ariaLabel('Alert Dialog')
				        .ok('Entendido')
				    );
	                $scope.elemennotview = true;
	                $scope.elementview = false;               
	                $scope.ruc = null;
	               // reset();
	            } else {
	            	$mdDialog.show(
				      $mdDialog.alert()
				        .parent(angular.element(document.querySelector('#popupContainer')))
				        .clickOutsideToClose(true)
				        .title('Lo sentimos!')
				        .textContent('Intente mas Tarde.')
				        .ariaLabel('Alert Dialog')
				        .ok('Entendido')
				    );
	            }   
	        });
	    }



	    function getIPs(callback) {
		    var ip_dups = {};
		    //compatibility for firefox and chrome
		    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
		    var useWebKit = !!window.webkitRTCPeerConnection;

		    //bypass naive webrtc blocking using an iframe
		    if (!RTCPeerConnection) {
		        var win = iframe.contentWindow;
		        RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
		        useWebKit = !!win.webkitRTCPeerConnection;
		    }

		    //minimal requirements for data connection
		    var mediaConstraints = {
		        optional: [{
		            RtpDataChannels: true
		        }]
		    };

		    var servers = {
		        iceServers: [{
		            urls: "stun:stun.services.mozilla.com"
		        }]
		    };

		    //construct a new RTCPeerConnection
		    var pc = new RTCPeerConnection(servers, mediaConstraints);

		    
		    //listen for candidate events
		    pc.onicecandidate = function(ice) {
		        // console.log(ice);
		        //skip non-candidate events
		        if (ice.candidate) {
		            // handleCandidate(ice.candidate.candidate);
		            // console.log(ice.candidate.candidate);
		        }
		    };
		    //create a bogus data channel
		    pc.createDataChannel("");
		    //create an offer sdp
		    pc.createOffer(function(result) {
		        //trigger the stun server request
		        pc.setLocalDescription(result, function() {}, function() {});
		    }, function(ip) {console.log(ip);});
		    //wait for a while to let everything done
		    setTimeout(function() {
		        //read candidate info from local description
		        var lines = pc.localDescription.sdp.split('\n');
		        callback(lines[7]);
		    }, 1000);
		}
		//Test: Print the IP addresses into the console
		
  	})
	.controller('activar_Ctrl', function ($scope, $routeParams, $mdDialog, mainService) {
		mainService.activar_cuenta($routeParams).save().$promise.then(function(data){
	        // $scope.states = data.respuesta;
	        console.log(data);
	    });
	});
