<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ability extends Model
{
    protected $table = 'abilities';

    protected $primaryKey = 'id_ability';

    protected $fillable = [
        'location',
        'type',
        'variants',
        'amounts',
        'weapon_classes',
        'weapon_sizes',
        'notes',
        'duration_type',
        'duration',
        'repeat_type',
        'repeat',
        'applies_to_fleet',
        'flagship_required',
        'for_class_ids',
        'target_class_ids',
        'conditions',
    ];

    protected $casts = [
        'variants' => 'array',
        'amounts' => 'array',
        'weapon_classes' => 'array',
        'weapon_sizes' => 'array',
        'for_class_ids' => 'array',
        'target_class_ids' => 'array',
        'conditions' => 'array',
        'applies_to_fleet' => 'boolean',
        'flagship_required' => 'boolean',
    ];

    /**
     * Relations
     */

    public function abilities()
    {
        return $this->morphTo();
    }
}
