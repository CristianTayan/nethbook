<?php

$array_vistas=[
      // Padre Principal
      ['label'=>'NETHBOOK',
        'nick_path'=>'Nb',
        'selected'=>false,
        'nick_url'=>'nb',
        'personalizacion'=>['icon'=>'dashboard'],
        'children'=>[
          // INICIO
          [
            'label'=>'INICIO',
            'nick_path'=>'Inicio',
            'selected'=>false,
            'nick_url'=>'inicio',
            'personalizacion'=>['icon'=>'home'],
            'children'=>[ 

                        ]
          ],
          [
            'label'=>'APP',
            'nick_path'=>'App',
            'selected'=>false,
            'nick_url'=>'app',
            'personalizacion'=>['icon'=>'mdi-apps'],
            'children'=>[ 
              // MODULO DE GERENCIA
              [
                'label'=>'GERENCIA',
                'nick_path'=>'Gerencia',
                'selected'=>false,
                'nick_url'=>'gerencia',
                'personalizacion'=>['icon'=>'home'],
                'children'=>[]
              ],
              // MODULO DE FINANZAS
              [
                'label'=>'FINANZAS',
                'nick_path'=>'Finanzas',
                'selected'=>false,
                'nick_url'=>'finanzas',
                'personalizacion'=>['icon'=>'home'],
                'children'=>[
                  //MODULO CONTABLE
                  [
                      'label'=>'CONTABLE',
                      'nick_path'=>'Contable',
                      'selected'=>false,
                      'nick_url'=>'contable',
                      'personalizacion'=>['icon'=>'home'],
                      'children'=>[   
                                      [
                                      'label'=>'REPOSITORIO DE FACTURAS',
                                      'nick_path'=>'Repositorio_Facturas',
                                      'selected'=>false,
                                      'nick_url'=>'repositorio_facturas',
                                      'personalizacion'=>['icon'=>'home'],
                                      'children'=>[
                                                      [
                                                          'label'=>'INICIO',
                                                          'nick_path'=>'Inicio_Facturas',
                                                          'selected'=>true,
                                                          'nick_url' =>'inicio_facturas',
                                                          'personalizacion'=>['icon'=>'insert_drive_file'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'MIS FACTURAS',
                                                          'nick_path'=>'Mis_Facturas',
                                                          'selected'=>true,
                                                          'nick_url' =>'mis_facturas',
                                                          'personalizacion'=>['icon'=>'insert_drive_file'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'SUBIR FACTURAS',
                                                          'nick_path'=>'Subir_Facturas',
                                                          'selected'=>true,
                                                          'nick_url' =>'subir_facturas',
                                                          'personalizacion'=>['icon'=>'file_upload'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'CORREO',
                                                          'nick_path'=>'Facturas_Correo',
                                                          'selected'=>true,
                                                          'nick_url' =>'facturas_correo',
                                                          'personalizacion'=>['icon'=>'file_upload'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'FACTURAS RECHAZADAS',
                                                          'nick_path'=>'Facturas_Rechazadas',
                                                          'selected'=>true,
                                                          'nick_url' =>'facturas_rechazadas',
                                                          'personalizacion'=>['icon'=>'rounded_corner'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ]                                                                                                         
                                                  ]
                                      ],

                                      [
                                      'label'=>'EJEMPLO MENU',
                                      'nick_path'=>'Ejemplo',
                                      'selected'=>false,
                                      'nick_url'=>'ejmplo_menu',
                                      'personalizacion'=>['icon'=>'home'],
                                      'children'=>[
                                                                               
                                                  ]
                                      ]
                                  ]

                  ],
                  //MODULO VENTAS
                  [
                      'label'=>'VENTAS',
                      'nick_path'=>'Ventas',
                      'selected'=>false,
                      'nick_url'=>'ventas',
                      'personalizacion'=>['icon'=>'home'],
                      'children'=>[
                                      [
                                          'label'=>'FACTURACION',
                                          'nick_path'=>'Facturacion',
                                          'selected'=>true,
                                          'nick_url' =>'facturacion',
                                          'personalizacion'=>['icon'=>'open_in_browser'],
                                          'children'=>[   
                                                          [
                                                              'label'=>'NUEVA FACTURA',
                                                              'nick_path'=>'Nueva_Factura_Venta',
                                                              'selected'=>true,
                                                              'nick_url' =>'nueva_factura_venta',
                                                              'personalizacion'=>['icon'=>'open_in_browser'],
                                                              'children'=>[   
                                                                              
                                                                          ]
                                                          ],
                                                          [
                                                              'label'=>'CAJAS',
                                                              'nick_path'=>'Cajas',
                                                              'selected'=>true,
                                                              'nick_url' =>'cajas',
                                                              'personalizacion'=>['icon'=>'dashboard'],
                                                              'children'=>[   
                                                                              
                                                                          ]
                                                          ],
                                                          [
                                                              'label'=>'MIS FACTURAS (VENTAS)',
                                                              'nick_path'=>'Mis_Facturas_Venta',
                                                              'selected'=>true,
                                                              'nick_url' =>'mis_facturas_venta',
                                                              'personalizacion'=>['icon'=>'open_in_browser'],
                                                              'children'=>[   
                                                                              
                                                                          ]
                                                          ],
                                                          [
                                                              'label'=>'CLIENTES',
                                                              'nick_path'=>'Clientes',
                                                              'selected'=>true,
                                                              'nick_url' =>'clientes',
                                                              'personalizacion'=>['icon'=>'person_pin'],
                                                              'children'=>[   
                                                                              
                                                                          ]
                                                          ]   
                                                          
                                                      ]
                                      ]                                                                                                      
                                  ]
                  ],
                  //MODULO INVENTARIO
                  [
                      'label'=>'INVENTARIO',
                      'nick_path'=>'Inventario',
                      'selected'=>false,
                      'nick_url'=>'inventario',
                      'personalizacion'=>['icon'=>'home'],
                      'children'=>[
                                      ///-------------INVENTARIO BIENES
                                      [
                                          'label'=>'INVENTARIO DE BIENES',
                                          'nick_path'=>'Inv_Bienes',
                                          'selected'=>false,
                                          'nick_url' =>'Inv_Bienes',
                                          'personalizacion'=>['icon'=>'person_pin'],
                                          'children'=>[   
                                                      // ---------------- CATEGORIAS BIENES
                                                          [
                                                          'label'=>'CATEGORIAS',
                                                          'nick_path'=>'Categorias',
                                                          'selected'=>true,
                                                          'nick_url' =>'categoria',
                                                          'personalizacion'=>['icon'=>'transform'],
                                                          'children'=>[
                                                                          [
                                                                              'label'=>'TIPO CATEGORIA',
                                                                              'nick_path'=>'Tipo_Categoria',
                                                                              'selected'=>true,
                                                                              'nick_url'=>'tipo_categoria',
                                                                              'personalizacion'=>['icon'=>'transform'],
                                                                              'children'=>[   
                                                                                              
                                                                                          ]
                                                                          ]   
                                                                         
                                                                      ]
                                                          ],
                                                      // ---------------- MARCAS BIENES
                                                      [
                                                          'label'=>'MARCAS',
                                                          'nick_path'=>'Marcas',
                                                          'selected'=>true,
                                                          'nick_url'=>'marcas',
                                                          'personalizacion'=>['icon'=>'brightness_auto'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      //---------------- MODELOS BIENES
                                                      [
                                                          'label'=>'MODELOS',
                                                          'nick_path'=>'Modelos',
                                                          'selected'=>true,
                                                          'nick_url'=>'modelos',
                                                          'personalizacion'=>['icon'=>'burst_mode'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      //---------------- BIENES
                                                      [
                                                          'label'=>'BIENES',
                                                          'nick_path'=>'Bienes',
                                                          'selected'=>true,
                                                          'nick_url'=>'bienes',
                                                          'personalizacion'=>['icon'=>'developer_board'],
                                                          'children'=>[   
                                      
                                                                      ]
                                                      ],
                                                      //---------------- UBICACION BIENES
                                                      [
                                                          'label'=>'UBICACION',
                                                          'nick_path'=>'Ubicacion',
                                                          'selected'=>false,
                                                          'nick_url'=>'ubicacion',
                                                          'personalizacion'=>['icon'=>'location_on'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      //---------------- GARANTIAS BIENES
                                                      [
                                                          'label'=>'GARANTIA',
                                                          'nick_path'=>'Garantia',
                                                          'selected'=>false,
                                                          'nick_url'=>'garantia',
                                                          'personalizacion'=>['icon'=>'forward'],
                                                          'children'=>[   
                                                                          [
                                                                              'label'=>'TIPO GARANTIA',
                                                                              'nick_path'=>'Tipo_Garantia',
                                                                              'selected'=>true,
                                                                              'nick_url'=>'tipo_garantia',
                                                                              'personalizacion'=>['icon'=>'forward'],
                                                                              'children'=>[   
                                                                                              
                                                                                          ]
                                                                          ]
                                                                      ]
                                                      ],
                                                      //---------------- ESTADO DESCRIPTIVO BIENES
                                                      [
                                                          'label'=>'ESTADO DESCRIPTIVO',
                                                          'nick_path'=>'Estado_Descriptivo',
                                                          'selected'=>true,
                                                          'nick_url'=>'estado_descriptivo',
                                                          'personalizacion'=>['icon'=>'spellcheck'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      // Parametrizacion Tipos
                                                      //---------------- TIPO CONSUMO BIENES
                                                      [
                                                          'label'=>'TIPO CONSUMO',
                                                          'nick_path'=>'Tipo_Consumo',
                                                          'selected'=>true,
                                                          'nick_url'=>'tipo_consumo',
                                                          'personalizacion'=>['icon'=>'card_giftcard'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ]

                                                      ]
                                      ],
                                      ///-------------INVENTARIO SERVICIOS
                                      [
                                          'label'=>'INVENTARIO DE SERVICIOS',
                                          'nick_path'=>'Inv_Servicios',
                                          'selected'=>false,
                                          'nick_url' =>'Inv_Servicios',
                                          'personalizacion'=>['icon'=>'person_pin'],
                                          'children'=>[   
                                                      // ---------------- CATEGORIAS SERVICIOS
                                                          [
                                                          'label'=>'CATEGORIAS',
                                                          'nick_path'=>'Categorias',
                                                          'selected'=>true,
                                                          'nick_url' =>'categorias',
                                                          'personalizacion'=>['icon'=>'transform'],
                                                          'children'=>[
                                                                          [
                                                                              'label'=>'TIPO CATEGORIA',
                                                                              'nick_path'=>'Tipo_Categorias',
                                                                              'selected'=>true,
                                                                              'nick_url'=>'tipo_categorias',
                                                                              'personalizacion'=>['icon'=>'transform'],
                                                                              'children'=>[   
                                                                                              
                                                                                          ]
                                                                          ]   
                                                                         
                                                                      ]
                                                          ],
                                                      //---------------- MODELOS SERVICIOS
                                                      [
                                                          'label'=>'MODELOS',
                                                          'nick_path'=>'Modelos',
                                                          'selected'=>true,
                                                          'nick_url'=>'modelos',
                                                          'personalizacion'=>['icon'=>'burst_mode'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      //---------------- MODELOS SERVICIOS
                                                      [
                                                          'label'=>'SERVICIOS',
                                                          'nick_path'=>'Servicios',
                                                          'selected'=>true,
                                                          'nick_url'=>'servicios',
                                                          'personalizacion'=>['icon'=>'developer_board'],
                                                          'children'=>[   
                                                                      ]
                                                      ],
                                                      //---------------- MODELOS UBICACION
                                                      [
                                                          'label'=>'UBICACION',
                                                          'nick_path'=>'Ubicacion',
                                                          'selected'=>false,
                                                          'nick_url'=>'ubicacion',
                                                          'personalizacion'=>['icon'=>'location_on'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      //---------------- GARANTIAS SERVICIOS
                                                      [
                                                          'label'=>'GARANTIA',
                                                          'nick_path'=>'Garantia',
                                                          'selected'=>false,
                                                          'nick_url'=>'garantia',
                                                          'personalizacion'=>['icon'=>'forward'],
                                                          'children'=>[   
                                                                          [
                                                                              'label'=>'TIPO GARANTIA',
                                                                              'nick_path'=>'Tipo_Garantia',
                                                                              'selected'=>true,
                                                                              'nick_url'=>'tipo_garantia',
                                                                              'personalizacion'=>['icon'=>'forward'],
                                                                              'children'=>[   
                                                                                              
                                                                                          ]
                                                                          ]
                                                                      ]
                                                      ],
                                                      //---------------- ESTADO DESCRIPTIVO SERVICIOS
                                                      [
                                                          'label'=>'ESTADO DESCRIPTIVO',
                                                          'nick_path'=>'Estado_Descriptivo',
                                                          'selected'=>true,
                                                          'nick_url'=>'estado_descriptivo',
                                                          'personalizacion'=>['icon'=>'spellcheck'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      // Parametrizacion Tipos
                                                      //---------------- TIPO CONSUMO SERVICIOS
                                                      [
                                                          'label'=>'TIPO CONSUMO',
                                                          'nick_path'=>'Tipo_Consumo',
                                                          'selected'=>true,
                                                          'nick_url'=>'tipo_consumo',
                                                          'personalizacion'=>['icon'=>'card_giftcard'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      ]
                                      ],
                                      ///-------------INVENTARIO PRODUCTOS
                                      [
                                          'label'=>'INVENTARIO DE PRODUCTOS',
                                          'nick_path'=>'Inv_Productos',
                                          'selected'=>false,
                                          'nick_url'=>'Inv_Productos',
                                          'personalizacion'=>['icon'=>'grain'],
                                          'children'=>[
                                                          
                                                      [
                                                          'label'=>'CATEGORIAS',
                                                          'nick_path'=>'Categorias',
                                                          'selected'=>true,
                                                          'nick_url' =>'categoria',
                                                          'personalizacion'=>['icon'=>'transform'],
                                                          'children'=>[
                                                                          [
                                                                              'label'=>'TIPO CATEGORIA',
                                                                              'nick_path'=>'Tipo_Categoria',
                                                                              'selected'=>true,
                                                                              'nick_url'=>'tipo_categoria',
                                                                              'personalizacion'=>['icon'=>'transform'],
                                                                              'children'=>[   
                                                                                              
                                                                                          ]
                                                                          ]   
                                                                         
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'MARCAS',
                                                          'nick_path'=>'Marcas',
                                                          'selected'=>true,
                                                          'nick_url'=>'marcas',
                                                          'personalizacion'=>['icon'=>'brightness_auto'],
                                                          'children'=>[                                                                                                                                       
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'MODELOS',
                                                          'nick_path'=>'Modelos',
                                                          'selected'=>true,
                                                          'nick_url'=>'modelos',
                                                          'personalizacion'=>['icon'=>'burst_mode'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'PRODUCTOS',
                                                          'nick_path'=>'Productos',
                                                          'selected'=>true,
                                                          'nick_url'=>'productos',
                                                          'personalizacion'=>['icon'=>'developer_board'],
                                                          'children'=>[  
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'UBICACION',
                                                          'nick_path'=>'Ubicacion',
                                                          'selected'=>false,
                                                          'nick_url'=>'ubicacion',
                                                          'personalizacion'=>['icon'=>'location_on'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'GARANTIA',
                                                          'nick_path'=>'Garantia',
                                                          'selected'=>false,
                                                          'nick_url'=>'garantia',
                                                          'personalizacion'=>['icon'=>'forward'],
                                                          'children'=>[   
                                                                          [
                                                                              'label'=>'TIPO GARANTIA',
                                                                              'nick_path'=>'Tipo_Garantia',
                                                                              'selected'=>true,
                                                                              'nick_url'=>'tipo_garantia',
                                                                              'personalizacion'=>['icon'=>'forward'],
                                                                              'children'=>[                                                                                                                                                           
                                                                                          ]
                                                                          ]
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'ESTADO DESCRIPTIVO',
                                                          'nick_path'=>'Estado_Descriptivo',
                                                          'selected'=>true,
                                                          'nick_url'=>'estado_descriptivo',
                                                          'personalizacion'=>['icon'=>'spellcheck'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      // Parametrizacion Tipos
                                                      [
                                                          'label'=>'TIPO CONSUMO',
                                                          'nick_path'=>'Tipo_Consumo',
                                                          'selected'=>true,
                                                          'nick_url'=>'tipo_consumo',
                                                          'personalizacion'=>['icon'=>'card_giftcard'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'TIPO CATALOGO',
                                                          'nick_path'=>'Tipo_Catalogo',
                                                          'selected'=>true,
                                                          'nick_url'=>'tipo_catalogo',
                                                          'personalizacion'=>['icon'=>'import_contacts'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ],
                                                      [
                                                          'label'=>'BODEGAS',
                                                          'nick_path'=>'Bodegas',
                                                          'selected'=>true,
                                                          'nick_url'=>'bodegas',
                                                          'personalizacion'=>['icon'=>'dashboard'],
                                                          'children'=>[   
                                                                          
                                                                      ]
                                                      ]
                                                      
                                          ]
                                      ]
                                  ]
                  ]
                ]
              ],
              // MODULO DE TALENTO HUMANO
              [
                'label'=>'TALENTO HUMANO',
                'nick_path'=>'Talento_Humano',
                'selected'=>false,
                'nick_url'=>'talento_humano',
                'personalizacion'=>['icon'=>'home'],
                'children'=>[]
              ],
              // MODULO DE GIRO DEL NEGOCIO
              [
                'label'=>'GIRO DEL NEGOCIO',
                'nick_path'=>'Giro_Negocio',
                'selected'=>false,
                'nick_url'=>'giro_negocio',
                'personalizacion'=>['icon'=>'home'],
                'children'=>[]
              ],
              // MODULO DE ADMINISTRACION
              [
                'label'=>'ADMINISTRACION',
                'nick_path'=>'Administracion',
                'selected'=>false,
                'nick_url'=>'administracion',
                'personalizacion'=>['icon'=>'home'],
                'children'=>[
                  [
                      'label'=>'PERFIL PERSONAL',
                      'nick_path'=>'Perfil_Personal',
                      'selected'=>true,
                      'nick_url'=>'perfil_personal',
                      'personalizacion'=>['icon'=>'perm_identity'],
                      'children'=>[]       
                  ],
                  [
                      'label'=>'DATOS PERSONALES',
                      'nick_path'=>'Datos_Personal',
                      'selected'=>true,
                      'nick_url' =>'datos_personal',
                      'personalizacion'=>['icon'=>'person'],
                      'children'=>[   
                                      
                                  ]
                  ],
                  [
                      'label'=>'TERMINOS',
                      'nick_path'=>'Terminos',
                      'selected'=>true,
                      'nick_url' =>'terminos',
                      'personalizacion'=>['icon'=>'person'],
                      'children'=>[   
                                      
                                  ]
                  ],
                  [
                      'label'=>'PERFIL SUCURSAL',
                      'nick_path'=>'Perfil_Sucursal',
                      'selected'=>true,
                      'nick_url'=>'perfil_sucursal',
                      'personalizacion'=>['icon'=>'perm_identity'],
                      'children'=>[                                                                   
                                  ]       
                  ],
                  [
                      'label'=>'USUARIO',
                      'nick_path'=>'Usuario',
                      'selected'=>true,
                      'nick_url' =>'usuario',
                      'personalizacion'=>['icon'=>'person'],
                      'children'=>[   
                                      
                                  ]
                  ],
                  [
                      'label'=>'TIPO USUARIO',
                      'nick_path'=>'Tipo_Usuario',
                      'selected'=>true,
                      'nick_url' =>'tipo_usuario',
                      'personalizacion'=>['icon'=>'person'],
                      'children'=>[   
                                      
                                  ]
                  ]
                    
                ]
              ]
          ]
          ]
          

          ]
      ]
  ];

 return 
 [
 'lista'=>$array_vistas
 ]; 
?>