<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RiskGradingResource extends JsonResource
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
            'kode' => (string) $this->kode,
            'tahun' => $this->tahun,
            'name' => $this->name,
            'warna' => $this->warna,
            'name_nonklinis' => $this->name_nonklinis,
            'name_nonklinis_pergub' => $this->name_nonklinis_pergub,
            'name_ikp' => $this->name_ikp,
            'name_bpkp' => $this->name_bpkp,
            'joined' => optional($this->created_at)->diffForHumans() ?? '-',
        ];
    }
}
