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
class Productos extends Controller
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

    public function Existencia_Producto(Request $request)
    {
        $existencia=DB::connection($this->name_bdd)->table('inventario.productos')->where('nombre_corto',$request->nombre)->get();
        if (count($existencia)==0) {
            return response()->json(['respuesta' => true], 200);
        }
        return response()->json(['respuesta' => false], 200);
    }

    public function Add_Producto(Request $request)
    {
        $limit_cat=count($request->categoria);
        $categoria=$request->categoria[$limit_cat-1];

    DB::connection($this->name_bdd)->table('inventario.productos')->insert([
    	'nombre_corto'=>$request->nombre_corto,
		'vendible'=>$request->vendible,
		'comprable'=>$request->comprable,
		'precio'=>$request->precio,
		'costo'=>$request->costo,
		'estado_descriptivo'=>$request->estado_descriptivo,
		'categoria'=>$categoria['id'],
		'garantia'=>$request->garantia,
		'marca'=>$request->marca,
		'modelo'=>$request->modelo,
		'ubicacion'=>$request->ubicacion,
		'cantidad'=>$request->cantidad,
		'descripcion'=>$request->descripcion,
		'codigo_baras'=>$request->codigo_baras,
        'tipo_consumo'=>$request->tipo_consumo
    	]);
    $last_id=DB::connection($this->name_bdd)->table('inventario.productos')->select('id')->where('nombre_corto',$request->nombre_corto)->first();

    foreach ($request->impuestos as $key => $value) {
        DB::connection($this->name_bdd)->table('inventario.productos_impuestos')->insert([
        'producto'=>$last_id->id,
        'impuesto'=>$value['id']
        ]);
    }

    return response()->json(['respuesta' => true], 200);
    }

    public function Get_Productos(Request $request)
    {
    $currentPage = $request->pagina_actual;
    $limit = $request->limit;
    $campos=[
        'nombre_corto',
        'precio',
        'costo',
        'estado_descriptivo',
        'categoria',
        'garantia',
        'marca',
        'modelo',
        'ubicacion',
        'cantidad',
        'descripcion',
        'codigo_baras',
        'tipo_consumo'
    ];
    if ($request->has('filter')&&$request->filter!='') {
        //$data=DB::connection($this->name_bdd)->statement("SELECT * FROM inventario.tipos_categorias WHERE (nombre||descripcion) like '%".$request->input('filter')."%' and estado='A' LIMIT 5");
        $data=DB::connection($this->name_bdd)->table('inventario.productos')->select($campos)
                                                ->where('nombre_corto','LIKE','%'.$request->input('filter').'%')
                                                //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                                                ->where('comprable',true)->orderBy('nombre_corto','ASC')->get();
                
    }else{
        $data=DB::connection($this->name_bdd)->table('inventario.productos')->select($campos)->where('comprable',true)->orderBy('nombre_corto','ASC')->get();
    }
    foreach ($data as $key => $value) {
        //Get Categoria
        $categoria=DB::connection($this->name_bdd)->table('inventario.categorias')->select('nombre')->where('id',$value->categoria)->where('estado','A')->first();
        $value->categoria=$categoria->nombre;
        //Get Garantia
        $garantia=DB::connection($this->name_bdd)->table('inventario.garantias')->select('nombre')->where('id',$value->garantia)->where('estado','A')->first();
        $value->garantia=$garantia->nombre;
        //Get Marca
        $marca=DB::connection($this->name_bdd)->table('inventario.marcas')->select('nombre')->where('id',$value->marca)->where('estado','A')->first();
        $value->marca=$marca->nombre;
        //Get Modelo
        $modelo=DB::connection($this->name_bdd)->table('inventario.modelos')->select('nombre')->where('id',$value->modelo)->where('estado','A')->first();
        $value->modelo=$modelo->nombre;
        //Get Ubicacion
        $ubicacion=DB::connection($this->name_bdd)->table('inventario.ubicaciones')->select('nombre')->where('id',$value->ubicacion)->where('estado','A')->first();
        $value->ubicacion=$ubicacion->nombre;
    }
    $data=$this->funciones->paginarDatos($data,$currentPage,$limit);
    return response()->json(['respuesta' => $data], 200);
    }

    public function Get_Bienes(Request $request)
    {
    $currentPage = $request->pagina_actual;
    $limit = $request->limit;
    $campos=[
        'nombre_corto',
        'precio',
        'costo',
        'estado_descriptivo',
        'categoria',
        'garantia',
        'marca',
        'modelo',
        'ubicacion',
        'cantidad',
        'descripcion',
        'codigo_baras',
        'tipo_consumo'
    ];
    if ($request->has('filter')&&$request->filter!='') {
        //$data=DB::connection($this->name_bdd)->statement("SELECT * FROM inventario.tipos_categorias WHERE (nombre||descripcion) like '%".$request->input('filter')."%' and estado='A' LIMIT 5");
        $data=DB::connection($this->name_bdd)->table('inventario.productos')->select($campos)
                                                ->where('nombre_corto','LIKE','%'.$request->input('filter').'%')
                                                //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                                                ->where('vendible',true)->orderBy('nombre_corto','ASC')->get();
    }else{
        $data=DB::connection($this->name_bdd)->table('inventario.productos')->select($campos)->where('vendible',true)->orderBy('nombre_corto','ASC')->get();
    }
    foreach ($data as $key => $value) {
        //Get Categoria
        $categoria=DB::connection($this->name_bdd)->table('inventario.categorias')->select('nombre')->where('id',$value->categoria)->where('estado','A')->first();
        $value->categoria=$categoria->nombre;
        //Get Garantia
        $garantia=DB::connection($this->name_bdd)->table('inventario.garantias')->select('nombre')->where('id',$value->garantia)->where('estado','A')->first();
        $value->garantia=$garantia->nombre;
        //Get Marca
        $marca=DB::connection($this->name_bdd)->table('inventario.marcas')->select('nombre')->where('id',$value->marca)->where('estado','A')->first();
        $value->marca=$marca->nombre;
        //Get Modelo
        $modelo=DB::connection($this->name_bdd)->table('inventario.modelos')->select('nombre')->where('id',$value->modelo)->where('estado','A')->first();
        $value->modelo=$modelo->nombre;
        //Get Ubicacion
        $ubicacion=DB::connection($this->name_bdd)->table('inventario.ubicaciones')->select('nombre')->where('id',$value->ubicacion)->where('estado','A')->first();
        $value->ubicacion=$ubicacion->nombre;
    }
    $data=$this->funciones->paginarDatos($data,$currentPage,$limit);
    return response()->json(['respuesta' => $data], 200);
    }
}
