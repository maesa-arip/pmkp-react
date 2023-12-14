import{r as n,l as y,g as D,j as i,F as _,a as e,n as K}from"./app-c54a562f.js";import{D as P}from"./DangerButton-17bfdb70.js";import{D as p,A as L}from"./App-8f5b7328.js";import{A as q}from"./AddModal-ff48dcdf.js";import{D as F}from"./DestroyModal-dd587cb3.js";import{E as U}from"./EditModal-b0bd5f28.js";import{T as H}from"./ThirdButton-af9e526b.js";import W from"./Create-a9630b10.js";import Y from"./Edit-1053dd71.js";import{T as o,B as G,P as J}from"./Badge-ab71176c.js";import"./ApplicationLogo-d2655cb8.js";import"./transition-9c757782.js";import"./render-66fc26f7.js";import"./index-888b2fed.js";import"./use-tracked-pointer-301018c3.js";import"./keyboard-70b1741c.js";import"./use-outside-click-eb6d816f.js";import"./use-tree-walker-30f59ca8.js";import"./use-controllable-650a6236.js";import"./use-watch-b3d15d4e.js";import"./dialog-cfbecf4e.js";import"./description-d5b73d4c.js";import"./TextInput-0606da2e.js";import"./ComboboxMultiple-272d2f73.js";import"./clsx-0be47f47.js";import"./inheritsLoose-c4a937f7.js";import"./createClass-1dd8160f.js";import"./defineProperty-741a9c8e.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-f23b6ea5.js";import"./BPKP-e8cbf9bc.js";import"./InputLabel-c3873a4b.js";import"./PrimaryButton-24baa18d.js";import"./SecondaryButton-155c8c96.js";import"./index-04bdfb58.js";import"./ComboboxMultiple copy-f32a3ef7.js";import"./ComboboxPage-44137921.js";import"./LarsDHPKlinis-f483660a.js";import"./LarsDHPNonKlinis-ddac879a.js";import"./SedangTerjadi-0540810f.js";import"./IKPDataInsiden-72b6f67d.js";import"./IKPDataEvaluasi-a8cf3186.js";import"./Form-9de6c688.js";import"./InputError-80a9159c.js";const N=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),T=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function Q(l){const{data:k,meta:u,filtered:C,attributes:s}=l.MutuKategori,[M,E]=n.useState([]),[r,g]=n.useState(C),[S,B]=n.useState(!0),I=n.useCallback(y.debounce(t=>{D.get(route(route().current()),{...y.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);n.useEffect(()=>{S?B(!1):I(r)},[r]),n.useEffect(()=>{let t=[];for(let a=s.per_page;a<s.total/s.per_page;a=a+s.per_page)t.push(a);E(t)},[]);const h=t=>{const a={...r,[t.target.name]:t.target.value,page:1};g(a)},f=t=>{g({...r,field:t,direction:r.direction=="asc"?"desc":"asc"})},z=()=>{d(!0)},j=t=>{v(t),c(!0)},A=t=>{v(t),m(!0)},O=()=>{D.delete(route("MutuKategori.destroy",b.id),{onSuccess:()=>m(!1)})},[x,d]=n.useState(!1),[w,c]=n.useState(!1),[R,m]=n.useState(!1),[b,v]=n.useState([]);return i(_,{children:[e(K,{title:"Mutu Kategori"}),e(q,{isOpenAddDialog:x,setIsOpenAddDialog:d,size:"max-w-4xl",title:"Tambah Mutu Kategori",children:e(W,{isOpenAddDialog:x,setIsOpenAddDialog:d})}),e(U,{isOpenEditDialog:w,setIsOpenEditDialog:c,size:"max-w-4xl",title:"Edit Mutu Kategori",children:e(Y,{model:b,isOpenEditDialog:w,setIsOpenEditDialog:c})}),e(F,{isOpenDestroyDialog:R,setIsOpenDestroyDialog:m,size:"max-w-4xl",title:"Delete Mutu Kategori",warning:"Yakin hapus data ini ?",children:e(P,{className:"ml-2",onClick:O,children:"Delete"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:i("div",{className:"mx-auto sm:px-6 lg:px-8",children:[i("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e(H,{type:"button",onClick:z,children:"Tambah"})})}),e("div",{className:"w-1/2",children:i("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:h,value:r.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:M.map((t,a)=>e("option",{children:t},a))}),i("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:h,value:r.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),i(o,{overflow:"none",children:[e(o.Thead,{children:i(o.Tr,{children:[e(o.Th,{children:"#"}),i(o.Th,{onClick:()=>f("name"),children:["Nama",r.field=="name"&&r.direction=="asc"&&e(N,{}),r.field=="name"&&r.direction=="desc"&&e(T,{})]}),i(o.Th,{onClick:()=>f("created_at"),children:["DIBUAT",r.field=="created_at"&&r.direction=="asc"&&e(N,{}),r.field=="created_at"&&r.direction=="desc"&&e(T,{})]}),e(o.Th,{})]})}),e(o.Tbody,{children:k.map((t,a)=>i("tr",{children:[e(o.Td,{children:e(G,{children:u.from+a})}),e(o.Td,{className:"whitespace-nowrap",children:t.name}),e(o.Td,{children:t.joined}),e(o.Td,{children:i(p,{children:[e(p.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),i(p.Content,{children:[e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>j(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>A(t),children:"Hapus"})]})]})})]},a))})]}),e(J,{meta:u})]})})]})}Q.layout=l=>e(L,{children:l});export{Q as default};