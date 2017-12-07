'use strict';
var app = angular.module('nextbook20App', [
                                            'md.data.table',
                                            'ngAnimate',
                                            'ngAria',
                                            'ngMessages',
                                            'ngRoute', // Rutas
                                            'ngSanitize',
                                            'ngMaterial', // Estilo material desing con angular
                                            'lumx', // Estilo material desing add libreary
                                            'route-segment', // rutas en segmento
                                            'view-segment', //vista segmentos 
                                            'ngResource', //llamar recursos por $http api-res
                                            'mdPickers',
                                            'angular-loading-bar',
                                            'ngStorage',
                                            'ngMaterialSidemenu',
                                            'fiestah.money',
                                            'ivh.treeview',
                                            'cb.x2js',
                                            'io-barcode',
                                            'angularMoment',
                                            'chartjs',
                                            'googlechart',
                                            'mdSteppers',
                                            'btford.socket-io',
                                            'angucomplete-alt',
                                            'pascalprecht.translate',
                                            'material.components.expansionPanels',
                                            'ui.tree',
                                            'xmd.directives.xmdWizard',
                                            'ngclipboard',
                                            'pmImageEditor',
                                            'ng.inputSearch',
                                            'lfNgMdFileInput',
                                            'lfNgMdFileInput',
                                            'angular-img-cropper',
                                            'leaflet-directive'
                                        ]);
  // themes configuration
  app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('indigo')
      .primaryPalette('indigo')
      .accentPalette('pink');

    $mdThemingProvider.theme('lime')
      .primaryPalette('lime')
      .accentPalette('orange')
      .warnPalette('blue');
    $mdThemingProvider.theme('docs-dark', 'default').dark();
    $mdThemingProvider.alwaysWatchTheme(true);
    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
  });
  
  app.run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeStart', function(event, $routeSegment) {
      var path=$location.path();
      var res = path.split('/');
      $rootScope.view_segment = res.length-2;
    });

    $rootScope.sidenavState = true;
  });
    
  app.controller('mouseCtrl',($rootScope,$scope,$localStorage,$location, mainService,colaboradores_Service)=>{
    
    $scope.primera_vez = ()=> {
      if ($localStorage.hsesion) {
        $scope.t=mainService.Tiempo_espera_sesion();
        $scope.s=$localStorage.hsesion.hora_fin;
        if ($localStorage.hsesion.u1) {
          $scope.u1=$localStorage.hsesion.u1;
        }else{
          $scope.u1=parseInt(mainService.Get_Hora_in_Time());
          $localStorage.hsesion.u1=$scope.u1;
        }
        $scope.d1=$scope.s-$scope.u1;
      }
    };
    $rootScope.$on("start_session", function() {
      $scope.primera_vez();
    });
    $scope.primera_vez();
    $scope.verify_Session=function(){
      if ($localStorage.hsesion&&($location.path() !== '/Registro' || $location.path() !== '/')) {
          var a,u,d,f;
          u=parseInt(mainService.Get_Hora_in_Time());
          d=$scope.s-u;
          a=d+$scope.t;
          f=a-$scope.d1;
          // si mueve el mouse antes de los 30 segundos, renovar token
          if (f>0&&f<30) {
            $localStorage.hsesion.estado_token = 0;
            if ($localStorage.hsesion.estado_token === 0) {
              colaboradores_Service.Refresh_Token().send({}).$promise.then((data)=>{
                if (data.respuesta) {
                  delete $localStorage.hsesion;
                  $localStorage.token=data.new_token;
                  $localStorage.hsesion={hora_fin:new Date(data.hora_fin).getTime() / 1000,estado_token:1};
                  $scope.primera_vez();
                }
              });
            }
          }
          // si mueve el mouse al llegar al 0, terminar sesion;
          if (f === 0 || f < 0 || f > $scope.t) {
            var storage = $localStorage.cook_session_init;
            $localStorage.$reset();
            $localStorage.cook_session_init = storage;
            $location.path('/Registro');
          }
      }          
    };
  });

  // -----------------------------------------------SEGMENTACION QUERY UI-----------------------------------------------
  app.config(function(ivhTreeviewOptionsProvider) {
     ivhTreeviewOptionsProvider.set({
       defaultSelectedState: false,
       validate: true,
       expandToDepth: -1,
       twistieCollapsedTpl: '+',
       twistieExpandedTpl: '-',
       twistieLeafTpl: '->',
     });
  });

  // ---------------------------------------------concversion html------------------------------------------------------
  app.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
      return $sce.trustAsHtml(text.replace(/\n/g, '<br/>'));
    };
  }]);
    
  