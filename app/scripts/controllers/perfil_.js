'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:PerfilCtrl
 * @description
 * # PerfilCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  .controller('perfil_Ctrl', function ($scope,$rootScope, $localStorage, $mdDialog, $timeout, urlService) {
    $rootScope.imgPortada=(!$localStorage.imgPortada) ?$rootScope.imgPortada = 'http://4.bp.blogspot.com/-rf5TPOMiIVQ/VZJ6U22eecI/AAAAAAAAAfA/E1QP30963M0/s1600/Foto-construir-una-gran-empresa-6.png':urlService.server().dir()+$localStorage.imgPortada;
    
    $scope.datos2 = $localStorage.datosE;


//------------------------------------------------------------------------------- PORTADA
//------------------------------------------------------------------------------- SUBIR IMAGEN DE PORTADA
    $scope.show_upload_img_modal = function(ev){
    	$mdDialog.show({
	      controller: Dialog_subir_image_Controller,
	      templateUrl: 'views/dashboard/perfil_sucursal/subir_img.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:false,
	      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	    })
	    .then(function(answer) {
	      $scope.status = 'You said the information was "' + answer + '".';
	    }, function() {
	      $scope.status = 'You cancelled the dialog.';
	    });
    }


    function Dialog_subir_image_Controller($scope, $timeout, urlService, $localStorage,establecimientosService){
    	// // -------------------------------elementos acciones show_listaimg_modal-------------------------------
	    $scope.cancel = function() {
	      $mdDialog.cancel();
	    };

    	 $scope.Upload = function(){
        establecimientosService.Add_Img_Portada().send({img:$scope.cropper.croppedImage,sucursal:$localStorage.sucursal.id}).$promise.then((resul)=>{
          if (resul.respuesta==true) {
            $rootScope.imgPortada=urlService.server().dir()+resul.img;
            console.log($rootScope.imgPortada);
            $mdDialog.hide();
          }
        });

        };

    }
    //------------------------------------------------------------------------------- SELECIONAR PORTADA
    $scope.show_lista_img_modal = function(ev){
      $mdDialog.show({
        controller: Dialog_lista_image_Controller,
        templateUrl: 'views/dashboard/perfil_sucursal/select_img_portada.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      });
    }


    function Dialog_lista_image_Controller($scope, $timeout, urlService, $localStorage,establecimientosService){
      // // -------------------------------Get portadas-------------------------------

      function ok_load_portadas(result){
        $scope.imgs=result.imgs;
        for (var i = 0; i < $scope.imgs.length; i++) {
            $scope.imgs[i].direccion_imagen_empresa=urlService.server().dir()+$scope.imgs[i].direccion_imagen_empresa;
        }
      }
      establecimientosService.Load_Imgs_Portada().get({},ok_load_portadas).$promise;

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

       $scope.set_img_portada = function(img){
        establecimientosService.Set_Img_Portada().send({img:img.id}).$promise.then((resul)=>{
          if (resul.respuesta==true) {
            $rootScope.imgPortada=img.direccion_imagen_empresa;
            $mdDialog.hide();
          }
        });

        };

    }
//------------------------------------------------------------------------------- FIN PORTADA
    // $scope.show_recordimg_modal = function(ev){
    // 	$mdDialog.show({
	   //    controller: Dialog_recortat_image_Controller,
	   //    templateUrl: 'views/dashboard/perfil_sucursal/recortar_img.html',
	   //    parent: angular.element(document.body),
	   //    targetEvent: ev,
	   //    clickOutsideToClose:false,
	   //    fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
	   //  })
	   //  .then(function(answer) {
	   //    $scope.status = 'You said the information was "' + answer + '".';
	   //  }, function() {
	   //    $scope.status = 'You cancelled the dialog.';
	   //  });
    // }

    // function Dialog_recortat_image_Controller($scope) {

    //     var widths = {
    //         'small': 300,
    //         'medium': 500,
    //         'big': 800
    //       };
    //       $scope.selectionWidth = 100;
    //       $scope.selectionHeight = 70;
    //       $scope.size = 'small';
    //       $scope.width = widths[$scope.size];
    //       $scope.image = 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRQO-QX1K8JoXc2sAabnBOmQG1nWK_C_IG7p1SoNrDo-xx8sIHN';

    //       $scope.$watch('size', function(value) {
    //         if (value) {
    //           $scope.width = widths[value]
    //         }
    //       });
    // }
  });