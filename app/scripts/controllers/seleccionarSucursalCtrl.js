'use strict';
var app = angular.module('nextbook20App')
  app.controller('seleccionar_sucursal_Ctrl', function ($scope, $location, $localStorage, establecimientosService, mainService) {
    
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
        console.log(data.img);
      },function(error){
        $localStorage.imgPerfil="images/users/avatar-001.jpg";
      });
       
      mainService.Get_Img_PerfilUsuario().get({sucursal:index.id}).$promise.then(function(data) {
        $localStorage.imgPerfilUsuario = data.img;                   
      },function(error){
        $localStorage.imgPerfilUsuario="images/users/avatar-001.jpg";
      });
      
      mainService.Get_Img_PerfilEmpresa().get({sucursal:index.id}).$promise.then(function(data) {
        $localStorage.imgPerfilEmpresa = data.img;                   
      },function(error){
        $localStorage.imgPerfilEmpresa="images/users/avatar-001.jpg";
      });
      //--------------------cargar imagen Portada-----------
      mainService.Get_Img_Portada().get({sucursal:index.id}).$promise.then(function(data) {
        $localStorage.imgPortada = data.img;
      },function(error){
        $localStorage.imgPortada="images/samples/w1.jpg";
      });
      
      mainService.Get_Img_PortadaUsuario().get({sucursal:index.id}).$promise.then(function(data) {
        $localStorage.imgPortadaUsuario = data.img;
      },function(error){
        $localStorage.imgPortadaUsuario="images/samples/w1.jpg";
      });
      
      mainService.Get_Img_PortadaEmpresa().get({sucursal:index.id}).$promise.then(function(data) {
        $localStorage.imgPortadaEmpresa = data.img;
      },function(error){
        $localStorage.imgPortadaEmpresa="images/samples/w1.jpg";
      });
      // --------------------cargar imagen Logo-----------
      mainService.Get_Img_Logo().get({sucursal:index.id}).$promise.then(function(data) {
        $localStorage.imgLogo = data.img;
      },function(error){
        $localStorage.imgPortada="images/samples/x2.jpg";
      });
      (index.giro_negocio.id==0)?$location.path('/nb/App/Administracion/Sucursal'):$location.path('/nb')
    }
  });