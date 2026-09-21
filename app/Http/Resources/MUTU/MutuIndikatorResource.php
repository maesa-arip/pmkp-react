<?php

namespace App\Http\Resources\MUTU;

use Illuminate\Http\Resources\Json\JsonResource;

class MutuIndikatorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $user = $request->user();

        return parent::toArray($request) + [
            // Mirrors MutuIndicatorInput::authorize(): read access is wider than edit access,
            // because canViewAll() also accepts the super admin role while editing does not.
            'can_edit' => (bool) $user?->can('lihat semua data indikator mutu')
                || (int) $this->location_id === (int) $user?->pic?->location_id,
        ];
    }
}
