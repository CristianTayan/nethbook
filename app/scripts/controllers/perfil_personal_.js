'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:PerfilPersonalCtrl
 * @description
 * # PerfilPersonalCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App');
  	app.controller('perfil_personal_Ctrl', function ($scope, $rootScope, $localStorage, colaboradores_Service, $mdDialog, $timeout, urlService) {
    	console.log('test', $localStorage);
      $rootScope.imgPortadaUsuario=urlService.server().dir()+$localStorage.imgPortadaUsuario;
    	$rootScope.imgPerfilUsuario=urlService.server().dir()+$localStorage.imgPerfilUsuario;
    	$scope.dataUsuario = $localStorage.datosPersona;
	    $scope.data_sucursal = $localStorage.sucursal;
	    
    	

	$scope.show_img = function(ev,tipo_img){
	      $mdDialog.show({
	        controller: Dialog_show_image_Controller,
	        templateUrl: 'views/dashboard/perfil_personal/show_img.html',
	        parent: angular.element(document.body),
	        targetEvent: ev,
	        clickOutsideToClose:false,
	        fullscreen: $scope.customFullscreen,
	        locals:{tipo:tipo_img}
	      });
	    }

	function Dialog_show_image_Controller($scope, tipo, mainService, urlService){
      $scope.cargando=true;
      function ok_img(resul){
        $scope.cargando=false;
        $scope.img=urlService.server().dir()+resul.img_full;
      }
      switch(tipo){
          case 'PerfilUsuario':
                mainService.Get_Img_PerfilUsuario().get({sucursal:$localStorage.sucursal.id},ok_img).$promise;
          break;
          case 'PortadaUsuario':            
                mainService.Get_Img_PortadaUsuario().get({sucursal:$localStorage.sucursal.id},ok_img).$promise;
          break;
        }
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
  	}

  	 $scope.show_upload_img_modal = function(ev,tipo_img){
      $mdDialog.show({
        controller: Dialog_subir_image_Controller,
        templateUrl: 'views/dashboard/perfil_personal/subir_img.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        fullscreen: $scope.customFullscreen,
        locals:{tipo_img:tipo_img}
      });
    }


    function Dialog_subir_image_Controller($scope, $timeout, urlService, $localStorage,perfilUsuarioService,tipo_img){
           
       switch(tipo_img){
          case 'PortadaUsuario':
            $scope.crop_size={width:1000,height:300};
          break;
          case 'PerfilUsuario':
            $scope.crop_size={width:500,height:250};
          break;
        }
        
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

       $scope.Upload = function(){
        switch(tipo_img){
          case 'PortadaUsuario':
            perfilUsuarioService.Add_Img_PortadaUsuario().send({img:$scope.cropper,sucursal:$localStorage.sucursal.id}).$promise.then((resul)=>{
            if (resul.respuesta==true) {
              $rootScope.imgPortadaUsuario=urlService.server().dir()+resul.img;
              $localStorage.imgPortadaUsuario=resul.img;
              $mdDialog.hide();
            }
            });
          break;
          case 'PerfilUsuario':          
          perfilUsuarioService.Add_Img_PerfilUsuario().send({img:$scope.cropper,sucursal:$localStorage.sucursal.id}).$promise.then((resul)=>{
            if (resul.respuesta==true) {
              $rootScope.imgPerfilUsuario=urlService.server().dir()+resul.img;
              $localStorage.imgPerfilUsuario=resul.img;
              $mdDialog.hide();
            }
            });
          break;
        }

        };

    }
    //------------------------------------------------------------------------------- SELECIONAR PortadaUsuario
    $scope.show_lista_img_modal = function(ev,tipo_img){
      var controller;
      switch(tipo_img){
          case 'PortadaUsuario':
            controller=Dialog_lista_image_Portada_Controller;
          break;
          case 'PerfilUsuario':
            controller=Dialog_lista_image_Perfil_Controller;
          break;
        }

      $mdDialog.show({
        controller: controller,
        templateUrl: 'views/dashboard/perfil_personal/select_img.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        multiple:true,
        clickOutsideToClose:false,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      });
    }
    // Controlador portada

    function Dialog_lista_image_Portada_Controller($scope,$rootScope, $timeout, urlService, $localStorage,perfilUsuarioService){
      $scope.cargando=true;
      // // -------------------------------Get portadas-------------------------------
      function ok_load_portadas(result){
        $scope.cargando=false;
        $scope.imgs=result.imgs;
        for (var i = 0; i < $scope.imgs.length; i++) {
            $scope.imgs[i].direccion_imagen_empresa_dir=urlService.server().dir()+$scope.imgs[i].direccion_imagen_recorte;
            $scope.imgs[i].colspan= 4;
            $scope.imgs[i].rowspan= 2;
        }
      }
      $scope.load_img_portadas=function(){
        perfilUsuarioService.Load_Imgs_PortadaUsuario().get({},ok_load_portadas).$promise;
      }
      $scope.load_img_portadas();

      $rootScope.$on("actualizar_portadas", function() {
                $scope.load_img_portadas();
      });

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

       $scope.set_img = function(img){
        perfilUsuarioService.Set_Img_PortadaUsuario().send({img:img.id}).$promise.then((resul)=>{
          if (resul.respuesta==true) {
            $rootScope.imgPortadaUsuario=img.direccion_imagen_empresa_dir;
            $localStorage.imgPortadaUsuario=img.direccion_imagen_recorte;
            $mdDialog.hide();
          }
        });

        };

        $scope.show_delete_modal = function(ev,img){
          
          $mdDialog.show({
            controller: Delete_Controller,
            templateUrl: 'views/dashboard/perfil_personal/delete_img.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            multiple:true,
            clickOutsideToClose:false,
            locals:{img:img}
          });

        };

        function Delete_Controller($scope,img,$rootScope){

          $scope.eliminar_img = function(){
            perfilUsuarioService.Delete_Img_PortadaUsuario().send({img:img.id}).$promise.then((resul)=>{
              if (resul.respuesta==true) {
                $rootScope.$emit("actualizar_portadas", {});
                $mdDialog.hide();
              }
            });

          };

          $scope.cancel = function() {
            $mdDialog.cancel();
          };

        }
    }

     function Dialog_lista_image_Perfil_Controller($scope,$rootScope, $timeout, urlService, $localStorage,perfilUsuarioService){
      $scope.cargando=true;
      // -------------------------------Get imagenes de Perfil-------------------------------
      function ok_load_imgs_perfil(result){
        $scope.cargando=false;
        $scope.imgs=result.imgs;
        for (var i = 0; i < $scope.imgs.length; i++) {
            $scope.imgs[i].direccion_imagen_empresa_dir=urlService.server().dir()+$scope.imgs[i].direccion_imagen_recorte;
            $scope.imgs[i].colspan= 4;
            $scope.imgs[i].rowspan= 2;
        }
      }
      $scope.load_imgs_perfil=function(){
        perfilUsuarioService.Load_Imgs_PerfilUsuario().get({},ok_load_imgs_perfil).$promise;
      }
      $scope.load_imgs_perfil();

      $rootScope.$on("actualizar_imgs_perfilUsuario", function() {
        $scope.load_imgs_perfil();
      });

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

       $scope.set_img = function(img){
        perfilUsuarioService.Set_Img_PerfilUsuario().send({img:img.id}).$promise.then((resul)=>{
          if (resul.respuesta==true) {
            $rootScope.imgPerfil=img.direccion_imagen_empresa_dir;
            $localStorage.imgPerfil=img.direccion_imagen_recorte;
            $mdDialog.hide();
          }
        });

        };

        $scope.show_delete_modal = function(ev,img){
          
          $mdDialog.show({
            controller: Delete_Controller,
            templateUrl: 'views/dashboard/perfil_personal/delete_img.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            multiple:true,
            clickOutsideToClose:false,
            locals:{img:img}
          });

        };

        function Delete_Controller($scope,img,$rootScope){

          $scope.eliminar_img = function(){
            perfilUsuarioService.Delete_Img_PerfilUsuario().send({img:img.id}).$promise.then((resul)=>{
              if (resul.respuesta==true) {
                $rootScope.$emit("actualizar_imgs_perfilUsuario", {});
                $mdDialog.hide();
              }
            });

          };

          $scope.cancel = function() {
            $mdDialog.cancel();
          };

        }
    }



    	//----------------SELECT CIUDADES---------------//
	 //   	function success_ciudades(desserts) {
		//     var cm = $scope;
	 //        cm.selectCallback = $scope.data_usuario.id_localidad.id;
	 //        cm.selectCiudades = desserts.respuesta;
	 //        cm.selectModelCiudad = {
	 //            selectedCiudades: $scope.data_usuario.id_localidad,
	 //            selectedPeople: [cm.selectCiudades[2], cm.selectCiudades[4]],
	 //            selectedPeopleSections: []
	 //        };
	 //    }

	 //    $scope.data_ciudades = function() {
	 //        colaboradores_Service.Get_Ciudades().get($scope.query, success_ciudades).$promise;
	 //    }
	 //    $scope.data_ciudades();

		// $scope.cambiar_datos_password = function(){
		// 	$mdDialog.show( {
		// 	    controller: DialogController,
		// 	    templateUrl: 'views/dashboard/modal_updat_pass.html',
		// 	    parent: angular.element(document.body),
		// 	    clickOutsideToClose: false, // fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		// 	    locals: {data:$scope.data}
		// 	});
	 //    }

	 //    function DialogController($scope, $mdDialog, mainService, $localStorage, data) {
		//     $scope.verificar = function(){
		//     	mainService.Verificar_Pass().get({pass:$scope.pass}).$promise.then(function(response){
		//     		console.log(response);
		//     		if (response.respuesta) {
		//     			$mdDialog.hide();
		// 	    		mainService.Update_Password().get({pass:$scope.password}).$promise.then(function(data){
		// 	    			console.log('test');
		// 			   //      if (data.respuesta == true) {
		// 			   //        $location.path('/Seleccionar_Sucursal');
		// 			   //      }else{
		// 						// console.log('test');
		// 			   //      }
		// 			    });
		//     		}else{
		//     			// console.log('testtisng');
		//     			$scope.pass = '';
		//     			// $scope.verificar();
		//     		}
		//     	});
		//     }
		// };

});
