'use strict';

var app = angular.module('nextbook20App');
  app.controller('perfilSucursalCtrl', function($scope, $rootScope, $location, $localStorage, $mdDialog, $timeout, urlService) {
    $scope.tabSelect = (value) => {
      $location.url('/nb/App/Administracion/Sucursal/' + value);
    }

      
  });

  app.controller('infoSucursalCtrl', function($scope, $localStorage){
    $scope.datos2 = $localStorage.datosE;
    $scope.sucursal = $localStorage.sucursal.localizacion_sucursal.direccion;
  });

  app.controller('mapaSucursalCtrl', function($scope, $localStorage, $q){
    
    $scope.sucursal = $localStorage.sucursal.localizacion_sucursal.direccion;

    /*global google */
    var geocoder = new google.maps.Geocoder();
    let direccion = $localStorage.sucursal.localizacion_sucursal.direccion;

    // inicializar mapa con valores quemados
    angular.extend($scope, { london: { lat: -1.003824, lng: -78.486328, zoom: 16 } });
    
    var getCordenadas = function() {
      var deferred = $q.defer();                       
      geocoder.geocode({
        'address': direccion
      }, function(results) {
        deferred.resolve(results[0]);
      });        
      return deferred.promise;     
    };

    if (direccion !== '') {
      $q.all([getCordenadas()]).then(function(res) {
        const cordenadas = res[0].geometry.location;
        angular.extend($scope, {
          london: {
            lat: cordenadas.lat(),
            lng: cordenadas.lng(),
            zoom: 16
          },
          markers: {
            m1: {
              lat: cordenadas.lat(),
              lng: cordenadas.lng(),
              focus: true,
              message: $localStorage.datosE.razon_social + ',<br/> <small>' + direccion + '</small>',
              icon: {
                iconUrl: '../bower_components/leaflet/dist/images/marker-icon.png',
                iconSize:     [20, 35],
                iconAnchor:   [10, 10]
              }
            }
          }
        });        
      }, function(reason) {
        $scope.result = reason;
      });
    }
  });

  