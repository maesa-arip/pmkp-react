import{r as d,j as s,F as ae,a}from"./app-614c1295.js";import{C as u}from"./ComboboxPage-2d6c896a.js";import{C as p}from"./ComboboxPageReadonly-f35d7fc7.js";import{I as c}from"./InputError-bc96fff5.js";import{I as o}from"./InputLabel-0d6e0d61.js";import{P as ne}from"./PrimaryButton-85a5e5df.js";import{R as ie}from"./RadioCard-ba75cf11.js";import{S as se}from"./SecondaryButton-abcfa509.js";import{T as g}from"./TextAreaInput-e8f6ce75.js";import{T as f}from"./TextInput-178c6511.js";import{T as te}from"./TextInputWithError-203be51e.js";import{H as le}from"./index-7d622cca.js";/* empty css                         */import"./use-tracked-pointer-43b49aff.js";import"./transition-f4897d70.js";import"./keyboard-51d71707.js";import"./use-resolve-button-type-adf3b03a.js";import"./use-watch-9917b5ed.js";import"./description-d351b524.js";function xe({errors:r,submit:b,data:t,setData:l,ShouldMap:i,model:n,closeButton:k}){const m=[{name:""}];d.useState(()=>n?i.proses.find(e=>e.id===n.proses_id):m[0]);const[_,v]=d.useState(()=>n?i.currently.find(e=>e.id===n.currently_id):m[0]),[y,N]=d.useState(()=>n?i.riskCategories.find(e=>e.id===n.risk_category_id):m[0]),[h,P]=d.useState(()=>n?i.identificationSources.find(e=>e.id===n.identification_source_id):m[0]);d.useState(()=>n?i.locations.find(e=>e.id===n.location_id):m[0]);const[C,S]=d.useState(()=>n?i.riskVarieties.find(e=>e.id===n.risk_variety_id):m[0]),[x,w]=d.useState(()=>n?i.riskTypes.find(e=>e.id===n.risk_type_id):m[0]),[R,I]=d.useState(()=>n?i.jenisSebabs.find(e=>e.id===n.jenis_sebab_id):m[0]),[T,j]=d.useState(()=>n?i.impactValues.find(e=>e.id===n.osd1_dampak):m[0]),[F,V]=d.useState(()=>n?i.probabilityValues.find(e=>e.id===n.osd1_probabilitas):m[0]),[E,O]=d.useState(()=>n?i.controlValues.find(e=>e.id===n.osd1_controllability):m[0]);d.useState(()=>n?i.impactValues.find(e=>e.id===n.osd2_dampak):m[0]),d.useState(()=>n?i.probabilityValues.find(e=>e.id===n.osd2_probabilitas):m[0]),d.useState(()=>n?i.controlValues.find(e=>e.id===n.osd2_controllability):m[0]);const[W,J]=d.useState(()=>n?i.pics.find(e=>e.id===n.pic_id):m[0]),[K,A]=d.useState(()=>n?i.indikatorFitur4s.find(e=>e.id===n.indikator_fitur4_id):m[0]);d.useState(()=>n?i.pengawasan.find(e=>e.id===n.pengawasan_id):m[0]);const[U,H]=d.useState(()=>n?i.perluPenanganan.find(e=>e.id===n.perlu_penanganan_id):m[0]),[B,L]=d.useState(()=>n?i.opsiPengendalian.find(e=>e.id===n.opsi_pengendalian_id):m[0]),[G,Y]=d.useState(()=>n?i.pembiayaanRisiko.find(e=>e.id===n.pembiayaan_risiko_id):m[0]),[q,z]=d.useState(()=>n?i.efektif.find(e=>e.id===n.efektif_id):m[0]),[Q,X]=d.useState(()=>n?i.jenisPengendalian.find(e=>e.id===n.jenis_pengendalian_id):m[0]),[Z,$]=d.useState(()=>n?i.waktuPengendalian.find(e=>e.id===n.waktu_pengendalian_id):m[0]);d.useState(()=>n?i.waktuImplementasi.find(e=>e.id===n.waktu_implementasi_id):m[0]),d.useState(()=>n?i.realisasi.find(e=>e.id===n.realisasi_id):m[0]),d.useEffect(()=>{l({...t,pernyataan_risiko:"Karena "+t.sebab+" kemungkinan "+t.resiko+" sehingga "+t.dampak})},[t.sebab,t.resiko,t.dampak]);const[D,M]=d.useState(null);return d.useState(null),s(ae,{children:[a("div",{className:"px-4 py-5 bg-white sm:p-6",children:s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700 ",children:"Data Risiko (Wajib di Input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-12",children:[a(o,{for:"Indikator",value:"Indikator"}),a(u,{ShouldMap:i.indikatorFitur4s,selected:K,onChange:e=>{l({...t,indikator_fitur4_id:e.id}),A(e)}}),a(c,{message:r.indikator_fitur4_id,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(o,{for:"Kategori Risiko",value:"Kategori Risiko"}),a(u,{ShouldMap:i.riskCategories,selected:y,onChange:e=>{l({...t,risk_category_id:e.id}),N(e)}}),a(c,{message:r.risk_category_id,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(o,{for:"TanggalRegister",value:"Tanggal Register"}),a(le,{dateFormat:"dd-MM-yyyy",value:t.tgl_register,selected:D,id:"tgl_register",name:"tgl_register",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:e=>{M(e);const ee=new Date(e).toLocaleDateString("en-CA");l("tgl_register",ee)}}),a(c,{message:r.tgl_register,className:"mt-2"})]}),s("div",{className:"col-span-7",children:[a(o,{for:"Jenis Sebab",value:"Jenis Sebab"}),a(u,{ShouldMap:i.jenisSebabs,selected:R,onChange:e=>{l({...t,jenis_sebab_id:e.id}),I(e)}}),a(c,{message:r.jenis_sebab_id,className:"mt-2"})]}),s("div",{className:"col-span-8",children:[a(o,{for:"sebab",value:"Sebab"}),a(g,{id:"sebab",value:t.sebab,handleChange:e=>l("sebab",e.target.value),rows:5,type:"text",className:"block w-full mt-1"}),a(c,{message:r.sebab,className:"mt-2"})]}),s("div",{className:"col-span-4 mt-6",children:[a(ie,{ShouldMap:i.currently,selected:_,onChange:e=>{l({...t,currently_id:e.id}),v(e)}}),a(c,{message:r.currently_id,className:"mt-2"})]}),s("div",{className:"col-span-8",children:[a(o,{for:"Kategori Risiko",value:"PIC Unit Terkait"}),a(u,{ShouldMap:i.pics,selected:W,onChange:e=>{l({...t,pic_id:e.id}),J(e)}}),a(c,{message:r.pic_id,className:"mt-2"})]}),s("div",{className:"col-span-4",children:[a(o,{for:"Sumber Identifikasi",value:"Sumber Identifikasi"}),a(u,{ShouldMap:i.identificationSources,selected:h,onChange:e=>{l({...t,identification_source_id:e.id}),P(e)}}),a(c,{message:r.identification_source_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"resiko",value:"Risiko"}),a(g,{id:"resiko",value:t.resiko,handleChange:e=>l("resiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.resiko,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"dampak",value:"Dampak"}),a(g,{id:"dampak",value:t.dampak,handleChange:e=>l("dampak",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.dampak,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"pernyataan risiko",value:"Pernyataan Risiko"}),a(g,{id:"pernyataan_risiko",readOnly:!0,value:t.pernyataan_risiko??"",handleChange:e=>l("pernyataan_risiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.pernyataan_risiko,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(o,{for:"Jenis Insiden",value:"Jenis Insiden"}),a(u,{ShouldMap:i.riskVarieties,selected:C,onChange:e=>{l({...t,risk_variety_id:e.id}),S(e)}}),a(c,{message:r.risk_variety_id,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(o,{for:"Tipe insiden",value:"Tipe Insiden"}),a(u,{ShouldMap:i.riskTypes,selected:x,onChange:e=>{l({...t,risk_type_id:e.id}),w(e)}}),a(c,{message:r.risk_type_id,className:"mt-2"})]})]})]}),s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700",children:"NUMERATOR & DENUMERATOR (Wajib di Input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-6",children:[a(o,{for:"Denum",value:"Denumerator"}),a(f,{id:"denum",value:t.denum,handleChange:e=>l("denum",e.target.value),readOnly:!1,type:"number",className:"block w-full mt-1"}),a(c,{message:r.denum,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(o,{for:"NUM",value:"Numerator"}),a(f,{id:"num",value:t.num,handleChange:e=>l("num",e.target.value),readOnly:!1,type:"number",className:"block w-full mt-1"}),a(c,{message:r.num,className:"mt-2"})]}),a("div",{className:"col-span-6",children:a(te,{label:"Target Waktu Tindak Lanjut Monitoring(Hari)",type:"number",id:"target_waktu",name:"target_waktu",value:t.target_waktu,handleChange:e=>l("target_waktu",e.target.value),message:r.target_waktu})})]})]}),s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700 ",children:"OSD Inherent (Wajib di Input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[a("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg",children:s("div",{className:"grid grid-cols-12 gap-6",children:[a("label",{htmlFor:"",className:"block col-span-12 mb-4 text-base font-bold text-gray-700 ",children:"Dampak dan Probabilitas akan Otomatis Terisi Setelah Melakukan FGD"}),s("div",{className:"col-span-12",children:[a(o,{for:"Dampak",value:"Dampak"}),a(p,{ShouldMap:i.impactValues,selected:T,onChange:e=>{l({...t,osd1_dampak:e.id}),j(e)}}),a(c,{message:r.osd1_dampak,className:"mt-2"})]}),s("div",{className:"col-span-12 cursor-not-allowed",children:[a(o,{for:"Kategori Risiko",value:"Probabilitas"}),a(p,{ShouldMap:i.probabilityValues,selected:F,onChange:e=>{l({...t,osd1_probabilitas:e.id}),V(e)}}),a(c,{message:r.osd1_probabilitas,className:"mt-2"})]})]})}),s("div",{className:"col-span-12",children:[a(o,{for:"Kategori Risiko",value:"Controllability"}),a(u,{ShouldMap:i.controlValues,selected:E,onChange:e=>{l({...t,osd1_controllability:e.id}),O(e)}}),a(c,{message:r.osd1_controllability,className:"mt-2"})]}),s("div",{className:"col-span-4",children:[a(o,{for:"Perlu Penanganan",value:"Perlu Penanganan"}),a(u,{ShouldMap:i.perluPenanganan,selected:U,onChange:e=>{l({...t,perlu_penanganan_id:e.id}),H(e)}}),a(c,{message:r.perlu_penanganan_id,className:"mt-2"})]})]})]}),s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700 ",children:"Pengendalian Yang Sudah Ada (Wajib di input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-12",children:[a(o,{for:"pengendalian_risiko",value:"Pengendalian Risiko yang Sudah Ada"}),a(g,{id:"pengendalian_risiko",value:t.pengendalian_risiko,handleChange:e=>l("pengendalian_risiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.pengendalian_risiko,className:"mt-2"})]}),s("div",{className:"col-span-6 my-6",children:[a(o,{for:"Efektif/Kurang Efektif",value:"Efektif/Kurang Efektif"}),a(u,{ShouldMap:i.efektif,selected:q,onChange:e=>{l({...t,efektif_id:e.id}),z(e)}}),a(c,{message:r.efektif_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"pengendalian_harus_ada",value:"Pengendalian yang Harus Ada"}),a(g,{id:"pengendalian_harus_ada",value:t.pengendalian_harus_ada,handleChange:e=>l("pengendalian_harus_ada",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.pengendalian_harus_ada,className:"mt-2"})]})]})]}),s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700",children:"Opsi Pengendalian (Wajib di input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-6 my-6",children:[a(o,{for:"Opsi Pengendalian",value:"Opsi Pengendalian"}),a(u,{ShouldMap:i.opsiPengendalian,selected:B,onChange:e=>{l({...t,opsi_pengendalian_id:e.id}),L(e)}}),a(c,{message:r.opsi_pengendalian_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"penanganan_risiko",value:"Uraian Penanganan Risiko"}),a(g,{id:"penanganan_risiko",value:t.penanganan_risiko,handleChange:e=>l("penanganan_risiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.penanganan_risiko,className:"mt-2"})]}),s("div",{className:"col-span-6 my-6",children:[a(o,{for:"Pembiayaan Risiko",value:"Pembiayaan Risiko"}),a(u,{ShouldMap:i.pembiayaanRisiko,selected:G,onChange:e=>{l({...t,pembiayaan_risiko_id:e.id}),Y(e)}}),a(c,{message:r.pembiayaan_risiko_id,className:"mt-2"})]}),s("div",{className:"col-span-6 my-6",children:[a(o,{for:"Jenis Pengendalian",value:"Jenis Pengendalian"}),a(u,{ShouldMap:i.jenisPengendalian,selected:Q,onChange:e=>{l({...t,jenis_pengendalian_id:e.id}),X(e)}}),a(c,{message:r.jenis_pengendalian_id,className:"mt-2"})]}),s("div",{className:"col-span-6 my-6",children:[a(o,{for:"Waktu Pengendalian",value:"Waktu Implementasi/Pemantauan"}),a(u,{ShouldMap:i.waktuPengendalian,selected:Z,onChange:e=>{l({...t,waktu_pengendalian_id:e.id}),$(e)}}),a(c,{message:r.waktu_pengendalian_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"rencana_pengendalian",value:"Rencana Kegiatan Pengendalian"}),a(g,{id:"rencana_pengendalian",value:t.rencana_pengendalian,handleChange:e=>l("rencana_pengendalian",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.rencana_pengendalian,className:"mt-2"})]})]})]})]})}),s("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[a(ne,{children:b}),a(se,{className:"mx-2",onClick:k,children:"Batal"})]})]})}export{xe as default};