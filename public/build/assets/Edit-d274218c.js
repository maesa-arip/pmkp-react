import{K as g,r as o,a as r}from"./app-328e0f8e.js";import b from"./Form-06c208e6.js";import"./ComboboxPage-1d5e5559.js";import"./use-tracked-pointer-e8e71668.js";import"./transition-90c5a8ba.js";import"./keyboard-8a4d4b85.js";import"./use-resolve-button-type-254d59e3.js";import"./use-watch-cdf9fa3b.js";import"./InputError-16a32d13.js";import"./InputLabel-1153ad76.js";import"./PrimaryButton-6b634f27.js";import"./SecondaryButton-8a1eb959.js";import"./TextAreaInput-27e86535.js";import"./TextInput-30771dd1.js";import"./TextInputWithError-463b0e84.js";/* empty css                         */function U({setIsOpenEditDialog:n,model:i,ShouldMap:s}){const{data:a,setData:_,put:p,reset:e,errors:u}=g({tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id}),d=t=>n(!1),k=t=>{t.preventDefault(),p(route("riskRegisterKlinisOsd2.update",i.id),{data:a,onSuccess:()=>{e(),n(!1)}})};return o.useEffect(()=>{_({...a,tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,resiko:i.resiko,dampak:i.dampak,target_waktu:i.target_waktu,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id})},[i]),r("form",{onSubmit:k,children:r(b,{errors:u,data:a,model:i,ShouldMap:s,setData:_,submit:"Update",closeButton:d})})}export{U as default};
