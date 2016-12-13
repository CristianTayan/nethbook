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
        'md.data.table',
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
        'ngStorage',
        'ngMaterialSidemenu'
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
        // Escritorio General
        $routeSegmentProvider
            .when('/Dash',    'dashboard')
            .when('/Inicio',    'dashboard.inicio')
            .when('/Perfil',    'dashboard.perfil')
            .when('/App',    'dashboard.app')
            .when('/Inventario',    'dashboard.inventario')
                .when('/Inventario/',    'dashboard.inventario.menu')

                .when('/Inventario/Categorias',    'dashboard.inventario.categoria')
                .when('/Inventario/Marcas',    'dashboard.inventario.marcas')
                .when('/Inventario/Modelos',    'dashboard.inventario.modelos')
                .when('/Inventario/Productos',    'dashboard.inventario.productos')
                .when('/Inventario/Ubicacion',    'dashboard.inventario.ubicacion')
                .when('/Inventario/Garantia',    'dashboard.inventario.garantia')
                .when('/Inventario/Estado_Descriptivo',    'dashboard.inventario.estado_descriptivo')
                // Parametrizacion Tipos
                .when('/Inventario/Tipo_Categoria',    'dashboard.inventario.tipo_categoria')
                .when('/Inventario/Tipo_Garantia',    'dashboard.inventario.tipo_garantia')
                .when('/Inventario/Tipo_Consumo',    'dashboard.inventario.tipo_consumo')
                .when('/Inventario/Tipo_Productos',    'dashboard.inventario.tipo_productos')
                .when('/Inventario/Tipo_Catalogo',    'dashboard.inventario.tipo_catalogo')

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
                    .segment('app', {
                        templateUrl: 'views/app/index.html',
                        controller: 'app_Ctrl'
                    })
                    .segment('inventario', {
                        templateUrl: 'views/app/inventario/index.html',
                        controller: 'inventario_Ctrl'
                    })
                        .within()
                            .segment('menu', {
                                default: true,
                                templateUrl: 'views/app/inventario/menu.html',
                                controller: 'inv_menu_Ctrl'
                            })
                            .segment('categoria', {
                                templateUrl: 'views/app/inventario/categoria/index.html',
                                controller: 'inv_categoria_Ctrl'
                            })
                            .segment('marcas', {
                                templateUrl: 'views/app/inventario/marcas/index.html',
                                controller: 'inv_marcas_Ctrl'
                            })
                            .segment('modelos', {
                                templateUrl: 'views/app/inventario/modelos/index.html',
                                controller: 'inv_modelos_Ctrl'
                            })
                            .segment('productos', {
                                templateUrl: 'views/app/inventario/productos/index.html',
                                controller: 'inv_productos_Ctrl'
                            })
                            .segment('ubicacion', {
                                templateUrl: 'views/app/inventario/ubicacion/index.html',
                                controller: 'inv_ubicacion_Ctrl'
                            })
                            .segment('garantia', {
                                templateUrl: 'views/app/inventario/garantia/index.html',
                                controller: 'inv_garantia_Ctrl'
                            })
                            .segment('estado_descriptivo', {
                                templateUrl: 'views/app/inventario/estado_descriptivo/index.html',
                                controller: 'inv_garantia_Ctrl'
                            })
                            // Tipos 
                            .segment('tipo_categoria', {
                                templateUrl: 'views/app/inventario/tipo_categoria/index.html',
                                controller: 'inv_tipo_categoria_Ctrl'
                            })
                            .segment('tipo_garantia', {
                                templateUrl: 'views/app/inventario/tipo_garantia/index.html',
                                controller: 'inv_tipo_garantia_Ctrl'
                            })
                            .segment('tipo_consumo', {
                                templateUrl: 'views/app/inventario/tipo_consumo/index.html',
                                controller: 'inv_tipo_consumo_Ctrl'
                            })
                            .segment('tipo_productos', {
                                templateUrl: 'views/app/inventario/tipo_productos/index.html',
                                controller: 'inv_tipo_productos_Ctrl'
                            })
                            .segment('tipo_catalogo', {
                                templateUrl: 'views/app/inventario/tipo_catalogo/index.html',
                                controller: 'inv_tipo_catalogo_Ctrl'
                            })
                        .up()
                .up();
                    // Procesos Inventario
                    // $routeSegmentProvider
                    //     .when('/Inventario',    'inventario')
                    //     // .when('/Inventario',    'app.perfil')
                        
                    //     .segment('app', {
                    //         templateUrl: 'views/app/index.html',
                    //         controller: 'app_Ctrl'
                    //     })
                    //     .within()                
                    //             .segment('inicio', {
                    //                 templateUrl: 'views/dashboard/inicio.html',
                    //                 controller: 'inicio_Ctrl'
                    //             })
                    //             .segment('perfil', {
                    //                 templateUrl: 'views/dashboard/perfil.html',
                    //                 controller: 'perfil_Ctrl'
                    //             })
                    //         .up();

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
