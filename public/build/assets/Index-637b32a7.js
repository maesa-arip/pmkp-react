import{_ as z,r as c,l as _,g as C,j as a,F as A,a as e,n as F}from"./app-39b28b75.js";import{D as U}from"./DangerButton-bbe49589.js";import{D as x,A as q}from"./App-4e87e92e.js";import{A as Y}from"./AddModal-050b37f5.js";import{D as G}from"./DestroyModal-b1f00251.js";import{E as H}from"./EditModal-34198886.js";import J from"./Create-bac9991d.js";import W from"./Edit-b9ea1c2b.js";import{T as R}from"./ThirdButtonLink-ba18edc6.js";import"./ApplicationLogo-80ad1ec3.js";import"./transition-f985c522.js";import"./render-c0db6c63.js";import"./dialog-67d91a12.js";import"./keyboard-2676573b.js";import"./use-watch-36608396.js";import"./description-cbdcb2f3.js";import"./use-outside-click-973caf8c.js";import"./TextInput-0232117d.js";import"./ComboboxMultiple-7aee12c8.js";import"./clsx-78a9da9d.js";import"./ComboboxMultipleWithOutSemuaUnit-2a6efb5d.js";import"./BPKP-f031b930.js";import"./InputLabel-3431cd86.js";import"./PrimaryButton-14bd2f2a.js";import"./SecondaryButton-0234b844.js";import"./index-b189e8eb.js";import"./LarsDHPKlinis-86fed8ec.js";import"./LarsDHPNonKlinis-aab28c4b.js";import"./use-resolve-button-type-6de0b13d.js";import"./Form-b18663fb.js";import"./ComboboxPage-40800f25.js";import"./use-tracked-pointer-be5d0ab3.js";import"./use-tree-walker-f0531641.js";import"./use-controllable-90b8c745.js";import"./ComboboxPageReadonly-c8037ad4.js";import"./InputError-1bf95e0a.js";import"./TextAreaInput-5d37962a.js";import"./TextInputWithError-4b49646c.js";/* empty css                         */const d=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),l=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function $(r){const{data:D,meta:h,filtered:S,attributes:o}=r.riskRegisterKlinis,{auth:O}=z().props,P=r.riskRegisterCount;r.riskRegisterPengendalianCount,r.OpsiPengendalianCount;const g=r.riskRegisterOsd2Count;let f={riskCategories:r.riskCategories,identificationSources:r.identificationSources,locations:r.locations,riskVarieties:r.riskVarieties,riskTypes:r.riskTypes,opsiPengendalian:r.opsiPengendalian,pembiayaanRisiko:r.pembiayaanRisiko,efektif:r.efektif,jenisPengendalian:r.jenisPengendalian,waktuPengendalian:r.waktuPengendalian,waktuImplementasi:r.waktuImplementasi,pics:r.pics,impactValues:r.impactValues,probabilityValues:r.probabilityValues,controlValues:r.controlValues,indikatorFitur4s:r.indikatorFitur4s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}],perluPenanganan:[{id:1,name:"Ya"},{id:2,name:"Tidak"}],realisasi:[{id:1,name:"Sudah Tercapai"},{id:2,name:"Belum Tercapai"}]};const[I,E]=c.useState([]),[i,p]=c.useState(S),[T,j]=c.useState(!0),K=c.useCallback(_.debounce(t=>{C.get(route(route().current()),{..._.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);c.useEffect(()=>{T?j(!1):K(i)},[i]),c.useEffect(()=>{let t=[];for(let n=o.per_page;n<o.total/o.per_page;n=n+o.per_page)t.push(n);E(t)},[]);const y=t=>{const n={...i,[t.target.name]:t.target.value,page:1};p(n)},s=t=>{p({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},B=t=>{v(t),m(!0)},L=t=>{v(t),u(!0)},M=()=>{C.delete(route("riskRegisterKlinis.destroy",k.id),{onSuccess:()=>u(!1)})},[b,w]=c.useState(!1),[N,m]=c.useState(!1),[V,u]=c.useState(!1),[k,v]=c.useState([]);return a(A,{children:[e(F,{title:"Risk Register Klinis"}),e(Y,{isOpenAddDialog:b,setIsOpenAddDialog:w,size:"max-w-6xl",title:"Tambah Risk Register Klinis "+O.user.name,children:e(J,{ShouldMap:f,isOpenAddDialog:b,setIsOpenAddDialog:w})}),e(H,{isOpenEditDialog:N,setIsOpenEditDialog:m,size:"max-w-6xl",title:"Edit OSD Residual Risk Register Klinis",children:e(W,{model:k,ShouldMap:f,isOpenEditDialog:N,setIsOpenEditDialog:m})}),e(G,{isOpenDestroyDialog:V,setIsOpenDestroyDialog:u,size:"max-w-2xl",title:"Delete Risk Register Klinis",warning:"Yakin hapus data ini ?",children:e(U,{className:"ml-2",onClick:M,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:["RISK REGISTER KLINIS OSD RESIDUAL (",g,")"]}),a("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-2/3",children:a("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:[a(R,{href:route("riskRegisterKlinis.index"),children:["Risk Register (",P,")"]}),a(R,{color:"red",href:route("riskRegisterKlinisOsd2.index"),children:["OSD Residual (",g,")"]})]})}),e("div",{className:"w-1/3",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:y,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:I.map((t,n)=>e("option",{children:t},n))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:y,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 overflow-x-auto rounded sm:-mx-6 lg:-mx-8",children:a("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:a("table",{className:"min-w-full divide-y divide-gray-200 table-auto",children:[e("thead",{className:"bg-gray-50",children:a("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("created_at"),children:["Opsi",i.field=="created_at"&&i.direction=="asc"&&e(d,{}),i.field=="created_at"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("tgl_register"),children:["Tanggal Register",i.field=="tgl_register"&&i.direction=="asc"&&e(d,{}),i.field=="tgl_register"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>s("pernyataan_risiko"),children:["Pernyataan Risiko",i.field=="pernyataan_risiko"&&i.direction=="asc"&&e(d,{}),i.field=="pernyataan_risiko"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase w-96",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>s("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(d,{}),i.field=="sebab"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>s("risk_type_id"),children:["Jenis",i.field=="risk_type_id"&&i.direction=="asc"&&e(d,{}),i.field=="risk_type_id"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>s("risk_variety_id"),children:["Tipe",i.field=="risk_variety_id"&&i.direction=="asc"&&e(d,{}),i.field=="risk_variety_id"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>s("dampak"),children:["Efek",i.field=="dampak"&&i.direction=="asc"&&e(d,{}),i.field=="dampak"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd1_dampak"),children:["OSD1 Dampak",i.field=="osd1_dampak"&&i.direction=="asc"&&e(d,{}),i.field=="osd1_dampak"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd1_probabilitas"),children:["OSD1 Probabilitas",i.field=="osd1_probabilitas"&&i.direction=="asc"&&e(d,{}),i.field=="osd1_probabilitas"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd1_controllability"),children:["OSD1 Controllability",i.field=="osd1_controllability"&&i.direction=="asc"&&e(d,{}),i.field=="osd1_controllability"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd1_inherent"),children:["OSD1 Inherent",i.field=="osd1_inherent"&&i.direction=="asc"&&e(d,{}),i.field=="osd1_inherent"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd2_dampak"),children:["OSD2 Dampak",i.field=="osd2_dampak"&&i.direction=="asc"&&e(d,{}),i.field=="osd2_dampak"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd2_probabilitas"),children:["OSD2 Probabilitas",i.field=="osd2_probabilitas"&&i.direction=="asc"&&e(d,{}),i.field=="osd2_probabilitas"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd2_controllability"),children:["OSD2 Controllability",i.field=="osd2_controllability"&&i.direction=="asc"&&e(d,{}),i.field=="osd2_controllability"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd2_inherent"),children:["OSD2 Residu",i.field=="osd2_inherent"&&i.direction=="asc"&&e(d,{}),i.field=="osd2_inherent"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer w-96 gap-x-2",onClick:()=>s("pengendalian_risiko"),children:["Pengendalian Risiko",i.field=="pengendalian_risiko"&&i.direction=="asc"&&e(d,{}),i.field=="pengendalian_risiko"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("pic_id"),children:["PIC",i.field=="pic_id"&&i.direction=="asc"&&e(d,{}),i.field=="pic_id"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(d,{}),i.field=="user_id"&&i.direction=="desc"&&e(l,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:D.map((t,n)=>a("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:h.from+n}),e("td",{className:"text-center",children:a(x,{children:[e(x.Trigger,{children:a("button",{type:"button",className:"inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",id:"menu-button","aria-expanded":"true","aria-haspopup":"true",children:["Options",e("svg",{className:"w-5 h-5 -mr-1 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",children:e("path",{"fill-rule":"evenodd",d:"M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z","clip-rule":"evenodd"})})]})}),a(x.Content,{align:"left",width:"24",children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>B(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>L(t),children:"Hapus"})]})]})}),e("td",{className:"p-2 whitespace-nowrap",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.tgl_register})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.pernyataan_risiko})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-red-300 rounded-md shadow-sm",children:t.sebab})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.risk_variety.name})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.risk_type.name})}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.dampak})}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_probabilitas}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_controllability}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_inherent}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_probabilitas}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_controllability}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_inherent}),e("td",{className:"p-2",children:e("div",{className:"p-4 border border-gray-300 rounded-md shadow-sm",children:t.pengendalian_risiko})}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.pic.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.user.name})]},n))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:h.links.map((t,n)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>p({...i,page:new URL(t.url).searchParams.get("page")}),children:t.label},n))})]})})})]})})]})}$.layout=r=>e(q,{children:r});export{$ as default};
