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

class Garantias extends Controller
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
     public function Existencia_Garantia(Request $request)
    {
        $existencia=DB::connection($this->name_bdd)->table('inventario.garantias')->where('estado','A')->where('nombre',$request->nombre)->get();
        if (count($existencia)==0) {
            return response()->json(['respuesta' => true], 200);
        }
        return response()->json(['respuesta' => false], 200);
    }

   	public function Add_Garantia(Request $request)
    {
    DB::connection($this->name_bdd)->table('inventario.garantias')->insert(['nombre' => $request->nombre , 'descripcion' => $request->descripcion ,'tipo_garantia' => $request->tipo_garantia,'duracion' => $request->duracion, 'estado' => 'A', 'fecha' => Carbon::now()->toDateString(),'id_padre' => 0]);
    return response()->json(['respuesta' => true], 200);
    }

    public function Get_Garantias(Request $request)
    {
    $currentPage = $request->pagina_actual;
    $limit = $request->limit;
    if ($request->has('filter')&&$request->filter!='') {
        //$data=DB::connection($this->name_bdd)->statement("SELECT * FROM inventario.tipos_categorias WHERE (nombre||descripcion) like '%".$request->input('filter')."%' and estado='A' LIMIT 5");
        $data=DB::connection($this->name_bdd)->table('inventario.garantias')->where('estado','A')
                                                ->where('nombre','LIKE','%'.$request->input('filter').'%')
                                                //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                                                ->orderBy('nombre','ASC')->get();
    }else{
        $data=DB::connection($this->name_bdd)->table('inventario.garantias')->where('estado','A')->orderBy('nombre','ASC')->get();
    }
    foreach ($data as $key => $value) {
        $garantia=DB::connection($this->name_bdd)->table('inventario.tipos_garantias')->select('id','nombre','descripcion')->where('id',$value->tipo_garantia)->where('estado','A')->first();
        $value->tipo_garantia=$garantia;
    }
    $data=$this->funciones->paginarDatos($data,$currentPage,$limit);

    return response()->json(['respuesta' => $data], 200);
    }

    public function Update_Garantia(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('inventario.garantias')->where('id',$request->id)->update(['nombre' => $request->nombre , 'descripcion' => $request->descripcion ,'tipo_garantia' => $request->tipo_garantia,'duracion' => $request->duracion]);
    return response()->json(['respuesta' => true], 200);
    }

    public function Delete_Garantia(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('inventario.garantias')->where('id',$request->id)->update(['estado'=>'I']);
    return response()->json(['respuesta' => true], 200);
    }
}
