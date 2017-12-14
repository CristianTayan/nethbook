<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
// Modelos
use App\empresas;
use App\Usuarios;
use App\ingresos_usuarios;
// Autenticacion 
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
// Funciones
use App\libs\Funciones;
// Extras
use Carbon\Carbon;
use Mail;
use DB;
use Config;
use Hash;
use \Firebase\JWT\JWT;
class infPersonal extends Controller
{

    // public function __construct(Request $request){
    //     try{
    //     // Funciones
    //     $this->funciones=new Funciones();
    //     //Autenticacion
    //     $key=config('jwt.secret');
    //     $decoded = JWT::decode($request->token, $key, array('HS256'));
    //     $this->user=$decoded;
    //     $this->name_bdd=$this->user->nbdb;
    //     }catch (\Firebase\JWT\ExpiredException $e) {
    //         return response()->json(['respuesta' => $e->getMessage()],401);
    //         die();
    //     }
    // }
    public function datosConfPersonal(Request $request)
    {
      $name_bdd = 'comercial_h_1090084247001';
        $existencia=DB::connection($name_bdd)->
        table('public.personas_correo_electronico')->get();

          echo $existencia;

        // if (count($existencia)==0) {
        //     return response()->json(['respuesta' => true], 200);
        // }
        // return response()->json(['respuesta' => false], 200);
    }

    public function index()
    {
        $name_bdd = 'localidadesconex';

         $existencia=DB::connection($name_bdd)->
         table('usuarios.usuarios')->get();
         echo $existencia;
       
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
