import{_ as se,r as s,l as K,g as B,j as a,F as de,a as e,n as re}from"./app-39b28b75.js";import{D as ce}from"./DangerButton-bbe49589.js";import{A as me}from"./AddModal-050b37f5.js";import{D as pe}from"./DestroyModal-b1f00251.js";import{E as b}from"./EditModal-34198886.js";import{T as u}from"./ThirdButton-19d6d25e.js";import{A as ue}from"./App-4e87e92e.js";import he from"./Create-83e3ee39.js";import ge from"./Edit-d1a41bd4.js";import fe from"./Edit-b9ea1c2b.js";import ke from"./Edit-00d20866.js";import be from"./Edit-ccced18f.js";import De from"./Edit-71c4f6d4.js";import we from"./Edit-c74e080c.js";import{T as l,B as ye,P as Re}from"./Badge-af2056e6.js";import"./dialog-67d91a12.js";import"./render-c0db6c63.js";import"./keyboard-2676573b.js";import"./transition-f985c522.js";import"./use-watch-36608396.js";import"./description-cbdcb2f3.js";import"./use-outside-click-973caf8c.js";import"./ApplicationLogo-80ad1ec3.js";import"./TextInput-0232117d.js";import"./ComboboxMultiple-7aee12c8.js";import"./clsx-78a9da9d.js";import"./ComboboxMultipleWithOutSemuaUnit-2a6efb5d.js";import"./BPKP-f031b930.js";import"./InputLabel-3431cd86.js";import"./PrimaryButton-14bd2f2a.js";import"./SecondaryButton-0234b844.js";import"./index-b189e8eb.js";import"./LarsDHPKlinis-86fed8ec.js";import"./LarsDHPNonKlinis-aab28c4b.js";import"./use-resolve-button-type-6de0b13d.js";import"./Form-bf769691.js";import"./AnimatedMulti-9f79afda.js";import"./ComboboxPage-40800f25.js";import"./use-tracked-pointer-be5d0ab3.js";import"./use-tree-walker-f0531641.js";import"./use-controllable-90b8c745.js";import"./ComboboxPageReadonly-c8037ad4.js";import"./InputError-1bf95e0a.js";import"./RadioCard-5a5bd30b.js";import"./TextAreaInput-5d37962a.js";import"./TextInputWithError-4b49646c.js";/* empty css                         */import"./Form-b18663fb.js";import"./Form-7d50824b.js";import"./Form-d42465e3.js";import"./Form-271f28dc.js";import"./Form-25df2e5a.js";const r=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),c=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function _e(o){const{data:p,meta:x,filtered:A,attributes:D}=o.riskRegisterKlinis,{auth:$}=se().props,L=o.riskRegisterCount;o.riskRegisterPengendalianCount,o.OpsiPengendalianCount;const V=o.riskRegisterOsd2Count;let h={riskCategories:o.riskCategories,identificationSources:o.identificationSources,locations:o.locations,riskVarieties:o.riskVarieties,riskTypes:o.riskTypes,jenisSebabs:o.jenisSebabs,opsiPengendalian:o.opsiPengendalian,pembiayaanRisiko:o.pembiayaanRisiko,efektif:o.efektif,jenisPengendalian:o.jenisPengendalian,waktuPengendalian:o.waktuPengendalian,waktuImplementasi:o.waktuImplementasi,pics:o.pics,impactValues:o.impactValues,probabilityValues:o.probabilityValues,controlValues:o.controlValues,indikatorFitur4s:o.indikatorFitur4s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}],perluPenanganan:[{id:1,name:"Ya"},{id:2,name:"Tidak"}],realisasi:[{id:1,name:"Sudah Tercapai"},{id:2,name:"Belum Tercapai"}]};const[W,q]=s.useState([]),[i,v]=s.useState(A),[H,Y]=s.useState(!0),J=s.useCallback(K.debounce(t=>{B.get(route(route().current()),{...K.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{H?Y(!1):J(i)},[i]),s.useEffect(()=>{let t=[];for(let m=D.per_page;m<D.total/D.per_page;m=m+D.per_page)t.push(m);q(t)},[]);const S=t=>{const m={...i,[t.target.name]:t.target.value,page:1};v(m)},d=t=>{v({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},U=()=>{w(!0)},Q=()=>{B.delete(route("riskRegisterKlinis.destroy",f.id),{onSuccess:()=>C(!1)})},[n,I]=s.useState(null),[Ee,g]=s.useState(null),X=t=>{I(n===t?null:t)},Z=t=>{k(t),g(t),C(!0)},ee=t=>{k(t),g(t),y(!0)},ie=t=>{k(t),g(t),R(!0)},te=t=>{k(t),g(t),_(!0)},le=t=>{k(t),g(t),E(!0)},ne=t=>{k(t),g(t),T(!0)},ae=t=>{k(t),g(t),O(!0)},[N,w]=s.useState(!1),[F,y]=s.useState(!1),[M,R]=s.useState(!1),[P,_]=s.useState(!1),[j,E]=s.useState(!1),[z,T]=s.useState(!1),[G,O]=s.useState(!1),[oe,C]=s.useState(!1),[f,k]=s.useState([]);return a(de,{children:[e(re,{title:"Risk Register Klinis"}),e(me,{isOpenAddDialog:N,setIsOpenAddDialog:w,size:"max-w-6xl",title:"Tambah Risk Register Klinis "+$.user.name,children:e(he,{ShouldMap:h,isOpenAddDialog:N,setIsOpenAddDialog:w})}),e(b,{isOpenEditDialog:F,setIsOpenEditDialog:y,size:"max-w-6xl",title:"Edit Risk Register Klinis",children:e(ge,{model:f,ShouldMap:h,isOpenEditDialog:F,setIsOpenEditDialog:y})}),e(b,{isOpenEditDialog:M,setIsOpenEditDialog:R,size:"max-w-6xl",title:"Edit OSD Residual Risk Register Klinis",children:e(fe,{model:f,ShouldMap:h,isOpenEditDialog:M,setIsOpenEditDialog:R})}),e(b,{isOpenEditDialog:P,setIsOpenEditDialog:_,size:"max-w-6xl",title:"Edit Formulir RCA Risk Register Klinis",children:e(ke,{model:f,ShouldMap:h,isOpenEditDialog:P,setIsOpenEditDialog:_})}),e(b,{isOpenEditDialog:j,setIsOpenEditDialog:E,size:"max-w-6xl",title:"Edit FGD Inherent Risk Register Klinis",children:e(be,{model:f,ShouldMap:h,isOpenEditDialog:j,setIsOpenEditDialog:E})}),e(b,{isOpenEditDialog:z,setIsOpenEditDialog:T,size:"max-w-6xl",title:"Edit FGD Residual Risk Register Klinis",children:e(De,{model:f,ShouldMap:h,isOpenEditDialog:z,setIsOpenEditDialog:T})}),e(b,{isOpenEditDialog:G,setIsOpenEditDialog:O,size:"max-w-6xl",title:"Edit FGD Treated Risk Register Klinis",children:e(we,{model:f,ShouldMap:h,isOpenEditDialog:G,setIsOpenEditDialog:O})}),e(pe,{isOpenDestroyDialog:oe,setIsOpenDestroyDialog:C,size:"max-w-2xl",title:"Delete Risk Register Klinis",warning:"Yakin hapus data ini ?",children:e(ce,{className:"ml-2",onClick:Q,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:["RISK REGISTER KLINIS (",L,")"]}),a("div",{className:"flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg",children:[e("div",{className:"w-3/4",children:a("div",{className:"flex items-center justify-start mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-1",children:[a(u,{color:"sky",type:"button",onClick:U,children:["Tambah Risiko",a("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-square-rounded-plus",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M9 12h6"}),e("path",{d:"M12 9v6"}),e("path",{d:"M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"})]})]}),a(u,{color:n===null?"gray":"blue",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];ee(t)}},disabled:n===null,children:["Edit",a("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-edit",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"}),e("path",{d:"M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"}),e("path",{d:"M16 5l3 3"})]})]}),a(u,{color:n===null?"gray":"red",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];Z(t)}},disabled:n===null,children:["Delete",a("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-trash",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M4 7l16 0"}),e("path",{d:"M10 11l0 6"}),e("path",{d:"M14 11l0 6"}),e("path",{d:"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"}),e("path",{d:"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"})]})]}),e(u,{color:n===null?"gray":"teal",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];le(t)}},disabled:n===null,children:"FGD Inherent"}),e(u,{color:n===null?"gray":"cyan",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];ne(t)}},disabled:n===null,children:"FGD Residual"}),a(u,{color:n===null?"gray":"red",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];ie(t)}},disabled:n===null,children:["OSD Residual (",V,")"]}),e(u,{color:n===null?"gray":"sky",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];ae(t)}},disabled:n===null,children:"FGD Treated"}),e(u,{color:n===null?"gray":"yellow",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];te(t)}},disabled:n===null,children:"Formulir RCA"})]})}),e("div",{className:"w-1/4",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap",children:[e("select",{name:"load",id:"load",onChange:S,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:W.map((t,m)=>e("option",{children:t},m))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:S,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),a(l,{children:[e(l.Thead,{children:a(l.Tr,{children:[e(l.Th,{children:"#"}),a(l.Th,{onClick:()=>d("tgl_register"),children:["Tanggal Register",i.field=="tgl_register"&&i.direction=="asc"&&e(r,{}),i.field=="tgl_register"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{width:"w-96",onClick:()=>d("pernyataan_risiko"),children:["Pernyataan Risiko",i.field=="pernyataan_risiko"&&i.direction=="asc"&&e(r,{}),i.field=="pernyataan_risiko"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{width:"w-96",onClick:()=>d("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(r,{}),i.field=="sebab"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("risk_type_id"),children:["Jenis",i.field=="risk_type_id"&&i.direction=="asc"&&e(r,{}),i.field=="risk_type_id"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("risk_variety_id"),children:["Tipe",i.field=="risk_variety_id"&&i.direction=="asc"&&e(r,{}),i.field=="risk_variety_id"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{width:"w-96",onClick:()=>d("dampak"),children:["Efek",i.field=="dampak"&&i.direction=="asc"&&e(r,{}),i.field=="dampak"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd1_dampak"),children:["OSD1 Dampak",i.field=="osd1_dampak"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_dampak"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd1_probabilitas"),children:["OSD1 Probabilitas",i.field=="osd1_probabilitas"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_probabilitas"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd1_controllability"),children:["OSD1 Controllability",i.field=="osd1_controllability"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_controllability"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd1_inherent"),children:["OSD1 Inherent",i.field=="osd1_inherent"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_inherent"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd2_dampak"),children:["OSD2 Dampak",i.field=="osd2_dampak"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_dampak"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd2_probabilitas"),children:["OSD2 Probabilitas",i.field=="osd2_probabilitas"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_probabilitas"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd2_controllability"),children:["OSD2 Controllability",i.field=="osd2_controllability"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_controllability"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd2_inherent"),children:["OSD2 Residu",i.field=="osd2_inherent"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_inherent"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{width:"w-96",onClick:()=>d("pengendalian_risiko"),children:["Pengendalian Risiko",i.field=="pengendalian_risiko"&&i.direction=="asc"&&e(r,{}),i.field=="pengendalian_risiko"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(r,{}),i.field=="user_id"&&i.direction=="desc"&&e(c,{})]})]})}),e(l.Tbody,{children:p.map((t,m)=>a("tr",{className:n===m?"bg-sky-100  cursor-pointer":"cursor-pointer",onClick:()=>X(m),children:[e(l.Td,{children:e(ye,{children:x.from+m})}),e(l.Td,{className:"whitespace-nowrap",children:t.tgl_register}),e(l.Td,{children:t.pernyataan_risiko}),e(l.Td,{children:t.sebab}),e(l.Td,{children:t.risk_variety.name}),e(l.Td,{children:t.risk_type.name}),e(l.Td,{children:t.dampak}),e(l.Td,{children:t.osd1_dampak}),e(l.Td,{children:t.osd1_probabilitas}),e(l.Td,{children:t.osd1_controllability}),e(l.Td,{children:t.osd1_inherent}),e(l.Td,{children:t.osd2_dampak}),e(l.Td,{children:t.osd2_probabilitas}),e(l.Td,{children:t.osd2_controllability}),e(l.Td,{children:t.osd2_inherent}),e(l.Td,{children:t.pengendalian_risiko}),e(l.Td,{children:t.user.name})]},m))})]}),e(Re,{meta:x})]})})]})}_e.layout=o=>e(ue,{children:o});export{_e as default};
