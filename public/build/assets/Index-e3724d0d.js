import{r as s,l as y,g as v,j as i,F as O,a as e,n as _}from"./app-deaba12f.js";import{D as L}from"./DangerButton-f584d3b9.js";import{D as p,A as R}from"./App-3b377aaf.js";import{A as T,D as P,T as q}from"./ThirdButton-f727ec3d.js";import{E as F}from"./EditModal-7035afee.js";import U from"./Create-d1b5160b.js";import H from"./Edit-88aa09b9.js";import"./ApplicationLogo-8cf3a095.js";import"./transition-78ca94c2.js";import"./dialog-fda035d5.js";import"./keyboard-356e2d1a.js";import"./description-6acc9905.js";import"./Form-3882608f.js";import"./InputError-69d219ea.js";import"./InputLabel-c23c89f4.js";import"./PrimaryButton-4345420b.js";import"./SecondaryButton-0599126b.js";import"./TextInput-4dda37a4.js";const N=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),k=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function W(n){const{data:D,meta:u,filtered:S,attributes:l}=n.identificationSources,[C,E]=s.useState([]),[a,o]=s.useState(S),I=s.useCallback(y.debounce(t=>{v.get(route("identificationSources.index"),{...y.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>I(a),[a]),s.useEffect(()=>{let t=[];for(let r=l.per_page;r<l.total/l.per_page;r=r+l.per_page)t.push(r);E(t)},[]);const g=t=>o({...a,[t.target.name]:t.target.value}),h=t=>{o({...a,field:t,direction:a.direction=="asc"?"desc":"asc"})},j=()=>{c(!0)},z=t=>{b(t),d(!0)},M=t=>{b(t),m(!0)},A=()=>{v.delete(route("identificationSources.destroy",w.id),{onSuccess:()=>m(!1)})},[x,c]=s.useState(!1),[f,d]=s.useState(!1),[B,m]=s.useState(!1),[w,b]=s.useState([]);return i(O,{children:[e(_,{title:"Sumber Identifikasi"}),e(T,{isOpenAddDialog:x,setIsOpenAddDialog:c,size:"max-w-4xl",title:"Tambah Sumber Identifikasi",children:e(U,{isOpenAddDialog:x,setIsOpenAddDialog:c})}),e(F,{isOpenEditDialog:f,setIsOpenEditDialog:d,size:"max-w-4xl",title:"Edit Sumber Identifikasi",children:e(H,{model:w,isOpenEditDialog:f,setIsOpenEditDialog:d})}),e(P,{isOpenDestroyDialog:B,setIsOpenDestroyDialog:m,size:"max-w-4xl",title:"Delete Sumber Identifikasi",warning:"Yakin hapus data ini ?",children:e(L,{className:"ml-2",onClick:A,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:i("div",{className:"mx-auto sm:px-6 lg:px-8",children:[i("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(q,{type:"button",onClick:j,children:"Tambah"})})}),e("div",{className:"w-1/2",children:i("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:g,value:a.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:C.map((t,r)=>e("option",{children:t},r))}),i("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:g,value:a.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:i("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:i("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:i("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2",children:"#"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>h("name"),children:["Name",a.field=="name"&&a.direction=="asc"&&e(N,{}),a.field=="name"&&a.direction=="desc"&&e(k,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>h("created_at"),children:["Dibuat",a.field=="created_at"&&a.direction=="asc"&&e(N,{}),a.field=="created_at"&&a.direction=="desc"&&e(k,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:D.map((t,r)=>i("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:u.from+r}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.name}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.joined}),e("td",{children:i(p,{children:[e(p.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),i(p.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>z(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>M(t),children:"Hapus"})]})]})})]},r))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:u.links.map((t,r)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>o({...a,page:new URL(t.url).searchParams.get("page")}),children:t.label},r))})]})})})]})})]})}W.layout=n=>e(R,{children:n});export{W as default};
