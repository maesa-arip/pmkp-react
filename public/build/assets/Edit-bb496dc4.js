import{K as g,r as o,a as r}from"./app-99ef0eb0.js";import b from"./Form-246fdce7.js";import"./ComboboxPage-a73498ae.js";import"./use-tracked-pointer-b0e2e50f.js";import"./transition-9c7d8c03.js";import"./keyboard-ae49841d.js";import"./use-resolve-button-type-c9292bc7.js";import"./use-watch-3ec0c030.js";import"./InputError-db58d90d.js";import"./InputLabel-7af8523f.js";import"./PrimaryButton-41d745e5.js";import"./RadioCard-6d0c5765.js";import"./description-dc82e027.js";import"./SecondaryButton-a8193bcc.js";import"./TextAreaInput-8a12107e.js";import"./TextInput-2629e86a.js";import"./TextInputWithError-cd44c6d7.js";import"./index-53f7cf6a.js";/* empty css                         */function A({setIsOpenEditDialog:n,model:i,ShouldMap:s}){const{data:a,setData:_,put:p,reset:e,errors:u}=g({tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id,pengendalian_harus_ada:i.pengendalian_harus_ada,penanganan_risiko:i.penanganan_risiko,rencana_pengendalian:i.rencana_pengendalian}),d=t=>n(!1),k=t=>{t.preventDefault(),p(route("riskRegisterKlinis.update",i.id),{data:a,onSuccess:()=>{e(),n(!1)}})};return o.useEffect(()=>{_({...a,tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,resiko:i.resiko,dampak:i.dampak,target_waktu:i.target_waktu,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id,pengendalian_harus_ada:i.pengendalian_harus_ada,penanganan_risiko:i.penanganan_risiko,rencana_pengendalian:i.rencana_pengendalian})},[i]),r("form",{onSubmit:k,children:r(b,{errors:u,data:a,model:i,ShouldMap:s,setData:_,submit:"Update",closeButton:d})})}export{A as default};
