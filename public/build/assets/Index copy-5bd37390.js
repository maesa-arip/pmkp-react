import{_ as re,r as n,l as G,g as K,j as s,F as ne,a as e,n as oe}from"./app-4dc7e864.js";import{D as de}from"./DangerButton-44b51b6a.js";import{A as ce}from"./AddModal-b61c1bcd.js";import{D as pe}from"./DestroyModal-f1d74722.js";import{E as f}from"./EditModal-e16a21ab.js";import{T as m}from"./ThirdButton-5efe1378.js";import{A as me}from"./App-c64f2658.js";import ue from"./Create-352cdfb4.js";import he from"./Edit-292e6a03.js";import ge from"./Edit-97a6385f.js";import xe from"./Edit-5c52d370.js";import fe from"./Edit-6d7e4c40.js";import ye from"./Edit-93482d56.js";import we from"./Edit-d4892208.js";import"./dialog-231e50f1.js";import"./render-ea42b304.js";import"./keyboard-84303bfc.js";import"./transition-53d35c05.js";import"./use-watch-579ebb77.js";import"./description-72675574.js";import"./use-outside-click-a2e1bd03.js";import"./ApplicationLogo-abc09b78.js";import"./ComboboxPage-ebb481cb.js";import"./use-tracked-pointer-ac86867a.js";import"./use-tree-walker-f4949a02.js";import"./use-controllable-d514a8f4.js";import"./TextInput-6a3dc504.js";import"./ComboboxMultiple-52cd8efc.js";import"./clsx-8d99dcf0.js";import"./defineProperty-8250cd14.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-76d2b20b.js";import"./BPKP-fa411aad.js";import"./InputLabel-858bf6c7.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./index-68480d34.js";import"./LarsDHPKlinis-f4e5310f.js";import"./LarsDHPNonKlinis-d814e89e.js";import"./SedangTerjadi-5a340cc3.js";import"./IKPDataInsiden-779584f5.js";import"./IKPDataEvaluasi-01c6741b.js";import"./Form-4a917c3a.js";import"./ComboboxPageReadonly-4c0e8fe8.js";import"./InputError-e6c099ae.js";import"./RadioCard-802c469a.js";import"./TextAreaInput-36efdc5d.js";import"./TextInputWithError-cb45040b.js";import"./Form-c17280a8.js";import"./Form-c7d7504e.js";import"./Form-d30daaaf.js";import"./Form-9ad645b4.js";import"./Form-e6ddc0e2.js";const o=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),d=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function be(l){const{data:p,meta:C,filtered:$,attributes:y}=l.riskRegisterKlinis,{auth:A}=re().props,L=l.riskRegisterCount;l.riskRegisterPengendalianCount,l.OpsiPengendalianCount;const B=l.riskRegisterOsd2Count;let u={riskCategories:l.riskCategories,identificationSources:l.identificationSources,locations:l.locations,riskVarieties:l.riskVarieties,riskTypes:l.riskTypes,jenisSebabs:l.jenisSebabs,opsiPengendalian:l.opsiPengendalian,pembiayaanRisiko:l.pembiayaanRisiko,efektif:l.efektif,jenisPengendalian:l.jenisPengendalian,waktuPengendalian:l.waktuPengendalian,waktuImplementasi:l.waktuImplementasi,pics:l.pics,impactValues:l.impactValues,probabilityValues:l.probabilityValues,controlValues:l.controlValues,indikatorFitur4s:l.indikatorFitur4s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}],perluPenanganan:[{id:1,name:"Ya"},{id:2,name:"Tidak"}],realisasi:[{id:1,name:"Sudah Tercapai"},{id:2,name:"Belum Tercapai"}]};const[V,W]=n.useState([]),[i,w]=n.useState($),[q,H]=n.useState(!0),U=n.useCallback(G.debounce(t=>{K.get(route(route().current()),{...G.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);n.useEffect(()=>{q?H(!1):U(i)},[i]),n.useEffect(()=>{let t=[];for(let c=y.per_page;c<y.total/y.per_page;c=c+y.per_page)t.push(c);W(t)},[]);const O=t=>{const c={...i,[t.target.name]:t.target.value,page:1};w(c)},r=t=>{w({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},Y=()=>{b(!0)},J=()=>{K.delete(route("riskRegisterNonKlinis.destroy",g.id),{onSuccess:()=>E(!1)})},[a,S]=n.useState(null),[ke,h]=n.useState(null),Q=t=>{S(a===t?null:t)},X=t=>{x(t),h(t),E(!0)},Z=t=>{x(t),h(t),k(!0)},ee=t=>{x(t),h(t),N(!0)},ie=t=>{x(t),h(t),D(!0)},te=t=>{x(t),h(t),v(!0)},ae=t=>{x(t),h(t),R(!0)},se=t=>{x(t),h(t),_(!0)},[I,b]=n.useState(!1),[F,k]=n.useState(!1),[M,N]=n.useState(!1),[T,D]=n.useState(!1),[P,v]=n.useState(!1),[j,R]=n.useState(!1),[z,_]=n.useState(!1),[le,E]=n.useState(!1),[g,x]=n.useState([]);return s(ne,{children:[e(oe,{title:"Risk Register Non Klinis"}),e(ce,{isOpenAddDialog:I,setIsOpenAddDialog:b,size:"max-w-6xl",title:"Tambah Risk Register Non Klinis "+A.user.name,children:e(ue,{ShouldMap:u,isOpenAddDialog:I,setIsOpenAddDialog:b})}),e(f,{isOpenEditDialog:F,setIsOpenEditDialog:k,size:"max-w-6xl",title:"Edit Risk Register Non Klinis",children:e(he,{model:g,ShouldMap:u,isOpenEditDialog:F,setIsOpenEditDialog:k})}),e(f,{isOpenEditDialog:M,setIsOpenEditDialog:N,size:"max-w-6xl",title:"Edit OSD Residual Risk Register Non Klinis",children:e(ge,{model:g,ShouldMap:u,isOpenEditDialog:M,setIsOpenEditDialog:N})}),e(f,{isOpenEditDialog:T,setIsOpenEditDialog:D,size:"max-w-6xl",title:"Edit Formulir RCA Risk Register Non Klinis",children:e(xe,{model:g,ShouldMap:u,isOpenEditDialog:T,setIsOpenEditDialog:D})}),e(f,{isOpenEditDialog:P,setIsOpenEditDialog:v,size:"max-w-6xl",title:"Edit FGD Inherent Risk Register Non Klinis",children:e(fe,{model:g,ShouldMap:u,isOpenEditDialog:P,setIsOpenEditDialog:v})}),e(f,{isOpenEditDialog:j,setIsOpenEditDialog:R,size:"max-w-6xl",title:"Edit FGD Residual Risk Register Non Klinis",children:e(ye,{model:g,ShouldMap:u,isOpenEditDialog:j,setIsOpenEditDialog:R})}),e(f,{isOpenEditDialog:z,setIsOpenEditDialog:_,size:"max-w-6xl",title:"Edit FGD Treated Risk Register Non Klinis",children:e(we,{model:g,ShouldMap:u,isOpenEditDialog:z,setIsOpenEditDialog:_})}),e(pe,{isOpenDestroyDialog:le,setIsOpenDestroyDialog:E,size:"max-w-2xl",title:"Delete Risk Register Klinis",warning:"Yakin hapus data ini ?",children:e(de,{className:"ml-2",onClick:J,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:s("div",{className:"mx-auto sm:px-6 lg:px-8",children:[s("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:["RISK REGISTER NON KLINIS (",L,")"]}),s("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-3/4",children:s("div",{className:"flex items-center justify-start mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-1",children:[s(m,{color:"sky",type:"button",onClick:Y,children:["Tambah Risiko",s("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-square-rounded-plus",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M9 12h6"}),e("path",{d:"M12 9v6"}),e("path",{d:"M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"})]})]}),s(m,{color:a===null?"gray":"blue",type:"button",className:`${a===null?"cursor-not-allowed":""}`,onClick:()=>{if(a!==null){const t=p[a];Z(t)}},disabled:a===null,children:["Edit",s("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-edit",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"}),e("path",{d:"M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"}),e("path",{d:"M16 5l3 3"})]})]}),s(m,{color:a===null?"gray":"red",type:"button",className:`${a===null?"cursor-not-allowed":""}`,onClick:()=>{if(a!==null){const t=p[a];X(t)}},disabled:a===null,children:["Delete",s("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-trash",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M4 7l16 0"}),e("path",{d:"M10 11l0 6"}),e("path",{d:"M14 11l0 6"}),e("path",{d:"M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"}),e("path",{d:"M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"})]})]}),e(m,{color:a===null?"gray":"teal",type:"button",className:`${a===null?"cursor-not-allowed":""}`,onClick:()=>{if(a!==null){const t=p[a];te(t)}},disabled:a===null,children:"FGD Inherent"}),e(m,{color:a===null?"gray":"cyan",type:"button",className:`${a===null?"cursor-not-allowed":""}`,onClick:()=>{if(a!==null){const t=p[a];ae(t)}},disabled:a===null,children:"FGD Residual"}),s(m,{color:a===null?"gray":"red",type:"button",className:`${a===null?"cursor-not-allowed":""}`,onClick:()=>{if(a!==null){const t=p[a];ee(t)}},disabled:a===null,children:["OSD Residual (",B,")"]}),e(m,{color:a===null?"gray":"sky",type:"button",className:`${a===null?"cursor-not-allowed":""}`,onClick:()=>{if(a!==null){const t=p[a];se(t)}},disabled:a===null,children:"FGD Treated"}),e(m,{color:a===null?"gray":"yellow",type:"button",className:`${a===null?"cursor-not-allowed":""}`,onClick:()=>{if(a!==null){const t=p[a];ie(t)}},disabled:a===null,children:"Formulir RCA"})]})}),e("div",{className:"w-1/4",children:s("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:O,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:V.map((t,c)=>e("option",{children:t},c))}),s("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:O,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 overflow-x-auto rounded sm:-mx-6 lg:-mx-8",children:s("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:s("table",{className:"min-w-full divide-y divide-gray-200 table-auto",children:[e("thead",{className:"bg-gray-50",children:s("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("created_at"),children:["#",i.field=="created_at"&&i.direction=="asc"&&e(o,{}),i.field=="created_at"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("tgl_register"),children:["Tanggal Register",i.field=="tgl_register"&&i.direction=="asc"&&e(o,{}),i.field=="tgl_register"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("pernyataan_risiko"),children:["Pernyataan Risiko",i.field=="pernyataan_risiko"&&i.direction=="asc"&&e(o,{}),i.field=="pernyataan_risiko"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase w-96",children:s("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(o,{}),i.field=="sebab"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("risk_type_id"),children:["Jenis",i.field=="risk_type_id"&&i.direction=="asc"&&e(o,{}),i.field=="risk_type_id"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("risk_variety_id"),children:["Tipe",i.field=="risk_variety_id"&&i.direction=="asc"&&e(o,{}),i.field=="risk_variety_id"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("dampak"),children:["Efek",i.field=="dampak"&&i.direction=="asc"&&e(o,{}),i.field=="dampak"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_dampak"),children:["OSD1 Dampak",i.field=="osd1_dampak"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_dampak"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_probabilitas"),children:["OSD1 Probabilitas",i.field=="osd1_probabilitas"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_probabilitas"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_controllability"),children:["OSD1 Controllability",i.field=="osd1_controllability"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_controllability"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_inherent"),children:["OSD1 Inherent",i.field=="osd1_inherent"&&i.direction=="asc"&&e(o,{}),i.field=="osd1_inherent"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_dampak"),children:["OSD2 Dampak",i.field=="osd2_dampak"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_dampak"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_probabilitas"),children:["OSD2 Probabilitas",i.field=="osd2_probabilitas"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_probabilitas"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_controllability"),children:["OSD2 Controllability",i.field=="osd2_controllability"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_controllability"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_inherent"),children:["OSD2 Residu",i.field=="osd2_inherent"&&i.direction=="asc"&&e(o,{}),i.field=="osd2_inherent"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("pengendalian_risiko"),children:["Pengendalian Risiko",i.field=="pengendalian_risiko"&&i.direction=="asc"&&e(o,{}),i.field=="pengendalian_risiko"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:s("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(o,{}),i.field=="user_id"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:p.map((t,c)=>s("tr",{className:a===c?"bg-sky-100  cursor-pointer":"cursor-pointer",children:[e("td",{className:"px-6 py-4 whitespace-nowrap",onClick:()=>Q(c),children:C.from+c}),e("td",{className:"p-2 whitespace-nowrap",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.tgl_register})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.pernyataan_risiko})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.sebab})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.risk_variety.name})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.risk_type.name})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.dampak})}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_probabilitas}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_controllability}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_inherent}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_probabilitas}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_controllability}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_inherent}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.pengendalian_risiko})}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.user.name})]},c))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:C.links.map((t,c)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>w({...i,page:new URL(t.url).searchParams.get("page")}),children:t.label},c))})]})})})]})})]})}be.layout=l=>e(me,{children:l});export{be as default};
