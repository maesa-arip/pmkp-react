import{_ as F,r as d,l as C,g as R,j as a,F as Y,a as e,n as q}from"./app-65f42ba1.js";import{D as G}from"./DangerButton-9e74087c.js";import{D as g,A as U}from"./App-bb874e79.js";import{A as H,D as J}from"./DestroyModal-2077e7de.js";import{E as W}from"./EditModal-df1abf67.js";import $ from"./Create-100679df.js";import Q from"./Edit-7bca3099.js";import{T as p}from"./ThirdButtonLink-5a50fa48.js";import"./ApplicationLogo-4fa21a4a.js";import"./transition-1cbcc039.js";import"./dialog-fb597ffd.js";import"./keyboard-4cd5d298.js";import"./description-c3af844a.js";import"./LarsDHP-49ab36f6.js";import"./InputLabel-6eb49de3.js";import"./PrimaryButton-2ce27186.js";import"./SecondaryButton-e51d8dcd.js";import"./TextInput-fb94a6d3.js";import"./index-569f9a33.js";import"./BPKPKlinis-73217dfa.js";import"./BPKPNonKlinis-a61a7679.js";import"./use-resolve-button-type-cf725b17.js";import"./Form-a8e14171.js";import"./RadioCard-7343c5df.js";import"./use-tracked-pointer-edd0f6a7.js";import"./InputError-b9a30257.js";import"./TextAreaInput-fbaf029e.js";import"./TextInputWithError-ad64e724.js";/* empty css                         */const n=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),c=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function X(s){const{data:S,meta:h,filtered:D,attributes:o}=s.riskRegisterKlinis,{auth:P}=F().props,O=s.riskRegisterCount,I=s.riskRegisterPengendalianCount,f=s.OpsiPengendalianCount,E=s.riskRegisterOsd2Count;let y={riskCategories:s.riskCategories,identificationSources:s.identificationSources,locations:s.locations,riskVarieties:s.riskVarieties,riskTypes:s.riskTypes,opsiPengendalian:s.opsiPengendalian,pembiayaanRisiko:s.pembiayaanRisiko,efektif:s.efektif,jenisPengendalian:s.jenisPengendalian,waktuPengendalian:s.waktuPengendalian,waktuImplementasi:s.waktuImplementasi,pics:s.pics,impactValues:s.impactValues,probabilityValues:s.probabilityValues,controlValues:s.controlValues,indikatorFitur4s:s.indikatorFitur4s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}],perluPenanganan:[{id:1,name:"Ya"},{id:2,name:"Tidak"}],realisasi:[{id:1,name:"Sudah Tercapai"},{id:2,name:"Belum Tercapai"}]};const[T,K]=d.useState([]),[i,m]=d.useState(D),[j,M]=d.useState(!0),z=d.useCallback(C.debounce(t=>{R.get(route(route().current()),{...C.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);d.useEffect(()=>{j?M(!1):z(i)},[i]),d.useEffect(()=>{let t=[];for(let l=o.per_page;l<o.total/o.per_page;l=l+o.per_page)t.push(l);K(t)},[]);const w=t=>{const l={...i,[t.target.name]:t.target.value,page:1};m(l)},r=t=>{m({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},A=t=>{v(t),x(!0)},B=t=>{v(t),u(!0)},L=()=>{R.delete(route("riskRegisterKlinis.destroy",_.id),{onSuccess:()=>u(!1)})},[N,k]=d.useState(!1),[b,x]=d.useState(!1),[V,u]=d.useState(!1),[_,v]=d.useState([]);return a(Y,{children:[e(q,{title:"Risk Register Klinis"}),e(H,{isOpenAddDialog:N,setIsOpenAddDialog:k,size:"max-w-6xl",title:"Tambah Risk Register Klinis "+P.user.name,children:e($,{ShouldMap:y,isOpenAddDialog:N,setIsOpenAddDialog:k})}),e(W,{isOpenEditDialog:b,setIsOpenEditDialog:x,size:"max-w-6xl",title:"Edit Risk Register Klinis",children:e(Q,{model:_,ShouldMap:y,isOpenEditDialog:b,setIsOpenEditDialog:x})}),e(J,{isOpenDestroyDialog:V,setIsOpenDestroyDialog:u,size:"max-w-2xl",title:"Delete Risk Register Klinis",warning:"Yakin hapus data ini ?",children:e(G,{className:"ml-2",onClick:L,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:["RISK REGISTER KLINIS OPSI PENGENDALIAN (",f,")"]}),a("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-2/3",children:a("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:[a(p,{href:route("riskRegisterKlinis.index"),children:["Risk Register (",O,")"]}),a(p,{color:"teal",href:route("riskRegisterKlinisPengendalian.index"),children:["Pengendalian Yang Sudah Ada (",I,")"]}),a(p,{color:"cyan",href:route("klinisOpsiPengendalian.index"),children:["Opsi Pengendalian (",f,")"]}),a(p,{color:"red",href:route("riskRegisterKlinisOsd2.index"),children:["OSD Residual (",E,")"]})]})}),e("div",{className:"w-1/3",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:w,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:T.map((t,l)=>e("option",{children:t},l))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:w,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 overflow-x-auto rounded sm:-mx-6 lg:-mx-8",children:a("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:a("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:a("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("created_at"),children:["Opsi",i.field=="created_at"&&i.direction=="asc"&&e(n,{}),i.field=="created_at"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("tgl_register"),children:["Tanggal Register",i.field=="tgl_register"&&i.direction=="asc"&&e(n,{}),i.field=="tgl_register"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("tgl_selesai"),children:["Tanggal Selesai",i.field=="tgl_selesai"&&i.direction=="asc"&&e(n,{}),i.field=="tgl_selesai"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("risk_category_id"),children:["Kategori",i.field=="risk_category_id"&&i.direction=="asc"&&e(n,{}),i.field=="risk_category_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("identification_source_id"),children:["Sumber",i.field=="identification_source_id"&&i.direction=="asc"&&e(n,{}),i.field=="identification_source_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("pernyataan_risiko"),children:["Pernyataan Risiko",i.field=="pernyataan_risiko"&&i.direction=="asc"&&e(n,{}),i.field=="pernyataan_risiko"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(n,{}),i.field=="sebab"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("risk_type_id"),children:["Jenis",i.field=="risk_type_id"&&i.direction=="asc"&&e(n,{}),i.field=="risk_type_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("risk_variety_id"),children:["Tipe",i.field=="risk_variety_id"&&i.direction=="asc"&&e(n,{}),i.field=="risk_variety_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("dampak"),children:["Efek",i.field=="dampak"&&i.direction=="asc"&&e(n,{}),i.field=="dampak"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_dampak"),children:["OSD1 Dampak",i.field=="osd1_dampak"&&i.direction=="asc"&&e(n,{}),i.field=="osd1_dampak"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_probabilitas"),children:["OSD1 Probabilitas",i.field=="osd1_probabilitas"&&i.direction=="asc"&&e(n,{}),i.field=="osd1_probabilitas"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_controllability"),children:["OSD1 Controllability",i.field=="osd1_controllability"&&i.direction=="asc"&&e(n,{}),i.field=="osd1_controllability"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd1_inherent"),children:["OSD1 Inherent",i.field=="osd1_inherent"&&i.direction=="asc"&&e(n,{}),i.field=="osd1_inherent"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_dampak"),children:["OSD2 Dampak",i.field=="osd2_dampak"&&i.direction=="asc"&&e(n,{}),i.field=="osd2_dampak"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_probabilitas"),children:["OSD2 Probabilitas",i.field=="osd2_probabilitas"&&i.direction=="asc"&&e(n,{}),i.field=="osd2_probabilitas"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_controllability"),children:["OSD2 Controllability",i.field=="osd2_controllability"&&i.direction=="asc"&&e(n,{}),i.field=="osd2_controllability"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("osd2_inherent"),children:["OSD2 Residu",i.field=="osd2_inherent"&&i.direction=="asc"&&e(n,{}),i.field=="osd2_inherent"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("pengendalian_risiko"),children:["Pengendalian Risiko",i.field=="pengendalian_risiko"&&i.direction=="asc"&&e(n,{}),i.field=="pengendalian_risiko"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("pic_id"),children:["PIC",i.field=="pic_id"&&i.direction=="asc"&&e(n,{}),i.field=="pic_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>r("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(n,{}),i.field=="user_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:S.map((t,l)=>a("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:h.from+l}),e("td",{className:"text-center",children:a(g,{children:[e(g.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),a(g.Content,{align:"right",width:"24",children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>A(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>B(t),children:"Hapus"})]})]})}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.tgl_register}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.tgl_selesai}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.risk_category.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.identification_source.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.pernyataan_risiko}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.sebab}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.risk_variety.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.risk_type.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_probabilitas}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_controllability}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_inherent}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_probabilitas}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_controllability}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_inherent}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.pengendalian_risiko}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.pic.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.user.name})]},l))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:h.links.map((t,l)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>m({...i,page:new URL(t.url).searchParams.get("page")}),children:t.label},l))})]})})})]})})]})}X.layout=s=>e(U,{children:s});export{X as default};
