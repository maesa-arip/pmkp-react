import{r,l as v,g as D,j as i,F as T,a as e,n as L}from"./app-24588fae.js";import{D as K}from"./DangerButton-6f8824ef.js";import{D as g,A as P}from"./App-5370a33c.js";import{A as _}from"./AddModal-1f2230e3.js";import{D as q}from"./DestroyModal-b3e38419.js";import{E as F}from"./EditModal-38b50418.js";import{T as H}from"./ThirdButton-49cabebe.js";import W from"./Create-925287cb.js";import Y from"./Edit-52844c3b.js";import"./ApplicationLogo-178f125f.js";import"./transition-5f006427.js";import"./render-12e546f0.js";import"./index-fa25f934.js";import"./dialog-7405a376.js";import"./keyboard-049b5e19.js";import"./use-watch-b8aa6709.js";import"./description-cd37925a.js";import"./use-outside-click-2799fe76.js";import"./TextInput-a967b272.js";import"./ComboboxMultiple-76291485.js";import"./clsx-3c9bef1f.js";import"./index-761d0ab0.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-a0a69770.js";import"./BPKP-8a5f007b.js";import"./InputLabel-5d21ed4f.js";import"./PrimaryButton-de6079d3.js";import"./SecondaryButton-9b656bdb.js";import"./LarsDHPKlinis-967b285e.js";import"./LarsDHPNonKlinis-54fffa54.js";import"./use-resolve-button-type-78525b7b.js";import"./Form-2e11e316.js";import"./InputError-dd21eadb.js";import"./TextInputCheckbox-ed5a81f4.js";const u=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),x=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function $(l){const{data:k,meta:C,filtered:R,attributes:o}=l.users,h=l.roles,[S,E]=r.useState([]),[a,n]=r.useState(R),M=r.useCallback(v.debounce(t=>{D.get(route("casemix.index"),{...v.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);r.useEffect(()=>M(a),[a]),r.useEffect(()=>{let t=[];for(let s=o.per_page;s<o.total/o.per_page;s=s+o.per_page)t.push(s);E(t)},[]);const f=t=>n({...a,[t.target.name]:t.target.value}),c=t=>{n({...a,field:t,direction:a.direction=="asc"?"desc":"asc"})},z=()=>{d(!0)},j=t=>{b(t),m(!0)},A=t=>{b(t),p(!0)},B=()=>{D.delete(route("casemix.destroy",N.id),{onSuccess:()=>p(!1)})},[w,d]=r.useState(!1),[y,m]=r.useState(!1),[U,p]=r.useState(!1),[I,O]=r.useState(!1),[N,b]=r.useState([]);return i(T,{children:[e(L,{title:"User"}),e(_,{isOpenAddDialog:w,setIsOpenAddDialog:d,size:"max-w-4xl",title:"Tambah User",children:e(W,{roles:h,enabled:I,setEnabled:O,isOpenAddDialog:w,setIsOpenAddDialog:d})}),e(F,{isOpenEditDialog:y,setIsOpenEditDialog:m,size:"max-w-4xl",title:"Edit User",children:e(Y,{roles:h,model:N,isOpenEditDialog:y,setIsOpenEditDialog:m})}),e(q,{isOpenDestroyDialog:U,setIsOpenDestroyDialog:p,size:"max-w-4xl",title:"Delete User",warning:"Yakin hapus data ini ?",children:e(K,{className:"ml-2",onClick:B,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:i("div",{className:"mx-auto sm:px-6 lg:px-8",children:[i("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(H,{type:"button",onClick:z,children:"Tambah"})})}),e("div",{className:"w-1/2",children:i("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:f,value:a.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:S.map((t,s)=>e("option",{children:t},s))}),i("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:f,value:a.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col p-1",children:e("div",{className:"-my-2 rounded sm:-mx-6 lg:-mx-8",children:i("div",{className:"inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8",children:[e("div",{className:"border-b border-gray-200 shadow sm:rounded-lg",children:i("table",{className:"min-w-full divide-y divide-gray-200",children:[e("thead",{className:"bg-gray-50",children:i("tr",{children:[e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("NoReg"),children:["NoReg",a.field=="NoReg"&&a.direction=="asc"&&e(u,{}),a.field=="NoReg"&&a.direction=="desc"&&e(x,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("KodingSementara"),children:["KodingSementara",a.field=="KodingSementara"&&a.direction=="asc"&&e(u,{}),a.field=="KodingSementara"&&a.direction=="desc"&&e(x,{})]})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:i("div",{className:"flex items-center cursor-pointer gap-x-2",onClick:()=>c("DiagnosaRuangan"),children:["DiagnosaRuangan",a.field=="DiagnosaRuangan"&&a.direction=="asc"&&e(u,{}),a.field=="DiagnosaRuangan"&&a.direction=="desc"&&e(x,{})]})}),e("th",{scope:"col",className:"relative px-6 py-3",children:e("span",{className:"sr-only",children:"Edit"})}),e("th",{scope:"col",className:"px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-800 uppercase",children:e("div",{className:"flex items-center cursor-pointer gap-x-2"})})]})}),e("tbody",{className:"bg-white divide-y divide-gray-200",children:k.map((t,s)=>i("tr",{children:[e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.NoReg}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.Tarif}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.DiagnosaRuangan}),e("td",{className:"px-6 py-4 whitespace-nowrap",children:t.NRM}),e("td",{children:i(g,{children:[e(g.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),i(g.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>j(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>A(t),children:"Hapus"})]})]})})]},t.NoReg))})]})}),e("ul",{className:"flex items-center mt-10 gap-x-1",children:C.links.map((t,s)=>e("button",{disabled:t.url==null,className:`${t.url==null?"text-gray-500":"text-gray-800"} w-12 h-9 rounded-lg flex items-center justify-center border bg-white`,onClick:()=>n({...a,page:new URL(t.url).searchParams.get("page")}),children:t.label},s))})]})})})]})})]})}$.layout=l=>e(P,{children:l});export{$ as default};
