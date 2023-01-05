<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ship extends Model
{
    protected $table = 'ships';
    protected $primaryKey = 'id_ship';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_class',
        'id_level',
        'energy',
        'name',
        'public',
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
        'public' => 'boolean',
    ];


    /**
     * Relations
     */
    public function shipClass()
    {
        return $this->belongsTo(ShipClass::class, 'id_class', 'id_class', 'shipClass');
    }

    public function shipLevel()
    {
        return $this->belongsTo(ShipLevel::class, 'id_level', 'id_level', 'shipLevel');
    }

    /**
     * Methods
     */

    public function validateName(string $name): bool
    {
        if ($this->name === $name) {
            return true;
        }
        $ship = Ship::where('name', $name)->where('id_ship', '!=', $this->id_ship)->first();
        return !!$ship ? false : true;
    }
}
