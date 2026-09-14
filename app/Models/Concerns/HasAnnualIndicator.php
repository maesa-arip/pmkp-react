<?php

namespace App\Models\Concerns;

use App\Models\PeriodeKinerja;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;

trait HasAnnualIndicator
{
    public static function bootHasAnnualIndicator(): void
    {
        static::addGlobalScope('annual', fn (Builder $query) => $query->whereNotNull($query->getModel()->qualifyColumn('periode_kinerja_id')));
        static::saving(function ($model) {
            $period = PeriodeKinerja::find($model->periode_kinerja_id);
            if (! $period || $period->status !== 'draft') {
                throw ValidationException::withMessages(['indikator_fitur4_id' => 'Kelola indikator melalui draft pada menu Indikator Tahunan.']);
            }
        });
        static::deleting(fn () => throw ValidationException::withMessages(['indikator_fitur4_id' => 'Nonaktifkan indikator pada draft; data historis tidak boleh dihapus.']));
    }

    public function initializeHasAnnualIndicator(): void
    {
        $this->append('tahun');
    }

    public function getTahunAttribute(): ?int
    {
        $periods = app()->make('annual.periods');

        return isset($periods[$this->periode_kinerja_id]) ? (int) $periods[$this->periode_kinerja_id] : null;
    }
}
