<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Empresas;
use App\Sucursales;
use App\Personas;
use App\libs\DatosCedula;
use App\libs\DatosMovil;
use App\libs\getSRI;
use DB;
class datosController extends Controller
{
    public function getDatos(Request $request)
    {
        if ($request->input('tipodocumento') == "RUC") {
            $getsri   = new getsri();
            $datosSri = array_map('utf8_encode', $getsri->consultar_ruc($request->input('nrodocumento')));
            $establecimientos=$getsri->establecimientoSRI($request->input('nrodocumento'));
            // foreach ($establecimientos['adicional'] as $representante) {
            //     print_r($representante);
            // }
            return response()->json(array('datosEmpresa' =>$datosSri,'establecimientos'=>$establecimientos));
        } else {
            $cedulaclass  = new DatosCedula();
            $datospersona = $cedulaclass->consultar_cedula($request->input('nrodocumento'));
            return response()->json(['datosPersona'=>$datospersona]);
        }
    }

    public function estado_fac_electronica(Request $request)
    {
         // $getsri   = new getsri();
         // $getsri->estado_factura_electronica($request->input('clave'));
         // return response()->json(["estado"=>$getsri]);
            //$wsdl = "https://celcer.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantes?wsdl"; // Ambiente Pruebas
            $wsdl = "https://cel.sri.gob.ec/comprobantes-electronicos-ws/AutorizacionComprobantes?wsdl"; // Ambiente Produccion
            $client = new \SoapClient($wsdl, array('encoding'=>'UTF-8'));
            $res = $client->AutorizacionComprobante(array('claveAccesoComprobante'=> $request->input('clave')));
            //print_r($res->RespuestaAutorizacionComprobante);
             return response()->json($res->RespuestaAutorizacionComprobante);
    }

    public function consultar_Movil(Request $request)
    {
            $movilclass  = new DatosMovil(); 
            $resultado=$movilclass->verificar_existencia_movil($request->input('celular')); 
            return response()->json($resultado); 
        
    }

    public function Get_Tipo_Bienes_Servicios(Request $request)
    {   
        $tipos=DB::connection('nethbook')->table('administracion.tipo_bienes_servicios')->where('id','!=',0)->get();
        
        return response()->json(['respuesta'=>$tipos]); 
        
    }
    public function get_localidad_recursiva($padres,$campos){
        foreach ($padres as $row) {
            $hijos=DB::connection('nethbook')->select("SELECT ".$campos." FROM public.localidades WHERE id_padre='".$row->id."' Order BY nombre ASC");
            $row->nodes=$hijos;
            $this->get_localidad_recursiva($row->nodes,$campos);
        }

        return $padres;
        
    }

    public function Get_Localizacion(Request $request)
    {   
        $campos=['id','nombre','codigo','codigo_telefonico'];
        //$padres=DB::connection('nethbook')->table("public.localidades")->select($campos)->where('id_padre','0')->get();
        $padres=DB::connection('nethbook')->select("SELECT ".implode(',', $campos)." FROM public.view_localidades WHERE id_padre='0' Order BY nombre ASC");

        $localizacion=$this->get_localidad_recursiva($padres,implode(',', $campos));
        
        return response()->json(['respuesta'=>$localizacion]); 
        
    }

    public function Get_Tipo_Actividad_Economica(Request $request)
    {   
        $tipos_empresa=DB::connection('nethbook')->table('administracion.actividad_economica')->where('id_tipo_bienes_servicios',$request->id_bienes_servicios)->get();
        
        return response()->json(['respuesta'=>$tipos_empresa]); 
        
    }
}
