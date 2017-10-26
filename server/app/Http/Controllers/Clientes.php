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

class Clientes extends Controller
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
    
    public function Existencia_Persona(Request $request)
    {
        $existencia=DB::connection($this->name_bdd)->table('public.personas_documentos_identificacion')->where('estado','A')->where('numero_identificacion',$request->di)->get();
        if (count($existencia)==0) {
            return response()->json(['respuesta' => true], 200);
        }
        return response()->json(['respuesta' => false], 200);
    }
   public function Add_Persona(Request $request)
    {
      $persona=DB::connection($this->name_bdd)->table('public.personas_documentos_identificacion')->where('numero_identificacion',$request->numero_documento)->first();

      if (count($persona)>0) {
         return response()->json(['respuesta' => false], 200);
      }
        $id_persona=DB::connection($this->name_bdd)->table('public.personas')->insertGetId(
        [
        'primer_nombre'=>$request->primer_nombre,
         'segundo_nombre'=>$request->segundo_nombre,
         'primer_apellido'=>$request->primer_apellido,
         'segundo_apellido'=>$request->segundo_apellido,
         'id_localidad'=>$request->id_localidad,
         'calle'=>$request->calle,
         'transversal'=>$request->transversal,
         'numero'=>$request->numero_casa
        ]);
        switch (strlen($request->tipo_documento)) {
            case 10:
                $tipo_documento=1;
                break;
            case 13:
                $tipo_documento=2;
                break;
            default:
                $tipo_documento=1;
                break;
        }

        // Guardar Documento
        DB::connection($this->name_bdd)->table('public.personas_documentos_identificacion')->insert(
        [
        'id_persona'=>$id_persona,
         'id_tipo_documento'=>$tipo_documento,
         'numero_identificacion'=>$request->numero_documento,
         'estado'=>'A',
        ]);
        //Guardar Correo
        DB::connection($this->name_bdd)->table('public.personas_correo_electronico')->insert(
        [
        'id_persona'=>$id_persona,
         'correo_electronico'=>$request->correo_electronico,
         'estado'=>'A',
        ]);
        //Guardar Telefono
        DB::connection($this->name_bdd)->table('public.telefonos_personas')->insert(
        [
        'id_persona'=>$id_persona,
         'numero'=>$request->numero_telefono,
         'estado'=>'A',
         'id_operadora_telefonica'=>1
        ]);
        return response()->json(['respuesta' => true], 200);
    }

    
    public function Get_Clientes(Request $request)
    {
      $clientes = DB::connection($this->name_bdd)->table('administracion.clientes')->where('estado', 'A')->orderBy('id', 'ASC')->get();

      if ($request->has('filter') && $request->filter != '')
      {
        $clientes = DB::connection($this->name_bdd)->table('administracion.clientes')->where('estado', 'A')->where('id', 'LIKE', '%' . $request->input('filter') . '%')
      // ->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
      ->orderBy('id', 'ASC')->get();
      }

      foreach ($clientes as $key => $value) {
                  switch ($value->tipo_cliente) {
                    case 1:
                      $data=DB::connection($this->name_bdd)->table('public.personas')->where('id',$value->id_cliente)->first();
                        if (count($data)>0) {
                          $value->nombres_completos=$data->primer_apellido.' '.$data->segundo_apellido.' '.$data->primer_nombre.' '.$data->segundo_nombre;
                          $value->ruc_ci=$value->id;
                          $data_correo=DB::connection($this->name_bdd)->table('public.personas_correo_electronico')->select('correo_electronico')->where('id_persona',$value->id_cliente)->first();
                          $data_telefono=DB::connection($this->name_bdd)->table('public.telefonos_personas')->select('numero')->where('id_persona',$value->id_cliente)->first();
                          $telefono=(count($data_telefono)==0)?'sin-definir':$data_telefono->numero;
                          $correo=(count($data_correo)==0)?'sin-definir':$data_correo->correo_electronico;
                          $value->telefono=$telefono;
                          $value->correo=$correo;
                          $value->direccion=$data->calle.' '.$data->transversal.' '.$data->numero;
                          $value->tipo_cliente='PERSONA';
                        }
                      break;
                      case 2:
                      $data=DB::connection($this->name_bdd)->table('administracion.empresas')->where('id',$value->id_cliente)->first();
                      
                        if (count($data)>0) {
                          $value->ruc_ci=$value->id;
                          $value->nombres_completos=$data->razon_social;
                          $data_contacto=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id_empresa',$data->id)->where('codigo_sri','001')->first();
                          $data_contacto->datos_empresariales=json_decode($data_contacto->datos_empresariales);
                          $data_contacto->localizacion_sucursal=json_decode($data_contacto->localizacion_sucursal);
                          $value->info=$data_contacto;
                          $value->tipo_cliente='EMPRESA';
                        }
                      break;

                  }
                }
      return response()->json(['respuesta' => true,'data'=>$clientes], 200);
    }

    public function Add_Empresa(Request $request)
    {

    $empresa=DB::connection($this->name_bdd)->table('administracion.empresas')->where('ruc_ci',$request->numero_documento)->first();
    if (count($empresa)>0) {
        return response()->json(['respuesta' => false], 200);
    }
    // Guardar Empresa
    $id_empresa=DB::connection($this->name_bdd)->table('administracion.empresas')->insertGetId(
                    [
                        'razon_social'=>$request->datosEmpresa['razon_social'],
                        'actividad_economica'=>$request->datosEmpresa['actividad_economica'],
                        'ruc_ci'=>$request->numero_documento,
                        'nombre_comercial'=>$request->datosEmpresa['nombre_comercial'],
                        'tipo_persona'=>'',
                        'id_estado'=>'A',
                        'tipo_empresa'=>1
                    ]);
    //Guardar Persona
    $persona=$request->establecimientos['adicional'];
    $id_persona=DB::connection($this->name_bdd)->table('public.personas_documentos_identificacion')->where('numero_identificacion',$persona['cedula'])->first();
    if (count($id_persona)==0) {
    $nombres_completos=explode(' ', $persona['representante_legal']);
    $id_persona=DB::connection($this->name_bdd)->table('public.personas')->insertGetId(
        [
        'primer_nombre'=>$nombres_completos[2],
         'segundo_nombre'=>$nombres_completos[3],
         'primer_apellido'=>$nombres_completos[0],
         'segundo_apellido'=>$nombres_completos[1],
         'id_localidad'=>$request->id_localidad,
         'calle'=>'Sin Definir',
         'transversal'=>'Sin Definir',
         'numero'=>'Sin Definir'
        ]);
    // Guardar Documento
        switch (strlen($persona['cedula'])) {
                case 10:
                    $tipo_documento=1;
                    break;
                case 13:
                    $tipo_documento=2;
                    break;
                default:
                    $tipo_documento=1;
                    break;
            }
        DB::connection($this->name_bdd)->table('public.personas_documentos_identificacion')->insert(
        [
        'id_persona'=>$id_persona,
         'id_tipo_documento'=>$tipo_documento,
         'numero_identificacion'=>substr($persona['cedula'],0,strlen($persona['cedula'])-3),
         'estado'=>'A',
        ]);
        // Registrar Sucursales
        $sucursales=$request->establecimientos['sucursal'];
        foreach ($sucursales as $key => $value) {

              $direccion=explode('/', $value['direccion']);
              $direccion[0]=preg_replace('/(\v|\s)+/', '',$direccion[0]);
              $localizacion=DB::connection('nextbookconex')->select("SELECT id FROM public.view_localidades WHERE nombre= '".str_replace(' ', '', $direccion[1])."'");
              
              $localizacion_sucursal=["direccion"=>$direccion[0].'/'.$direccion[1].'/'.$direccion[2]];
              $datos_empresariales=['telefono'=>$request->numero_casa,'telefono1'=>$request->numero_telefono,'correo'=>$request->correo_electronico,'celular'=>$request->celular];
              DB::connection($this->name_bdd)->table('administracion.sucursales')->insert([
              'nombre'=>$value['nombre_sucursal'],
              'responsable'=>$id_persona,
              'datos_empresariales'=>json_encode($datos_empresariales),
              'localizacion_sucursal'=>json_encode($localizacion_sucursal),
              'codigo_sri'=>$value['codigo'],
              'id_empresa'=>$id_empresa
              ]);
            }
    }else{
        $sucursales=$request->establecimientos['sucursal'];
        ///$id_persona=DB::connection($this->name_bdd)->table('public.personas_documentos_identificacion')->where('numero_identificacion',$persona['cedula'])->first();
        $persona_data=DB::connection($this->name_bdd)->table('public.personas')->where('id',$id_persona->id)->first();
        foreach ($sucursales as $key => $value) {

          $direccion=explode('/', $value['direccion']);
          $direccion[0]=preg_replace('/(\v|\s)+/', '',$direccion[0]);
          $localizacion=DB::connection('nextbookconex')->select("SELECT id FROM public.view_localidades WHERE nombre= '".str_replace(' ', '', $direccion[1])."'");
          
          $localizacion_sucursal=["direccion"=>$direccion[0].'/'.$direccion[1].'/'.$direccion[2]];
          $datos_empresariales=['telefono'=>$request->numero_casa,'telefono1'=>$request->numero_telefono,'correo'=>$request->correo_electronico,'celular'=>$request->celular];
          DB::connection($this->name_bdd)->table('administracion.sucursales')->insert([
          'nombre'=>$value['nombre_sucursal'],
          'responsable'=>$persona_data->id,
          'datos_empresariales'=>json_encode($datos_empresariales),
          'localizacion_sucursal'=>json_encode($localizacion_sucursal),
          'codigo_sri'=>$value['codigo'],
          'id_empresa'=>$id_empresa
          ]);
        }
    }
    
    

    return response()->json(['respuesta' => true], 200);
    }

    public function Get_Personas(Request $request)
    {
    $currentPage = $request->pagina_actual;
    $limit = $request->limit;
    if ($request->has('filter')&&$request->filter!='') {
        $data=DB::connection($this->name_bdd)->table('public.personas')
                                                ->where('nombre','LIKE','%'.$request->input('filter').'%')
                                                //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                                                ->where('estado','A')->orderBy('nombre','ASC')->get();
    }else{
        $data=$data=DB::connection($this->name_bdd)->table('public.personas')->where('estado','A')->orderBy('nombre','ASC')->get();
    }
    $data=$this->funciones->paginarDatos($data,$currentPage,$limit);
    return response()->json(['respuesta' => $data], 200);
    }

    public function Update_Persona(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('public.personas')->where('id',$request->id)->update(['tipo_catalogo' => $request->tipo_catalogo , 'producto' => $request->producto]);
    return response()->json(['respuesta' => true], 200);
    }

    public function Delete_Persona(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('public.personas')->where('id',$request->id)->update(['estado'=>'P']);
    return response()->json(['respuesta' => true], 200);
    }

    public function Get_Operadoras(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('public.operadoras_telefonicas')->select('id',
                                                                                                'nombre',
                                                                                                'descripcion')
                                                                                       ->where('estado','A')->orderBy('nombre','ASC')->get();
    return response()->json(['respuesta' => $data], 200);
    }

    public function Get_Documentos_Identificacion(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('public.tipo_documento_identificacion')->select('id',
                                                                                                'nombre',
                                                                                                'descripcion')
                                                                                       ->where('estado','A')->orderBy('nombre','ASC')->get();
    return response()->json(['respuesta' => $data], 200);
    }


    public function Get_Cliente_By_Ruc_Ci(Request $request)
    {


        $resultados=DB::connection($this->name_bdd)->table('administracion.clientes')->select('id','id_cliente','tipo_cliente')->where('estado','A')->where('id','LIKE','%'.$request->ruc_ci.'%')->get();
                
                foreach ($resultados as $key => $value) {
                  
                  switch ($value->tipo_cliente) {
                    case 1:
                      $data=DB::connection($this->name_bdd)->table('public.personas')->where('id',$value->id_cliente)->first();
                        if (count($data)>0) {
                          $value->nombres_completos=$data->primer_apellido.' '.$data->segundo_apellido.' '.$data->primer_nombre.' '.$data->segundo_nombre;
                          $value->ruc_ci=$value->id;
                          $data_correo=DB::connection($this->name_bdd)->table('public.personas_correo_electronico')->select('correo_electronico')->where('id_persona',$value->id_cliente)->first();
                          $data_telefono=DB::connection($this->name_bdd)->table('public.telefonos_personas')->select('numero')->where('id_persona',$value->id_cliente)->first();
                          $telefono=(count($data_telefono)==0)?'sin-definir':$data_telefono->numero;
                          $correo=(count($data_correo)==0)?'sin-definir':$data_correo->correo_electronico;
                          $value->telefono=$telefono;
                          $value->correo=$correo;
                          $value->direccion=$data->calle.' '.$data->transversal.' '.$data->numero;
                          $value->tipo_doc='CEDULA';
                        }
                      break;
                      case 2:
                      $data=DB::connection($this->name_bdd)->table('administracion.empresas')->where('id',$value->id_cliente)->first();
                      
                        if (count($data)>0) {
                          $value->nombres_completos=$data->razon_social;
                          $data_contacto=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id_empresa',$data->id)->where('codigo_sri','001')->first();
                          $data_contacto->datos_empresariales=json_decode($data_contacto->datos_empresariales);
                          $data_contacto->localizacion_sucursal=json_decode($data_contacto->localizacion_sucursal);
                          $value->info=$data_contacto;
                          $value->tipo_doc='RUC';
                        }
                      break;

                  }

                    
                    
                    /*$data_telefono=DB::connection($this->name_bdd)->table('public.telefonos_personas')->select('numero')->where('id_persona',$data->id)->first();
                    */
                }
                /*if (count($data)>0) {
                    
                    return response()->json(['respuesta' => true,'datos'=>$data], 200);
                }else*/ 
                return response()->json(['respuesta' => $resultados], 200);

        /*
        switch (strlen($request->ruc_ci)) {
            // Buscar Personas
            case 10:
                $data=DB::connection($this->name_bdd)->table('public.personas_documentos_identificacion')->select('id_persona')->where('estado','A')->where('numero_identificacion','LIKE',$request->ruc_ci)->first();
                if (count($data)>0) {
                    $data=DB::connection($this->name_bdd)->table('public.personas')->where('id',$data->id_persona)->first();
                    $data_telefono=DB::connection($this->name_bdd)->table('public.telefonos_personas')->select('numero')->where('id_persona',$data->id)->first();
                    $data_correo=DB::connection($this->name_bdd)->table('public.personas_correo_electronico')->select('correo_electronico')->where('id_persona',$data->id)->first();
                    $data->telefono=$data_telefono->numero;
                    $data->correo=$data_correo->correo_electronico;
                    $data->ruc_ci=$request->ruc_ci;
                    $data->tipo_doc='CEDULA';
                    return response()->json(['respuesta' => true,'datos'=>$data], 200);
                }else return response()->json(['respuesta' => false], 200);
                break;
            // Buscar empresas
            case 13:
            $data=DB::connection($this->name_bdd)->table('administracion.empresas')->where('id_estado','A')->where('ruc_ci',$request->ruc_ci)->first();
        
            if (count($data)>0) {
                $data_contacto=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id_empresa',$data->id)->where('codigo_sri','001')->first();
                $data_contacto->datos_empresariales=json_decode($data_contacto->datos_empresariales);
                $data_contacto->localizacion_sucursal=json_decode($data_contacto->localizacion_sucursal);
                $data->info=$data_contacto;
                $data->tipo_doc='RUC';
                return response()->json(['respuesta' => true,'datos'=>$data], 200);
            }else return response()->json(['respuesta' => false], 200);
                break;
        }*/

        return response()->json(['respuesta' => false], 200);
        
    }
}
