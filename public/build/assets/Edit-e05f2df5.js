import{K as g,r as b,a as r}from"./app-a515daf2.js";import o from"./Form-7eb39824.js";import"./AnimatedMulti-48d0380a.js";import"./ComboboxMultiple-d7c6d3b8.js";import"./ComboboxPage-63d67464.js";import"./use-tracked-pointer-a8bedc30.js";import"./transition-4ad8ddf1.js";import"./keyboard-a7eff1f5.js";import"./use-resolve-button-type-3e2bb007.js";import"./use-watch-ba625b59.js";import"./ComboboxPageReadonly-9f46592a.js";import"./InputError-e663b23a.js";import"./InputLabel-2a3bf0b1.js";import"./PrimaryButton-8cbe1ff8.js";import"./RadioCard-806c4dd3.js";import"./description-658fa0f9.js";import"./SecondaryButton-f2acca44.js";import"./TextAreaInput-13841cb0.js";import"./TextInput-673b07f1.js";import"./TextInputWithError-e457d1ab.js";import"./index-b144b202.js";/* empty css                         */function H({setIsOpenEditDialog:n,model:i,ShouldMap:s}){const{data:a,setData:_,put:e,reset:p,errors:u}=g({tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id,pengendalian_harus_ada:i.pengendalian_harus_ada,penanganan_risiko:i.penanganan_risiko,rencana_pengendalian:i.rencana_pengendalian,jenis_sebab_id:i.jenis_sebab_id}),d=t=>n(!1),k=t=>{t.preventDefault(),e(route("riskRegisterKlinis.update",i.id),{data:a,onSuccess:()=>{p(),n(!1)}})};return b.useEffect(()=>{_({...a,tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,resiko:i.resiko,dampak:i.dampak,target_waktu:i.target_waktu,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id,pengendalian_harus_ada:i.pengendalian_harus_ada,penanganan_risiko:i.penanganan_risiko,rencana_pengendalian:i.rencana_pengendalian,jenis_sebab_id:i.jenis_sebab_id})},[i]),r("form",{onSubmit:k,children:r(o,{errors:u,data:a,model:i,ShouldMap:s,setData:_,submit:"Update",closeButton:d})})}export{H as default};
