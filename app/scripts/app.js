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
        'lumx', // Estilo material desing add libreary
        'route-segment', // rutas en segmento
        'view-segment', //vista segmentos 
        'ngResource', //llamar recursos por $http api-res
        'mdPickers',
        'blockUI', //Bloqueo general,
        'ngAudio',
        'angular-loading-bar',
        'ngStorage'

    ])
    .config(function ($routeSegmentProvider, $routeProvider) {
        // Configuring provider options    
        $routeSegmentProvider.options.autoLoadTemplates = true;            
                
        // Also, we can add new item in a deep separately. This is useful when working with
        // routes in every module individually
        // -------------------------------------------    Entrada principal    -------------------------------------------   
        
        // Inicio Principal
        $routeSegmentProvider    
            .when('/',    'main')        
            .segment('main', {
                templateUrl: 'views/main/main.html',
                controller: 'main_Ctrl'
            });
        // Acceso, Registro, Personas, Para Ti
        $routeSegmentProvider
            .when('/Registro',    'registro')
            .segment('registro', {
                templateUrl: 'views/registro/registro.html',
                controller: 'registro_Ctrl'
            });
        // Actualizar Datos cambio contraseña
        $routeSegmentProvider
            .when('/Actualizar_Datos',    'actualizar_datos')
            .segment('actualizar_datos', {
                templateUrl: 'views/actualizar_datos/index.html',
                controller: 'actualizar_datos_Ctrl'
            });

        // Seleccionar Sucursal
        $routeSegmentProvider
            .when('/Seleccionar_Sucursal',    'seleccionar_sucursal')
            .segment('seleccionar_sucursal', {
                templateUrl: 'views/seleccionar_sucursal/index.html',
                controller: 'seleccionar_sucursal_Ctrl'
            });

        $routeSegmentProvider
            .when('/Dash',    'dashboard')
            .when('/Inicio',    'dashboard.inicio')
            .when('/Perfil',    'dashboard.perfil')
            
            .segment('dashboard', {
                templateUrl: 'views/dashboard/index.html',
                controller: 'dashboard_Ctrl'
            })
            .within()                
                    .segment('inicio', {
                        templateUrl: 'views/dashboard/inicio.html',
                        controller: 'inicio_Ctrl'
                    })
                    .segment('perfil', {
                        templateUrl: 'views/dashboard/perfil.html',
                        controller: 'perfil_Ctrl'
                    })
                .up();


        // activar cuenta
        $routeSegmentProvider    
            .when('/activarcuenta/:ruc/:correo/:telefono/:telefono1/:provincia/:celular',    'activar')        
            .segment('activar', {
                controller: 'activar_Ctrl',
                dependencies: ['id']
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
                templateUrl: 'views/main/search.html',
                controller: 'search_Ctrl',
                dependencies: ['id']
            })
                .within()                
                    .segment('publicacion', {                        
                        templateUrl: 'views/perfil/publicacion.html'})                        
                    .segment('info', {
                        'default': true,
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
