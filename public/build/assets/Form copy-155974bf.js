import{r as d,j as s,F as ee,a}from"./app-40227382.js";import"./AnimatedMulti-fc98a9dc.js";import{C as ae}from"./ComboboxMultiple-7454ec32.js";import{C as u}from"./ComboboxPage-878696ae.js";import{C as f}from"./ComboboxPageReadonly-2ed0bef2.js";import{I as c}from"./InputError-0cf9554f.js";import{I as o}from"./InputLabel-4fdd6287.js";import{P as ie}from"./PrimaryButton-ce8a4982.js";import{R as ne}from"./RadioCard-80e78950.js";import{S as se}from"./SecondaryButton-e376ea20.js";import{T as g}from"./TextAreaInput-919603c2.js";import{T as b}from"./TextInput-70d63fd3.js";import{T as te}from"./TextInputWithError-f69ac6cb.js";import{t as le}from"./index-c0c70693.js";/* empty css                         */import"./clsx-aaf5a234.js";import"./defineProperty-8250cd14.js";import"./use-tracked-pointer-5a6dfe94.js";import"./render-66257b5b.js";import"./keyboard-61a26669.js";import"./use-outside-click-09bb6113.js";import"./use-tree-walker-55160274.js";import"./use-controllable-2ece201f.js";import"./transition-28801c53.js";import"./use-watch-f0387d0f.js";import"./description-bdba954c.js";function Ve({errors:r,submit:k,data:t,setData:l,ShouldMap:n,model:i,closeButton:_}){const m=[{name:""}];d.useState(()=>i?n.proses.find(e=>e.id===i.proses_id):m[0]);const[y,v]=d.useState(()=>i?n.currently.find(e=>e.id===i.currently_id):m[0]),[N,h]=d.useState(()=>i?n.riskCategories.find(e=>e.id===i.risk_category_id):m[0]),[C,P]=d.useState(()=>i?n.identificationSources.find(e=>e.id===i.identification_source_id):m[0]);d.useState(()=>i?n.locations.find(e=>e.id===i.location_id):m[0]);const[S,x]=d.useState(()=>i?n.riskVarieties.find(e=>e.id===i.risk_variety_id):m[0]),[w,I]=d.useState(()=>i?n.riskTypes.find(e=>e.id===i.risk_type_id):m[0]),[R,T]=d.useState(()=>i?n.jenisSebabs.find(e=>e.id===i.jenis_sebab_id):m[0]),[j,F]=d.useState(()=>i?n.impactValues.find(e=>e.id===i.osd1_dampak):m[0]),[V,E]=d.useState(()=>i?n.probabilityValues.find(e=>e.id===i.osd1_probabilitas):m[0]),[O,J]=d.useState(()=>i?n.controlValues.find(e=>e.id===i.osd1_controllability):m[0]);d.useState(()=>i?n.impactValues.find(e=>e.id===i.osd2_dampak):m[0]),d.useState(()=>i?n.probabilityValues.find(e=>e.id===i.osd2_probabilitas):m[0]),d.useState(()=>i?n.controlValues.find(e=>e.id===i.osd2_controllability):m[0]),d.useState(()=>i?n.pics.find(e=>e.id===i.pic_id):m[0]);const[W,A]=d.useState(()=>i?n.indikatorFitur4s.find(e=>e.id===i.indikator_fitur4_id):m[0]);d.useState(()=>i?n.pengawasan.find(e=>e.id===i.pengawasan_id):m[0]);const[K,U]=d.useState(()=>i?n.perluPenanganan.find(e=>e.id===i.perlu_penanganan_id):m[0]),[B,L]=d.useState(()=>i?n.opsiPengendalian.find(e=>e.id===i.opsi_pengendalian_id):m[0]),[G,H]=d.useState(()=>i?n.pembiayaanRisiko.find(e=>e.id===i.pembiayaan_risiko_id):m[0]),[Y,q]=d.useState(()=>i?n.efektif.find(e=>e.id===i.efektif_id):m[0]),[z,Q]=d.useState(()=>i?n.jenisPengendalian.find(e=>e.id===i.jenis_pengendalian_id):m[0]),[X,Z]=d.useState(()=>i?n.waktuPengendalian.find(e=>e.id===i.waktu_pengendalian_id):m[0]);d.useState(()=>i?n.waktuImplementasi.find(e=>e.id===i.waktu_implementasi_id):m[0]),d.useState(()=>i?n.realisasi.find(e=>e.id===i.realisasi_id):m[0]),d.useEffect(()=>{l({...t,pernyataan_risiko:"Karena "+t.sebab+" kemungkinan "+t.resiko+" sehingga "+t.dampak})},[t.sebab,t.resiko,t.dampak]);const[$,M]=d.useState(null);return d.useState(null),s(ee,{children:[a("div",{className:"px-4 py-5 bg-white sm:p-6",children:s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700 ",children:"Data Risiko (Wajib di Input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-12",children:[a(o,{for:"Indikator",value:"Indikator"}),a(u,{ShouldMap:n.indikatorFitur4s,selected:W,onChange:e=>{l({...t,indikator_fitur4_id:e.id}),A(e)}}),a(c,{message:r.indikator_fitur4_id,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(o,{for:"Kategori Risiko",value:"Kategori Risiko"}),a(u,{ShouldMap:n.riskCategories,selected:N,onChange:e=>{l({...t,risk_category_id:e.id}),h(e)}}),a(c,{message:r.risk_category_id,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(o,{for:"TanggalRegister",value:"Tanggal Register"}),a(le,{dateFormat:"dd-MM-yyyy",value:t.tgl_register,selected:$,id:"tgl_register",name:"tgl_register",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:e=>{M(e);const p=new Date(e).toLocaleDateString("en-CA");l("tgl_register",p)}}),a(c,{message:r.tgl_register,className:"mt-2"})]}),s("div",{className:"col-span-7",children:[a(o,{for:"Jenis Sebab",value:"Jenis Sebab"}),a(u,{ShouldMap:n.jenisSebabs,selected:R,onChange:e=>{l({...t,jenis_sebab_id:e.id}),T(e)}}),a(c,{message:r.jenis_sebab_id,className:"mt-2"})]}),s("div",{className:"col-span-8",children:[a(o,{for:"sebab",value:"Sebab"}),a(g,{id:"sebab",value:t.sebab,handleChange:e=>l("sebab",e.target.value),rows:5,type:"text",className:"block w-full mt-1"}),a(c,{message:r.sebab,className:"mt-2"})]}),s("div",{className:"col-span-4 mt-6",children:[a(ne,{ShouldMap:n.currently,selected:y,onChange:e=>{l({...t,currently_id:e.id}),v(e)}}),a(c,{message:r.currently_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"Kategori Risiko",value:"PIC Unit Terkait"}),a(ae,{ShouldMap:n.pics,name:"pic_id",onChange:e=>{const D=JSON.parse(e).join(",");l({...t,pic_id:D})}}),a(c,{message:r.pic_id,className:"mt-2"})]}),s("div",{className:"col-span-4",children:[a(o,{for:"Sumber Identifikasi",value:"Sumber Identifikasi"}),a(u,{ShouldMap:n.identificationSources,selected:C,onChange:e=>{l({...t,identification_source_id:e.id}),P(e)}}),a(c,{message:r.identification_source_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"resiko",value:"Risiko"}),a(g,{id:"resiko",value:t.resiko,handleChange:e=>l("resiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.resiko,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"dampak",value:"Dampak"}),a(g,{id:"dampak",value:t.dampak,handleChange:e=>l("dampak",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.dampak,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"pernyataan risiko",value:"Pernyataan Risiko"}),a(g,{id:"pernyataan_risiko",readOnly:!0,value:t.pernyataan_risiko??"",handleChange:e=>l("pernyataan_risiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.pernyataan_risiko,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(o,{for:"Jenis Insiden",value:"Jenis Insiden"}),a(u,{ShouldMap:n.riskVarieties,selected:S,onChange:e=>{l({...t,risk_variety_id:e.id}),x(e)}}),a(c,{message:r.risk_variety_id,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(o,{for:"Tipe insiden",value:"Tipe Insiden"}),a(u,{ShouldMap:n.riskTypes,selected:w,onChange:e=>{l({...t,risk_type_id:e.id}),I(e)}}),a(c,{message:r.risk_type_id,className:"mt-2"})]})]})]}),s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700",children:"NUMERATOR & DENUMERATOR (Wajib di Input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-6",children:[a(o,{for:"Denum",value:"Denumerator"}),a(b,{id:"denum",value:t.denum,handleChange:e=>l("denum",e.target.value),readOnly:!1,type:"number",className:"block w-full mt-1"}),a(c,{message:r.denum,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(o,{for:"NUM",value:"Numerator"}),a(b,{id:"num",value:t.num,handleChange:e=>l("num",e.target.value),readOnly:!1,type:"number",className:"block w-full mt-1"}),a(c,{message:r.num,className:"mt-2"})]}),a("div",{className:"col-span-6",children:a(te,{label:"Target Waktu Tindak Lanjut Monitoring (90/180/365)",type:"number",id:"target_waktu",name:"target_waktu",value:t.target_waktu,handleChange:e=>l("target_waktu",e.target.value),message:r.target_waktu})})]})]}),s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700 ",children:"OSD Inherent (Wajib di Input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[a("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg",children:s("div",{className:"grid grid-cols-12 gap-6",children:[a("label",{htmlFor:"",className:"block col-span-12 mb-4 text-base font-bold text-gray-700 ",children:"Dampak dan Probabilitas akan Otomatis Terisi Setelah Melakukan FGD"}),s("div",{className:"col-span-12",children:[a(o,{for:"Dampak",value:"Dampak"}),a(f,{ShouldMap:n.impactValues,selected:j,onChange:e=>{l({...t,osd1_dampak:e.id}),F(e)}}),a(c,{message:r.osd1_dampak,className:"mt-2"})]}),s("div",{className:"col-span-12 cursor-not-allowed",children:[a(o,{for:"Kategori Risiko",value:"Probabilitas"}),a(f,{ShouldMap:n.probabilityValues,selected:V,onChange:e=>{l({...t,osd1_probabilitas:e.id}),E(e)}}),a(c,{message:r.osd1_probabilitas,className:"mt-2"})]})]})}),s("div",{className:"col-span-12",children:[a(o,{for:"Kategori Risiko",value:"Controllability"}),a(u,{ShouldMap:n.controlValues,selected:O,onChange:e=>{l({...t,osd1_controllability:e.id}),J(e)}}),a(c,{message:r.osd1_controllability,className:"mt-2"})]}),s("div",{className:"col-span-4",children:[a(o,{for:"Perlu Penanganan",value:"Perlu Penanganan"}),a(u,{ShouldMap:n.perluPenanganan,selected:K,onChange:e=>{l({...t,perlu_penanganan_id:e.id}),U(e)}}),a(c,{message:r.perlu_penanganan_id,className:"mt-2"})]})]})]}),s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700 ",children:"Pengendalian Yang Sudah Ada (Wajib di input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-12",children:[a(o,{for:"pengendalian_risiko",value:"Pengendalian Risiko yang Sudah Ada"}),a(g,{id:"pengendalian_risiko",value:t.pengendalian_risiko,handleChange:e=>l("pengendalian_risiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.pengendalian_risiko,className:"mt-2"})]}),s("div",{className:"col-span-6 my-6",children:[a(o,{for:"Efektif/Kurang Efektif",value:"Efektif/Kurang Efektif"}),a(u,{ShouldMap:n.efektif,selected:Y,onChange:e=>{l({...t,efektif_id:e.id}),q(e)}}),a(c,{message:r.efektif_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"pengendalian_harus_ada",value:"Pengendalian yang Harus Ada"}),a(g,{id:"pengendalian_harus_ada",value:t.pengendalian_harus_ada,handleChange:e=>l("pengendalian_harus_ada",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.pengendalian_harus_ada,className:"mt-2"})]})]})]}),s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700",children:"Opsi Pengendalian (Wajib di input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-6 my-6",children:[a(o,{for:"Opsi Pengendalian",value:"Opsi Pengendalian"}),a(u,{ShouldMap:n.opsiPengendalian,selected:B,onChange:e=>{l({...t,opsi_pengendalian_id:e.id}),L(e)}}),a(c,{message:r.opsi_pengendalian_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"penanganan_risiko",value:"Uraian Penanganan Risiko"}),a(g,{id:"penanganan_risiko",value:t.penanganan_risiko,handleChange:e=>l("penanganan_risiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.penanganan_risiko,className:"mt-2"})]}),s("div",{className:"col-span-6 my-6",children:[a(o,{for:"Pembiayaan Risiko",value:"Pembiayaan Risiko"}),a(u,{ShouldMap:n.pembiayaanRisiko,selected:G,onChange:e=>{l({...t,pembiayaan_risiko_id:e.id}),H(e)}}),a(c,{message:r.pembiayaan_risiko_id,className:"mt-2"})]}),s("div",{className:"col-span-6 my-6",children:[a(o,{for:"Jenis Pengendalian",value:"Jenis Pengendalian"}),a(u,{ShouldMap:n.jenisPengendalian,selected:z,onChange:e=>{l({...t,jenis_pengendalian_id:e.id}),Q(e)}}),a(c,{message:r.jenis_pengendalian_id,className:"mt-2"})]}),s("div",{className:"col-span-6 my-6",children:[a(o,{for:"Waktu Pengendalian",value:"Waktu Implementasi/Pemantauan"}),a(u,{ShouldMap:n.waktuPengendalian,selected:X,onChange:e=>{l({...t,waktu_pengendalian_id:e.id}),Z(e)}}),a(c,{message:r.waktu_pengendalian_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(o,{for:"rencana_pengendalian",value:"Rencana Kegiatan Pengendalian"}),a(g,{id:"rencana_pengendalian",value:t.rencana_pengendalian,handleChange:e=>l("rencana_pengendalian",e.target.value),type:"text",className:"block w-full mt-1"}),a(c,{message:r.rencana_pengendalian,className:"mt-2"})]})]})]})]})}),s("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[a(ie,{children:k}),a(se,{className:"mx-2",onClick:_,children:"Batal"})]})]})}export{Ve as default};
