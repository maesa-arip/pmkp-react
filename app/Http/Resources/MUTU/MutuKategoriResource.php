<?php

namespace App\Http\Resources\MUTU;

use Illuminate\Http\Resources\Json\JsonResource;

class MutuKategoriResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'joined' => $this->created_at->diffForHumans(),
        ];
    }
}
