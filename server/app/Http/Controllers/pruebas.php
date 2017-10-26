<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;
use Storage;
use File;
use config;
use App\EmpresasModel;
use Mail;
use GuzzleHttp\Client;

class pruebas extends Controller
{
    public function crear_bdd(Request $request){
		$name='bdd';
		$pass_user='1090084247001';
    	// $create =DB::connection('nextbookconex')->statement('CREATE DATABASE '.$name.' OWNER postgres ');
    	//exec("export PATH=/opt/PostgreSQL/9.5/bin:$PATH", $cmdout_export, $cmdresult_export );
		// exec("PGPASSWORD=".$pass_user." psql -U ".$name." -d ".$name." -p 5432 -h localhost < C:/xampp/htdocs/nethbook/server/postgres/basico.sql", $cmdout, $  cmdresult );
     // $exce = 'PGPASSWORD=rootdow psql -d bdd -U postgres -f "C:/xampp/htdocs/nethbook/server/postgres/basico.sql"';
     // $exce = "PGPASSWORD=rootdow psql -U postgres -d bdd -f 'C:/xampp/htdocs/nethbook/server/postgres/basico.sql'";
        // exec($exce, $cmdresult );

    	return response()->json(['respuesta'=>bcrypt($pass_user)]);
    }

    public function edit_script(Request $request){
        //--------------------------------------------------------- BATCH LEER CORREOS -----------------------------------------
          //Crear fichero PHP
          $contenido_php='<?php
            $url = "'.config('global.servicios_especiales').'Read_Emails?email='.$request->input('ruc').'@'.config('global.dominio').'";
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, "email='.$request->input('ruc').'@'.config('global.dominio').'");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch);
            //$json = json_decode($response, true);
            //print_r($json);
            echo "\nOBTENIENDO CORREOS DE: '.$request->input('ruc').'.......";
              ?>';
          Storage::disk('scripts')->put('/leer_correos/'.$request->input('ruc').'.php',$contenido_php);

          //Add a la lista de batch php
          $contenido_old = Storage::disk('scripts')->get('script.sh');
          $contenido_new=$contenido_old.' php leer_correos/'.$request->input('ruc').'.php;';
          $contenido_new = Storage::disk('scripts')->put('script.sh',$contenido_new);
          $contenido_old = Storage::disk('scripts')->get('script.sh');  

        //--------------------------------------------------------- FIN BATCH LEER CORREOS -----------------------------------------

    	return response()->json(['respuesta'=>true]);

    	
    }

    public function generar_xml_fac(Request $request){

      
      return response()->json(['respuesta'=>$request->all()]);
    }
    
}
