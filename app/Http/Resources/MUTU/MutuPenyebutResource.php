<?php

namespace App\Http\Resources\MUTU;

use Illuminate\Http\Resources\Json\JsonResource;

class MutuPenyebutResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'multiplier' => $this->multiplier,
            'joined' => $this->created_at->diffForHumans(),
        ];
    }
}
