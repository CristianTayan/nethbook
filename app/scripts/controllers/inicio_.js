'use strict';

angular.module('nextbook20App')
  .controller('inicio_Ctrl', function ($scope,$localStorage, urlService) {
    
    $scope.datos2 = $localStorage.datosE;
    $scope.data_usuario = $localStorage.datosPersona;
    $scope.data_sucursal = $localStorage.sucursal;
    $scope.localStorage = $localStorage;

    $scope.url = (imagen) => {
      return urlService.server().dir() + imagen;
    }
     
  });

