<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//Extras
use DB;
use \Firebase\JWT\JWT;
use Config;
use GuzzleHttp\Client;
// Funciones
use App\libs\Funciones;

class Administracion_Empresa extends Controller

{
  public function __construct(Request $request)

  {
    try
    {
      // Funciones
      $this->funciones = new Funciones();
      $key = config('jwt.secret');
      $decoded = JWT::decode($request->token, $key, array(
        'HS256'
      ));
      $this->user = $decoded;
      $this->name_bdd = $this->user->nbdb;
      // Extras
      $this->client = new Client();
    }
    catch(FirebaseJWTExpiredException $e)
    {
      return response()->json(['respuesta' => $e->getMessage() ], 401);
      die();
    }
  }
  public function Get_Datos_Empresa(Request $request)

  {
    $resultado = DB::connection($this->name_bdd)->table('usuarios')->where('id', '=', $this->user->sub)->first();
    return response()->json(["respuesta" => $resultado->estado_clave], 200);
  }
  public function Get_Establecimientos(Request $request)

  {
    $currentPage = $request->pagina_actual;
    $limit = $request->limit;
    $data = DB::connection($this->name_bdd)->table('administracion.sucursales')->select('id', 'nombre', 'localizacion_sucursal', 'codigo_sri', 'giro_negocio', 'actividad_economica')->where('id_empresa',1)->orderBy('codigo_sri','ASC')->get();
    foreach($data as $key => $value)
    {
      // localizacion
      $value->localizacion_sucursal = json_decode($value->localizacion_sucursal);
      // Giro del Negocio
      $giro_negocio = DB::connection($this->name_bdd)->table('administracion.tipo_bienes_servicios')->select('id', 'nombre', 'descripcion')->where('id', $value->giro_negocio)->first();
      $value->giro_negocio = $giro_negocio;
      // Actividad Economica
      $actividad_economica = DB::connection($this->name_bdd)->table('administracion.actividad_economica')->select('id', 'nombre', 'descripcion')->where('id', $value->actividad_economica)->first();
      $value->actividad_economica = $actividad_economica;
    }
    $data = $this->funciones->paginarDatos($data, $currentPage, $limit);
    return response()->json(['respuesta' => $data], 200);
  }
  public function Get_Tipo_Bienes_Servicios(Request $request)

  {
    $resultado = DB::connection($this->name_bdd)->table('administracion.tipo_bienes_servicios')->select('id', 'nombre', 'descripcion')->where('id', '!=', 0)->get();
    return response()->json(["respuesta" => $resultado], 200);
  }
  public function Update_Password(Request $request)

  {
    $resultado = DB::connection($this->name_bdd)->statement("SELECT * FROM actualiza_clave('" . $this->user->sub . "','" . bcrypt($request->pass) . "')");
    if ($resultado)
    {
      return response()->json(["respuesta" => true], 200);
    }
    else return response()->json(["respuesta" => false], 200);
  }
  public function Update_Informacion_Empresa(Request $request)

  {
    DB::connection($this->name_bdd)->table('public.personas')->where('id', $request->id)->update(['primer_nombre' => $request->primer_nombre, 'segundo_nombre' => $request->segundo_nombre, 'primer_apellido' => $request->primer_apellido, 'segundo_apellido' => $request->segundo_apellido, 'id_localidad' => $request->id_localidad, 'calle' => $request->calle, 'transversal' => $request->transversal, 'numero' => $request->numero]);
    DB::connection($this->name_bdd)->table('public.personas_correo_electronico')->where('correo_electronico', $request->correo_electronico)->update(['correo_electronico' => $request->correo_electronico]);
    DB::connection($this->name_bdd)->table('public.telefonos_personas')->where('numero', $request->numero)->update(['numero' => $request->numero, 'id_operadora_telefonica' => $request->id_operadora_telefonica]);
    return response()->json(["respuesta" => $request->all() ], 200);
  }
}
