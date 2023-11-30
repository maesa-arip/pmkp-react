import{r as s,l as D,g as T,j as a,F as R,a as e,n as _}from"./app-40227382.js";import{D as K}from"./DangerButton-3e99067e.js";import{D as u,A as L}from"./App-682dd345.js";import{A as q}from"./AddModal-2132627a.js";import{D as F}from"./DestroyModal-3520a38a.js";import{E as U}from"./EditModal-5077c3c8.js";import{T as H}from"./ThirdButton-4abae519.js";import W from"./Create-f71d388a.js";import Y from"./Edit-a020316f.js";import{T as r,B as G,P as J}from"./Badge-39f5160c.js";import"./ApplicationLogo-1be1e8fe.js";import"./transition-28801c53.js";import"./render-66257b5b.js";import"./ComboboxPage-878696ae.js";import"./use-tracked-pointer-5a6dfe94.js";import"./keyboard-61a26669.js";import"./use-outside-click-09bb6113.js";import"./use-tree-walker-55160274.js";import"./use-controllable-2ece201f.js";import"./use-watch-f0387d0f.js";import"./dialog-35762c09.js";import"./description-bdba954c.js";import"./TextInput-70d63fd3.js";import"./ComboboxMultiple-7454ec32.js";import"./clsx-aaf5a234.js";import"./defineProperty-8250cd14.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-cfa411bf.js";import"./BPKP-0d5c6a87.js";import"./InputLabel-4fdd6287.js";import"./PrimaryButton-ce8a4982.js";import"./SecondaryButton-e376ea20.js";import"./index-c0c70693.js";import"./LarsDHPKlinis-0e5204a9.js";import"./LarsDHPNonKlinis-e1b41eed.js";import"./SedangTerjadi-42304446.js";import"./Form-ea038e04.js";import"./InputError-0cf9554f.js";const h=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),g=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function Q(n){const{data:k,meta:f,filtered:C,attributes:l}=n.IkpProbabilitas,[S,I]=s.useState([]),[i,x]=s.useState(C),[E,B]=s.useState(!0),z=s.useCallback(D.debounce(t=>{T.get(route(route().current()),{...D.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{E?B(!1):z(i)},[i]),s.useEffect(()=>{let t=[];for(let o=l.per_page;o<l.total/l.per_page;o=o+l.per_page)t.push(o);I(t)},[]);const w=t=>{const o={...i,[t.target.name]:t.target.value,page:1};x(o)},d=t=>{x({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},M=()=>{c(!0)},P=t=>{N(t),m(!0)},j=t=>{N(t),p(!0)},A=()=>{T.delete(route("IkpProbabilitas.destroy",y.id),{onSuccess:()=>p(!1)})},[b,c]=s.useState(!1),[v,m]=s.useState(!1),[O,p]=s.useState(!1),[y,N]=s.useState([]);return a(R,{children:[e(_,{title:"IKP Spesialisasi"}),e(q,{isOpenAddDialog:b,setIsOpenAddDialog:c,size:"max-w-4xl",title:"Tambah IKP Spesialisasi",children:e(W,{isOpenAddDialog:b,setIsOpenAddDialog:c})}),e(U,{isOpenEditDialog:v,setIsOpenEditDialog:m,size:"max-w-4xl",title:"Edit IKP Spesialisasi",children:e(Y,{model:y,isOpenEditDialog:v,setIsOpenEditDialog:m})}),e(F,{isOpenDestroyDialog:O,setIsOpenDestroyDialog:p,size:"max-w-4xl",title:"Delete IKP Spesialisasi",warning:"Yakin hapus data ini ?",children:e(K,{className:"ml-2",onClick:A,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(H,{type:"button",onClick:M,children:"Tambah"})})}),e("div",{className:"w-1/2",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:w,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:S.map((t,o)=>e("option",{children:t},o))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:w,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),a(r,{overflow:"none",children:[e(r.Thead,{children:a(r.Tr,{children:[e(r.Th,{children:"#"}),a(r.Th,{onClick:()=>d("value"),children:["Nilai",i.field=="value"&&i.direction=="asc"&&e(h,{}),i.field=="value"&&i.direction=="desc"&&e(g,{})]}),a(r.Th,{onClick:()=>d("name"),children:["Nama",i.field=="name"&&i.direction=="asc"&&e(h,{}),i.field=="name"&&i.direction=="desc"&&e(g,{})]}),a(r.Th,{onClick:()=>d("created_at"),children:["DIBUAT",i.field=="created_at"&&i.direction=="asc"&&e(h,{}),i.field=="created_at"&&i.direction=="desc"&&e(g,{})]}),e(r.Th,{})]})}),e(r.Tbody,{children:k.map((t,o)=>a("tr",{children:[e(r.Td,{children:e(G,{children:f.from+o})}),e(r.Td,{className:"whitespace-nowrap",children:t.value}),e(r.Td,{className:"whitespace-nowrap",children:t.name}),e(r.Td,{children:t.joined}),e(r.Td,{children:a(u,{children:[e(u.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),a(u.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>P(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>j(t),children:"Hapus"})]})]})})]},o))})]}),e(J,{meta:f})]})})]})}Q.layout=n=>e(L,{children:n});export{Q as default};