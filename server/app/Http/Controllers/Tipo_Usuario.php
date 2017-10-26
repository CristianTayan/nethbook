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

class Tipo_Usuario extends Controller
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

        }
        catch (\Firebase\JWT\ExpiredException $e) {
            return response()->json(['respuesta' => $e->getMessage()],401);
            die();
        }

    }
    
    public function Existencia_Tipo_Usuario(Request $request)
    {
        $existencia=DB::connection($this->name_bdd)->table('usuarios.tipo_usuario')->where('estado','A')->where('nombre',$request->nombre)->get();
        if (count($existencia)==0) {
            return response()->json(['respuesta' => true], 200);
        }
        return response()->json(['respuesta' => false], 200);
    }


   public function Add_Tipo_Usuario(Request $request)
    {
    
    DB::connection($this->name_bdd)->table('usuarios.tipo_usuario')->insert(
        [
         'nombre' => $request->nombre ,
         'descripcion' => $request->descripcion ,
         'estado' => 'A'
         ]);
   // return response()->json(['respuesta' => true], 200);
    $id_tipo_usuario=DB::connection($this->name_bdd)->table('usuarios.tipo_usuario')->select('id')->where('estado','A')->where('nombre',$request->nombre)->first();
    $array=$request->input('vistas');
    //NIVEL 0
    foreach($array as $key => $value)
    {
        //return response()->json(['respuesta' => $value['children']], 200);
    // NIVEL 1
    foreach($value['children'] as $key => $value)
        {
        if (count($value['children']) > 0)
            {
            // NIVEL 2
            foreach($value['children'] as $key => $value)
                {
                if (count($value['children']) > 0)
                    {
                    // NIVEL 3
                    foreach($value['children'] as $key => $value)
                        {
                        if (count($value['children']) > 0)
                            {
                                //FOREACH NIVEL 4
                            }else{
                                DB::connection($this->name_bdd)->table('administracion.usuarios_privilegios')->insert([
                                    'estado'=>'A',
                                    'id_vista'=>$value['id'],
                                    'id_tipo_usuario'=>$id_tipo_usuario->id,
                                    'id_tipo_accion_vistas'=>$value['permisos']['id']
                                    ]);
                            }
                        }
                    }else{
                        DB::connection($this->name_bdd)->table('administracion.usuarios_privilegios')->insert([
                                    'estado'=>'A',
                                    'id_vista'=>$value['id'],
                                    'id_tipo_usuario'=>$id_tipo_usuario->id,
                                    'id_tipo_accion_vistas'=>$value['permisos']['id']
                                    ]);
                    }
                }
            }else{
                DB::connection($this->name_bdd)->table('administracion.usuarios_privilegios')->insert([
                            'estado'=>'A',
                            'id_vista'=>$value['id'],
                            'id_tipo_usuario'=>$id_tipo_usuario->id,
                            'id_tipo_accion_vistas'=>$value['permisos']['id']
                            ]);
            }
        }
    }

    return response()->json(['respuesta' => true], 200);
    }

    public function Get_Tipo_Usuarios(Request $request)
    {
    $currentPage = $request->pagina_actual;
    $limit = $request->limit;
    if ($request->has('filter')&&$request->filter!='') {
        $data=DB::connection($this->name_bdd)->table('usuarios.tipo_usuario')
                                                ->where('nombre','LIKE','%'.$request->input('filter').'%')
                                                //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                                                ->where('estado','A')->orderBy('nombre','ASC')->get();
    }else{
        $data=$data=DB::connection($this->name_bdd)->table('usuarios.tipo_usuario')->where('estado','A')->orderBy('nombre','ASC')->get();
    }
    $data=$this->funciones->paginarDatos($data,$currentPage,$limit);
    return response()->json(['respuesta' => $data], 200);
    }

    public function Update_Tipo_Usuario(Request $request)
    {
    DB::connection($this->name_bdd)->table('usuarios.tipo_usuario')->where('id',$request->id)->update(
        [
         'nombre' => $request->nombre ,
         'descripcion' => $request->descripcion 
         ]);
    DB::connection($this->name_bdd)->table('administracion.usuarios_privilegios')->where('id_tipo_usuario',$request->id)->delete();
   // return response()->json(['respuesta' => true], 200);
    $id_tipo_usuario=DB::connection($this->name_bdd)->table('usuarios.tipo_usuario')->select('id')->where('estado','A')->where('nombre',$request->nombre)->first();
    $array=$request->input('vistas');
    //NIVEL 0
    foreach($array as $key => $value)
    {
        //return response()->json(['respuesta' => $value['children']], 200);
    // NIVEL 1
    foreach($value['children'] as $key => $value)
        {
        if (count($value['children']) > 0)
            {
            // NIVEL 2
            foreach($value['children'] as $key => $value)
                {
                if (count($value['children']) > 0)
                    {
                    // NIVEL 3
                    foreach($value['children'] as $key => $value)
                        {
                        if (count($value['children']) > 0)
                            {
                                //FOREACH NIVEL 4
                            }else{
                                DB::connection($this->name_bdd)->table('administracion.usuarios_privilegios')->insert([
                                    'estado'=>'A',
                                    'id_vista'=>$value['id'],
                                    'id_tipo_usuario'=>$id_tipo_usuario->id,
                                    'id_tipo_accion_vistas'=>$value['permisos']['id']
                                    ]);
                            }
                        }
                    }else{
                        DB::connection($this->name_bdd)->table('administracion.usuarios_privilegios')->insert([
                                    'estado'=>'A',
                                    'id_vista'=>$value['id'],
                                    'id_tipo_usuario'=>$id_tipo_usuario->id,
                                    'id_tipo_accion_vistas'=>$value['permisos']['id']
                                    ]);
                    }
                }
            }else{
                DB::connection($this->name_bdd)->table('administracion.usuarios_privilegios')->insert([
                            'estado'=>'A',
                            'id_vista'=>$value['id'],
                            'id_tipo_usuario'=>$id_tipo_usuario->id,
                            'id_tipo_accion_vistas'=>$value['permisos']['id']
                            ]);
            }
        }
    }
    return response()->json(['respuesta' => true], 200);
    }


    public function Get_Vistas_Loged_User(Request $request)
    {
    $campos=['id',
            'nombre',
            'path',
            'url',
            'id_padre',
            'personalizacion',
            'nivel_arbol',
            'estado'];

    $data_tipo_user=DB::connection($this->name_bdd)->table('usuarios.usuarios')->select('id_tipo_usuario')->where('id_estado','A')->where('id',$this->user->sub)->first();
    $id_tipo_usuario=$data_tipo_user->id_tipo_usuario;

    $padres=DB::connection($this->name_bdd)->table('administracion.vistas')->select($campos)->where('estado','A')->where('id_padre',0)->get();

    $array =app(Vistas::class)->Get_Vistas($padres,$this->name_bdd,$id_tipo_usuario);

    return response()->json(['respuesta' => $array], 200);
    
    }

    public function Get_Vistas_Tip_User_Update(Request $request)
    {
        $campos=['id',
                'nombre',
                'path',
                'url',
                'id_padre',
                'personalizacion',
                'estado'];

        //$data_tipo_user=DB::connection($this->name_bdd)->table('usuarios.usuarios')->select('id_tipo_usuario')->where('id_estado','A')->where('id',$this->user->sub)->first();
        $id_tipo_usuario=$request->id;
        $padres=DB::connection($this->name_bdd)->table('administracion.vistas')->select($campos)->where('estado','A')->where('id_padre',0)->get();
        $array =app(Vistas::class)->get_vistas_col_update($padres,$this->name_bdd,$id_tipo_usuario);

        return response()->json(['respuesta' => $array], 200);
    
    }


    public function Delete_Tipo_Usuario(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('usuarios.tipo_usuario')->where('id',$request->id)->update(['estado'=>'I']);
    return response()->json(['respuesta' => true], 200);
    }

    public function Get_Combinacion_Privilegios(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('administracion.tipo_accion_vista')->where('estado','A')->get();
    return response()->json(['respuesta' => $data], 200);
    }
    
}
