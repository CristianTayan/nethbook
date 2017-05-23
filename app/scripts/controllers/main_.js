'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:MainCtrlCtrl
 * @description
 * # MainCtrlCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
  	app.controller('main_Ctrl', function ($scope, $location, mainService, $http) {
        $scope.img = true;
        $scope.buscando = function(){
            $scope.elementos = [];
            var texto = $scope.data_search;       
            if (texto.length > 2) {
                $scope.img = false;
                mainService.search_empresas().get({id: texto}).$promise.then(function (res) {
                    $scope.elementos = [];
                    $scope.elementos = res.data;
                });
            }else{
                $scope.elementos = [];
                $scope.img = true;
            }
        }
        $scope.selectedItemChange = function(item) {
            if (item) {
                $location.path('/search/' + item.ruc);
            }
        }
  	})

