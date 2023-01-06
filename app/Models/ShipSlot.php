<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShipSlot extends Model
{
    protected $table = 'ship_slots';
    protected $primaryKey = 'id_slot';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_ship',
        'type',
        'size',
        'amount',
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
