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
use App\libs\Funciones_fac;

class Repositorio_Facturas extends Controller

  {
  public function __construct(Request $request)

    {

     try{
          // Funciones
          $this->funciones = new Funciones();
          $this->Funciones_fac = new Funciones_fac();
          // Autenticacion
          $key = config('jwt.secret');
          $decoded = JWT::decode($request->token, $key, array(
            'HS256'
          ));
          $this->user = $decoded;
          $this->name_bdd = $this->user->nbdb;
        }catch (\Firebase\JWT\ExpiredException $e) {
            return response()->json(['respuesta' => $e->getMessage()],401);
            die();
        }

    }
  public function Leer_Facturas_Correo(Request $request)

    {
    $datos_correo = DB::connection('nextbookconex')->table('empresas')->where('ruc_ci', $this->user->ruc)->first();
    //$result_coreo = $this->Funciones_fac->leer($datos_correo->correo_institucional, $datos_correo->clave_correo_institucional, $this->name_bdd);
    $currentPage = $request->pagina_actual;
    $limit = $request->limit;
    if ($request->has('filter') && $request->filter != '')
      {
      // $data=DB::connection($this->name_bdd)->statement("SELECT * FROM inventario.tipos_categorias WHERE (nombre||descripcion) like '%".$request->input('filter')."%' and estado='A' LIMIT 5");
      $data = DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas_correo')->where('estado_proceso_factura', FALSE)->where('clave_acceso', 'LIKE', '%' . $request->input('filter') . '%')
      // ->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
      ->orderBy('id', 'DESC')->get();
      }
      else
      {
      $data = DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas_correo')->where('estado_proceso_factura', FALSE)->orderBy('id', 'DESC')->get();
      }
    $data = $this->funciones->paginarDatos($data, $currentPage, $limit);
    return response()->json(["respuesta" => $data]);
    }
  public function Get_Facturas_Rechazadas(Request $request)

    {
    $currentPage = $request->pagina_actual;
    $limit = $request->limit;
    if ($request->has('filter') && $request->filter != '')
      {
      // $data=DB::connection($this->name_bdd)->statement("SELECT * FROM inventario.tipos_categorias WHERE (nombre||descripcion) like '%".$request->input('filter')."%' and estado='A' LIMIT 5");
      $data = DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas_rechazadas')->where('estado', 'A')->where('razon_rechazo', 'LIKE', '%' . $request->input('filter') . '%')
      // ->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
      ->orderBy('id_factura_r', 'ASC')->get();
      }
      else
      {
      $data = DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas_rechazadas')->where('estado', 'A')->orderBy('id_factura_r', 'ASC')->get();
      }
    $data = $this->funciones->paginarDatos($data, $currentPage, $limit);
    return response()->json(["respuesta" => $data]);
    }
  public function Upload_Factura(Request $request)

    {
    $factura = $request->input('factura');
    $totales_tipo_gasto = $request->input('totales_tipo_gasto');
    $impuestos = DB::connection($this->name_bdd)->table('contabilidad.impuestos')->get();

    $exist_factura=DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas')->where('clave_acceso',$factura['infoTributaria']['claveAcceso'])->first();
     //---------------------------  EXISTENCIA FACTURA ----------------------- 
    if (count($exist_factura)==0) {    
    foreach($impuestos as $key_impuesto => $impuesto)
      {
      $impuestos[$key_impuesto]->subtotal = 0;
      $impuestos[$key_impuesto]->valor = 0;
      }

      $existe_codigo=array_key_exists ( 'codigo', $factura['infoFactura']['totalConImpuestos']['totalImpuesto']);

    if ($existe_codigo)
      {
      $detalle = $factura['infoFactura']['totalConImpuestos']['totalImpuesto'];
      foreach($impuestos as $key_impuesto => $impuesto)
        {
        $impuestos[$key_impuesto]->subtotal = 0;
        if ($detalle['codigo'] == $impuesto->codigo_sri)
          {
          $impuestos[$key_impuesto]->subtotal = $detalle['baseImponible'];
          $impuestos[$key_impuesto]->valor = $detalle['valor'];
          }
        }
      }
      else
      {
      foreach($factura['infoFactura']['totalConImpuestos']['totalImpuesto'] as $key => $detalle)
        {
        foreach($impuestos as $key_impuesto => $impuesto)
          {
          if ($detalle['codigo'] == $impuesto->codigo_sri)
            {
            $impuestos[$key_impuesto]->subtotal = $detalle['baseImponible'];
            $impuestos[$key_impuesto]->valor = $detalle['valor'];
            }
          }
        }
      }

    $num_factura = $factura['infoTributaria']['estab'] . '-' . $factura['infoTributaria']['ptoEmi'] . '-' . $factura['infoTributaria']['secuencial'];
    $nombre_comercial = $factura['infoTributaria']['nombreComercial'];
    $clave_acceso = $factura['infoTributaria']['claveAcceso'];
    $ruc_prov = $factura['infoTributaria']['ruc'];
    $tipo_doc = $factura['infoTributaria']['codDoc'];
    $total = $factura['infoFactura']['importeTotal'];
    $id_sucursal = $factura['infoTributaria']['estab'];
    $fecha_emision = $factura['infoFactura']['fechaEmision'];
    $subtotal_sin_impuestos = $factura['infoFactura']['totalSinImpuestos'];
    $descuento = $factura['infoFactura']['totalDescuento'];
    $propina = $factura['infoFactura']['propina'];
    
    // ----------------------------------------------------------------------------------------Guardar Factura en Repositorio
    DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas')->insert(['num_factura' => $num_factura,
     'nombre_comercial' => $nombre_comercial,
     'clave_acceso' => $clave_acceso,
     'ruc_prov' => $ruc_prov,
     'tipo_doc' => $tipo_doc,
     'total' => $total,
     'contenido_fac' => json_encode($factura) ,
     'id_sucursal' => $id_sucursal,
     'fecha_emision' => $fecha_emision,
     'subtotal_12' => $impuestos[1]->subtotal,
     'subtotal_0' => $impuestos[0]->subtotal,
     'subtotal_no_sujeto' => $impuestos[3]->subtotal,
     'subtotal_exento_iva' => $impuestos[4]->subtotal,
     'subtotal_sin_impuestos' => $subtotal_sin_impuestos,
     'descuento' => $descuento,
     'ice' => '',
     'iva_12' => $impuestos[0]->valor,
     'propina' => $propina,
     'estado' => 'A',
     'estado_view' => 'A']);
    // ----------------------------------------------------------------------------------------Guardar Totales Factura
    $last_fac = DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas')->select('id_factura')->where('num_factura', $num_factura)->first();
    foreach($totales_tipo_gasto as $key => $value)
      {
      $tipo_gasto = DB::connection($this->name_bdd)->table('contabilidad.tipos_gastos_personales')->where('nombre', $value['nombre'])->first();
      if ($value['total']>0) {
        DB::connection($this->name_bdd)->table('contabilidad.gastos_impuestos_renta_deduccion')->insert(
          ['id_factura' => $last_fac->id_factura, 'id_tipo_gasto_personal' => $tipo_gasto->id, 'valor_acumular' => $value['total'], 'estado' => 'A']
          );
        //Guardar Gastos por mes 
        DB::connection($this->name_bdd)->table('contabilidad.gasto_mes_repositorio')->insert(
          ['id_factura' => $last_fac->id_factura, 'id_tipo_gasto' => $tipo_gasto->id, 'total_gasto' => $value['total'], 'estado_revicion' => 'A']
          );
        }
      }
    // ----------------------------------------------------------------------------------------Guardar Asiento Contable
    $max = $totales_tipo_gasto[0]['total'];
    $max_gasto = $totales_tipo_gasto[0];
    foreach($totales_tipo_gasto as $key => $value)
      {
      if ($value['total'] > $max)
        {
        $max = $value['total'];
        $max_gasto = $value;
        }
      }
    $cuenta_contable = DB::connection($this->name_bdd)->table('contabilidad.cuentas_contables')->where('nombre_corto', $max_gasto['nombre'])->first();
    // return response()->json(["respuesta"=>$tipo_gasto->id]);

    $existe_pago=is_array($factura['infoFactura']['pagos']);

    if (!$existe_pago)
      {
      $forma_pago = $factura['infoFactura']['pagos']['pago']['formaPago'];
      $forma_pago = ($forma_pago == '01') ? 1 : 2;
      }else{
        $forma_pago = 2;
      }
    
    // return response()->json(["respuesta"=>$factura]);
    DB::connection($this->name_bdd)->table('contabilidad.asientos_contables_diario')->insert(['id_tipo_cuenta_contable' => $forma_pago, 'referencia_asiento' => $last_fac->id_factura, 'debe' => $max_gasto['total'], 'estado' => 'A']);
    DB::connection($this->name_bdd)->table('contabilidad.asientos_contables_diario')->insert(['id_tipo_cuenta_contable' => $cuenta_contable->id, 'referencia_asiento' => $last_fac->id_factura, 'haber' => $max_gasto['total'], 'estado' => 'A']);
    // Si es Factura del correo
    if ($request->has('id_factura_correo'))
      {
      DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas_correo')->where('id', $request->id_factura_correo)->update(['estado_proceso_factura' => TRUE]);
      }
    return response()->json(["respuesta" => true]);
    }else return response()->json(["respuesta" => false,'error'=>'Registro-Existente']);

    }
  public function Get_Xml_Factura_Correo(Request $request)

    {
    $mes = Carbon::now()->month;
    $path_file = storage_path() . '/app/facturas_correo/' . $this->name_bdd . '/' . $mes . '/' . $request->nombre_archivo;
    try
      {
      $contents = File::get($path_file);
      }
    catch(Illuminate\Filesystem\FileNotFoundException $exception)
      {
      die("Archivo no Existe");
      }
    return response()->json(["respuesta" => true, 'file' => $contents]);
    }

  public function Get_Mis_Facturas(Request $request)
    {

    $currentPage = $request->pagina_actual;
    $limit = $request->limit;
    if ($request->has('filter')&&$request->filter!='') {
        //$data=DB::connection($this->name_bdd)->statement("SELECT * FROM inventario.tipos_categorias WHERE (nombre||descripcion) like '%".$request->input('filter')."%' and estado='A' LIMIT 5");
        $data=DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas')
                                                ->where('nombre_comercial','LIKE','%'.$request->input('filter').'%')
                                                ->where('id_sucursal',$request->codigo_sucursal)
                                                //->orwhere('descripcion','LIKE','%'.$request->input('filter').'%')
                                                ->orderBy('id_factura','ASC')->get();
         $data=$this->funciones->paginarDatos($data,$currentPage,$limit);                                       
        return response()->json(['respuesta' => $data], 200);
    }

    if ($request->has('id_tipo_documento')&&$request->id_tipo_documento!='') {

      $data=DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas')
                                                ->where('tipo_doc',$request->input('id_tipo_documento'))
                                                ->where('id_sucursal',$request->codigo_sucursal)
                                                ->orderBy('id_factura','ASC')->get();
        $data=$this->funciones->paginarDatos($data,$currentPage,$limit);                                       
      return response()->json(['respuesta' => $data], 200);
    }

    if (!$request->has('id_tipo_documento')&&$request->id_tipo_documento==''&&!$request->has('filter')&&$request->filter=='') {
      $data=DB::connection($this->name_bdd)->table('contabilidad.repositorio_facturas')
    ->where('estado','A')
    ->where('id_sucursal',$request->codigo_sucursal)
    ->orderBy('id_factura','ASC')->get();
    }

    foreach ($data as $key => $value) {
      $data_gasto_mes= DB::connection($this->name_bdd)->table('contabilidad.gasto_mes_repositorio')->select('id_tipo_gasto')->where('id_factura',$value->id_factura)->first();
      $tipo_gasto=DB::connection($this->name_bdd)->table('contabilidad.tipos_gastos_personales')->select('nombre','descripcion')->where('id',$data_gasto_mes->id_tipo_gasto)->first();
      $value->tipo_gasto=$tipo_gasto;
    }

    $data=$this->funciones->paginarDatos($data,$currentPage,$limit);
    return response()->json(['respuesta' => $data], 200);
    }

   public function Generar_PDF(Request $request) 
    {   
        $factura=$request->input('factura');
        $iddocumento=$factura['id_factura'];
        $contenido_fac=$factura['contenido_fac'];

        if (!File::exists(storage_path().'/app/facturas_pdf_xml/'.$this->name_bdd.'/pdf/')) {
          File::makeDirectory(storage_path().'/app/facturas_pdf_xml/'.$this->name_bdd.'/pdf/', 0775, true);
        }

        if (!File::exists(storage_path().'/app/facturas_pdf_xml/'.$this->name_bdd.'/pdf/'.$iddocumento.'.pdf'))
        {
          $data = $this->getData($contenido_fac);
         // return response()->json(['respuesta'=>true,'url'=>$data]);
          $date = date('Y-m-d');
          $invoice = "2222";
          $view =  \View::make('factura_view', compact('data', 'date', 'invoice'))->render();
          $pdf = \App::make('dompdf.wrapper');
          $pdf->loadHTML($view);
          $pdf->save(storage_path().'/app/facturas_pdf_xml/'.$this->name_bdd.'/pdf/'.$iddocumento.'.pdf');
        }
        return response()->json(['respuesta'=>true,'url'=>config('global.appnext').'/storage/app/facturas_pdf_xml/'.$this->name_bdd.'/pdf/'.$iddocumento.'.pdf']);

        
    }
 
    public function getData($contenido) 
    {
        //-------------------------------------------- CONSULTAR AUTORIZACION ---------------------------------------
            // $client = new Client;
            // $res = $client->request('POST', 'http://localhost/appserviciosnext/public/estado_factura', ['json' => ['token'=>$token,'clave' => $iddocumento]]);
            // $respuesta = json_decode($res->getBody() , true);

        // -------------------------------------------GENERAR PDF ---------------------------------------------------
        $xmlData=json_decode($contenido);
        //return $xmlData;

        $tipoambiente=(string)$xmlData->infoTributaria->ambiente;
        $tipoambiente='2'; 
        switch ($tipoambiente) {
                case '2':
                $ambiente="PRODUCCION";
                break;
                case '1':
                $ambiente="PRUEBAS";
                break;
        }

    if($xmlData->infoTributaria->tipoEmision == 1){
        $emision = 'Normal';  
      }else{
        $emision = 'Indisponibilidad del Sistema';  
      }
  //----------------------------------------------------------- Generar codigo de barras -----------------------
        $code_number = $xmlData->infoTributaria->claveAcceso;
        $this->Funciones_fac->gen_codigo_barras($code_number);

        $cabecera=[
        'razonSocial'=>(string)$xmlData->infoTributaria->razonSocial,
        'dirMatriz'=>(string)$xmlData->infoTributaria->dirMatriz,
       // 'contribuyenteEspecial'=>(string)$xmlData->infoFactura->contribuyenteEspecial,
        'obligadoContabilidad'=>(string)$xmlData->infoFactura->obligadoContabilidad,
        'ruc'=>(string)$xmlData->infoTributaria->ruc,
        'nromFactura'=>(string)$xmlData->infoTributaria->estab. '-'.$xmlData->infoTributaria->ptoEmi. '-'.$xmlData->infoTributaria->secuencial,
        'ambiente'=>$ambiente,
        'tipoEmision'=>$emision,
        'claveAcceso'=>(string)$xmlData->infoTributaria->claveAcceso,
        'fechaEmision'=>(string)$xmlData->infoFactura->fechaEmision
        ];

        $cliente=[
        'cedula'=>(string)$xmlData->infoFactura->identificacionComprador,
        //'direccion'=>(string)$xmlData->infoAdicional->campoAdicional,
        'nombres_apellidos'=>(string)$xmlData->infoFactura->razonSocialComprador
        ];

        if (count($xmlData->detalles->detalle)>1) {
          $productos=$xmlData->detalles->detalle;
        }else $productos=$xmlData->detalles;

        $detalles=[];

        foreach ($productos as $key => $value) {
          $existe_codigo_principal=property_exists($value, "codigoPrincipal");
          if ($existe_codigo_principal) {
            $detalles[$key]['codigoPrincipal']=(string)$value->codigoPrincipal;
          }else $detalles[$key]['codigoPrincipal']='NaN';
            
            //$detalles[$key]['codigoAuxiliar']=(string)$value->codigoAuxiliar;
            $detalles[$key]['cantidad']=(string)$value->cantidad;
            $detalles[$key]['descripcion']=(string)$value->descripcion;
            $detalles[$key]['precioUnitario']=(string)$value->precioUnitario;
            $detalles[$key]['descuento']=(string)$value->descuento;
            $detalles[$key]['precioTotalSinImpuesto']=(string)$value->precioTotalSinImpuesto;
        }


        //--------------------------------------- VALOR TOTAL ---------------------
        $valor_total=(string)$xmlData->infoFactura->importeTotal;

        //$totales=$this->Funciones_fac->get_totales($xml);
        $impuestos = DB::connection($this->name_bdd)->table('contabilidad.impuestos')->where('estado','A')->get();
         foreach($impuestos as $key_impuesto => $impuesto)
        {
          $impuestos[$key_impuesto]->subtotal = 0;
          $impuestos[$key_impuesto]->valor = 0;
        }

      $is_array=is_array ($xmlData->infoFactura->totalConImpuestos->totalImpuesto);

    if (!$is_array)
      {
      $detalle = $xmlData->infoFactura->totalConImpuestos->totalImpuesto;
      foreach($impuestos as $key_impuesto => $impuesto)
        {
        $impuestos[$key_impuesto]->subtotal = 0;
        $impuestos[$key_impuesto]->valor = 0;
        if ($detalle->codigoPorcentaje == $impuesto->codigo_sri)
          {
          $impuestos[$key_impuesto]->subtotal = $detalle->baseImponible;
          $impuestos[$key_impuesto]->valor = $detalle->valor;
          }
        }
      }
      else
      {
      foreach($xmlData->infoFactura->totalConImpuestos->totalImpuesto as $key => $detalle)
        {
        foreach($impuestos as $key_impuesto => $impuesto)
          {
          if ($detalle->codigoPorcentaje == $impuesto->codigo_sri)
            {
            $impuestos[$key_impuesto]->subtotal = $detalle->baseImponible;
            $impuestos[$key_impuesto]->valor = $detalle->valor;
            }
          }
        }
      } 


        //return $impuestos;
        $descuento = $xmlData->infoFactura->totalDescuento;
        $propina = $xmlData->infoFactura->propina;
        $subtotal_sin_impuestos=$xmlData->infoFactura->totalSinImpuestos;

        $totales=[
         'subtotal_sin_impuestos' => $subtotal_sin_impuestos,
         'descuento' => $descuento,
         'propina' => $propina,
         'valor_total'=>$xmlData->infoFactura->importeTotal
        ];

        $data['cabecera'] =  $cabecera;
        $data['cliente'] = $cliente;
        $data['detalles'] = $detalles;
        $data['totales'] = $totales;
        $data['impuestos'] = $impuestos;
        return $data;
    }

    public function generar_zip($iddocumento) 
    {
        $xml = glob(storage_path().$this->name_bdd.'/pdf/'.$iddocumento.".xml");
        $zip=Zipper::make(storage_path().$this->name_bdd.'/pdf/'.$iddocumento.".zip")->add($xml);
    }

    public function checkFileExists($iddocumento){
        if (File::exists(storage_path().$this->name_bdd.'/pdf/'.$iddocumento.".zip")) {
                return false;
            }else{
                return true;
            }
    }
    public function generar_xml(Request $request) 
    {
        $iddocumento=$request->input('iddocumento');
        $filename=$iddocumento.".zip";

        $nofileexists = true;
        while($nofileexists) { // loop until your file is there
            $zip_result=$this->generar_zip($iddocumento);
          $nofileexists = $this->checkFileExists($iddocumento); //check to see if your file is there
          sleep(2); //sleeps for X seconds, in this case 5 before running the loop again
        }

        if (!$nofileexists) {
        $file_path=storage_path().$this->name_bdd.'/pdf/'.$iddocumento.".zip";
        // return response()->download($file_path, $filename)->deleteFileAfterSend(true);
            $headers = array(
                        'Content-Type' => 'application/octet-stream',
                        'Content-Disposition' => 'attachment; filename="fac.zip'
                    );
             return response()->download(storage_path().'/'.$this->name_bdd.'/pdf/'.$iddocumento.".zip",$iddocumento.".zip",$headers)->deleteFileAfterSend(true);

        }

    }


  }
