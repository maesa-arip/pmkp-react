import{_ as M,r as d,l as k,g as v,j as a,F as z,a as e,n as B}from"./app-79a2aeb1.js";import{D as V}from"./DangerButton-a2fab5b6.js";import{D as h,A}from"./App-66aa3e34.js";import{A as L,D as F,T as q}from"./ThirdButton-0aec832e.js";import{E as U}from"./EditModal-90d2924b.js";import Y from"./Create-b0c10d69.js";import G from"./Edit-60b2d7e4.js";import"./ApplicationLogo-15c7a745.js";import"./transition-9b0aa617.js";import"./dialog-d8fafaca.js";import"./keyboard-8e5d6cce.js";import"./description-64ef4ce4.js";import"./LarsDHP-421326c4.js";import"./InputLabel-36bde3cd.js";import"./PrimaryButton-0f0abcd4.js";import"./SecondaryButton-04f7f3c9.js";import"./TextInput-4ecdfa12.js";import"./index-7aa54555.js";import"./use-resolve-button-type-ef54f68e.js";import"./Form-507d8a80.js";import"./RadioCard-99b6ab94.js";import"./use-tracked-pointer-957f2733.js";import"./InputError-478072b5.js";import"./TextAreaInput-bf6794ab.js";/* empty css                         */const r=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),c=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function H(l){const{data:C,meta:g,filtered:D,attributes:o}=l.riskRegisterKlinis,{auth:S}=M().props;let f={riskCategories:l.riskCategories,identificationSources:l.identificationSources,locations:l.locations,riskVarieties:l.riskVarieties,riskTypes:l.riskTypes,opsiPengendalian:l.opsiPengendalian,pembiayaanRisiko:l.pembiayaanRisiko,efektif:l.efektif,jenisPengendalian:l.jenisPengendalian,waktuPengendalian:l.waktuPengendalian,waktuImplementasi:l.waktuImplementasi,pics:l.pics,impactValues:l.impactValues,probabilityValues:l.probabilityValues,controlValues:l.controlValues,indikatorFitur04s:l.indikatorFitur04s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}],perluPenanganan:[{id:1,name:"Ya"},{id:2,name:"Tidak"}],realisasi:[{id:1,name:"Sudah Tercapai"},{id:2,name:"Belum Tercapai"}]};const[R,P]=d.useState([]),[i,p]=d.useState(D),T=d.useCallback(k.debounce(t=>{v.get(route(route().current()),{...k.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);d.useEffect(()=>T(i),[i]),d.useEffect(()=>{let t=[];for(let n=o.per_page;n<o.total/o.per_page;n=n+o.per_page)t.push(n);P(t)},[]);const y=t=>p({...i,[t.target.name]:t.target.value}),s=t=>{p({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},E=()=>{m(!0)},O=t=>{_(t),x(!0)},I=t=>{_(t),u(!0)},j=()=>{v.delete(route("riskRegisterKlinis.destroy",b.id),{onSuccess:()=>u(!1)})},[w,m]=d.useState(!1),[N,x]=d.useState(!1),[K,u]=d.useState(!1),[b,_]=d.useState([]);return a(z,{children:[e(B,{title:"Risk Register Klinis"}),e(L,{isOpenAddDialog:w,setIsOpenAddDialog:m,size:"max-w-4xl",title:"Tambah Risk Register Klinis "+S.user.name,children:e(Y,{ShouldMap:f,isOpenAddDialog:w,setIsOpenAddDialog:m})}),e(U,{isOpenEditDialog:N,setIsOpenEditDialog:x,size:"max-w-4xl",title:"Edit Risk Register Klinis",children:e(G,{model:b,ShouldMap:f,isOpenEditDialog:N,setIsOpenEditDialog:x})}),e(F,{isOpenDestroyDialog:K,setIsOpenDestroyDialog:u,size:"max-w-2xl",title:"Delete Risk Register Klinis",warning:"Yakin hapus data ini ?",children:e(V,{className:"ml-2",onClick:j,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[e("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:"RISK REGISTER KLINIS"}),a("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(q,{type:"button",onClick:E,children:"Tambah"})})}),e("div",{className:"w-1/2",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:y,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:R.map((t,n)=>e("option",{children:t},n))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:y,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 overflow-x-auto rounded sm:-mx-6 lg:-mx-8",children:a("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:a("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:a("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("created_at"),children:["Opsi",i.field=="created_at"&&i.direction=="asc"&&e(r,{}),i.field=="created_at"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("tgl_register"),children:["Tanggal Register",i.field=="tgl_register"&&i.direction=="asc"&&e(r,{}),i.field=="tgl_register"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("tgl_selesai"),children:["Tanggal Selesai",i.field=="tgl_selesai"&&i.direction=="asc"&&e(r,{}),i.field=="tgl_selesai"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("risk_category_id"),children:["Kategori",i.field=="risk_category_id"&&i.direction=="asc"&&e(r,{}),i.field=="risk_category_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("identification_source_id"),children:["Sumber",i.field=="identification_source_id"&&i.direction=="asc"&&e(r,{}),i.field=="identification_source_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("pernyataan_risiko"),children:["Pernyataan Risiko",i.field=="pernyataan_risiko"&&i.direction=="asc"&&e(r,{}),i.field=="pernyataan_risiko"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(r,{}),i.field=="sebab"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("risk_type_id"),children:["Jenis",i.field=="risk_type_id"&&i.direction=="asc"&&e(r,{}),i.field=="risk_type_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("risk_variety_id"),children:["Tipe",i.field=="risk_variety_id"&&i.direction=="asc"&&e(r,{}),i.field=="risk_variety_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("dampak"),children:["Efek",i.field=="dampak"&&i.direction=="asc"&&e(r,{}),i.field=="dampak"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd1_dampak"),children:["OSD1 Dampak",i.field=="osd1_dampak"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_dampak"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd1_probabilitas"),children:["OSD1 Probabilitas",i.field=="osd1_probabilitas"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_probabilitas"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd1_controllability"),children:["OSD1 Controllability",i.field=="osd1_controllability"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_controllability"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd1_inherent"),children:["OSD1 Inherent",i.field=="osd1_inherent"&&i.direction=="asc"&&e(r,{}),i.field=="osd1_inherent"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd2_dampak"),children:["OSD2 Dampak",i.field=="osd2_dampak"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_dampak"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd2_probabilitas"),children:["OSD2 Probabilitas",i.field=="osd2_probabilitas"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_probabilitas"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd2_controllability"),children:["OSD2 Controllability",i.field=="osd2_controllability"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_controllability"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("osd2_inherent"),children:["OSD2 Residu",i.field=="osd2_inherent"&&i.direction=="asc"&&e(r,{}),i.field=="osd2_inherent"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("pengendalian_risiko"),children:["Pengendalian Risiko",i.field=="pengendalian_risiko"&&i.direction=="asc"&&e(r,{}),i.field=="pengendalian_risiko"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("pic_id"),children:["PIC",i.field=="pic_id"&&i.direction=="asc"&&e(r,{}),i.field=="pic_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>s("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(r,{}),i.field=="user_id"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:C.map((t,n)=>a("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:g.from+n}),e("td",{className:"text-center",children:a(h,{children:[e(h.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),a(h.Content,{align:"right",width:"24",children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>O(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>I(t),children:"Hapus"})]})]})}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.tgl_register}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.tgl_selesai}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.risk_category.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.identification_source.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.pernyataan_risiko}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.sebab}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.risk_variety.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.risk_type.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_probabilitas}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_controllability}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd1_inherent}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_dampak}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_probabilitas}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_controllability}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.osd2_inherent}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.pengendalian_risiko}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.pic.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.user.name})]},n))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:g.links.map((t,n)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>p({...i,page:new URL(t.url).searchParams.get("page")}),children:t.label},n))})]})})})]})})]})}H.layout=l=>e(A,{children:l});export{H as default};
