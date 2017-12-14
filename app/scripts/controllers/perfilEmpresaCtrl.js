'use strict';

var app = angular.module('nextbook20App');
  app.controller('perfilEmpresaCtrl', function($scope, $rootScope, $location, $localStorage, colaboradores_Service, $mdDialog, $timeout, urlService, perfilEmpresaService) {
    $scope.tabSelect = (value) => {
      $location.url('/nb/empresa/' + value);
    };

    perfilEmpresaService.getImgPerfilAndPortadaEmpresa().get().$promise.then((data) => {
      $scope.imgPerfil = urlService.server().dir() + data.imgPerfil;
      $scope.imgPortada = urlService.server().dir() + data.imgPortada;
    });

  });

  app.controller('empresaInicioCtrl', function () {
    console.log('empresaInicioCtrl');
  });
  app.controller('empresaSucursalesCtrl', function ($scope, establecimientosService) {
    establecimientosService.Get_Establecimientos().get().$promise.then(function(res){
      $scope.establecimiento = res.respuesta.data;
    });
  });
  app.controller('empresaCorporativoCtrl', function () {
    console.log('empresaCorporativoCtrl');
  });
  app.controller('empresaContactosCtrl', function () {
    console.log('empresaContactosCtrl');
  });