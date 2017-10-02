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

class Estado_Descriptivo extends Controller
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

    public function Existencia_Estado_Descriptivo(Request $request)
    {
        $existencia=DB::connection($this->name_bdd)->table('inventario.estado_descriptivo')->where('estado','A')->where('nombre',$request->nombre)->get();
        if (count($existencia)==0) {
            return response()->json(['respuesta' => true], 200);
        }
        return response()->json(['respuesta' => false], 200);
    }

  public function Add_Estado_Descriptivo(Request $request)
    {
    DB::connection($this->name_bdd)->table('inventario.estado_descriptivo')->insert(['nombre' => $request->nombre, 'descripcion' => $request->descripcion, 'estado' => 'A', 'fecha' => Carbon::now()->toDateString()]);
    return response()->json(['respuesta' => true], 200);
    }

    public function Get_Estados_Descriptivos(Request $request)
    {
    $currentPage = $request->pagina_actual;
    $limit = $request->limit;

    if ($request->has('filter')&&$request->filter!='') {
        //$data=DB::connection($this->name_bdd)->statement("SELECT * FROM inventario.tipos_estado_descriptivo WHERE (nombre||descripcion) like '%".$request->input('filter')."%' and estado='A' LIMIT 5");
        $data=DB::connection($this->name_bdd)->table('inventario.estado_descriptivo')
                                                ->where('nombre','LIKE','%'.$request->input('filter').'%')
                                                //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                                                ->where('estado','A')->orderBy('nombre','ASC')->get();
    }else{
        $data=DB::connection($this->name_bdd)->table('inventario.estado_descriptivo')->where('estado','A')->orderBy('nombre','ASC')->get();
    }

    $data=$this->funciones->paginarDatos($data,$currentPage,$limit);
    return response()->json(['respuesta' => $data], 200);
    }

    public function Update_Estado_Descriptivo(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('inventario.estado_descriptivo')->where('id',$request->id)->update(['nombre' => $request->nombre , 'descripcion' => $request->descripcion]);
    return response()->json(['respuesta' => true], 200);
    }

    public function Delete_Estado_Descriptivo(Request $request)
    {
    $data=DB::connection($this->name_bdd)->table('inventario.estado_descriptivo')->where('id',$request->id)->update(['estado'=>'I']);
    return response()->json(['respuesta' => true], 200);
    }
}
