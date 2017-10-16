<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use DB;

class Vistas extends Controller
{


    public function add_vistas_recursive($arr,$id_padre,$nivel_arbol,$name_bdd)
    {       
            $nivel_arbol++;
            $data_padre=DB::connection($name_bdd)->table('administracion.vistas')->select('path','url')->where('id',$id_padre)->first();
            
            foreach ($arr as $row) {
                if (count($data_padre)==0) {
                $path='/'.$row['nick_path'];
                $url=$row['nick_url'];
            }else{
                $path=$data_padre->path.'/'.$row['nick_path'];
                $url=$data_padre->url.'.'.$row['nick_url'];
            }
               $last_id= DB::connection($name_bdd)->table('administracion.vistas')->insertGetId([
                    'nombre'=>$row['label'],
                    'path'=>$path,
                    'url'=>$url,
                    'estado'=>'A',
                    'personalizacion'=>json_encode($row['personalizacion']),
                    'id_padre'=>$id_padre,
                    'nivel_arbol'=>$nivel_arbol
                    ]);
                $this->add_vistas_recursive($row['children'],$last_id,$nivel_arbol,$name_bdd);
            }
    } 
  
    //---------------------------------- INICIO VISTAS -----------
    public function Add_Vistas($array,$bdd_name)
    {
        DB::connection($bdd_name)->table('administracion.vistas')->delete();
        $this->add_vistas_recursive($array,0,-1,$bdd_name);

    return response()->json(['respuesta' => true], 200);
    }

     public function Gen_Privilegios_Admin($bdd_name)
    {   

       DB::connection($bdd_name)->table('administracion.usuarios_privilegios')->delete();
        
       $array=DB::connection($bdd_name)->table('administracion.vistas')->get();
       foreach ($array as $key => $value) {
            DB::connection($bdd_name)->table('administracion.usuarios_privilegios')->insert([
                'estado'=>'A',
                'id_vista'=>$value->id,
                'id_tipo_usuario'=>1,
                'id_tipo_accion_vistas'=>1
                ]);
       }
       return response()->json(['respuesta' => true], 200); 
    }

    //---------------------------------- INICIO VISTAS -----------
    public function Get_Vistas($array,$name_bdd)
    {
        $vistas=$this->get_all_vistas($array,$name_bdd);
        return $vistas;
    }

    public function Get_Vistas_Update($array,$name_bdd)
    {
        $vistas=$this->get_all_vistas($array,$name_bdd);
        return $vistas;
    }
    //--------------------------------------------- GET TODAS LAS VISTAS ------------------------------
    public function get_all_vistas($arr,$name_bdd)
    {

            foreach ($arr as $row) {
                $hijos=DB::connection($name_bdd)->select("SELECT id,nombre,path,url,personalizacion,estado,nivel_arbol FROM administracion.vistas WHERE id_padre='".$row->id."' and estado='A' Order BY nombre ASC");
                $switch=($row->estado=='I')?false:true;
                $row->estado_s=$switch;
                $row->children=$hijos;
                $row->personalizacion=json_decode($row->personalizacion);

                $permisos=DB::connection($name_bdd)->table('administracion.tipo_accion_vista')
                ->where('estado', 'A')
                ->where('accion_ver', TRUE)
                ->where('accion_guardar', TRUE)
                ->where('accion_modificar', TRUE)
                ->first();
                
                $row->permisos=$permisos;
                $this->get_all_vistas($row->children,$name_bdd);
            }

            return $arr;
    }
    //-------------------------------------------------------- GET VISTAS PARA EDITAR POR TIPO DE USUARIO---------------------------------

    public function get_vistas_col_update($arr,$name_bdd,$id_tipo_usuario)
    {

            foreach ($arr as $row) {
                $hijos=DB::connection($name_bdd)->select("SELECT id,nombre,path,url,personalizacion,estado FROM administracion.vistas WHERE id_padre='".$row->id."' Order BY nombre ASC");
                $switch=($row->estado=='I')?false:true;
                $row->estado_s=$switch;
                $row->children=$hijos;
                $row->personalizacion=json_decode($row->personalizacion);

                $permisos=DB::connection($name_bdd)->table('administracion.usuarios_privilegios')->where('estado', 'A')->where('id_vista', $row->id)->where('id_tipo_usuario', $id_tipo_usuario)->first();
                if (count($permisos)>0) {
                    //$permisos->id_tipo_accion_vistas;
                    $permisos=DB::connection($name_bdd)->table('administracion.tipo_accion_vista')->where('estado', 'A')
                ->where('id', $permisos->id_tipo_accion_vistas)->first();
                }else{
                    $permisos=[];
                }
                $row->permisos=$permisos;
                $this->get_vistas_col_update($row->children,$name_bdd,$id_tipo_usuario);
            }

            return $arr;
    }


}
