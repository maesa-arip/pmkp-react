import{r as s,l as y,g as v,j as a,F as _,a as e,n as L}from"./app-4dc7e864.js";import{D as T}from"./DangerButton-44b51b6a.js";import{D as p,A as P}from"./App-c64f2658.js";import{A as q}from"./AddModal-b61c1bcd.js";import{D as F}from"./DestroyModal-f1d74722.js";import{E as U}from"./EditModal-e16a21ab.js";import{T as H}from"./ThirdButton-5efe1378.js";import W from"./Create-4bca2310.js";import Y from"./Edit-3e88733e.js";import"./ApplicationLogo-abc09b78.js";import"./transition-53d35c05.js";import"./render-ea42b304.js";import"./ComboboxPage-ebb481cb.js";import"./use-tracked-pointer-ac86867a.js";import"./keyboard-84303bfc.js";import"./use-outside-click-a2e1bd03.js";import"./use-tree-walker-f4949a02.js";import"./use-controllable-d514a8f4.js";import"./use-watch-579ebb77.js";import"./dialog-231e50f1.js";import"./description-72675574.js";import"./TextInput-6a3dc504.js";import"./ComboboxMultiple-52cd8efc.js";import"./clsx-8d99dcf0.js";import"./defineProperty-8250cd14.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-76d2b20b.js";import"./BPKP-fa411aad.js";import"./InputLabel-858bf6c7.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./index-68480d34.js";import"./LarsDHPKlinis-f4e5310f.js";import"./LarsDHPNonKlinis-d814e89e.js";import"./SedangTerjadi-5a340cc3.js";import"./IKPDataInsiden-779584f5.js";import"./IKPDataEvaluasi-01c6741b.js";import"./Form-c6d2a8e0.js";import"./InputError-e6c099ae.js";const N=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),k=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function $(o){const{data:D,meta:u,filtered:S,attributes:l}=o.identificationSources,[C,E]=s.useState([]),[i,n]=s.useState(S),[I,j]=s.useState(!0),z=s.useCallback(y.debounce(t=>{v.get(route(route().current()),{...y.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{I?j(!1):z(i)},[i]),s.useEffect(()=>{let t=[];for(let r=l.per_page;r<l.total/l.per_page;r=r+l.per_page)t.push(r);E(t)},[]);const g=t=>{const r={...i,[t.target.name]:t.target.value,page:1};n(r)},h=t=>{n({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},M=()=>{c(!0)},A=t=>{b(t),d(!0)},B=t=>{b(t),m(!0)},R=()=>{v.delete(route("identificationSources.destroy",w.id),{onSuccess:()=>m(!1)})},[f,c]=s.useState(!1),[x,d]=s.useState(!1),[O,m]=s.useState(!1),[w,b]=s.useState([]);return a(_,{children:[e(L,{title:"Sumber Identifikasi"}),e(q,{isOpenAddDialog:f,setIsOpenAddDialog:c,size:"max-w-4xl",title:"Tambah Sumber Identifikasi",children:e(W,{isOpenAddDialog:f,setIsOpenAddDialog:c})}),e(U,{isOpenEditDialog:x,setIsOpenEditDialog:d,size:"max-w-4xl",title:"Edit Sumber Identifikasi",children:e(Y,{model:w,isOpenEditDialog:x,setIsOpenEditDialog:d})}),e(F,{isOpenDestroyDialog:O,setIsOpenDestroyDialog:m,size:"max-w-4xl",title:"Delete Sumber Identifikasi",warning:"Yakin hapus data ini ?",children:e(T,{className:"ml-2",onClick:R,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(H,{type:"button",onClick:M,children:"Tambah"})})}),e("div",{className:"w-1/2",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:g,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:C.map((t,r)=>e("option",{children:t},r))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:g,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:a("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:a("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:a("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>h("name"),children:["Name",i.field=="name"&&i.direction=="asc"&&e(N,{}),i.field=="name"&&i.direction=="desc"&&e(k,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:a("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>h("created_at"),children:["Dibuat",i.field=="created_at"&&i.direction=="asc"&&e(N,{}),i.field=="created_at"&&i.direction=="desc"&&e(k,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:D.map((t,r)=>a("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:u.from+r}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.joined}),e("td",{children:a(p,{children:[e(p.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),a(p.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>A(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>B(t),children:"Hapus"})]})]})})]},r))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:u.links.map((t,r)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>n({...i,page:new URL(t.url).searchParams.get("page")}),children:t.label},r))})]})})})]})})]})}$.layout=o=>e(P,{children:o});export{$ as default};
