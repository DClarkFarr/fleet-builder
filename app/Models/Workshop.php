<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workshop extends Model
{
    protected $table = 'workshops';
    protected $primaryKey = 'id_workshop';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'arcade',
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
    public function fleets()
    {
        return $this->hasMany(WorkshopFleet::class, 'id_workshop', 'id_workshop', 'fleets');
    }


    /**
     * Methods
     */
}
