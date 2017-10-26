<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
///------------------------------------ Autenticacion --------------------
use \Firebase\JWT\JWT;
//------------------------------------ Funciones --------------------
use App\libs\Funciones;
//---------------------------- Extras 
use Storage;
use File;
use DB;
use Image;
class Perfil extends Controller
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

    public function Add_Img_Perfil(Request $request){
    
    $crop = $request->img['crop'];
    $full = $request->img['full'];
    // Guardar Recorte
    $filename=$this->base64_to_img($crop,600,'Perfil',$this->name_bdd);
    $img_dir_crop="storage/".$this->name_bdd.'/Perfil/'.$filename;
    //Guardar imagen full
    $filename=$this->base64_to_img($full,700,'Perfil',$this->name_bdd);
    $img_dir_full="storage/".$this->name_bdd.'/Perfil/'.$filename;
    

    DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->where('sucursal',$request->sucursal)->where('estado','A')->where('tipo_imagen',2)->update(['estado'=>'P']);
    $save=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->insert([
        'sucursal'=>$request->sucursal,
        'direccion_imagen_empresa'=>$img_dir_full,
        'direccion_imagen_recorte'=>$img_dir_crop,
        'estado'=>'A',
        'tipo_imagen'=>2
                 ]);

    if ($save) {
        return response()->json(["respuesta"=>true,"img"=>$img_dir_crop]);
    }else return response()->json(["respuesta"=>false,"img"=>'']);

    }
    private function base64_to_img($base64,$width,$tipo_img,$name_bdd){
        $id_img=$this->funciones->generarID();
        $img = Image::make($base64);
        $img->encode('jpg',0);
        $img->resize($width, null, function ($constraint) {
            $constraint->aspectRatio();
        });
        $img->save(storage_path().'/'.$name_bdd.'/'.$tipo_img.'/'.$id_img);
        
        return $id_img;
    }

    public function Set_Img_Perfil(Request $request){
        DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->where('sucursal',$request->sucursal)->where('estado','A')->where('tipo_imagen',2)->update(['estado'=>'P']);
        $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->where('id',$request->img)->update(['estado'=>'A']);
        if ($resultado) {
            return response()->json(["respuesta"=>true]);
        }else return response()->json(["respuesta"=>false]);
    }

    public function Load_Imgs_Perfil(Request $request){

        $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
        ->select('direccion_imagen_empresa','id','direccion_imagen_recorte')
        ->where('sucursal',$request->sucursal)
        ->where('estado','P')
        ->where('tipo_imagen',2)
        ->orderBy('fecha','DESC')
        ->limit(500)
        ->get();
        return response()->json(["imgs"=>$resultado]);
    }

    public function Get_Img_Perfil(Request $request){
    $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->select('direccion_imagen_recorte','direccion_imagen_empresa')->where('sucursal',$request->sucursal)->where('estado','A')->where('tipo_imagen',2)->first();
    if (count($resultado)>0) {
    $data=explode('/', $resultado->direccion_imagen_recorte);
    $img=$data[count($data)-1];
    $path=storage_path().'/'.$this->name_bdd.'/Perfil/'.$img;
    if (File::exists($path)) {
        return response()->json(['existe'=>true,"img"=>$resultado->direccion_imagen_recorte,'img_full'=>$resultado->direccion_imagen_empresa]);
    }else{
        return response()->json(['existe'=>false,"img"=>config('global.pathPerfilDefault')]);
    }
    }
    return response()->json(['existe'=>false,"img"=>config('global.pathPerfilDefault')]);
    }

    public function Delete_Img_Perfil(Request $request){
        $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->where('id',$request->img)->update(['estado'=>'I']);
        if ($resultado) {
            return response()->json(['respuesta'=>true]); 
        }
    }
}
