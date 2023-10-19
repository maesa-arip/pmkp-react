import{r as s,l as b,g as v,j as a,F as K,a as e,n as L}from"./app-24588fae.js";import{D as T}from"./DangerButton-6f8824ef.js";import{D as p,A as P}from"./App-5370a33c.js";import{A as _}from"./AddModal-1f2230e3.js";import{D as q}from"./DestroyModal-b3e38419.js";import{E as F}from"./EditModal-38b50418.js";import{T as U}from"./ThirdButton-49cabebe.js";import H from"./Create-aa27dfc4.js";import J from"./Edit-eea63285.js";import"./ApplicationLogo-178f125f.js";import"./transition-5f006427.js";import"./render-12e546f0.js";import"./index-fa25f934.js";import"./dialog-7405a376.js";import"./keyboard-049b5e19.js";import"./use-watch-b8aa6709.js";import"./description-cd37925a.js";import"./use-outside-click-2799fe76.js";import"./TextInput-a967b272.js";import"./ComboboxMultiple-76291485.js";import"./clsx-3c9bef1f.js";import"./index-761d0ab0.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-a0a69770.js";import"./BPKP-8a5f007b.js";import"./InputLabel-5d21ed4f.js";import"./PrimaryButton-de6079d3.js";import"./SecondaryButton-9b656bdb.js";import"./LarsDHPKlinis-967b285e.js";import"./LarsDHPNonKlinis-54fffa54.js";import"./use-resolve-button-type-78525b7b.js";import"./Form-a01a88a8.js";import"./InputError-dd21eadb.js";import"./TextAreaInput-71393383.js";const N=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),k=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function W(o){const{data:D,meta:u,filtered:C,attributes:l}=o.jenisSebabs,[E,S]=s.useState([]),[i,n]=s.useState(C),[R,j]=s.useState(!0),z=s.useCallback(b.debounce(t=>{v.get(route(route().current()),{...b.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{R?j(!1):z(i)},[i]),s.useEffect(()=>{let t=[];for(let r=l.per_page;r<l.total/l.per_page;r=r+l.per_page)t.push(r);S(t)},[]);const g=t=>{const r={...i,[t.target.name]:t.target.value,page:1};n(r)},h=t=>{n({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},I=()=>{c(!0)},M=t=>{y(t),d(!0)},A=t=>{y(t),m(!0)},B=()=>{v.delete(route("jenisSebabs.destroy",w.id),{onSuccess:()=>m(!1)})},[x,c]=s.useState(!1),[f,d]=s.useState(!1),[O,m]=s.useState(!1),[w,y]=s.useState([]);return a(K,{children:[e(L,{title:"Kategori Risiko"}),e(_,{isOpenAddDialog:x,setIsOpenAddDialog:c,size:"max-w-4xl",title:"Tambah Kategori Risiko",children:e(H,{isOpenAddDialog:x,setIsOpenAddDialog:c})}),e(F,{isOpenEditDialog:f,setIsOpenEditDialog:d,size:"max-w-4xl",title:"Edit Kategori Risiko",children:e(J,{model:w,isOpenEditDialog:f,setIsOpenEditDialog:d})}),e(q,{isOpenDestroyDialog:O,setIsOpenDestroyDialog:m,size:"max-w-4xl",title:"Delete Kategori Risiko",warning:"Yakin hapus data ini ?",children:e(T,{className:"ml-2",onClick:B,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(U,{type:"button",onClick:I,children:"Tambah"})})}),e("div",{className:"w-1/2",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:g,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:E.map((t,r)=>e("option",{children:t},r))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:g,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:a("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:a("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:a("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>h("name"),children:["Name",i.field=="name"&&i.direction=="asc"&&e(N,{}),i.field=="name"&&i.direction=="desc"&&e(k,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>h("description"),children:["Keterangan",i.field=="description"&&i.direction=="asc"&&e(N,{}),i.field=="description"&&i.direction=="desc"&&e(k,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:D.map((t,r)=>a("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:u.from+r}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.description}),e("td",{children:a(p,{children:[e(p.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),a(p.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>M(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>A(t),children:"Hapus"})]})]})})]},r))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:u.links.map((t,r)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>n({...i,page:new URL(t.url).searchParams.get("page")}),children:t.label},r))})]})})})]})})]})}W.layout=o=>e(P,{children:o});export{W as default};
