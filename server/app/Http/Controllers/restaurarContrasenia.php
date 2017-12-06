<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Usuarios;
use App\ingresos_usuarios;
use App\actualizaClave;
use App\libs\Funciones;
use Carbon\Carbon;
use DB;
use Config;
use Mail;

class restaurarContrasenia extends Controller
{
   public function __construct(){
        $this->usuarios=new Usuarios();
        $this->ingresos_usuarios=new ingresos_usuarios();
    }
   
    public function recuperaClave(Request $request){
        
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
        if ($existenciaRucEnSistema) {
          if ($request->correo === 1 && $request->nick !== null) {
            $camposUsuario = ['id','id_persona', 'estado_clave','fecha_actualiza'];
            $idUsuario = DB::connection($name_bdd)->table('usuarios.usuarios')->select($camposUsuario)->where('nick',$request->nick.'@'.config('global.dominio'))->first();
            if ($idUsuario->estado_clave === true) {
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
           if ($idUsuario->estado_clave === false) {
              $fechaActual = Carbon::parse(Carbon::now()->toDateTimeString());
              $fechaUsuario = Carbon::parse($idUsuario->fecha_actualiza);
              $diferencia = $fechaActual->diff($fechaUsuario);
              if ((int) $diferencia->h < 2 && (int) $diferencia->d === 0) {
                $respuesta = "Hace Menos de 2 Horas a Solicitado un Cambio de Clave, Por Favor Revice su Correo electronico";
              }
              if ((int) $diferencia->h > 2 || (int)$diferencia->d > 0) {
            // return response()->json(["respuesta" => $diferencia], 200);
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
            }
          }      
          if ($request->nick === 1 && $request->correo !== null) {
            $campos = ['id_persona','correo_electronico'];
            $userDataEmail = DB::connection($name_bdd)->table('public.personas_correo_electronico')->select($campos)->where('correo_electronico',$request->correo)->first();
            if ($userDataEmail) {
              $campos = ['id', 'nick', 'estado_clave','fecha_actualiza'];
              $idUsuario = DB::connection($name_bdd)->table('usuarios.usuarios')->select($campos)->where('id_persona',$userDataEmail->id_persona)->first();
              $campos = [ 'primer_nombre', 'primer_apellido'];
              $dataPersona = DB::connection($name_bdd)->table('public.personas')->select($campos)->where('id',$userDataEmail->id_persona)->first();
              if ($idUsuario) {
                if ($idUsuario->estado_clave === true) {
                  $res = DB::connection($name_bdd)->statement("SELECT * FROM actualiza_clave ('".$idUsuario->id."', '".bcrypt($pass)."')");
                  if ($res) {
                     $estado = DB::connection($name_bdd)->table('usuarios.usuarios')->where('id', $idUsuario->id)->update(['estado_clave' => false,'fecha_actualiza' => Carbon::now()->toDateTimeString()]);
                    if ($estado) {
                      $respuesta = true;
                      $data['correo'] = $userDataEmail->correo_electronico;
                      $data['nombre_comercial'] = $dataPersona->primer_nombre.' '. $dataPersona->primer_apellido;
                      $data['ruc'] = $request->ruc;
                      $data['user_nextbook'] = $idUsuario->nick;
                      $data['pass_nextbook'] = $pass;
                      $this->enviar_correo($data);
                      return response()->json(["respuesta" => $respuesta], 200);
                    }
                  }
                }
                if ($idUsuario->estado_clave === false) {
                  $fechaActual = Carbon::parse(Carbon::now()->toDateTimeString());
                  $fechaUsuario = Carbon::parse($idUsuario->fecha_actualiza);
                  $diferencia = $fechaActual->diff($fechaUsuario);
                  if ((int) $diferencia->h < 2 && (int) $diferencia->d === 0) {
                    $respuesta = "Hace Menos de 2 Horas a Solicitado un Cambio de Clave, Por Favor Revice su Correo electronico";
                  }
                  if ((int) $diferencia->h > 2 || (int)$diferencia->d > 0) {
                    $res = DB::connection($name_bdd)->statement("SELECT * FROM actualiza_clave ('".$idUsuario->id."', '".bcrypt($pass)."')");
                    if ($res) {
                       $estado = DB::connection($name_bdd)->table('usuarios.usuarios')->where('id', $idUsuario->id)->update(['fecha_actualiza' => Carbon::now()->toDateTimeString()]);
                      if ($estado) {
                        $respuesta = "Un Nuevo Codigo de Acceso a Sido Enviado a Su Correo";
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
