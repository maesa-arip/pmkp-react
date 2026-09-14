<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class PeriodeKinerja extends Model
{
    protected $guarded = [];

    protected $attributes = ['status' => 'draft', 'rekonstruksi' => false];

    protected $casts = ['tahun' => 'integer', 'rekonstruksi' => 'boolean', 'reconstruction_notes' => 'array'];

    public function assertWritable(): void
    {
        if ($this->status !== 'aktif') {
            throw ValidationException::withMessages(['periode_kinerja_id' => "Periode {$this->tahun} belum aktif atau sudah ditutup."]);
        }
    }
}
