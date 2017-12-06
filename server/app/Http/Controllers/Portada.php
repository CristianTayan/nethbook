<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Http\Requests;
//------------------------------------ Autenticacion --------------------
use \Firebase\JWT\JWT;
//------------------------------------ Funciones --------------------
use App\libs\Funciones;
//---------------------------- Extras 
use Storage;
use File;
use DB;
use Image;
class Portada extends Controller {

  public function __construct(Request $request){
    try{
      // Funciones
      $this->funciones=new Funciones();
      //Autenticacion
      $key=config('jwt.secret');
      $decoded = JWT::decode($request->token, $key, array('HS256'));
      $this->user=$decoded;
      $this->name_bdd=$this->user->nbdb;
      //------------------------------------ Paths -------------------------------
      $this->pathImg  = config('global.pathimgPortadas');
      $this->pathLocal  = Storage::disk('local')->getDriver()->getAdapter()->getPathPrefix();

    }catch (\Firebase\JWT\ExpiredException $e) {
      return response()->json(['respuesta' => $e->getMessage()],401);
      die();
    }
  }

  public function Add_Img_Portada(Request $request){
    
    $crop = $request->img['crop'];
    $full = $request->img['full'];
    // Guardar Recorte
    $filename=$this->base64_to_img($crop,1000,'Portadas',$this->name_bdd);
    $img_dir_crop="storage/".$this->name_bdd.'/Portadas/'.$filename;
    //Guardar imagen full
    $filename=$this->base64_to_img($full,800,'Portadas',$this->name_bdd);
    $img_dir_full="storage/".$this->name_bdd.'/Portadas/'.$filename;
    

    DB::connection($this->name_bdd)->
      table('administracion.imagen_empresa')->
      where('sucursal',$request->sucursal)->where('estado','A')->
      where('tipo_imagen',1)->
      update(['estado'=>'P']);
    
    $save=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->insert([
      'sucursal'=>$request->sucursal,
      'direccion_imagen_empresa'=>$img_dir_full,
      'direccion_imagen_recorte'=>$img_dir_crop,
      'estado'=>'A',
      'tipo_imagen'=>1
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

      $directorio = storage_path().'/'.$name_bdd;
      if (!file_exists($directorio)) {
        mkdir(storage_path().'/'.$name_bdd, 0777, true);
        mkdir(storage_path().'/'.$name_bdd.'/Perfil/', 0777, true);
        mkdir(storage_path().'/'.$name_bdd.'/Portadas/', 0777, true);
        mkdir(storage_path().'/'.$name_bdd.'/PortadasUsuario/', 0777, true);
        mkdir(storage_path().'/'.$name_bdd.'/PerfilUsuario/', 0777, true);
      }

      $img->save(storage_path().'/'.$name_bdd.'/'.$tipo_img.'/'.$id_img);
      
      return $id_img;
    }
    public function Set_Img_Portada(Request $request){
        DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->where('sucursal',$request->sucursal)->where('estado','=','A')->where('tipo_imagen',1)->update(['estado'=>'P']);
        $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->where('id',$request->img)->update(['estado'=>'A']);
        if ($resultado) {
            return response()->json(["respuesta"=>true]);
        }else return response()->json(["respuesta"=>false]);
    }

    public function Load_Imgs_Portada(Request $request){
        $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
        ->select('direccion_imagen_empresa','id','direccion_imagen_recorte')
        ->where('sucursal',$request->sucursal)
        ->where('estado','P')
        ->where('tipo_imagen',1)
        ->orderBy('fecha','DESC')
        ->get();
        $total=count($resultado);

        $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
        ->select('direccion_imagen_empresa','id','direccion_imagen_recorte')
        ->where('sucursal',$request->sucursal)
        ->where('estado','P')
        ->where('tipo_imagen',1)
        ->orderBy('fecha','DESC')
        ->limit(500)
        ->get();
        return response()->json(["imgs"=>$resultado,'total'=>$total]);
    }

    public function Get_Img_Portada(Request $request){
    $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->select('direccion_imagen_recorte','direccion_imagen_empresa')->where('sucursal',$request->sucursal)->where('estado','=','A')->where('tipo_imagen',1)->first();
    if (count($resultado)>0) {
    $data=explode('/', $resultado->direccion_imagen_recorte);
    $img=$data[count($data)-1];
    $path=storage_path().'/'.$this->name_bdd.'/Portadas/'.$img;
    if (File::exists($path)) {
        return response()->json(['existe'=>true,"img"=>$resultado->direccion_imagen_recorte,'img_full'=>$resultado->direccion_imagen_empresa]);
    }else{
        return response()->json(['existe'=>false,"img"=>config('global.pathPortadaDefault')]);
    }
    }
    return response()->json(['existe'=>false,"img"=>config('global.pathPortadaDefault')]);
    }

    public function Delete_Img_Portada(Request $request){
        $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->where('id',$request->img)->update(['estado'=>'I']);
        if ($resultado) {
            return response()->json(['respuesta'=>true]); 
        }    
    }
    //USUARIO    
    public function Get_Img_PortadaUsuario(Request $request){
      $res = DB::connection($this->name_bdd)->
        table('administracion.imagen_empresa')->
        select('direccion_imagen_recorte','direccion_imagen_empresa')->
        //where('sucursal',$request->sucursal)->
        where('estado','=','A')->
        where('tipo_imagen',4)->
        orderBy('fecha','DESC')->
        first();
      if (count($res)>0) {
        $data=explode('/', $res->direccion_imagen_recorte);
        $img=$data[count($data)-1];
        $path=storage_path().'/'.$this->name_bdd.'/PortadasUsuario/'.$img;
        if (File::exists($path)) {
          return 
          response()->json(['existe'=>true,"img"=>$res->direccion_imagen_recorte,'img_full'=>$res->direccion_imagen_empresa]);
        }else{
          return response()->json(['existe'=>false,"img"=>config('global.pathPortadaDefault')]);
        }
      }
      return response()->json(['existe'=>false,"img"=>config('global.pathPortadaDefault')]);
    }

    public function Add_Img_PortadaUsuario(Request $request){
      $crop = $request->img['crop'];
      $full = $request->img['full'];
      // Guardar Recorte
      $filename=$this->base64_to_img($crop,1000,'PortadasUsuario',$this->name_bdd);
      $img_dir_crop="storage/".$this->name_bdd.'/PortadasUsuario/'.$filename;
      //Guardar imagen full
      $filename=$this->base64_to_img($full,800,'PortadasUsuario',$this->name_bdd);
      $img_dir_full="storage/".$this->name_bdd.'/PortadasUsuario/'.$filename;      

      DB::connection($this->name_bdd)->
        table('administracion.imagen_empresa')->
        where('sucursal',$request->sucursal)->
        where('estado','A')->
        where('tipo_imagen',4)->
        update(['estado'=>'P']);
      
      $save=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->insert([
        'sucursal'=>$request->sucursal,
        'direccion_imagen_empresa'=>$img_dir_full,
        'direccion_imagen_recorte'=>$img_dir_crop,
        'estado'=>'A',
        'tipo_imagen'=>4
      ]);

      if ($save) {
        return response()->json(["respuesta"=>true,"img"=>$img_dir_crop]);
      }else return response()->json(["respuesta"=>false,"img"=>'']);

    }

    public function Set_Img_PortadaUsuario(Request $request){
      DB::connection($this->name_bdd)->
        table('administracion.imagen_empresa')->
        // where('sucursal',$request->sucursal)->
        where('estado','=','A')->
        where('tipo_imagen',4)->
        update(['estado'=>'P']);
        
        $resultado=DB::connection($this->name_bdd)->
        table('administracion.imagen_empresa')->
        where('id',$request->img)->
        update(['estado'=>'A']);
      if ($resultado) {
          return response()->json(["respuesta"=>true]);
      }else return response()->json(["respuesta"=>false]);
    }

    public function Load_Imgs_PortadaUsuario(Request $request){

      $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
      ->select('direccion_imagen_empresa','id','direccion_imagen_recorte')
      // ->where('sucursal',$request->sucursal)
      ->where('estado','P')
      ->where('tipo_imagen',4)
      ->orderBy('fecha','DESC')
      ->get();
      $total=count($resultado);

      $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
      ->select('direccion_imagen_empresa','id','direccion_imagen_recorte')
      // ->where('sucursal',$request->sucursal)
       ->where('estado','P')
      ->where('tipo_imagen',4)
      ->orderBy('fecha','DESC')
      ->limit(500)
      ->get();

      return response()->json(["imgs"=>$resultado,'total'=>$total]);
    }


    public function Delete_Img_PortadaUsuario(Request $request){
      $resultado=DB::connection($this->name_bdd)->
      table('administracion.imagen_empresa')->
      where('id',$request->img)->
      update(['estado'=>'I']);
      if ($resultado) {
          return response()->json(['respuesta'=>true]); 
      }        
    }

}
