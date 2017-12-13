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

    public function addSucursalActividadEconomica(Request $request){
      $dataActividadEconomica=DB::connection($this->name_bdd)->table('administracion.sucursal_actividad_economica_tbl')->where('id_sucursal',$request->idSucursal)->where('id_actividad_economica',$request->idActividadEconomica)->first();
      if ($dataActividadEconomica === null) {
        $data = DB::connection($this->name_bdd)->table('administracion.sucursal_actividad_economica_tbl')
          ->insert(
          [
           'id_sucursal' => $request->idSucursal,
           'id_actividad_economica' => $request->idActividadEconomica,
           'estado' => 'A' 
          ]
          );
          return response()->json(['respuesta' => $data], 200);
      }
          return response()->json(['respuesta' => false], 200);

    }
    public function getSucursalActividadEconomica(Request $request){
      $datos = ['nombre','descripcion'];

      $resTipoBien=DB::connection($this->name_bdd)
        ->select("
        SELECT  actividad_economica.nombre, actividad_economica.descripcion
        FROM administracion.sucursal_actividad_economica_tbl, administracion.actividad_economica
        WHERE sucursal_actividad_economica_tbl.id_actividad_economica = actividad_economica.id AND
              sucursal_actividad_economica_tbl.id_sucursal = ".$request->idSucursal);
      return response()->json(['respuesta' => $resTipoBien], 200);

    }

     public function addInformacionSucursal(Request $request) {
    $data_sucursal=DB::connection($this->name_bdd)->table('administracion.informacion_empresa_tbl')->where('id_sucursal',$request->idSucursal)->first();
      if ($data_sucursal === null) { 
      $data=DB::connection($this->name_bdd)->table('administracion.informacion_empresa_tbl')
        ->insert(
          [
              'id_empresa'=>1,
              'id_tipo_empresa'=>1,
              'id_sucursal'=>$request->idSucursal,
              'mision'=>$request->mision,
              'vision'=>$request->vision,
              'slogan'=>$request->slogan,
              'telefonos'=>json_encode($request->telefonos),
              'correos'=>json_encode($request->correos),
              'valores_institucionales'=>json_encode($request->valores),
              'estado'=>'A'
              
          ]);
            return response()->json(['respuesta' => $data], 200);
      }
      if ($data_sucursal){
      $data=DB::connection($this->name_bdd)->table('administracion.informacion_empresa_tbl')->where('id_sucursal',$request->idSucursal)
        ->update(
          [
              'mision'=>$request->mision,
              'vision'=>$request->vision,
              'slogan'=>$request->slogan,
              'telefonos'=>json_encode($request->telefonos),
              'correos'=>json_encode($request->correos),
              'valores_institucionales'=>json_encode($request->valores),
              'fecha_ultimo_cambio' => Carbon::now()->toDateTimeString()
              
          ]);
            return response()->json(['respuesta' => true], 200);
    }
    return response()->json(['respuesta' => false], 200);
  }
  public function getDatosAdicionalesSucursal(Request $request)
 {
    $data_empresa=DB::connection($this->name_bdd)->table('administracion.informacion_empresa_tbl')->where('id_sucursal',$request->idSucursal)->first();
    $datos_empresa = array('mision' => $data_empresa->mision, 'vision' => $data_empresa->vision,'slogan' => $data_empresa->slogan);
    $valores = $data_empresa->valores_institucionales;
    $correos= $data_empresa->correos;
    $telefonos = $data_empresa->telefonos;
    $telef = json_decode($telefonos);
    $correo = json_decode($correos);
    return response()->json(['datos' => $datos_empresa,'valores' => $valores,'correos'=>$correo, 'telefonos'=>$telef], 200);
 }
  

      public function UpdateAddSucursal(Request $request) {
      $data_sucursal=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id',$request->idSucursal)->first();
      if ($data_sucursal) { 
        $data=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id',$request->idSucursal)
    ->update(
        [
            'datos_adiconales' => json_encode($request->valores)
        ]);
        return response()->json(['respuesta' => true], 200);
      }
      if (!$data_sucursal) {
         echo("Sucursal No Encontrada");
      }
    }

    public function updateGiroNegocio(Request $request) {
        // $x = 1;
      $data_sucursal=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id',$request->idSucursal)->first();
        // $data_sucursal=DB::connection('comercial_h_1090084247001')->table('administracion.sucursales')->where('id',$x)->first();
      if ($data_sucursal) { 
        $data=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id',$request->idSucursal)
        // $data=DB::connection('comercial_h_1090084247001')->table('administracion.sucursales')->where('id',$x)
    ->update(
        [
            'giro_negocio'=>$request->id

        ]);
        return response()->json(['respuesta' => true], 200);
      }
      if (!$data_sucursal) {
         echo("Sucursal No Encontrada");
      }
    }


    public function getDatosAdicionales(Request $request)
 {
   // $x = 1;
     $data_sucursal=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id',$request->idSucursal)->first();
    $datosAdicionales = $data_sucursal->datos_adiconales;
   return response()->json(['respuesta' => json_decode($datosAdicionales)], 200);
 }
   public function getGiroNegocio(Request $request)
 {
   // $x = 1;
     $data_sucursal=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id',$request->idSucursal)->first();
    $giroNegocio = $data_sucursal->giro_negocio;
   return response()->json(['respuesta' => json_decode($giroNegocio)], 200);
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
