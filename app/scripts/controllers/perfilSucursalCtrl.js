'use strict';

var app = angular.module('nextbook20App');
  app.controller('perfilSucursalCtrl', function($scope, $rootScope, $location, $localStorage, $mdDialog, $timeout, urlService, mainService) {
    $scope.tabSelect = (value) => {
      $location.url('/nb/sucursal/' + value);
    }
    
    mainService.Get_Img_Perfil().get({sucursal:$localStorage.sucursal.id}).$promise.then((data)=>{
      $scope.imgPerfil = urlService.server().dir() + data.img;
    });
    mainService.Get_Img_Portada().get({sucursal:$localStorage.sucursal.id}).$promise.then((data)=>{
      $scope.imgPortada = urlService.server().dir() + data.img;
    });

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
    };
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
                }, ok_img);
                break;
            case 'Portada':
                //--------------------cargar imagen Portada-----------
                mainService.Get_Img_Portada().get({
                    sucursal: $localStorage.sucursal.id
                }, ok_img);
                // -------------------------   fin
                break;
        }
        // -------------------------------elementos acciones show_listaimg_modal-------------------------------
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
            fullscreen: $scope.customFullscreen,
            locals: {
                tipo_img: tipo_img
            }
        });
    };

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
                        if (resul.respuesta === true) {
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
                        if (resul.respuesta === true) {
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
        };
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
            establecimientosService.Load_Imgs_Portada().get({}, ok_load_portadas);
        };

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
                if (resul.respuesta === true) {
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
                    if (resul.respuesta === true) {
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
            establecimientosService.Load_Imgs_Perfil().get({}, ok_load_imgs_perfil);
        };
        
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
                if (resul.respuesta === true) {
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
                    if (resul.respuesta === true) {
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

  app.controller('infoSucursalCtrl', function($scope, $localStorage){
    $scope.datos2 = $localStorage.datosE;
    $scope.sucursal = $localStorage.sucursal.localizacion_sucursal.direccion;
  });

  app.controller('mapaSucursalCtrl', function($scope, $localStorage, $q){
    
    $scope.sucursal = $localStorage.sucursal.localizacion_sucursal.direccion;

    /*global google */
    var geocoder = new google.maps.Geocoder();
    let direccion = $localStorage.sucursal.localizacion_sucursal.direccion;

    // inicializar mapa con valores quemados
    angular.extend($scope, { london: { lat: -1.003824, lng: -78.486328, zoom: 16 } });
    
    var getCordenadas = function() {
      var deferred = $q.defer();                       
      geocoder.geocode({
        'address': direccion
      }, function(results) {
        deferred.resolve(results[0]);
      });        
      return deferred.promise;     
    };

    if (direccion !== '') {
      $q.all([getCordenadas()]).then(function(res) {
        const cordenadas = res[0].geometry.location;
        angular.extend($scope, {
          london: {
            lat: cordenadas.lat(),
            lng: cordenadas.lng(),
            zoom: 16
          },
          markers: {
            m1: {
              lat: cordenadas.lat(),
              lng: cordenadas.lng(),
              focus: true,
              message: $localStorage.datosE.razon_social + ',<br/> <small>' + direccion + '</small>',
              icon: {
                iconUrl: '../bower_components/leaflet/dist/images/marker-icon.png',
                iconSize:     [20, 35],
                iconAnchor:   [10, 10]
              }
            }
          }
        });        
      }, function(reason) {
        $scope.result = reason;
      });
    }
  });

  