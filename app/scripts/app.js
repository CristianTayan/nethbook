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
                                            'ngMessages',
                                            'ngRoute', // Rutas
                                            'ngSanitize',
                                            'ngMaterial', // Estilo material desing con angular
                                            'lumx', // Estilo material desing add libreary
                                            'route-segment', // rutas en segmento
                                            'view-segment', //vista segmentos 
                                            'ngResource', //llamar recursos por $http api-res
                                            'mdPickers',
                                            'angularSoundManager',
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
                                            // 'ngFileUpload'
                                            'lfNgMdFileInput'
                                        ]);
    
    // themes configuration
    app.config(function($mdThemingProvider,ivhTreeviewOptionsProvider) {
      $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
      $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
      $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
      $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();

    });


    // app.module('material.components.expansionPanels', [
    //     'material.core'
    //   ]);
    



    
    // ------------------------------------------------------IDIOMA------------------------------------------------------
        app.config(function ($translateProvider) {
          $translateProvider.translations('en', {
            MENU_COLABORADORES: 'Collaborators',
            MENU_REP_FACTURAS: 'Invoice repository',
            MENU_FACTURACION: 'Check-in',
            MENU_INVENTARIO: 'Inventory',
            MENU_REP_INICIO: 'Home',
            MENU_REP_FAC_CORREO: 'Mail',
            MENU_REP_FACTURAS: 'My Check-in',
            MENU_REP_FAC_SUBIR: 'Upload Check-in',
            MENU_REP_FAC_RECHAZADA: 'Check-in Rejected',

            BUTTON_LANG_EN: 'English',
            BUTTON_LANG_DE: 'Spanish'
          });
          $translateProvider.translations('es', {
            MENU_COLABORADORES: 'Colaboradores',
            MENU_REP_FACTURAS: 'Repositorio Facturas',
            MENU_FACTURACION: 'Facturación',
            MENU_INVENTARIO: 'Inventario',
            MENU_REP_INICIO: 'Inicio',
            MENU_REP_FAC_CORREO: 'Correo',
            MENU_REP_FACTURAS: 'Mis Facturas',
            MENU_REP_FAC_SUBIR: 'Subir Facturas',
            MENU_REP_FAC_RECHAZADA: 'Facturas Rechazadas',

            BUTTON_LANG_EN: 'INGLES',
            BUTTON_LANG_DE: 'ESPAÑOL'
          });
          $translateProvider.preferredLanguage('es');
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
    
    app.config(function ($routeSegmentProvider, $routeProvider,$locationProvider) {
         $locationProvider.hashPrefix('');
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
        // Actualizar Datos cambio contraseña
        $routeSegmentProvider
            .when('/Actualizar_Datos_Sucursal',    'actualizar_datos_sucursal')
            .segment('actualizar_datos_sucursal', {
                templateUrl: 'views/actualizar_datos/sucursal.html',
                controller: 'actualizar_datos_sucursal_Ctrl'
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
            // .when('/Inicio',    'dashboard.inicio')
            // .when('/Perfil',    'dashboard.perfil')
            // configuracion setting
            .when('/nb',    'dashboard.nb')

            .when('/nb/search/:id',    'dashboard.nb.search')
                .when('/nb/search/:id/Publicacion',    'dashboard.nb.search.publicacion')
                .when('/nb/search/:id/Info',    'dashboard.nb.search.info')
                .when('/nb/search/:id/Ubicacion',    'dashboard.nb.search.ubicacion')
                .when('/nb/search/:id/Similares',    'dashboard.nb.search.similares')
                .when('/nb/search/:id/Favoritos',    'dashboard.nb.search.favoritos')


            .when('/nb/Inicio',    'dashboard.nb.inicio')
            .when('/nb/Perfil',    'dashboard.nb.perfil')

            .when('/nb/Personal',    'dashboard.nb.personal')
            .when('/nb/Personal/Inicio',    'dashboard.nb.personal.inicio')

            // ---------------------------------------configuracion de procesos---------------------------------------
            .when('/nb/Config',    'dashboard.nb.config')
            .when('/nb/Config/Personal',    'dashboard.nb.config.personal')
            .when('/nb/Config/Terminos',    'dashboard.nb.config.terminos')
            // general
            .when('/nb/Config/Empresa',    'dashboard.nb.config.empresa')
            .when('/App',    'dashboard.app')
            .when('/App/Inicio',    'dashboard.app.inicio')
            // --------------------------------------GESTION REPOSITORIO FACTURAS------------------------------------
            .when('/App/Repositorio_Facturas',    'dashboard.app.repositorio_facturas')
                .when('/App/Repositorio_Facturas/Inicio_Facturas',    'dashboard.app.repositorio_facturas.inicio_facturas')
                .when('/App/Repositorio_Facturas/Mis_Facturas',    'dashboard.app.repositorio_facturas.mis_facturas')
                .when('/App/Repositorio_Facturas/Subir_Facturas',    'dashboard.app.repositorio_facturas.subir_facturas')
                .when('/App/Repositorio_Facturas/Facturas_Correo',    'dashboard.app.repositorio_facturas.facturas_correo')
                .when('/App/Repositorio_Facturas/Facturas_Rechazadas',    'dashboard.app.repositorio_facturas.facturas_rechazadas')
                
            // ----------------------------------------GESTION COLABORADORES----------------------------------------
            .when('/App/Colaboradores',    'dashboard.app.colaboradores')
                .when('/App/Colaboradores/Usuario',    'dashboard.app.colaboradores.usuario')
                .when('/App/Colaboradores/Tipo_Usuario',    'dashboard.app.colaboradores.tipo_usuario')
            // ------------------------------------------FACTURACION-----------------------------------------
            .when('/App/Facturacion',    'dashboard.app.facturacion')
            .when('/App/Facturacion/Mis_Facturas_Venta',    'dashboard.app.facturacion.mis_facturas_venta')
            .when('/App/Facturacion/Nueva_Factura_Venta',    'dashboard.app.facturacion.nueva_factura_venta')
            .when('/App/Facturacion/Cajas',    'dashboard.app.facturacion.cajas')
            // ------------------------------------------GESTION INVENTARIO -----------------------------------------
            .when('/App/Inventario',    'dashboard.app.inventario')
                .when('/App/Inventario/',    'dashboard.app.inventario.menu')
                .when('/App/Inventario/Categorias',    'dashboard.app.inventario.categoria')
                    .when('/App/Inventario/Categorias/Productos',    'dashboard.app.inventario.cat_productos')
                    .when('/App/Inventario/Categorias/Bienes',    'dashboard.app.inventario.cat_bienes')
                .when('/App/Inventario/Marcas',    'dashboard.app.inventario.marcas')
                .when('/App/Inventario/Modelos',    'dashboard.app.inventario.modelos')
                .when('/App/Inventario/Productos',    'dashboard.app.inventario.productos')
                .when('/App/Inventario/Ubicacion',    'dashboard.app.inventario.ubicacion')
                .when('/App/Inventario/Garantia',    'dashboard.app.inventario.garantia')
                .when('/App/Inventario/Estado_Descriptivo',    'dashboard.app.inventario.estado_descriptivo')
                // Parametrizacion Tipos
                .when('/App/Inventario/Tipo_Categoria',    'dashboard.app.inventario.tipo_categoria')
                .when('/App/Inventario/Tipo_Garantia',    'dashboard.app.inventario.tipo_garantia')
                .when('/App/Inventario/Tipo_Consumo',    'dashboard.app.inventario.tipo_consumo')
                .when('/App/Inventario/Tipo_Productos',    'dashboard.app.inventario.tipo_productos')
                .when('/App/Inventario/Tipo_Catalogo',    'dashboard.app.inventario.tipo_catalogo')
                .when('/App/Inventario/Bodegas',    'dashboard.app.inventario.bodegas')
                .when('/App/Inventario/Bienes',    'dashboard.app.inventario.bienes')
            // -------------------------------------------PARAMETROS GENERALES-------------------------------------------
            .when('/App/Parametrizacion',    'dashboard.app.parametrizacion')
            .when('/App/Parametrizacion/Inicio',    'dashboard.app.parametrizacion.menu')
            .when('/App/Parametrizacion/Impuestos',    'dashboard.app.parametrizacion.impuestos')

            .segment('dashboard', {
                templateUrl: 'views/dashboard/index.html',
                controller: 'dashboard_Ctrl'
            })
            .within()
                    .segment('nb', {
                        templateUrl: 'views/dashboard/general.html',
                        // controller: 'inicio_Ctrl',
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
                            .segment('personal', {
                                templateUrl: 'views/dashboard/perfil_personal.html',
                                controller: 'perfil_personal_Ctrl'
                            })
                                .within()
                                    .segment('inicio', {
                                        default: true,
                                        templateUrl: 'views/dashboard/perfil_personal/inicio.html',
                                        // controller: 'informacion_generalCtrl'
                                    })
                                .up()

                            .segment('search', {
                                templateUrl: 'views/dashboard/buscador/index.html',
                                controller: 'search_Ctrl',
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
                                .up()
                            .segment('config', {
                                templateUrl: 'views/dashboard/configuracion/index.html',
                                // controller: 'configuracionCtrl'
                            })
                                .within()
                                    .segment('personal', {
                                        default: true,
                                        templateUrl: 'views/dashboard/configuracion/personal/index.html',
                                        controller: 'informacion_generalCtrl'
                                    })
                                    .segment('empresa', {
                                        templateUrl: 'views/dashboard/configuracion/establecimiento/index.html',
                                        controller: 'informacion_general_empresaCtrl'
                                    })
                                    .segment('sucursal', {
                                        templateUrl: 'views/dashboard/configuracion/perfil/index.html',
                                        // controller: 'informacion_generalCtrl'
                                    })
                                    .segment('terminos', {
                                        templateUrl: 'views/dashboard/configuracion/terminos/index.html',
                                    })
                                .up()
                        .up()                    
                    .segment('app', {
                        templateUrl: 'views/app/index.html',
                        controller: 'app_Ctrl'
                    })
                        .within()
                            // ------------------------------------INICIO APP------------------------------------
                            .segment('inicio', {
                                default: true,
                                templateUrl: 'views/app/inicio.html',
                                // controller: 'repositorio_facturas_Ctrl'
                            })

                            // ------------------------------------REPOSITORIO FACTURAS------------------------------------
                                .segment('repositorio_facturas', {
                                    templateUrl: 'views/app/repositorio_facturas/index.html',
                                    controller: 'repositorio_facturas_Ctrl'
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
                                    controller: 'colaboradores_Ctrl'
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
                            // ------------------------------------PARAMETRIZACION GENERAL------------------------------------
                                .segment('parametrizacion', {
                                    templateUrl: 'views/app/parametrizacion/index.html',
                                    controller: 'ParametrizacionCtrl'
                                })
                                    .within()
                                        .segment('menu', {
                                            default: true,
                                            templateUrl: 'views/app/parametrizacion/menu.html',
                                        })
                                        .segment('impuestos', {
                                            templateUrl: 'views/app/parametrizacion/impuestos/index.html',
                                            controller: 'param_impuestos_Ctrl'
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
                                            templateUrl: 'views/app/inventario/categoria/productos/index.html',
                                            controller: 'inv_categoria_productos_Ctrl'
                                        })
                                        .segment('cat_productos', {
                                            default:true,
                                            templateUrl: 'views/app/inventario/categoria/productos/index.html',
                                            controller: 'inv_categoria_productos_Ctrl'
                                        })
                                        .segment('cat_bienes', {
                                            templateUrl: 'views/app/inventario/categoria/bienes/index.html',
                                            controller: 'inv_categoria_bienes_Ctrl'
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
                                        .segment('bienes', {
                                            templateUrl: 'views/app/inventario/bienes/index.html',
                                            controller: 'inv_bienes_Ctrl'
                                        })
                                    .up()

                                // ----------------------------------------FACTURACION----------------------------------------
                                .segment('facturacion', {
                                   templateUrl: 'views/app/facturacion/index.html',
                                    controller: 'facturacion_Ctrl'
                                    })
                                    .within()
                                        .segment('cajas', {
                                            templateUrl: 'views/app/facturacion/cajas/index.html',
                                            controller: 'fac_cajas_Ctrl'
                                        })
                                        .segment('nueva_factura_venta', {
                                            default: true,
                                            templateUrl: 'views/app/facturacion/nueva_factura_venta/index.html',
                                            controller: 'fac_nueva_factura_venta_Ctrl'
                                        })
            
                                        .segment('mis_facturas_venta', {
                                            templateUrl: 'views/app/facturacion/mis_facturas/index.html',
                                            controller: 'fac_mis_facturas_venta_Ctrl'
                                        })
                                    .up()

                        .up()
                    
                .up();
        // activar cuenta
        $routeSegmentProvider    
            .when('/activarcuenta/:codigo',    'activar')        
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

        // -------------------------------------------    buscador  ini sessi  --------------------------------------------------
        // $routeSegmentProvider
        //     .when('/nb/search/:id',    'search_ini')
        //         .when('/nb/search/:id/Publicacion',    'search_ini.publicacion')
        //         .when('/nb/search/:id/Info',    'search_ini.info')
        //         .when('/nb/search/:id/Ubicacion',    'search_ini.ubicacion')
        //         .when('/nb/search/:id/Similares',    'search_ini.similares')
        //         .when('/nb/search/:id/Favoritos',    'search_ini.favoritos')
        //     .segment('search_ini', {
        //         templateUrl: 'views/main/search_ini.html',
        //         controller: 'search_Ctrl',
        //         dependencies: ['id']
        //     })
        //         .within()                
        //             .segment('publicacion', {                        
        //                 templateUrl: 'views/perfil/publicacion.html'})                        
        //             .segment('info', {
        //                 'default': true,
        //                 templateUrl: 'views/perfil/info.html'})
        //             .segment('ubicacion', {
        //                 templateUrl: 'views/perfil/ubicacion.html'})
        //             .segment('similares', {
        //                 templateUrl: 'views/perfil/similares.html'})
        //             .segment('favoritos', {
        //                 templateUrl: 'views/perfil/favoritos.html'})
        //         .up();
        // -------------------------------------------    Alternativa de no encontrar     --------------------------------
        // $routeProvider.otherwise({redirectTo: '/'}); 
    });
