'use strict';
var app = angular.module('nextbook20App');
app.controller('perfilPersonalCtrl', function($scope, $rootScope, perfilUsuarioService, $localStorage, colaboradores_Service, $mdDialog, $timeout, urlService, mainService) {

  perfilUsuarioService.getImgPerfilAndPortadaUsuario().get().$promise.then((data) => {
    $scope.imgPerfilUsuario = urlService.server().dir() + data.imgPerfil;
    $scope.imgPortadaUsuario = urlService.server().dir() + data.imgPortada;
  });
});