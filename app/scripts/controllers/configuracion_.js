'use strict';


var app = angular.module('nextbook20App');
  	app.controller('configuracionCtrl', function ($scope, $mdExpansionPanelGroup, configuracionService, $routeSegment,  $mdDialog) {
  		// $scope.showBox = configuracionService.ico_sidemenu_2($routeSegment)
  		$scope.showBox = 'hola';
  		// console.log($scope.showBox);
  		$scope.toppings = [
    { name: 'Pepperoni', wanted: true },
    { name: 'Sausage', wanted: false },
    { name: 'Black Olives', wanted: true },
    { name: 'Green Peppers', wanted: false }
  ];

  $scope.settings = [
    { name: 'Wi-Fi', extraScreen: 'Wi-fi menu', icon: 'device:network-wifi', enabled: true },
    { name: 'Bluetooth', extraScreen: 'Bluetooth menu', icon: 'device:bluetooth', enabled: false },
  ];

  $scope.messages = [
    {id: 1, title: "Message A", selected: false},
    {id: 2, title: "Message B", selected: true},
    {id: 3, title: "Message C", selected: true},
  ];

  $scope.people = [
    { name: 'Janet Perkins', img: 'img/100-0.jpeg', newMessage: true },
    { name: 'Mary Johnson', img: 'img/100-1.jpeg', newMessage: false },
    { name: 'Peter Carlsson', img: 'img/100-2.jpeg', newMessage: false }
  ];

  $scope.goToPerson = function(person, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Navigating')
        .textContent('Inspect ' + person)
        .ariaLabel('Person inspect demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };

  $scope.navigateTo = function(to, event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Navigating')
        .textContent('Imagine being taken to ' + to)
        .ariaLabel('Navigation demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };

  $scope.doPrimaryAction = function(event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Primary Action')
        .textContent('Primary actions can be used for one click actions')
        .ariaLabel('Primary click demo')
        .ok('Awesome!')
        .targetEvent(event)
    );
  };

  $scope.doSecondaryAction = function(event) {
    $mdDialog.show(
      $mdDialog.alert()
        .title('Secondary Action')
        .textContent('Secondary actions can be used for one click actions')
        .ariaLabel('Secondary click demo')
        .ok('Neat!')
        .targetEvent(event)
    );
  };
  	});

  app.controller('informacion_generalCtrl', function ($scope, $mdExpansionPanel, configuracionService, $routeSegment,  $mdDialog, $localStorage, colaboradores_Service) {
    // --------------------------------------abrir primer panel por defecto--------------------------------------
    // $mdExpansionPanel().waitFor('expansionPanelOne').then(function (instance) { instance.expand(); });

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

  app.controller('informacion_general_empresaCtrl', function ($scope, $mdExpansionPanel, $localStorage, mainService) {
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