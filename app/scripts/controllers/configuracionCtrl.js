'use strict';
var app = angular.module('nextbook20App');
  	app.controller('configuracionCtrl', function ($scope, $mdExpansionPanelGroup, $routeSegment,  $mdDialog, $rootScope, urlService, $localStorage) {


      $scope.$routeSegment = $routeSegment;
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

  app.controller('configuracionSucursalCtrl', function ($scope, $mdExpansionPanelGroup, $routeSegment,  $mdDialog, $rootScope, urlService, $localStorage, perfilSucursalService){
    perfilSucursalService.getImgPerfilAndPortadaSucursal().get().$promise.then((data) => {
      $scope.imgPerfil = urlService.server().dir() + data.imgPerfil;
      $scope.imgPortada = urlService.server().dir() + data.imgPortada;
    });

    $scope.datos2 = $localStorage.datosE; 

    $scope.show_img = function(ev,tipo_img){
      $mdDialog.show({
        controller: Dialog_show_image_Controller,
        templateUrl: 'views/dashboard/perfil_sucursal/show_img.html',
        clickOutsideToClose:false,
        locals:{tipo:tipo_img}
      });
    };

    function Dialog_show_image_Controller($scope, tipo, perfilSucursalService, urlService){
      $scope.cargando=true;
      switch(tipo){
        case 'Perfil':
          perfilSucursalService.Get_Img_Perfil().get().$promise.then((result) => {
            $scope.cargando=false;
            $scope.img=urlService.server().dir()+result.img_full;
          });
        break;
        case 'Portada':
          perfilSucursalService.Get_Img_Portada().get().$promise.then((result) => {
            $scope.cargando=false;
            $scope.img=urlService.server().dir()+result.img_full;
          });
        break;
      }
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
    };

    $scope.show_upload_img_modal = function(ev,tipo_img){
      $mdDialog.show({
        controller: Dialog_subir_image_Controller,
        templateUrl: 'views/dashboard/perfil_sucursal/subir_img.html',
        clickOutsideToClose:false,
        locals:{tipo_img:tipo_img}
      }).then((result) => {
        if (result.tipoImg === 'Portada') {
          $scope.imgPortada = urlService.server().dir() + result.img;
        }
        if (result.tipoImg === 'Perfil') {
          $scope.imgPerfil = urlService.server().dir() + result.img;
        }
      });
    };

    function Dialog_subir_image_Controller($scope, $timeout, urlService, $localStorage,perfilSucursalService,tipo_img){
      switch(tipo_img){
        case 'Portada':
          $scope.crop_size={width:1000,height:300};
        break;
        case 'Perfil':
          $scope.crop_size={width:600,height:600};
        break;
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.Upload = function(){
        switch(tipo_img){
          case 'Portada':
            perfilSucursalService.Add_Img_Portada().send({img:$scope.cropper}).$promise.then((resul)=>{
              if (resul.respuesta==true) {
                $mdDialog.hide({tipoImg: tipo_img, img: resul.img});
              }
            });
          break;
          case 'Perfil':
            perfilSucursalService.Add_Img_Perfil().send({img:$scope.cropper}).$promise.then((resul)=>{
              if (resul.respuesta==true) {
                $mdDialog.hide({tipoImg: tipo_img, img: resul.img});
              }
            });
          break;
        };
      };
    };

    $scope.show_lista_img_modal = function(ev,tipo_img){
      let controller, templates;
      switch(tipo_img){
        case 'Portada':
          controller = Dialog_lista_image_Portada_Ctrl;
          templates = 'views/dashboard/perfil_sucursal/selectPortadaImg.html';
        break;
        case 'Perfil':
          controller = Dialog_lista_image_Perfil_Ctrl;
          templates = 'views/dashboard/perfil_sucursal/selectPerfilImg.html';
        break;
      }
      $mdDialog.show({
        controller: controller,
        templateUrl: templates,
        clickOutsideToClose:false,
        locals: {tipo_img: tipo_img}
      }).then((result) => {
        if (result.tipoImg === 'Perfil') {
          $scope.imgPerfil = urlService.server().dir() + result.img;
        }
        if (result.tipoImg === 'Portada') {
          $scope.imgPortada = urlService.server().dir() + result.img;
        }
      });
    };
    function Dialog_lista_image_Portada_Ctrl($scope,$rootScope, tipo_img, $timeout, urlService, $localStorage,perfilSucursalService){
      $scope.cargando=true;

      function ok_load_portadas(result){
        $scope.cargando=false;
        $scope.imgs=result.imgs;
        $scope.imgs.forEach(function(element, index) {
          $scope.imgs[index].direccion_imagen_empresa_dir=urlService.server().dir()+$scope.imgs[index].direccion_imagen_recorte;
          $scope.imgs[index].colspan = 4;
          $scope.imgs[index].rowspan = 2;
        });
      };

      $scope.load_img_portadas = function(){
        perfilSucursalService.Load_Imgs_Portada().get({},ok_load_portadas).$promise;
      }
      
      $scope.load_img_portadas();

      $rootScope.$on("actualizar_portadas", function() {
        $scope.load_img_portadas();
      });

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.seleccionarImagen = function(img){
        perfilSucursalService.Set_Img_Portada().send({ img: img.id }).$promise.then((resul)=>{
          if (resul.respuesta==true) {
            $mdDialog.hide({tipoImg: tipo_img, img: img.direccion_imagen_recorte});
          }
        });
      };

      $scope.show_delete_modal = function(ev,img){ 
        $mdDialog.show({
          controller: Delete_Controller,
          templateUrl: 'views/dashboard/perfil_sucursal/delete_img.html',
          targetEvent: ev,
          multiple:true,
          clickOutsideToClose:false,
          locals:{img:img}
        });
      };

      function Delete_Controller($scope,img,$rootScope){
        $scope.eliminar_img = function(){
          perfilSucursalService.Delete_Img_Portada().send({img:img.id}).$promise.then((resul)=>{
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

    function Dialog_lista_image_Perfil_Ctrl($scope,$rootScope, $timeout, tipo_img, urlService, $localStorage,perfilSucursalService){
      $scope.cargando=true;

      function ok_load_imgs_perfil(result){
        $scope.cargando=false;
        $scope.imgs=result.imgs;

        $scope.imgs.forEach(function(element, index) {
          $scope.imgs[index].direccion_imagen_empresa_dir=urlService.server().dir()+$scope.imgs[index].direccion_imagen_recorte;
          $scope.imgs[index].colspan= 4;
          $scope.imgs[index].rowspan= 2;
        });
      }
      $scope.load_imgs_perfil=function(){
        perfilSucursalService.Load_Imgs_Perfil().get({},ok_load_imgs_perfil).$promise;
      }
      $scope.load_imgs_perfil();

      $rootScope.$on("actualizar_imgs_perfil", function() {
        $scope.load_imgs_perfil();
      });

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.seleccionarImagen = function(img){
        perfilSucursalService.Set_Img_Perfil().send({img:img.id}).$promise.then((resul)=>{
          if (resul.respuesta==true) {
            $mdDialog.hide({tipoImg: tipo_img, img: img.direccion_imagen_recorte});
          }
        });
      };

      $scope.show_delete_modal = function(ev,img){
        $mdDialog.show({
          controller: Delete_Controller,
          templateUrl: 'views/dashboard/perfil_sucursal/delete_img.html',
          targetEvent: ev,
          multiple:true,
          clickOutsideToClose:false,
          locals:{img:img}
        });
      };

      function Delete_Controller($scope,img,$rootScope){
        $scope.eliminar_img = function(){
          perfilSucursalService.Delete_Img_Perfil().send({img:img.id}).$promise.then((resul)=>{
            if (resul.respuesta==true) {
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

  app.controller('configuracionEmpresaCtrl', function($scope, $rootScope, $localStorage, colaboradores_Service, $mdDialog, $timeout, urlService, perfilEmpresaService) {
                                                                                                                                               
    $rootScope.imgPortadaEmpresa = urlService.server().dir() + $localStorage.imgPortadaEmpresa;
    $rootScope.imgPerfilEmpresa = urlService.server().dir() + $localStorage.imgPerfilEmpresa;
    $scope.dataEmpresa = $localStorage.datosPersona;
    $scope.data_sucursal = $localStorage.sucursal;

    perfilEmpresaService.getImgPerfilAndPortadaEmpresa().get().$promise.then((data) => {
      $scope.imgPerfil = urlService.server().dir() + data.imgPerfil;
      $scope.imgPortada = urlService.server().dir() + data.imgPortada;
    });

    $scope.show_img = function(ev, tipo_img) {
      $mdDialog.show({
        controller: Dialog_show_image_Controller,
        templateUrl: 'views/dashboard/perfil_empresa/show_img.html',
        targetEvent: ev,
        clickOutsideToClose: false,
        fullscreen: $scope.customFullscreen,
        locals: { tipo: tipo_img }
      }).then((result) => {
        if (result.tipoImg === 'PerfilUsuario') {
          $scope.imgPerfil = urlService.server().dir() + result.img;
        }
        if (result.tipoImg === 'PortadaUsuario') {
          $scope.imgPortada = urlService.server().dir() + result.img;
        }
      });
    };

    function Dialog_show_image_Controller($scope, tipo, mainService, urlService) {
      $scope.cargando = true;
      function ok_img(resul) {
        $scope.cargando = false;
        $scope.img = urlService.server().dir() + resul.img_full;
      }
      switch (tipo) {
        case 'PerfilEmpresa':
            perfilEmpresaService.Get_Img_PerfilEmpresa().get({
              sucursal: $localStorage.sucursal.id
            }, ok_img).$promise;
            break;
        case 'PortadaEmpresa':
            perfilEmpresaService.Get_Img_PortadaEmpresa().get({
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
        clickOutsideToClose: false,
        locals: { tipo_img: tipo_img }
      }).then((result) => {
        if (result.tipoImg === 'PerfilEmpresa') {
          $scope.imgPerfil = urlService.server().dir() + result.img;
        }
        if (result.tipoImg === 'PortadaEmpresa') {
          $scope.imgPortada = urlService.server().dir() + result.img;
        }
      });
    };

    function Dialog_subir_image_Controller($scope, $timeout, urlService, $localStorage, perfilEmpresaService, tipo_img) {
      switch (tipo_img) {
        case 'PortadaEmpresa':
          $scope.crop_size = { width: 1000, height: 300 };
          break;
        case 'PerfilEmpresa':
          $scope.crop_size = { width: 600, height: 600 };
          break;
      }
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.Upload = function() {
        switch (tipo_img) {
          case 'PortadaEmpresa':
            perfilEmpresaService.Add_Img_PortadaEmpresa().send({img: $scope.cropper }).$promise.then((result) => {
              if (result.respuesta === true) {
                $mdDialog.hide({ tipoImg:tipo_img, img: result.img });
              }
            });
            break;
          case 'PerfilEmpresa':
            perfilEmpresaService.Add_Img_PerfilEmpresa().send({ img: $scope.cropper }).$promise.then((result) => {
              if (result.respuesta === true) {
                $mdDialog.hide({ tipoImg:tipo_img, img: result.img });
              }
            });
            break;
        }
      };
    };

    $scope.show_lista_img_modal = function(ev, tipo_img) {
      var controller, templates;
      switch (tipo_img) {
        case 'PortadaEmpresa':
          templates = 'views/dashboard/perfil_empresa/selectPortadaImg.html';
          controller = Dialog_lista_image_Portada_Ctrl;
          break;
        case 'PerfilEmpresa':
          templates = 'views/dashboard/perfil_empresa/selectPerfilImg.html';
          controller = Dialog_lista_image_Perfil_Ctrl;
          break;
      }
      $mdDialog.show({
          controller: controller,
          templateUrl: templates,
          clickOutsideToClose: false,
          locals: {tipo_img: tipo_img}
      }).then((result) => {
        if (result.tipoImg === 'PerfilEmpresa') {
          $scope.imgPerfil = urlService.server().dir() + result.img;
        }
        if (result.tipoImg === 'PortadaEmpresa') {
          $scope.imgPortada = urlService.server().dir() + result.img;
        }
      });
    };

    function Dialog_lista_image_Portada_Ctrl($scope, $rootScope, $timeout, tipo_img, urlService, $localStorage, perfilEmpresaService) {
      $scope.cargando = true;
      $scope.load_img_portadas = function() {
        perfilEmpresaService.Load_Imgs_PortadaEmpresa().get().$promise.then((result) => {
          $scope.cargando = false;
          $scope.imgs = result.imgs;
          $scope.imgs.forEach(function(element, index) {
            $scope.imgs[index].direccion_imagen_empresa_dir = urlService.server().dir() + $scope.imgs[index].direccion_imagen_recorte;
            $scope.imgs[index].colspan = 4;
            $scope.imgs[index].rowspan = 2;
          });
        });
      };

      $scope.load_img_portadas();
      $rootScope.$on("actualizar_portadas", function() {
        $scope.load_img_portadas();
      });

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.seleccionarImagen = function(img) {
        perfilEmpresaService.Set_Img_PortadaEmpresa().send({ img: img.id }).$promise.then((resul) => {
          if (resul.respuesta == true) {
            $mdDialog.hide({ tipoImg:tipo_img, img: img.direccion_imagen_recorte });
          }
        });
      };

      $scope.show_delete_modal = function(ev, img) {
        $mdDialog.show({
          controller: Delete_Controller,
          templateUrl: 'views/dashboard/perfil_empresa/delete_img.html',
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
          perfilEmpresaService.Delete_Img_PortadaEmpresa().send({ img: img.id }).$promise.then((resul) => {
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

    function Dialog_lista_image_Perfil_Ctrl($scope, $rootScope, $timeout, tipo_img, urlService, $localStorage, perfilEmpresaService) {
      $scope.cargando = true;

      function ok_load_imgs_perfil(result) {
        $scope.cargando = false;
        $scope.imgs = result.imgs;
        $scope.imgs.forEach(function(element, index) {
          $scope.imgs[index].direccion_imagen_empresa_dir = urlService.server().dir() + $scope.imgs[index].direccion_imagen_recorte;
          $scope.imgs[index].colspan = 4;
          $scope.imgs[index].rowspan = 2;
        });
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

      $scope.seleccionarImagen = function(img) {
        perfilEmpresaService.Set_Img_PerfilEmpresa().send({ img: img.id }).$promise.then((resul) => {
          if (resul.respuesta === true) {
            $mdDialog.hide({ tipoImg: tipo_img, img: img.direccion_imagen_recorte });
          }
        });
      };

      $scope.show_delete_modal = function(ev, img) {
        $mdDialog.show({
          controller: Delete_Controller,
          templateUrl: 'views/dashboard/perfil_empresa/delete_img.html',
          targetEvent: ev,
          multiple: true,
          clickOutsideToClose: false,
          locals: { img: img }
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
  
  app.controller('configuracionPersonalCtrl', function($scope, $rootScope, $localStorage, colaboradores_Service, $mdDialog, $timeout, urlService, perfilUsuarioService) {

    perfilUsuarioService.getImgPerfilAndPortadaUsuario().get().$promise.then((data) => {
      $scope.imgPerfil = urlService.server().dir() + data.imgPerfil;
      $scope.imgPortada = urlService.server().dir() + data.imgPortada;
    });

    $scope.show_img = function(ev, tipo_img) {
      $mdDialog.show({
        controller: Dialog_show_image_Controller,
        templateUrl: 'views/dashboard/perfil_personal/show_img.html',
        clickOutsideToClose: false,
        locals: { tipo: tipo_img }
      });
    };

    function Dialog_show_image_Controller($scope, tipo, mainService, urlService) {
      $scope.cargando = true;
      switch (tipo) {
        case 'PerfilUsuario':
          mainService.Get_Img_PerfilUsuario().get({ sucursal: $localStorage.sucursal.id }, ok_img).$promise.then((result) => {
            $scope.cargando = false;
            $scope.img = urlService.server().dir() + result.img_full;
          });
          break;
        case 'PortadaUsuario':
          mainService.Get_Img_PortadaUsuario().get({ sucursal: $localStorage.sucursal.id }, ok_img).$promise.then((result) => {
            $scope.cargando = false;
            $scope.img = urlService.server().dir() + result.img_full;
          });
          break;
      }
      $scope.cancel = function() {
          $mdDialog.cancel();
      };
    };

    $scope.show_upload_img_modal = function(ev, tipo_img) {
      $mdDialog.show({
        controller: Dialog_subir_image_Controller,
        templateUrl: 'views/dashboard/perfil_personal/subir_img.html',
        clickOutsideToClose: false,        
        locals: { tipo_img: tipo_img }
      }).then((result) => {
        if (result.tipoImg === 'PerfilUsuario') {
          $scope.imgPerfil = urlService.server().dir() + result.img;
        }
        if (result.tipoImg === 'PortadaUsuario') {
          $scope.imgPortada = urlService.server().dir() + result.img;
        }
      });
    };

    function Dialog_subir_image_Controller($scope, $timeout, urlService, $localStorage, perfilUsuarioService, tipo_img) {
      switch (tipo_img) {
        case 'PortadaUsuario':
          $scope.crop_size = { width: 1000, height: 300 };
          break;
        case 'PerfilUsuario':
          $scope.crop_size = { width: 600, height: 600 };
          break;
      }
      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.Upload = function() {
        switch (tipo_img) {
          case 'PortadaUsuario':
            perfilUsuarioService.Add_Img_PortadaUsuario().send({ img: $scope.cropper }).$promise.then((result) => {
              $mdDialog.hide({tipoImg: tipo_img, img: result.img});
            });
            break;
          case 'PerfilUsuario':
            perfilUsuarioService.Add_Img_PerfilUsuario().send({ img: $scope.cropper }).$promise.then((result) => {
              $mdDialog.hide({tipoImg: tipo_img, img: result.img});
            });
            break;
        }
      };
    };
    $scope.show_lista_img_modal = function(ev, tipo_img) {
      let ctrl, templates;
      switch (tipo_img) {
        case 'PortadaUsuario':
          ctrl = Dialog_lista_image_Portada_Ctrl;
          templates = 'views/dashboard/perfil_personal/selectPortadaImg.html';
          break;
        case 'PerfilUsuario':
          ctrl = Dialog_lista_image_Perfil_Ctrl;
          templates = 'views/dashboard/perfil_personal/selectPerfilImg.html';
          break;
      }
      $mdDialog.show({
        controller: ctrl,
        templateUrl: templates,
        locals: { tipo_img: tipo_img },
        clickOutsideToClose: false
      }).then(function(result) {
        if (result.tipoImg === 'PerfilUsuario') {
          $scope.imgPerfil = urlService.server().dir() + result.img;
        }
        if (result.tipoImg === 'PortadaUsuario') {
          $scope.imgPortada = urlService.server().dir() + result.img;
        }
      });
    };
    function Dialog_lista_image_Portada_Ctrl($scope, $rootScope, $timeout, urlService, tipo_img, $localStorage, perfilUsuarioService) {
      $scope.cargando = true;
      $scope.load_img_portadas = function() {
        perfilUsuarioService.Load_Imgs_PortadaUsuario().get().$promise.then((result) => {
          $scope.cargando = false;
          $scope.imgs = result.imgs;
          $scope.imgs.forEach(function(element, index) {
            $scope.imgs[index].direccion_imagen_empresa_dir = urlService.server().dir() + $scope.imgs[index].direccion_imagen_recorte;
            $scope.imgs[index].colspan = 4;
            $scope.imgs[index].rowspan = 2;
          });
        });
      };

      $scope.load_img_portadas();
      $rootScope.$on("actualizar_portadas", function() {
        $scope.load_img_portadas();
      });

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.seleccionarImagen = function(img) {
        perfilUsuarioService.Set_Img_PortadaUsuario().send({ img: img.id }).$promise.then((resul) => {
          if (resul.respuesta == true) {
            $mdDialog.hide({ tipoImg:tipo_img, img: img.direccion_imagen_recorte });
          }
        });
      };

      $scope.show_delete_modal = function(ev, img) {
        $mdDialog.show({
          controller: Delete_Controller,
          templateUrl: 'views/dashboard/perfil_personal/delete_img.html',
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
          perfilUsuarioService.Delete_Img_PortadaUsuario().send({
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

    function Dialog_lista_image_Perfil_Ctrl($scope, $rootScope, $timeout, tipo_img, urlService, $localStorage, perfilUsuarioService) {
      $scope.cargando = true;

      $scope.load_imgs_perfil = function() {
        perfilUsuarioService.Load_Imgs_PerfilUsuario().get().$promise.then((result)=>{
          $scope.cargando = false;
          $scope.imgs = result.imgs;
          $scope.imgs.forEach(function(element, index) {
            $scope.imgs[index].direccion_imagen_empresa_dir = urlService.server().dir() + $scope.imgs[index].direccion_imagen_recorte;
            $scope.imgs[index].colspan = 4;
            $scope.imgs[index].rowspan = 2;
          });
        });
      };

      $scope.load_imgs_perfil();
      $rootScope.$on("actualizar_imgs_perfilUsuario", function() {
        $scope.load_imgs_perfil();
      });

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.seleccionarImagen = function(img) {
        perfilUsuarioService.Set_Img_PerfilUsuario().send({ img: img.id }).$promise.then((resul) => {
          if (resul.respuesta == true) {
            $mdDialog.hide({tipoImg: tipo_img, img: img.direccion_imagen_recorte});
          }
        });
      };

      $scope.show_delete_modal = function(ev, img) {
        $mdDialog.show({
          controller: Delete_Controller,
          templateUrl: 'views/dashboard/perfil_personal/delete_img.html',
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
          perfilUsuarioService.Delete_Img_PerfilUsuario().send({
            img: img.id
          }).$promise.then((resul) => {
            if (resul.respuesta == true) {
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
  });

  app.controller('informacion_generalCtrl', function ($scope, $mdExpansionPanel, configuracionService, $routeSegment,  $mdDialog, $localStorage, colaboradores_Service) {
  	$scope.data_usuario = $localStorage.datosPersona;
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
  		    clickOutsideToClose: false,
  		    locals: {data:$scope.data}
  		});
      }

      function DialogController($scope, $mdDialog, mainService, $localStorage, data) {
  	    $scope.verificar = function(){
  	    	mainService.Verificar_Pass().get({pass:$scope.pass}).$promise.then(function(response){
  	    		if (response.respuesta) {
  	    			$mdDialog.hide();
  		    		mainService.Update_Password().get({pass:$scope.password}).$promise.then(function(data){
  				    });
  	    		}else{
  	    			$scope.pass = '';
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


  