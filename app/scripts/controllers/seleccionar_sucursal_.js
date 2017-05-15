'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:SeleccionarSucursalCtrl
 * @description
 * # SeleccionarSucursalCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
	.controller('seleccionar_sucursal_Ctrl', function ($scope, $location, $localStorage, establecimientosService,mainService) {
		establecimientosService.Get_Establecimientos().get().$promise.then(function(data){
	        $scope.data_establecimiento = data.respuesta.data;
	        if ($scope.data_establecimiento.length == 1) {
	        	$scope.Select_Sucursal($scope.data_establecimiento[0]);
	        }
	    });
	    $scope.Select_Sucursal = function(index) {
	        $localStorage.sucursal = index;
	         //--------------------cargar imagen perfil-----------
		            mainService.Get_Img_Perfil().get({sucursal:index.id}).$promise.then(function(data) {
		            	$localStorage.imgPerfil = data.img;		                
		            },function(error){
		            	$localStorage.imgPerfil="images/users/avatar-001.jpg";
		            });
		            //--------------------cargar imagen Portada-----------
		            mainService.Get_Img_Portada().get({sucursal:index.id}).$promise.then(function(data) {
		            	$localStorage.imgPortada = data.img;
		            },function(error){
		            	$localStorage.imgPortada="images/samples/w1.jpg";
		            });
		            // -------------------------	 fin
		            //--------------------cargar imagen Logo-----------
		            mainService.Get_Img_Logo().get({sucursal:index.id}).$promise.then(function(data) {
		            	$localStorage.imgLogo = data.img;
		            },function(error){
		            	$localStorage.imgPortada="images/samples/x2.jpg";
		            });

	        (index.giro_negocio.id==0)?$location.path('/Actualizar_Datos_Sucursal'):$location.path('/nb/Inicio')
	    }
	    $scope.escapeRegExp = function(str) {
			return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		}
  	});
