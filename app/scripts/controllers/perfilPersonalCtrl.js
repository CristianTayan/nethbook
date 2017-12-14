'use strict';
var app = angular.module('nextbook20App');
app.controller('perfilPersonalCtrl', function($scope, $rootScope, perfilUsuarioService, $localStorage, colaboradores_Service, $mdDialog, $timeout, urlService, mainService) {

  perfilUsuarioService.getImgPerfilAndPortadaUsuario().get().$promise.then((data) => {
    $scope.imgPerfil = urlService.server().dir() + data.imgPerfil;
    $scope.imgPortada = urlService.server().dir() + data.imgPortada;
    $localStorage.cook_session_init.forEach(function(element, index) {
      if ($localStorage.datosE.ruc_ci === element.ruc_empresa && $localStorage.datosPersona.nick === element.nick) {
        $localStorage.cook_session_init[index].foto = data.imgPerfil;
      }
    });
  });
  $scope.dataUsuario = $localStorage.datosPersona;
});