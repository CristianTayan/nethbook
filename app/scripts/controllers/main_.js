'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:MainCtrlCtrl
 * @description
 * # MainCtrlCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  	.controller('main_Ctrl', function ($scope, $location, mainService, $http) {
        $scope.buscando = function(){
            $scope.elementos = [];
            var texto = $scope.data_search;       
            if (texto.length > 2) {
                mainService.search_empresas().get({id: texto}).$promise.then(function (res) {
                    $scope.elementos = [];
                    $scope.elementos = res.data;
                });
            }else{
                $scope.elementos = [];
            }
        }
        $scope.selectedItemChange = function(item) {
            console.log(item);
            if (item) {                
                var resultado = '';
                if (item.nombre_comercial) {
                    resultado = item.nombre_comercial.replace(/ /g, "_");
                    // console.log(resultado);
                    $location.path('/search/' + resultado);
                }else if(item.razon_social){
                    resultado = item.nombre_comercial.replace(/ /g, "_");
                    // console.log(resultado);
                    $location.path('/search/' + resultado);
                }else{
                    // console.log(resultado);
                    $location.path('/search/' + item.ruc);
                }

            }
        }
  	})

