<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
// Extras
use DB;
use Carbon\Carbon;
use \Firebase\JWT\JWT;
use Config;
use Mail;
use Hash;
use GuzzleHttp\Client;
// Funciones
use App\libs\Funciones;
class Colaboradores extends Controller
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
            // Extras
            $this->client=new Client();
        }catch (\Firebase\JWT\ExpiredException $e) {
            return response()->json(['respuesta' => $e->getMessage()],401);
            die();
        }        
    }
    public function Existencia_Usuario_Cedula(Request $request)
    {
        $existencia=DB::connection($this->name_bdd)->table('public.personas_documentos_identificacion')->where('estado','A')->where('numero_identificacion',$request->numero_identificacion)->get();
        if (count($existencia)==0) {
            return response()->json(['respuesta' => true], 200);
        }
        return response()->json(['respuesta' => false], 200);
    }
    public function Existencia_Usuario_Correo(Request $request)
    {
        $existencia=DB::connection($this->name_bdd)->table('public.personas_correo_electronico')->where('estado','A')->where('correo_electronico',$request->correo_electronico)->get();
        if (count($existencia)==0) {
            return response()->json(['respuesta' => true], 200);
        }
        return response()->json(['respuesta' => false], 200);
    }
    public function Existencia_Usuario_Nick(Request $request)
    {
        $existencia=DB::connection($this->name_bdd)->table('usuarios.usuarios')->where('estado','A')->where('nick',$request->nick)->get();
        if (count($existencia)==0) {
            return response()->json(['respuesta' => true], 200);
        }
        return response()->json(['respuesta' => false], 200);
    }
    //---------------------------------- FIN VISTAS ------------
    //---------------------------------- ARRAY VISTAS ----------
    //---------------------------------- FIN  VISTAS -----------
    public function Get_Vistas(Request $request)
    {
        $campos=['id',
            'nombre',
            'path',
            'url',
            'id_padre',
            'personalizacion',
            'nivel_arbol',
            'estado'];
        $padres=DB::connection($this->name_bdd)->table('administracion.vistas')->select($campos)->where('estado','A')->where('id_padre',0)->get();
        $array=app(Vistas::class)->Get_Vistas($padres,$this->name_bdd);
       return response()->json(['respuesta' => true,"menu"=>$array], 200); 
    }
    public function Gen_Vistas_Admin(Request $request)
    {   
        //limpiar vistas
        DB::connection($this->name_bdd)->table('administracion.usuarios_privilegios')->delete();
        
        app(Vistas::class)->Add_Vistas(config('vistas.lista'),$this->name_bdd);
       return response()->json(['respuesta' => true], 200); 
    }
    public function Gen_Privilegios_Admin(Request $request)
    {  
       DB::connection($this->name_bdd)->table('administracion.usuarios_privilegios')->delete();
        
       $array=DB::connection($this->name_bdd)->table('administracion.vistas')->get();
       foreach ($array as $key => $value) {
            DB::connection($this->name_bdd)->table('administracion.usuarios_privilegios')->insert([
                'estado'=>'A',
                'id_vista'=>$value->id,
                'id_tipo_usuario'=>1,
                'id_tipo_accion_vistas'=>1
                ]);
       }
       return response()->json(['respuesta' => true], 200); 
    }
    public function Existencia_Colaborador(Request $request)
    {  
        $data=DB::connection($this->name_bdd)->table('public.personas_documentos_identificacion')->select('id_persona','numero_identificacion')->where('numero_identificacion',$request->numero_documento)->first();
        if (count($data)>0) {
            $data_persona=DB::connection($this->name_bdd)->table('public.personas')->where('id',$data->id_persona)->first();

            
            $data_persona->numero_documento=$data->numero_identificacion;
            //Data correo
            $data_correo=DB::connection($this->name_bdd)->table('public.personas_correo_electronico')->select('correo_electronico')->where('id_persona',$data->id_persona)->first();
            if (count($data_correo)>0) {
                $data_persona->correo_electronico=$data_correo->correo_electronico;
            }

echo $data_persona;

            return response()->json(['respuesta' => true,'data'=>$data_persona], 200);
        }else{
            $res = $this->client->request('GET', config('global.appserviciosnext').'/public/index.php/getDatos', ['json' => ['tipodocumento' => 'CEDULA', 'nrodocumento' => $request->numero_documento ]]);
            $respuesta = json_decode($res->getBody()->getContents() , true);
            if ($respuesta['datosPersona']['valid']==true) {
            $datosPersona=$respuesta['datosPersona'];
            $array_name=explode(' ', $datosPersona['name']);
            $array_localidad=explode('/', $datosPersona['residence']);
            $data_localidad=DB::connection('localidadesconex')->select("SELECT id  FROM view_localidades WHERE nombre_bus LIKE '%".$array_localidad[1]."%'");
            $data_persona=[
                            'id_localidad'=>$data_localidad[0]->id,
                            'numero_documento'=>$request->numero_documento,
                            'primer_apellido'=>$array_name[0],
                            'primer_nombre'=>$array_name[2],
                            'segundo_apellido'=>$array_name[1],
                            'segundo_nombre'=>$array_name[3],

                        ];
            return response()->json(['respuesta' => true,'data'=>$data_persona], 200);
            }
            return response()->json(['respuesta' => false,'data'=>''], 200);            
        }
        return response()->json(['respuesta' => false], 200);
    }
    public function Add_Col_Usuario(Request $request)
    {
    // Verificar si ya existe la persona
    $data_persona=DB::connection($this->name_bdd)->table('public.personas_documentos_identificacion')->select('id_persona')->where('numero_identificacion',$request->numero_documento)->first();
    if (count($data_persona)>0) {
        $id_persona=$data_persona->id_persona;
    }

    $pass=$this->funciones->generarPass(8);
    $id_usuario=$this->funciones->generarID();
    //Guardar Usuario
    DB::connection($this->name_bdd)->table('usuarios.usuarios')->insert(
        [
        'id'=>$id_usuario,
        'nick'=>$request->nick.'@'.config('global.dominio'),
        'clave_clave'=>bcrypt($pass),
        'id_estado'=>'A',
        'estado_clave'=>FALSE,
        'id_tipo_usuario'=>$request->id_tipo_usuario
        ]);
    //Guardar Persona si no existe
    if (count($data_persona)==0) {

    $id_persona=DB::connection($this->name_bdd)->table('public.personas')->insertGetId(
    [
     'primer_nombre'=>$request->primer_nombre,
     'segundo_nombre'=>$request->segundo_nombre,
     'primer_apellido'=>$request->primer_apellido,
     'segundo_apellido'=>$request->segundo_apellido,
     'id_localidad'=>$request->id_localidad,
     'calle'=>$request->calle,
     'transversal'=>$request->transversal,
     'numero'=>$request->numero_casa,
    ]);
    //$id_persona=DB::connection($this->name_bdd)->table('public.personas')->select('id')->where('primer_nombre',$request->primer_nombre)->first();
    //Guardar Correo
    DB::connection($this->name_bdd)->table('public.personas_correo_electronico')->insert(
    [
    'id_persona'=>$id_persona,
     'correo_electronico'=>$request->correo_electronico,
     'estado'=>'A'
    ]);    
    // Guardar Documento
    DB::connection($this->name_bdd)->table('public.personas_documentos_identificacion')->insert(
    [
    'id_persona'=>$id_persona,
     'id_tipo_documento'=>1,
     'numero_identificacion'=>$request->numero_documento,
     'estado'=>'A'
    ]);
    /*
    //Guardar Telefono
    DB::connection($this->name_bdd)->table('public.telefonos_personas')->insert(
    [
    'id_persona'=>$id_persona,
     'numero'=>$request->numero_telefono,
     'estado'=>'A',
     'id_operadora_telefonica'=>$request->id_operadora_telefonica
    ]);*/
    }

    //Guardar empleado
    DB::connection($this->name_bdd)->table('talento_humano.empleados')->insert(
    [
    'id_persona'=>$id_persona,
    'id_usuario'=>$id_usuario,
    'estado'=>'A'
    ]);

    // Enviar Correo de Credenciales
    $data = [
                "ruc"=>$this->user->ruc,
                "correo"=>$request->correo_electronico,
                'nombres_apellidos'=>$request->primer_nombre.' '.$request->primer_apellido,
                'user_colaborador'=>$request->nick,
                'pass_colaborador'=>$pass
            ];
    $this->enviar_correo_credenciales($data);

    return response()->json(['respuesta' => true], 200);
    }    

    public function enviar_correo_credenciales($data){
        $correo_enviar=$data['correo'];
        $nombres_apellidos=$data['nombres_apellidos'];
    Mail::send('credenciales_colaborador', $data, function($message)use ($correo_enviar,$nombres_apellidos)
            {
                $message->from("registro@oyefm.com",'Nextbook');
                $message->to($correo_enviar,$nombres_apellidos)->subject('Credenciales de Ingreso');
            });
    }

    public function Get_Col_Usuario(Request $request)
    {
        $currentPage = $request->pagina_actual;
        $limit = $request->limit;
        if ($request->has('filter')&&$request->filter!='') {
            $data=DB::connection($this->name_bdd)->table('usuarios.usuarios')->select('id','nick','id_tipo_usuario')->where('estado','A')
                ->where('label','LIKE','%'.$request->input('filter').'%')
                //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                ->orderBy('label','ASC')->get();
        }else{
            $data=DB::connection($this->name_bdd)->table('usuarios.usuarios')->select('id','nick','id_tipo_usuario')->where('id_estado','A')->orderBy('nick','ASC')->get();
        }
        foreach ($data as $key => $value) {
            $tipo_usuario=DB::connection($this->name_bdd)->table('usuarios.tipo_usuario')->select('nombre')->where('id',$value->id_tipo_usuario)->first();
            $value->tipo_usuario=$tipo_usuario->nombre;

            $empleado=DB::connection($this->name_bdd)->table('talento_humano.empleados')->select('id_persona')->where('id_usuario',$value->id)->first();
            $persona=DB::connection($this->name_bdd)->table('public.personas')->select('primer_nombre','primer_apellido')->where('id',$empleado->id_persona)->first();
            $value->persona=$persona;

        }

        $data=$this->funciones->paginarDatos($data,$currentPage,$limit);
        return response()->json(['respuesta' => $data], 200);
    }

    public function Delete_Col_Usuario(Request $request)
    {
        $data=DB::connection($this->name_bdd)->table('usuarios.usuarios')->where('id',$request->id)->update(['id_estado'=>'I']);
        return response()->json(['respuesta' => true], 200);
    }

    public function Verificar_Pass(Request $request)
    {
        $data=DB::connection($this->name_bdd)->table('usuarios.usuarios')->select('clave_clave')->where('id',$this->user->sub)->first();
        $checkpass=Hash::check($request->pass, $data->clave_clave);

        if ($checkpass) {
            return response()->json(['respuesta' => true], 200);
        }else return response()->json(['respuesta' => false], 200);

    }

    public function Get_Col_Usuario_Update(Request $request)
    {   
        $empleado=DB::connection($this->name_bdd)->table('talento_humano.empleados')->select('id_persona')->where('id_usuario',$request->id)->first();
        if (count($empleado)>0) {
        $usuario=DB::connection($this->name_bdd)->table('usuarios.usuarios')->select('nick')->where('id',$request->id)->first();
        $persona=DB::connection($this->name_bdd)->table('public.personas')->where('id',$empleado->id_persona)->first();
        $correo=DB::connection($this->name_bdd)->table('public.personas_correo_electronico')->where('id_persona',$persona->id)->first();
        $ciudad=DB::connection('localidadesconex')->select("SELECT nombre,id,codigo_telefonico FROM view_localidades WHERE id='".$persona->id_localidad."' and nombre!='ECUADOR' ORDER BY nombre ASC");
        $data_nick=explode('@', $usuario->nick);
        $persona->nick=$data_nick[0];
        $persona->id_user=$request->id;
        $persona->id_localidad=$ciudad[0];
        $persona->correo_electronico=$correo->correo_electronico;
        $persona->id_correo=$correo->id;
        return response()->json(['respuesta' => $persona], 200);
        }
        return response()->json(['respuesta' => false], 200);
        
    }

    public function Update_Col_Usuario(Request $request)
    {
    $pass=$this->funciones->generarPass(8);
    DB::connection($this->name_bdd)->table('usuarios.usuarios')->where('id',$request->id_user)->update(
        [
        'nick'=>$request->nick.'@'.config('global.dominio'),
        //'clave_clave'=>bcrypt($pass),
        'id_tipo_usuario'=>$request->id_tipo_usuario
        ]);
    DB::connection($this->name_bdd)->table('public.personas')->where('id',$request->id)->update(
    [
    'primer_nombre'=>$request->primer_nombre,
     'segundo_nombre'=>$request->segundo_nombre,
     'primer_apellido'=>$request->primer_apellido,
     'segundo_apellido'=>$request->segundo_apellido,
     'id_localidad'=>$request->id_localidad['id'],
     'calle'=>$request->calle,
     'transversal'=>$request->transversal,
     'numero'=>$request->numero_casa,
    ]);
    //Guardar Correo
    DB::connection($this->name_bdd)->table('public.personas_correo_electronico')->where('id',$request->id_correo)->update(
    [
     'correo_electronico'=>$request->correo_electronico
    ]);
    
   /* $data = [
                "correo"=>$request->correo_electronico,
                'nombres_apellidos'=>$request->primer_nombre.' '.$request->primer_apellido,
                'user_colaborador'=>$request->nick,
                'pass_colaborador'=>$pass
            ];
    $this->enviar_correo_credenciales($data);*/

    return response()->json(['respuesta' => true], 200);
    }
    
}
