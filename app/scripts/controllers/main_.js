'use strict';

/**
 * @ngdoc function
 * @name nextbook20App.controller:MainCtrlCtrl
 * @description
 * # MainCtrlCtrl
 * Controller of the nextbook20App
 */
var app = angular.module('nextbook20App')
app.controller('main_Ctrl', function ($scope, $location, mainService, $http , $mdDialog) {
$scope.img = true;
$scope.buscando = function(){
    $scope.elementos = [];
    var texto = $scope.data_search;
    if (texto) {
        if (texto.length > 2) {
            $scope.img = false;
            mainService.search_empresas().get({id: texto}).$promise.then((res) => {
                $scope.elementos = [];
                $scope.elementos = res;
                if (texto.length > 12 && res.length == 0) {
                    $mdDialog.show(
                      $mdDialog.alert()
                        .clickOutsideToClose(true)
                       .title('LO SENTIMOS :(')
                        .textContent('NÚMERO DE RUC NO EXISTE')
                        .ok('ENTENDIDO')
                        .openFrom('#left')
                        .closeTo(angular.element(document.querySelector('#right')))
                    );

                  //alert('no encontrado en el sri');
                }
            });
        }else{
            $scope.elementos = [];
            $scope.img = true;
            }
    }                  
}
$scope.selectedItemChange = function(item) {

    if (item) {
        const res = item.empresa.split(',');
        $location.path('/search/' + res[0]);
    }
}
})

