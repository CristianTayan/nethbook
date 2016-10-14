'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  	.controller('search_Ctrl', function ($scope, $routeParams, mainService) {
		mainService.info_perfil_busqueda().get({perfil:$routeParams.id}).$promise.then(function(data){
			$scope.data = data.respuesta;
			console.log(data.respuesta);
		});
  	});
