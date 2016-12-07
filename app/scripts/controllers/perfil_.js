'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:PerfilCtrl
 * @description
 * # PerfilCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  .controller('perfil_Ctrl', function ($scope, $localStorage) {
    $scope.imgPortada = 'http://4.bp.blogspot.com/-rf5TPOMiIVQ/VZJ6U22eecI/AAAAAAAAAfA/E1QP30963M0/s1600/Foto-construir-una-gran-empresa-6.png';
    $scope.datos2 = $localStorage.datosE;
  });
