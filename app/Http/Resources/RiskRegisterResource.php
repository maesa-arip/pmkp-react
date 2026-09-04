<?php

namespace App\Http\Resources;

use App\Models\RiskGrading;
use App\Models\RiskGradingSetting;
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

        $settingKey = (int) $this->tipe_id === 2
            ? 'risk_register_nonklinis'
            : 'risk_register_klinis';
        $settingValue = RiskGradingSetting::value($settingKey);
        $columns = RiskGrading::columnsFor($settingValue);
        $year = $this->tgl_register
            ? date('Y', strtotime($this->tgl_register))
            : RiskGrading::DEFAULT_TAHUN;

        $grading = RiskGrading::query()
            ->where('kode', $this->concatdp1)
            ->where('tahun', $year)
            ->first();

        $data['risk_grading_setting'] = $settingValue;
        $data['risk_grading_display_name'] = $grading?->{$columns['name']};
        $data['risk_grading_display_color'] = $grading?->{$columns['color']};

        return $data;
    }
}
