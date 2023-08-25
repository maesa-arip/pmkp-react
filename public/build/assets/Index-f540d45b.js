import{r as s,l as y,g as v,j as r,F as _,a as e,n as L}from"./app-2bf39a84.js";import{D as T}from"./DangerButton-5ccb9535.js";import{D as p,A as P}from"./App-af0cb5e6.js";import{A as q,D as F}from"./DestroyModal-e7be44d8.js";import{E as U}from"./EditModal-c4ec5eb2.js";import{T as H}from"./ThirdButton-d720f886.js";import W from"./Create-76cbfbff.js";import Y from"./Edit-78fc01b1.js";import"./ApplicationLogo-796c8a26.js";import"./transition-c5bf2c10.js";import"./dialog-48048ea7.js";import"./keyboard-be4382e6.js";import"./use-watch-02412e61.js";import"./description-5aba3928.js";import"./LarsDHP-85be83d4.js";import"./InputLabel-0e923cdb.js";import"./PrimaryButton-0d458c5a.js";import"./SecondaryButton-e4da5bbe.js";import"./TextInput-5bea8677.js";import"./index-82a394d0.js";import"./BPKPKlinis-1890d44c.js";import"./BPKPNonKlinis-b2a42f08.js";import"./use-resolve-button-type-ab10262b.js";import"./Form-902367f8.js";import"./InputError-33f8a1b5.js";const N=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),k=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function $(n){const{data:D,meta:u,filtered:S,attributes:l}=n.identificationSources,[C,E]=s.useState([]),[a,o]=s.useState(S),[I,j]=s.useState(!0),z=s.useCallback(y.debounce(t=>{v.get(route(route().current()),{...y.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{I?j(!1):z(a)},[a]),s.useEffect(()=>{let t=[];for(let i=l.per_page;i<l.total/l.per_page;i=i+l.per_page)t.push(i);E(t)},[]);const g=t=>{const i={...a,[t.target.name]:t.target.value,page:1};o(i)},h=t=>{o({...a,field:t,direction:a.direction=="asc"?"desc":"asc"})},M=()=>{c(!0)},A=t=>{b(t),d(!0)},B=t=>{b(t),m(!0)},R=()=>{v.delete(route("identificationSources.destroy",w.id),{onSuccess:()=>m(!1)})},[x,c]=s.useState(!1),[f,d]=s.useState(!1),[O,m]=s.useState(!1),[w,b]=s.useState([]);return r(_,{children:[e(L,{title:"Sumber Identifikasi"}),e(q,{isOpenAddDialog:x,setIsOpenAddDialog:c,size:"max-w-4xl",title:"Tambah Sumber Identifikasi",children:e(W,{isOpenAddDialog:x,setIsOpenAddDialog:c})}),e(U,{isOpenEditDialog:f,setIsOpenEditDialog:d,size:"max-w-4xl",title:"Edit Sumber Identifikasi",children:e(Y,{model:w,isOpenEditDialog:f,setIsOpenEditDialog:d})}),e(F,{isOpenDestroyDialog:O,setIsOpenDestroyDialog:m,size:"max-w-4xl",title:"Delete Sumber Identifikasi",warning:"Yakin hapus data ini ?",children:e(T,{className:"ml-2",onClick:R,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:r("div",{className:"mx-auto sm:px-6 lg:px-8",children:[r("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(H,{type:"button",onClick:M,children:"Tambah"})})}),e("div",{className:"w-1/2",children:r("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:g,value:a.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:C.map((t,i)=>e("option",{children:t},i))}),r("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:g,value:a.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:r("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:r("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:r("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:r("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>h("name"),children:["Name",a.field=="name"&&a.direction=="asc"&&e(N,{}),a.field=="name"&&a.direction=="desc"&&e(k,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:r("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>h("created_at"),children:["Dibuat",a.field=="created_at"&&a.direction=="asc"&&e(N,{}),a.field=="created_at"&&a.direction=="desc"&&e(k,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:D.map((t,i)=>r("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:u.from+i}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.joined}),e("td",{children:r(p,{children:[e(p.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),r(p.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>A(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>B(t),children:"Hapus"})]})]})})]},i))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:u.links.map((t,i)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>o({...a,page:new URL(t.url).searchParams.get("page")}),children:t.label},i))})]})})})]})})]})}$.layout=n=>e(P,{children:n});export{$ as default};