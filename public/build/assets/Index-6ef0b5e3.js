import{r as s,l as v,g as k,j as i,F as _,a as e,n as K}from"./app-b9ccf14e.js";import{D as L}from"./DangerButton-fb39df76.js";import{D as u,A as T}from"./App-899ea3b9.js";import{A as P,D as V,T as q}from"./ThirdButton-e30de2c3.js";import{E as F}from"./EditModal-f86e11bb.js";import U from"./Create-ed98d54b.js";import H from"./Edit-45f346d4.js";import"./ApplicationLogo-b593c165.js";import"./transition-9c099975.js";import"./dialog-2bea9c5e.js";import"./keyboard-bc089e98.js";import"./description-8e8cf6db.js";import"./LarsDHP-4f2c9c78.js";import"./InputLabel-0c11b6b1.js";import"./PrimaryButton-15e39234.js";import"./SecondaryButton-d94fc982.js";import"./TextInput-7f635197.js";import"./index-ebef40b7.js";import"./BPKPKlinis-2e73ca6a.js";import"./use-resolve-button-type-d2012dcd.js";import"./Form-eeb22bc3.js";import"./InputError-03acd096.js";import"./TextAreaInput-489abccb.js";const g=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),h=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function W(n){const{data:D,meta:x,filtered:C,attributes:l}=n.riskVarieties,[E,R]=s.useState([]),[a,o]=s.useState(C),[S,j]=s.useState(!0),z=s.useCallback(v.debounce(t=>{k.get(route(route().current()),{...v.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{S?j(!1):z(a)},[a]),s.useEffect(()=>{let t=[];for(let r=l.per_page;r<l.total/l.per_page;r=r+l.per_page)t.push(r);R(t)},[]);const f=t=>{const r={...a,[t.target.name]:t.target.value,page:1};o(r)},c=t=>{o({...a,field:t,direction:a.direction=="asc"?"desc":"asc"})},I=()=>{d(!0)},M=t=>{N(t),p(!0)},A=t=>{N(t),m(!0)},B=()=>{k.delete(route("riskVarieties.destroy",b.id),{onSuccess:()=>m(!1)})},[w,d]=s.useState(!1),[y,p]=s.useState(!1),[O,m]=s.useState(!1),[b,N]=s.useState([]);return i(_,{children:[e(K,{title:"Kategori Risiko"}),e(P,{isOpenAddDialog:w,setIsOpenAddDialog:d,size:"max-w-4xl",title:"Tambah Kategori Risiko",children:e(U,{isOpenAddDialog:w,setIsOpenAddDialog:d})}),e(F,{isOpenEditDialog:y,setIsOpenEditDialog:p,size:"max-w-4xl",title:"Edit Kategori Risiko",children:e(H,{model:b,isOpenEditDialog:y,setIsOpenEditDialog:p})}),e(V,{isOpenDestroyDialog:O,setIsOpenDestroyDialog:m,size:"max-w-4xl",title:"Delete Kategori Risiko",warning:"Yakin hapus data ini ?",children:e(L,{className:"ml-2",onClick:B,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:i("div",{className:"mx-auto sm:px-6 lg:px-8",children:[i("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(q,{type:"button",onClick:I,children:"Tambah"})})}),e("div",{className:"w-1/2",children:i("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:f,value:a.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:E.map((t,r)=>e("option",{children:t},r))}),i("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:f,value:a.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:i("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:i("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:i("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("name"),children:["Name",a.field=="name"&&a.direction=="asc"&&e(g,{}),a.field=="name"&&a.direction=="desc"&&e(h,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("description"),children:["Keterangan",a.field=="description"&&a.direction=="asc"&&e(g,{}),a.field=="description"&&a.direction=="desc"&&e(h,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("created_at"),children:["Dibuat",a.field=="created_at"&&a.direction=="asc"&&e(g,{}),a.field=="created_at"&&a.direction=="desc"&&e(h,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:D.map((t,r)=>i("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:x.from+r}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.description}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.joined}),e("td",{children:i(u,{children:[e(u.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),i(u.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>M(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>A(t),children:"Hapus"})]})]})})]},r))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:x.links.map((t,r)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>o({...a,page:new URL(t.url).searchParams.get("page")}),children:t.label},r))})]})})})]})})]})}W.layout=n=>e(T,{children:n});export{W as default};
