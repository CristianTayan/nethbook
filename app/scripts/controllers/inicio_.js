'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:InicioCtrl
 * @description
 * # InicioCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  .controller('inicio_Ctrl', function ($scope,$localStorage) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

     $scope.datos2 = $localStorage.datosE;
     $scope.data_usuario = $localStorage.datosPersona;
     $scope.data_sucursal = $localStorage.sucursal;
     
  });
