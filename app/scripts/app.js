'use strict';

/**
 * @ngdoc overview
 * @name nextbook20App
 * @description
 * # nextbook20App
 *
 * Main module of the application.
 */
angular
  .module('nextbook20App', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngRoute', // Rutas
    'ngSanitize',
    'ngMaterial', // Estilo material desing con angular
    'route-segment', // rutas en segmento
    'view-segment', //vista segmentos 
    'ngResource', //llamar recursos por $http api-res
    'mdPickers',
  ])
  .config(function ($routeSegmentProvider, $routeProvider) {

    // Configuring provider options    
    $routeSegmentProvider.options.autoLoadTemplates = true;            
            
    // Also, we can add new item in a deep separately. This is useful when working with
    // routes in every module individually
    // -------------------------------------------    Entrada principal    -------------------------------------------   
    $routeSegmentProvider    
        .when('/',    'main')        
        .segment('main', {
            templateUrl: 'views/main.html',
            controller: 'main_Ctrl'
        });
    // -------------------------------------------    buscador    ----------------------------------------------------
    $routeSegmentProvider
        .when('/search/:id',    'search')
        .segment('search', {
            templateUrl: 'views/search.html',
            controller: 'search_Ctrl'
        });
    // -------------------------------------------    Alternativa de no encontrar     --------------------------------
    // $routeProvider.otherwise({redirectTo: '/'}); 
  });
