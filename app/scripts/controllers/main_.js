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
            // for (var i = 0; i < data.respuesta.length; i++) {
                // data.respuesta[i]['img'] = data.respuesta[i]['img'].perfil;
            // }
            $scope.items = data.respuesta;
            // console.log(data);
        }
        this.searchTextChange = function(text) {
            mainService.buscar_empresas().get({
                filter: text
            }, sucesssearch);
        }
        this.selectedItemChange = function(item) {
        	console.log('test');
            if (item) {
                $location.path('/search/' + item.ruc);

            }
        }
  	})

