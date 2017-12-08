'use strict';

var app = angular.module('nextbook20App');
  app.controller('perfilEmpresaCtrl', function($scope, $rootScope, $location, $localStorage, colaboradores_Service, $mdDialog, $timeout, urlService, perfilEmpresaService) {
    
    $scope.tabSelect = (value) => {
      $location.url('/nb/empresa/' + value);
    }

    perfilEmpresaService.Load_Imgs_PortadaEmpresa().get().$promise.then((data) => {
      $scope.imgPortada = urlService.server().dir() + data.imgs[0].direccion_imagen_recorte;
    });
    perfilEmpresaService.Load_Imgs_PerfilEmpresa().get().$promise.then((data) => {
      $scope.imgPerfil = urlService.server().dir() + data.imgs[0].direccion_imagen_recorte;
    });

  });

  app.controller('empresaInicioCtrl', function ($scope,$localStorage, urlService) {
    console.log('empresaInicioCtrl');
  });
  app.controller('empresaSucursalesCtrl', function ($scope,$localStorage, urlService, establecimientosService) {
    establecimientosService.Get_Establecimientos().get().$promise.then(function(res){
      $scope.establecimiento = res.respuesta.data;
    });
  });
  app.controller('empresaCorporativoCtrl', function ($scope,$localStorage, urlService) {
    console.log('empresaCorporativoCtrl');
  });
  app.controller('empresaContactosCtrl', function ($scope,$localStorage, urlService) {
    console.log('empresaContactosCtrl');
  });