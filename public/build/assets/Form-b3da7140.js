import{r,j as u,F as m,a as t}from"./app-c16facc7.js";import{C as b}from"./ComboboxPage-e2ae5a96.js";import{I as c}from"./InputError-76bbb453.js";import{I as l}from"./InputLabel-512383bf.js";import{P as y}from"./PrimaryButton-8f5509fc.js";import{S as v}from"./SecondaryButton-91e71e10.js";import{T as p}from"./TextAreaInput-f89a6e84.js";import"./TextInput-13418c97.js";import"./TextInputWithError-3ecb3ccb.js";/* empty css                         */import"./index-4cd94609.js";import"./use-tracked-pointer-facf5425.js";import"./render-caba555b.js";import"./keyboard-5b6ec9fe.js";import"./use-outside-click-cb40d2bb.js";import"./use-resolve-button-type-fefed35d.js";import"./use-tree-walker-7805a025.js";import"./use-controllable-c2a49b00.js";import"./transition-b189ca49.js";import"./use-watch-f2f6a750.js";function W({errors:d,submit:g,data:s,setData:f,ShouldMap:n,model:e,closeButton:k}){const a=[{name:""}];r.useState(()=>e?n.proses.find(i=>i.id===e.proses_id):a[0]),r.useState(()=>e?n.currently.find(i=>i.id===e.currently_id):a[0]),r.useState(()=>e?n.riskCategories.find(i=>i.id===e.risk_category_id):a[0]),r.useState(()=>e?n.identificationSources.find(i=>i.id===e.identification_source_id):a[0]),r.useState(()=>e?n.locations.find(i=>i.id===e.location_id):a[0]),r.useState(()=>e?n.riskVarieties.find(i=>i.id===e.risk_variety_id):a[0]),r.useState(()=>e?n.riskTypes.find(i=>i.id===e.risk_type_id):a[0]),r.useState(()=>e?n.impactValues.find(i=>i.id===e.osd1_dampak):a[0]),r.useState(()=>e?n.probabilityValues.find(i=>i.id===e.osd1_probabilitas):a[0]),r.useState(()=>e?n.controlValues.find(i=>i.id===e.osd1_controllability):a[0]),r.useState(()=>e?n.impactValues.find(i=>i.id===e.osd2_dampak):a[0]),r.useState(()=>e?n.probabilityValues.find(i=>i.id===e.osd2_probabilitas):a[0]),r.useState(()=>e?n.controlValues.find(i=>i.id===e.osd2_controllability):a[0]),r.useState(()=>e?n.pics.find(i=>i.id===e.pic_id):a[0]),r.useState(()=>e?n.indikatorFitur4s.find(i=>i.id===e.indikator_fitur4_id):a[0]),r.useState(()=>e?n.pengawasan.find(i=>i.id===e.pengawasan_id):a[0]),r.useState(()=>e?n.perluPenanganan.find(i=>i.id===e.perlu_penanganan_id):a[0]),r.useState(()=>e?n.opsiPengendalian.find(i=>i.id===e.opsi_pengendalian_id):a[0]),r.useState(()=>e?n.pembiayaanRisiko.find(i=>i.id===e.pembiayaan_risiko_id):a[0]);const[o,_]=r.useState(()=>e?n.efektif.find(i=>i.id===e.efektif_id):a[0]);return r.useState(()=>e?n.jenisPengendalian.find(i=>i.id===e.jenis_pengendalian_id):a[0]),r.useState(()=>e?n.waktuPengendalian.find(i=>i.id===e.waktu_pengendalian_id):a[0]),r.useState(()=>e?n.waktuImplementasi.find(i=>i.id===e.waktu_implementasi_id):a[0]),r.useState(()=>e?n.realisasi.find(i=>i.id===e.realisasi_id):a[0]),r.useEffect(()=>{f({...s,pernyataan_risiko:"Karena "+s.sebab+" Kemungkinan "+s.resiko+" Sehingga "+s.dampak})},[s.sebab,s.resiko,s.dampak]),r.useState(null),r.useState(null),u(m,{children:[t("div",{className:"px-4 py-5 bg-white sm:p-6",children:u("div",{className:"grid grid-cols-12 gap-6",children:[u("div",{className:"col-span-12 p-6 my-6 border-4 border-gray-200 rounded-lg ",children:[t("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700 ",children:"Data Risiko"}),t("div",{className:"grid grid-cols-12 gap-6",children:u("div",{className:"col-span-12",children:[t(l,{for:"pernyataan risiko",value:"Pernyataan Risiko"}),t(p,{id:"pernyataan_risiko",readOnly:!0,value:s.pernyataan_risiko??"",handleChange:i=>f("pernyataan_risiko",i.target.value),type:"text",className:"block w-full mt-1"}),t(c,{message:d.pernyataan_risiko,className:"mt-2"})]})})]}),u("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[t("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700 ",children:"Pengendalian Yang Sudah Ada (Wajib di input setelah ada pengendalian)"}),u("div",{className:"grid grid-cols-12 gap-6",children:[u("div",{className:"col-span-12",children:[t(l,{for:"pengendalian_risiko",value:"Pengendalian Risiko yang Sudah Ada"}),t(p,{id:"pengendalian_risiko",value:s.pengendalian_risiko,handleChange:i=>f("pengendalian_risiko",i.target.value),type:"text",className:"block w-full mt-1"}),t(c,{message:d.pengendalian_risiko,className:"mt-2"})]}),u("div",{className:"col-span-6 my-6",children:[t(l,{for:"Efektif/Kurang Efektif",value:"Efektif/Kurang Efektif"}),t(b,{ShouldMap:n.efektif,selected:o,onChange:i=>{f({...s,efektif_id:i.id}),_(i)}}),t(c,{message:d.efektif_id,className:"mt-2"})]}),u("div",{className:"col-span-12",children:[t(l,{for:"pengendalian_risiko",value:"Pengendalian yang Harus Ada"}),t(p,{id:"pengendalian_risiko",value:s.pengendalian_risiko,handleChange:i=>f("pengendalian_risiko",i.target.value),type:"text",className:"block w-full mt-1"}),t(c,{message:d.pengendalian_risiko,className:"mt-2"})]})]})]})]})}),u("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[t(y,{children:g}),t(v,{className:"mx-2",onClick:k,children:"Batal"})]})]})}export{W as default};