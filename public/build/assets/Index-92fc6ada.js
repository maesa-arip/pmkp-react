import{r as s,l as k,g as D,j as i,F as L,a as e,n as O}from"./app-65c3736e.js";import{D as T}from"./DangerButton-db86c841.js";import{D as u,A as J}from"./App-3e59cc04.js";import{A as q,D as F}from"./DestroyModal-82c9a98e.js";import{E as U}from"./EditModal-e4d28d96.js";import{T as H}from"./ThirdButton-d2937b9d.js";import W from"./Create-580c5ce1.js";import Y from"./Edit-40dc894e.js";import"./ApplicationLogo-e2d1ca91.js";import"./transition-329c4a8a.js";import"./dialog-fe439601.js";import"./keyboard-0b468988.js";import"./use-watch-5fc0b0f7.js";import"./description-11da38e0.js";import"./TextInput-e0e4f64e.js";import"./ComboboxMultiple-aee76ad9.js";import"./clsx-5c1732e0.js";import"./ComboboxMultipleWithOutSemuaUnit-68564879.js";import"./BPKP-1d07fc09.js";import"./InputLabel-81fc7a82.js";import"./PrimaryButton-05530fef.js";import"./SecondaryButton-d9600f9a.js";import"./index-f0065e0d.js";import"./LarsDHPKlinis-687a5335.js";import"./LarsDHPNonKlinis-f9c4935b.js";import"./use-resolve-button-type-18bfd09c.js";import"./Form-1236da56.js";import"./InputError-334fd041.js";import"./ListBoxPage-27e0c856.js";import"./use-tracked-pointer-de4b2092.js";const g=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),h=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function $(l){const{data:C,meta:x,filtered:E,attributes:n}=l.pics,f=l.locations,[S,M]=s.useState([]),[a,o]=s.useState(E),[j,z]=s.useState(!0),I=s.useCallback(k.debounce(t=>{D.get(route(route().current()),{...k.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{j?z(!1):I(a)},[a]),s.useEffect(()=>{let t=[];for(let r=n.per_page;r<n.total/n.per_page;r=r+n.per_page)t.push(r);M(t)},[]);const w=t=>{const r={...a,[t.target.name]:t.target.value,page:1};o(r)},c=t=>{o({...a,field:t,direction:a.direction=="asc"?"desc":"asc"})},_=()=>{d(!0)},P=t=>{N(t),p(!0)},A=t=>{N(t),m(!0)},B=()=>{D.delete(route("pics.destroy",v.id),{onSuccess:()=>m(!1)})},[y,d]=s.useState(!1),[b,p]=s.useState(!1),[R,m]=s.useState(!1),[v,N]=s.useState([]);return i(L,{children:[e(O,{title:"Penanggung Jawab"}),e(q,{isOpenAddDialog:y,setIsOpenAddDialog:d,size:"max-w-4xl",title:"Tambah Penanggung Jawab",children:e(W,{ShouldMap:f,isOpenAddDialog:y,setIsOpenAddDialog:d})}),e(U,{isOpenEditDialog:b,setIsOpenEditDialog:p,size:"max-w-4xl",title:"Edit Penanggung Jawab",children:e(Y,{model:v,ShouldMap:f,isOpenEditDialog:b,setIsOpenEditDialog:p})}),e(F,{isOpenDestroyDialog:R,setIsOpenDestroyDialog:m,size:"max-w-4xl",title:"Delete Penanggung Jawab",warning:"Yakin hapus data ini ?",children:e(T,{className:"ml-2",onClick:B,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:i("div",{className:"mx-auto sm:px-6 lg:px-8",children:[i("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(H,{type:"button",onClick:_,children:"Tambah"})})}),e("div",{className:"w-1/2",children:i("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:w,value:a.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:S.map((t,r)=>e("option",{children:t},r))}),i("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:w,value:a.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:i("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:i("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:i("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("name"),children:["Nama",a.field=="name"&&a.direction=="asc"&&e(g,{}),a.field=="name"&&a.direction=="desc"&&e(h,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("location_id"),children:["Lokasi",a.field=="location_id"&&a.direction=="asc"&&e(g,{}),a.field=="location_id"&&a.direction=="desc"&&e(h,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("created_at"),children:["Dibuat",a.field=="created_at"&&a.direction=="asc"&&e(g,{}),a.field=="created_at"&&a.direction=="desc"&&e(h,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:C.map((t,r)=>i("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:x.from+r}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.location.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.joined}),e("td",{children:i(u,{children:[e(u.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),i(u.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>P(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>A(t),children:"Hapus"})]})]})})]},r))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:x.links.map((t,r)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>o({...a,page:new URL(t.url).searchParams.get("page")}),children:t.label},r))})]})})})]})})]})}$.layout=l=>e(J,{children:l});export{$ as default};
