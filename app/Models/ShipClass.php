<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipClass extends Model
{
    protected $table = 'ship_classes';
    protected $primaryKey = 'id_class';

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
