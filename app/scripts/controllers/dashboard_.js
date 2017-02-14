'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
app.controller('dashboard_Ctrl', function($scope, $mdSidenav, $localStorage, mainService, $http, $translate) {
    $scope.changeLanguage = function (key) {
        console.log(key);
        $translate.use(key);
    };


    // LISTA NOSTOP MUSICA
    mainService.gettop10().get().$promise.then(function(data) {
        $scope.songs = data.respuesta;
    });

    $scope.radio = [
            {
                id: 'one',
                title: 'Rain',
                artista: 'Drake',
                url: '186.4.167.5:8000/stream.aac'
            },
            {
                id: 'two',
                title: 'OYEFM',
                artist: 'Esmeraldas',
                url: '186.4.167.5:8001/stream.aac'
            },
            {
                id: 'three',
                title: 'OYEF-FM',
                artist: 'Akon',
                url: '186.4.167.5:8002/stream.aac'
            },
            {
                id: 'four',
                title: 'Angry cow sound?',
                artist: 'A Cow',
                url: 'http://www.freshly-ground.com/data/audio/binaural/Mak.mp3'
            },
            {
                id: 'five',
                title: 'Things that open, close and roll',
                artist: 'Someone',
                url: 'http://www.freshly-ground.com/data/audio/binaural/Things%20that%20open,%20close%20and%20roll.mp3'
            }
        ];




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
    $localStorage.$reset();
    $location.path('/');

});