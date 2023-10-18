import{r as i,l as b,g as v,j as a,F,a as e,n as U}from"./app-39b28b75.js";import{D as H}from"./DangerButton-bbe49589.js";import{D as p,A as W}from"./App-4e87e92e.js";import{A as Y}from"./AddModal-050b37f5.js";import{D as $}from"./DestroyModal-b1f00251.js";import{E as G}from"./EditModal-34198886.js";import{T as J}from"./ThirdButton-19d6d25e.js";import K from"./Create-c5adb85a.js";import Q from"./Edit-47f8e1c1.js";import"./ApplicationLogo-80ad1ec3.js";import"./transition-f985c522.js";import"./render-c0db6c63.js";import"./dialog-67d91a12.js";import"./keyboard-2676573b.js";import"./use-watch-36608396.js";import"./description-cbdcb2f3.js";import"./use-outside-click-973caf8c.js";import"./TextInput-0232117d.js";import"./ComboboxMultiple-7aee12c8.js";import"./clsx-78a9da9d.js";import"./ComboboxMultipleWithOutSemuaUnit-2a6efb5d.js";import"./BPKP-f031b930.js";import"./InputLabel-3431cd86.js";import"./PrimaryButton-14bd2f2a.js";import"./SecondaryButton-0234b844.js";import"./index-b189e8eb.js";import"./LarsDHPKlinis-86fed8ec.js";import"./LarsDHPNonKlinis-aab28c4b.js";import"./use-resolve-button-type-6de0b13d.js";import"./Form-b1570e96.js";import"./InputError-1bf95e0a.js";import"./TextInputCheckbox-8e8ef2a8.js";const N=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),k=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function V(l){const{data:D,meta:u,filtered:C,attributes:o}=l.roles,g=l.permissions,[E,R]=i.useState([]),[r,n]=i.useState(C),[S,z]=i.useState(!0),I=i.useCallback(b.debounce(t=>{v.get(route(route().current()),{...b.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);i.useEffect(()=>{S?z(!1):I(r)},[r]),i.useEffect(()=>{let t=[];for(let s=o.per_page;s<o.total/o.per_page;s=s+o.per_page)t.push(s);R(t)},[]);const x=t=>{const s={...r,[t.target.name]:t.target.value,page:1};n(s)},M=t=>{n({...r,field:t,direction:r.direction=="asc"?"desc":"asc"})},j=()=>{c(!0)},A=t=>{y(t),d(!0)},B=t=>{y(t),m(!0)},O=()=>{v.delete(route("roles.destroy",w.id),{onSuccess:()=>m(!1)})},[h,c]=i.useState(!1),[f,d]=i.useState(!1),[L,m]=i.useState(!1),[P,T]=i.useState(!1),[w,y]=i.useState([]);return a(F,{children:[e(U,{title:"Role"}),e(Y,{isOpenAddDialog:h,setIsOpenAddDialog:c,size:"max-w-4xl",title:"Tambah Role",children:e(K,{permissions:g,enabled:P,setEnabled:T,isOpenAddDialog:h,setIsOpenAddDialog:c})}),e(G,{isOpenEditDialog:f,setIsOpenEditDialog:d,size:"max-w-4xl",title:"Edit Role",children:e(Q,{permissions:g,model:w,isOpenEditDialog:f,setIsOpenEditDialog:d})}),e($,{isOpenDestroyDialog:L,setIsOpenDestroyDialog:m,size:"max-w-4xl",title:"Delete Role",warning:"Yakin hapus data ini ?",children:e(H,{className:"ml-2",onClick:O,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(J,{type:"button",onClick:j,children:"Tambah"})})}),e("div",{className:"w-1/2",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:x,value:r.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:E.map((t,s)=>e("option",{children:t},s))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:x,value:r.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:a("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:a("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:a("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>M("name"),children:["Name",r.field=="name"&&r.direction=="asc"&&e(N,{}),r.field=="name"&&r.direction=="desc"&&e(k,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",children:["Permissions",r.field=="permissions"&&r.direction=="asc"&&e(N,{}),r.field=="permissions"&&r.direction=="desc"&&e(k,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:D.map((t,s)=>a("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:u.from+s}),e("td",{className:"px-6 py-4 uppercase whitespace-nowrap",children:t.name}),e("td",{children:t.permissions.map((_,q)=>e("span",{className:"px-2 py-1 mx-1 text-xs text-blue-500 uppercase rounded-full bg-blue-50",children:_.name},q))}),e("td",{children:a(p,{children:[e(p.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),a(p.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>A(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>B(t),children:"Hapus"})]})]})})]},s))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:u.links.map((t,s)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>n({...r,page:new URL(t.url).searchParams.get("page")}),children:t.label},s))})]})})})]})})]})}V.layout=l=>e(W,{children:l});export{V as default};
