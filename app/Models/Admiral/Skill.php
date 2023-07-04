<?php

namespace App\Models\Admiral;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $table = 'admiral_skills';
    protected $primaryKey = 'id_admiral_skill';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_admiral',
        'level',
        'location',
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
    protected $casts = [];


    /**
     * Relations
     */
    public function admiral()
    {
        return $this->belongsTo(Admiral::class);
    }


    /**
     * Methods
     */
}
