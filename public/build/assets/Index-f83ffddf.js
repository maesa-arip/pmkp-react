import{_ as A,r as c,l as y,g as S,j as n,F as K,a as e,n as M}from"./app-40227382.js";import{D as z}from"./DangerButton-3e99067e.js";import{D as F}from"./DestroyModal-3520a38a.js";import{E as G}from"./EditModal-5077c3c8.js";import L from"./Edit-713aa976.js";import{T as q}from"./ThirdButton-4abae519.js";import{A as J}from"./App-682dd345.js";import{T as t,B as Y,P as U}from"./Badge-39f5160c.js";import"./transition-28801c53.js";import"./render-66257b5b.js";import"./dialog-35762c09.js";import"./keyboard-61a26669.js";import"./use-watch-f0387d0f.js";import"./description-bdba954c.js";import"./use-outside-click-09bb6113.js";import"./Form-92c16ea5.js";import"./InputError-0cf9554f.js";import"./InputLabel-4fdd6287.js";import"./PrimaryButton-ce8a4982.js";import"./SecondaryButton-e376ea20.js";import"./TextAreaInput-919603c2.js";import"./TextInput-70d63fd3.js";import"./TextInputWithError-f69ac6cb.js";import"./moment-fbc5633a.js";/* empty css                         */import"./ApplicationLogo-1be1e8fe.js";import"./ComboboxPage-878696ae.js";import"./use-tracked-pointer-5a6dfe94.js";import"./use-tree-walker-55160274.js";import"./use-controllable-2ece201f.js";import"./ComboboxMultiple-7454ec32.js";import"./clsx-aaf5a234.js";import"./defineProperty-8250cd14.js";import"./ComboboxMultipleWithOutSemuaUnit-cfa411bf.js";import"./BPKP-0d5c6a87.js";import"./index-c0c70693.js";import"./LarsDHPKlinis-0e5204a9.js";import"./LarsDHPNonKlinis-e1b41eed.js";import"./SedangTerjadi-42304446.js";const r=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),l=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function W(d){const{data:u,meta:f,filtered:x,attributes:p}=d.riskRegisterKlinis;A().props,d.riskRegisterCount,d.riskRegisterOsd2Count;let v={riskCategories:d.riskCategories,identificationSources:d.identificationSources,locations:d.locations,riskVarieties:d.riskVarieties,riskTypes:d.riskTypes,jenisSebabs:d.jenisSebabs,opsiPengendalian:d.opsiPengendalian,pembiayaanRisiko:d.pembiayaanRisiko,efektif:d.efektif,jenisPengendalian:d.jenisPengendalian,waktuPengendalian:d.waktuPengendalian,waktuImplementasi:d.waktuImplementasi,pics:d.pics,impactValues:d.impactValues,probabilityValues:d.probabilityValues,controlValues:d.controlValues,indikatorFitur4s:d.indikatorFitur4s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}],perluPenanganan:[{id:1,name:"Ya"},{id:2,name:"Tidak"}],realisasi:[{id:1,name:"Sudah Tercapai"},{id:2,name:"Belum Tercapai"}]};const[R,C]=c.useState([]),[i,b]=c.useState(x),[N,D]=c.useState(!0),I=c.useCallback(y.debounce(a=>{S.get(route(route().current()),{...y.pickBy(a),page:a.page},{preserveState:!0,preserveScroll:!0})},150),[]);c.useEffect(()=>{N?D(!1):I(i)},[i]),c.useEffect(()=>{let a=[];for(let s=p.per_page;s<p.total/p.per_page;s=s+p.per_page)a.push(s);C(a)},[]);const g=a=>{const s={...i,[a.target.name]:a.target.value,page:1};b(s)},o=a=>{b({...i,field:a,direction:i.direction=="asc"?"desc":"asc"})},[m,k]=c.useState(null),[$,P]=c.useState(null),O=a=>{k(m===a?null:a)},V=()=>{S.delete(route("riskRegisterKlinis.destroy",T.id),{onSuccess:()=>w(!1)})},E=a=>{B(a),P(a),h(!0)},[_,h]=c.useState(!1),[j,w]=c.useState(!1),[T,B]=c.useState([]);return n(K,{children:[e(M,{title:"Verifikasi Risiko"}),e(G,{isOpenEditDialog:_,setIsOpenEditDialog:h,size:"max-w-6xl",title:"Verifikasi Admin Risiko Prioritas",children:e(L,{model:T,ShouldMap:v,isOpenEditDialog:_,setIsOpenEditDialog:h})}),e(F,{isOpenDestroyDialog:j,setIsOpenDestroyDialog:w,size:"max-w-2xl",title:"Delete Risk Register Klinis",warning:"Yakin hapus data ini ?",children:e(z,{className:"ml-2",onClick:V,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:n("div",{className:"mx-auto sm:px-6 lg:px-8",children:[e("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:"VERIFIKASI MANAJEMEN (RISIKO PRIORITAS)"}),n("div",{className:"flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg",children:[e("div",{className:"w-3/4",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-1",children:e(q,{color:m===null?"gray":"cyan",type:"button",className:`${m===null?"cursor-not-allowed":""}`,onClick:()=>{if(m!==null){const a=u[m];E(a)}},disabled:m===null,children:"Verifikasi"})})}),e("div",{className:"w-1/4",children:n("div",{className:"flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap",children:[e("select",{name:"load",id:"load",onChange:g,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:R.map((a,s)=>e("option",{children:a},s))}),n("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:g,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),n(t,{children:[e(t.Thead,{children:n(t.Tr,{children:[e(t.Th,{children:"#"}),n(t.Th,{onClick:()=>o("tgl_register"),children:["Tanggal Register",i.field=="tgl_register"&&i.direction=="asc"&&e(r,{}),i.field=="tgl_register"&&i.direction=="desc"&&e(l,{})]}),e(t.Th,{children:"Status"}),e(t.Th,{children:"Keterangan Verifikasi"}),n(t.Th,{width:"w-96",onClick:()=>o("pernyataan_risiko"),children:["Pernyataan Risiko",i.field=="pernyataan_risiko"&&i.direction=="asc"&&e(r,{}),i.field=="pernyataan_risiko"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{width:"w-96",onClick:()=>o("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(r,{}),i.field=="sebab"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{onClick:()=>o("risk_type_id"),children:["Jenis",i.field=="risk_type_id"&&i.direction=="asc"&&e(r,{}),i.field=="risk_type_id"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{onClick:()=>o("risk_variety_id"),children:["Tipe",i.field=="risk_variety_id"&&i.direction=="asc"&&e(r,{}),i.field=="risk_variety_id"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{width:"w-96",onClick:()=>o("dampak"),children:["Efek",i.field=="dampak"&&i.direction=="asc"&&e(r,{}),i.field=="dampak"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{onClick:()=>o("osd1_dampak"),children:["OSD1 Dampak",i.field=="osd1_dampak"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_dampak"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{onClick:()=>o("osd1_probabilitas"),children:["OSD1 Probabilitas",i.field=="osd1_probabilitas"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_probabilitas"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{onClick:()=>o("osd1_controllability"),children:["OSD1 Controllability",i.field=="osd1_controllability"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_controllability"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{onClick:()=>o("osd1_inherent"),children:["OSD1 Inherent",i.field=="osd1_inherent"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_inherent"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{onClick:()=>o("osd2_dampak"),children:["OSD2 Dampak",i.field=="osd2_dampak"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_dampak"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{onClick:()=>o("osd2_probabilitas"),children:["OSD2 Probabilitas",i.field=="osd2_probabilitas"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_probabilitas"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{onClick:()=>o("osd2_controllability"),children:["OSD2 Controllability",i.field=="osd2_controllability"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_controllability"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{onClick:()=>o("osd2_inherent"),children:["OSD2 Residu",i.field=="osd2_inherent"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_inherent"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{width:"w-96",onClick:()=>o("pengendalian_risiko"),children:["Pengendalian Risiko",i.field=="pengendalian_risiko"&&i.direction=="asc"&&e(r,{}),i.field=="pengendalian_risiko"&&i.direction=="desc"&&e(l,{})]}),n(t.Th,{onClick:()=>o("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(r,{}),i.field=="user_id"&&i.direction=="desc"&&e(l,{})]})]})}),e(t.Tbody,{children:u.map((a,s)=>n("tr",{className:m===s?"bg-sky-100  cursor-pointer":a.riskgrading.name_bpkp=="SANGAT TINGGI"?"cursor-pointer text-white bg-red-500":a.riskgrading.name_bpkp=="TINGGI"?"cursor-pointer text-white bg-amber-500":"cursor-pointer text-black bg-yellow-300",onClick:()=>O(s),children:[e(t.Td,{children:e(Y,{children:f.from+s})}),e(t.Td,{className:"whitespace-nowrap",children:a.tgl_register}),e(t.Td,{className:"whitespace-nowrap",children:a.riskgrading.name_bpkp}),e(t.Td,{className:"whitespace-nowrap",children:a.verificationpriorityadmin?a.verificationpriorityadmin.keterangan:"Belum Verifikasi"}),e(t.Td,{children:a.pernyataan_risiko}),e(t.Td,{children:a.sebab}),e(t.Td,{children:a.risk_variety.name}),e(t.Td,{children:a.risk_type.name}),e(t.Td,{children:a.dampak}),e(t.Td,{children:a.osd1_dampak}),e(t.Td,{children:a.osd1_probabilitas}),e(t.Td,{children:a.osd1_controllability}),e(t.Td,{children:a.osd1_inherent}),e(t.Td,{children:a.osd2_dampak}),e(t.Td,{children:a.osd2_probabilitas}),e(t.Td,{children:a.osd2_controllability}),e(t.Td,{children:a.osd2_inherent}),e(t.Td,{children:a.pengendalian_risiko}),e(t.Td,{children:a.user.name})]},s))})]}),e(U,{meta:f})]})})]})}W.layout=d=>e(J,{children:d});export{W as default};
