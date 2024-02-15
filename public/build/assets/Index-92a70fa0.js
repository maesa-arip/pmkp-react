import{r as l,l as k,g as D,j as a,F as _,a as e,n as K}from"./app-12155d7d.js";import{D as L}from"./DangerButton-c58d72ae.js";import{D as h,A as P}from"./App-6ac09be6.js";import{A as q}from"./AddModal-1ce4034a.js";import{D as F}from"./DestroyModal-1c88ac33.js";import{E as U}from"./EditModal-e366d75a.js";import{T as H}from"./ThirdButton-52bd21f1.js";import W from"./Create-93103975.js";import Y from"./Edit-8109f20f.js";import"./ApplicationLogo-078c895e.js";import"./transition-7636f647.js";import"./render-01be6b0f.js";import"./index-85bae41e.js";import"./use-tracked-pointer-84df31e5.js";import"./keyboard-b2167fef.js";import"./use-outside-click-3ace941d.js";import"./use-tree-walker-998eddf4.js";import"./use-controllable-94ca8b47.js";import"./use-watch-db60be17.js";import"./dialog-9ebd5ace.js";import"./description-c657afff.js";import"./TextInput-d440a1d3.js";import"./ComboboxMultiple-670ab608.js";import"./clsx-938d7c3e.js";import"./inheritsLoose-c4a937f7.js";import"./createClass-1dd8160f.js";import"./defineProperty-741a9c8e.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-b3e6ea07.js";import"./BPKP-e9b4a299.js";import"./InputLabel-a6ff48db.js";import"./PrimaryButton-bf4695c7.js";import"./SecondaryButton-456a1177.js";import"./index-da398f32.js";import"./ComboboxMultiple copy-0f9bb67d.js";import"./ComboboxPage-0458995e.js";import"./LarsDHPKlinis-522e3975.js";import"./LarsDHPNonKlinis-90ef930d.js";import"./SedangTerjadi-6ed79b7b.js";import"./IKPDataInsiden-79e1ae82.js";import"./IKPDataEvaluasi-65d5caaa.js";import"./Form-2bad1d71.js";import"./InputError-b39280a0.js";import"./ListBoxPage-0be97d60.js";const n=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),c=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function $(d){const{data:C,meta:x,filtered:E,attributes:s}=d.impactValues,f=[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],[S,M]=l.useState([]),[i,p]=l.useState(E),[j,z]=l.useState(!0),I=l.useCallback(k.debounce(t=>{D.get(route(route().current()),{...k.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);l.useEffect(()=>{j?z(!1):I(i)},[i]),l.useEffect(()=>{let t=[];for(let r=s.per_page;r<s.total/s.per_page;r=r+s.per_page)t.push(r);M(t)},[]);const w=t=>{const r={...i,[t.target.name]:t.target.value,page:1};p(r)},o=t=>{p({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},A=()=>{m(!0)},B=t=>{b(t),u(!0)},R=t=>{b(t),g(!0)},O=()=>{D.delete(route("impactValues.destroy",v.id),{onSuccess:()=>g(!1)})},[y,m]=l.useState(!1),[N,u]=l.useState(!1),[T,g]=l.useState(!1),[v,b]=l.useState([]);return a(_,{children:[e(K,{title:"Nilai Dampak"}),e(q,{isOpenAddDialog:y,setIsOpenAddDialog:m,size:"max-w-4xl",title:"Tambah Nilai Dampak",children:e(W,{ShouldMap:f,isOpenAddDialog:y,setIsOpenAddDialog:m})}),e(U,{isOpenEditDialog:N,setIsOpenEditDialog:u,size:"max-w-4xl",title:"Edit Nilai Dampak",children:e(Y,{model:v,ShouldMap:f,isOpenEditDialog:N,setIsOpenEditDialog:u})}),e(F,{isOpenDestroyDialog:T,setIsOpenDestroyDialog:g,size:"max-w-4xl",title:"Delete Nilai Dampak",warning:"Yakin hapus data ini ?",children:e(L,{className:"ml-2",onClick:O,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(H,{type:"button",onClick:A,children:"Tambah"})})}),e("div",{className:"w-1/2",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:w,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:S.map((t,r)=>e("option",{children:t},r))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:w,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:a("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:a("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:a("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>o("value"),children:["Nilai",i.field=="value"&&i.direction=="asc"&&e(n,{}),i.field=="value"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>o("name"),children:["Keterangan",i.field=="name"&&i.direction=="asc"&&e(n,{}),i.field=="name"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>o("type"),children:["Tipe",i.field=="type"&&i.direction=="asc"&&e(n,{}),i.field=="type"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>o("created_at"),children:["Dibuat",i.field=="created_at"&&i.direction=="asc"&&e(n,{}),i.field=="created_at"&&i.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:C.map((t,r)=>a("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:x.from+r}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.value}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.type==1?"Klinis":"Non Klinis"}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.joined}),e("td",{children:a(h,{children:[e(h.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),a(h.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>B(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>R(t),children:"Hapus"})]})]})})]},r))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:x.links.map((t,r)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>p({...i,page:new URL(t.url).searchParams.get("page")}),children:t.label},r))})]})})})]})})]})}$.layout=d=>e(P,{children:d});export{$ as default};