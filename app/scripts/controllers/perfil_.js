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
        multiple:true,
        clickOutsideToClose:false,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      });
    }


    function Dialog_lista_image_Controller($scope,$rootScope, $timeout, urlService, $localStorage,establecimientosService){

      // // -------------------------------Get portadas-------------------------------
      function ok_load_portadas(result){
        $scope.imgs=result.imgs;
        for (var i = 0; i < $scope.imgs.length; i++) {
            $scope.imgs[i].direccion_imagen_empresa_dir=urlService.server().dir()+$scope.imgs[i].direccion_imagen_empresa;
            $scope.imgs[i].colspan= 3;
            $scope.imgs[i].rowspan= 2;
        }
      }
      $scope.load_img_portadas=function(){
        establecimientosService.Load_Imgs_Portada().get({},ok_load_portadas).$promise;
      }
      $scope.load_img_portadas();

      $rootScope.$on("actualizar_portadas", function() {
                $scope.load_img_portadas();
      });

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

       $scope.set_img_portada = function(img){
        establecimientosService.Set_Img_Portada().send({img:img.id}).$promise.then((resul)=>{
          if (resul.respuesta==true) {
            $rootScope.imgPortada=img.direccion_imagen_empresa_dir;
            $localStorage.imgPortada=img.direccion_imagen_empresa;
            $mdDialog.hide();
          }
        });

        };

        $scope.show_delete_modal = function(ev,img){
          
          $mdDialog.show({
            controller: Delete_Controller,
            templateUrl: 'views/dashboard/perfil_sucursal/delete_img_portada.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            multiple:true,
            clickOutsideToClose:false,
            locals:{img:img}
          });

        };

        function Delete_Controller($scope,img,$rootScope){

          $scope.eliminar_portada = function(){
            establecimientosService.Delete_Img_Portada().send({img:img.id}).$promise.then((resul)=>{
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

         });

           