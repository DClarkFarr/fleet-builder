<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipLevel extends Model
{
    protected $table = 'ship_levels';
    protected $primaryKey = 'id_level';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'sort',
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
    protected $casts = [];
}
