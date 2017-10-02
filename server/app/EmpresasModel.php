<?php

namespace App;

use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Model;

class EmpresasModel extends Model
{
	use Searchable;
    //

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    public $connection='infoconex';
    public $table='empresas';
    protected $primaryKey='id';
    public $timestamps=false;
    public $incrementing=false;
    protected $fillable = [
	'ruc',
	'razon_social',
	'nombre_comercial',
   	'actividad_economica'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        // 'clave_clave',
    ];

    public function searchableAs()
	{
	    return 'empresas_index';
	}

	public function toSearchableArray()
	{
	    $array = [
    'ruc'=>$this->ruc,
    'razon_social'=>$this->razon_social,
    'nombre_comercial'=>$this->nombre_comercial,
    'actividad_economica'=>$this->nombre_comercial
    ];
	    // Customize array...
	    return $array;
	 
	}
}
