<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// Funciones
use App\libs\Funciones;
// Extras
use DB;
use Carbon\Carbon;
use \Firebase\JWT\JWT;
use Config;

class Tipos_Categorias extends Controller
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
    public function Existencia_Tipo_Categoria(Request $request)
    {
    $existencia=DB::connection($this->name_bdd)->table('inventario.tipos_categorias')->where('estado','A')->where('nombre',$request->name)->get();
    if (count($existencia)==0) {
        return response()->json(['respuesta' => true], 200);
    }
    return response()->json(['respuesta' => false], 200);
    }

    public function Existencia_Update_Tipo_Categoria(Request $request)
    {
    $existencia=DB::connection($this->name_bdd)->table('inventario.tipos_categorias')->where('id',$request->id)->where('nombre',$request->nombre)->get();
    if (count($existencia)==0) {
        return response()->json(['respuesta' => true], 200);
    }
    return response()->json(['respuesta' => false], 200);
    }

    public function Add_Tipo_Categoria(Request $request)
    {
    $datos=
    DB::connection($this->name_bdd)->table('inventario.tipos_categorias')->insert(
        ['nombre' => $request->name , 'descripcion' => $request->descripcion , 'estado' => 'A', 'fecha' => Carbon::now()->toDateString()]);
    return response()->json(['respuesta' => true], 200);
    }

    public function Get_Tipo_Categorias(Request $request)
    {
    $currentPage = $request->pagina_actual;
    $limit = $request->limit;

    if ($request->has('filter')&&$request->filter!='') {
        //$data=DB::connection($this->name_bdd)->statement("SELECT * FROM inventario.tipos_categorias WHERE (nombre||descripcion) like '%".$request->input('filter')."%' and estado='A' LIMIT 5");
        $data=DB::connection($this->name_bdd)->table('inventario.tipos_categorias')
                                                ->where('nombre','LIKE','%'.$request->input('filter').'%')
                                                //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                                                ->where('estado','A')->orderBy('nombre','ASC')->get();
    }else{
        $data=DB::connection($this->name_bdd)->table('inventario.tipos_categorias')->where('estado','A')->orderBy('id','ASC')->get();
    }

    $data=$this->funciones->paginarDatos($data,$currentPage,$limit);
    return response()->json(['respuesta' => $data], 200);
    }

    public function Update_Tipo_Categorias(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('inventario.tipos_categorias')->where('id',$request->id)->update(['nombre' => $request->nombre , 'descripcion' => $request->descripcion]);
    return response()->json(['respuesta' => true], 200);
    }

    public function Delete_Tipo_Categorias(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('inventario.tipos_categorias')->where('id',$request->id)->update(['estado'=>'I']);
    return response()->json(['respuesta' => true], 200);
    }
}
