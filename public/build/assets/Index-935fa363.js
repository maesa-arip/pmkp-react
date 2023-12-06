import{r as s,l as k,g as D,j as r,F as L,a as e,n as O}from"./app-57abeb7f.js";import{D as T}from"./DangerButton-5ea1b8b0.js";import{D as u,A as J}from"./App-c4cc34ea.js";import{A as q}from"./AddModal-b578e317.js";import{D as F}from"./DestroyModal-cdd72ed1.js";import{E as U}from"./EditModal-12b88714.js";import{T as H}from"./ThirdButton-5f5cbff4.js";import W from"./Create-80d53749.js";import Y from"./Edit-df5ba4dc.js";import"./ApplicationLogo-87311ce6.js";import"./transition-93ae57c5.js";import"./render-03fd2506.js";import"./index-096dd8d1.js";import"./use-tracked-pointer-49162435.js";import"./keyboard-fa766a3d.js";import"./use-outside-click-442a3422.js";import"./use-tree-walker-df042132.js";import"./use-controllable-d69111b2.js";import"./use-watch-403218a7.js";import"./dialog-e1e29945.js";import"./description-c2473113.js";import"./TextInput-ca6ef7c6.js";import"./ComboboxMultiple-6a1ccb7b.js";import"./clsx-0d537405.js";import"./defineProperty-8250cd14.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-eab95b1f.js";import"./BPKP-46fb9951.js";import"./InputLabel-3abb9057.js";import"./PrimaryButton-d928be8d.js";import"./SecondaryButton-fc8ffef9.js";import"./index-1726395c.js";import"./ComboboxPage-94a3c038.js";import"./LarsDHPKlinis-3a4654c0.js";import"./LarsDHPNonKlinis-5f159e01.js";import"./SedangTerjadi-9c31c9a4.js";import"./IKPDataInsiden-8420ddd6.js";import"./IKPDataEvaluasi-454d3e74.js";import"./Form-e1981b2a.js";import"./InputError-2875e4e2.js";import"./ListBoxPage-c844861b.js";const g=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),h=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function $(l){const{data:C,meta:x,filtered:E,attributes:o}=l.pics,f=l.locations,[S,M]=s.useState([]),[a,n]=s.useState(E),[j,z]=s.useState(!0),I=s.useCallback(k.debounce(t=>{D.get(route(route().current()),{...k.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{j?z(!1):I(a)},[a]),s.useEffect(()=>{let t=[];for(let i=o.per_page;i<o.total/o.per_page;i=i+o.per_page)t.push(i);M(t)},[]);const w=t=>{const i={...a,[t.target.name]:t.target.value,page:1};n(i)},c=t=>{n({...a,field:t,direction:a.direction=="asc"?"desc":"asc"})},_=()=>{d(!0)},P=t=>{N(t),m(!0)},A=t=>{N(t),p(!0)},B=()=>{D.delete(route("pics.destroy",v.id),{onSuccess:()=>p(!1)})},[y,d]=s.useState(!1),[b,m]=s.useState(!1),[R,p]=s.useState(!1),[v,N]=s.useState([]);return r(L,{children:[e(O,{title:"Penanggung Jawab"}),e(q,{isOpenAddDialog:y,setIsOpenAddDialog:d,size:"max-w-4xl",title:"Tambah Penanggung Jawab",children:e(W,{ShouldMap:f,isOpenAddDialog:y,setIsOpenAddDialog:d})}),e(U,{isOpenEditDialog:b,setIsOpenEditDialog:m,size:"max-w-4xl",title:"Edit Penanggung Jawab",children:e(Y,{model:v,ShouldMap:f,isOpenEditDialog:b,setIsOpenEditDialog:m})}),e(F,{isOpenDestroyDialog:R,setIsOpenDestroyDialog:p,size:"max-w-4xl",title:"Delete Penanggung Jawab",warning:"Yakin hapus data ini ?",children:e(T,{className:"ml-2",onClick:B,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:r("div",{className:"mx-auto sm:px-6 lg:px-8",children:[r("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(H,{type:"button",onClick:_,children:"Tambah"})})}),e("div",{className:"w-1/2",children:r("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:w,value:a.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:S.map((t,i)=>e("option",{children:t},i))}),r("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:w,value:a.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:r("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:r("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:r("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:r("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("name"),children:["Nama",a.field=="name"&&a.direction=="asc"&&e(g,{}),a.field=="name"&&a.direction=="desc"&&e(h,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:r("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("location_id"),children:["Lokasi",a.field=="location_id"&&a.direction=="asc"&&e(g,{}),a.field=="location_id"&&a.direction=="desc"&&e(h,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:r("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("created_at"),children:["Dibuat",a.field=="created_at"&&a.direction=="asc"&&e(g,{}),a.field=="created_at"&&a.direction=="desc"&&e(h,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:C.map((t,i)=>r("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:x.from+i}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.location.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.joined}),e("td",{children:r(u,{children:[e(u.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),r(u.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>P(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>A(t),children:"Hapus"})]})]})})]},i))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:x.links.map((t,i)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>n({...a,page:new URL(t.url).searchParams.get("page")}),children:t.label},i))})]})})})]})})]})}$.layout=l=>e(J,{children:l});export{$ as default};
