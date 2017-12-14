<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use \Firebase\JWT\JWT;
use App\libs\Funciones;
use Storage;
use File;
use DB;
use Image;
class Perfil extends Controller {

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
    

    DB::connection($this->name_bdd)->
      table('administracion.imagen_empresa')->
      where('sucursal',$request->sucursal)->
      where('estado','A')->
      where('tipo_imagen',2)->
      update(['estado'=>'P']);
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

    public function verificarExistenciaDirectorio($name_bdd, $tipo_img){
      if (!file_exists(storage_path().'/'.$name_bdd))
        mkdir(storage_path().'/'.$name_bdd, 0777, true);
      if (file_exists(storage_path().'/'.$name_bdd)) {
        if (!file_exists(storage_path().'/'.$name_bdd.'/'.$tipo_img))
          mkdir(storage_path().'/'.$name_bdd.'/'.$tipo_img, 0777, true);
      }
    }

    private function base64_to_img($base64,$width,$tipo_img,$name_bdd){
      $id_img=$this->funciones->generarID();
      $img = Image::make($base64);
      $img->encode('jpg',0);
      $img->resize($width, null, function ($constraint) {
          $constraint->aspectRatio();
      });
      $this->verificarExistenciaDirectorio($name_bdd, $tipo_img);
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
    $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->select('direccion_imagen_recorte','direccion_imagen_empresa')->
    where('sucursal',$request->sucursal)->
    where('estado','A')->where('tipo_imagen',2)->first();
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

    // -----------< perfil Usuario >---------------------------------
    public function Add_Img_PerfilUsuario(Request $request){
    
      $crop = $request->img['crop'];
      $full = $request->img['full'];
      // Guardar Recorte
      $filename=$this->base64_to_img($crop,600,'PerfilUsuario',$this->name_bdd);
      $img_dir_crop="storage/".$this->name_bdd.'/PerfilUsuario/'.$filename;
      //Guardar imagen full
      $filename=$this->base64_to_img($full,700,'PerfilUsuario',$this->name_bdd);
      $img_dir_full="storage/".$this->name_bdd.'/PerfilUsuario/'.$filename;

      DB::connection($this->name_bdd)->
          table('administracion.imagen_empresa')->where('sucursal',$request->sucursal)->where('estado','A')->where('tipo_imagen',5)->update(['estado'=>'P']);
      $save=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->insert([
          'sucursal'=>$request->sucursal,
          'direccion_imagen_empresa'=>$img_dir_full,
          'direccion_imagen_recorte'=>$img_dir_crop,
          'estado'=>'A',
          'tipo_imagen'=>5
                   ]);

      if ($save) {
          return response()->json(["respuesta"=>true,"img"=>$img_dir_crop]);
      }else {return response()->json(["respuesta"=>false,"img"=>'']);}

    }

    public function Set_Img_PerfilUsuario(Request $request){
        DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->
        // where('sucursal',$request->sucursal)->
        where('estado','A')->where('tipo_imagen',5)->
        update(['estado'=>'P']);
        $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->where('id',$request->img)->update(['estado'=>'A']);
        if ($resultado) {
            return response()->json(["respuesta"=>true]);
        }else return response()->json(["respuesta"=>false]);
    }

    public function Load_Imgs_PerfilUsuario(Request $request){
      $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
      ->select('direccion_imagen_empresa','id','direccion_imagen_recorte')
      // ->where('sucursal',$request->sucursal)
      ->where('estado','P')
      ->where('tipo_imagen',5)
      ->orderBy('fecha','DESC')
      ->limit(500)
      ->get();
      return response()->json(["imgs"=>$resultado]);
    }

    public function getImgPerfilAndPortadaUsuario(Request $request){
      $imgPerfilPersona = DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
      ->select('direccion_imagen_recorte')
      ->where('estado','A')
      ->where('tipo_imagen', 5)
      ->first();

      $imgPortadaPersonal = DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
      ->select('direccion_imagen_recorte')
      ->where('estado','A')
      ->where('tipo_imagen', 4)
      ->first();
      $resultado = array();
      if ($imgPerfilPersona) {
        $resultado['imgPerfil'] = $imgPerfilPersona->direccion_imagen_recorte;        
      }

      if ($imgPortadaPersonal) {
        $resultado['imgPortada'] = $imgPortadaPersonal->direccion_imagen_recorte;
      }

      if (!$imgPerfilPersona) {
        $resultado['imgPerfil'] = 'storage/default/avatar-default';        
      }

      if (!$imgPortadaPersonal) {
        $resultado['imgPortada'] = 'storage/default/portada-default.jpg';
      }
      return response()->json($resultado);
    }

    public function getImgPerfilAndPortadaSucursal(Request $request){
      $imgPerfilPersona = DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
      ->select('direccion_imagen_recorte')
      ->where('sucursal',$request->sucursal)
      ->where('estado','A')
      ->where('tipo_imagen', 2)
      ->first();

      $imgPortadaPersonal = DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
      ->select('direccion_imagen_recorte')
      ->where('sucursal',$request->sucursal)
      ->where('estado','A')
      ->where('tipo_imagen', 1)
      ->first();
      $resultado = array();
      if ($imgPerfilPersona) {
        $resultado['imgPerfil'] = $imgPerfilPersona->direccion_imagen_recorte;        
      }

      if ($imgPortadaPersonal) {
        $resultado['imgPortada'] = $imgPortadaPersonal->direccion_imagen_recorte;
      }

      if (!$imgPerfilPersona) {
        $resultado['imgPerfil'] = 'storage/default/avatar-default';        
      }

      if (!$imgPortadaPersonal) {
        $resultado['imgPortada'] = 'storage/default/portada-default.jpg';
      }
      return response()->json($resultado);
    }

    public function getImgPerfilAndPortadaEmpresa(Request $request){
      $imgPerfilPersona = DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
      ->select('direccion_imagen_recorte')
      ->where('estado','A')
      ->where('tipo_imagen', 8)
      ->first();

      $imgPortadaPersonal = DB::connection($this->name_bdd)->table('administracion.imagen_empresa')
      ->select('direccion_imagen_recorte')
      ->where('estado','A')
      ->where('tipo_imagen', 7)
      ->first();
      $resultado = array();
      if ($imgPerfilPersona) {
        $resultado['imgPerfil'] = $imgPerfilPersona->direccion_imagen_recorte;        
      }

      if ($imgPortadaPersonal) {
        $resultado['imgPortada'] = $imgPortadaPersonal->direccion_imagen_recorte;
      }

      if (!$imgPerfilPersona) {
        $resultado['imgPerfil'] = 'storage/default/avatar-default';        
      }

      if (!$imgPortadaPersonal) {
        $resultado['imgPortada'] = 'storage/default/portada-default.jpg';
      }
      return response()->json($resultado);
    }


    public function Get_Img_PerfilUsuario(Request $request){
    $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->select('direccion_imagen_recorte','direccion_imagen_empresa')->
    // where('sucursal',$request->sucursal)->
    where('estado','A')->where('tipo_imagen',5)->first();
    if (count($resultado)>0) {
    $data=explode('/', $resultado->direccion_imagen_recorte);
    $img=$data[count($data)-1];
    $path=storage_path().'/'.$this->name_bdd.'/PerfilUsuario/'.$img;
    if (File::exists($path)) {
        return response()->json(['existe'=>true,"img"=>$resultado->direccion_imagen_recorte,'img_full'=>$resultado->direccion_imagen_empresa]);
    }else{
        return response()->json(['existe'=>false,"img"=>config('global.pathPerfilDefault')]);
    }
    }
    return response()->json(['existe'=>false,"img"=>config('global.pathPerfilDefault')]);
    }

    public function Delete_Img_PerfilUsuario(Request $request){
        $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->where('id',$request->img)->update(['estado'=>'I']);
        if ($resultado) {
            return response()->json(['respuesta'=>true]); 
        }
    }
  //PERFIL EMPRESA
    public function add_Img_PerfilEmpresa(Request $request){
      $crop = $request->img['crop'];
      $full = $request->img['full'];
      $filename=$this->base64_to_img($crop,600,'PerfilEmpresa',$this->name_bdd);
      $img_dir_crop="storage/".$this->name_bdd.'/PerfilEmpresa/'.$filename;
      $filename=$this->base64_to_img($full,700,'PerfilEmpresa',$this->name_bdd);
      $img_dir_full="storage/".$this->name_bdd.'/PerfilEmpresa/'.$filename;
      DB::connection($this->name_bdd)->
        table('administracion.imagen_empresa')->
        where('sucursal',$request->sucursal)->
        where('estado','A')->
        where('tipo_imagen',8)->
        update(['estado'=>'P']);
      $save=DB::connection($this->name_bdd)->
        table('administracion.imagen_empresa')->
        insert([
          'sucursal'=>$request->sucursal,
          'direccion_imagen_empresa'=>$img_dir_full,
          'direccion_imagen_recorte'=>$img_dir_crop,
          'estado'=>'A',
          'tipo_imagen' => 8
        ]);
      if ($save) {
        return response()->json(["respuesta"=>true,"img"=>$img_dir_crop]);
      }else 
        return response()->json(["respuesta"=>false,"img"=>'']);
    }

    public function Set_Img_PerfilEmpresa(Request $request){
      DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->
      // where('sucursal',$request->sucursal)->
      where('estado','A')->
      where('tipo_imagen',8)->
      update(['estado'=>'P']);
      $resultado=DB::connection($this->name_bdd)->
      table('administracion.imagen_empresa')->
      where('id',$request->img)->
      update(['estado'=>'A']);
      if ($resultado) {
        return response()->json(["respuesta"=>true]);
      }else 
        return response()->json(["respuesta"=>false]);
    }

    public function Load_Imgs_PerfilEmpresa(Request $request){
      $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->
      select('direccion_imagen_empresa','id','direccion_imagen_recorte')->
      //where('sucursal',$request->sucursal)->
      where('estado','P')->
      where('tipo_imagen',8)->
      orderBy('fecha','DESC')->
      limit(500)->
      get();
      return response()->json(["imgs"=>$resultado]);
    }

    public function Get_Img_PerfilEmpresa(Request $request){
      $resultado=DB::connection($this->name_bdd)->
      table('administracion.imagen_empresa')->
      select('direccion_imagen_recorte','direccion_imagen_empresa')->
      // where('sucursal',$request->sucursal)->
      where('estado','A')->
      where('tipo_imagen',8)->
      orderBy('fecha', 'ASC')->
      first();
      if (count($resultado)>0) {
        $data=explode('/', $resultado->direccion_imagen_recorte);
        $img=$data[count($data)-1];
        $path=storage_path().'/'.$this->name_bdd.'/PerfilEmpresa/'.$img;
        if (File::exists($path)) {
            return response()->json(['existe'=>true,"img"=>$resultado->direccion_imagen_recorte,'img_full'=>$resultado->direccion_imagen_empresa]);
        }else{
            return response()->json(['existe'=>false,"img"=>config('global.pathPerfilDefault')]);
        }
      }
      return response()->json(['existe'=>false,"img"=>config('global.pathPerfilDefault')]);
    }

    public function Delete_Img_PerfilEmpresa(Request $request){
      $resultado=DB::connection($this->name_bdd)->table('administracion.imagen_empresa')->where('id',$request->img)->update(['estado'=>'I']);
      if ($resultado) {
        return response()->json(['respuesta'=>true]); 
      }
    }
}
