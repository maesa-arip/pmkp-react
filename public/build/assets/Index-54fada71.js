import{r as l,l as k,g as C,j as a,F as _,a as e,n as L}from"./app-40227382.js";import{D as K}from"./DangerButton-3e99067e.js";import{D as h,A as P}from"./App-682dd345.js";import{A as q}from"./AddModal-2132627a.js";import{D as F}from"./DestroyModal-3520a38a.js";import{E as U}from"./EditModal-5077c3c8.js";import{T as H}from"./ThirdButton-4abae519.js";import W from"./Create-81a99cea.js";import Y from"./Edit-f36c2822.js";import"./ApplicationLogo-1be1e8fe.js";import"./transition-28801c53.js";import"./render-66257b5b.js";import"./ComboboxPage-878696ae.js";import"./use-tracked-pointer-5a6dfe94.js";import"./keyboard-61a26669.js";import"./use-outside-click-09bb6113.js";import"./use-tree-walker-55160274.js";import"./use-controllable-2ece201f.js";import"./use-watch-f0387d0f.js";import"./dialog-35762c09.js";import"./description-bdba954c.js";import"./TextInput-70d63fd3.js";import"./ComboboxMultiple-7454ec32.js";import"./clsx-aaf5a234.js";import"./defineProperty-8250cd14.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-cfa411bf.js";import"./BPKP-0d5c6a87.js";import"./InputLabel-4fdd6287.js";import"./PrimaryButton-ce8a4982.js";import"./SecondaryButton-e376ea20.js";import"./index-c0c70693.js";import"./LarsDHPKlinis-0e5204a9.js";import"./LarsDHPNonKlinis-e1b41eed.js";import"./SedangTerjadi-42304446.js";import"./Form-cd74c10b.js";import"./InputError-0cf9554f.js";import"./ListBoxPage-23d30768.js";const n=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),c=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function $(d){const{data:D,meta:x,filtered:E,attributes:s}=d.controlValues,f=[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],[S,M]=l.useState([]),[i,p]=l.useState(E),[j,z]=l.useState(!0),I=l.useCallback(k.debounce(t=>{C.get(route(route().current()),{...k.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);l.useEffect(()=>{j?z(!1):I(i)},[i]),l.useEffect(()=>{let t=[];for(let r=s.per_page;r<s.total/s.per_page;r=r+s.per_page)t.push(r);M(t)},[]);const y=t=>{const r={...i,[t.target.name]:t.target.value,page:1};p(r)},o=t=>{p({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},A=()=>{m(!0)},B=t=>{v(t),u(!0)},R=t=>{v(t),g(!0)},O=()=>{C.delete(route("controlValues.destroy",b.id),{onSuccess:()=>g(!1)})},[w,m]=l.useState(!1),[N,u]=l.useState(!1),[T,g]=l.useState(!1),[b,v]=l.useState([]);return a(_,{children:[e(L,{title:"Nilai Controllability"}),e(q,{isOpenAddDialog:w,setIsOpenAddDialog:m,size:"max-w-4xl",title:"Tambah Nilai Controllability",children:e(W,{ShouldMap:f,isOpenAddDialog:w,setIsOpenAddDialog:m})}),e(U,{isOpenEditDialog:N,setIsOpenEditDialog:u,size:"max-w-4xl",title:"Edit Nilai Controllability",children:e(Y,{model:b,ShouldMap:f,isOpenEditDialog:N,setIsOpenEditDialog:u})}),e(F,{isOpenDestroyDialog:T,setIsOpenDestroyDialog:g,size:"max-w-4xl",title:"Delete Nilai Controllability",warning:"Yakin hapus data ini ?",children:e(K,{className:"ml-2",onClick:O,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(H,{type:"button",onClick:A,children:"Tambah"})})}),e("div",{className:"w-1/2",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:y,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:S.map((t,r)=>e("option",{children:t},r))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:y,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:a("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:a("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:a("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>o("value"),children:["Nilai",i.field=="value"&&i.direction=="asc"&&e(n,{}),i.field=="value"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>o("name"),children:["Name",i.field=="name"&&i.direction=="asc"&&e(n,{}),i.field=="name"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>o("type"),children:["Tipe",i.field=="type"&&i.direction=="asc"&&e(n,{}),i.field=="type"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>o("created_at"),children:["Dibuat",i.field=="created_at"&&i.direction=="asc"&&e(n,{}),i.field=="created_at"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:D.map((t,r)=>a("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:x.from+r}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.value}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.type==1?"Klinis":"Non Klinis"}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.joined}),e("td",{children:a(h,{children:[e(h.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),a(h.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>B(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>R(t),children:"Hapus"})]})]})})]},r))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:x.links.map((t,r)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>p({...i,page:new URL(t.url).searchParams.get("page")}),children:t.label},r))})]})})})]})})]})}$.layout=d=>e(P,{children:d});export{$ as default};
