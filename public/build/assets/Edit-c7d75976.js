import{K as g,r as o,a as r}from"./app-c16facc7.js";import b from"./Form-b5156f7d.js";import"./ComboboxPage-e2ae5a96.js";import"./index-4cd94609.js";import"./use-tracked-pointer-facf5425.js";import"./render-caba555b.js";import"./keyboard-5b6ec9fe.js";import"./use-outside-click-cb40d2bb.js";import"./use-resolve-button-type-fefed35d.js";import"./use-tree-walker-7805a025.js";import"./use-controllable-c2a49b00.js";import"./transition-b189ca49.js";import"./use-watch-f2f6a750.js";import"./ComboboxPageReadonly-83000a92.js";import"./InputError-76bbb453.js";import"./InputLabel-512383bf.js";import"./PrimaryButton-8f5509fc.js";import"./SecondaryButton-91e71e10.js";import"./TextAreaInput-f89a6e84.js";import"./TextInput-13418c97.js";import"./TextInputWithError-3ecb3ccb.js";/* empty css                         */function H({setIsOpenEditDialog:n,model:i,ShouldMap:s}){const{data:a,setData:_,put:p,reset:e,errors:u}=g({tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,dokumen_pendukung:i.dokumen_pendukung,kendala:i.kendala,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id,impact_name:i.impact_name,probability_name:i.probability_name}),k=t=>n(!1),d=t=>{t.preventDefault(),p(route("riskRegisterKlinisOsd2.update",i.id),{data:a,onSuccess:()=>{e(),n(!1)}})};return o.useEffect(()=>{_({...a,tgl_register:i.tgl_register,tgl_selesai:i.tgl_selesai,pernyataan_risiko:i.pernyataan_risiko,sebab:i.sebab,resiko:i.resiko,dampak:i.dampak,target_waktu:i.target_waktu,efek:i.efek,grading:i.grading,pengendalian_risiko:i.pengendalian_risiko,proses_id:i.proses_id,currently_id:i.currently_id,risk_category_id:i.risk_category_id,identification_source_id:i.identification_source_id,location_id:i.location_id,risk_variety_id:i.risk_variety_id,risk_type_id:i.risk_type_id,osd1_dampak:i.osd1_dampak,osd1_probabilitas:i.osd1_probabilitas,osd1_controllability:i.osd1_controllability,osd2_dampak:i.osd2_dampak,osd2_probabilitas:i.osd2_probabilitas,osd2_controllability:i.osd2_controllability,pic_id:i.pic_id,indikator_fitur4_id:i.indikator_fitur4_id,pengawasan_id:i.pengawasan_id,perlu_penanganan_id:i.perlu_penanganan_id,opsi_pengendalian_id:i.opsi_pengendalian_id,pembiayaan_risiko_id:i.pembiayaan_risiko_id,efektif_id:i.efektif_id,jenis_pengendalian_id:i.jenis_pengendalian_id,waktu_pengendalian_id:i.waktu_pengendalian_id,belum_tertangani:i.belum_tertangani,usulan_perbaikan:i.usulan_perbaikan,denum:i.denum,num:i.num,waktudenumnum:i.waktudenumnum,output:i.output,dokumen_pendukung:i.dokumen_pendukung,kendala:i.kendala,waktu_implementasi_id:i.waktu_implementasi_id,realisasi_id:i.realisasi_id,impact_name:i.impact_name,probability_name:i.probability_name})},[i]),r("form",{onSubmit:d,children:r(b,{errors:u,data:a,model:i,ShouldMap:s,setData:_,submit:"Simpan",closeButton:k})})}export{H as default};