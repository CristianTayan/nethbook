'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:RegistroCtrl
 * @description
 * # RegistroCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
  	app.controller('acceso_colaboradores_Ctrl', function ($scope, $location, $routeParams,$mdDialog, mainService, colaboradores_Service,consumirService, $localStorage) {

  		
	    // logeo ingreso Colaboradores
  		$scope.ingresar_colaborador = function() {
  			consumirService.ip_public().then(function(data) {
  				getIPs(function(ip){
  					$scope.data_ingreso_colaborador.ruc=$routeParams.ruc;
  					var obj = $scope.data_ingreso_colaborador;
			        colaboradores_Service.Ingresar_Colaborador().acceso({acceso:obj,info_servidor:data, ip_cliente:ip, macadress:'00:00:00:00:00'}).$promise.then(function(data) {
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
			            } if (data.respuesta == true) {
				            $localStorage.token = data.token;
				            $localStorage.datosE = data.datosE;
				            $localStorage.datosPersona = data.datosPersona;
				            //--------------------cargar imagen perfil-----------
				            mainService.Get_Img_Perfil().get().$promise.then(function(data) {
				            	$localStorage.imgPerfil = data.img;		                
				            },function(error){
				            	$localStorage.imgPerfil="images/users/avatar-001.jpg";
				            });
				            //--------------------cargar imagen Portada-----------
				            mainService.Get_Img_Portada().get().$promise.then(function(data) {
				            	$localStorage.imgPortada = data.img;
				            },function(error){
				            	$localStorage.imgPortada="images/samples/w1.jpg";
				            });
				            // ---------- fin
				            //--------------------cargar imagen Logo-----------
				            mainService.Get_Img_Logo().get().$promise.then(function(data) {
				            	$localStorage.imgLogo = data.img;
				            },function(error){
				            	$localStorage.imgPortada="images/samples/x2.jpg";
				            });
				            // ---------- fin
				            //---------------------- verificar si existe datos de persona-----------
				            mainService.Get_Datos_Empresa().get().$promise.then(function(data) {
				                if (data.respuesta) {
				                    $location.path('/Colaborador/Seleccionar_Sucursal');
				                } else {
				                    $location.path('/Colaborador/Actualizar_Datos');
				                }
				            });
				        }
			        });
  				});				
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
  	});
