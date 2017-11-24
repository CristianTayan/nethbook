'use strict';
angular.module('nextbook20App')
  .controller('perfilSucursalCtrl', function($scope, $rootScope, $localStorage, $mdDialog, $timeout, urlService) {
    $rootScope.imgPortada = urlService.server().dir() + $localStorage.imgPortada;
    $rootScope.imgPerfil = urlService.server().dir() + $localStorage.imgPerfil;
    $scope.datos2 = $localStorage.datosE;
    // ------------------------------------INICIO MAPA--------------------------------------------//
      angular.extend($scope, {
          london: {
              lat: 0.3491570668861781,
              lng: -78.12551742303162,
              zoom: 17
          },
          data: {
              markers: {}
          }
      });

      $scope.addMarkers = function() {
        $scope.data.markers = {};
        angular.extend($scope.data, {
            angularInterpolatedMessage: "Angular interpolated message!"
        });
        angular.extend($scope.data, {
          markers: {            
            m1: {
              lat: 0.3491570668861781,
              lng: -78.12551742303162,
              focus: true,
              message: "" + $localStorage.datosE.razon_social,
              icon: {
                iconUrl: '../bower_components/leaflet/dist/images/marker-icon.png',
                shadowUrl: '../bower_components/leaflet/dist/images/marker-icon.png',
                iconSize:     [38, 95],
                shadowSize:   [50, 64],
                iconAnchor:   [22, 94],
                shadowAnchor: [4, 62]
              }
            }
          }
        });
      };

      $scope.removeMarkers = function() {
        $scope.data.markers = {};
      }

      $scope.addMarkers();
    //-----------------------------------FIN MAPA------------------------------------------------//
    $scope.show_img = function(ev, tipo_img) {
      $mdDialog.show({
        controller: Dialog_show_image_Controller,
        templateUrl: 'views/dashboard/perfil_sucursal/show_img.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        fullscreen: $scope.customFullscreen,
        locals: {
            tipo: tipo_img
        }
      });
    }
    // Controlador Mostrar 
    function Dialog_show_image_Controller($scope, tipo, mainService, urlService) {
      $scope.cargando = true;

      function ok_img(resul) {
          $scope.cargando = false;
          $scope.img = urlService.server().dir() + resul.img_full;
      }
      switch (tipo) {
          case 'Perfil':
              //--------------------cargar imagen perfil-----------
              mainService.Get_Img_Perfil().get({
                  sucursal: $localStorage.sucursal.id
              }, ok_img).$promise;
              break;
          case 'Portada':
              //--------------------cargar imagen Portada-----------
              mainService.Get_Img_Portada().get({
                  sucursal: $localStorage.sucursal.id
              }, ok_img).$promise;
              // -------------------------   fin
              break;
      }
      // // -------------------------------elementos acciones show_listaimg_modal-------------------------------
      $scope.cancel = function() {
          $mdDialog.cancel();
      };
    }
    //------------------------- PORTADA SUBIR IMAGEN DE PORTADA -------------------------
    $scope.show_upload_img_modal = function(ev, tipo_img) {
      $mdDialog.show({
        controller: Dialog_subir_image_Controller,
        templateUrl: 'views/dashboard/perfil_sucursal/subir_img.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose: false,
        fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
        locals: {
            tipo_img: tipo_img
        }
      });
    }

    function Dialog_subir_image_Controller($scope, $timeout, urlService, $localStorage, establecimientosService, tipo_img) {
        switch (tipo_img) {
          case 'Portada':
              $scope.crop_size = {
                  width: 1000,
                  height: 300
              };
              break;
          case 'Perfil':
              $scope.crop_size = {
                  width: 500,
                  height: 250
              };
              break;
        }
    //--------------------------Elementos acciones show_lista img_modal------------------
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.Upload = function() {
            switch (tipo_img) {
                case 'Portada':
                    establecimientosService.Add_Img_Portada().send({
                        img: $scope.cropper,
                        sucursal: $localStorage.sucursal.id
                    }).$promise.then((resul) => {
                        if (resul.respuesta == true) {
                            $rootScope.imgPortada = urlService.server().dir() + resul.img;
                            $localStorage.imgPortada = resul.img;
                            $mdDialog.hide();
                        }
                    });
                    break;
                case 'Perfil':
                    establecimientosService.Add_Img_Perfil().send({
                        img: $scope.cropper,
                        sucursal: $localStorage.sucursal.id
                    }).$promise.then((resul) => {
                        if (resul.respuesta == true) {
                            $rootScope.imgPerfil = urlService.server().dir() + resul.img;
                            $localStorage.imgPerfil = resul.img;
                            $mdDialog.hide();
                        }
                    });
                    break;
            }
        };
    }
    //------------------------------------------------------------------------------- SELECIONAR PORTADA
    $scope.show_lista_img_modal = function(ev, tipo_img) {
            var controller;
            switch (tipo_img) {
                case 'Portada':
                    controller = Dialog_lista_image_Portada_Controller;
                    break;
                case 'Perfil':
                    controller = Dialog_lista_image_Perfil_Controller;
                    break;
            }

            $mdDialog.show({
                controller: controller,
                templateUrl: 'views/dashboard/perfil_sucursal/select_img.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                multiple: true,
                clickOutsideToClose: false,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            });
        }
        // Controlador portada

    function Dialog_lista_image_Portada_Controller($scope, $rootScope, $timeout, urlService, $localStorage, establecimientosService) {
        $scope.cargando = true;
        // // -------------------------------Get portadas-------------------------------
        function ok_load_portadas(result) {
            $scope.cargando = false;
            $scope.imgs = result.imgs;
            for (var i = 0; i < $scope.imgs.length; i++) {
                $scope.imgs[i].direccion_imagen_empresa_dir = urlService.server().dir() + $scope.imgs[i].direccion_imagen_recorte;
                $scope.imgs[i].colspan = 4;
                $scope.imgs[i].rowspan = 2;
            }
        }
        $scope.load_img_portadas = function() {
            establecimientosService.Load_Imgs_Portada().get({}, ok_load_portadas).$promise;
        }
        $scope.load_img_portadas();

        $rootScope.$on("actualizar_portadas", function() {
            $scope.load_img_portadas();
        });

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.set_img = function(img) {
            establecimientosService.Set_Img_Portada().send({
                img: img.id
            }).$promise.then((resul) => {
                if (resul.respuesta == true) {
                    console.log(img.direccion_imagen_recorte);
                    $rootScope.imgPortada = img.direccion_imagen_empresa_dir;
                    $localStorage.imgPortada = img.direccion_imagen_recorte;
                    $mdDialog.hide();
                }
            });
        };

        $scope.show_delete_modal = function(ev, img) {

            $mdDialog.show({
                controller: Delete_Controller,
                templateUrl: 'views/dashboard/perfil_sucursal/delete_img.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                multiple: true,
                clickOutsideToClose: false,
                locals: {
                    img: img
                }
            });

        };

        function Delete_Controller($scope, img, $rootScope) {

            $scope.eliminar_img = function() {
                establecimientosService.Delete_Img_Portada().send({
                    img: img.id
                }).$promise.then((resul) => {
                    if (resul.respuesta == true) {
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
    // Controlador Grid de Imagenes Perfil

    function Dialog_lista_image_Perfil_Controller($scope, $rootScope, $timeout, urlService, $localStorage, establecimientosService) {
        $scope.cargando = true;
        // -------------------------------Get imagenes de Perfil-------------------------------
        function ok_load_imgs_perfil(result) {
            $scope.cargando = false;
            $scope.imgs = result.imgs;
            for (var i = 0; i < $scope.imgs.length; i++) {
                $scope.imgs[i].direccion_imagen_empresa_dir = urlService.server().dir() + $scope.imgs[i].direccion_imagen_recorte;
                $scope.imgs[i].colspan = 4;
                $scope.imgs[i].rowspan = 2;
            }
        }
        $scope.load_imgs_perfil = function() {
            establecimientosService.Load_Imgs_Perfil().get({}, ok_load_imgs_perfil).$promise;
        }
        $scope.load_imgs_perfil();

        $rootScope.$on("actualizar_imgs_perfil", function() {
            $scope.load_imgs_perfil();
        });

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.set_img = function(img) {
            establecimientosService.Set_Img_Perfil().send({
                img: img.id
            }).$promise.then((resul) => {
                if (resul.respuesta == true) {
                    $rootScope.imgPerfil = img.direccion_imagen_empresa_dir;
                    $localStorage.imgPerfil = img.direccion_imagen_recorte;
                    $mdDialog.hide();
                }
            });

        };

        $scope.show_delete_modal = function(ev, img) {

            $mdDialog.show({
                controller: Delete_Controller,
                templateUrl: 'views/dashboard/perfil_sucursal/delete_img.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                multiple: true,
                clickOutsideToClose: false,
                locals: {
                    img: img
                }
            });

        };

        function Delete_Controller($scope, img, $rootScope) {

            $scope.eliminar_img = function() {
                establecimientosService.Delete_Img_Perfil().send({
                    img: img.id
                }).$promise.then((resul) => {
                    if (resul.respuesta == true) {
                        $rootScope.$emit("actualizar_imgs_perfil", {});
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