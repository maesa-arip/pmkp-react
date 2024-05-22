import{_ as ge,r as s,l as q,g as Y,j as a,F as fe,a as e,n as be}from"./app-e4099200.js";import{D as ke}from"./DangerButton-205b3604.js";import{A as we}from"./AddModal-d6aba245.js";import{D as De}from"./DestroyModal-d5f1850d.js";import{E as k}from"./EditModal-1bd4b5a2.js";import{T as u}from"./ThirdButton-1b8d4f49.js";import{A as ye}from"./App-820db04c.js";import Re from"./Create-7cfc1e05.js";import _e from"./Edit-80e4989b.js";import Ee from"./Edit-39404f54.js";import Te from"./Edit-a90e26b0.js";import xe from"./Edit-52c7f357.js";import Ce from"./Edit-5324a330.js";import Oe from"./Edit-8e94a10b.js";import{T as l,B as ve,P as Se}from"./Badge-db620f1e.js";import"./dialog-365616ce.js";import"./render-8c44965e.js";import"./keyboard-32ee57cb.js";import"./transition-5c9fd50b.js";import"./use-watch-98553e18.js";import"./description-38ee27f4.js";import"./use-outside-click-b48eb3a3.js";import"./ApplicationLogo-f873f789.js";import"./index-34b16df4.js";import"./use-tracked-pointer-ed229435.js";import"./use-tree-walker-622b50a8.js";import"./use-controllable-9548db27.js";import"./TextInput-23fa1da9.js";import"./ComboboxMultiple-a5d00ffa.js";import"./clsx-b0d5749e.js";import"./inheritsLoose-c4a937f7.js";import"./createClass-1dd8160f.js";import"./defineProperty-741a9c8e.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-32b20c21.js";import"./BPKP-4e14f56d.js";import"./InputLabel-1346bb0f.js";import"./PrimaryButton-01f19056.js";import"./SecondaryButton-f8403748.js";import"./index-2b80ace9.js";import"./ComboboxMultiple copy-22bbeac8.js";import"./ComboboxPage-23435f6d.js";import"./LarsDHPKlinis-f7202ced.js";import"./LarsDHPNonKlinis-3f4ea0aa.js";import"./SedangTerjadi-53c2aa0b.js";import"./IKPDataInsiden-e4716ed1.js";import"./IKPDataEvaluasi-149f68df.js";import"./Form-c6486959.js";import"./AnimatedMulti-83022dca.js";import"./ComboboxPageReadonly-fb6331e4.js";import"./InputError-08e5762a.js";import"./RadioCard-f9deeec4.js";import"./TextAreaInput-2cf1d1e8.js";import"./TextInputWithError-d2b50137.js";import"./Form-53a820bc.js";import"./Form-b139c1e2.js";import"./Form-39813bbb.js";import"./Form-5e6cd926.js";import"./Form-ded81680.js";const r=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),c=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function Ie(o){const{data:p,meta:O,filtered:J,attributes:w}=o.riskRegisterKlinis,{auth:U}=ge().props,Q=o.riskRegisterCount;o.riskRegisterPengendalianCount,o.OpsiPengendalianCount;const X=o.riskRegisterOsd2Count;let h={riskCategories:o.riskCategories,identificationSources:o.identificationSources,locations:o.locations,riskVarieties:o.riskVarieties,riskTypes:o.riskTypes,jenisSebabs:o.jenisSebabs,opsiPengendalian:o.opsiPengendalian,pembiayaanRisiko:o.pembiayaanRisiko,efektif:o.efektif,jenisPengendalian:o.jenisPengendalian,waktuPengendalian:o.waktuPengendalian,waktuImplementasi:o.waktuImplementasi,pics:o.pics,impactValues:o.impactValues,probabilityValues:o.probabilityValues,controlValues:o.controlValues,indikatorFitur4s:o.indikatorFitur4s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}],perluPenanganan:[{id:1,name:"Ya"},{id:2,name:"Tidak"}],realisasi:[{id:1,name:"Sudah Tercapai"},{id:2,name:"Belum Tercapai"}]};const[Z,ee]=s.useState([]),[i,v]=s.useState(J),[ie,te]=s.useState(!0),le=s.useCallback(q.debounce(t=>{Y.get(route(route().current()),{...q.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{ie?te(!1):le(i)},[i]),s.useEffect(()=>{let t=[];for(let m=w.per_page;m<w.total/w.per_page;m=m+w.per_page)t.push(m);ee(t)},[]);const S=t=>{const m={...i,[t.target.name]:t.target.value,page:1};v(m)},d=t=>{v({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},ne=()=>{D(!0)},ae=()=>{Y.delete(route("riskRegisterKlinis.destroy",f.id),{onSuccess:()=>C(!1)})},[n,I]=s.useState(null),[Ne,g]=s.useState(null),oe=t=>{I(n===t?null:t)},de=t=>{b(t),g(t),C(!0)},se=t=>{b(t),g(t),y(!0)},re=t=>{b(t),g(t),R(!0)},ce=t=>{b(t),g(t),_(!0)},me=t=>{b(t),g(t),E(!0)},pe=t=>{b(t),g(t),T(!0)},ue=t=>{b(t),g(t),x(!0)},[N,D]=s.useState(!1),[F,y]=s.useState(!1),[M,R]=s.useState(!1),[P,_]=s.useState(!1),[j,E]=s.useState(!1),[G,T]=s.useState(!1),[z,x]=s.useState(!1),[he,C]=s.useState(!1),[f,b]=s.useState([]);return a(fe,{children:[e(be,{title:"Risk Register Klinis"}),e(we,{isOpenAddDialog:N,setIsOpenAddDialog:D,size:"max-w-6xl",title:"Tambah Risk Register Klinis "+U.user.name,children:e(Re,{ShouldMap:h,isOpenAddDialog:N,setIsOpenAddDialog:D})}),e(k,{isOpenEditDialog:F,setIsOpenEditDialog:y,size:"max-w-6xl",title:"Edit Risk Register Klinis",children:e(_e,{model:f,ShouldMap:h,isOpenEditDialog:F,setIsOpenEditDialog:y})}),e(k,{isOpenEditDialog:M,setIsOpenEditDialog:R,size:"max-w-6xl",title:"Edit OSD Residual Risk Register Klinis",children:e(Ee,{model:f,ShouldMap:h,isOpenEditDialog:M,setIsOpenEditDialog:R})}),e(k,{isOpenEditDialog:P,setIsOpenEditDialog:_,size:"max-w-6xl",title:"Edit Formulir RCA Risk Register Klinis",children:e(Te,{model:f,ShouldMap:h,isOpenEditDialog:P,setIsOpenEditDialog:_})}),e(k,{isOpenEditDialog:j,setIsOpenEditDialog:E,size:"max-w-6xl",title:"Edit FGD Inherent Risk Register Klinis",children:e(xe,{model:f,ShouldMap:h,isOpenEditDialog:j,setIsOpenEditDialog:E})}),e(k,{isOpenEditDialog:G,setIsOpenEditDialog:T,size:"max-w-6xl",title:"Edit FGD Residual Risk Register Klinis",children:e(Ce,{model:f,ShouldMap:h,isOpenEditDialog:G,setIsOpenEditDialog:T})}),e(k,{isOpenEditDialog:z,setIsOpenEditDialog:x,size:"max-w-6xl",title:"Edit FGD Treated Risk Register Klinis",children:e(Oe,{model:f,ShouldMap:h,isOpenEditDialog:z,setIsOpenEditDialog:x})}),e(De,{isOpenDestroyDialog:he,setIsOpenDestroyDialog:C,size:"max-w-2xl",title:"Delete Risk Register Klinis",warning:"Yakin hapus data ini ?",children:e(ke,{className:"ml-2",onClick:ae,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:["RISK REGISTER KLINIS (",Q,")"]}),a("div",{className:"flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg",children:[e("div",{className:"w-3/4",children:a("div",{className:"flex items-center justify-start mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-1",children:[a(u,{color:"sky",type:"button",onClick:ne,children:["Tambah Risiko",a("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-square-rounded-plus",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M9 12h6"}),e("path",{d:"M12 9v6"}),e("path",{d:"M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"})]})]}),a(u,{color:n===null?"gray":"blue",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];se(t)}},disabled:n===null,children:["Edit",a("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-edit",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"}),e("path",{d:"M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"}),e("path",{d:"M16 5l3 3"})]})]}),a(u,{color:n===null?"gray":"red",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];de(t)}},disabled:n===null,children:["Delete",a("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-trash",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M4 7l16 0"}),e("path",{d:"M10 11l0 6"}),e("path",{d:"M14 11l0 6"}),e("path",{d:"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"}),e("path",{d:"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"})]})]}),e(u,{color:n===null?"gray":"teal",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];me(t)}},disabled:n===null,children:"FGD Inherent"}),e(u,{color:n===null?"gray":"cyan",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];pe(t)}},disabled:n===null,children:"FGD Residual"}),a(u,{color:n===null?"gray":"red",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];re(t)}},disabled:n===null,children:["OSD Residual (",X,")"]}),e(u,{color:n===null?"gray":"sky",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];ue(t)}},disabled:n===null,children:"FGD Treated"}),e(u,{color:n===null?"gray":"yellow",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=p[n];ce(t)}},disabled:n===null,children:"Formulir RCA"})]})}),e("div",{className:"w-1/4",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap",children:[e("select",{name:"load",id:"load",onChange:S,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:Z.map((t,m)=>e("option",{children:t},m))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:S,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),a(l,{children:[e(l.Thead,{children:a(l.Tr,{children:[e(l.Th,{children:"#"}),a(l.Th,{onClick:()=>d("tgl_register"),children:["Tanggal Register",i.field=="tgl_register"&&i.direction=="asc"&&e(r,{}),i.field=="tgl_register"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{width:"w-96",onClick:()=>d("pernyataan_risiko"),children:["Pernyataan Risiko",i.field=="pernyataan_risiko"&&i.direction=="asc"&&e(r,{}),i.field=="pernyataan_risiko"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{width:"w-96",onClick:()=>d("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(r,{}),i.field=="sebab"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("risk_type_id"),children:["Jenis",i.field=="risk_type_id"&&i.direction=="asc"&&e(r,{}),i.field=="risk_type_id"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("risk_variety_id"),children:["Tipe",i.field=="risk_variety_id"&&i.direction=="asc"&&e(r,{}),i.field=="risk_variety_id"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{width:"w-96",onClick:()=>d("dampak"),children:["Efek",i.field=="dampak"&&i.direction=="asc"&&e(r,{}),i.field=="dampak"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd1_dampak"),children:["OSD1 Dampak",i.field=="osd1_dampak"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_dampak"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd1_probabilitas"),children:["OSD1 Probabilitas",i.field=="osd1_probabilitas"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_probabilitas"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd1_controllability"),children:["OSD1 Controllability",i.field=="osd1_controllability"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_controllability"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd1_inherent"),children:["OSD1 Inherent",i.field=="osd1_inherent"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_inherent"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd2_dampak"),children:["OSD2 Dampak",i.field=="osd2_dampak"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_dampak"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd2_probabilitas"),children:["OSD2 Probabilitas",i.field=="osd2_probabilitas"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_probabilitas"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd2_controllability"),children:["OSD2 Controllability",i.field=="osd2_controllability"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_controllability"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("osd2_inherent"),children:["OSD2 Residu",i.field=="osd2_inherent"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_inherent"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{width:"w-96",onClick:()=>d("pengendalian_risiko"),children:["Pengendalian Risiko",i.field=="pengendalian_risiko"&&i.direction=="asc"&&e(r,{}),i.field=="pengendalian_risiko"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(r,{}),i.field=="user_id"&&i.direction=="desc"&&e(c,{})]}),a(l.Th,{onClick:()=>d("user_id"),children:["Grading",i.field=="user_id"&&i.direction=="asc"&&e(r,{}),i.field=="user_id"&&i.direction=="desc"&&e(c,{})]})]})}),e(l.Tbody,{children:p.map((t,m)=>{var K,B,A,L,$,V,H,W;return a("tr",{className:n===m?"bg-sky-100  cursor-pointer":((K=t.riskgrading)==null?void 0:K.name)=="Extreme"?"cursor-pointer text-white bg-red-500":((B=t.riskgrading)==null?void 0:B.name)=="High"?"cursor-pointer text-white bg-amber-600":((A=t.riskgrading)==null?void 0:A.name)=="Moderate"?"cursor-pointer text-yellow-950 bg-yellow-400":(((L=t.riskgrading)==null?void 0:L.name)=="Low","cursor-pointer text-white bg-sky-500"),onClick:()=>oe(m),children:[e(l.Td,{children:e(ve,{children:O.from+m})}),e(l.Td,{className:"whitespace-nowrap",children:t.tgl_register}),e(l.Td,{children:t.pernyataan_risiko}),e(l.Td,{children:t.sebab}),e(l.Td,{children:($=t.risk_variety)==null?void 0:$.name}),e(l.Td,{children:(V=t.risk_type)==null?void 0:V.name}),e(l.Td,{children:t.dampak}),e(l.Td,{children:t.osd1_dampak}),e(l.Td,{children:t.osd1_probabilitas}),e(l.Td,{children:t.osd1_controllability}),e(l.Td,{children:t.osd1_inherent}),e(l.Td,{children:t.osd2_dampak}),e(l.Td,{children:t.osd2_probabilitas}),e(l.Td,{children:t.osd2_controllability}),e(l.Td,{children:t.osd2_inherent}),e(l.Td,{children:t.pengendalian_risiko}),e(l.Td,{children:(H=t.user)==null?void 0:H.name}),e(l.Td,{children:(W=t.riskgrading)==null?void 0:W.name})]},m)})})]}),e(Se,{meta:O})]})})]})}Ie.layout=o=>e(ye,{children:o});export{Ie as default};
