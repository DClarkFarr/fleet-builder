<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserAdmiral extends Model
{
    use SoftDeletes;

    protected $table = 'user_admirals';
    protected $primaryKey = 'id_user_admiral';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_user',
        'id_admiral',
        'visible',
        'level',
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
        'skills' => 'array',
        'formations' => 'array',
    ];


    /**
     * Relations
     */
    public function admiral()
    {
        return $this->belongsTo(Admiral::class, 'id_admiral', 'id_admiral', 'admiral');
    }


    /**
     * Methods
     */
}
