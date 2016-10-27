'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:ActualizarDatosCtrl
 * @description
 * # ActualizarDatosCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  .controller('actualizar_datos_Ctrl', function ($scope) {

    var fecha = moment(new Date()); // Fecha Actual
    $scope.inicio = fecha.subtract(100, 'years').format("YYYY-MM-DD");// resta 100 años a la fecha
    var fecha = moment(new Date()); // Fecha Actual
    $scope.fin = fecha.subtract(18, 'years').format("YYYY-MM-DD");  // resta 18 años a la fecha
  });
