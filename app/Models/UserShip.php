<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserShip extends Model
{
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
