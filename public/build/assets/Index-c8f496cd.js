import{_ as G,r as o,l as C,g as x,j as a,F as I,a as e,n as J}from"./app-51ace3d0.js";import{D as Q}from"./DangerButton-f3da5b5f.js";import{D as v,A as V}from"./App-5a759fcf.js";import{A as X}from"./AddModal-c4d53e0e.js";import{D as A}from"./DestroyModal-24b7680f.js";import{E as Z}from"./EditModal-2f041d45.js";import{T as $}from"./ThirdButton-dcf1f771.js";import ee from"./Create-bc033175.js";import te from"./Edit-b1107c73.js";import{T as r,B as b,P as ie}from"./Badge-14611c72.js";import"./moment-fbc5633a.js";import{P as re}from"./PrimaryButton-25f33bf3.js";import"./ApplicationLogo-4c375456.js";import"./transition-df8dfa7f.js";import"./render-4c1b6d6f.js";import"./index-80b734b2.js";import"./use-tracked-pointer-6f4e190f.js";import"./keyboard-5d080c87.js";import"./use-outside-click-649629ab.js";import"./use-tree-walker-6d933456.js";import"./use-controllable-b6d2b5ff.js";import"./use-watch-a2bba6b2.js";import"./dialog-148af03a.js";import"./description-4ae251f0.js";import"./TextInput-fe0f0eaf.js";import"./ComboboxMultiple-02fbd41d.js";import"./clsx-b9d4b0a9.js";import"./inheritsLoose-c4a937f7.js";import"./createClass-1dd8160f.js";import"./defineProperty-741a9c8e.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-80706125.js";import"./BPKP-c7669e8e.js";import"./InputLabel-e2db3590.js";import"./SecondaryButton-d2b15658.js";import"./index-c1f32acd.js";import"./ComboboxMultiple copy-d92d81d7.js";import"./ComboboxPage-307ec1ef.js";import"./LarsDHPKlinis-b3d0f571.js";import"./LarsDHPNonKlinis-9730de06.js";import"./SedangTerjadi-72c0ddd1.js";import"./IKPDataInsiden-66104791.js";import"./IKPDataEvaluasi-d109e7f8.js";import"./Form-0fc75a40.js";import"./InputError-a00db705.js";const c=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),p=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function ae(l){const{data:E,meta:y,filtered:M,attributes:d}=l.MutuIndikator;let k={MutuKategori:l.MutuKategori,IndikatorFitur3:l.IndikatorFitur3,IndikatorFitur4:l.IndikatorFitur4,IndikatorBaru:[{id:0,name:"Tidak"},{id:1,name:"Ya"}],Operator:[{id:"≥",name:"≥"},{id:"≤",name:"≤"},{id:">",name:">"},{id:"<",name:"<"},{id:"=",name:"="}],Penyebut:[{id:"%",name:"%"},{id:"‰",name:"‰"}]};const{permissionNames:D}=G().props,O=D?D.map(t=>t.name):"null",[B,z]=o.useState([]),[i,T]=o.useState(M),[j,P]=o.useState(!0),F=o.useCallback(C.debounce(t=>{x.get(route(route().current()),{...C.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);o.useEffect(()=>{j?P(!1):F(i)},[i]),o.useEffect(()=>{let t=[];for(let n=d.per_page;n<d.total/d.per_page;n=n+d.per_page)t.push(n);z(t)},[]);const N=t=>{const n={...i,[t.target.name]:t.target.value,page:1};T(n)},s=t=>{T({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},R=()=>{m(!0)},L=t=>{w(t),u(!0)},K=t=>{w(t),g(!0)},U=()=>{x.delete(route("MutuIndikator.destroy",f.id),{onSuccess:()=>g(!1)})},Y=t=>{w(t),h(!0)},q=()=>{x.put(route("MutuIndikator.approved",f.id),{onSuccess:()=>h(!1)})},[S,m]=o.useState(!1),[_,u]=o.useState(!1),[H,g]=o.useState(!1),[W,h]=o.useState(!1),[f,w]=o.useState([]);return a(I,{children:[e(J,{title:"Mutu Indikator"}),e(X,{isOpenAddDialog:S,setIsOpenAddDialog:m,size:"max-w-4xl",title:"Tambah Mutu Indikator",children:e(ee,{ShouldMap:k,isOpenAddDialog:S,setIsOpenAddDialog:m})}),e(Z,{isOpenEditDialog:_,setIsOpenEditDialog:u,size:"max-w-4xl",title:"Edit Mutu Indikator",children:e(te,{model:f,ShouldMap:k,isOpenEditDialog:_,setIsOpenEditDialog:u})}),e(A,{isOpenDestroyDialog:H,setIsOpenDestroyDialog:g,size:"max-w-4xl",title:"Delete Mutu Indikator",warning:"Yakin hapus data ini ? Semua Mutu Unit yang Terkait dengan Indikator ini akan dihapus juga",children:e(Q,{className:"ml-2",onClick:U,children:"Delete"})}),e(A,{isOpenDestroyDialog:W,setIsOpenDestroyDialog:h,size:"max-w-4xl",title:"Approved Mutu Indikator",warning:"Yakin approved data ini ?",children:e(re,{className:"ml-2",onClick:q,children:"Approved"})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:a("div",{className:"mx-auto sm:px-6 lg:px-8",children:[a("div",{className:"flex items-center justify-between mb-2",children:[e("div",{className:"w-1/2",children:e("div",{className:"flex items-center justify-start mt-2 mb-0 gap-x-1",children:e($,{type:"button",onClick:R,children:"Tambah"})})}),e("div",{className:"w-1/2",children:a("div",{className:"flex items-center justify-end mt-2 mb-0 gap-x-1",children:[e("select",{name:"load",id:"load",onChange:N,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:B.map((t,n)=>e("option",{children:t},n))}),a("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:N,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),a(r,{overflow:"none",children:[e(r.Thead,{children:a(r.Tr,{children:[e(r.Th,{children:"#"}),e(r.Th,{children:"Status"}),a(r.Th,{onClick:()=>s("mutu_kategori_id"),children:["Kategori",i.field=="mutu_kategori_id"&&i.direction=="asc"&&e(c,{}),i.field=="mutu_kategori_id"&&i.direction=="desc"&&e(p,{})]}),a(r.Th,{onClick:()=>s("indikator_fitur4_id"),children:["Indikator",i.field=="indikator_fitur4_id"&&i.direction=="asc"&&e(c,{}),i.field=="indikator_fitur4_id"&&i.direction=="desc"&&e(p,{})]}),e(r.Th,{colSpan:2,children:"Numerator (N) & Denuminator (D)"}),a(r.Th,{onClick:()=>s("standar"),children:["Standar",i.field=="standar"&&i.direction=="asc"&&e(c,{}),i.field=="standar"&&i.direction=="desc"&&e(p,{})]}),a(r.Th,{onClick:()=>s("location_id"),children:["Unit",i.field=="location_id"&&i.direction=="asc"&&e(c,{}),i.field=="location_id"&&i.direction=="desc"&&e(p,{})]}),e(r.Th,{})]})}),e(r.Tbody,{children:E.map((t,n)=>a(o.Fragment,{children:[a("tr",{children:[e(r.Td,{rowSpan:2,children:e(b,{children:y.from+n})}),e(r.Td,{rowSpan:2,children:t.approved==1?e(b,{color:"emerald",children:"Approved"}):e(b,{color:"yellow",children:"Menunggu"})}),e(r.Td,{rowSpan:2,children:t.kategori.name}),e(r.Td,{rowSpan:2,children:t.indikator_fitur4.name}),e(r.Td,{children:"N"}),e(r.Td,{children:t.num_name}),a(r.Td,{rowSpan:2,className:"whitespace-nowrap",children:[t.operator=="="?"":t.operator,t.standar,t.penyebut]}),e(r.Td,{rowSpan:2,className:"whitespace-nowrap",children:t.location.name}),e(r.Td,{rowSpan:2,children:a(v,{children:[e(v.Trigger,{children:e("button",{children:e("svg",{xmlns:"http://www.w3.org/2000/svg",className:"w-4 h-4 text-gray-400",viewBox:"0 0 20 20",fill:"currentColor",children:e("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),a(v.Content,{children:[O.indexOf("approved indikator mutu")>-1&&e(I,{children:t.approved==0&&e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>Y(t),children:"Approved"})}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>L(t),children:"Edit"}),e("button",{className:"items-center block w-full px-4 py-2 text-sm leading-5 text-left text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus:bg-gray-100 gap-x-2",onClick:()=>K(t),children:"Hapus"})]})]})})]}),a("tr",{children:[e(r.Td,{children:"D"}),e(r.Td,{children:t.denum_name})]})]},n))})]}),e(ie,{meta:y})]})})]})}ae.layout=l=>e(V,{children:l});export{ae as default};