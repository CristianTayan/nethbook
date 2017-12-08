'use strict';
var app = angular.module('nextbook20App');
app.controller('perfilPersonalCtrl', function($scope, $rootScope, $localStorage, perfilUsuarioService, colaboradores_Service, $mdDialog, $timeout, urlService, mainService) {

  perfilUsuarioService.Load_Imgs_PerfilUsuario().get().$promise.then((data) => {
    $scope.imgPerfilUsuario = urlService.server().dir() + data.imgs[0].direccion_imagen_recorte;
  });

  perfilUsuarioService.Load_Imgs_PortadaUsuario().get().$promise.then((data) => {
    $scope.imgPortadaUsuario = urlService.server().dir() + data.imgs[0].direccion_imagen_recorte;
  });  
});