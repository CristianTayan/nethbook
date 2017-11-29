<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// Extras
use \Firebase\JWT\JWT;
use Config;
use Carbon\Carbon;
  // Funciones
use App\libs\Funciones;
use App\libs\Funciones_fac;
//-------------------------------------- Autenticacion ---------------
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class Sesiones extends Controller {
  public function __construct(Request $request) {
    try{
      if ($request->token) {
        $this->funciones = new Funciones();
        $this->Funciones_fac = new Funciones_fac();
        $key = config('jwt.secret');
        $credentials = JWT::decode($request->token, $key, array('HS256'));
        $this->user = $credentials;
        $this->name_bdd = $this->user->nbdb;
      }
      
      if (!$request->token) {
        return response()->json(["respuesta" => true ,'new_token' => 'rokenNoAsignado']);
      }
      
    }catch (\Firebase\JWT\ExpiredException $e) {
      return response()->json(['respuesta' => $e->getMessage()], 401);
      die();
    }
  }
  public function Refresh_Token(Request $request) {	
  	$token = JWTAuth::refresh($request->token);
    $hora= Carbon::now(new \DateTimeZone('America/Guayaquil'));
    $hora_fin=$hora->addMinutes(config('jwt.ttl'));
    $hora_fin=$hora_fin->toDateTimeString();
  	return response()->json(["respuesta" => true ,'new_token' => $token, 'hora_fin' => $hora_fin]);
  }

  public function closeSession(Request $request) {
    if ($request->token) {
      JWTAuth::invalidate($request->token);
      return response()->json(["respuesta" => true, 'info' => 'tokenfinalizado']);
    }
    if (!$request->token) {
      return response()->json(["respuesta" => true, 'info' => 'tokenNoExiste']);
    }
  }
}
