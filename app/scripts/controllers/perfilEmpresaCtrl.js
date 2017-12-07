'use strict';

var app = angular.module('nextbook20App')
  app.controller('empresaCtrl', function ($scope, $localStorage, urlService, $location, $routeSegment) {    
    $scope.tabSelect = (value) => {
      $location.url('/nb/empresa/' + value);
    }

    // perfilUsuarioService.Load_Imgs_PortadaUsuario().get({},ok_load_portadas).$promise.then(() => {
      
    // });
    $scope.datos2 = $localStorage.datosE;
    $scope.data_usuario = $localStorage.datosPersona;
    $scope.data_sucursal = $localStorage.sucursal;
    $scope.localStorage = $localStorage;

    $scope.url = (imagen) => {
      return urlService.server().dir() + imagen;
    }
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
