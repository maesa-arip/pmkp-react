import{_ as le,r as o,l as z,g as G,j as a,F as re,a as e,n as ne}from"./app-658f0582.js";import{D as de}from"./DangerButton-e838fd74.js";import{A as oe,D as ce}from"./DestroyModal-3f300ed4.js";import{E as f}from"./EditModal-53dffc30.js";import{T as g}from"./ThirdButton-f4894ae0.js";import{A as pe}from"./App-f4be24f7.js";import me from"./Create-ca6e4d56.js";import ue from"./Edit-7c7deaaf.js";import ge from"./Edit-a4f84f4d.js";import he from"./Edit-0769364a.js";import xe from"./Edit-2c912481.js";import fe from"./Edit-54696260.js";import ye from"./Edit-c5e8021d.js";import"./dialog-02b576b5.js";import"./transition-8639a235.js";import"./keyboard-b6c000d0.js";import"./use-watch-c5f38d18.js";import"./description-88d1199a.js";import"./ApplicationLogo-e685a6c1.js";import"./LarsDHP-abbf6572.js";import"./InputLabel-2738d99f.js";import"./PrimaryButton-6d60de3c.js";import"./SecondaryButton-c232cfab.js";import"./TextInput-9d5c4fba.js";import"./index-f18c067e.js";import"./BPKPKlinis-80a30e08.js";import"./BPKPNonKlinis-32b749ef.js";import"./use-resolve-button-type-129f3827.js";import"./Form-a0b13f57.js";import"./ComboboxPage-30685019.js";import"./use-tracked-pointer-2c020aab.js";import"./InputError-7dd39659.js";import"./RadioCard-3e682cf7.js";import"./TextAreaInput-06563d42.js";import"./TextInputWithError-7c846df0.js";/* empty css                         */import"./Form-0b781a22.js";import"./Form-ad92b8b8.js";import"./Form-d70dd81d.js";import"./Form-213dd93e.js";import"./Form-62ee78ae.js";const n=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),d=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function we(l){const{data:p,meta:E,filtered:A,attributes:y}=l.riskRegisterKlinis,{auth:$}=le().props,B=l.riskRegisterCount;l.riskRegisterPengendalianCount,l.OpsiPengendalianCount;const L=l.riskRegisterOsd2Count;let m={riskCategories:l.riskCategories,identificationSources:l.identificationSources,locations:l.locations,riskVarieties:l.riskVarieties,riskTypes:l.riskTypes,jenisSebabs:l.jenisSebabs,opsiPengendalian:l.opsiPengendalian,pembiayaanRisiko:l.pembiayaanRisiko,efektif:l.efektif,jenisPengendalian:l.jenisPengendalian,waktuPengendalian:l.waktuPengendalian,waktuImplementasi:l.waktuImplementasi,pics:l.pics,impactValues:l.impactValues,probabilityValues:l.probabilityValues,controlValues:l.controlValues,indikatorFitur4s:l.indikatorFitur4s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}],perluPenanganan:[{id:1,name:"Ya"},{id:2,name:"Tidak"}],realisasi:[{id:1,name:"Sudah Tercapai"},{id:2,name:"Belum Tercapai"}]};const[V,q]=o.useState([]),[i,w]=o.useState(A),[W,H]=o.useState(!0),U=o.useCallback(z.debounce(t=>{G.get(route(route().current()),{...z.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);o.useEffect(()=>{W?H(!1):U(i)},[i]),o.useEffect(()=>{let t=[];for(let c=y.per_page;c<y.total/y.per_page;c=c+y.per_page)t.push(c);q(t)},[]);const C=t=>{const c={...i,[t.target.name]:t.target.value,page:1};w(c)},r=t=>{w({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},Y=()=>{b(!0)},J=()=>{G.delete(route("riskRegisterKlinis.destroy",u.id),{onSuccess:()=>M(!1)})},[s,O]=o.useState(null),[be,h]=o.useState(null),Q=t=>{O(s===t?null:t)},X=t=>{x(t),h(t),k(!0)},Z=t=>{x(t),h(t),N(!0)},ee=t=>{x(t),h(t),D(!0)},ie=t=>{x(t),h(t),v(!0)},te=t=>{x(t),h(t),_(!0)},ae=t=>{x(t),h(t),R(!0)},[S,b]=o.useState(!1),[I,k]=o.useState(!1),[F,N]=o.useState(!1),[P,D]=o.useState(!1),[T,v]=o.useState(!1),[j,_]=o.useState(!1),[K,R]=o.useState(!1),[se,M]=o.useState(!1),[u,x]=o.useState([]);return a(re,{children:[e(ne,{title:"Risk Register Non Klinis"}),e(oe,{isOpenAddDialog:S,setIsOpenAddDialog:b,size:"max-w-6xl",title:"Tambah Risk Register Non Klinis "+$.user.name,children:e(me,{ShouldMap:m,isOpenAddDialog:S,setIsOpenAddDialog:b})}),e(f,{isOpenEditDialog:I,setIsOpenEditDialog:k,size:"max-w-6xl",title:"Edit Risk Register Non Klinis",children:e(ue,{model:u,ShouldMap:m,isOpenEditDialog:I,setIsOpenEditDialog:k})}),e(f,{isOpenEditDialog:F,setIsOpenEditDialog:N,size:"max-w-6xl",title:"Edit OSD Residual Risk Register Non Klinis",children:e(ge,{model:u,ShouldMap:m,isOpenEditDialog:F,setIsOpenEditDialog:N})}),e(f,{isOpenEditDialog:P,setIsOpenEditDialog:D,size:"max-w-6xl",title:"Edit Formulir RCA Risk Register Non Klinis",children:e(he,{model:u,ShouldMap:m,isOpenEditDialog:P,setIsOpenEditDialog:D})}),e(f,{isOpenEditDialog:T,setIsOpenEditDialog:v,size:"max-w-6xl",title:"Edit FGD Inherent Risk Register Non Klinis",children:e(xe,{model:u,ShouldMap:m,isOpenEditDialog:T,setIsOpenEditDialog:v})}),e(f,{isOpenEditDialog:j,setIsOpenEditDialog:_,size:"max-w-6xl",title:"Edit FGD Residual Risk Register Non Klinis",children:e(fe,{model:u,ShouldMap:m,isOpenEditDialog:j,setIsOpenEditDialog:_})}),e(f,{isOpenEditDialog:K,setIsOpenEditDialog:R,size:"max-w-6xl",title:"Edit FGD Treated Risk Register Non Klinis",children:e(ye,{model:u,ShouldMap:m,isOpenEditDialog:K,setIsOpenEditDialog:R})}),e(ce,{isOpenDestroyDialog:se,setIsOpenDestroyDialog:M,size:"max-w-2xl",title:"Delete Risk Register Klinis",warning:"Yakin hapus data ini ?",children:e(de,{className:"ml-2",onClick:J,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:["RISK REGISTER NON KLINIS (",B,")"]}),a("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-3/4",children:a("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:[a(g,{color:"sky",type:"button",onClick:Y,children:["Tambah Risiko",a("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-square-rounded-plus",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M9 12h6"}),e("path",{d:"M12 9v6"}),e("path",{d:"M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"})]})]}),a(g,{color:s===null?"gray":"blue",type:"button",className:`${s===null?"cursor-not-allowed":""}`,onClick:()=>{if(s!==null){const t=p[s];X(t)}},disabled:s===null,children:["Edit",a("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 ml-2 icon icon-tabler icon-tabler-edit",viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("path",{d:"M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"}),e("path",{d:"M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"}),e("path",{d:"M16 5l3 3"})]})]}),a(g,{color:s===null?"gray":"red",type:"button",className:`${s===null?"cursor-not-allowed":""}`,onClick:()=>{if(s!==null){const t=p[s];Z(t)}},disabled:s===null,children:["OSD Residual (",L,")"]}),e(g,{color:s===null?"gray":"yellow",type:"button",className:`${s===null?"cursor-not-allowed":""}`,onClick:()=>{if(s!==null){const t=p[s];ee(t)}},disabled:s===null,children:"Formulir RCA"}),e(g,{color:s===null?"gray":"teal",type:"button",className:`${s===null?"cursor-not-allowed":""}`,onClick:()=>{if(s!==null){const t=p[s];ie(t)}},disabled:s===null,children:"Formulir Inherent"}),e(g,{color:s===null?"gray":"cyan",type:"button",className:`${s===null?"cursor-not-allowed":""}`,onClick:()=>{if(s!==null){const t=p[s];te(t)}},disabled:s===null,children:"FGD Residual"}),e(g,{color:s===null?"gray":"sky",type:"button",className:`${s===null?"cursor-not-allowed":""}`,onClick:()=>{if(s!==null){const t=p[s];ae(t)}},disabled:s===null,children:"FGD Treated"})]})}),e("div",{className:"w-1/4",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:C,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:V.map((t,c)=>e("option",{children:t},c))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:C,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 overflow-x-auto rounded sm:-mx-6 lg:-mx-8",children:a("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:a("table",{className:"min-w-full divide-y divide-gray-200 table-auto",children:[e("thead",{className:"bg-gray-50",children:a("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("created_at"),children:["#",i.field=="created_at"&&i.direction=="asc"&&e(n,{}),i.field=="created_at"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("tgl_register"),children:["Tanggal Register",i.field=="tgl_register"&&i.direction=="asc"&&e(n,{}),i.field=="tgl_register"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("pernyataan_risiko"),children:["Pernyataan Risiko",i.field=="pernyataan_risiko"&&i.direction=="asc"&&e(n,{}),i.field=="pernyataan_risiko"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase w-96",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(n,{}),i.field=="sebab"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("risk_type_id"),children:["Jenis",i.field=="risk_type_id"&&i.direction=="asc"&&e(n,{}),i.field=="risk_type_id"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("risk_variety_id"),children:["Tipe",i.field=="risk_variety_id"&&i.direction=="asc"&&e(n,{}),i.field=="risk_variety_id"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("dampak"),children:["Efek",i.field=="dampak"&&i.direction=="asc"&&e(n,{}),i.field=="dampak"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_dampak"),children:["OSD1 Dampak",i.field=="osd1_dampak"&&i.direction=="asc"&&e(n,{}),i.field=="osd1_dampak"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_probabilitas"),children:["OSD1 Probabilitas",i.field=="osd1_probabilitas"&&i.direction=="asc"&&e(n,{}),i.field=="osd1_probabilitas"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_controllability"),children:["OSD1 Controllability",i.field=="osd1_controllability"&&i.direction=="asc"&&e(n,{}),i.field=="osd1_controllability"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_inherent"),children:["OSD1 Inherent",i.field=="osd1_inherent"&&i.direction=="asc"&&e(n,{}),i.field=="osd1_inherent"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_dampak"),children:["OSD2 Dampak",i.field=="osd2_dampak"&&i.direction=="asc"&&e(n,{}),i.field=="osd2_dampak"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_probabilitas"),children:["OSD2 Probabilitas",i.field=="osd2_probabilitas"&&i.direction=="asc"&&e(n,{}),i.field=="osd2_probabilitas"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_controllability"),children:["OSD2 Controllability",i.field=="osd2_controllability"&&i.direction=="asc"&&e(n,{}),i.field=="osd2_controllability"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_inherent"),children:["OSD2 Residu",i.field=="osd2_inherent"&&i.direction=="asc"&&e(n,{}),i.field=="osd2_inherent"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>r("pengendalian_risiko"),children:["Pengendalian Risiko",i.field=="pengendalian_risiko"&&i.direction=="asc"&&e(n,{}),i.field=="pengendalian_risiko"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("pic_id"),children:["PIC",i.field=="pic_id"&&i.direction=="asc"&&e(n,{}),i.field=="pic_id"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(n,{}),i.field=="user_id"&&i.direction=="desc"&&e(d,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:p.map((t,c)=>a("tr",{className:s===c?"bg-sky-100  cursor-pointer":"cursor-pointer",children:[e("td",{className:"px-6 py-4 whitespace-nowrap",onClick:()=>Q(c),children:E.from+c}),e("td",{className:"p-2 whitespace-nowrap",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.tgl_register})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.pernyataan_risiko})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.sebab})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.risk_variety.name})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.risk_type.name})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.dampak})}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_probabilitas}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_controllability}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_inherent}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_probabilitas}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_controllability}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_inherent}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.pengendalian_risiko})}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.pic.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.user.name})]},c))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:E.links.map((t,c)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>w({...i,page:new URL(t.url).searchParams.get("page")}),children:t.label},c))})]})})})]})})]})}we.layout=l=>e(pe,{children:l});export{we as default};
