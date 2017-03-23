'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:ActualizarDatosCtrl
 * @description
 * # ActualizarDatosCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App');
  app.controller('actualizar_datos_Ctrl', function ($scope, $mdDialog, $location, mainService) {
    var fecha = moment(new Date()); // Fecha Actual
    $scope.inicio = fecha.subtract(100, 'years').format("YYYY-MM-DD");// resta 100 años a la fecha
    var fecha = moment(new Date()); // Fecha Actual
    $scope.fin = fecha.subtract(18, 'years').format("YYYY-MM-DD");  // resta 18 años a la fecha



    $scope.cambiar_datos_password = function(){
    	mainService.Update_Password().get({pass:$scope.data.password}).$promise.then(function(data){
        if (data.respuesta == true) {
          $location.path('/Seleccionar_Sucursal');
        }else{
          $mdDialog.show(
              $mdDialog.alert()
              .parent(angular.element(document.querySelector('#popupContainer')))
              .clickOutsideToClose(true)
              .title('LO SENTIMOS :(')
              .textContent('Intente mas tarde.')
              .ariaLabel('Respuesta Registro')
              .ok('Entendido')
              .targetEvent()
          );
        }
	    });
    }
  });

  app.controller('actualizar_datos_sucursal_Ctrl', function ($scope, $mdDialog, $location, mainService, $localStorage) {
    $scope.infoempresa = $localStorage.datosE;
    $scope.infosucursal = $localStorage.sucursal;
    $scope.data = {nom_sucursal: $scope.infosucursal.nombre};
    var self = this;

    $scope.contacts = [{
      'id': 1,
      'fullName': 'Solo se dedica a venta de productos',
      'lastName': 'Bienes',
      'title': "Venta de Productos"
    }, {
      'id': 2,
      'fullName': 'Solo se dedica a venta de servicios',
      'lastName': 'Servicios',
      'title': "Presta Servicios"
    }, {
      'id': 3,
      'fullName': 'Se dedica prestar servicios y a la venta de productos',
      'lastName': 'Mixta',
      'title': "Mixta"
    }];
    $scope.selectedId = 2;
    $scope.selectedUser = function() {
      return $filter('filter')(self.contacts, { id: self.selectedId })[0].lastName;
    };


    $scope.editData = {
      test1: 'test input'
    };

    $scope.stepChanged = function()
    {
      console.log('step changed');
    };

    $scope.wizardSaved = function()
    {
      console.log('save clicked');
    };
  });

