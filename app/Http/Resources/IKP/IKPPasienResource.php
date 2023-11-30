<?php

namespace App\Http\Resources\IKP;

use Illuminate\Http\Resources\Json\JsonResource;

class IKPPasienResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        // return [
        //     'namapasien' => $this->namapasien,
        //     'nrm' => $this->nrm,
        //     'umur_tahun' => $this->umur_tahun,
        //     'umur_bulan' => $this->umur_bulan,
        //     'umur_hari' => $this->umur_hari,
        //     'ikp_penanggung_id' => $this->ikp_penanggung_id,
        //     'jeniskelamin' => $this->jeniskelamin,
        //     'tanggal_pelayanan' => $this->tanggal_pelayanan,
        //     'tanggal_insiden' => $this->tanggal_insiden,
        //     'insiden' => $this->insiden,
        //     'kronologi' => $this->kronologi,
        //     'ikp_jenis_insiden_id' => $this->ikp_jenis_insiden_id,
        //     'ikp_tipe_insiden_id' => $this->ikp_tipe_insiden_id,
        //     'ikp_spesialisasi_id' => $this->ikp_spesialisasi_id,
        //     'ikp_dampak_id' => $this->ikp_dampak_id,
        //     'ikp_probabilitas_id' => $this->ikp_probabilitas_id,
        //     'ikp_pelapor_id' => $this->ikp_pelapor_id,
        //     'ikp_gruplayanan_id' => $this->ikp_gruplayanan_id,
        //     'ikp_lokasi_id' => $this->ikp_lokasi_id,
        //     'lokasi_name' => $this->lokasi_name,
        //     'pic_id' => $this->pic_id,
        //     'tindak_lanjut_hasil' => $this->tindak_lanjut_hasil,
        //     'ikp_penindak_id' => $this->ikp_penindak_id,
        //     'terjadi_tempatlain' => $this->terjadi_tempatlain,
        //     'langkah_tempatlain' => $this->langkah_tempatlain,
        //     'joined' => $this->created_at->diffForHumans(),
        // ];
        return parent::toArray($request);
    }
}
