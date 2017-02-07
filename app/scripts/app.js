'use strict';

/**
 * @ngdoc overview
 * @name nextbook20App
 * @description
 * # nextbook20App
 *
 * Main module of the application.
 */
var app = angular.module('nextbook20App', [
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
                                            'angucomplete-alt'
                                        ]);
    
    // themes configuration
    app.config(function($mdThemingProvider) {
      $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
      $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
      $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
      $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
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
    
    app.config(function ($routeSegmentProvider, $routeProvider) {
        // $locationProvider.hashPrefix('');
        // Configuring provider options    
        $routeSegmentProvider.options.autoLoadTemplates = true;            
                
        // Also, we can add new item in a deep separately. This is useful when working with
        // routes in every module individually
        // -------------------------------------------    Entrada principal    -------------------------------------------   
        
        $routeSegmentProvider    
            .when('/Salir',    'salir')        
            .segment('salir', {
                controller: 'cerrar_session_Ctrl'
            });
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
         // Acceso Unico para cada empresa
        $routeSegmentProvider
            .when('/Colaboradores/:ruc',    'acceso-colaboradores')
            .segment('acceso-colaboradores', {
                templateUrl: 'views/acceso-colaboradores/acceso.html',
                controller: 'acceso_colaboradores_Ctrl',
                dependencies: ['ruc']
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
        $routeSegmentProvider.when('/ServiceLogin',    'login_services')
                .segment('login_services', {
                    templateUrl: 'views/dashboard/login_nick.html',
                    controller: 'login_services_Ctrl'
                });
        // Escritorio General
        $routeSegmentProvider
            .when('/Dash',    'dashboard')
            .when('/Inicio',    'dashboard.inicio')
            .when('/Perfil',    'dashboard.perfil')
            .when('/Perfil_Personal',    'dashboard.perfil_personal')
            .when('/App',    'dashboard.app')
            // --------------------------------------GESTION REPOSITORIO FACTURAS------------------------------------
            .when('/App/Repositorio_Facturas',    'dashboard.repositorio_facturas')
                .when('/App/Repositorio_Facturas/Inicio_Facturas',    'dashboard.repositorio_facturas.inicio_facturas')
                .when('/App/Repositorio_Facturas/Mis_Facturas',    'dashboard.repositorio_facturas.mis_facturas')
                .when('/App/Repositorio_Facturas/Subir_Facturas',    'dashboard.repositorio_facturas.subir_facturas')
                .when('/App/Repositorio_Facturas/Facturas_Correo',    'dashboard.repositorio_facturas.facturas_correo')
                .when('/App/Repositorio_Facturas/Facturas_Rechazadas',    'dashboard.repositorio_facturas.facturas_rechazadas')
                
            // ----------------------------------------GESTION COLABORADORES----------------------------------------
            .when('/App/Colaboradores',    'dashboard.colaboradores')
                .when('/App/Colaboradores/Usuario',    'dashboard.colaboradores.usuario')
                .when('/App/Colaboradores/Tipo_Usuario',    'dashboard.colaboradores.tipo_usuario')
            // ------------------------------------------GESTION INVENTARIO-----------------------------------------
            .when('/App/Facturacion',    'dashboard.facturacion')
                // .when('/App/Colaboradores/Usuario',    'dashboard.colaboradores.usuario')
                // .when('/App/Colaboradores/Tipo_Usuario',    'dashboard.colaboradores.tipo_usuario')
            // ------------------------------------------GESTION INVENTARIO-----------------------------------------
            .when('/App/Inventario',    'dashboard.inventario')
                .when('/App/Inventario/',    'dashboard.inventario.menu')
                .when('/App/Inventario/Categorias',    'dashboard.inventario.categoria')
                .when('/App/Inventario/Marcas',    'dashboard.inventario.marcas')
                .when('/App/Inventario/Modelos',    'dashboard.inventario.modelos')
                .when('/App/Inventario/Productos',    'dashboard.inventario.productos')
                .when('/App/Inventario/Ubicacion',    'dashboard.inventario.ubicacion')
                .when('/App/Inventario/Garantia',    'dashboard.inventario.garantia')
                .when('/App/Inventario/Estado_Descriptivo',    'dashboard.inventario.estado_descriptivo')
                // Parametrizacion Tipos
                .when('/App/Inventario/Tipo_Categoria',    'dashboard.inventario.tipo_categoria')
                .when('/App/Inventario/Tipo_Garantia',    'dashboard.inventario.tipo_garantia')
                .when('/App/Inventario/Tipo_Consumo',    'dashboard.inventario.tipo_consumo')
                .when('/App/Inventario/Tipo_Productos',    'dashboard.inventario.tipo_productos')
                .when('/App/Inventario/Tipo_Catalogo',    'dashboard.inventario.tipo_catalogo')
                .when('/App/Inventario/Bodegas',    'dashboard.inventario.bodegas')

            .segment('dashboard', {
                templateUrl: 'views/dashboard/index.html',
                controller: 'dashboard_Ctrl'
            })
            .within()
                    .segment('inicio', {
                        templateUrl: 'views/dashboard/inicio.html',
                        controller: 'inicio_Ctrl',
                        default: true
                    })
                    .segment('perfil', {
                        templateUrl: 'views/dashboard/perfil.html',
                        controller: 'perfil_Ctrl'
                    })
                    .segment('perfil_personal', {
                        templateUrl: 'views/dashboard/perfil_personal.html',
                        controller: 'perfil_personal_Ctrl'
                    })
                    .segment('app', {
                        templateUrl: 'views/app/index.html',
                        controller: 'app_Ctrl'
                    })

                    // ----------------------------------------FACTURACION----------------------------------------
                    .segment('facturacion', {
                        templateUrl: 'views/app/facturacion/index.html',
                        // controller: 'colaboradores_Ctrl'
                    })
                        // .within()
                        //     .segment('factura', {
                        //         default: true,
                        //         templateUrl: 'views/app/facturacion/factura/index.html',
                        //         // controller: 'col_usuario_Ctrl'
                        //     })
                        //     .segment('subir_facturas', {
                        //         templateUrl: 'views/app/facturacion/subir_facturas/index.html',
                        //         // controller: 'col_tipo_usuario_Ctrl'
                        //     })
                        // .up()

                    // ------------------------------------REPOSITORIO FACTURAS------------------------------------
                    .segment('repositorio_facturas', {
                        templateUrl: 'views/app/repositorio_facturas/index.html',
                        // controller: 'colaboradores_Ctrl'
                    })
                        .within()
                            .segment('inicio_facturas', {
                                default: true,
                                templateUrl: 'views/app/repositorio_facturas/inicio_facturas/index.html',
                                controller: 'repfac_inicio_Ctrl'
                            })
                            .segment('mis_facturas', {
                                templateUrl: 'views/app/repositorio_facturas/mis_facturas/index.html',
                                controller: 'mis_facturas_Ctrl'
                            })
                            .segment('subir_facturas', {
                                templateUrl: 'views/app/repositorio_facturas/subir_facturas/index.html',
                                controller: 'subir_factura_electronica_Ctrl'
                            })
                            .segment('facturas_correo', {
                                templateUrl: 'views/app/repositorio_facturas/facturas_correo/index.html',
                                controller: 'leer_correo_facturas_electronica_Ctrl'
                            })   
                            .segment('facturas_rechazadas', {
                                templateUrl: 'views/app/repositorio_facturas/facturas_rechazadas/index.html',
                                controller: 'rechazadas_facturas_electronica_Ctrl'
                            })   
                        .up()


                    // ------------------------------------COLABORADORES------------------------------------
                    .segment('colaboradores', {
                        templateUrl: 'views/app/colaboradores/index.html',
                        // controller: 'colaboradores_Ctrl'
                    })
                        .within()
                            .segment('usuario', {
                                default: true,
                                templateUrl: 'views/app/colaboradores/usuario/index.html',
                                controller: 'col_usuario_Ctrl'
                            })
                            .segment('tipo_usuario', {
                                templateUrl: 'views/app/colaboradores/tipo_usuario/index.html',
                                controller: 'col_tipo_usuario_Ctrl'
                            })
                        .up()

                    // --------------------------------------INVENTARIO--------------------------------------
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
                            .segment('estado_descriptivo', {
                                templateUrl: 'views/app/inventario/estado_descriptivo/index.html',
                                controller: 'inv_estado_descriptivo_Ctrl'
                            })
                            .segment('bodegas', {
                                templateUrl: 'views/app/inventario/bodega/index.html',
                                controller: 'inv_bodegas_Ctrl'
                            })
                .up();
                    // Procesos Inventario
                    // $routeSegmentProvider
                    //     .when('Inventario',    'inventario')
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
