'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')

app.controller('GridBottomSheetCtrl', function($scope, $mdBottomSheet) {
      $scope.items = [
        { name: 'Hangout', icon: 'person' },
        { name: 'Mail', icon: 'mail' },
        { name: 'Message', icon: 'message' },
        { name: 'Copy', icon: 'copy' },
        { name: 'Facebook', icon: 'facebook' },
        { name: 'Twitter', icon: 'home' },
      ];

      $scope.listItemClick = function($index) {
        let clickedItem = $scope.items[$index];
        $mdBottomSheet.hide(clickedItem);
      };
    })

app.controller('dashboard_Ctrl', function($scope, $rootScope, $mdSidenav, $localStorage, mainService, $http, $translate, $routeSegment, menuService, $mdBottomSheet) {
    $scope.sidenavState = true;
    
    $scope.changeSidenavState = () => {
      $scope.sidenavState =! $scope.sidenavState;
    }
    $scope.getStateSidenav = function() {
      return $rootScope.sidenavState;
    };

    $scope.fullscreen=function() {
        // console.log('test');
        var elem=document;
        if(!document.fullscreenElement&&!document.mozFullScreenElement&&!document.webkitFullscreenElement&&!document.msFullscreenElement) {
            if(elem.requestFullscreen) {
                elem.requestFullscreen();
            }
            else if(elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
            else if(elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            }
            else if(elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        }
        else {
            if(document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if(document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }




    $scope.ruta = $routeSegment;
    // console.log(ruta);
    $scope.changeLanguage = function (key) {
        // console.log(key);
        $translate.use(key);
    };

    $scope.modal_footer = function() {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl: 'views/dashboard/modal-footer.html',
        controller: 'GridBottomSheetCtrl',
        // clickOutsideToClose: false
      }).then(function(clickedItem) {
        $mdToast.show(
              $mdToast.simple()
                .textContent(clickedItem['name'] + ' clicked!')
                .position('top right')
                .hideDelay(1500)
            );
      }).catch(function(error) {
        // User clicked outside or hit escape
      });
    };


    $scope.IsVisible = true;
    $scope.ShowHide = function () {
        //If DIV is visible it will be hidden and vice versa.
        $scope.IsVisible = $scope.IsVisible ? false : true;
    }

    // $http({
    //       method: 'GET',
    //       url: 'http://186.4.167.6/appnext1.1/public/index.php/buscar_empresas?filter=JUAN'
    //     }).then(function successCallback(data) {
            
    //         $scope.registros = data.data.respuesta
    //         console.log($scope.registros);
    //         // this callback will be called asynchronously
    //         // when the response is available
    //       }, function errorCallback(response) {
    //         // called asynchronously if an error occurs
    //         // or server returns response with an error status.
    //       });
    // mainService.buscar_empresas().get().$promise.then(function(data) {
    //     console.log(data.respuesta);
    //     // $scope.todos
    // });


    $scope.localSearch = function(str) {
      var matches = [];
      $scope.people.forEach(function(person) {
        var fullName = person.firstName + ' ' + person.surname;
        if ((person.firstName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
            (person.surname.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
            (fullName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {
          matches.push(person);
        }
      });
      return matches;
    };



    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.nom_perfil = $localStorage.datosE.nombre_comercial;
    $scope.info_sucursal = $localStorage.sucursal;

    $scope.datos_personales = $localStorage.datosPersona;
    var imagePath = 'img/list/60.jpeg';

    // $scope.todos = [];
    // for (var i = 0; i < 15; i++) {
    //     $scope.todos.push({
    //       face: imagePath,
    //       what: "Brunch this weekend?",
    //       who: "Min Li Chan"+i,
    //       notes: "I'll be in your neighborhood doing errands."
    //     });
    // }
});

app.controller('login_services_Ctrl', function($scope, $localStorage, mainService) {
    $scope.empresa = $localStorage.datosE.razon_social;
    $scope.data_login_services_guardar = function() {
        mainService.ingresar({
            'nick': $scope.email,
            'clave': $scope.password
        }).acceso().$promise.then(function(data) {
            if (data.respuesta == false) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#dialogContainer')))
                    .clickOutsideToClose(true)
                    .title('Lo sentimos :(')
                    .textContent('Usuario o password incorrecto, vuelva a intentar')
                    .ok('Entendido')
                    .openFrom('#left')
                );
            }
            if (data.respuesta == true) {
                $localStorage.token = data.token;
                $localStorage.datosE = data.datosE;
                $localStorage.datosPersona = data.datosPersona;
                //--------------------cargar imagen perfil-----------
                mainService.Get_Img_Perfil().get().$promise.then(function(data) {
                    $localStorage.imgPerfil = data.img;
                }, function(error) {
                    $localStorage.imgPerfil = "images/users/avatar-001.jpg";
                });
                //---------------------cargar imagen perfil usuario--------
                 mainService.Get_Img_PerfilUsuario().get().$promise.then(function(data) {
                    $localStorage.imgPerfilUsuario = data.img;
                }, function(error) {
                    $localStorage.imgPerfil = "images/users/avatar-001.jpg";
                });
                //--------------------cargar imagen Portada-----------
                mainService.Get_Img_Portada().get().$promise.then(function(data) {
                    $localStorage.imgPortada = data.img;
                }, function(error) {
                    $localStorage.imgPortada = "images/samples/w1.jpg";
                });
                // ---------- fin
                //--------------------cargar imagen Logo-----------
                mainService.Get_Img_Logo().get().$promise.then(function(data) {
                    $localStorage.imgLogo = data.img;
                }, function(error) {
                    $localStorage.imgPortada = "images/samples/x2.jpg";
                });
                // ---------- fin
                //---------------------- verificar si existe datos de persona-----------
                mainService.Get_Datos_Empresa().get().$promise.then(function(data) {
                    if (data.respuesta) {
                        $location.path('/Seleccionar_Sucursal');
                    } else {
                        $location.path('/Actualizar_Datos');
                    }
                });
            }
        });
    }
});

app.controller('cerrar_session_Ctrl', function($scope, $localStorage, $location, mainService) {
    var storage = $localStorage.cook_session_init;
    $localStorage.$reset();
    $localStorage.cook_session_init = storage;
    $location.path('/Registro');

});