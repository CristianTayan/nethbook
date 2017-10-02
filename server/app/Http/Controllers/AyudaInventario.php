<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// Extras
use DB;
use Carbon\Carbon;
use \Firebase\JWT\JWT;
use Config;
// Funciones
use App\libs\Funciones;

class AyudaInventario extends Controller
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
    
   public function Ayuda_Inventario_Save(Request $request)
    {
        $categorias=$request->categorias;
        $estado_descriptivo=$request->estado_descriptivo;
        $garantias=$request->garantias;
        $marcas=$request->marcas;
        $modelos=$request->modelos;
        $productos=$request->productos;
        $tipos_categorias=$request->tipos_categoria;
        $ubicacion=$request->ubicacion;
    // Guardar Categorias


        /*if (count($tipos_categorias)>0) {
           foreach ($tipos_categorias as $key => $value) {
                DB::connection($this->name_bdd)->table('inventario.tipos_categorias')->insert([
                    'nombre'=>$value['nombre'],
                    'descripcion'=>$value['descripcion'],
                    'estado'=>'A'
                    ]);
            }
        }

         if(count($categorias)>0) {
           foreach ($categorias as $key => $value) {
            $data_tipo_categoria=DB::connection($this->name_bdd)->table('inventario.tipos_categorias')->select('id')->where('nombre',$value['tipo_categoria'])->first();

                DB::connection($this->name_bdd)->table('inventario.categorias')->insert([
                    'nombre'=>$value['nombre'],
                    'descripcion'=>$value['descripcion'],
                    'tipo_categoria'=>$data_tipo_categoria->id,
                    'estado'=>'A'
                    ]);
            }
        }*/

        /*if(count($estado_descriptivo)>0) {
           foreach ($estado_descriptivo as $key => $value) {
                    DB::connection($this->name_bdd)->table('inventario.estado_descriptivo')->insert([
                    'nombre'=>$value['nombre'],
                    'descripcion'=>$value['descripcion'],
                    'estado'=>'A'
                    ]);
            }
        }*/

        /*if(count($marcas)>0) {
           foreach ($marcas as $key => $value) {
                DB::connection($this->name_bdd)->table('inventario.marcas')->insert([
                'nombre'=>$value['nombre'],
                'descripcion'=>$value['descripcion'],
                'estado'=>'A'
                ]);
            }
        }*/
        /*if(count($modelos)>0) {
           foreach ($modelos as $key => $value) {
                DB::connection($this->name_bdd)->table('inventario.modelos')->insert([
                'nombre'=>$value['nombre'],
                'descripcion'=>$value['descripcion'],
                'estado'=>'A'
                ]);
            }
        }*/

        if(count($ubicacion)>0) {
           foreach ($ubicacion as $key => $value) {
                DB::connection($this->name_bdd)->table('inventario.ubicaciones')->insert([
                'nombre'=>$value['nombre'],
                'descripcion'=>$value['descripcion'],
                'estado'=>'A'
                ]);
            }
        }


        

    return response()->json(['respuesta' => $request->all()], 200);
    }

}
