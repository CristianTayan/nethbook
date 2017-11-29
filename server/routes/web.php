<?php
Route::get('/', function () {
    return view('welcome');
});
Route::group(['middleware' => 'cors'], function(){
    Route::post('Save_Datos_Ruc','Registro@Save_Datos_Ruc');
    //----------------------------------------------------------------Pruebas
    Route::get('crear_bdd','pruebas@crear_bdd');
    //Route::get('buscar_empresas','pruebas@buscar_empresas');
    //Route::get('edit_script','pruebas@edit_script');
    Route::post('generar_xml_fac','pruebas@generar_xml_fac');
    /*Route::get('factura_pdf', function () {
    return view('factura_prueba');
    });*/
   
    Route::post('Buscar_Empresas','busquedaEmpresas@Buscar_Empresas');
     // --------------------- Datos de Perfil Empresa----------------------------------
    Route::post('Get_Perfil_Empresas', 'busquedaEmpresas@Get_Perfil_Empresas');
    // --------------------- Buscar Empresa----------------------------------
    Route::post('Buscar_Informacion_Ruc', 'Registro@Buscar_Informacion_Ruc');
    // --------------------- GET provincias ----------------------------------
    Route::post('Get_Provincias', 'Registro@Get_Provincias'); 
    // --------------------- GET CIUDADES ----------------------------------
    Route::post('Get_Ciudades', 'Registro@Get_Ciudades'); 
    // --------------------- ACTIVAR CUENTA  ----------------------------------
    Route::post('Activar_Cuenta', 'Registro@Activar_Cuenta');
    // Ingreso
    Route::post('Acceso','login@Acceso');
    Route::get('Salir','login@Salir');
    // Accesso Colaboradores
    Route::post('Acceso_Colaborador', 'login@Acceso_Colaborador');
    Route::post('Get_Data_By_Ruc', 'login@Get_Data_By_Ruc');
    Route::group(['middleware' => ['auth.nextbook']], function () {
    // ////////////////////////////////////////////////// IMAGENES DE PERFIL //////////////
      // --------------------------------------- AÑADIR IMAGEN DE PERFIL -----------
      Route::post('Add_Img_Perfil', 'Perfil@Add_Img_Perfil');
      Route::post('Add_Img_PerfilUsuario', 'Perfil@Add_Img_PerfilUsuario');
      // --------------------------------------- SELECCIONAR IMAGEN DE PERFIL -----------
      Route::post('Set_Img_Perfil', 'Perfil@Set_Img_Perfil');
      Route::post('Set_Img_PerfilUsuario', 'Perfil@Set_Img_PerfilUsuario');
      // --------------------------------------- CARGAR IMAGENES PERFIL -----------
      Route::post('Load_Imgs_Perfil', 'Perfil@Load_Imgs_Perfil');
      Route::post('Load_Imgs_PerfilUsuario', 'Perfil@Load_Imgs_PerfilUsuario');
      // --------------------------------------- GET IMAGENES PERFIL -----------
      Route::post('Get_Img_Perfil', 'Perfil@Get_Img_Perfil');
      Route::post('Get_Img_PerfilUsuario', 'Perfil@Get_Img_PerfilUsuario');
      // --------------------------------------- DELETE IMAGENES PERFIL -----------
      Route::post('Delete_Img_Perfil', 'Perfil@Delete_Img_Perfil');
      Route::post('Delete_Img_PerfilUsuario', 'Perfil@Delete_Img_PerfilUsuario');
      // ////////////////////////////////////////////////// IMAGENES DE LOGO //////////////
        // --------------------------------------- AÑADIR IMAGEN DE LOGO -----------
        Route::post('Add_Img_Logo', 'Logo@Add_Img_Logo');
        // --------------------------------------- SELECCIONAR IMAGEN DE LOGO -----------
        Route::post('Set_Img_Logo', 'Logo@Set_Img_Logo');
        // --------------------------------------- CARGAR IMAGENES LOGO -----------
        Route::post('Load_Imgs_Logo', 'Logo@Load_Imgs_Logo');
        // --------------------------------------- GET IMAGENES LOGO -----------
        Route::post('Get_Img_Logo', 'Logo@Get_Img_Logo');
        // --------------------------------------- DELETE IMAGENES LOGO -----------
        Route::post('Delete_Img_Logo', 'Logo@Delete_Img_Logo');
        // ////////////////////////////////////////////////// IMAGENES DE PORTADA //////////////
        // --------------------------------------- AÑADIR IMAGEN DE PORTADA -----------
        Route::post('Add_Img_Portada', 'Portada@add_img_portada');
        Route::post('Add_Img_PortadaUsuario', 'Portada@add_img_portadaUsuario');
        // --------------------------------------- SELECCIONAR IMAGEN DE PORTADA -----------
        Route::post('Set_Img_Portada', 'Portada@Set_Img_Portada');
        Route::post('Set_Img_PortadaUsuario', 'Portada@Set_Img_PortadaUsuario');
        // --------------------------------------- CARGAR IMAGENES PORTADA -----------
        Route::post('Load_Imgs_Portada', 'Portada@Load_Imgs_Portada');
        Route::post('Load_Imgs_PortadaUsuario', 'Portada@Load_Imgs_PortadaUsuario');
        // --------------------------------------- GET IMAGENES PORTADA -----------
        Route::post('Get_Img_Portada', 'Portada@Get_Img_Portada');
        Route::post('Get_Img_PortadaUsuario', 'Portada@Get_Img_PortadaUsuario');
        // --------------------------------------- DELETE IMAGENES PORTADA -----------
        Route::post('Delete_Img_Portada', 'Portada@Delete_Img_Portada');
        Route::post('Delete_Img_PortadaUsuario', 'Portada@Delete_Img_PortadaUsuario');

        // GET DATOS EMPRESA
        Route::post('Get_Datos_Empresa', 'Administracion_Empresa@Get_Datos_Empresa');
        //ESTABLECIMIENTOS
        Route::post('Get_Establecimientos', 'Administracion_Empresa@Get_Establecimientos');
        Route::post('Update_Giro_Actividad', 'Sucursales@Update_Giro_Actividad');
        //UPDATE PASSWORD
        Route::post('Update_Password', 'Administracion_Empresa@Update_Password');
        // Categorias
        Route::post('Add_Categoria_Padre','categorias@Add_Categoria_Padre');
        Route::post('Add_Categoria_Hijo','categorias@Add_Categoria_Hijo');
        Route::post('Get_Categorias','categorias@Get_Categorias');
        Route::post('Get_Categorias_Select','categorias@Get_Categorias_Select');
        Route::post('Update_Categoria','categorias@Update_Categoria');
        Route::post('Delete_Categoria','categorias@Delete_Categoria');
        // Tipo Categorias
        Route::post('Existencia_Tipo_Categoria','Tipos_Categorias@Existencia_Tipo_Categoria');
        Route::post('Existencia_Update_Tipo_Categoria','Tipos_Categorias@Existencia_Update_Tipo_Categoria');
        Route::post('Add_Tipo_Categoria','Tipos_Categorias@Add_Tipo_Categoria');
        Route::post('Get_Tipo_Categorias','Tipos_Categorias@Get_Tipo_Categorias');
        Route::post('Delete_Tipo_Categorias','Tipos_Categorias@Delete_Tipo_Categorias');
        Route::post('Update_Tipo_Categorias','Tipos_Categorias@Update_Tipo_Categorias');
        // Marcas
        Route::post('Existencia_Marca','Marcas@Existencia_Marca');
        Route::post('Add_Marca','Marcas@Add_Marca');
        Route::post('Get_Marcas','Marcas@Get_Marcas');
        Route::post('Update_Marca','Marcas@Update_Marca');
        Route::post('Delete_Marca','Marcas@Delete_Marca');
        // Tipo Garantias
        Route::post('Existencia_Tipo_Garantia','Tipos_Garantias@Existencia_Tipo_Garantia');
        Route::post('Add_Tipo_Garantia','Tipos_Garantias@Add_Tipo_Garantia');
        Route::post('Get_Tipo_Garantias','Tipos_Garantias@Get_Tipo_Garantias');
        Route::post('Update_Tipo_Garantia','Tipos_Garantias@Update_Tipo_Garantia');
        Route::post('Delete_Tipo_Garantia','Tipos_Garantias@Delete_Tipo_Garantia');
        // Garantias
        Route::post('Existencia_Garantia','Garantias@Existencia_Garantia');
        Route::post('Add_Garantia','Garantias@Add_Garantia');
        Route::post('Get_Garantias','Garantias@Get_Garantias');
        Route::post('Update_Garantia','Garantias@Update_Garantia');
        Route::post('Delete_Garantia','Garantias@Delete_Garantia');
        // Modelos
        Route::post('Existencia_Modelo','Modelos@Existencia_Modelo');
        Route::post('Add_Modelo','Modelos@Add_Modelo');
        Route::post('Get_Modelos','Modelos@Get_Modelos');
        Route::post('Update_Modelo','Modelos@Update_Modelo');
        Route::post('Delete_Modelo','Modelos@Delete_Modelo');
        // Tipo Consumos
        Route::post('Existencia_Tipo_Consumo','Tipo_Consumo@Existencia_Tipo_Consumo');
        Route::post('Add_Tipo_Consumo','Tipo_Consumo@Add_Tipo_Consumo');
        Route::post('Get_Tipo_Consumos','Tipo_Consumo@Get_Tipo_Consumos');
        Route::post('Update_Tipo_Consumo','Tipo_Consumo@Update_Tipo_Consumo');
        Route::post('Delete_Tipo_Consumo','Tipo_Consumo@Delete_Tipo_Consumo');
        // Ubicaciones
        Route::post('Existencia_Ubicacion','Ubicaciones@Existencia_Ubicacion');
        Route::post('Add_Ubicacion','Ubicaciones@Add_Ubicacion');
        Route::post('Get_Ubicaciones','Ubicaciones@Get_Ubicaciones');
        Route::post('Update_Ubicacion','Ubicaciones@Update_Ubicacion');
        Route::post('Delete_Ubicacion','Ubicaciones@Delete_Ubicacion');
        // Productos
        Route::post('Add_Producto','Productos@Add_Producto');
        Route::post('Get_Productos','Productos@Get_Productos');
        Route::post('Get_Bienes','Productos@Get_Bienes');
        // Tipo Producto
        Route::post('Existencia_Tipo_Producto','Tipos_Productos@Existencia_Tipo_Producto');
        Route::post('Add_Tipo_Producto','Tipos_Productos@Add_Tipo_Producto');
        Route::post('Get_Tipo_Productos','Tipos_Productos@Get_Tipo_Productos');
        Route::post('Update_Tipo_Producto','Tipos_Productos@Update_Tipo_Producto');
        Route::post('Delete_Tipo_Producto','Tipos_Productos@Delete_Tipo_Producto');
        // Tipos Catalogos
        Route::post('Existencia_Tipo_Catalogo','Tipos_Catalogos@Existencia_Tipo_Catalogo');
        Route::post('Add_Tipo_Catalogo','Tipos_Catalogos@Add_Tipo_Catalogo');
        Route::post('Get_Tipo_Catalogos','Tipos_Catalogos@Get_Tipo_Catalogos');
        Route::post('Update_Tipo_Catalogo','Tipos_Catalogos@Update_Tipo_Catalogo');
        Route::post('Delete_Tipo_Catalogo','Tipos_Catalogos@Delete_Tipo_Catalogo');
         // Catalogos
        Route::post('Add_Catalogo','Catalogos@Add_Catalogo');
        Route::post('Get_Catalogos','Catalogos@Get_Catalogos');
        Route::post('Update_Catalogo','Catalogos@Update_Catalogo');
        Route::post('Delete_Catalogo','Catalogos@Delete_Catalogo');
        // Estado Descriptivo
        Route::post('Existencia_Estado_Descriptivo','Estado_Descriptivo@Existencia_Estado_Descriptivo');
        Route::post('Add_Estado_Descriptivo','Estado_Descriptivo@Add_Estado_Descriptivo');
        Route::post('Get_Estados_Descriptivos','Estado_Descriptivo@Get_Estados_Descriptivos');
        Route::post('Update_Estado_Descriptivo','Estado_Descriptivo@Update_Estado_Descriptivo');
        Route::post('Delete_Estado_Descriptivo','Estado_Descriptivo@Delete_Estado_Descriptivo');
        // Bodegas
        Route::post('Existencia_Bodega','Bodegas@Existencia_Bodega');
        Route::post('Add_Bodega','Bodegas@Add_Bodega');
        Route::post('Get_Bodegas','Bodegas@Get_Bodegas');
        Route::post('Update_Bodega','Bodegas@Update_Bodega');
        Route::post('Delete_Bodega','Bodegas@Delete_Bodega');
        // Colaboradores
        //Route::post('Acceso_Colaborador', 'Colaboradores@Acceso_Colaborador');
        Route::post('Existencia_Colaborador', 'Colaboradores@Existencia_Colaborador');
        Route::post('Existencia_Usuario_Cedula', 'Colaboradores@Existencia_Usuario_Cedula');
        Route::post('Existencia_Usuario_Correo', 'Colaboradores@Existencia_Usuario_Correo');
        Route::post('Existencia_Usuario_Nick', 'Colaboradores@Existencia_Usuario_Nick');
        Route::post('Gen_Vistas_Admin', 'Colaboradores@Gen_Vistas_Admin');
        Route::post('Gen_Privilegios_Admin', 'Colaboradores@Gen_Privilegios_Admin');
        Route::post('Add_Col_Usuario', 'Colaboradores@Add_Col_Usuario');
        Route::post('Get_Col_Usuario', 'Colaboradores@Get_Col_Usuario');
        Route::post('Delete_Col_Usuario', 'Colaboradores@Delete_Col_Usuario');
        Route::post('Get_Col_Usuario_Update', 'Colaboradores@Get_Col_Usuario_Update');
        Route::post('Update_Col_Usuario', 'Colaboradores@Update_Col_Usuario');
        Route::post('Verificar_Pass', 'Colaboradores@Verificar_Pass');
        // Tipos de Usuario
        Route::post('Existencia_Tipo_Usuario','Tipo_Usuario@Existencia_Tipo_Usuario');
        Route::post('Add_Tipo_Usuario','Tipo_Usuario@Add_Tipo_Usuario');
        Route::post('Get_Tipo_Usuarios','Tipo_Usuario@Get_Tipo_Usuarios');
        Route::post('Update_Tipo_Usuario','Tipo_Usuario@Update_Tipo_Usuario');
        Route::post('Delete_Tipo_Usuario','Tipo_Usuario@Delete_Tipo_Usuario');
        //Tipo de Documento
        Route::post('Get_Tipo_Documentos','Tipo_Documentos@Get_Tipo_Documentos');
        //Operadoras
        Route::post('Get_Operadoras','Clientes@Get_Operadoras');
        //Tipos de Documento de Identificacion
        Route::post('Get_Documentos_Identificacion','Personas@Get_Documentos_Identificacion');
        //Get Vistas
        Route::post('Get_Vistas', 'Colaboradores@Get_Vistas');
        Route::post('Get_Vistas_Loged_User','Tipo_Usuario@Get_Vistas_Loged_User');
        Route::post('Get_Vistas_Tip_User_Update','Tipo_Usuario@Get_Vistas_Tip_User_Update');
        //Privilegios
        Route::post('Get_Combinacion_Privilegios', 'Tipo_Usuario@Get_Combinacion_Privilegios');
        // REPOSITORIO DE FACTURAS -------------------
        Route::post('Upload_Factura', 'Repositorio_Facturas@Upload_Factura');
        Route::post('Get_Mis_Facturas', 'Repositorio_Facturas@Get_Mis_Facturas');
        Route::post('Generar_PDF', 'Repositorio_Facturas@Generar_PDF');
        //FACTURAS CORREO
        Route::post('Leer_Facturas_Correo', 'Repositorio_Facturas@Leer_Facturas_Correo');
        Route::post('Get_Xml_Factura_Correo', 'Repositorio_Facturas@Get_Xml_Factura_Correo');
        //FACTURAS RECHAZADAS
        Route::post('Get_Facturas_Rechazadas', 'Repositorio_Facturas@Get_Facturas_Rechazadas');
        // Tipos de Gasto
        Route::post('Existencia_Gasto','Gastos@Existencia_Gasto');
        Route::post('Add_Gasto','Gastos@Add_Gasto');
        Route::post('Get_Gastos','Gastos@Get_Gastos');
        Route::post('Update_Gasto','Gastos@Update_Gasto');
        Route::post('Delete_Gasto','Gastos@Delete_Gasto');
        //----------------------------------------- REPORTES +-------------------------------//
        //TOTALES DE FACTURAS
        Route::post('Get_Totales_Facturas','Reportes@Get_Totales_Facturas');
        Route::post('Get_Totales_Deducibles','Reportes@Get_Totales_Deducibles');
        Route::post('Get_Nro_Tipos_Documentos','Reportes@Get_Nro_Tipos_Documentos');
        Route::post('Get_Totales_Deducibles_Mes','Reportes@Get_Totales_Deducibles_Mes');
        //----------------------------------------- AYUDAS +-------------------------------//
        //INVENTARIO
        Route::post('Ayuda_Inventario_Save','AyudaInventario@Ayuda_Inventario_Save');
        //----------------------------------------- FIN AYUDAS +-------------------------------//
        //-----------------------------------------ACTUALIZAR INFORMACION EMPRESA
        Route::post('Update_Informacion_Empresa','Administracion_Empresa@Update_Informacion_Empresa');
        ////-----------------------------------------FACURACION
        Route::post('Get_Cliente_By_Ruc_Ci','Clientes@Get_Cliente_By_Ruc_Ci');
        Route::post('Add_Caja','Facturacion@Add_Caja');
        Route::post('Get_Cajas','Facturacion@Get_Cajas');
        Route::post('Get_Empleado_By_Ruc_Ci','Facturacion@Get_Empleado_By_Ruc_Ci');
        Route::post('Buscar_Productos_Facturacion','Facturacion@Buscar_Productos_Facturacion');
        Route::post('Get_Formas_Pagos','Facturacion@Get_Formas_Pagos');
        Route::post('Add_Factura','Facturacion@Add_Factura');
        Route::post('Get_Mis_Facturas_Venta','Facturacion@Get_Mis_Facturas_Venta');
        Route::post('Generar_Comprobante_Factura','Facturacion@Generar_Comprobante_Factura');
        //-----------------------------------------IMPUESTOS
        Route::post('Existencia_Impuesto','Impuestos@Existencia_Impuesto');
        Route::post('Add_Impuesto','Impuestos@Add_Impuesto');
        Route::post('Get_Impuestos','Impuestos@Get_Impuestos');
        Route::post('Get_Ambito_Impuestos','Impuestos@Get_Ambito_Impuestos');
        Route::post('Get_Tipo_Impuestos','Impuestos@Get_Tipo_Impuestos');
        Route::post('Update_Impuesto','Impuestos@Update_Impuesto');
        Route::post('Delete_Impuesto','Impuestos@Delete_Impuesto');
        ////-----------------------------------------CLIENTES
        Route::post('Get_Clientes','Clientes@Get_Clientes');
        Route::post('Add_Persona','Clientes@Add_Persona');
        Route::post('Add_Empresa','Clientes@Add_Empresa');
        Route::post('Existencia_Persona','Clientes@Existencia_Persona');
        //Sessiones
        Route::post('Refresh_Token','Sesiones@Refresh_Token');
        Route::post('CloseSession','Sesiones@closeSession');
    });
});