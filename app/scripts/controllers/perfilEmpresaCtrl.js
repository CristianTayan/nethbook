'use strict';
var app = angular.module('nextbook20App');
app.controller('perfilEmpresaCtrl', function($scope, $rootScope, $localStorage, colaboradores_Service, $mdDialog, $timeout, urlService, mainService) {
                                                                                                                                           
  $rootScope.imgPortadaEmpresa = urlService.server().dir() + $localStorage.imgPortadaEmpresa;
  $rootScope.imgPerfilEmpresa = urlService.server().dir() + $localStorage.imgPerfilEmpresa;
  $scope.dataEmpresa = $localStorage.datosPersona;
  $scope.data_sucursal = $localStorage.sucursal;

  $scope.show_img = function(ev, tipo_img) {
    $mdDialog.show({
      controller: Dialog_show_image_Controller,
      templateUrl: 'views/dashboard/perfil_empresa/show_img.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: $scope.customFullscreen,
      locals: {
          tipo: tipo_img
      }
    });
  };

  function Dialog_show_image_Controller($scope, tipo, mainService, urlService) {
    $scope.cargando = true;
    function ok_img(resul) {
      $scope.cargando = false;
      $scope.img = urlService.server().dir() + resul.img_full;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////OJO
    switch (tipo) {
      case 'PerfilEmpresa':
          mainService.Get_Img_PerfilEmpresa().get({
            sucursal: $localStorage.sucursal.id
          }, ok_img).$promise;
          break;
      case 'PortadaEmpresa':
          mainService.Get_Img_PortadaEmpresa().get({
            sucursal: $localStorage.sucursal.id
          }, ok_img).$promise;
          break;
    }
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
  };

  $scope.show_upload_img_modal = function(ev, tipo_img) {
    $mdDialog.show({
      controller: Dialog_subir_image_Controller,
      templateUrl: 'views/dashboard/perfil_empresa/subir_img.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: false,
      fullscreen: $scope.customFullscreen,
      locals: {
          tipo_img: tipo_img
      }
    });
  };

  function Dialog_subir_image_Controller($scope, $timeout, urlService, $localStorage, perfilEmpresaService, tipo_img) {
    switch (tipo_img) {
      case 'PortadaEmpresa':
          $scope.crop_size = {
              width: 1000,
              height: 300
          };
          break;
      case 'PerfilEmpresa':
          $scope.crop_size = {
              width: 250,
              height: 250
          };
          break;
    }
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.Upload = function() {
      ////////////////////////////////////////////////////////////////////////////////////////////ojo
      switch (tipo_img) {
        case 'PortadaEmpresa':
            perfilEmpresaService.Add_Img_PortadaEmpresa().send({
              img: $scope.cropper,
              sucursal: $localStorage.sucursal.id
            }).$promise.then((resul) => {
              if (resul.respuesta == true) {
                $rootScope.imgPortadaEmpresa = urlService.server().dir() + resul.img;
                $localStorage.imgPortadaEmpresa = resul.img;
                $mdDialog.hide();
              }
            });
            break;
        case 'PerfilEmpresa':
            perfilEmpresaService.Add_Img_PerfilEmpresa().send({
                img: $scope.cropper,
                sucursal: $localStorage.sucursal.id
            }).$promise.then((resul) => {
              if (resul.respuesta == true) {
                $rootScope.imgPerfilEmpresa = urlService.server().dir() + resul.img;
                $localStorage.imgPerfilEmpresa = resul.img;
                $mdDialog.hide();
              }
            });
            break;
      }
    };
  };
    // SELECIONAR PORTADA Empresa
  $scope.show_lista_img_modal = function(ev, tipo_img) {
    var controller;
    switch (tipo_img) {
      case 'PortadaEmpresa':
        controller = Dialog_lista_image_Portada_Controller;
        break;
      case 'PerfilEmpresa':
        controller = Dialog_lista_image_Perfil_Controller;
        break;
    }
    $mdDialog.show({
        controller: controller,
        templateUrl: 'views/dashboard/perfil_empresa/select_img.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        multiple: true,
        clickOutsideToClose: false,
        fullscreen: $scope.customFullscreen
    });
  };
    // CONTROLADOR PORTADA
  function Dialog_lista_image_Portada_Controller($scope, $rootScope, $timeout, urlService, $localStorage, perfilEmpresaService) {
    $scope.cargando = true;
    // GET PORTADA
    function ok_load_portadas(result) {
        $scope.cargando = false;
        $scope.imgs = result.imgs;
        for (var i = 0; i < $scope.imgs.length; i++) {
            $scope.imgs[i].direccion_imagen_empresa_dir = urlService.server().dir() + $scope.imgs[i].direccion_imagen_recorte;
            $scope.imgs[i].colspan = 4;
            $scope.imgs[i].rowspan = 2;
        }
    };

    $scope.load_img_portadas = function() {
        perfilEmpresaService.Load_Imgs_PortadaEmpresa().get({}, ok_load_portadas).$promise;
    };

    $scope.load_img_portadas();
    $rootScope.$on("actualizar_portadas", function() {
        $scope.load_img_portadas();
    });

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.set_img = function(img) {
      perfilEmpresaService.Set_Img_PortadaEmpresa().send({
        img: img.id
      }).$promise.then((resul) => {
        if (resul.respuesta == true) {
            $rootScope.imgPortadaEmpresa = img.direccion_imagen_empresa_dir;
            $localStorage.imgPortadaEmpresa = img.direccion_imagen_recorte;
            $mdDialog.hide();
        }
      });
    };

    $scope.show_delete_modal = function(ev, img) {
      $mdDialog.show({
        controller: Delete_Controller,
        templateUrl: 'views/dashboard/perfil_empresa/delete_img.html',
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
        perfilEmpresaService.Delete_Img_PortadaEmpresa().send({
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
    };
  };

  function Dialog_lista_image_Perfil_Controller($scope, $rootScope, $timeout, urlService, $localStorage, perfilEmpresaService) {
    $scope.cargando = true;
    //GET IMAGEN PERFIL
    function ok_load_imgs_perfil(result) {
      $scope.cargando = false;
      $scope.imgs = result.imgs;
      for (var i = 0; i < $scope.imgs.length; i++) {
          $scope.imgs[i].direccion_imagen_empresa_dir = urlService.server().dir() + $scope.imgs[i].direccion_imagen_recorte;
          $scope.imgs[i].colspan = 4;
          $scope.imgs[i].rowspan = 2;
      }
    };

    $scope.load_imgs_perfil = function() {
        perfilEmpresaService.Load_Imgs_PerfilEmpresa().get({}, ok_load_imgs_perfil).$promise;
    };

    $scope.load_imgs_perfil();
    $rootScope.$on("actualizar_imgs_perfilEmpresa", function() {
      $scope.load_imgs_perfil();
    });

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.set_img = function(img) {
      perfilEmpresaService.Set_Img_PerfilEmpresa().send({
        img: img.id
      }).$promise.then((resul) => {
        if (resul.respuesta == true) {
            $rootScope.imgPerfilEmpresa = img.direccion_imagen_empresa_dir;
            $localStorage.imgPerfilEmpresa = img.direccion_imagen_recorte;
            $mdDialog.hide();
        }
      });
    };

    $scope.show_delete_modal = function(ev, img) {
      $mdDialog.show({
        controller: Delete_Controller,
        templateUrl: 'views/dashboard/perfil_empresa/delete_img.html',
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
        perfilEmpresaService.Delete_Img_PerfilEmpresa().send({
          img: img.id
        }).$promise.then((resul) => {
          if (resul.respuesta == true) {
              $rootScope.$emit("actualizar_imgs_perfilEmpresa", {});
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