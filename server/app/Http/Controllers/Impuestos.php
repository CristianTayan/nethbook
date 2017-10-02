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

class Impuestos extends Controller
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
     public function Existencia_Impuesto(Request $request)
    {
        $existencia=DB::connection($this->name_bdd)->table('contabilidad.impuestos')->where('estado','A')->where('nombre',$request->nombre)->get();
        if (count($existencia)==0) {
            return response()->json(['respuesta' => true], 200);
        }
        return response()->json(['respuesta' => false], 200);
    }

   	public function Add_Impuesto(Request $request)
    {
    DB::connection($this->name_bdd)->table('contabilidad.impuestos')->insert(
    [
     'codigo_sri'=>$request->codigo_sri,
     'nombre'=>$request->nombre,
     'descripcion'=>$request->descripcion,
     'cantidad'=>$request->cantidad,
     'estado' => 'A',
     'ambito'=>$request->ambito,
     'tipo_impuesto'=>$request->tipo_impuesto
     ]);
    return response()->json(['respuesta' => true], 200);
    }

    public function Get_Impuestos(Request $request)
    {
    $currentPage = $request->pagina_actual;
    $limit = $request->limit;
    if ($request->has('filter')&&$request->filter!='') {
        //$data=DB::connection($this->name_bdd)->statement("SELECT * FROM inventario.tipos_categorias WHERE (nombre||descripcion) like '%".$request->input('filter')."%' and estado='A' LIMIT 5");
        $data=DB::connection($this->name_bdd)->table('contabilidad.impuestos')->where('estado','A')
                                                ->where('nombre','LIKE','%'.$request->input('filter').'%')
                                                //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                                                ->orderBy('nombre','ASC')->get();
    }else{
        $data=DB::connection($this->name_bdd)->table('contabilidad.impuestos')->where('estado','A')->orderBy('nombre','ASC')->get();
    }

    foreach ($data as $key => $value) {
        $ambito=DB::connection($this->name_bdd)->table('contabilidad.ambitos_impuestos')->select('id','nombre')->where('id',$value->ambito)->where('estado','A')->first();
        $value->ambito=$ambito;
    }

    $data=$this->funciones->paginarDatos($data,$currentPage,$limit);

    return response()->json(['respuesta' => $data], 200);
    }

    public function Update_Impuesto(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('contabilidad.impuestos')->where('id',$request->id)->update(
        [
         'codigo_sri'=>$request->codigo_sri,
         'nombre'=>$request->nombre,
         'descripcion'=>$request->descripcion,
         'cantidad'=>$request->cantidad,
         'ambito'=>$request->ambito

        ]);
    return response()->json(['respuesta' => true], 200);
    }

    public function Delete_Impuesto(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('contabilidad.impuestos')->where('id',$request->id)->update(['estado'=>'I']);
    return response()->json(['respuesta' => true], 200);
    }

    public function Get_Ambito_Impuestos(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('contabilidad.ambitos_impuestos')->where('estado','A')->get();
    return response()->json(['respuesta' => $data], 200);
    }

    public function Get_Tipo_Impuestos(Request $request)
    {
        $data=DB::connection($this->name_bdd)->table('contabilidad.tipo_impuestos')->where('estado','A')->get();
        return response()->json(['respuesta' => $data], 200);
    }
    
}
