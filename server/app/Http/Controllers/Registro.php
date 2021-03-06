<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
// Modelos
use App\empresas;
use App\Usuarios;
// Funciones
use App\libs\Funciones;
// Extras
use Carbon\Carbon;
use Mail;
use GuzzleHttp\Client;
use DB;
use Config;
use Storage;
use App\libs\xmlapi;

//-------------------------  autenticacion -------
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class Registro extends Controller
{
    public function __construct(){
    	// Modelos
    	$this->empresas=new empresas();
    	// Funciones
    	$this->funciones=new Funciones();
      // Extras
      $this->client=new Client();
      // Autenticacion
      // $this->user = JWTAuth::parseToken()->authenticate();
    }

    public function Buscar_Informacion_Ruc(Request $request){
      //$resultado=DB::connection('nextbookconex')->select("SELECT * FROM empresa_ruc('".$request->input('ruc')."')");
      $resultado = DB::connection('nextbookconex')->table('informacion.empresas_consultadas')->where('ruc', '=', $request->input('ruc'))->first();
    if (count($resultado)==0)
      {
      $res = $this->client->request('GET', config('global.appserviciosnext').'/getDatos', ['json' => ['tipodocumento' => 'RUC', 'nrodocumento' => $request->input('ruc') ]]);
      $respuesta = json_decode($res->getBody()->getContents() , true);
      if ($respuesta['datosEmpresa']['valid']!='false') {
        
      $modifiedString = str_replace('&nbsp;', null,$respuesta['datosEmpresa']['fecha_inicio_actividades']);
      $respuesta['datosEmpresa']['fecha_inicio_actividades']=$modifiedString;

      $modifiedString = str_replace('&nbsp;', null, $respuesta['datosEmpresa']['fecha_reinicio_actividades']);
      $respuesta['datosEmpresa']['fecha_reinicio_actividades']=$modifiedString;

      $modifiedString =str_replace('&nbsp;', null, $respuesta['datosEmpresa']['fecha_cese_actividades']);
      $respuesta['datosEmpresa']['fecha_cese_actividades']=$modifiedString;

      $modifiedString =str_replace('&nbsp;', null, $respuesta['datosEmpresa']['fecha_actualizacion']);
      $respuesta['datosEmpresa']['fecha_actualizacion']=$modifiedString;

      /*DB::connection('infoconex')->table('empresas')
            ->where('ruc', $request->input('ruc'))
                                  ->update(array( 
                                              'razon_social'=>$respuesta['datosEmpresa']['razon_social'],
                                              'nombre_comercial'=>$respuesta['datosEmpresa']['nombre_comercial'],
                                              'estado_contribuyente'=>$respuesta['datosEmpresa']['estado_contribuyente'],
                                              'clase_contribuyente'=>$respuesta['datosEmpresa']['clase_contribuyente'],
                                              'tipo_contribuyente'=>$respuesta['datosEmpresa']['tipo_contribuyente'],
                                              'obligado_llevar_contabilidad'=>$respuesta['datosEmpresa']['obligado_llevar_contabilidad'],
                                              'actividad_economica'=>$respuesta['datosEmpresa']['actividad_economica'],
                                              // 'fecha_inicio_actividades'=>$respuesta['datosEmpresa']['fecha_inicio_actividades'],
                                              // 'fecha_cese_actividades'=>$respuesta['datosEmpresa']['fecha_cese_actividades'],
                                              // 'fecha_reinicio_actividades'=>$respuesta['datosEmpresa']['fecha_reinicio_actividades']
                                              // 'fecha_actualizacion'=>$respuesta['datosEmpresa']['fecha_actualizacion']
                                              ));*/

$responsable=$respuesta['establecimientos']['adicional'];
$direccion=explode('/', $respuesta['establecimientos']['sucursal'][0]['direccion']);
$direccion[0]=preg_replace('/(\v|\s)+/', '',$direccion[0]);
//$direccion[1]=preg_replace(' ', '',$direccion[1]);
$fecha_inicio_actividades=Carbon::parse($respuesta['datosEmpresa']['fecha_inicio_actividades'])->toDateTimeString();
$fecha_cese_actividades=Carbon::parse($respuesta['datosEmpresa']['fecha_cese_actividades'])->toDateTimeString();
$fecha_reinicio_actividades=Carbon::parse($respuesta['datosEmpresa']['fecha_reinicio_actividades'])->toDateTimeString();
$fecha_actualizacion=Carbon::parse($respuesta['datosEmpresa']['fecha_actualizacion'])->toDateTimeString();
//$direccion=explode('/', $direccion);
     $id_empresa= DB::connection('nextbookconex')->table('informacion.empresas_consultadas')->insertGetId([
        'ruc'=>$request->input('ruc'),
        'razon_social'=>$respuesta['datosEmpresa']['razon_social'],
        'nombre_comercial'=>$respuesta['datosEmpresa']['nombre_comercial'],
        'estado_contribuyente'=>$respuesta['datosEmpresa']['estado_contribuyente'],
        'clase_contribuyente'=>$respuesta['datosEmpresa']['clase_contribuyente'],
        'fecha_inicio_actividades'=>$fecha_inicio_actividades,
        'fecha_actualizacion'=>$fecha_actualizacion,
        'fecha_cese_actividades'=>$fecha_cese_actividades,
        'fecha_reinicio_actividades'=>$fecha_reinicio_actividades,
        'obligado_llevar_contabilidad'=>$respuesta['datosEmpresa']['obligado_llevar_contabilidad'],
        'tipo_contribuyente'=>$respuesta['datosEmpresa']['tipo_contribuyente'],
        'numero_establecimiento'=>1,
        'nombre_fantasia_comercial'=>'',
        'provincia'=>$direccion[0],
        'canton'=>$direccion[1],
        'direccion'=>$direccion[2],
        'actividad_economica'=>$respuesta['datosEmpresa']['actividad_economica']
        ]);

        $responsable=$respuesta['establecimientos']['adicional'];

        foreach ($respuesta['establecimientos']['sucursal'] as $key => $value) {


          $direccion=explode('/', $value['direccion']);
          $direccion[0]=preg_replace('/(\v|\s)+/', '',$direccion[0]);

          DB::connection('nextbookconex')->table('informacion.sucursales')->insert([
                 'id_empresa_consultada'=>$id_empresa,
                 'nombre'=>$value['nombre_sucursal'],
                 'responsable'=>json_encode($responsable),
                 'datos_empresariales'=>json_encode(['data'=>'']),
                 'localizacion_sucursal'=>json_encode($direccion),
                 'datos_adiconales'=>json_encode(['data'=>'']),
                 'codigo_sri'=>$value['codigo']
              ]);

        }
      return response()->json(["respuesta" => $respuesta['datosEmpresa']], 200);
      }else{
        return response()->json(["respuesta" => 'false-sri',"error"=>'no-registro-SRI'], 200);
      }
      }
      else
      {

        $sql=DB::connection('nextbookconex')->select("SELECT ruc_ci FROM empresas WHERE ruc_ci='".$request->input('ruc')."'");
        if (count($sql)==0) {
            $resultado = DB::connection('nextbookconex')->table('informacion.empresas_consultadas')->where('ruc', '=', $request->input('ruc'))->first();
            $resultado->valid="true";
            return response()->json(["respuesta" =>$resultado], 200);
        }else{
          return response()->json(["respuesta" =>false,"error"=>'registro-existente'], 200);
        }
      }
    }

    public function Save_Datos_Ruc(Request $request){
      $resultado=$this->empresas->select('id','razon_social','informacion_localizar_empresa')->where('id_estado','P')->where('ruc_ci',$request->input('ruc'))->first();
      //return response()->json(['respuesta'=>]);

      if (count($resultado)==0) {
        $data = ["correo"=>$request->input('correo'),
                  "codigo"=>$request->input('ruc'),
                  'razon_social'=>$request->input('razon_social'),
                  'telefono'=>$request->input('telefono'),
                  'telefono1'=>$request->input('telefono1'),
                  'provincia'=>$request->input('provincia'),
                  'celular'=>$request->input('celular'),
                  'celular2'=>$request->input('celular2')
                  ];

        $ruc_ci=$request->input('ruc');
        $nick=substr(str_replace(' ', '_', $request->input('razon_social')),0,11).'_'.$request->input('ruc');
        //echo strlen($nick);
        $this->empresas->id=$this->funciones->generarID(); 
        $this->empresas->razon_social=$request->input('razon_social'); 
        $this->empresas->actividad_economica=$request->input('actividad_economica'); 
        $this->empresas->ruc_ci=$ruc_ci; 
        $this->empresas->estado_contribuyente=$request->input('estado_contribuyente'); 
        $this->empresas->fecha_inicio_actividades=$request->input('fecha_inicio_actividades'); 
        $this->empresas->nombre_comercial=$request->input('nombre_comercial'); 
        $this->empresas->obligado_lleva_contabilida=$request->input('obligado_lleva_contabilida'); 
        $this->empresas->tipo_contribuyente=$request->input('tipo_contribuyente'); 
        $this->empresas->id_estado='P';
        $this->empresas->nick=$nick;
        //$this->empresas->tipo_empresa=0;
        $this->empresas->informacion_localizar_empresa=json_encode($data);
        $save=$this->empresas->save();

        $last_id=$this->empresas->id;

        $data['codigo']=$last_id;

        $this->enviar_correo_registro($data);
      }else{
        $result=json_decode($resultado->informacion_localizar_empresa);
        $data['codigo']=$resultado->id;
        $data['correo']=$result->correo;
        $data['razon_social']=$resultado->razon_social;
        $this->enviar_correo_registro($data);
      }

    	// if ($save) {
    		return response()->json(['respuesta'=>true],200);
    	// }
    }

    public function enviar_correo_registro($data){
        $correo_enviar=$data['correo'];
        $razon_social=$data['razon_social'];
    Mail::send('email_registro', $data, function($message)use ($correo_enviar,$razon_social)
            {
                $message->from("sistemas@nethbook.com",'Nethbook');
                $message->to($correo_enviar,$razon_social)->subject('Verifica tu cuenta');
            });
    }

    
    public function enviar_correo_credenciales($data){
        $correo_enviar=$data['correo'];
        $razon_social=$data['razon_social'];
    Mail::send('credenciales_ingreso', $data, function($message)use ($correo_enviar,$razon_social)
            {
                $message->from("sistemas@nethbook.com",'Nextbook');
                $message->to($correo_enviar,$razon_social)->subject('Credenciales de Ingreso');
            });
    }

    public function consultar_SRI($ruc){
      $res = $this->client->request('GET', config('global.appserviciosnext').'/getDatos', ['json' => ['tipodocumento' => 'RUC', 'nrodocumento' => $ruc ]]);
      $respuesta = json_decode($res->getBody()->getContents() , false);
      if (!is_array($respuesta)) {
        $respuesta = json_decode(json_encode($respuesta), true);
      }

      if ($respuesta['datosEmpresa']['valid']!='false') {

      $modifiedString = str_replace('&nbsp;', null,$respuesta['datosEmpresa']['fecha_inicio_actividades']);
      $respuesta['datosEmpresa']['fecha_inicio_actividades']=$modifiedString;

      $modifiedString = str_replace('&nbsp;', null, $respuesta['datosEmpresa']['fecha_reinicio_actividades']);
      $respuesta['datosEmpresa']['fecha_reinicio_actividades']=$modifiedString;

      $modifiedString =str_replace('&nbsp;', null, $respuesta['datosEmpresa']['fecha_actualizacion']);
      $respuesta['datosEmpresa']['fecha_actualizacion']=$modifiedString;

      return $respuesta;
    
    }
  }

    public function Activar_Cuenta(Request $request){
      $resultado=$this->empresas->select('razon_social','actividad_economica','informacion_localizar_empresa','ruc_ci')->where('id_estado','P')->where('id',$request->input('codigo'))->get();
      if (count($resultado)!=0) {
      $data_E=json_decode($resultado[0]['informacion_localizar_empresa']);
      $data['correo']=$data_E->correo;
      $data['razon_social']=$resultado[0]['razon_social'];
      $data['nombre_comercial']=$resultado[0]['razon_social'];
      $data['ruc']=$resultado[0]['ruc_ci'];
      $data['user_nextbook']='admin';
      $ruc_empresa=$resultado[0]['ruc_ci'];
      $actividad_economica=$resultado[0]['actividad_economica'];
      $resultado=$this->empresas->where('ruc_ci',$ruc_empresa)->first();
      $name=strtolower(substr(str_replace(' ', '_', $resultado['razon_social']),0,11).'_'.$ruc_empresa);
      //return $name;
      //$pass_user=$data['pass_nextbook'];
      DB::connection('nextbookconex')->statement("SELECT * from crea_usuario('".$name."','".$ruc_empresa."') ");
      $create=DB::connection('infoconex')->statement("CREATE DATABASE $name OWNER $name ");
      $create=true;
      if ($create) {
       // exec("PGPASSWORD=rootdow psql -U postgres -d ".$name." -p 5432 -h localhost < /var/www/html/appnext1.1/postgres/basico.sql", $cmdout, $cmdresult );
        // $exce = "PGPASSWORD=rootdow psql -U postgres -d ".$name." -p 5432 -h localhost < C:/xampp/htdocs/nethbook/server/postgres/basico.sql"; centos

        $exce = "pg_dump PGPASSWORD=rootdow psql -U postgres -d ".$name." -p 5432 -h localhost -f C:/xampp/htdocs/nethbook/server/postgres/basico.sql";
      //$exce = "pg_dump user=postgres password=rootdow databases bd_consejo > /C:/MI-RESPALDO.SQL";

        exec($exce, $cmdout, $cmdresult );
        echo $cmdout;
        $pass_email=$this->funciones->generarPass();
        $pass_next=$this->funciones->generarPass();
                        
       // if ($update) {
          //Crear Email
          $this->crear_email($ruc_empresa,$pass_email);
          Config::set('database.connections.'.$name, array(
                'driver' => 'pgsql',
                'host' => 'localhost',
                'port' =>  '5432',
                'database' =>  $name,
                'username' =>  $name,
                'password' =>  $ruc_empresa,
                'charset' => 'utf8',
                'prefix' => '',
                'schema' => 'usuarios',
                'sslmode' => 'prefer',
        ));

        //--------------------------------------------------------- BATCH LEER CORREOS -----------------------------------------
          //Crear fichero PHP
          $contenido_php='<?php
            $url = "'.config('global.servicios_especiales').'Read_Emails?email='.$ruc_empresa.'@'.config('global.dominio').'";
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, "email='.$ruc_empresa.'@'.config('global.dominio').'");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch);
            //$json = json_decode($response, true);
            //print_r($json);
            echo "\nOBTENIENDO CORREOS DE: '.$ruc_empresa.'.......";
              ?>';
          // Storage::disk('scripts')->put('/leer_correos/'.$ruc_empresa.'.php',$contenido_php);

          //Add a la lista de batch php
          // $contenido_old = Storage::disk('scripts')->get('script.sh');
          // $contenido_new = $contenido_old.' php leer_correos/'.$ruc_empresa.'.php;';
          // $contenido_new = Storage::disk('scripts')->put('script.sh',$contenido_new);
          // $contenido_old = Storage::disk('scripts')->get('script.sh');  

        //--------------------------------------------------------- FIN BATCH LEER CORREOS -----------------------------------------
          ///CREAR USUARIO
        $id=$this->funciones->generarID();
        $data['pass_nextbook']=$pass_next;
        $usuarios=new Usuarios(); 
        $usuarios->changeConnection($name);
        $usuarios->id=$id;
        $usuarios->nick='admin'.'@'.config('global.dominio');
        $usuarios->clave_clave=bcrypt($pass_next);
        $usuarios->id_estado='A';
        $usuarios->estado_clave=FALSE;
        $usuarios->id_tipo_usuario=1;
        $usuarios->fecha_creacion=Carbon::now()->toDateString();
        $usuarios->save();
        //ID DE USUARIO
        $id_usuario=$usuarios->id;

        /*$datos=$this->consultar_SRI($ruc_empresa);
        $sucursales=$datos['establecimientos']['sucursal'];
        */
        //Registrar Empresa
        $id_empresa_registrada=DB::connection($name)->table('administracion.empresas')->insertGetId([
           'razon_social'=>$data['razon_social'],
           'actividad_economica'=>$actividad_economica,
           'ruc_ci'=>$ruc_empresa,
           'nombre_comercial'=>$data['nombre_comercial'],
           'id_estado'=>'A',
           'tipo_empresa'=>0
          ]);
        //GENERAR VISTAS 

        app(Vistas::class)->Add_Vistas(config('vistas.lista'),$name);

        //GENERAR PRIVILEGIOS
        app(Vistas::class)->Gen_Privilegios_Admin($name);


        //GET Sucursales SRI
        $datos_Empresa_consultada= DB::connection('nextbookconex')->table('informacion.empresas_consultadas')->where('ruc', '=', $ruc_empresa)->first();
        $sucursales= DB::connection('nextbookconex')->table('informacion.sucursales')->where('id_empresa_consultada', '=', $datos_Empresa_consultada->id)->get();
        //return response()->json(['respuesta' => json_decode($sucursales[0]->responsable)], 200);
        $responsable=json_decode($sucursales[0]->responsable);
        $localizacion_sucursal=json_decode($sucursales[0]->localizacion_sucursal);
        $nombre_localidad=trim($localizacion_sucursal[1]);
        $calle=str_replace(' ', '', $nombre_localidad[2]);


        $localizacion=DB::connection('nextbookconex')->select("SELECT id FROM public.view_localidades WHERE nombre= '".$nombre_localidad."'");
        //return response()->json(['respuesta' => $localizacion], 200);
        $datos_repesentante=explode(' ', $responsable->representante_legal);
          //Registrar Persona
          DB::connection($name)->table('public.personas')->insert(
          [
          'primer_nombre'=>$datos_repesentante[2],
           'segundo_nombre'=>$datos_repesentante[3],
           'primer_apellido'=>$datos_repesentante[0],
           'segundo_apellido'=>$datos_repesentante[1],
           'id_localidad'=>$localizacion[0]->id,
           'calle'=>$calle,
           'transversal'=>null,
           'numero'=>null
          ]);
          $id_persona=DB::connection($name)->table('public.personas')->select('id')->where('primer_nombre',$datos_repesentante[2])->first();
          // Guardar Documento
          $actual_date=Carbon::now()->setTimezone('America/Guayaquil')->toDateTimeString();
          DB::connection($name)->table('public.personas_documentos_identificacion')->insert(
          [
          'id_persona'=>$id_persona->id,
           'id_tipo_documento'=>1,
           'numero_identificacion'=>$responsable->cedula,
           'estado'=>'A',
           'fecha'=>$actual_date
          ]);
          //Guardar Correo
          $actual_date=Carbon::now()->setTimezone('America/Guayaquil')->toDateTimeString();
          DB::connection($name)->table('public.personas_correo_electronico')->insert(
          [
          'id_persona'=>$id_persona->id,
           'correo_electronico'=>$data_E->correo,
           'estado'=>'A',
           'fecha'=>$actual_date
          ]);
          //Guardar Telefono
          $array_telefono=['telefono'=>$data_E->telefono,'telefono1'=>$data_E->telefono1,'celular'=>$data_E->celular,'celular2'=>$data_E->celular2];
          //Guardar Empleado
          DB::connection($name)->table('talento_humano.empleados')->insert(
          [
          'id_persona'=>$id_persona->id,
          'id_usuario'=>$id_usuario,
          'id_cargo'=>1,
          'estado'=>'A'
          ]);

          foreach ($array_telefono as $key => $value) {
            $actual_date=Carbon::now()->setTimezone('America/Guayaquil')->toDateTimeString();

            if ($value==!null) {
              DB::connection($name)->table('public.telefonos_personas')->insert(
              [
              'id_persona'=>$id_persona->id,
               'numero'=>$value,
               'estado'=>'A',
               'fecha'=>$actual_date,
               'id_operadora_telefonica'=>1
              ]);
            }

            
          }

        //Registrar Sucursales
        //$id_persona=DB::connection($name)->table('public.personas')->select('id')->where('ci_documento',$responsable['cedula'])->first();
        foreach ($sucursales as $key => $value) {
          $localizacion_array=json_decode($value->localizacion_sucursal);
          $localizacion=DB::connection('nextbookconex')->select("SELECT id FROM public.view_localidades WHERE nombre= '".str_replace(' ', '', $localizacion_array[1])."'");
          
          //if (count($localizacion)==0) {
            $localizacion='00';
          /*}else{
            $localizacion=$localizacion[0]->id;
          }*/
          $localizacion_sucursal=["direccion"=>$localizacion_array[0].'/'.$localizacion_array[1].'/'.$localizacion_array[2]];
          $datos_empresariales=['telefono'=>$request->telefono,'telefono1'=>$request->telefono1,'correo'=>$request->correo,'celular'=>$request->celular];
          DB::connection($name)->table('administracion.sucursales')->insert([
          'nombre'=>$value->nombre,
          'responsable'=>$id_persona->id,
          'datos_empresariales'=>json_encode($datos_empresariales),
          'localizacion_sucursal'=>json_encode($localizacion_sucursal),
          'codigo_sri'=>$value->codigo_sri,
          'id_empresa'=>$id_empresa_registrada
          ]);
        }

          $update=DB::connection('usuarioconex')->table('usuarios')
            ->where('id', $ruc_empresa)
                                  ->update(array('id_estado' => 'A','clave_clave'=>bcrypt($ruc_empresa),'mail'=>$ruc_empresa.'@'.config('global.dominio'),'clave_mail'=>$pass_email));
          $update=$this->empresas->where('ruc_ci',$ruc_empresa)->update(['id_estado' => 'A','correo_institucional'=>$ruc_empresa.'@'.config('global.dominio'),'clave_correo_institucional'=>$pass_email]); 
          $this->enviar_correo_credenciales($data);
          return response()->json(["respuesta"=>true]);

      }
    }
    else return response()->json(["respuesta"=>false]);
      
    }




    private function crear_email($user,$email_pass)
    {
        $ip           = config('global.dominio'); 
        $account      = "oyefm"; 
        $passwd       = "FRf74G7oW,$0yTQ"; 
        $port         = 2083; 
        $email_domain = config('global.dominio'); 
        $email_quota  = 50; 
        $xmlapi       = new xmlapi($ip);
        $xmlapi->set_port($port); 
        $xmlapi->password_auth($account, $passwd); 
        // $email_pass = "356497";
        $result        = "";
        if (!empty($user)){
            while (true) {

                $call   = array(
                    'domain' => $email_domain,
                    'email' => $user,
                    'password' => $email_pass,
                    'quota' => $email_quota
                );

                $call_f = array(
                    'domain' => $email_domain,
                    'email' => $user,
                    'fwdopt' => "fwd",
                    'fwdemail' => ""
                );
                $xmlapi->set_debug(0); 
                
                $result         = $xmlapi->api2_query($account, "Email", "addpop", $call);
                $result_forward = $xmlapi->api2_query($account, "Email", "addforward", $call_f); 

                
                if ($result->data->result == 1) {
                    $result = $user.$email_domain;
                    if ($result_forward->data->result == 1) {
                        $result = $user . $email_domain . ' forward to ' . $dest_email;
                    }
                } else {
                    $result = $result->data->reason;
                    break;
                }
                break;
            }
            }
        return $result;
        
    }

    public function Get_Provincias(Request $request){

      $resultado=DB::connection('localidadesconex')->select("SELECT nombre,id,codigo_telefonico FROM view_localidades WHERE id_padre='00' ORDER BY nombre ASC");
      return response()->json(["respuesta" => $resultado], 200);
    }
    public function Get_Ciudades(Request $request){

      $resultado=DB::connection('localidadesconex')->select("SELECT nombre,id,codigo_telefonico FROM view_localidades WHERE length(id_padre)=2 and nombre!='ECUADOR' ORDER BY nombre ASC");
      return response()->json(["respuesta" => $resultado], 200);
    }
}
