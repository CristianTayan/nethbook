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


    $scope.ValidarClave = function(event){
      console.log('test 0===>', event);
       var passVar = $scope.data.password;
       var alto = new RegExp("^(?=.{9,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
       var medio = new RegExp("^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");        
       var bajo = new RegExp("(?=.{6,}).*", "g");

          if(bajo.test(passVar) === false){
              $('.bar').removeClass('medium');
              $('.bar').removeClass('strong');
              $('.bar').addClass('weak');
            }
          else if(alto.test(passVar) === true){
              $('.bar').addClass('strong');
              $('.bar').removeClass('medium');
              $('.bar').removeClass('weak');
            }
          else if(medio.test(passVar) === true){
              $('.bar').removeClass('weak');
              $('.bar').removeClass('strong');
              $('.bar').addClass('medium');
            }
          else {
              $('.bar').removeClass('medium');
              $('.bar').addClass('weak');
            }
    }

    $scope.cambiar_datos_password = function(){
    	mainService.Update_Password().get({pass:$scope.data.password}).$promise.then(function(data){
        if (data.respuesta === true) {
          $location.path('/Seleccionar_Sucursal');
        }
        if (data.respuesta !== true){
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

  app.controller('actualizar_datos_sucursal_Ctrl', function ($scope, $mdToast, $location, mainService, $localStorage,establecimientosService) {
    $scope.infoempresa = $localStorage.datosE;
    $scope.infosucursal = $localStorage.sucursal;
    $scope.data = {nom_sucursal: $scope.infosucursal.nombre};
    $scope.form = {descripcion:''};
    var cm=$scope;
    cm.ModelTipo_Tipo_Empresa={
      selectedTipo:undefined
    }
    var self = this;
    //-------------------------------------------------------------- GET TIPOS BIENES SERVICIOS ------------------------------------
      function success_tipo_bienes_servicios(result){
        $scope.tipo_bienes_servicios=result.respuesta;
      }
      $scope.get_data_tipos_bienes_Servicios=function(){
        mainService.Get_Tipo_Bienes_Servicios().get({},success_tipo_bienes_servicios).$promise.then(function(){},function(error){
          //$scope.get_data_tipos_bienes_Servicios();
        });
      }
      $scope.get_data_tipos_bienes_Servicios();
    //-------------------------------------------------------------- GET TIPOS DE EMPRESAS ------------------------------------------
      function success_tipo_empresas(result){
        $scope.tipo_empresas=result.respuesta;
      }
      $scope.get_data_tipos_empresas=function(id){
        mainService.Get_Tipo_Actividad_Economica().get({id_bienes_servicios:id},success_tipo_empresas).$promise.then(function(){},function(error){
          //$scope.get_data_tipos_empresas();
        });
      }
     // ------------------------------------------------------------- PROCESOS GENERALES ---------------------------------------------

    $scope.Actividad = 1;
    $scope.selected_Tipo = function(val) {
      // console.log(val);
      $scope.Tipo = val.Tipo;
      $scope.Tipo_completo = val;
      $scope.get_data_tipos_empresas(val.id);
    };

    $scope.selected_actividad = function(val) {
      $scope.Actividad=val.Actividad;
    };


    $scope.editData = {
      test1: 'test input'
    };

    $scope.stepChanged = function(){
      // console.log('step changed');
    };

    $scope.wizardSaved = function(){   

      $scope.x = {
                  'tipo_bienes_servicios': $scope.Tipo_completo,
                  'ModelTipo_Tipo_Empresa': cm.ModelTipo_Tipo_Empresa.selectedTipo,
                  'sucursal': $scope.infosucursal.id,
                  'descripcion': $scope.form.descripcion
                };
      establecimientosService.Update_Giro_Actividad().send($scope.x).$promise.then(function(data){
        if (data.respuesta) {
          $localStorage.sucursal.giro_negocio=$scope.Tipo_completo.id;
          $mdToast.show({
              hideDelay   : 5000,
              position    : 'bottom right',
              controller  : 'notificacionCtrl',
              templateUrl : 'views/notificaciones/guardar.html'
            });
          $location.path('/nb');
        }
      });
    }

  });

