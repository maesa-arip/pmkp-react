<?php

namespace App\Http\Resources\IKP;

use Illuminate\Http\Resources\Json\JsonResource;

class IKPDampakResource extends JsonResource
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
            'value' => $this->value,
            'name' => $this->name,
            'description' => $this->description,
            'joined' => $this->created_at->diffForHumans(),
        ];
    }
}
