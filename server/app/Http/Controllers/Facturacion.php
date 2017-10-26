<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// Extras
use DB;
use Carbon\Carbon;
use \Firebase\JWT\JWT;
use Config;
use File;
// Funciones
use App\libs\Funciones;

class Facturacion extends Controller
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
     public function Get_Empleado_By_Ruc_Ci(Request $request)
    {
        $existencia=DB::connection($this->name_bdd)->table('talento_humano.empleados_personas')->where("numero_identificacion",$request->ruc_ci)->first();
        if (count($existencia)>0) {
            return response()->json(['respuesta' => true,'empleado'=>$existencia], 200);
        }
        return response()->json(['respuesta' => false], 200);
    }

   	public function Add_Caja(Request $request)
    {
        DB::connection($this->name_bdd)->table('ventas.caja')->insert([
            'nombre'=>$request->nombre_caja,
            'id_sucursal'=>$request->id_sucursal,
            'inicio_numero_factura'=>$request->inicio_numeracion,
            'numero_fin_factura'=>$request->fin_numeracion,
            'estado'=>'A'
            ]);
        return response()->json(['respuesta' => true], 200);
    }

    public function Asignar_Caja_Empleado(Request $request)
    {
    
    return response()->json(['respuesta' => $request->all()], 200);
    }

    public function Get_Cajas(Request $request)
    {
        $currentPage = $request->pagina_actual;
        $limit = $request->limit;
        if ($request->has('filter')&&$request->filter!='') {
            //$data=DB::connection($this->name_bdd)->statement("SELECT * FROM inventario.tipos_categorias WHERE (nombre||descripcion) like '%".$request->input('filter')."%' and estado='A' LIMIT 5");
            $data=DB::connection($this->name_bdd)->table('ventas.caja')->where('estado','A')
                                                    ->where('nombre','LIKE','%'.$request->input('filter').'%')
                                                    //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                                                    ->orderBy('nombre','ASC')->get();
        }else{
            $data=DB::connection($this->name_bdd)->table('ventas.caja')->where('estado','A')->orderBy('nombre','ASC')->get();
        }
        
        $data=$this->funciones->paginarDatos($data,$currentPage,$limit);

        return response()->json(['respuesta' => $data], 200);
    }

    public function Get_Formas_Pagos(Request $request)
    {
        
        $data=DB::connection($this->name_bdd)->table('ventas.formas_pago')->select('id','nombre','codigo_sri','descripcion')->where('estado','A')->orderBy('nombre','ASC')->get();

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

    public function Buscar_Productos_Facturacion(Request $request)
    {
    
        $currentPage = $request->pagina_actual;
        $limit = $request->limit;
        $campos=[
            'id',
            'nombre_corto',
            'precio',
            'costo',
            'estado_descriptivo',
            'cantidad',
            'descripcion',
            'codigo_baras',
            'tipo_consumo'
        ];
        if ($request->has('filter')&&$request->filter!='') {
            $data=DB::connection($this->name_bdd)->select("SELECT ".implode($campos, ',')." FROM inventario.productos WHERE lower(nombre_corto) LIKE '%".$request->input('filter')."%'");
                    
        }else{
            $data=DB::connection($this->name_bdd)->table('inventario.productos')->select($campos)->where('comprable',true)->orderBy('nombre_corto','ASC')->get();
        }
        foreach ($data as $key => $value) {
            //Get Impuestos
            $impuestos=DB::connection($this->name_bdd)->table('inventario.productos_impuestos')->select('impuesto')->where('producto',$value->id)->get();
            foreach ($impuestos as $key => $impuesto_prod) {
                $impuestos[$key]=DB::connection($this->name_bdd)->table('contabilidad.impuestos')->select('id','nombre','cantidad')->where('id',$impuesto_prod->impuesto)->first();
            }
            $value->impuestos=$impuestos;
        }
        $data=$this->funciones->paginarDatos($data,$currentPage,$limit);
        return response()->json(['respuesta' => $data], 200);
    }

    public function Add_Factura(Request $request)
    {
        $empresa=DB::connection($this->name_bdd)->table('administracion.empresas')->select('id')->where('ruc_ci',$this->user->ruc)->where('id_estado','A')->first();
        
        if (count($empresa)==0) {
            return response()->json(['respuesta' => false], 200);
        }
        $matriz_data=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('codigo_sri','001')->where('id_empresa',$empresa->id)->first();
        $direccion_matriz=json_decode($matriz_data->localizacion_sucursal);

        $numero_factura=rand();
        switch ($request->cliente['tipo_doc']) {
          case 'RUC':
            $idcliente=$request->cliente['id'];
            break;
            case 'CEDULA':
            $idcliente=$request->cliente['ruc_ci'];
            break;
        }
       $id_facura= DB::connection($this->name_bdd)->table('ventas.facturas')->insertGetId([
               'numero_factura'=>$numero_factura,
               'numero_autorizacion'=>1,
               'ruc_emisor'=>$request->empresa['ruc_ci'],
               'denominacion'=>'',
               'direccion_matriz'=>$direccion_matriz->direccion,
               'direccion_sucursal'=>$request->sucursal['localizacion_sucursal']['direccion'],
               'fecha_autorizacion'=>Carbon::now()->toDateString(),
               'id_cliente'=>$idcliente,
               'fecha_emicion'=>Carbon::now()->toDateString(),
               'guia_remision'=>'',
               'fecha_caducidad_factura'=>Carbon::now()->toDateString(),
               'datos_imprenta'=>'',
               'subtotal_iva'=>$request->totales['subtotal_14'],
               'subtotal_sin_iva'=>$request->totales['subtotal_0'],
               'descuentos'=>$request->totales['descuentos'],
               'valor_iva'=>$request->totales['iva_14'],
               'ice'=>0,
               'total'=>$request->totales['total_pagar'],
               'estado'=>'A'
            ]);
        
        foreach ($request->detalles as $key => $value) {
            DB::connection($this->name_bdd)->table('ventas.detalle_factura')->insert([
                    'id_factura'=>$id_facura,
                    'id_producto'=>$value['id'],
                    'precio_venta'=>$value['precio'],
                    'cantidad'=>$value['cantidad'],
                    'descuento'=>0,
                    'subtotal_item'=>$value['total_fac']
                ]);
        }     

        DB::connection($this->name_bdd)->table('ventas.formas_pago_facturas')->insert([
                    'id_factura'=>$id_facura,
                    'id_formas_pago'=>$request->pago['id']
                ]);
        // Generar Comprobante
        $cliente=$request->cliente;
        $cliente['ruc_ci']=$idcliente;
        $data_comprobante=['comprobante'=>[
                                           'numero_factura'=>$numero_factura,
                                           'numero_autorizacion'=>1,
                                           'empresa'=>$request->empresa,
                                           'denominacion'=>'',
                                           'direccion_matriz'=>$direccion_matriz->direccion,
                                           'direccion_sucursal'=>$request->sucursal['localizacion_sucursal']['direccion'],
                                           'fecha_autorizacion'=>Carbon::now()->toDateString(),
                                           'cliente'=>$cliente,
                                           'fecha_emicion'=>Carbon::now()->toDateString(),
                                           'guia_remision'=>'',
                                           'fecha_caducidad_factura'=>Carbon::now()->toDateString(),
                                           'datos_imprenta'=>'',
                                           'subtotal_iva'=>$request->totales['subtotal_14'],
                                           'subtotal_sin_iva'=>$request->totales['subtotal_0'],
                                           'descuentos'=>$request->totales['descuentos'],
                                           'valor_iva'=>$request->totales['iva_14'],
                                           'ice'=>0,
                                           'total'=>$request->totales['total_pagar'],
                                           'subtotal'=>$request->totales['subtotal']
                                            ],
                           'detalles'=>$request->detalles,
                           'pago'=>$request->pago
                        ];
        $url=$this->Generar_Comprobante($data_comprobante);
        return response()->json(['respuesta' => true,'comprobante'=>$url], 200);
    }

    public function Generar_Comprobante($data_comprobante) 
    {   
        $iddocumento=$data_comprobante['comprobante']['numero_factura'];
        $path = storage_path().'/'.$this->name_bdd.'/Comprobantes/';

        if (!File::exists($path)) {
          File::makeDirectory($path, 0775, true);
        }

        if (!File::exists($path.$iddocumento.'.pdf'))
        {
          $data = $data_comprobante;
         //return config('global.appnext').'/storage/app/'.$this->name_bdd.'/Comprobantes/'.$iddocumento.'.pdf';
          $date = date('Y-m-d');
          $invoice = "2222";
          $view =  \View::make('comprobante_view', compact('data', 'date', 'invoice'))->render();
          $pdf = \App::make('dompdf.wrapper');
          $pdf->loadHTML($view);
          $pdf->save($path.$iddocumento.'.pdf');
        }
        return config('global.appnext').'/storage/'.$this->name_bdd.'/Comprobantes/'.$iddocumento.'.pdf';

    }

    public function Generar_Comprobante_Factura(Request $request) 
    {   
      $iddocumento=$request->factura['numero_factura'];
      $path = storage_path().'/'.$this->name_bdd.'/Comprobantes/';

      if (File::exists($path.$iddocumento.'.pdf')) {
        return response()->json(['respuesta' => true,'url'=>config('global.appnext').'/storage/'.$this->name_bdd.'/Comprobantes/'.$iddocumento.'.pdf'], 200);
      }else{
        /*$data_comprobante=
        $url=$this->Generar_Comprobante($data_comprobante);*/
        return response()->json(['respuesta' => true,'url'=>'Archivo no Encontrado'], 200);
      }
      

    }

    public function Get_Mis_Facturas_Venta(Request $request) 
    { 

      $currentPage = $request->pagina_actual;
      $limit = $request->limit;

      $mis_facturas=DB::connection($this->name_bdd)->table('ventas.facturas')->where('estado','A')->orderBy('id','ASC')->get();

      if ($request->has('filter') && $request->filter != '')
      {
        $mis_facturas=DB::connection($this->name_bdd)->table('ventas.facturas')
        ->where('estado','A')
        ->where('estado','LIKE','%'.$request->filter.'%')
        ->orderBy('id','ASC')
        ->get();

      }
      foreach ($mis_facturas as $key => $value) {
        $data_cliente=DB::connection($this->name_bdd)->table('administracion.clientes')->where('id',$value->id_cliente)->where('estado','A')->first();
        switch ($data_cliente->tipo_cliente) {
                    case 1:
                      $data=DB::connection($this->name_bdd)->table('public.personas')->where('id',$data_cliente->id_cliente)->first();
                        if (count($data)>0) {
                          $value->nombres_completos=$data->primer_apellido.' '.$data->segundo_apellido.' '.$data->primer_nombre.' '.$data->segundo_nombre;
                          $value->ruc_ci=$value->id;
                          $data_correo=DB::connection($this->name_bdd)->table('public.personas_correo_electronico')->select('correo_electronico')->where('id_persona',$value->id_cliente)->first();
                          $data_telefono=DB::connection($this->name_bdd)->table('public.telefonos_personas')->select('numero')->where('id_persona',$value->id_cliente)->first();
                          $telefono=(count($data_telefono)==0)?'sin-definir':$data_telefono->numero;
                          $correo=(count($data_correo)==0)?'sin-definir':$data_correo->correo_electronico;
                          $value->telefono=$telefono;
                          $value->correo=$correo;
                          $value->direccion=$data->calle.' '.$data->transversal.' '.$data->numero;
                          $value->tipo_cliente='PERSONA';
                        }
                      break;
                      case 2:
                      $data=DB::connection($this->name_bdd)->table('administracion.empresas')->where('ruc_ci',$value->id_cliente)->first();
                      
                        if (count($data)>0) {
                          $value->ruc_ci=$value->id;
                          $value->nombres_completos=$data->razon_social;
                          $data_contacto=DB::connection($this->name_bdd)->table('administracion.sucursales')->where('id_empresa',$data->id)->where('codigo_sri','001')->first();
                          $data_contacto->datos_empresariales=json_decode($data_contacto->datos_empresariales);
                          $data_contacto->localizacion_sucursal=json_decode($data_contacto->localizacion_sucursal);
                          $value->info=$data_contacto;
                          $value->tipo_cliente='EMPRESA';
                        }
                      break;

                  }
        //$value->cliente=$data;
        
      }
      $mis_facturas=$this->funciones->paginarDatos($mis_facturas,$currentPage,$limit);
      return response()->json(['respuesta' => $mis_facturas], 200);

    }
    
}
