<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\Admiral\Skill;

class Admiral extends Model
{
    use SoftDeletes;

    protected $table = 'admirals';
    protected $primaryKey = 'id_admiral';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
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
    public function skills()
    {
        return $this->hasMany(Skill::class, 'id_admiral', 'id_admiral');
    }



    /**
     * Methods
     */

    public function validateName(string $name): bool
    {
        if ($this->name === $name) {
            return true;
        }
        $admiral = static::where('name', $name)->where('id_admiral', '!=', $this->id_admiral)->first();
        return !!$admiral ? false : true;
    }
}
