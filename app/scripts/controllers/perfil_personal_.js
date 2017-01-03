'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:PerfilPersonalCtrl
 * @description
 * # PerfilPersonalCtrl
 * Controller of the nextbook20App
 */
	var app = angular.module('nextbook20App');
  	app.controller('perfil_personal_Ctrl', function ($scope, $localStorage, colaboradores_Service, $mdDialog) {
    	$scope.data_usuario = $localStorage.datosPersona;
    	//----------------SELECT CIUDADES---------------//
	    function success_ciudades(desserts) {
		    var cm = $scope;
	        cm.selectCallback = $scope.data_usuario.id_localidad.id;
	        cm.selectCiudades = desserts.respuesta;
	        cm.selectModelCiudad = {
	            selectedCiudades: $scope.data_usuario.id_localidad,
	            selectedPeople: [cm.selectCiudades[2], cm.selectCiudades[4]],
	            selectedPeopleSections: []
	        };
	    }

	    $scope.data_ciudades = function() {
	        colaboradores_Service.Get_Ciudades().get($scope.query, success_ciudades).$promise;
	    }
	    $scope.data_ciudades();


	    $scope.showPrompt = function(ev) {
		    // Appending dialog to document.body to cover sidenav in docs app
		    var confirm = $mdDialog.prompt()
		      .title('What would you name your dog?')
		      .textContent('Bowser is a common name.')
		      .placeholder('Dog name')
		      .ariaLabel('Dog name')
		      .targetEvent(ev)
		      .ok('Okay!')
		      .cancel('I\'m a cat person');

		    $mdDialog.show(confirm).then(function(result) {
		    	console.log(result);
		    }, function() {
		      $scope.status = 'You didn\'t name your dog.';
		    });
		};


  	});
