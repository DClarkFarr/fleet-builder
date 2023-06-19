<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserShip extends Model
{
    use SoftDeletes;

    protected $table = 'user_ships';
    protected $primaryKey = 'id_user_ship';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_user',
        'id_ship',
        'name',
        'chip_level',
        'visible',
        'level',
        'columns',
        'stat_img',
        'stat_dpr',
        'stat_acu',
        'stat_hp',
        'stat_shd',
        'stat_armor',
        'stat_evd',
        'stat_ftl',
        'stat_stl',
        'stat_res_kinetic',
        'stat_res_beam',
        'stat_res_missile',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'visible' => 'boolean',
        'columns' => 'array',
    ];


    /**
     * Relations
     */
    public function ship()
    {
        return $this->belongsTo(Ship::class, 'id_ship', 'id_ship', 'ship');
    }



    /**
     * Methods
     */
}
