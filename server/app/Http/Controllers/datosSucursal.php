<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
class datosSucursal extends Controller
{
    // echo "Hola Mundo"
    public function Existe()
    {
    	return "Hola Mundo";
    //     $existencia=DB::connection($this->name_bdd)->table('inventario.tipos_productos')->where('estado','A')->where('nombre',$request->nombre)->get();
    //     if (count($existencia)==0) {
    //         return response()->json(['respuesta' => true], 200);
    //     }
    //     return response()->json(['respuesta' => false], 200);
    }
}
