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
            $data['risk_register_histories'] = $this->risk_register_histories->values();
            $data['source_risk_register_histories'] = $this->copiedFromRiskRegister?->risk_register_histories ?? [];
        }

        $settingKey = (int) $this->tipe_id === 2
            ? 'risk_register_nonklinis'
            : 'risk_register_klinis';
        $settingValue = RiskGradingSetting::value($settingKey);
        $columns = RiskGrading::columnsFor($settingValue);
        $year = $this->tgl_register
            ? date('Y', strtotime($this->tgl_register))
            : RiskGrading::DEFAULT_TAHUN;

        $stageCodes = [
            'inherent' => $this->concatdp1,
            'residual' => $this->concatdp2,
            'treated' => $this->concatdp3,
            'actual' => $this->concatdp4,
        ];
        $gradings = RiskGrading::query()
            ->where('tahun', $year)
            ->get()
            ->keyBy('kode');
        $grading = $gradings->get($this->concatdp1);
        $data['riskgrading'] = $grading;

        $data['risk_grading_setting'] = $settingValue;
        $data['risk_grading_display_name'] = $grading?->{$columns['name']};
        $data['risk_grading_display_color'] = $grading?->{$columns['color']};
        // Keep matrix codes as object keys so resource filtering cannot reindex them.
        $data['risk_grading_matrix'] = (object) $gradings->map(fn ($item) => [
            'name' => $item->{$columns['name']},
            'color' => $item->{$columns['color']},
        ])->all();

        foreach ($stageCodes as $stage => $code) {
            $stageGrading = $gradings->get($code);
            $data['risk_stage_gradings'][$stage] = [
                'name' => $stageGrading?->{$columns['name']},
                'color' => $stageGrading?->{$columns['color']},
            ];
        }

        return $data;
    }
}
