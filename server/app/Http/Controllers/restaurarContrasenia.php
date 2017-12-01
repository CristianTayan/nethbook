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
            
      $existenciaRucEnSistema = DB::connection('nextbookconex')->select("SELECT nick FROM administracion.empresas WHERE ruc_ci ='".$request->ruc."'");
      $van1 = json_encode($existenciaRucEnSistema);
      $van2 = explode(':', $van1,2);
      $van3 = explode('"', $van2[1],3);
      $name_bdd = strtolower($van3[1]);
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
            $usuarios=new Usuarios(); 
            $usuarios->changeConnection($name_bdd);
            $resultado=$usuarios->select('id')->where('nick',$nick)->first();
            $van4 = json_encode($resultado);
            $van5 = explode(':', $van4,2);
            $van6 = explode('"', $van5[1],3);
            $idUsuario = $van6[1];
            $pass = "123456";
            $res = $usuarios->table('usuarios.usuarios')->were('id',$idUsuario)->update('clave_clave',bcrypt($pass));
            // $res=$usuarios->select("actualiza_clave ('".$idUsuario."' , '".bcrypt($pass)."')");
            // $res = $usuarios->select("SELECT * FROM usuarios.actualiza_clave ('".$idUsuario."' , '".bcrypt($pass)."')");
            // return response($res);
            // return response()->json(["respuesta" => true], 200);
            return response()->json(["respuesta" => $usuarios], 200);
            
        }
        if (!$existenciaRucEnSistema) {
            return response()->json(["respuesta" => false], 200);
        }
    }

}
