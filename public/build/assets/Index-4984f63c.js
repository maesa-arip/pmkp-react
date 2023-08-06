import{r,l as k,g as C,j as i,F as _,a as e,n as L}from"./app-b9ccf14e.js";import{D as K}from"./DangerButton-fb39df76.js";import{D as h,A as P}from"./App-899ea3b9.js";import{A as q,D as F,T as U}from"./ThirdButton-e30de2c3.js";import{E as H}from"./EditModal-f86e11bb.js";import W from"./Create-9dd59ef2.js";import Y from"./Edit-8fe2e985.js";import"./ApplicationLogo-b593c165.js";import"./transition-9c099975.js";import"./dialog-2bea9c5e.js";import"./keyboard-bc089e98.js";import"./description-8e8cf6db.js";import"./LarsDHP-4f2c9c78.js";import"./InputLabel-0c11b6b1.js";import"./PrimaryButton-15e39234.js";import"./SecondaryButton-d94fc982.js";import"./TextInput-7f635197.js";import"./index-ebef40b7.js";import"./BPKPKlinis-2e73ca6a.js";import"./use-resolve-button-type-d2012dcd.js";import"./Form-656c09f6.js";import"./InputError-03acd096.js";import"./ListBoxPage-9ee8697a.js";import"./use-tracked-pointer-991a454d.js";const o=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),c=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function $(d){const{data:D,meta:x,filtered:E,attributes:s}=d.controlValues,f=[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],[S,M]=r.useState([]),[a,p]=r.useState(E),[j,z]=r.useState(!0),I=r.useCallback(k.debounce(t=>{C.get(route(route().current()),{...k.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);r.useEffect(()=>{j?z(!1):I(a)},[a]),r.useEffect(()=>{let t=[];for(let l=s.per_page;l<s.total/s.per_page;l=l+s.per_page)t.push(l);M(t)},[]);const y=t=>{const l={...a,[t.target.name]:t.target.value,page:1};p(l)},n=t=>{p({...a,field:t,direction:a.direction=="asc"?"desc":"asc"})},A=()=>{m(!0)},B=t=>{v(t),u(!0)},R=t=>{v(t),g(!0)},O=()=>{C.delete(route("controlValues.destroy",b.id),{onSuccess:()=>g(!1)})},[w,m]=r.useState(!1),[N,u]=r.useState(!1),[T,g]=r.useState(!1),[b,v]=r.useState([]);return i(_,{children:[e(L,{title:"Nilai Controllability"}),e(q,{isOpenAddDialog:w,setIsOpenAddDialog:m,size:"max-w-4xl",title:"Tambah Nilai Controllability",children:e(W,{ShouldMap:f,isOpenAddDialog:w,setIsOpenAddDialog:m})}),e(H,{isOpenEditDialog:N,setIsOpenEditDialog:u,size:"max-w-4xl",title:"Edit Nilai Controllability",children:e(Y,{model:b,ShouldMap:f,isOpenEditDialog:N,setIsOpenEditDialog:u})}),e(F,{isOpenDestroyDialog:T,setIsOpenDestroyDialog:g,size:"max-w-4xl",title:"Delete Nilai Controllability",warning:"Yakin hapus data ini ?",children:e(K,{className:"ml-2",onClick:O,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:i("div",{className:"mx-auto sm:px-6 lg:px-8",children:[i("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(U,{type:"button",onClick:A,children:"Tambah"})})}),e("div",{className:"w-1/2",children:i("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:y,value:a.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:S.map((t,l)=>e("option",{children:t},l))}),i("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:y,value:a.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:i("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:i("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:i("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>n("value"),children:["Nilai",a.field=="value"&&a.direction=="asc"&&e(o,{}),a.field=="value"&&a.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>n("name"),children:["Name",a.field=="name"&&a.direction=="asc"&&e(o,{}),a.field=="name"&&a.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>n("type"),children:["Tipe",a.field=="type"&&a.direction=="asc"&&e(o,{}),a.field=="type"&&a.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>n("created_at"),children:["Dibuat",a.field=="created_at"&&a.direction=="asc"&&e(o,{}),a.field=="created_at"&&a.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:D.map((t,l)=>i("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:x.from+l}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.value}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.type==1?"Klinis":"Non Klinis"}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.joined}),e("td",{children:i(h,{children:[e(h.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),i(h.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>B(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>R(t),children:"Hapus"})]})]})})]},l))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:x.links.map((t,l)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>p({...a,page:new URL(t.url).searchParams.get("page")}),children:t.label},l))})]})})})]})})]})}$.layout=d=>e(P,{children:d});export{$ as default};
