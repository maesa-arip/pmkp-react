<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RiskRegisterResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $data = parent::toArray($request);

        if ($this->resource->relationLoaded('risk_register_histories')) {
            $data['risk_register_histories'] = $this->effectiveRiskRegisterHistories()->values();
        }

        return $data;
    }
}
