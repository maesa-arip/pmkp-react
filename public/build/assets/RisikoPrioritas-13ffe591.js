import{_ as V,r as m,l as C,g as v,j as n,F as z,a as e,n as L}from"./app-39b28b75.js";import{D as G}from"./DangerButton-bbe49589.js";import{D as q}from"./DestroyModal-b1f00251.js";import{E as W}from"./EditModal-34198886.js";import{T as S}from"./ThirdButton-19d6d25e.js";import{A as Y}from"./App-4e87e92e.js";import $ from"./Edit-00d20866.js";import{T as t,B as H,P as J}from"./Badge-af2056e6.js";import"./transition-f985c522.js";import"./render-c0db6c63.js";import"./dialog-67d91a12.js";import"./keyboard-2676573b.js";import"./use-watch-36608396.js";import"./description-cbdcb2f3.js";import"./use-outside-click-973caf8c.js";import"./ApplicationLogo-80ad1ec3.js";import"./TextInput-0232117d.js";import"./ComboboxMultiple-7aee12c8.js";import"./clsx-78a9da9d.js";import"./ComboboxMultipleWithOutSemuaUnit-2a6efb5d.js";import"./BPKP-f031b930.js";import"./InputLabel-3431cd86.js";import"./PrimaryButton-14bd2f2a.js";import"./SecondaryButton-0234b844.js";import"./index-b189e8eb.js";import"./LarsDHPKlinis-86fed8ec.js";import"./LarsDHPNonKlinis-aab28c4b.js";import"./use-resolve-button-type-6de0b13d.js";import"./Form-7d50824b.js";import"./InputError-1bf95e0a.js";import"./TextAreaInput-5d37962a.js";import"./TextInputWithError-4b49646c.js";/* empty css                         */const o=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),r=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function U(l){const{data:p,meta:f,filtered:x,attributes:h}=l.riskRegisterKlinis;V().props;const D=l.riskRegisterCount;l.riskRegisterOsd2Count;let N={riskCategories:l.riskCategories,identificationSources:l.identificationSources,locations:l.locations,riskVarieties:l.riskVarieties,riskTypes:l.riskTypes,jenisSebabs:l.jenisSebabs,opsiPengendalian:l.opsiPengendalian,pembiayaanRisiko:l.pembiayaanRisiko,efektif:l.efektif,jenisPengendalian:l.jenisPengendalian,waktuPengendalian:l.waktuPengendalian,waktuImplementasi:l.waktuImplementasi,pics:l.pics,impactValues:l.impactValues,probabilityValues:l.probabilityValues,controlValues:l.controlValues,indikatorFitur4s:l.indikatorFitur4s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}],perluPenanganan:[{id:1,name:"Ya"},{id:2,name:"Tidak"}],realisasi:[{id:1,name:"Sudah Tercapai"},{id:2,name:"Belum Tercapai"}]};const[P,O]=m.useState([]),[i,b]=m.useState(x),[I,E]=m.useState(!0),j=m.useCallback(C.debounce(a=>{v.get(route(route().current()),{...C.pickBy(a),page:a.page},{preserveState:!0,preserveScroll:!0})},150),[]);m.useEffect(()=>{I?E(!1):j(i)},[i]),m.useEffect(()=>{let a=[];for(let s=h.per_page;s<h.total/h.per_page;s=s+h.per_page)a.push(s);O(a)},[]);const k=a=>{const s={...i,[a.target.name]:a.target.value,page:1};b(s)},d=a=>{b({...i,field:a,direction:i.direction=="asc"?"desc":"asc"})},[c,w]=m.useState(null),[Q,_]=m.useState(null),M=a=>{w(c===a?null:a)},B=a=>{R(a),_(a),u(!0)},A=a=>{R(a),_(a),g(!0)},F=()=>{v.delete(route("riskRegisterKlinis.destroy",T.id),{onSuccess:()=>g(!1)})},[y,u]=m.useState(!1),[K,g]=m.useState(!1),[T,R]=m.useState([]);return n(z,{children:[e(L,{title:"Risk Register Klinis"}),e(W,{isOpenEditDialog:y,setIsOpenEditDialog:u,size:"max-w-6xl",title:"Edit Formulir RCA Risk Register Klinis",children:e($,{model:T,ShouldMap:N,isOpenEditDialog:y,setIsOpenEditDialog:u})}),e(q,{isOpenDestroyDialog:K,setIsOpenDestroyDialog:g,size:"max-w-2xl",title:"Delete Risk Register Klinis",warning:"Yakin hapus data ini ?",children:e(G,{className:"ml-2",onClick:F,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:n("div",{className:"mx-auto sm:px-6 lg:px-8",children:[n("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:["RISIKO PRIORITAS (",D,")"]}),n("div",{className:"flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg",children:[e("div",{className:"w-3/4",children:n("div",{className:"flex items-center justify-start mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-1",children:[n(S,{color:c===null?"gray":"red",type:"button",className:`${c===null?"cursor-not-allowed":""}`,onClick:()=>{if(c!==null){const a=p[c];A(a)}},disabled:c===null,children:["Delete",n("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-trash",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M4 7l16 0"}),e("path",{d:"M10 11l0 6"}),e("path",{d:"M14 11l0 6"}),e("path",{d:"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"}),e("path",{d:"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"})]})]}),e(S,{color:c===null?"gray":"yellow",type:"button",className:`${c===null?"cursor-not-allowed":""}`,onClick:()=>{if(c!==null){const a=p[c];B(a)}},disabled:c===null,children:"Formulir RCA"})]})}),e("div",{className:"w-1/4",children:n("div",{className:"flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap",children:[e("select",{name:"load",id:"load",onChange:k,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:P.map((a,s)=>e("option",{children:a},s))}),n("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:k,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),n(t,{children:[e(t.Thead,{children:n(t.Tr,{children:[e(t.Th,{children:"#"}),e(t.Th,{children:"Status"}),n(t.Th,{onClick:()=>d("tgl_register"),children:["Tanggal Register",i.field=="tgl_register"&&i.direction=="asc"&&e(o,{}),i.field=="tgl_register"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{width:"w-96",onClick:()=>d("pernyataan_risiko"),children:["Pernyataan Risiko",i.field=="pernyataan_risiko"&&i.direction=="asc"&&e(o,{}),i.field=="pernyataan_risiko"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{width:"w-96",onClick:()=>d("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(o,{}),i.field=="sebab"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("risk_type_id"),children:["Jenis",i.field=="risk_type_id"&&i.direction=="asc"&&e(o,{}),i.field=="risk_type_id"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("risk_variety_id"),children:["Tipe",i.field=="risk_variety_id"&&i.direction=="asc"&&e(o,{}),i.field=="risk_variety_id"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{width:"w-96",onClick:()=>d("dampak"),children:["Efek",i.field=="dampak"&&i.direction=="asc"&&e(o,{}),i.field=="dampak"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd1_dampak"),children:["OSD1 Dampak",i.field=="osd1_dampak"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_dampak"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd1_probabilitas"),children:["OSD1 Probabilitas",i.field=="osd1_probabilitas"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_probabilitas"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd1_controllability"),children:["OSD1 Controllability",i.field=="osd1_controllability"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_controllability"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd1_inherent"),children:["OSD1 Inherent",i.field=="osd1_inherent"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_inherent"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd2_dampak"),children:["OSD2 Dampak",i.field=="osd2_dampak"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_dampak"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd2_probabilitas"),children:["OSD2 Probabilitas",i.field=="osd2_probabilitas"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_probabilitas"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd2_controllability"),children:["OSD2 Controllability",i.field=="osd2_controllability"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_controllability"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd2_inherent"),children:["OSD2 Residu",i.field=="osd2_inherent"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_inherent"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{width:"w-96",onClick:()=>d("pengendalian_risiko"),children:["Pengendalian Risiko",i.field=="pengendalian_risiko"&&i.direction=="asc"&&e(o,{}),i.field=="pengendalian_risiko"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(o,{}),i.field=="user_id"&&i.direction=="desc"&&e(r,{})]})]})}),e(t.Tbody,{children:p.map((a,s)=>n("tr",{className:c===s?"bg-sky-100  cursor-pointer":a.riskgrading.name_bpkp=="SANGAT TINGGI"?"cursor-pointer text-red-500 bg-red-50":"cursor-pointer text-yellow-700 bg-yellow-50",onClick:()=>M(s),children:[e(t.Td,{children:e(H,{children:f.from+s})}),e(t.Td,{className:"whitespace-nowrap",children:a.tgl_register}),e(t.Td,{className:"whitespace-nowrap",children:a.riskgrading.name_bpkp}),e(t.Td,{children:a.pernyataan_risiko}),e(t.Td,{children:a.sebab}),e(t.Td,{children:a.risk_variety.name}),e(t.Td,{children:a.risk_type.name}),e(t.Td,{children:a.dampak}),e(t.Td,{children:a.osd1_dampak}),e(t.Td,{children:a.osd1_probabilitas}),e(t.Td,{children:a.osd1_controllability}),e(t.Td,{children:a.osd1_inherent}),e(t.Td,{children:a.osd2_dampak}),e(t.Td,{children:a.osd2_probabilitas}),e(t.Td,{children:a.osd2_controllability}),e(t.Td,{children:a.osd2_inherent}),e(t.Td,{children:a.pengendalian_risiko}),e(t.Td,{children:a.user.name})]},s))})]}),e(J,{meta:f})]})})]})}U.layout=l=>e(Y,{children:l});export{U as default};
