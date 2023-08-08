import{r,j as s,F as Z,a}from"./app-65f42ba1.js";import{C as m,R as $}from"./RadioCard-7343c5df.js";import{I as o}from"./InputError-b9a30257.js";import{I as u}from"./InputLabel-6eb49de3.js";import{P as D}from"./PrimaryButton-2ce27186.js";import{S as M}from"./SecondaryButton-e51d8dcd.js";import{T as g}from"./TextAreaInput-fbaf029e.js";import{T as p}from"./TextInput-fb94a6d3.js";import{T as ee}from"./TextInputWithError-ad64e724.js";import{H as ae}from"./index-569f9a33.js";/* empty css                         */import"./use-tracked-pointer-edd0f6a7.js";import"./transition-1cbcc039.js";import"./keyboard-4cd5d298.js";import"./use-resolve-button-type-cf725b17.js";import"./description-c3af844a.js";function be({errors:d,submit:f,data:t,setData:l,ShouldMap:n,model:i,closeButton:k}){const c=[{name:""}];r.useState(()=>i?n.proses.find(e=>e.id===i.proses_id):c[0]);const[_,b]=r.useState(()=>i?n.currently.find(e=>e.id===i.currently_id):c[0]),[y,v]=r.useState(()=>i?n.riskCategories.find(e=>e.id===i.risk_category_id):c[0]),[N,h]=r.useState(()=>i?n.identificationSources.find(e=>e.id===i.identification_source_id):c[0]);r.useState(()=>i?n.locations.find(e=>e.id===i.location_id):c[0]);const[P,C]=r.useState(()=>i?n.riskVarieties.find(e=>e.id===i.risk_variety_id):c[0]),[S,w]=r.useState(()=>i?n.riskTypes.find(e=>e.id===i.risk_type_id):c[0]),[x,I]=r.useState(()=>i?n.impactValues.find(e=>e.id===i.osd1_dampak):c[0]),[R,T]=r.useState(()=>i?n.probabilityValues.find(e=>e.id===i.osd1_probabilitas):c[0]),[V,j]=r.useState(()=>i?n.controlValues.find(e=>e.id===i.osd1_controllability):c[0]);r.useState(()=>i?n.impactValues.find(e=>e.id===i.osd2_dampak):c[0]),r.useState(()=>i?n.probabilityValues.find(e=>e.id===i.osd2_probabilitas):c[0]),r.useState(()=>i?n.controlValues.find(e=>e.id===i.osd2_controllability):c[0]);const[F,O]=r.useState(()=>i?n.pics.find(e=>e.id===i.pic_id):c[0]),[W,K]=r.useState(()=>i?n.indikatorFitur4s.find(e=>e.id===i.indikator_fitur4_id):c[0]);r.useState(()=>i?n.pengawasan.find(e=>e.id===i.pengawasan_id):c[0]);const[J,U]=r.useState(()=>i?n.perluPenanganan.find(e=>e.id===i.perlu_penanganan_id):c[0]),[E,B]=r.useState(()=>i?n.opsiPengendalian.find(e=>e.id===i.opsi_pengendalian_id):c[0]),[H,L]=r.useState(()=>i?n.pembiayaanRisiko.find(e=>e.id===i.pembiayaan_risiko_id):c[0]);r.useState(()=>i?n.efektif.find(e=>e.id===i.efektif_id):c[0]);const[A,q]=r.useState(()=>i?n.jenisPengendalian.find(e=>e.id===i.jenis_pengendalian_id):c[0]),[z,G]=r.useState(()=>i?n.waktuPengendalian.find(e=>e.id===i.waktu_pengendalian_id):c[0]);r.useState(()=>i?n.waktuImplementasi.find(e=>e.id===i.waktu_implementasi_id):c[0]),r.useState(()=>i?n.realisasi.find(e=>e.id===i.realisasi_id):c[0]),r.useEffect(()=>{l({...t,pernyataan_risiko:"Karena "+t.sebab+" Kemungkinan "+t.resiko+" Sehingga "+t.dampak})},[t.sebab,t.resiko,t.dampak]);const[Q,X]=r.useState(null);return r.useState(null),s(Z,{children:[a("div",{className:"px-4 py-5 bg-white sm:p-6",children:s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700 ",children:"Data Risiko (Wajib di Input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-12",children:[a(u,{for:"Indikator",value:"Indikator"}),a(m,{ShouldMap:n.indikatorFitur4s,selected:W,readOnly:!0,onChange:e=>{l({...t,indikator_fitur4_id:e.id}),K(e)}}),a(o,{message:d.indikator_fitur4_id,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(u,{for:"Kategori Risiko",value:"Kategori Risiko"}),a(m,{ShouldMap:n.riskCategories,selected:y,onChange:e=>{l({...t,risk_category_id:e.id}),v(e)}}),a(o,{message:d.risk_category_id,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(u,{for:"TanggalRegister",value:"Tanggal Register"}),a(ae,{dateFormat:"dd-MM-yyyy",value:t.tgl_register,selected:Q,id:"tgl_register",name:"tgl_register",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:e=>{X(e);const Y=new Date(e).toLocaleDateString("en-CA");l("tgl_register",Y)}}),a(o,{message:d.tgl_register,className:"mt-2"})]}),s("div",{className:"col-span-8",children:[a(u,{for:"sebab",value:"Sebab"}),a(g,{id:"sebab",value:t.sebab,handleChange:e=>l("sebab",e.target.value),rows:5,type:"text",className:"block w-full mt-1"}),a(o,{message:d.sebab,className:"mt-2"})]}),s("div",{className:"col-span-4 mt-6",children:[a($,{ShouldMap:n.currently,selected:_,onChange:e=>{l({...t,currently_id:e.id}),b(e)}}),a(o,{message:d.currently_id,className:"mt-2"})]}),s("div",{className:"col-span-8",children:[a(u,{for:"Kategori Risiko",value:"PIC Unit Terkait"}),a(m,{ShouldMap:n.pics,selected:F,onChange:e=>{l({...t,pic_id:e.id}),O(e)}}),a(o,{message:d.pic_id,className:"mt-2"})]}),s("div",{className:"col-span-4",children:[a(u,{for:"Sumber Identifikasi",value:"Sumber Identifikasi"}),a(m,{ShouldMap:n.identificationSources,selected:N,onChange:e=>{l({...t,identification_source_id:e.id}),h(e)}}),a(o,{message:d.identification_source_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(u,{for:"resiko",value:"Risiko"}),a(g,{id:"resiko",value:t.resiko,handleChange:e=>l("resiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(o,{message:d.resiko,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(u,{for:"dampak",value:"Dampak"}),a(g,{id:"dampak",value:t.dampak,handleChange:e=>l("dampak",e.target.value),type:"text",className:"block w-full mt-1"}),a(o,{message:d.dampak,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(u,{for:"pernyataan risiko",value:"Pernyataan Risiko"}),a(g,{id:"pernyataan_risiko",readOnly:!0,value:t.pernyataan_risiko??"",handleChange:e=>l("pernyataan_risiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(o,{message:d.pernyataan_risiko,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(u,{for:"Jenis Insiden",value:"Jenis Insiden"}),a(m,{ShouldMap:n.riskVarieties,selected:P,onChange:e=>{l({...t,risk_variety_id:e.id}),C(e)}}),a(o,{message:d.risk_variety_id,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(u,{for:"Tipe insiden",value:"Tipe Insiden"}),a(m,{ShouldMap:n.riskTypes,selected:S,onChange:e=>{l({...t,risk_type_id:e.id}),w(e)}}),a(o,{message:d.risk_type_id,className:"mt-2"})]})]})]}),s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700",children:"NUM DENUM (Wajib di Input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-6",children:[a(u,{for:"Denum",value:"Denum"}),a(p,{id:"denum",value:t.denum,handleChange:e=>l("denum",e.target.value),readOnly:!1,type:"number",className:"block w-full mt-1"}),a(o,{message:d.denum,className:"mt-2"})]}),s("div",{className:"col-span-6",children:[a(u,{for:"NUM",value:"NUM"}),a(p,{id:"num",value:t.num,handleChange:e=>l("num",e.target.value),readOnly:!1,type:"number",className:"block w-full mt-1"}),a(o,{message:d.num,className:"mt-2"})]}),a("div",{className:"col-span-6",children:a(ee,{label:"Target Waktu Tindak Lanjut(Hari)",type:"number",id:"target_waktu",name:"target_waktu",value:t.target_waktu,handleChange:e=>l("target_waktu",e.target.value),message:d.target_waktu})})]})]}),s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700 ",children:"OSD Inherent (Wajib di Input)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-12",children:[a(u,{for:"Dampak",value:"Dampak"}),a(m,{ShouldMap:n.impactValues,selected:x,onChange:e=>{l({...t,osd1_dampak:e.id}),I(e)}}),a(o,{message:d.osd1_dampak,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(u,{for:"Kategori Risiko",value:"Probabilitas"}),a(m,{ShouldMap:n.probabilityValues,selected:R,onChange:e=>{l({...t,osd1_probabilitas:e.id}),T(e)}}),a(o,{message:d.osd1_probabilitas,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(u,{for:"Kategori Risiko",value:"Controllability"}),a(m,{ShouldMap:n.controlValues,selected:V,onChange:e=>{l({...t,osd1_controllability:e.id}),j(e)}}),a(o,{message:d.osd1_controllability,className:"mt-2"})]}),s("div",{className:"col-span-4",children:[a(u,{for:"Perlu Penanganan",value:"Perlu Penanganan"}),a(m,{ShouldMap:n.perluPenanganan,selected:J,onChange:e=>{l({...t,perlu_penanganan_id:e.id}),U(e)}}),a(o,{message:d.perlu_penanganan_id,className:"mt-2"})]})]})]}),s("div",{className:"col-span-12 p-6 my-6 border-4 rounded-lg border-cyan-200 ",children:[a("label",{htmlFor:"",className:"block mb-4 text-lg font-bold text-gray-700",children:"Opsi Pengendalian (Wajib di input setelah ada pengendalian)"}),s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-6 my-6",children:[a(u,{for:"Opsi Pengendalian",value:"Opsi Pengendalian"}),a(m,{ShouldMap:n.opsiPengendalian,selected:E,onChange:e=>{l({...t,opsi_pengendalian_id:e.id}),B(e)}}),a(o,{message:d.opsi_pengendalian_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(u,{for:"pengendalian_risiko",value:"Uraian Penanganan Risiko"}),a(g,{id:"pengendalian_risiko",value:t.pengendalian_risiko,handleChange:e=>l("pengendalian_risiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(o,{message:d.pengendalian_risiko,className:"mt-2"})]}),s("div",{className:"col-span-6 my-6",children:[a(u,{for:"Pembiayaan Risiko",value:"Pembiayaan Risiko"}),a(m,{ShouldMap:n.pembiayaanRisiko,selected:H,onChange:e=>{l({...t,pembiayaan_risiko_id:e.id}),L(e)}}),a(o,{message:d.pembiayaan_risiko_id,className:"mt-2"})]}),s("div",{className:"col-span-6 my-6",children:[a(u,{for:"Jenis Pengendalian",value:"Jenis Pengendalian"}),a(m,{ShouldMap:n.jenisPengendalian,selected:A,onChange:e=>{l({...t,jenis_pengendalian_id:e.id}),q(e)}}),a(o,{message:d.jenis_pengendalian_id,className:"mt-2"})]}),s("div",{className:"col-span-6 my-6",children:[a(u,{for:"Waktu Pengendalian",value:"Waktu Implementasi/Pemantauan"}),a(m,{ShouldMap:n.waktuPengendalian,selected:z,onChange:e=>{l({...t,waktu_pengendalian_id:e.id}),G(e)}}),a(o,{message:d.waktu_pengendalian_id,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[a(u,{for:"pengendalian_risiko",value:"Rencana Kegiatan Pengendalian"}),a(g,{id:"pengendalian_risiko",value:t.pengendalian_risiko,handleChange:e=>l("pengendalian_risiko",e.target.value),type:"text",className:"block w-full mt-1"}),a(o,{message:d.pengendalian_risiko,className:"mt-2"})]})]})]})]})}),s("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[a(D,{children:f}),a(M,{className:"mx-2",onClick:k,children:"Batal"})]})]})}export{be as default};
