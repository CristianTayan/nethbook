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
                                            'ng.inputSearch',
                                            'lfNgMdFileInput',
                                            'lfNgMdFileInput',
                                            'angular-img-cropper'
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


        $mdThemingProvider.alwaysWatchTheme(true);
    });
    // app.config(function($mdThemingProvider) {
    //       $mdThemingProvider.theme('default')
    //         .primaryPalette('blue');
    //       $mdThemingProvider.theme('default-toolbar')
    //         .primaryPalette('pink');
    //     })


    // app.module('material.components.expansionPanels', [
    //     'material.core'
    //   ]);
    //
       app.run(['$rootScope', '$location',function($rootScope, $location) {
            $rootScope.$on('$routeChangeStart', function(event) {
                var path=$location.path();
                var res = path.split('/');
                $rootScope.view_segment=res.length-2;
            });
        }]);
    
    app.controller('mouseCtrl',($rootScope,$scope,$localStorage,$location, mainService,colaboradores_Service)=>{
       
        $scope.primera_vez=()=>{
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
        }
        $rootScope.$on("start_session", function() {
                $scope.primera_vez();
            });
        $scope.primera_vez();
        $scope.verify_Session=function(){
            if ($localStorage.hsesion&&($location.path()!='/Registro'||$location.path()!='/')) {
                var a,u,d,f;
                u=parseInt(mainService.Get_Hora_in_Time());
                d=$scope.s-u;
                 a=d+$scope.t;
                    f=a-$scope.d1;
                    // console.log(f);
                    // si mueve el mouse antes de los 30 segundos, renovar token
                    if (f>0&&f<30) {
                        $localStorage.hsesion.estado_token=0;
                        // console.log('update token');
                        if ($localStorage.hsesion.estado_token==0) {
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
                    if (f==0||f<0||f>$scope.t) {
                        var storage = $localStorage.cook_session_init;
                            $localStorage.$reset();
                            $localStorage.cook_session_init = storage;
                            $location.path('/Registro');
                    }
            }
            
        }
    });


    
    // ------------------------------------------------------IDIOMA-------------------------------------------------------
        app.config(function ($translateProvider) {
          $translateProvider.translations('en', {
            MENU_COLABORADORES: 'Collaborators',
            MENU_REP_FACTURAS: 'Invoice repository',
            MENU_FACTURACION: 'Check-in',
            MENU_INVENTARIO: 'Inventory',
            MENU_REP_INICIO: 'Home',
            MENU_REP_FAC_CORREO: 'Mail',
            MENU_REP_MI_FAC: 'My Check-in',
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
            MENU_REP_MI_FAC: 'Mis Facturas',
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
    
    // --------------------------------------------vistas generadas rutas ------------------------------------------------
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
        // activar cuenta
        $routeSegmentProvider    
            .when('/activarcuenta/:codigo',    'activar')        
            .segment('activar', {
                controller: 'activar_Ctrl',
                dependencies: ['id']
            });

        // Escritorio General
        // Actualizar Datos cambio contraseña
        $routeSegmentProvider
            .when('/Actualizar_Datos',    'actualizar_datos')
            .segment('actualizar_datos', {
                templateUrl: 'views/actualizar_datos/index.html',
                controller: 'actualizar_datos_Ctrl'
            });
        // Actualizar Datos cambio contraseña SUcursal
        $routeSegmentProvider
            .when('/Actualizar_Datos_Sucursal',    'actualizar_datos_sucursal')
            .segment('actualizar_datos_sucursal', {
                templateUrl: 'views/actualizar_datos/sucursal.html',
                controller: 'actualizar_datos_sucursal_Ctrl'
            });
        $routeSegmentProvider

        .when('/Nb',    'nb')
        .when('/Nb/Inicio',    'nb.inicio')
        // Segmento Aplicaciones/Modulos
        .when('/Nb/App',    'nb.app.inicio')
            // Modulo de Gerencia
            .when('/Nb/App/Gerencia','nb.app.gerencia')
                // Modulo de Finanzas
            .when('/Nb/App/Finanzas','nb.app.finanzas')
            .when('/Nb/App/Finanzas/Contable','nb.app.finanzas.contable')
                .when('/Nb/App/Finanzas/Contable/Repositorio_Facturas','nb.app.finanzas.contable.repositorio_facturas')
                    .when('/Nb/App/Finanzas/Contable/Repositorio_Facturas/Inicio_Facturas','nb.app.finanzas.contable.repositorio_facturas.inicio_facturas')
                    .when('/Nb/App/Finanzas/Contable/Repositorio_Facturas/Mis_Facturas','nb.app.finanzas.contable.repositorio_facturas.mis_facturas')
                    .when('/Nb/App/Finanzas/Contable/Repositorio_Facturas/Subir_Facturas','nb.app.finanzas.contable.repositorio_facturas.subir_facturas')
                    .when('/Nb/App/Finanzas/Contable/Repositorio_Facturas/Facturas_Correo','nb.app.finanzas.contable.repositorio_facturas.facturas_correo')
                    .when('/Nb/App/Finanzas/Contable/Repositorio_Facturas/Facturas_Rechazadas','nb.app.finanzas.contable.repositorio_facturas.facturas_rechazadas')
                // Modulo de Finanzas-Ventas
            .when('/Nb/App/Finanzas/Ventas','nb.app.finanzas.ventas')
                .when('/Nb/App/Finanzas/Ventas/Facturacion','nb.app.finanzas.ventas.facturacion')
                    .when('/Nb/App/Finanzas/Ventas/Facturacion/Nueva_Factura_Venta','nb.app.finanzas.ventas.facturacion.nueva_factura_venta')
                    .when('/Nb/App/Finanzas/Ventas/Facturacion/Cajas','nb.app.finanzas.ventas.facturacion.cajas')
                    .when('/Nb/App/Finanzas/Ventas/Facturacion/Mis_Facturas_Venta','nb.app.finanzas.ventas.facturacion.mis_facturas_venta')
                    .when('/Nb/App/Finanzas/Ventas/Facturacion/Clientes','nb.app.finanzas.ventas.facturacion.clientes')
                // Modulo de Finanzas-Inventario
            .when('/Nb/App/Finanzas/Inventario','nb.app.finanzas.inventario')
                // Modulo de Finanzas- Inventario Bienes
            .when('/Nb/App/Finanzas/Inventario/Inv_Bienes','nb.app.finanzas.inventario.Inv_Bienes')
                .when('/Nb/App/Finanzas/Inventario/Inv_Bienes/Categorias','nb.app.finanzas.inventario.Inv_Bienes.categoria')
                .when('/Nb/App/Finanzas/Inventario/Inv_Bienes/Categorias/Tipo_Categoria','nb.app.finanzas.inventario.Inv_Bienes.categoria.tipo_categorias')
                .when('/Nb/App/Finanzas/Inventario/Inv_Bienes/Marcas','nb.app.finanzas.inventario.Inv_Bienes.marcas')
                .when('/Nb/App/Finanzas/Inventario/Inv_Bienes/Modelos','nb.app.finanzas.inventario.Inv_Bienes.modelos')
                .when('/Nb/App/Finanzas/Inventario/Inv_Bienes/Bienes','nb.app.finanzas.inventario.Inv_Bienes.bienes')
                .when('/Nb/App/Finanzas/Inventario/Inv_Bienes/Ubicacion','nb.app.finanzas.inventario.Inv_Bienes.ubicacion')
                .when('/Nb/App/Finanzas/Inventario/Inv_Bienes/Garantia','nb.app.finanzas.inventario.Inv_Bienes.garantia')
                .when('/Nb/App/Finanzas/Inventario/Inv_Bienes/Garantia/Tipo_Garantia','nb.app.finanzas.inventario.Inv_Bienes.garantia.tipo_garantias')
                .when('/Nb/App/Finanzas/Inventario/Inv_Bienes/Estado_Descriptivo','nb.app.finanzas.inventario.Inv_Bienes.estado_descriptivo')
                .when('/Nb/App/Finanzas/Inventario/Inv_Bienes/Tipo_Consumo','nb.app.finanzas.inventario.Inv_Bienes.tipo_consumo')
                // Modulo de Finanzas- Inventario Servicios
            .when('/Nb/App/Finanzas/Inventario/Inv_Servicios','nb.app.finanzas.inventario.Inv_Servicios')
                .when('/Nb/App/Finanzas/Inventario/Inv_Servicios/Categorias','nb.app.finanzas.inventario.Inv_Servicios.categorias')
                .when('/Nb/App/Finanzas/Inventario/Inv_Servicios/Categorias/Tipo_Categorias','nb.app.finanzas.inventario.Inv_Servicios.categorias.tipo_categorias')
                .when('/Nb/App/Finanzas/Inventario/Inv_Servicios/Modelos','nb.app.finanzas.inventario.Inv_Servicios.modelos')
                .when('/Nb/App/Finanzas/Inventario/Inv_Servicios/Servicios','nb.app.finanzas.inventario.Inv_Servicios.servicios')
                .when('/Nb/App/Finanzas/Inventario/Inv_Servicios/Ubicacion','nb.app.finanzas.inventario.Inv_Servicios.ubicacion')
                .when('/Nb/App/Finanzas/Inventario/Inv_Servicios/Garantia','nb.app.finanzas.inventario.Inv_Servicios.garantia')
                .when('/Nb/App/Finanzas/Inventario/Inv_Servicios/Garantia/Tipo_Garantia','nb.app.finanzas.inventario.Inv_Servicios.garantia.tipo_garantias')
                .when('/Nb/App/Finanzas/Inventario/Inv_Servicios/Estado_Descriptivo','nb.app.finanzas.inventario.Inv_Servicios.estado_descriptivo')
                .when('/Nb/App/Finanzas/Inventario/Inv_Servicios/Tipo_Consumo','nb.app.finanzas.inventario.Inv_Servicios.tipo_consumo')
                // Modulo de Finanzas- Inventario Productos
            .when('/Nb/App/Finanzas/Inventario/Inv_Productos','nb.app.finanzas.inventario.Inv_Productos')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Categorias','nb.app.finanzas.inventario.Inv_Productos.categoria')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Categorias/Tipo_Categoria','nb.app.finanzas.inventario.Inv_Productos.categoria.tipo_categorias')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Marcas','nb.app.finanzas.inventario.Inv_Productos.marcas')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Modelos','nb.app.finanzas.inventario.Inv_Productos.modelos')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Productos','nb.app.finanzas.inventario.Inv_Productos.productos')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Ubicacion','nb.app.finanzas.inventario.Inv_Productos.ubicacion')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Garantia','nb.app.finanzas.inventario.Inv_Productos.garantia')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Garantia/Tipo_Garantia','nb.app.finanzas.inventario.Inv_Productos.garantia.tipo_garantias')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Estado_Descriptivo','nb.app.finanzas.inventario.Inv_Productos.estado_descriptivo')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Tipo_Consumo','nb.app.finanzas.inventario.Inv_Productos.tipo_consumo')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Tipo_Catalogo','nb.app.finanzas.inventario.Inv_Productos.tipo_catalogo')
                .when('/Nb/App/Finanzas/Inventario/Inv_Productos/Bodegas','nb.app.finanzas.inventario.Inv_Productos.bodegas')
            // Modulo de Talento Humano
            .when('/Nb/App/Talento_Humano','nb.app.talento_humano')
            // Modulo de Giro del Negocio
            .when('/Nb/App/Giro_Negocio','nb.app.giro_negocio')
            // Modulo de Administracion
            .when('/Nb/App/Administracion','nb.app.administracion')
                .when('/Nb/App/Administracion/Perfil_Personal','nb.app.administracion.perfil_personal')
                .when('/Nb/App/Administracion/Perfil_Sucursal','nb.app.administracion.perfil_sucursal')
                .when('/Nb/App/Administracion/Usuario','nb.app.administracion.usuario')
                .when('/Nb/App/Administracion/Datos_Personal','nb.app.administracion.personal')
                .when('/Nb/App/Administracion/Terminos','nb.app.administracion.terminos')
                .when('/Nb/App/Administracion/Tipo_Usuario','nb.app.administracion.tipo_usuario')
        // -------------------------------------------------------------- Segmentos 
        .segment('nb', {
                            templateUrl: 'views/dashboard/index.html',
                            controller: 'dashboard_Ctrl'
                        })
            .within()
                .segment('inicio', {
                    templateUrl: 'views/dashboard/inicio.html',
                    controller: 'inicio_Ctrl',
                    default: true
                })
                // Segmento Aplicaciones/Modulos
            .segment('app', {
                     templateUrl: 'views/app/index.html',
                     controller: 'app_Ctrl'
                })
                .within()
                    .segment('inicio', {
                            default: true,
                            templateUrl: 'views/app/inicio.html',
                            // controller: 'repositorio_facturas_Ctrl'
                    })
                    // Modulo de Administracion
                    .segment('administracion', {
                            templateUrl: 'views/dashboard/administracion/index.html',
                            // controller: 'administracion_Ctrl'
                    })
                        .within()
                            .segment('perfil_personal', {
                                    templateUrl: 'views/dashboard/perfil_personal.html',
                                    // controller: 'perfil_personal_Ctrl'
                            })
                            .segment('perfil_sucursal', {
                                    templateUrl: 'views/dashboard/perfil.html',
                                    controller: 'perfil_Ctrl'
                            })
                            .segment('personal', {
                                    templateUrl: 'views/dashboard/configuracion/personal/index.html',
                                    controller: 'informacion_generalCtrl'
                            })
                            .segment('terminos', {
                                    templateUrl: 'views/dashboard/configuracion/terminos/index.html'
                            })
                            .segment('tipo_usuario', {
                                    templateUrl: 'views/app/colaboradores/tipo_usuario/index.html',
                                    controller: 'col_tipo_usuario_Ctrl'
                            })
                            .segment('usuario', {
                                    templateUrl: 'views/app/colaboradores/usuario/index.html',
                                    controller: 'col_usuario_Ctrl'
                            })
                        .up()
                    // Modulo de Finanzas
                    .segment('finanzas', {
                            templateUrl: 'views/app/finanzas/index.html',
                            // controller: 'administracion_Ctrl'
                    })
                        .within()
                            //Modulo Contable
                            .segment('contable', {
                                    templateUrl: 'views/app/finanzas/contable/index.html'
                            })
                            .within()
                                // Repositorio de Facturas
                                .segment('repositorio_facturas', {
                                    templateUrl: 'views/app/finanzas/contable/repositorio_facturas/index.html',
                                    controller: 'RepositorioFacturasCtrl'
                                })
                                .within()
                                     .segment('inicio_facturas', {
                                        default: true,
                                        templateUrl: 'views/app/finanzas/contable/repositorio_facturas/inicio_facturas/index.html',
                                        controller: 'repfac_inicio_Ctrl'
                                    })
                                    .segment('mis_facturas', {
                                        templateUrl: 'views/app/finanzas/contable/repositorio_facturas/mis_facturas/index.html',
                                        controller: 'mis_facturas_Ctrl'
                                    })
                                    .segment('subir_facturas', {
                                        templateUrl: 'views/app/finanzas/contable/repositorio_facturas/subir_facturas/index.html',
                                        controller: 'subir_factura_electronica_Ctrl'
                                    })
                                    .segment('facturas_correo', {
                                        templateUrl: 'views/app/finanzas/contable/repositorio_facturas/facturas_correo/index.html',
                                        controller: 'leer_correo_facturas_electronica_Ctrl'
                                    })   
                                    .segment('facturas_rechazadas', {
                                        templateUrl: 'views/app/finanzas/contable/repositorio_facturas/facturas_rechazadas/index.html',
                                        controller: 'rechazadas_facturas_electronica_Ctrl'
                                    }) 
                                .up()
                                //Fin
                            .up()
                            //fin
                            // Modulo de Fcturacion-Ventas
                           .segment('ventas', {
                                templateUrl: 'views/app/finanzas/ventas/index.html'
                            })
                            .within()
                                .segment('facturacion', {
                                    templateUrl: 'views/app/finanzas/ventas/facturacion/index.html',
                                    controller: 'facturacion_Ctrl'
                                })
                                .within()
                                    .segment('cajas', {
                                        templateUrl: 'views/app/finanzas/ventas/facturacion/cajas/index.html',
                                        controller: 'fac_cajas_Ctrl'
                                    })
                                    .segment('nueva_factura_venta', {
                                        default:true,
                                        templateUrl: 'views/app/finanzas/ventas/facturacion/nueva_factura_venta/index.html',
                                        controller: 'fac_nueva_factura_venta_Ctrl'
                                    })
        
                                    .segment('mis_facturas_venta', {
                                        templateUrl: 'views/app/finanzas/ventas/facturacion/mis_facturas/index.html',
                                        controller: 'fac_mis_facturas_venta_Ctrl'
                                    })
                                    .segment('clientes', {
                                        templateUrl: 'views/app/finanzas/ventas/facturacion/personas/index.html',
                                        controller: 'fac_clientes_Ctrl'
                                    })
                                .up()
                            .up()
                            //Fin
                            // Modulo de Inventario
                           .segment('inventario', {
                                templateUrl: 'views/app/finanzas/inventario/index.html'
                            })
                            .within()
                                //Inventario de Bienes
                                .segment('Inv_Bienes', {
                                    templateUrl: 'views/app/finanzas/inventario/inv_bienes/index.html',
                                    controller: 'inventario_Ctrl'
                                })
                                .within()
                                    .segment('menu', {
                                            default: true,
                                            templateUrl: 'views/app/finanzas/inventario/inv_bienes/menu.html',
                                            controller: 'inv_bienes_menuCtrl'
                                        })
                                    .segment('categoria', {
                                        templateUrl: 'views/app/finanzas/inventario/inv_bienes/categorias/index.html',
                                        controller: 'inv_bienes_categoriasCtrl'
                                    })
                                        .within()
                                            .segment('tipo_categorias', {
                                                templateUrl: 'views/app/finanzas/inventario/inv_bienes/tipo_categorias/index.html',
                                                controller: 'inv_bienes_tipo_categoriasCtrl'
                                            })
                                        .up()
                                    .segment('garantia', {
                                        templateUrl: 'views/app/finanzas/inventario/inv_bienes/garantia/index.html',
                                        controller: 'inv_bienes_garantiaCtrl'
                                    })
                                        .within()
                                                .segment('tipo_garantias', {
                                                    templateUrl: 'views/app/finanzas/inventario/inv_bienes/tipo_garantias/index.html',
                                                    controller: 'inv_bienes_tipo_garantiaCtrl'
                                                })
                                        .up()
                                    .segment('ubicacion', {
                                        templateUrl: 'views/app/finanzas/inventario/inv_bienes/ubicacion/index.html',
                                        controller: 'inv_bienes_ubicacionCtrl'
                                    })
                                    .segment('modelos', {
                                        templateUrl: 'views/app/finanzas/inventario/inv_bienes/modelos/index.html',
                                        controller: 'inv_bienes_modeloCtrl'
                                    })
                                    .segment('tipo_consumo', {
                                        templateUrl: 'views/app/finanzas/inventario/inv_bienes/tipo_consumo/index.html',
                                        controller: 'inv_bienes_tipo_consumoCtrl'
                                    })
                                    .segment('estado_descriptivo', {
                                        templateUrl: 'views/app/finanzas/inventario/inv_bienes/estado_descriptivo/index.html',
                                        controller: 'inv_bienes_estado_descriptivoCtrl'
                                    })

                                    .segment('bienes', {
                                        templateUrl: 'views/app/finanzas/inventario/inv_bienes/bienes/index.html',
                                        controller: 'inv_bienes_bienesCtrl'
                                    })
                                    .segment('marcas', {
                                        templateUrl: 'views/app/finanzas/inventario/inv_bienes/marcas/index.html',
                                        controller: 'inv_bienes_marcasCtrl'
                                    })
                                .up()
                                //fin
                                //Inventario de Productos
                                .segment('Inv_Productos', {
                                    templateUrl: 'views/app/finanzas/inventario/inv_productos/index.html',
                                    controller: 'inventario_Ctrl'
                                })
                                .within()
                                        .segment('menu', {
                                            default: true,
                                            templateUrl: 'views/app/finanzas/inventario/inv_productos/menu.html',
                                            controller: 'inv_productos_menuCtrl'
                                        })
                                        .segment('categoria', {
                                                templateUrl: 'views/app/finanzas/inventario/inv_productos/categorias/index.html',
                                                controller: 'inv_bienes_categoriasCtrl'
                                            })
                                                .within()
                                                    .segment('tipo_categorias', {
                                                        templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_categorias/index.html',
                                                        controller: 'inv_bienes_tipo_categoriasCtrl'
                                                    })
                                                .up()
                                        .segment('garantia', {
                                                templateUrl: 'views/app/finanzas/inventario/inv_productos/garantia/index.html',
                                                controller: 'inv_bienes_garantiaCtrl'
                                            })
                                                .within()
                                                        .segment('tipo_garantias', {
                                                            templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_garantias/index.html',
                                                            controller: 'inv_bienes_tipo_garantiaCtrl'
                                                        })
                                                .up()
                                        .segment('ubicacion', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_productos/ubicacion/index.html',
                                            controller: 'inv_productos_ubicacionCtrl'
                                        })
                                        .segment('modelo', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_productos/modelos/index.html',
                                            controller: 'inv_productos_modeloCtrl'
                                        })
                                        .segment('tipo_consumo', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_productos/tipo_consumo/index.html',
                                            controller: 'inv_productos_tipo_consumoCtrl'
                                        })
                                        .segment('estado_descriptivo', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_productos/estado_descriptivo/index.html',
                                            controller: 'inv_productos_estado_descriptivoCtrl'
                                        })
                                        .segment('productos', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_productos/productos/index.html',
                                            controller: 'inv_productos_productosCtrl'
                                        })
                                        .segment('bodegas', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_productos/bodega/index.html',
                                            controller: 'inv_productos_bodegasCtrl'
                                        })
                                        .segment('marcas', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_productos/marcas/index.html',
                                            controller: 'inv_productos_marcasCtrl'
                                        })
                                .up()
                                //fin
                                //Inventario de Servicios
                                .segment('Inv_Servicios', {
                                    templateUrl: 'views/app/finanzas/inventario/inv_productos/index.html',
                                    controller: 'inventario_Ctrl'
                                })
                                .within()
                                        .segment('menu', {
                                            default: true,
                                            templateUrl: 'views/app/finanzas/inventario/inv_servicios/menu.html',
                                            controller: 'inv_servicios_menuCtrl'
                                        })
                                        .segment('categorias', {
                                                templateUrl: 'views/app/finanzas/inventario/inv_servicios/categorias/index.html',
                                                controller: 'inv_bienes_categoriasCtrl'
                                            })
                                                .within()
                                                    .segment('tipo_categorias', {
                                                        templateUrl: 'views/app/finanzas/inventario/inv_servicios/tipo_categorias/index.html',
                                                        controller: 'inv_bienes_tipo_categoriasCtrl'
                                                    })
                                                .up()
                                        .segment('garantia', {
                                                templateUrl: 'views/app/finanzas/inventario/inv_servicios/garantia/index.html',
                                                controller: 'inv_bienes_garantiaCtrl'
                                            })
                                                .within()
                                                        .segment('tipo_garantias', {
                                                            templateUrl: 'views/app/finanzas/inventario/inv_servicios/tipo_garantias/index.html',
                                                            controller: 'inv_bienes_tipo_garantiaCtrl'
                                                        })
                                                .up()
                                        .segment('ubicacion', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_servicios/ubicacion/index.html',
                                            controller: 'inv_servicios_ubicacionCtrl'
                                        })
                                        .segment('modelos', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_servicios/modelos/index.html',
                                            controller: 'inv_servicios_modeloCtrl'
                                        })
                                        .segment('tipo_consumo', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_servicios/tipo_consumo/index.html',
                                            controller: 'inv_servicios_tipo_consumoCtrl'
                                        })
                                        .segment('estado_descriptivo', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_servicios/estado_descriptivo/index.html',
                                            controller: 'inv_servicios_estado_descriptivoCtrl'
                                        })
                                        .segment('servicios', {
                                            templateUrl: 'views/app/finanzas/inventario/inv_servicios/servicios/index.html',
                                            controller: 'inv_servicios_serviciosCtrl'
                                        })
                                .up()
                                //fin
                            .up()
                            //Fin
                        .up()
                .up()
            .up();

        //     .when('/Dash',    'dashboard')
        //     // .when('/Inicio',    'dashboard.inicio')
        //     // .when('/Perfil',    'dashboard.perfil')
        //     // configuracion setting
        //     .when('/nb',    'dashboard.nb')

        //     .when('/nb/search/:id',    'dashboard.nb.search')
        //         .when('/nb/search/:id/Publicacion',    'dashboard.nb.search.publicacion')
        //         .when('/nb/search/:id/Info',    'dashboard.nb.search.info')
        //         .when('/nb/search/:id/Ubicacion',    'dashboard.nb.search.ubicacion')
        //         .when('/nb/search/:id/Similares',    'dashboard.nb.search.similares')
        //         .when('/nb/search/:id/Favoritos',    'dashboard.nb.search.favoritos')


        //     .when('/nb/Inicio',    'dashboard.nb.inicio')
        //     .when('/nb/Perfil',    'dashboard.nb.perfil')

        //     .when('/nb/Personal',    'dashboard.nb.personal')
        //     .when('/nb/Personal/Inicio',    'dashboard.nb.personal.inicio')

        //     // ---------------------------------------configuracion de procesos---------------------------------------
        //     .when('/nb/Config',    'dashboard.nb.config')
        //     .when('/nb/Config/Personal',    'dashboard.nb.config.personal')
        //     .when('/nb/Config/Terminos',    'dashboard.nb.config.terminos')
        //     // general
        //     .when('/nb/Config/Empresa',    'dashboard.nb.config.empresa')
        //     .when('/App',    'dashboard.app')
        //     .when('/App/Inicio',    'dashboard.app.inicio')
        //     // --------------------------------------GESTION REPOSITORIO FACTURAS------------------------------------
        //     .when('/App/Repositorio_Facturas',    'dashboard.app.repositorio_facturas')
        //         .when('/App/Repositorio_Facturas/Inicio_Facturas',    'dashboard.app.repositorio_facturas.inicio_facturas')
        //         .when('/App/Repositorio_Facturas/Mis_Facturas',    'dashboard.app.repositorio_facturas.mis_facturas')
        //         .when('/App/Repositorio_Facturas/Subir_Facturas',    'dashboard.app.repositorio_facturas.subir_facturas')
        //         .when('/App/Repositorio_Facturas/Facturas_Correo',    'dashboard.app.repositorio_facturas.facturas_correo')
        //         .when('/App/Repositorio_Facturas/Facturas_Rechazadas',    'dashboard.app.repositorio_facturas.facturas_rechazadas')
                
        //     // ----------------------------------------GESTION COLABORADORES----------------------------------------
        //     .when('/App/Colaboradores',    'dashboard.app.colaboradores')
        //         .when('/App/Colaboradores/Usuario',    'dashboard.app.colaboradores.usuario')
        //         .when('/App/Colaboradores/Tipo_Usuario',    'dashboard.app.colaboradores.tipo_usuario')
        //     // ------------------------------------------FACTURACION------------------------------------------------
        //     .when('/App/Facturacion',    'dashboard.app.facturacion')
        //     .when('/App/Facturacion/Mis_Facturas_Venta',    'dashboard.app.facturacion.mis_facturas_venta')
        //     .when('/App/Facturacion/Nueva_Factura_Venta',    'dashboard.app.facturacion.nueva_factura_venta')
        //     .when('/App/Facturacion/Cajas',    'dashboard.app.facturacion.cajas')
        //     .when('/App/Facturacion/Clientes',    'dashboard.app.facturacion.cientes')
        //     // ------------------------------------------INVENTARIO BIENES------------------------------------------
        //     .when('/App/Inventario',    'dashboard.app.inventario')
        //         .when('/App/Inventario/',    'dashboard.app.inventario.menu')
        //         .when('/App/Inventario/Categorias',    'dashboard.app.inventario.categoria')
        //             .when('/App/Inventario/Categorias/Productos',    'dashboard.app.inventario.cat_productos')
        //             .when('/App/Inventario/Categorias/Bienes',    'dashboard.app.inventario.cat_bienes')
        //         .when('/App/Inventario/Marcas',    'dashboard.app.inventario.marcas')
        //         .when('/App/Inventario/Modelos',    'dashboard.app.inventario.modelos')
        //         .when('/App/Inventario/Productos',    'dashboard.app.inventario.productos')
        //         .when('/App/Inventario/Ubicacion',    'dashboard.app.inventario.ubicacion')
        //         .when('/App/Inventario/Garantia',    'dashboard.app.inventario.garantia')
        //         .when('/App/Inventario/Estado_Descriptivo',    'dashboard.app.inventario.estado_descriptivo')
        //         // Parametrizacion Tipos
        //         .when('/App/Inventario/Tipo_Categoria',    'dashboard.app.inventario.tipo_categoria')
        //         .when('/App/Inventario/Tipo_Garantia',    'dashboard.app.inventario.tipo_garantias')
        //         .when('/App/Inventario/Tipo_Consumo',    'dashboard.app.inventario.tipo_consumo')
        //         .when('/App/Inventario/Tipo_Productos',    'dashboard.app.inventario.tipo_productos')
        //         .when('/App/Inventario/Tipo_Catalogo',    'dashboard.app.inventario.tipo_catalogo')
        //         .when('/App/Inventario/Bodegas',    'dashboard.app.inventario.bodegas')
        //         .when('/App/Inventario/Bienes',    'dashboard.app.inventario.bienes')
        //     // ------------------------------------------INVENTARIO SERVICIOS-----------------------------------------
        //       .when('/App/Inv_Servicios',    'dashboard.app.inv_servicios')
        //       .when('/App/Inv_Servicios/Menu',    'dashboard.app.inv_servicios.menu')
        //       .when('/App/Inv_Servicios/Categorias',    'dashboard.app.inv_servicios.categorias')
        //       .when('/App/Inv_Servicios/Tipo_Categorias',    'dashboard.app.inv_servicios.tipo_categorias')
        //       .when('/App/Inv_Servicios/Garantia',    'dashboard.app.inv_servicios.garantia')
        //       .when('/App/Inv_Servicios/Tipo_Garantia',    'dashboard.app.inv_servicios.tipo_garantia')
        //       .when('/App/Inv_Servicios/Ubicacion',    'dashboard.app.inv_servicios.ubicacion')
        //       .when('/App/Inv_Servicios/Modelos',    'dashboard.app.inv_servicios.modelo')
        //       .when('/App/Inv_Servicios/Tipo_Consumo',    'dashboard.app.inv_servicios.tipo_consumo')
        //       .when('/App/Inv_Servicios/Estado_Descriptivo',    'dashboard.app.inv_servicios.estado_descriptivo')
        //       .when('/App/Inv_Servicios/Servicios',    'dashboard.app.inv_servicios.servicios')

              
        //     // ------------------------------------------INVENTARIO PRODUCTOS-----------------------------------------
        //       .when('/App/Inv_Productos',    'dashboard.app.inv_productos')
        //       .when('/App/Inv_Productos/',    'dashboard.app.inv_productos.menu')
        //       .when('/App/Inv_Productos/Categorias',    'dashboard.app.inv_productos.categorias')
        //       .when('/App/Inv_Productos/Tipo_Categoria',    'dashboard.app.inv_productos.tipo_categorias')
        //       .when('/App/Inv_Productos/Garantia',    'dashboard.app.inv_productos.garantia')
        //       .when('/App/Inv_Productos/Tipo_Garantia',    'dashboard.app.inv_productos.tipo_garantia')
        //       .when('/App/Inv_Productos/Ubicacion',    'dashboard.app.inv_productos.ubicacion')
        //       .when('/App/Inv_Productos/Modelos',    'dashboard.app.inv_productos.modelo')
        //       .when('/App/Inv_Productos/Tipo_Consumo',    'dashboard.app.inv_productos.tipo_consumo')
        //       .when('/App/Inv_Productos/Estado_Descriptivo',    'dashboard.app.inv_productos.estado_descriptivo')
        //       .when('/App/Inv_Productos/Productos',    'dashboard.app.inv_productos.productos')
        //       .when('/App/Inv_Productos/Bodegas',    'dashboard.app.inv_productos.bodegas')
        //       .when('/App/Inv_Productos/Marcas',    'dashboard.app.inv_productos.marcas')
        //     // ------------------------------------------INVENTARIO BIENES--------------------------------------------
        //       .when('/App/Inv_Bienes',    'dashboard.app.inv_bienes')
        //       .when('/App/Inv_Bienes/',    'dashboard.app.inv_bienes.menu')
        //       .when('/App/Inv_Bienes/Categorias',    'dashboard.app.inv_bienes.categorias')
        //       .when('/App/Inv_Bienes/Tipo_Categorias',    'dashboard.app.inv_bienes.tipo_categorias')
        //       .when('/App/Inv_Bienes/Garantia',    'dashboard.app.inv_bienes.garantia')
        //       .when('/App/Inv_Bienes/Tipo_Garantia',    'dashboard.app.inv_bienes.tipo_garantia')
        //       .when('/App/Inv_Bienes/Ubicacion',    'dashboard.app.inv_bienes.ubicacion')
        //       .when('/App/Inv_Bienes/Modelos',    'dashboard.app.inv_bienes.modelo')
        //       .when('/App/Inv_Bienes/Tipo_Consumo',    'dashboard.app.inv_bienes.tipo_consumo')
        //       .when('/App/Inv_Bienes/Estado_Descriptivo',    'dashboard.app.inv_bienes.estado_descriptivo')
        //       .when('/App/Inv_Bienes/Bienes',    'dashboard.app.inv_bienes.bienes')
        //       .when('/App/Inv_Bienes/Marcas',    'dashboard.app.inv_bienes.marcas')
        //       .when('/App/Inv_Bienes/Tipo_Categoria',    'dashboard.app.inv_bienes.tipo_categorias')

        //     // -------------------------------------------PARAMETROS GENERALES----------------------------------------
        //     .when('/App/Parametrizacion',    'dashboard.app.parametrizacion')
        //     .when('/App/Parametrizacion/Inicio',    'dashboard.app.parametrizacion.menu')
        //     .when('/App/Parametrizacion/Impuestos',    'dashboard.app.parametrizacion.impuestos')

        //     .segment('dashboard', {
        //         templateUrl: 'views/dashboard/index.html',
        //         controller: 'dashboard_Ctrl'
        //     })
        //         .within()
        //             .segment('nb', {
        //                 templateUrl: 'views/dashboard/general.html',
        //                 // controller: 'inicio_Ctrl',
        //             })
        //                 .within()
        //                     .segment('inicio', {
        //                         templateUrl: 'views/dashboard/inicio.html',
        //                         controller: 'inicio_Ctrl',
        //                         default: true
        //                     })
        //                     .segment('perfil', {
        //                         templateUrl: 'views/dashboard/perfil.html',
        //                         controller: 'perfil_Ctrl'
        //                     })
        //                     .segment('personal', {
        //                         templateUrl: 'views/dashboard/perfil_personal.html',
        //                         controller: 'perfil_personal_Ctrl'
        //                     })
        //                         .within()
        //                             .segment('inicio', {
        //                                 default: true,
        //                                 templateUrl: 'views/dashboard/perfil_personal/inicio.html',
        //                                 // controller: 'informacion_generalCtrl'
        //                             })
        //                         .up()

        //                     .segment('search', {
        //                         templateUrl: 'views/dashboard/buscador/index.html',
        //                         controller: 'search_Ctrl',
        //                     })
        //                         .within()                
        //                             .segment('publicacion', {                        
        //                                 templateUrl: 'views/perfil/publicacion.html'})                        
        //                             .segment('info', {
        //                                 'default': true,
        //                                 templateUrl: 'views/perfil/info.html'})
        //                             .segment('ubicacion', {
        //                                 templateUrl: 'views/perfil/ubicacion.html'})
        //                             .segment('similares', {
        //                                 templateUrl: 'views/perfil/similares.html'})
        //                             .segment('favoritos', {
        //                                 templateUrl: 'views/perfil/favoritos.html'})
        //                         .up()
        //                     .segment('config', {
        //                         templateUrl: 'views/dashboard/configuracion/index.html',
        //                         // controller: 'configuracionCtrl'
        //                     })
        //                         .within()
        //                             .segment('personal', {
        //                                 default: true,
        //                                 templateUrl: 'views/dashboard/configuracion/personal/index.html',
        //                                 controller: 'informacion_generalCtrl'
        //                             })
        //                             .segment('empresa', {
        //                                 templateUrl: 'views/dashboard/configuracion/establecimiento/index.html',
        //                                 controller: 'informacion_general_empresaCtrl'
        //                             })
        //                             .segment('sucursal', {
        //                                 templateUrl: 'views/dashboard/configuracion/perfil/index.html',
        //                                 // controller: 'informacion_generalCtrl'
        //                             })
        //                             .segment('terminos', {
        //                                 templateUrl: 'views/dashboard/configuracion/terminos/index.html',
        //                             })
        //                         .up()
        //                 .up()                    
        //             .segment('app', {
        //                 templateUrl: 'views/app/index.html',
        //                 controller: 'app_Ctrl'
        //             })
        //                 .within()
        //                     // ------------------------------------INICIO APP----------------------------------------------
        //                         .segment('inicio', {
        //                             default: true,
        //                             templateUrl: 'views/app/inicio.html',
        //                             // controller: 'repositorio_facturas_Ctrl'
        //                         })
        //                     // ------------------------------------REPOSITORIO FACTURAS------------------------------------
        //                         .segment('repositorio_facturas', {
        //                             templateUrl: 'views/app/repositorio_facturas/index.html',
        //                             controller: 'RepositorioFacturasCtrl'
        //                         })
        //                         .within()
        //                             .segment('inicio_facturas', {
        //                                 default: true,
        //                                 templateUrl: 'views/app/repositorio_facturas/inicio_facturas/index.html',
        //                                 controller: 'repfac_inicio_Ctrl'
        //                             })
        //                             .segment('mis_facturas', {
        //                                 templateUrl: 'views/app/repositorio_facturas/mis_facturas/index.html',
        //                                 controller: 'mis_facturas_Ctrl'
        //                             })
        //                             .segment('subir_facturas', {
        //                                 templateUrl: 'views/app/repositorio_facturas/subir_facturas/index.html',
        //                                 controller: 'subir_factura_electronica_Ctrl'
        //                             })
        //                             .segment('facturas_correo', {
        //                                 templateUrl: 'views/app/repositorio_facturas/facturas_correo/index.html',
        //                                 controller: 'leer_correo_facturas_electronica_Ctrl'
        //                             })   
        //                             .segment('facturas_rechazadas', {
        //                                 templateUrl: 'views/app/repositorio_facturas/facturas_rechazadas/index.html',
        //                                 controller: 'rechazadas_facturas_electronica_Ctrl'
        //                             })   
        //                         .up()
        //                     // ------------------------------------COLABORADORES-------------------------------------------
        //                         .segment('colaboradores', {
        //                             templateUrl: 'views/app/colaboradores/index.html',
        //                             controller: 'colaboradores_Ctrl'
        //                         })
        //                            .within()
        //                                 .segment('usuario', {
        //                                     default: true,
        //                                     templateUrl: 'views/app/colaboradores/usuario/index.html',
        //                                     controller: 'col_usuario_Ctrl'
        //                                 })
        //                                 .segment('tipo_usuario', {
        //                                     templateUrl: 'views/app/colaboradores/tipo_usuario/index.html',
        //                                     controller: 'col_tipo_usuario_Ctrl'
        //                                 })
        //                             .up()
        //                     // ------------------------------------PARAMETRIZACION GENERAL---------------------------------
        //                         .segment('parametrizacion', {
        //                             templateUrl: 'views/app/parametrizacion/index.html',
        //                             controller: 'ParametrizacionCtrl'
        //                         })
        //                             .within()
        //                                 .segment('menu', {
        //                                     default: true,
        //                                     templateUrl: 'views/app/parametrizacion/menu.html',
        //                                 })
        //                                 .segment('impuestos', {
        //                                     templateUrl: 'views/app/parametrizacion/impuestos/index.html',
        //                                     controller: 'param_impuestos_Ctrl'
        //                                 })
        //                             .up()
        //                     // --------------------------------------INVENTARIO SERVICIOS----------------------------------
        //                         .segment('inv_servicios', {
        //                           templateUrl: 'views/app/inv_servicios/index.html',
        //                           controller: 'inv_serviciosCtrl'
        //                         })
        //                             .within()
        //                                 .segment('menu', {
        //                                     default: true,
        //                                     templateUrl: 'views/app/inv_servicios/menu.html',
        //                                     controller: 'inv_servicios_menuCtrl'
        //                                 })
        //                                 .segment('categorias', {
        //                                     templateUrl: 'views/app/inv_servicios/categorias/index.html',
        //                                     controller: 'inv_servicios_categoriasCtrl'
        //                                 })
        //                                 .segment('tipo_categorias', {
        //                                     templateUrl: 'views/app/inv_servicios/tipo_categorias/index.html',
        //                                     controller: 'inv_servicios_tipo_categoriasCtrl'
        //                                 })
        //                                 .segment('garantia', {
        //                                     templateUrl: 'views/app/inv_servicios/garantia/index.html',
        //                                     controller: 'inv_servicios_garantiaCtrl'
        //                                 })
        //                                 .segment('ubicacion', {
        //                                     templateUrl: 'views/app/inv_servicios/ubicacion/index.html',
        //                                     controller: 'inv_servicios_ubicacionCtrl'
        //                                 })
        //                                 .segment('modelo', {
        //                                     templateUrl: 'views/app/inv_servicios/modelos/index.html',
        //                                     controller: 'inv_servicios_modeloCtrl'
        //                                 })
        //                                 .segment('tipo_consumo', {
        //                                     templateUrl: 'views/app/inv_servicios/tipo_consumo/index.html',
        //                                     controller: 'inv_servicios_tipo_consumoCtrl'
        //                                 })
        //                                 .segment('estado_descriptivo', {
        //                                     templateUrl: 'views/app/inv_servicios/estado_descriptivo/index.html',
        //                                     controller: 'inv_servicios_estado_descriptivoCtrl'
        //                                 })
        //                                 .segment('tipo_garantia', {
        //                                     templateUrl: 'views/app/inv_servicios/tipo_garantia/index.html',
        //                                     controller: 'inv_servicios_tipo_garantiaCtrl'
        //                                 })
        //                                 .segment('servicios', {
        //                                     templateUrl: 'views/app/inv_servicios/servicios/index.html',
        //                                     controller: 'inv_servicios_serviciosCtrl'
        //                                 })
        //                             .up()
        //                     // --------------------------------------INVENTARIO PRODUCTOS----------------------------------
        //                         .segment('inv_productos', {
        //                           templateUrl: 'views/app/inv_productos/index.html',
        //                           controller: 'inv_productosCtrl'
        //                         })
        //                             .within()
        //                                 .segment('menu', {
        //                                     default: true,
        //                                     templateUrl: 'views/app/inv_productos/menu.html',
        //                                     controller: 'inv_productos_menuCtrl'
        //                                 })
        //                                 .segment('categorias', {
        //                                     templateUrl: 'views/app/inv_productos/categorias/index.html',
        //                                     controller: 'inv_productos_categoriasCtrl'
        //                                 })
        //                                 .segment('tipo_categorias', {
        //                                     templateUrl: 'views/app/inv_productos/tipo_categoria/index.html',
        //                                     controller: 'inv_productos_tipo_categoriasCtrl'
        //                                 })
        //                                 .segment('garantia', {
        //                                     templateUrl: 'views/app/inv_productos/garantia/index.html',
        //                                     controller: 'inv_productos_garantiaCtrl'
        //                                 })
        //                                 .segment('ubicacion', {
        //                                     templateUrl: 'views/app/inv_productos/ubicacion/index.html',
        //                                     controller: 'inv_productos_ubicacionCtrl'
        //                                 })
        //                                 .segment('modelo', {
        //                                     templateUrl: 'views/app/inv_productos/modelos/index.html',
        //                                     controller: 'inv_productos_modeloCtrl'
        //                                 })
        //                                 .segment('tipo_consumo', {
        //                                     templateUrl: 'views/app/inv_productos/tipo_consumo/index.html',
        //                                     controller: 'inv_productos_tipo_consumoCtrl'
        //                                 })
        //                                 .segment('estado_descriptivo', {
        //                                     templateUrl: 'views/app/inv_productos/estado_descriptivo/index.html',
        //                                     controller: 'inv_productos_estado_descriptivoCtrl'
        //                                 })
        //                                 .segment('tipo_garantia', {
        //                                     templateUrl: 'views/app/inv_productos/tipo_garantia/index.html',
        //                                     controller: 'inv_productos_tipo_garantiaCtrl'
        //                                 })
        //                                 .segment('productos', {
        //                                     templateUrl: 'views/app/inv_productos/productos/index.html',
        //                                     controller: 'inv_productos_productosCtrl'
        //                                 })
        //                                 .segment('bodegas', {
        //                                     templateUrl: 'views/app/inv_productos/bodega/index.html',
        //                                     controller: 'inv_productos_bodegasCtrl'
        //                                 })
        //                                 .segment('marcas', {
        //                                     templateUrl: 'views/app/inv_productos/marcas/index.html',
        //                                     controller: 'inv_productos_marcasCtrl'
        //                                 })
        //                             .up()
        //                     // --------------------------------------INVENTARIO BIENES----------------------------------
        //                         .segment('inv_bienes', {
        //                           templateUrl: 'views/app/inv_bienes/index.html',
        //                           controller: 'inv_bienesCtrl'
        //                         })
        //                             .within()
        //                                 .segment('menu', {
        //                                     default: true,
        //                                     templateUrl: 'views/app/inv_bienes/menu.html',
        //                                     controller: 'inv_bienes_menuCtrl'
        //                                 })
        //                                 .segment('categorias', {
        //                                     templateUrl: 'views/app/inv_bienes/categorias/index.html',
        //                                     controller: 'inv_bienes_categoriasCtrl'
        //                                 })
        //                                 .segment('tipo_categorias', {
        //                                     templateUrl: 'views/app/inv_bienes/tipo_categorias/index.html',
        //                                     controller: 'inv_bienes_tipo_categoriasCtrl'
        //                                 })
        //                                 .segment('garantia', {
        //                                     templateUrl: 'views/app/inv_bienes/garantia/index.html',
        //                                     controller: 'inv_bienes_garantiaCtrl'
        //                                 })
        //                                 .segment('ubicacion', {
        //                                     templateUrl: 'views/app/inv_bienes/ubicacion/index.html',
        //                                     controller: 'inv_bienes_ubicacionCtrl'
        //                                 })
        //                                 .segment('modelo', {
        //                                     templateUrl: 'views/app/inv_bienes/modelos/index.html',
        //                                     controller: 'inv_bienes_modeloCtrl'
        //                                 })
        //                                 .segment('tipo_consumo', {
        //                                     templateUrl: 'views/app/inv_bienes/tipo_consumo/index.html',
        //                                     controller: 'inv_bienes_tipo_consumoCtrl'
        //                                 })
        //                                 .segment('estado_descriptivo', {
        //                                     templateUrl: 'views/app/inv_bienes/estado_descriptivo/index.html',
        //                                     controller: 'inv_bienes_estado_descriptivoCtrl'
        //                                 })
        //                                 .segment('tipo_garantia', {
        //                                     templateUrl: 'views/app/inv_bienes/tipo_garantia/index.html',
        //                                     controller: 'inv_bienes_tipo_garantiaCtrl'
        //                                 })
        //                                 .segment('bienes', {
        //                                     templateUrl: 'views/app/inv_bienes/bienes/index.html',
        //                                     controller: 'inv_bienes_bienesCtrl'
        //                                 })
        //                                 .segment('marcas', {
        //                                     templateUrl: 'views/app/inv_bienes/marcas/index.html',
        //                                     controller: 'inv_bienes_marcasCtrl'
        //                                 })
        //                             .up()
        //                     // --------------------------------------INVENTARIO--------------------------------------
                                
        //                         .segment('inventario', {
        //                             templateUrl: 'views/app/inventario/index.html',
        //                             controller: 'inventario_Ctrl'
        //                         })
        //                             .within()
        //                                 .segment('menu', {
        //                                     default: true,
        //                                     templateUrl: 'views/app/inventario/menu.html',
        //                                     controller: 'inv_menu_Ctrl'
        //                                 })
        //                                 .segment('categoria', {
        //                                     templateUrl: 'views/app/inventario/categoria/productos/index.html',
        //                                     controller: 'inv_categoria_productos_Ctrl'
        //                                 })
        //                                 .segment('cat_productos', {
        //                                     default:true,
        //                                     templateUrl: 'views/app/inventario/categoria/productos/index.html',
        //                                     controller: 'inv_categoria_productos_Ctrl'
        //                                 })
        //                                 .segment('cat_bienes', {
        //                                     templateUrl: 'views/app/inventario/categoria/bienes/index.html',
        //                                     controller: 'inv_categoria_bienes_Ctrl'
        //                                 })
        //                                 .segment('marcas', {
        //                                     templateUrl: 'views/app/inventario/marcas/index.html',
        //                                     controller: 'inv_marcas_Ctrl'
        //                                 })
        //                                 .segment('modelos', {
        //                                     templateUrl: 'views/app/inventario/modelos/index.html',
        //                                     controller: 'inv_modelos_Ctrl'
        //                                 })
        //                                 .segment('productos', {
        //                                     templateUrl: 'views/app/inventario/productos/index.html',
        //                                     controller: 'inv_productos_Ctrl'
        //                                 })
        //                                 .segment('ubicacion', {
        //                                     templateUrl: 'views/app/inventario/ubicacion/index.html',
        //                                     controller: 'inv_ubicacion_Ctrl'
        //                                 })
        //                                 .segment('garantia', {
        //                                     templateUrl: 'views/app/inventario/garantia/index.html',
        //                                     controller: 'inv_garantia_Ctrl'
        //                                 })
        //                                 .segment('estado_descriptivo', {
        //                                     templateUrl: 'views/app/inventario/estado_descriptivo/index.html',
        //                                     controller: 'inv_garantia_Ctrl'
        //                                 })
        //                                 // Tipos 
        //                                 .segment('tipo_categoria', {
        //                                     templateUrl: 'views/app/inventario/tipo_categoria/index.html',
        //                                     controller: 'inv_tipo_categoria_Ctrl'
        //                                 })
        //                                 .segment('tipo_garantia', {
        //                                     templateUrl: 'views/app/inventario/tipo_garantia/index.html',
        //                                     controller: 'inv_tipo_garantia_Ctrl'
        //                                 })
        //                                 .segment('tipo_consumo', {
        //                                     templateUrl: 'views/app/inventario/tipo_consumo/index.html',
        //                                     controller: 'inv_tipo_consumo_Ctrl'
        //                                 })
        //                                 .segment('tipo_productos', {
        //                                     templateUrl: 'views/app/inventario/tipo_productos/index.html',
        //                                     controller: 'inv_tipo_productos_Ctrl'
        //                                 })
        //                                 .segment('tipo_catalogo', {
        //                                     templateUrl: 'views/app/inventario/tipo_catalogo/index.html',
        //                                     controller: 'inv_tipo_catalogo_Ctrl'
        //                                 })
        //                                 .segment('estado_descriptivo', {
        //                                     templateUrl: 'views/app/inventario/estado_descriptivo/index.html',
        //                                     controller: 'inv_estado_descriptivo_Ctrl'
        //                                 })
        //                                 .segment('bodegas', {
        //                                     templateUrl: 'views/app/inventario/bodega/index.html',
        //                                     controller: 'inv_bodegas_Ctrl'
        //                                 })
        //                                 .segment('bienes', {
        //                                     templateUrl: 'views/app/inventario/bienes/index.html',
        //                                     controller: 'inv_bienes_Ctrl'
        //                                 })
        //                             .up()

        //                         // ----------------------------------------FACTURACION----------------------------------------
        //                         .segment('facturacion', {
        //                            templateUrl: 'views/app/facturacion/index.html',
        //                             controller: 'facturacion_Ctrl'
        //                             })
        //                             .within()
        //                                 .segment('cajas', {
        //                                     templateUrl: 'views/app/facturacion/cajas/index.html',
        //                                     controller: 'fac_cajas_Ctrl'
        //                                 })
        //                                 .segment('nueva_factura_venta', {
        //                                     default: true,
        //                                     templateUrl: 'views/app/facturacion/nueva_factura_venta/index.html',
        //                                     controller: 'fac_nueva_factura_venta_Ctrl'
        //                                 })
            
        //                                 .segment('mis_facturas_venta', {
        //                                     templateUrl: 'views/app/facturacion/mis_facturas/index.html',
        //                                     controller: 'fac_mis_facturas_venta_Ctrl'
        //                                 })
        //                                 .segment('cientes', {
        //                                     templateUrl: 'views/app/facturacion/personas/index.html',
        //                                     controller: 'fac_clientes_Ctrl'
        //                                 })
        //                             .up()
        //                 .up()
        //         .up();            
        // // -------------------------------------------    buscador    ----------------------------------------------------
        // $routeSegmentProvider
        //     .when('/search/:id',    'search')
        //         .when('/search/:id/Publicacion',    'search.publicacion')
        //         .when('/search/:id/Info',    'search.info')
        //         .when('/search/:id/Ubicacion',    'search.ubicacion')
        //         .when('/search/:id/Similares',    'search.similares')
        //         .when('/search/:id/Favoritos',    'search.favoritos')
        //     .segment('search', {
        //         templateUrl: 'views/main/search.html',
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
    });
