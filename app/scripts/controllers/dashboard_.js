'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
app.controller('dashboard_Ctrl', function($scope, $mdSidenav, $localStorage) {
    $scope.toggleSidenav = function(menuId) {
        $mdSidenav(menuId).toggle();
    };
    $scope.nom_perfil = $localStorage.datosE.nombre_comercial;
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