<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// Extras
use DB;
use Carbon\Carbon;
use \Firebase\JWT\JWT;
use Config;
// Funciones
use App\libs\Funciones;

class Sucursales extends Controller
{
    public function __construct(Request $request){
        try{
            // Funciones
            $this->funciones=new Funciones();
            //Autenticacion
            $key=config('jwt.secret');
            $decoded = JWT::decode($request->token, $key, array('HS256'));
            $this->user=$decoded;
            $this->name_bdd=$this->user->nbdb;
        }catch (\Firebase\JWT\ExpiredException $e) {
            return response()->json(['respuesta' => $e->getMessage()],401);
            die();
        }
    }

      public function UpdateAddSucursal(Request $request) {
        // return response($request->valores);
      // echo $request;
     // $data_sucursal = DB::connection('comercial_h_1090084247001') -> table('administracion.sucursales')-> where('id',$x) -> first();
      $data_sucursal=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id',$request->idSucursal)->first();
      if ($data_sucursal) { 
        // $data=DB::connection('comercial_h_1090084247001')->table('administracion.sucursales')->where('id',$x)->update
        $data=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id',$request->idSucursal)
    ->update(
        [
            'datos_adiconales' => json_encode(['datos_adiconales'=>$request->valores])
        ]);
        echo('datos guardados');
      }
      if (!$data_sucursal) {
         echo("Sucursal No Encontrada");
      }
    }

    public function Update_Giro_Actividad(Request $request)
    {
	            
$data_sucursal=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id',$request->sucursal)->first();
if ($data_sucursal->giro_negocio==0) {

    $tipobien=DB::connection($this->name_bdd)->table('administracion.tipo_bienes_servicios')->select('id')->where('id',$request->input('tipo_bienes_servicios')['id'])->first();
    //si no existe bien servicio
    if (count($tipobien)==0) {
        $last_id_tipobien=DB::connection($this->name_bdd)->table('administracion.tipo_bienes_servicios')
        ->insertGetId(
        [   'id'=>$request->input('tipo_bienes_servicios')['id'],
            'nombre' => $request->input('tipo_bienes_servicios')['nombre'] ,
            'descripcion' => $request->input('tipo_bienes_servicios')['descripcion'] ,
            'estado' => 'A'
        ]
        );
    }else $last_id_tipobien=$tipobien->id;    
    $actividad_economica=DB::connection($this->name_bdd)->table('administracion.actividad_economica')->select('id')->where('id',$request->input('ModelTipo_Tipo_Empresa')['id'])->first();
    //si no existe la actividad economica
    if (count($actividad_economica)==0) {
        $last_id_actividad_economica=DB::connection($this->name_bdd)->table('administracion.actividad_economica')
        ->insertGetId(
      [   'id'=>$request->input('ModelTipo_Tipo_Empresa')['id'],
          'nombre' => $request->input('ModelTipo_Tipo_Empresa')['nombre'] ,
          'descripcion' => $request->input('ModelTipo_Tipo_Empresa')['descripcion'] ,
          'id_tipo_bienes_servicios'=>$last_id_tipobien,
          'estado' => 'A'
        ]);
    }else $last_id_actividad_economica=$actividad_economica->id;   
    //Guardar en NBPRE de Empresa
    $definicion_personal=$request->descripcion;
    $data=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id',$request->sucursal)
    ->update(
        [
            'datos_adiconales' => json_encode(['definicion_personal'=>$definicion_personal]) ,
            'giro_negocio' => $last_id_tipobien ,
            'actividad_economica' => $last_id_actividad_economica
        ]);
    //Guardar en Nextbook
    $empresa_nthbk=DB::connection('nextbookconex')->table('administracion.empresas')->select('id')->where('ruc_ci',$this->user->ruc)->first();
    DB::connection('nextbookconex')->table('administracion.sucursales')
    ->insert(
        [
            'id_sucursal'=>$data_sucursal->id,
            'id_empresa'=>$empresa_nthbk->id,
            'nombre'=>$data_sucursal->nombre,
            'responsable'=>$data_sucursal->responsable,
            'datos_empresariales'=>$data_sucursal->datos_empresariales,
            'localizacion_sucursal'=>$data_sucursal->localizacion_sucursal,
            'datos_adiconales'=>json_encode(['definicion_personal'=>$definicion_personal]),
            'codigo_sri'=>$data_sucursal->codigo_sri,
            'giro_negocio'=>$last_id_tipobien,
            'actividad_economica'=>$last_id_actividad_economica
        ]);
    //Crear bodegas 
    switch ($last_id_tipobien) {
        //PRODUCTOS
        case 1:
            DB::connection($this->name_bdd)->table('inventario.bodegas')
            ->insert(
                [
                    'id_sucursal'=>$data_sucursal->id,
                    'nombre'=>'BODEGA_PRODUCTOS_'.$data_sucursal->codigo_sri,
                    'calle'=>'Sin Definir',
                    'numero'=>'Sin Nro.',
                    'especificaciones'=>'Sin Definir',
                    'estado'=>'A',
                    'giro_negocio'=>1,
                ]);
        break;
        //SERVICIOS
        case 2:
            DB::connection($this->name_bdd)->table('inventario.bodegas')
            ->insert(
                [
                    'id_sucursal'=>$data_sucursal->id,
                    'nombre'=>'BODEGA_SERVICIOS_'.$data_sucursal->codigo_sri,
                    'calle'=>'Sin Definir',
                    'numero'=>'Sin Nro.',
                    'especificaciones'=>'Sin Definir',
                    'estado'=>'A',
                    'giro_negocio'=>2,
                ]);
        break;
        //PRODUCTOS Y SERVICIOS
        case 3:
            DB::connection($this->name_bdd)->table('inventario.bodegas')
            ->insert(
                [
                    'id_sucursal'=>$data_sucursal->id,
                    'nombre'=>'BODEGA_PRODUCTOS_'.$data_sucursal->codigo_sri,
                    'calle'=>'Sin Definir',
                    'numero'=>'Sin Nro.',
                    'especificaciones'=>'Sin Definir',
                    'estado'=>'A',
                    'giro_negocio'=>1,
                ]);
            DB::connection($this->name_bdd)->table('inventario.bodegas')
            ->insert(
                [
                    'id_sucursal'=>$data_sucursal->id,
                    'nombre'=>'BODEGA_SERVICIOS_'.$data_sucursal->codigo_sri,
                    'calle'=>'Sin Definir',
                    'numero'=>'Sin Nro.',
                    'especificaciones'=>'Sin Definir',
                    'estado'=>'A',
                    'giro_negocio'=>2,
                ]);
        break;
    }

    DB::connection($this->name_bdd)->table('inventario.bodegas')
            ->insert(
                [
                    'id_sucursal'=>$data_sucursal->id,
                    'nombre'=>'BODEGA_BIENES_'.$data_sucursal->codigo_sri,
                    'calle'=>'Sin Definir',
                    'numero'=>'Sin Nro.',
                    'especificaciones'=>'Sin Definir',
                    'estado'=>'A',
                    'giro_negocio'=>0,
                ]);
    
}
    
    return response()->json(['respuesta' => true], 200);
    }
}
