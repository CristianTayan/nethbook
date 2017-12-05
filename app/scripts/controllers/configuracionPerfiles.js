'use strict';

var app = angular.module('nextbook20App')

  app.controller('configuracionCtrl', function ($scope, $mdExpansionPanelGroup, configuracionService, $routeSegment,  $mdDialog) {
    $scope.$routeSegment = $routeSegment;
  });

  app.controller('configuracionPerfilSucursalCtrl', function ($scope,$mdExpansionPanel, $routeSegment,  $mdDialog, $localStorage, mainService, establecimientosService) {
    $scope.tipos = [
        "Teléfono",
        "Celular",
        "Hogar",
    ];
    $scope.listas=[];
    establecimientosService.getDatosAdicionales().get({idSucursal: $localStorage.sucursal.id}).$promise.then(function(datos){
       $scope.listas = datos.respuesta;
       if(datos.respuesta == null)
       {
         $scope.listas=[];
       }
       }); 
        $scope.addNew = function(listas){
            $scope.listas.push({ 
                'tipo': listas.tipo, 
                'numero': listas.numero,
            }); 
        };
        
        $scope.remove = function(){
            var newDataList=[];
            $scope.selectedAll = false;
            angular.forEach($scope.listas, function(selected){
                if(!selected.selected){
                    newDataList.push(selected);
                }
            }); 
            $scope.listas = newDataList;
        };
        $scope.checkAll = function () {
            if (!$scope.selectedAll) {
                $scope.selectedAll = true;
            } else {
                $scope.selectedAll = false;
            }
            angular.forEach($scope.listas, function (listas) {
                listas.selected = $scope.selectedAll;
            });
        }; 
       $scope.recuperarValores = function() {
        var id=$localStorage.sucursal.id;
       establecimientosService.UpdateAddSucursal().send({valores: $scope.listas,idSucursal: $localStorage.sucursal.id}).$promise.then(function(data){
         if (data.respuesta) {
           $mdToast.show({
               hideDelay   : 5000,
               position    : 'bottom right',
               controller  : 'notificacionCtrl',
               templateUrl : 'views/notificaciones/guardar.html'
             });
           $location.path('/nb');
         }
       });
    };
    $scope.datosEmpresa=$localStorage.datosE;
    $scope.datosSucursal=$localStorage.sucursal;
    $scope.datosPersonal=$localStorage.datosPersona;
    $scope.data = {nom_sucursal: $scope.datosSucursal.nombre};
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
       $scope.get_data_tipos_empresas();
       });
     }
    // ------------------------------------------------------------- PROCESOS GENERALES ---------------------------------------------

    $scope.expresion = function() {
     var select = $scope.ModelTipo_Tipo_Empresa.selectedTipo;
     $scope.json = angular.toJson(select);
    }
    
    $scope.descripcion = function(){
      var establecimiento=$scope.datosSucursal.nombre;
      var descripcion= $scope.form.descripcion;
       $scope.json = angular.toJson(descripcion);
    }

    $scope.Actividad = 1;
    $scope.selected_Tipo = function(val) {
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
    };

    $scope.wizardSaved = function(){   

     $scope.x = {
                 'tipo_bienes_servicios': $scope.Tipo_completo,
                 'ModelTipo_Tipo_Empresa': cm.ModelTipo_Tipo_Empresa.selectedTipo,
                 'sucursal': $scope.datosSucursal.id,
                 'descripcion': $scope.form.descripcion
               };
       var datos = $scope.x;
       console.log(datos);

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

    //------------------------Agregar correo-----------------------------------
     $scope.showPrompt = function(ev) {
    var confirm = $mdDialog.prompt()
      .title('¿Desea ingresar otro correo?')
      .placeholder('example@example.com')
      .ariaLabel('Correo')
      .targetEvent(ev)
      .required(true)
      .ok('Agregar')
      .cancel('Cancelar');

    $mdDialog.show(confirm).then(function(result) {
      $scope.statuss=result;
      $scope.status = 'Correo secundario: ' + result ;
    }, function() {
      $scope.status = '';
    });
  }

});


  app.controller('configuracionPerfilPersonalCtrl', function ($scope, $mdExpansionPanel, configuracionService, $routeSegment,  $mdDialog, $localStorage, colaboradores_Service) {
    // --------------------------------------abrir primer panel por defecto--------------------------------------
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
    $scope.cambiar_datos_password = function(){
    $mdDialog.show( {
        controller: DialogController,
        templateUrl: 'views/dashboard/modal_updat_pass.html',
        parent: angular.element(document.body),
        clickOutsideToClose: false, // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        locals: {data:$scope.data}
    });
    }
    function DialogController($scope, $mdDialog, mainService, $localStorage, data) {
      $scope.verificar = function(){
        mainService.Verificar_Pass().get({pass:$scope.pass}).$promise.then(function(response){
          // console.log(response);
          if (response.respuesta) {
            $mdDialog.hide();
            mainService.Update_Password().get({pass:$scope.password}).$promise.then(function(data){
              // console.log('test');
           //      if (data.respuesta == true) {
           //        $location.path('/Seleccionar_Sucursal');
           //      }else{
              // console.log('test');
           //      }
            });
          }else{
            // console.log('testtisng');
            $scope.pass = '';
            // $scope.verificar();
          }
        });
      }
  };
});

  app.controller('configuracionPerfilEmpresaCtrl', function ($scope, $mdExpansionPanel, $localStorage, mainService) {
    //-------------------------------------------------------------- GET TIPOS BIENES SERVICIOS ------------------------------------
     $scope.datosEmpresa=$localStorage.datosE;
      function success_tipo_bienes_servicios(result){
        $scope.tipo_bienes_servicios=result.respuesta;
      }   

      $scope.get_data_tipos_bienes_Servicios=function(){
        mainService.Get_Tipo_Bienes_Servicios().get({},success_tipo_bienes_servicios).$promise.then(function(){},function(error){
          //$scope.get_data_tipos_bienes_Servicios();
        });
      }
      $scope.get_data_tipos_bienes_Servicios();
    // --------------------------------------abrir primer panel por defecto--------------------------------------------------
      // $mdExpansionPanel().waitFor('expansionPanelTwo').then(function (instance) { instance.expand(); });
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
    //---------------------------------------- Get datos Localstorage -------------------------------------------------------
    // console.log($localStorage);
    $scope.info_empresa = $localStorage.datosE;
    $scope.info_sucursal = $localStorage.sucursal;
    $scope.get_data_tipos_empresas($scope.info_sucursal.giro_negocio.id);
    $scope.Tipo = $scope.info_sucursal.giro_negocio.id;
    var cm=$scope;
    cm.ModelTipo_Tipo_Empresa = {
      selectedTipo: 2
    }
    // var self = this;
  });