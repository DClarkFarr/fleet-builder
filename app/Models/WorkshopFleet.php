<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkshopFleet extends Model
{
    protected $table = 'workshop_fleets';
    protected $primaryKey = 'id_workshop_fleet';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_workshop',
        'id_user',
        'name',
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
        'arcade' => 'boolean',
    ];


    /**
     * Relations
     */

    public function ships()
    {
        return $this->belongsToMany(UserShip::class, 'workshop_fleet_rel', 'id_workshop_fleet', 'id_user_ship', 'id_user_ship', 'id_workshop_fleet', 'ships');
    }


    /**
     * Methods
     */
}
