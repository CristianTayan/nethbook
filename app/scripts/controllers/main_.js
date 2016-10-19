'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:MainCtrlCtrl
 * @description
 * # MainCtrlCtrl
 * Controller of the nextbook20App
 */
angular.module('nextbook20App')
  	.controller('main_Ctrl', function ($scope, $location, mainService) {
  		$scope.items=[];
    	function sucesssearch(data) {
            $scope.items = data.respuesta;
        }
        this.searchTextChange = function(text) {
            mainService.buscar_empresas().get({
                filter: text
            }, sucesssearch);
        }
        this.selectedItemChange = function(item) {
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

