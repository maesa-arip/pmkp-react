import{K as g,r as o,a as r}from"./app-0da779d6.js";import b from"./Form-350e8a51.js";import"./ComboboxPage-7ee35244.js";import"./use-tracked-pointer-f547c941.js";import"./transition-d3118cc9.js";import"./keyboard-3e1eb91c.js";import"./use-resolve-button-type-118bc16a.js";import"./use-watch-8d31aa54.js";import"./InputError-634add90.js";import"./InputLabel-d00fdff0.js";import"./PrimaryButton-a3bfa6c9.js";import"./SecondaryButton-29c22d18.js";import"./TextAreaInput-21118815.js";import"./TextInput-69f4b767.js";import"./TextInputWithError-ad9a1ec7.js";/* empty css                         */function U({setIsOpenEditDialog:n,model:i,ShouldMap:s}){const{data:a,setData:_,put:p,reset:e,errors:u}=g({tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id}),d=t=>n(!1),k=t=>{t.preventDefault(),p(route("riskRegisterKlinisOsd2.update",i.id),{data:a,onSuccess:()=>{e(),n(!1)}})};return o.useEffect(()=>{_({...a,tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,resiko:i.resiko,dampak:i.dampak,target_waktu:i.target_waktu,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id})},[i]),r("form",{onSubmit:k,children:r(b,{errors:u,data:a,model:i,ShouldMap:s,setData:_,submit:"Update",closeButton:d})})}export{U as default};
