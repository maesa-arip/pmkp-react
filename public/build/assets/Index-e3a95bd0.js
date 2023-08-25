import{r as l,l as k,g as D,j as i,F as T,a as e,n as _}from"./app-2bf39a84.js";import{D as L}from"./DangerButton-5ccb9535.js";import{D as h,A as K}from"./App-af0cb5e6.js";import{A as q,D as F}from"./DestroyModal-e7be44d8.js";import{E as U}from"./EditModal-c4ec5eb2.js";import{T as H}from"./ThirdButton-d720f886.js";import W from"./Create-d6319065.js";import Y from"./Edit-b4ec8c21.js";import"./ApplicationLogo-796c8a26.js";import"./transition-c5bf2c10.js";import"./dialog-48048ea7.js";import"./keyboard-be4382e6.js";import"./use-watch-02412e61.js";import"./description-5aba3928.js";import"./LarsDHP-85be83d4.js";import"./InputLabel-0e923cdb.js";import"./PrimaryButton-0d458c5a.js";import"./SecondaryButton-e4da5bbe.js";import"./TextInput-5bea8677.js";import"./index-82a394d0.js";import"./BPKPKlinis-1890d44c.js";import"./BPKPNonKlinis-b2a42f08.js";import"./use-resolve-button-type-ab10262b.js";import"./Form-52195822.js";import"./InputError-33f8a1b5.js";import"./ListBoxPage-b5ccf8d4.js";import"./use-tracked-pointer-e3385313.js";const o=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),c=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function $(d){const{data:C,meta:x,filtered:E,attributes:s}=d.probabilityValues,f=[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],[S,M]=l.useState([]),[a,p]=l.useState(E),[j,z]=l.useState(!0),I=l.useCallback(k.debounce(t=>{D.get(route(route().current()),{...k.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);l.useEffect(()=>{j?z(!1):I(a)},[a]),l.useEffect(()=>{let t=[];for(let r=s.per_page;r<s.total/s.per_page;r=r+s.per_page)t.push(r);M(t)},[]);const w=t=>{const r={...a,[t.target.name]:t.target.value,page:1};p(r)},n=t=>{p({...a,field:t,direction:a.direction=="asc"?"desc":"asc"})},P=()=>{m(!0)},A=t=>{v(t),u(!0)},B=t=>{v(t),g(!0)},R=()=>{D.delete(route("probabilityValues.destroy",N.id),{onSuccess:()=>g(!1)})},[y,m]=l.useState(!1),[b,u]=l.useState(!1),[O,g]=l.useState(!1),[N,v]=l.useState([]);return i(T,{children:[e(_,{title:"Nilai Probability"}),e(q,{isOpenAddDialog:y,setIsOpenAddDialog:m,size:"max-w-4xl",title:"Tambah Nilai Probability",children:e(W,{ShouldMap:f,isOpenAddDialog:y,setIsOpenAddDialog:m})}),e(U,{isOpenEditDialog:b,setIsOpenEditDialog:u,size:"max-w-4xl",title:"Edit Nilai Probability",children:e(Y,{model:N,ShouldMap:f,isOpenEditDialog:b,setIsOpenEditDialog:u})}),e(F,{isOpenDestroyDialog:O,setIsOpenDestroyDialog:g,size:"max-w-4xl",title:"Delete Nilai Probability",warning:"Yakin hapus data ini ?",children:e(L,{className:"ml-2",onClick:R,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:i("div",{className:"mx-auto sm:px-6 lg:px-8",children:[i("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(H,{type:"button",onClick:P,children:"Tambah"})})}),e("div",{className:"w-1/2",children:i("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:w,value:a.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:S.map((t,r)=>e("option",{children:t},r))}),i("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:w,value:a.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 overflow-x-auto rounded sm:-mx-6 lg:-mx-8",children:i("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:i("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:i("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>n("value"),children:["Nilai",a.field=="value"&&a.direction=="asc"&&e(o,{}),a.field=="value"&&a.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>n("name"),children:["Name",a.field=="name"&&a.direction=="asc"&&e(o,{}),a.field=="name"&&a.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>n("type"),children:["Tipe",a.field=="type"&&a.direction=="asc"&&e(o,{}),a.field=="type"&&a.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>n("created_at"),children:["Dibuat",a.field=="created_at"&&a.direction=="asc"&&e(o,{}),a.field=="created_at"&&a.direction=="desc"&&e(c,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:C.map((t,r)=>i("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:x.from+r}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.value}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.type==1?"Klinis":"Non Klinis"}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.joined}),e("td",{children:i(h,{children:[e(h.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),i(h.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>A(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>B(t),children:"Hapus"})]})]})})]},r))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:x.links.map((t,r)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>p({...a,page:new URL(t.url).searchParams.get("page")}),children:t.label},r))})]})})})]})})]})}$.layout=d=>e(K,{children:d});export{$ as default};