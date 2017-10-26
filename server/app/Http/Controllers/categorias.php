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

class categorias extends Controller

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

    /*function get_last_id($nombre){
        $data=DB::connection($this->name_bdd)->table('inventario.categorias')->where('nombre',$nombre)->first();
        if (count($data)>0) {
            return $data->id;
        }
        return 0;
    }*/

    public function add_categorias($arr)
    {

            foreach ($arr as $row) {
                DB::connection($this->name_bdd)->table('inventario.categorias')->insert([
                    'id'=>$row['id'],
                    'nombre'=>$row['nombre'],
                    'descripcion'=>'',
                    'tipo_categoria'=>$row['tipo_categoria']['id'],
                    'estado'=>'A',
                    'id_padre'=>$row['id_padre']
                    ]);
                $this->add_categorias($row['nodes']);
            }
    } 

    public function get_categorias_array($arr)
    {

            foreach ($arr as $row) {
                $hijos=DB::connection($this->name_bdd)->select("SELECT * FROM public.view_categorias WHERE id_padre='".$row->id."' Order BY nombre ASC");
                
                foreach ($hijos as $key => $value) {
                    $categoria=DB::connection($this->name_bdd)->table('inventario.tipos_categorias')->select('id','nombre','descripcion')->where('id',$value->tipo_categoria)->where('estado','A')->first();
                    $value->tipo_categoria=$categoria;
                    $switch=($value->estado=='I')?false:true;
                    $value->estado_s=$switch;
                    $value->open=false;
                    $value->icon='remove_circle_outline';

                }
                $row->open=true;
                $row->icon='remove_circle_outline';
                $switch=($row->estado=='I')?false:true;
                $row->estado_s=$switch;
                $row->nodes=$hijos;
                $this->get_categorias_array($row->nodes);
            }

            return $arr;
    } 

  public function Add_Categoria_Padre(Request $request)
    {
        /*DB::connection($this->name_bdd)->table('inventario.categorias')->where('id','!=',1)->delete();
        $categorias=$request->categorias;
        $this->add_categorias($categorias);*/

        DB::connection($this->name_bdd)->table('inventario.categorias')->insert([
                    'nombre'=>$request->nombre,
                    'descripcion'=>$request->descripcion,
                    //'tipo_categoria'=>$request->tipo_categoria->id,
                    'estado'=>'A',
                    'id_padre'=>$request->id_padre
                    ]);

        return response()->json(['respuesta' => true], 200);
    }

    public function Add_Categoria_Hijo(Request $request)
    {

        DB::connection($this->name_bdd)->table('inventario.categorias')->insert([
                    'nombre'=>$request->nombre,
                    'descripcion'=>$request->descripcion,
                    'tipo_categoria'=>$request->tipo_categoria,
                    'estado'=>'A',
                    'id_padre'=>$request->id_padre
                    ]);

        return response()->json(['respuesta' => true], 200);
    }

    public function Get_Categorias(Request $request)
    {
        /*$currentPage = $request->pagina_actual;
        $limit = $request->limit;

        if ($request->has('filter')&&$request->filter!='') {
            //$data=DB::connection($this->name_bdd)->statement("SELECT * FROM inventario.tipos_categorias WHERE (nombre||descripcion) like '%".$request->input('filter')."%' and estado='A' LIMIT 5");
            $data=DB::connection($this->name_bdd)->table('inventario.categorias')
                                                    ->where('nombre','LIKE','%'.$request->input('filter').'%')
                                                    //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                                                    ->where('estado','A')->orderBy('nombre','ASC')->get();
        }else{
            $data=DB::connection($this->name_bdd)->select("SELECT * FROM public.view_categorias WHERE estado= 'A' Order BY id ASC");
        }
        foreach ($data as $key => $value) {
            $categoria=DB::connection($this->name_bdd)->table('inventario.tipos_categorias')->select('id','nombre','descripcion')->where('id',$value->tipo_categoria)->where('estado','A')->first();
            $value->tipo_categoria=$categoria;
        }
        $data=$this->funciones->paginarDatos($data,$currentPage,$limit);*/

        if ($request->has('id')) {
            $padres=DB::connection($this->name_bdd)->select("SELECT * FROM public.view_categorias WHERE id_padre='".$request->id."' or id=1 Order BY id ASC");
            $data =$this->get_categorias_array($padres);
            return response()->json(['respuesta' => true,'data'=>$data], 200);
        }

        return response()->json(['respuesta' => false,'error'=>'sin Id padre'], 200);
    }

    public function Get_Categorias_Select(Request $request)
    {

    $padres=DB::connection($this->name_bdd)->select("SELECT * FROM public.view_categorias WHERE id_padre='".$request->id_categoria."' or id='1' Order BY id ASC");
    $data =$this->get_categorias_array($padres);

    return response()->json(['respuesta' => true,'data'=>$data], 200);
    }

    public function Update_Categoria(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('inventario.categorias')->where('id',$request->id)->update(['nombre' => $request->nombre , 'descripcion' => $request->descripcion,'tipo_categoria' => $request->tipo_categoria]);
    return response()->json(['respuesta' => true], 200);
    }

    public function Delete_Categoria(Request $request)
    {
    if ($request->estado=='I') {
        $data=DB::connection($this->name_bdd)->table('inventario.categorias')->where('id',$request->id)->update(['estado'=>'A']);
    }else{
        $data=DB::connection($this->name_bdd)->table('inventario.categorias')->where('id',$request->id)->update(['estado'=>'I']);
    }
    

    return response()->json(['respuesta' => true], 200);
    }

  
  }

