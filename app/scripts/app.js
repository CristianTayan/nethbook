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
    
  // --------------------------------------------vistas generadas rutas ------------------------------------------------
  app.config(function ($routeSegmentProvider, $routeProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $routeSegmentProvider.options.autoLoadTemplates = true;            
            
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
          controller: 'mainCtrl'
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
    // Buscardor 
    $routeSegmentProvider
    .when('/search/:id',    'search')
    .when('/nb/search/:id/Publicacion',    'search.publicacion')
    .when('/nb/search/:id/Info',    'search.info')
    .when('/nb/search/:id/Ubicacion',    'search.ubicacion')
    .when('/nb/search/:id/Similares',    'search.similares')
    .when('/nb/search/:id/Favoritos',    'search.favoritos')
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
      .up();

    $routeSegmentProvider

    .when('/nb',    'nb')
    .when('/nb/Inicio',    'nb.inicio')
    // Segmento Aplicaciones/Modulos
    .when('/nb/App',    'nb.app.inicio')
        // Modulo de Gerencia
        .when('/nb/App/Gerencia','nb.app.gerencia')
            // Modulo de Finanzas
        .when('/nb/App/Finanzas','nb.app.finanzas')
        .when('/nb/App/Finanzas/Contable','nb.app.finanzas.contable')
            .when('/nb/App/Finanzas/Contable/Repositorio_Facturas','nb.app.finanzas.contable.repositorio_facturas')
                .when('/nb/App/Finanzas/Contable/Repositorio_Facturas/Inicio_Facturas','nb.app.finanzas.contable.repositorio_facturas.inicio_facturas')
                .when('/nb/App/Finanzas/Contable/Repositorio_Facturas/Mis_Facturas','nb.app.finanzas.contable.repositorio_facturas.mis_facturas')
                .when('/nb/App/Finanzas/Contable/Repositorio_Facturas/Subir_Facturas','nb.app.finanzas.contable.repositorio_facturas.subir_facturas')
                .when('/nb/App/Finanzas/Contable/Repositorio_Facturas/Facturas_Correo','nb.app.finanzas.contable.repositorio_facturas.facturas_correo')
                .when('/nb/App/Finanzas/Contable/Repositorio_Facturas/Facturas_Rechazadas','nb.app.finanzas.contable.repositorio_facturas.facturas_rechazadas')
            // Modulo de Finanzas-Ventas
        .when('/nb/App/Finanzas/Ventas','nb.app.finanzas.ventas')
            .when('/nb/App/Finanzas/Ventas/Facturacion','nb.app.finanzas.ventas.facturacion')
                .when('/nb/App/Finanzas/Ventas/Facturacion/Nueva_Factura_Venta','nb.app.finanzas.ventas.facturacion.nueva_factura_venta')
                .when('/nb/App/Finanzas/Ventas/Facturacion/Cajas','nb.app.finanzas.ventas.facturacion.cajas')
                .when('/nb/App/Finanzas/Ventas/Facturacion/Mis_Facturas_Venta','nb.app.finanzas.ventas.facturacion.mis_facturas_venta')
                .when('/nb/App/Finanzas/Ventas/Facturacion/Clientes','nb.app.finanzas.ventas.facturacion.clientes')
            // Modulo de Finanzas-Inventario
        .when('/nb/App/Finanzas/Inventario','nb.app.finanzas.inventario')
            // Modulo de Finanzas- Inventario Bienes
        .when('/nb/App/Finanzas/Inventario/Inv_Bienes','nb.app.finanzas.inventario.Inv_Bienes')
            .when('/nb/App/Finanzas/Inventario/Inv_Bienes/Categorias','nb.app.finanzas.inventario.Inv_Bienes.categoria')
            .when('/nb/App/Finanzas/Inventario/Inv_Bienes/Categorias/Tipo_Categoria','nb.app.finanzas.inventario.Inv_Bienes.categoria.tipo_categorias')
            .when('/nb/App/Finanzas/Inventario/Inv_Bienes/Marcas','nb.app.finanzas.inventario.Inv_Bienes.marcas')
            .when('/nb/App/Finanzas/Inventario/Inv_Bienes/Modelos','nb.app.finanzas.inventario.Inv_Bienes.modelos')
            .when('/nb/App/Finanzas/Inventario/Inv_Bienes/Bienes','nb.app.finanzas.inventario.Inv_Bienes.bienes')
            .when('/nb/App/Finanzas/Inventario/Inv_Bienes/Ubicacion','nb.app.finanzas.inventario.Inv_Bienes.ubicacion')
            .when('/nb/App/Finanzas/Inventario/Inv_Bienes/Garantia','nb.app.finanzas.inventario.Inv_Bienes.garantia')
            .when('/nb/App/Finanzas/Inventario/Inv_Bienes/Garantia/Tipo_Garantia','nb.app.finanzas.inventario.Inv_Bienes.garantia.tipo_garantias')
            .when('/nb/App/Finanzas/Inventario/Inv_Bienes/Estado_Descriptivo','nb.app.finanzas.inventario.Inv_Bienes.estado_descriptivo')
            .when('/nb/App/Finanzas/Inventario/Inv_Bienes/Tipo_Consumo','nb.app.finanzas.inventario.Inv_Bienes.tipo_consumo')
            // Modulo de Finanzas- Inventario Servicios
        .when('/nb/App/Finanzas/Inventario/Inv_Servicios','nb.app.finanzas.inventario.Inv_Servicios')
            .when('/nb/App/Finanzas/Inventario/Inv_Servicios/Categorias','nb.app.finanzas.inventario.Inv_Servicios.categorias')
            .when('/nb/App/Finanzas/Inventario/Inv_Servicios/Categorias/Tipo_Categorias','nb.app.finanzas.inventario.Inv_Servicios.categorias.tipo_categorias')
            .when('/nb/App/Finanzas/Inventario/Inv_Servicios/Modelos','nb.app.finanzas.inventario.Inv_Servicios.modelos')
            .when('/nb/App/Finanzas/Inventario/Inv_Servicios/Servicios','nb.app.finanzas.inventario.Inv_Servicios.servicios')
            .when('/nb/App/Finanzas/Inventario/Inv_Servicios/Ubicacion','nb.app.finanzas.inventario.Inv_Servicios.ubicacion')
            .when('/nb/App/Finanzas/Inventario/Inv_Servicios/Garantia','nb.app.finanzas.inventario.Inv_Servicios.garantia')
            .when('/nb/App/Finanzas/Inventario/Inv_Servicios/Garantia/Tipo_Garantia','nb.app.finanzas.inventario.Inv_Servicios.garantia.tipo_garantias')
            .when('/nb/App/Finanzas/Inventario/Inv_Servicios/Estado_Descriptivo','nb.app.finanzas.inventario.Inv_Servicios.estado_descriptivo')
            .when('/nb/App/Finanzas/Inventario/Inv_Servicios/Tipo_Consumo','nb.app.finanzas.inventario.Inv_Servicios.tipo_consumo')
            // Modulo de Finanzas- Inventario Productos
        .when('/nb/App/Finanzas/Inventario/Inv_Productos','nb.app.finanzas.inventario.Inv_Productos')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Categorias','nb.app.finanzas.inventario.Inv_Productos.categoria')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Categorias/Tipo_Categoria','nb.app.finanzas.inventario.Inv_Productos.categoria.tipo_categorias')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Marcas','nb.app.finanzas.inventario.Inv_Productos.marcas')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Modelos','nb.app.finanzas.inventario.Inv_Productos.modelos')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Productos','nb.app.finanzas.inventario.Inv_Productos.productos')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Ubicacion','nb.app.finanzas.inventario.Inv_Productos.ubicacion')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Garantia','nb.app.finanzas.inventario.Inv_Productos.garantia')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Garantia/Tipo_Garantia','nb.app.finanzas.inventario.Inv_Productos.garantia.tipo_garantias')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Estado_Descriptivo','nb.app.finanzas.inventario.Inv_Productos.estado_descriptivo')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Tipo_Consumo','nb.app.finanzas.inventario.Inv_Productos.tipo_consumo')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Tipo_Catalogo','nb.app.finanzas.inventario.Inv_Productos.tipo_catalogo')
            .when('/nb/App/Finanzas/Inventario/Inv_Productos/Bodegas','nb.app.finanzas.inventario.Inv_Productos.bodegas')
        // Modulo de Talento Humano
        .when('/nb/App/Talento_Humano','nb.app.talento_humano')
        // Modulo de Giro del Negocio
        .when('/nb/App/Giro_Negocio','nb.app.giro_negocio')
        // Modulo de Administracion
        .when('/nb/App/Administracion','nb.app.administracion')
          .when('/nb/App/Administracion/Usuario','nb.app.administracion.usuario')
          .when('/nb/App/Administracion/Tipo_Usuario','nb.app.administracion.tipo_usuario')
          .when('/nb/App/Administracion/Personal','nb.app.administracion.personal')
          .when('/nb/App/Administracion/Sucursal','nb.app.administracion.sucursal')
            .when('/nb/App/Administracion/Sucursal/info','nb.app.administracion.sucursal.info')
            .when('/nb/App/Administracion/Sucursal/ubicacion','nb.app.administracion.sucursal.mapa')
        // modulo configuracion
        .when('/nb/App/Config','nb.app.configuracion')
          .when('/nb/App/Config/PerfilPersonal','nb.app.configuracion.perfilPersonal')
          .when('/nb/App/Config/PerfilSucursal','nb.app.configuracion.perfilSucursal')
          .when('/nb/App/Config/PerfilEmpresa','nb.app.configuracion.perfilEmpresa')
          .when('/nb/App/Config/Terminos','nb.app.configuracion.terminos')

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
                templateUrl: 'views/app/inicio.html'
              })
              .segment('configuracion', {
                templateUrl: 'views/dashboard/configuracion/index.html',
                controller: 'configuracionCtrl'
              })
                .within()
                  .segment('inicio', {
                    templateUrl: 'views/dashboard/configuracion/inicio/index.html',  
                    controller: 'perfil_Ctrl',                    
                    default: true
                  })
                  .segment('perfilEmpresa', {
                    templateUrl: 'views/dashboard/configuracionPerfilEmpresa.html',                      
                    controller: 'configuracionPerfilEmpresaCtrl'
                  })
                  .segment('perfilSucursal', {
                    templateUrl: 'views/dashboard/configuracion/sucursal/index.html',
                    controller: 'configuracionPerfilSucursalCtrl'
                  })
                  .segment('perfilPersonal', {
                    templateUrl: 'views/dashboard/configuracion/personal/index.html',
                    controller: 'configuracionPerfilPersonalCtrl'
                  })
                  .segment('terminos', {
                    templateUrl: 'views/dashboard/configuracion/terminos/index.html'
                  })
                .up()
              .segment('administracion', {
                templateUrl: 'views/dashboard/administracion/index.html',
                controller: 'administracionCtrl'
              })
                .within()
                  .segment('personal', {
                    templateUrl: 'views/dashboard/perfil_personal.html',
                    controller: 'perfil_personal_Ctrl'
                  })
                  .segment('sucursal', {
                    templateUrl: 'views/dashboard/perfilSucursal.html',
                    controller: 'perfilSucursalCtrl'
                  })
                  .within()
                    .segment('info', {
                      default: true,
                      templateUrl: 'views/dashboard/administracion/sucursal/info.html',
                      controller: 'infoSucursalCtrl'
                    })
                    .segment('mapa', {
                      templateUrl: 'views/dashboard/administracion/sucursal/mapa.html',
                      controller: 'mapaSucursalCtrl'
                    })
                  .up()

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

    $routeProvider.otherwise({redirectTo: '/nb'}); 
  });