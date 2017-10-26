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

class Reportes extends Controller
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

    public function Get_Totales_Facturas(Request $request)
    {

    $data = DB::connection($this->name_bdd)->select("SELECT nombre,sum(total_gasto)as total FROM 
            contabilidad.tipos_gastos_personales,
            contabilidad.gasto_mes_repositorio,
            contabilidad.repositorio_facturas
            WHERE 
            tipos_gastos_personales.id=gasto_mes_repositorio.id_tipo_gasto and
            repositorio_facturas.id_factura=gasto_mes_repositorio.id_factura and repositorio_facturas.id_sucursal='".$request->codigo_sri."'
            Group By tipos_gastos_personales.nombre");

    /*foreach ($data as $key => $value) {
       //echo $value->suma;
       $value->suma=floatval($value->suma);
    }*/


    return response()->json(['respuesta' => $data], 200);
    }

    public function Get_Totales_Deducibles(Request $request)
    {

    $data=DB::connection($this->name_bdd)->table('contabilidad.tipos_gastos_personales')->select('id','nombre')->where('estado','A')->orderBy('id','ASC')->get();

    foreach ($data as $key => $value) {
        $tipo_cuenta=DB::connection($this->name_bdd)->table('contabilidad.gastos_impuestos_renta_deduccion')->where('cuentas_contables',$value->nombre)->first();
        $suma=DB::connection($this->name_bdd)->table('contabilidad.gastos_impuestos_renta_deduccion')->where('id_tipo_cuenta_contable',$tipo_cuenta->id)->sum('haber');
        $value->total=str_replace('€', '', $suma);
    }

    return response()->json(['respuesta' => $data], 200);
    }

    public function Get_Totales_Deducibles_Mes(Request $request)
    {

        $meses=[
                ['id'=>1,'nombre'=>'Enero'],
                ['id'=>2,'nombre'=>'Febrero'],
                ['id'=>3,'nombre'=>'Marzo'],
                ['id'=>4,'nombre'=>'Abril'],
                ['id'=>5,'nombre'=>'Mayo'],
                ['id'=>6,'nombre'=>'Junio'],
                ['id'=>7,'nombre'=>'Julio'],
                ['id'=>8,'nombre'=>'Agosto'],
                ['id'=>9,'nombre'=>'Septiembre'],
                ['id'=>10,'nombre'=>'Octubre'],
                ['id'=>11,'nombre'=>'Noviembre'],
                ['id'=>12,'nombre'=>'Diciembre']
                ];

        if (!$request->has('mes')) {
            

                foreach ($meses as $key => $value) {
                    $suma=DB::connection($this->name_bdd)->select("SELECT sum(total_gasto) as total
                                                                FROM contabilidad.gasto_mes_repositorio where extract(month from fecha)='".$value['id']."' and extract(year from fecha)=2017;");
                    if ($suma[0]->total==null) {
                        $suma[0]->total=floatval('0.00');
                    }
                    $meses[$key]['total']=$suma[0]->total;
                }
        }else{

            $suma=DB::connection($this->name_bdd)->select("SELECT sum(total_gasto) as total
                                                            FROM contabilidad.gasto_mes_repositorio where extract(month from fecha)='".$request->mes."' and extract(year from fecha)=2017 ;");
            foreach ($meses as $key => $value) {
                if ($request->mes==$value['id']) {
                    if ($suma[0]->total==null) {
                        $suma[0]->total="0.00";
                    }
                    $meses[$key]['total']=$suma[0]->total;
                    break;
                }
            }
                
        }
    
    return response()->json(['respuesta' => $meses], 200);
    }

    public function Get_Nro_Tipos_Documentos(Request $request)
    {

        $data=DB::connection($this->name_bdd)->table('contabilidad.tipo_documentos')->select('id','nombre')->where('estado','A')->orderBy('id','ASC')->get();

        foreach ($data as $key => $value) {
            $nro_tipo_doc=DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas')->where('tipo_doc',$value->id)->where('id_sucursal',$request->sucursal)->get();
            //$suma=DB::connection($this->name_bdd)->table('contabilidad.gastos_impuestos_renta_deduccion')->where('id_tipo_cuenta_contable',$tipo_cuenta->id)->sum('haber');
            $value->cantidad=count($nro_tipo_doc);
        }

        return response()->json(['respuesta' => $data], 200);
    }
}
