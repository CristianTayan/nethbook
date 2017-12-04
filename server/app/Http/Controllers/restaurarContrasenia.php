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
        $this->usuarios=new Usuarios();
        $this->ingresos_usuarios=new ingresos_usuarios();
    }
   
    public function recuperaClave(Request $request)
    {
        
      $cadena = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
      $longitudCadena = strlen($cadena);
      $pass = "";
      $respuesta = false;
      $longitudPass = 6;
        for($i = 1 ; $i <= $longitudPass ; $i++){
            $pos = rand(0,$longitudCadena-1);
            $pass .= substr($cadena,$pos,1);
        }
      $existenciaRucEnSistema = DB::connection('nextbookconex')->table('administracion.empresas')->select('nick')->where('ruc_ci',$request->ruc)->first();
      $name_bdd = strtolower($existenciaRucEnSistema->nick);
        if ($existenciaRucEnSistema) {
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

          $camposUsuario = ['id','id_persona'];
          $idUsuario = DB::connection($name_bdd)->table('usuarios.usuarios')->select($camposUsuario)->where('nick',$request->nick.'@'.config('global.dominio'))->first();
          if ($idUsuario) {
            $campos = [ 'correo_electronico'];
            $userDataEmail = DB::connection($name_bdd)->table('public.personas_correo_electronico')->select($campos)->where('id_persona',$idUsuario->id_persona)->first();
            $campos = [ 'primer_nombre', 'primer_apellido'];
            $dataPersona = DB::connection($name_bdd)->table('public.personas')->select($campos)->where('id',$idUsuario->id_persona)->first();
            if ($userDataEmail) {
              $res = DB::connection($name_bdd)->statement("SELECT * FROM actualiza_clave ('".$idUsuario->id."', '".bcrypt($pass)."')");
              if ($res) {
                 $estado = DB::connection($name_bdd)->table('usuarios.usuarios')->where('id', $idUsuario->id)->update(['estado_clave' => false]);
                if ($estado) {
                  $respuesta = true;
                  $data['correo'] = $userDataEmail->correo_electronico;
                  $data['nombre_comercial'] = $dataPersona->primer_nombre.' '. $dataPersona->primer_apellido;
                  $data['ruc'] = $request->ruc;
                  $data['user_nextbook'] = $request->nick;
                  $data['pass_nextbook'] = $pass;
                  $this->enviar_correo($data);
                  return response()->json(["respuesta" => $respuesta], 200);
                }
              }
            }
          }
        }      
      return response()->json(["respuesta" => $respuesta], 200);
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
