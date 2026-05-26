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
            'warna_klinis' => $this->warna_klinis,
            'name_nonklinis' => $this->name_nonklinis,
            'warna_nonklinis' => $this->warna_nonklinis,
            'name_nonklinis_pergub' => $this->name_nonklinis_pergub,
            'warna_nonklinis_pergub' => $this->warna_nonklinis_pergub,
            'name_ikp' => $this->name_ikp,
            'warna_ikp' => $this->warna_ikp,
            'name_bpkp' => $this->name_bpkp,
            'warna_bpkp' => $this->warna_bpkp,
            'joined' => optional($this->created_at)->diffForHumans() ?? '-',
        ];
    }
}
