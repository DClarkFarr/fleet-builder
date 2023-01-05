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


    /**
     * Relations
     */


    /**
     * Methods
     */

    public function validateName($name)
    {
        if (strlen($name < 3)) {
            return false;
        }

        if ($name !== $this->name) {
            $shipClass = ShipClass::where('name', $name)->where('id_class', '!=', $this->id_class)->first();

            if ($shipClass) {
                return false;
            }
        }

        return true;
    }
}
