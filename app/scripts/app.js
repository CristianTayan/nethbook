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
            .when('/search/:id/Publicacion',    'search.publicacion')
            .when('/search/:id/Info',    'search.info')
            .when('/search/:id/Ubicacion',    'search.ubicacion')
            .when('/search/:id/Similares',    'search.similares')
            .when('/search/:id/Favoritos',    'search.favoritos')
        .segment('search', {
            templateUrl: 'views/search.html',
            controller: 'search_Ctrl',
            dependencies: ['id']
        })
            .within()                
                .segment('publicacion', {
                    'default': true,
                    templateUrl: 'views/perfil/publicacion.html'})
                    
                .segment('info', {
                    templateUrl: 'views/perfil/info.html'})

                .segment('ubicacion', {
                    templateUrl: 'views/perfil/ubicacion.html'})
                .segment('similares', {
                    templateUrl: 'views/perfil/similares.html'})
                .segment('favoritos', {
                    templateUrl: 'views/perfil/favoritos.html'})

                
            .up();
    // -------------------------------------------    Alternativa de no encontrar     --------------------------------
    // $routeProvider.otherwise({redirectTo: '/'}); 
  });
