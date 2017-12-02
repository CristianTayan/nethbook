<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Usuarios;
use App\ingresos_usuarios;
use App\actualizaClave;
use App\libs\Funciones;
use DB;
use Config;
use Mail;

class restaurarContrasenia extends Controller
{
   public function __construct(){
      // Modelos
        $this->usuarios=new Usuarios();
        $this->ingresos_usuarios=new ingresos_usuarios();
        // $this->actualizarClave = new actualizarClave();
    }
   
    public function recuperaClave(Request $request)
    {
        $cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        $longitudCadena = strlen($cadena);
        //Se define la variable que va a contener la contraseña
        $pass = "";
        //Se define la longitud de la contraseña, en mi caso 10, pero puedes poner la longitud que quieras
        $longitudPass = 6;
        //Creamos la contraseña
        for($i = 1 ; $i <= $longitudPass ; $i++){
            //Definimos numero aleatorio entre 0 y la longitud de la cadena de caracteres-1
            $pos = rand(0,$longitudCadena-1);
            //Vamos formando la contraseña en cada iteraccion del bucle, añadiendo a la cadena $pass la letra correspondiente a la posicion $pos en la cadena de caracteres definida.
            $pass .= substr($cadena,$pos,1);
        }
            
      $existenciaRucEnSistema = DB::connection('nextbookconex')->table('administracion.empresas')->select('nick')->where('ruc_ci',$request->ruc)->first();
      $name_bdd = strtolower($existenciaRucEnSistema->nick);
        if ($existenciaRucEnSistema) {
          // cambiar por domino gobla
            $nick = $request->nick.'@nethbook.com';
            Config::set('database.connections.'.$name_bdd, array(
                'driver' => 'pgsql',
                'host' => 'localhost',
                'port' =>  '5432',
                'database' =>  $name_bdd,
                'username' =>  'postgres',
                'password' =>  'rootdow',
                'charset' => 'utf8',
                'prefix' => '',
                'schema' => 'usuarios',
                'sslmode' => 'prefer',
            ));
            // consulta usuario hacer tebla de referencia con Persona->Usuario o poner campo correo en tabla usuario// id usuario quemado hacer una consulta jhoim y subir la rama 
            $idUsuario = '201711291145355a1ee42fe1ceb';
            $campos = ['correo_electronico'];
            $userDataEmail = DB::connection($name_bdd)->table('public.personas_correo_electronico')->select($campos)->where('id_persona',3)->first();
            $userData = DB::connection($name_bdd)->table('public.personas')->select('primer_nombre')->where('id',3)->first();
            $res = DB::connection($name_bdd)->statement("SELECT * FROM actualiza_clave ('".$idUsuario."' , '".bcrypt($pass)."')");
            $data['correo'] = $userDataEmail->correo_electronico;
            $data['nombre_comercial'] = $userData->primer_nombre;
            $data['ruc'] = $request->ruc;
            $data['user_nextbook'] = 'alex';
            $data['pass_nextbook'] = $pass;
            $this->enviar_correo($data);
            return response()->json(["respuesta" => true], 200);
        }
        if (!$existenciaRucEnSistema) {
            return response()->json(["respuesta" => false], 200);
        }
    }

    public function enviar_correo($data){
      $correo_enviar = $data['correo'];
      $razon_social = $data['nombre_comercial'];
      Mail::send('credenciales_ingreso', $data, function($message) use ($correo_enviar,$razon_social)
        {
          $message->from("sistemas@nethbook.com",'Nethbook');
          $message->to($correo_enviar,$razon_social)->subject('Recuperación de contraseña');
        }
      );
    }

}
