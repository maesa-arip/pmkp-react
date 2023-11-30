import{r as s,l as y,g as D,j as r,F as R,a as e,n as _}from"./app-4dc7e864.js";import{D as L}from"./DangerButton-44b51b6a.js";import{D as p,A as K}from"./App-c64f2658.js";import{A as q}from"./AddModal-b61c1bcd.js";import{D as F}from"./DestroyModal-f1d74722.js";import{E as U}from"./EditModal-e16a21ab.js";import{T as H}from"./ThirdButton-5efe1378.js";import W from"./Create-8f8c25b7.js";import Y from"./Edit-4da21fee.js";import{T as a,B as G,P as J}from"./Badge-a2e7ae85.js";import"./ApplicationLogo-abc09b78.js";import"./transition-53d35c05.js";import"./render-ea42b304.js";import"./ComboboxPage-ebb481cb.js";import"./use-tracked-pointer-ac86867a.js";import"./keyboard-84303bfc.js";import"./use-outside-click-a2e1bd03.js";import"./use-tree-walker-f4949a02.js";import"./use-controllable-d514a8f4.js";import"./use-watch-579ebb77.js";import"./dialog-231e50f1.js";import"./description-72675574.js";import"./TextInput-6a3dc504.js";import"./ComboboxMultiple-52cd8efc.js";import"./clsx-8d99dcf0.js";import"./defineProperty-8250cd14.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-76d2b20b.js";import"./BPKP-fa411aad.js";import"./InputLabel-858bf6c7.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./index-68480d34.js";import"./LarsDHPKlinis-f4e5310f.js";import"./LarsDHPNonKlinis-d814e89e.js";import"./SedangTerjadi-5a340cc3.js";import"./IKPDataInsiden-779584f5.js";import"./IKPDataEvaluasi-01c6741b.js";import"./Form-8cdaa5f1.js";import"./InputError-e6c099ae.js";const N=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),T=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function Q(l){const{data:k,meta:u,filtered:C,attributes:n}=l.IkpLokasi,[I,S]=s.useState([]),[i,g]=s.useState(C),[E,B]=s.useState(!0),z=s.useCallback(y.debounce(t=>{D.get(route(route().current()),{...y.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{E?B(!1):z(i)},[i]),s.useEffect(()=>{let t=[];for(let o=n.per_page;o<n.total/n.per_page;o=o+n.per_page)t.push(o);S(t)},[]);const h=t=>{const o={...i,[t.target.name]:t.target.value,page:1};g(o)},f=t=>{g({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},M=()=>{d(!0)},P=t=>{v(t),c(!0)},j=t=>{v(t),m(!0)},A=()=>{D.delete(route("IkpLokasi.destroy",b.id),{onSuccess:()=>m(!1)})},[x,d]=s.useState(!1),[w,c]=s.useState(!1),[O,m]=s.useState(!1),[b,v]=s.useState([]);return r(R,{children:[e(_,{title:"IKP Spesialisasi"}),e(q,{isOpenAddDialog:x,setIsOpenAddDialog:d,size:"max-w-4xl",title:"Tambah IKP Spesialisasi",children:e(W,{isOpenAddDialog:x,setIsOpenAddDialog:d})}),e(U,{isOpenEditDialog:w,setIsOpenEditDialog:c,size:"max-w-4xl",title:"Edit IKP Spesialisasi",children:e(Y,{model:b,isOpenEditDialog:w,setIsOpenEditDialog:c})}),e(F,{isOpenDestroyDialog:O,setIsOpenDestroyDialog:m,size:"max-w-4xl",title:"Delete IKP Spesialisasi",warning:"Yakin hapus data ini ?",children:e(L,{className:"ml-2",onClick:A,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:r("div",{className:"mx-auto sm:px-6 lg:px-8",children:[r("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(H,{type:"button",onClick:M,children:"Tambah"})})}),e("div",{className:"w-1/2",children:r("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:h,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:I.map((t,o)=>e("option",{children:t},o))}),r("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:h,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),r(a,{overflow:"none",children:[e(a.Thead,{children:r(a.Tr,{children:[e(a.Th,{children:"#"}),r(a.Th,{onClick:()=>f("name"),children:["Nama",i.field=="name"&&i.direction=="asc"&&e(N,{}),i.field=="name"&&i.direction=="desc"&&e(T,{})]}),r(a.Th,{onClick:()=>f("created_at"),children:["DIBUAT",i.field=="created_at"&&i.direction=="asc"&&e(N,{}),i.field=="created_at"&&i.direction=="desc"&&e(T,{})]}),e(a.Th,{})]})}),e(a.Tbody,{children:k.map((t,o)=>r("tr",{children:[e(a.Td,{children:e(G,{children:u.from+o})}),e(a.Td,{className:"whitespace-nowrap",children:t.name}),e(a.Td,{children:t.joined}),e(a.Td,{children:r(p,{children:[e(p.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),r(p.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>P(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>j(t),children:"Hapus"})]})]})})]},o))})]}),e(J,{meta:u})]})})]})}Q.layout=l=>e(K,{children:l});export{Q as default};
