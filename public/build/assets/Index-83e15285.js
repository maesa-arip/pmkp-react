import{_ as V,r,l as N,g as z,j as n,F as K,a as e,n as L}from"./app-39b28b75.js";import{A}from"./App-4e87e92e.js";import{E as R}from"./EditModal-34198886.js";import E from"./Edit-3bc316ca.js";import{T as a,B as F,P as Y}from"./Badge-af2056e6.js";import{T as C}from"./ThirdButton-19d6d25e.js";import{h as $}from"./moment-fbc5633a.js";import"./ApplicationLogo-80ad1ec3.js";import"./transition-f985c522.js";import"./render-c0db6c63.js";import"./dialog-67d91a12.js";import"./keyboard-2676573b.js";import"./use-watch-36608396.js";import"./description-cbdcb2f3.js";import"./use-outside-click-973caf8c.js";import"./TextInput-0232117d.js";import"./ComboboxMultiple-7aee12c8.js";import"./clsx-78a9da9d.js";import"./ComboboxMultipleWithOutSemuaUnit-2a6efb5d.js";import"./BPKP-f031b930.js";import"./InputLabel-3431cd86.js";import"./PrimaryButton-14bd2f2a.js";import"./SecondaryButton-0234b844.js";import"./index-b189e8eb.js";import"./LarsDHPKlinis-86fed8ec.js";import"./LarsDHPNonKlinis-aab28c4b.js";import"./use-resolve-button-type-6de0b13d.js";import"./Form-6aef7ee8.js";import"./InputError-1bf95e0a.js";import"./RadioCard-5a5bd30b.js";import"./use-tree-walker-f0531641.js";import"./use-controllable-90b8c745.js";import"./TextAreaInput-5d37962a.js";import"./TextInputWithError-4b49646c.js";/* empty css                         */const h=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),g=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function H(l){const{data:c,meta:f,filtered:D,attributes:d}=l.riskRegisterKlinis;V().props;let b={riskCategories:l.riskCategories,identificationSources:l.identificationSources,locations:l.locations,riskVarieties:l.riskVarieties,riskTypes:l.riskTypes,pics:l.pics,impactValues:l.impactValues,probabilityValues:l.probabilityValues,controlValues:l.controlValues,indikatorFitur04s:l.indikatorFitur04s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}]};const[_,j]=r.useState([]),[i,w]=r.useState(D),[P,I]=r.useState(!0),U=r.useCallback(N.debounce(t=>{z.get(route("requeststatus"),{...N.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);r.useEffect(()=>{P?I(!1):U(i)},[i]),r.useEffect(()=>{let t=[];for(let s=d.per_page;s<d.total/d.per_page;s=s+d.per_page)t.push(s);j(t)},[]);const x=t=>{const s={...i,[t.target.name]:t.target.value,page:1};w(s)},u=t=>{w({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},B=t=>{T(t),m(!0)},q=t=>{T(t),M(t),p(!0)};r.useState(!1);const[v,m]=r.useState(!1);r.useState(!1);const[y,p]=r.useState(!1),[S,T]=r.useState([]),[o,k]=r.useState(null),[J,M]=r.useState(null),O=t=>{k(o===t?null:t)};return n(K,{children:[e(L,{title:"Update Status"}),e(R,{isOpenEditDialog:v,setIsOpenEditDialog:m,size:"max-w-4xl",title:"Update Status",children:e(E,{model:S,ShouldMap:b,isOpenEditDialog:v,setIsOpenEditDialog:m})}),e(R,{isOpenEditDialog:y,setIsOpenEditDialog:p,size:"max-w-6xl",title:"Update Status",children:e(E,{model:S,ShouldMap:b,isOpenEditDialog:y,setIsOpenEditDialog:p})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:n("div",{className:"mx-auto sm:px-6 lg:px-8",children:[e("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:"UPDATE STATUS"}),n("div",{className:"flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg",children:[e("div",{className:"w-3/4",children:n("div",{className:"flex items-center justify-start py-2 mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-2",children:[e(C,{color:o===null?"gray":"teal",type:"button",className:`${o===null?"cursor-not-allowed":""}`,onClick:()=>{if(o!==null){const t=c[o];B(t)}},disabled:o===null,children:"Lihat History"}),e(C,{color:o===null?"gray":"cyan",type:"button",className:`${o===null?"cursor-not-allowed":""}`,onClick:()=>{if(o!==null){const t=c[o];q(t)}},disabled:o===null,children:"Update Status"})]})}),e("div",{className:"w-1/4",children:n("div",{className:"flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap",children:[e("select",{name:"load",id:"load",onChange:x,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:_.map((t,s)=>e("option",{children:t},s))}),n("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:x,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col",children:e("div",{className:"-my-2 overflow-x-auto rounded ",children:n("div",{className:"inline-block min-w-full py-2 align-middle ",children:[n(a,{children:[e(a.Thead,{children:n(a.Tr,{children:[e(a.Th,{children:"#"}),e(a.Th,{children:"Tanggal Kejadian"}),e(a.Th,{children:"Tanggal Perbaikan"}),n(a.Th,{width:"w-96",onClick:()=>u("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(h,{}),i.field=="sebab"&&i.direction=="desc"&&e(g,{})]}),n(a.Th,{onClick:()=>u("pic_id"),children:["Penanggung Jawab",i.field=="pic_id"&&i.direction=="asc"&&e(h,{}),i.field=="pic_id"&&i.direction=="desc"&&e(g,{})]}),n(a.Th,{onClick:()=>u("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(h,{}),i.field=="user_id"&&i.direction=="desc"&&e(g,{})]})]})}),e(a.Tbody,{children:c.map((t,s)=>n("tr",{className:o===s?"bg-sky-100  cursor-pointer":"cursor-pointer text-red-500 bg-red-50",onClick:()=>O(s),children:[e(a.Td,{children:e(F,{children:f.from+s})}),e(a.Td,{children:$(t.created_at).format("YYYY-MM-DD")}),e(a.Td,{children:t.requestupdate?t.requestupdate.tgl_perbaikan:"Belum Perbaikan"}),e(a.Td,{children:t.sebab}),e(a.Td,{children:t.pic.name}),e(a.Td,{children:t.user.name})]},s))})]}),e(Y,{meta:f})]})})})]})})]})}H.layout=l=>e(A,{children:l});export{H as default};
