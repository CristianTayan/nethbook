<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class empresas extends Model
{
	protected $primaryKey='id';
	public $timestamps = false;
	public $incrementing=false;
	protected $connection='nextbookconex';
    protected $fillable=['id', 'razon_social', 'actividad_economica', 'ruc_ci', 'estdo_contribuyente', 
       'fecha_inicio_actividades', 'nombre_comercial', 'obligado_lleva_contabilida', 
       'tipo_contribuyente', 'id_estado', 'fecha_creacion','nick'];
}
