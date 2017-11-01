<?php
return [

    // 'appnext' => 'http://186.4.167.12/appnext',
    // 'appserviciosnext' => 'http://186.4.167.12/appserviciosnext'
    // local
    
    //'appnext' => 'http://186.4.167.12/appnext1.1',
//LOCAL
    'appnext' => 'http://localhost/nethbook/server/public/index.php/',
    'servicios_especiales' => 'http://186.4.167.12/special_services/public/index.php/',
    'appserviciosnext' => 'http://localhost/nethbook/servicios/public/index.php/',
//SERVIDOR
/*
    'appnext' => 'http://localhost:8000/',
    'servicios_especiales' => 'http://186.4.167.12/special_services/public/index.php/',
    'appserviciosnext' => 'http://' . $_SERVER['SERVER_NAME'] . '/nethbook/servicios/public/index.php/',
*/


    //'appserviciosnext' => 'http://localhost:8001/public/index.php/', centos para produccion

    // 'appserviciosnext' => 'http://186.4.167.12/appserviciosnext',
/*
    'appnext' => 'http://localhost:8000/',
    'servicios_especiales' => 'http://localhost:8000/special_services/public/index.php/',
    'appserviciosnext' => 'http://localhost:8000/appserviciosnext',*/

    'pathimgPerfiles'=>'/perfiles/',
    'pathimgPortadas'=>'/portadas/',
    'pathimgLogos'=>'/logos/',
    'pathimgClientes'=>'/clientes/',
    'pathFacturas'=>'/facturas/',
    // catalogo paths
    'pathimgCatalogoProductos'=>'productos/',
    'pathimgCatalogo'=>'/catalogo/',
    'pathimgCatalogoPortadas'=>'portadas/',
    'pathimgCatalogoContraportadas'=>'contraportadas/',
    // default --------------------
    'pathPerfilDefault'=>"/storage/default/avatar-default",
    'pathAvartarEmpresasDefault'=>"/storage/default/db.png",
    'pathPortadaDefault'=>"/storage/default/portada-default.jpg",
    'pathLogoDefault'=>"/storage/default/logo-default.jpg",
    'pathPortadaCatalogoDefault'=>"/storage/default/catportada-default.jpg",
    'pathContraportadaDefault'=>"/storage/default/contraportada-default.jpg",
    'dominio' => 'nethbook.com',
//LOCAL
'dominioActivarCuentaCorreo' => 'http://localhost/nethbook/app/#/'
//SERVIDOR
//  'dominioActivarCuentaCorreo' => $_SERVER['SERVER_NAME'] . 'nethbook/app/'
        // 'appnext' => 'https://servicios.nextbook.ec'

];
?>