import{_ as V,r as m,l as R,g as v,j as n,F as z,a as e,n as L}from"./app-24588fae.js";import{D as q}from"./DangerButton-6f8824ef.js";import{D as J}from"./DestroyModal-b3e38419.js";import{E as W}from"./EditModal-38b50418.js";import{T as D}from"./ThirdButton-49cabebe.js";import{A as Y}from"./App-5370a33c.js";import $ from"./Edit-472266cc.js";import{T as t,B as G,P as H}from"./Badge-6ad65b4c.js";import"./transition-5f006427.js";import"./render-12e546f0.js";import"./dialog-7405a376.js";import"./keyboard-049b5e19.js";import"./use-watch-b8aa6709.js";import"./description-cd37925a.js";import"./use-outside-click-2799fe76.js";import"./ApplicationLogo-178f125f.js";import"./index-fa25f934.js";import"./TextInput-a967b272.js";import"./ComboboxMultiple-76291485.js";import"./clsx-3c9bef1f.js";import"./index-761d0ab0.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-a0a69770.js";import"./BPKP-8a5f007b.js";import"./InputLabel-5d21ed4f.js";import"./PrimaryButton-de6079d3.js";import"./SecondaryButton-9b656bdb.js";import"./LarsDHPKlinis-967b285e.js";import"./LarsDHPNonKlinis-54fffa54.js";import"./use-resolve-button-type-78525b7b.js";import"./Form-3987553d.js";import"./InputError-dd21eadb.js";import"./TextAreaInput-71393383.js";import"./TextInputWithError-34aac4f2.js";const o=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),r=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function U(l){const{data:p,meta:g,filtered:S,attributes:h}=l.riskRegisterKlinis;V().props;const x=l.riskRegisterCount;l.riskRegisterOsd2Count;let N={riskCategories:l.riskCategories,identificationSources:l.identificationSources,locations:l.locations,riskVarieties:l.riskVarieties,riskTypes:l.riskTypes,jenisSebabs:l.jenisSebabs,opsiPengendalian:l.opsiPengendalian,pembiayaanRisiko:l.pembiayaanRisiko,efektif:l.efektif,jenisPengendalian:l.jenisPengendalian,waktuPengendalian:l.waktuPengendalian,waktuImplementasi:l.waktuImplementasi,pics:l.pics,impactValues:l.impactValues,probabilityValues:l.probabilityValues,controlValues:l.controlValues,indikatorFitur4s:l.indikatorFitur4s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}],perluPenanganan:[{id:1,name:"Ya"},{id:2,name:"Tidak"}],realisasi:[{id:1,name:"Sudah Tercapai"},{id:2,name:"Belum Tercapai"}]};const[E,O]=m.useState([]),[i,b]=m.useState(S),[P,j]=m.useState(!0),I=m.useCallback(R.debounce(a=>{v.get(route(route().current()),{...R.pickBy(a),page:a.page},{preserveState:!0,preserveScroll:!0})},150),[]);m.useEffect(()=>{P?j(!1):I(i)},[i]),m.useEffect(()=>{let a=[];for(let s=h.per_page;s<h.total/h.per_page;s=s+h.per_page)a.push(s);O(a)},[]);const k=a=>{const s={...i,[a.target.name]:a.target.value,page:1};b(s)},d=a=>{b({...i,field:a,direction:i.direction=="asc"?"desc":"asc"})},[c,w]=m.useState(null),[Q,_]=m.useState(null),M=a=>{w(c===a?null:a)},B=a=>{C(a),_(a),u(!0)},A=a=>{C(a),_(a),f(!0)},F=()=>{v.delete(route("riskRegisterKlinis.destroy",T.id),{onSuccess:()=>f(!1)})},[y,u]=m.useState(!1),[K,f]=m.useState(!1),[T,C]=m.useState([]);return n(z,{children:[e(L,{title:"Risk Register Klinis"}),e(W,{isOpenEditDialog:y,setIsOpenEditDialog:u,size:"max-w-6xl",title:"Edit Formulir RCA Risk Register Klinis",children:e($,{model:T,ShouldMap:N,isOpenEditDialog:y,setIsOpenEditDialog:u})}),e(J,{isOpenDestroyDialog:K,setIsOpenDestroyDialog:f,size:"max-w-2xl",title:"Delete Risk Register Klinis",warning:"Yakin hapus data ini ?",children:e(q,{className:"ml-2",onClick:F,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:n("div",{className:"mx-auto sm:px-6 lg:px-8",children:[n("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:["RISIKO SEDANG TERJADI (",x,")"]}),n("div",{className:"flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg",children:[e("div",{className:"w-3/4",children:n("div",{className:"flex items-center justify-start mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-1",children:[n(D,{color:c===null?"gray":"red",type:"button",className:`${c===null?"cursor-not-allowed":""}`,onClick:()=>{if(c!==null){const a=p[c];A(a)}},disabled:c===null,children:["Delete",n("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-trash",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M4 7l16 0"}),e("path",{d:"M10 11l0 6"}),e("path",{d:"M14 11l0 6"}),e("path",{d:"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"}),e("path",{d:"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"})]})]}),e(D,{color:c===null?"gray":"yellow",type:"button",className:`${c===null?"cursor-not-allowed":""}`,onClick:()=>{if(c!==null){const a=p[c];B(a)}},disabled:c===null,children:"Formulir RCA"})]})}),e("div",{className:"w-1/4",children:n("div",{className:"flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap",children:[e("select",{name:"load",id:"load",onChange:k,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:E.map((a,s)=>e("option",{children:a},s))}),n("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:k,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),n(t,{children:[e(t.Thead,{children:n(t.Tr,{children:[e(t.Th,{children:"#"}),n(t.Th,{onClick:()=>d("tgl_register"),children:["Tanggal Register",i.field=="tgl_register"&&i.direction=="asc"&&e(o,{}),i.field=="tgl_register"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{width:"w-96",onClick:()=>d("pernyataan_risiko"),children:["Pernyataan Risiko",i.field=="pernyataan_risiko"&&i.direction=="asc"&&e(o,{}),i.field=="pernyataan_risiko"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{width:"w-96",onClick:()=>d("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(o,{}),i.field=="sebab"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("risk_type_id"),children:["Jenis",i.field=="risk_type_id"&&i.direction=="asc"&&e(o,{}),i.field=="risk_type_id"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("risk_variety_id"),children:["Tipe",i.field=="risk_variety_id"&&i.direction=="asc"&&e(o,{}),i.field=="risk_variety_id"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{width:"w-96",onClick:()=>d("dampak"),children:["Efek",i.field=="dampak"&&i.direction=="asc"&&e(o,{}),i.field=="dampak"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd1_dampak"),children:["OSD1 Dampak",i.field=="osd1_dampak"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_dampak"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd1_probabilitas"),children:["OSD1 Probabilitas",i.field=="osd1_probabilitas"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_probabilitas"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd1_controllability"),children:["OSD1 Controllability",i.field=="osd1_controllability"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_controllability"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd1_inherent"),children:["OSD1 Inherent",i.field=="osd1_inherent"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_inherent"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd2_dampak"),children:["OSD2 Dampak",i.field=="osd2_dampak"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_dampak"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd2_probabilitas"),children:["OSD2 Probabilitas",i.field=="osd2_probabilitas"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_probabilitas"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd2_controllability"),children:["OSD2 Controllability",i.field=="osd2_controllability"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_controllability"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("osd2_inherent"),children:["OSD2 Residu",i.field=="osd2_inherent"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_inherent"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{width:"w-96",onClick:()=>d("pengendalian_risiko"),children:["Pengendalian Risiko",i.field=="pengendalian_risiko"&&i.direction=="asc"&&e(o,{}),i.field=="pengendalian_risiko"&&i.direction=="desc"&&e(r,{})]}),n(t.Th,{onClick:()=>d("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(o,{}),i.field=="user_id"&&i.direction=="desc"&&e(r,{})]})]})}),e(t.Tbody,{children:p.map((a,s)=>n("tr",{className:c===s?"bg-sky-100  cursor-pointer":"cursor-pointer text-red-500 bg-red-50",onClick:()=>M(s),children:[e(t.Td,{children:e(G,{children:g.from+s})}),e(t.Td,{className:"whitespace-nowrap",children:a.tgl_register}),e(t.Td,{children:a.pernyataan_risiko}),e(t.Td,{children:a.sebab}),e(t.Td,{children:a.risk_variety.name}),e(t.Td,{children:a.risk_type.name}),e(t.Td,{children:a.dampak}),e(t.Td,{children:a.osd1_dampak}),e(t.Td,{children:a.osd1_probabilitas}),e(t.Td,{children:a.osd1_controllability}),e(t.Td,{children:a.osd1_inherent}),e(t.Td,{children:a.osd2_dampak}),e(t.Td,{children:a.osd2_probabilitas}),e(t.Td,{children:a.osd2_controllability}),e(t.Td,{children:a.osd2_inherent}),e(t.Td,{children:a.pengendalian_risiko}),e(t.Td,{children:a.user.name})]},s))})]}),e(H,{meta:g})]})})]})}U.layout=l=>e(Y,{children:l});export{U as default};
