<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CelahPengendalian extends Model
{
    protected $fillable = ['name', 'description', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public static function allowedValues(?string $current = null): array
    {
        $values = static::where('is_active', true)->pluck('name');
        if ($current !== null && $current !== '') {
            $values->push($current);
        }

        return $values->unique()->values()->all();
    }
}
