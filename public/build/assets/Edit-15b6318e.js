import{K as g,r as o,a as r}from"./app-24588fae.js";import b from"./Form-a9c5f28f.js";import"./AnimatedMulti-a51efbf9.js";import"./clsx-3c9bef1f.js";import"./index-761d0ab0.js";import"./ComboboxMultiple-76291485.js";import"./ComboboxPage-9010296b.js";import"./index-fa25f934.js";import"./use-tracked-pointer-88693685.js";import"./render-12e546f0.js";import"./keyboard-049b5e19.js";import"./use-outside-click-2799fe76.js";import"./use-resolve-button-type-78525b7b.js";import"./use-tree-walker-f54895da.js";import"./use-controllable-d1c2f65c.js";import"./transition-5f006427.js";import"./use-watch-b8aa6709.js";import"./ComboboxPageReadonly-b8add39e.js";import"./InputError-dd21eadb.js";import"./InputLabel-5d21ed4f.js";import"./PrimaryButton-de6079d3.js";import"./RadioCard-341ed8c6.js";import"./description-cd37925a.js";import"./SecondaryButton-9b656bdb.js";import"./TextAreaInput-71393383.js";import"./TextInput-a967b272.js";import"./TextInputWithError-34aac4f2.js";/* empty css                         */function Q({setIsOpenEditDialog:n,model:i,ShouldMap:s}){const{data:a,setData:_,put:p,reset:e,errors:u}=g({tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id,pengendalian_harus_ada:i.pengendalian_harus_ada,penanganan_risiko:i.penanganan_risiko,rencana_pengendalian:i.rencana_pengendalian,jenis_sebab_id:i.jenis_sebab_id,pihak_terkena:i.pihak_terkena}),k=t=>n(!1),d=t=>{t.preventDefault(),p(route("riskRegisterKlinis.update",i.id),{data:a,onSuccess:()=>{e(),n(!1)}})};return o.useEffect(()=>{_({...a,tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,resiko:i.resiko,dampak:i.dampak,target_waktu:i.target_waktu,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id,pengendalian_harus_ada:i.pengendalian_harus_ada,penanganan_risiko:i.penanganan_risiko,rencana_pengendalian:i.rencana_pengendalian,jenis_sebab_id:i.jenis_sebab_id,pihak_terkena:i.pihak_terkena})},[i]),r("form",{onSubmit:d,children:r(b,{errors:u,data:a,model:i,ShouldMap:s,setData:_,submit:"Update",closeButton:k})})}export{Q as default};
