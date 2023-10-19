import{_ as q,r,l as N,g as K,j as o,F as U,a as e,n as z}from"./app-24588fae.js";import{A}from"./App-5370a33c.js";import{E as R}from"./EditModal-38b50418.js";import F from"./Edit-5607b89e.js";import{T as a,B as L,P as Y}from"./Badge-6ad65b4c.js";import{T as I}from"./ThirdButton-49cabebe.js";import $ from"./Edit-546769e6.js";import{h as H}from"./moment-fbc5633a.js";import"./ApplicationLogo-178f125f.js";import"./transition-5f006427.js";import"./render-12e546f0.js";import"./index-fa25f934.js";import"./dialog-7405a376.js";import"./keyboard-049b5e19.js";import"./use-watch-b8aa6709.js";import"./description-cd37925a.js";import"./use-outside-click-2799fe76.js";import"./TextInput-a967b272.js";import"./ComboboxMultiple-76291485.js";import"./clsx-3c9bef1f.js";import"./index-761d0ab0.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-a0a69770.js";import"./BPKP-8a5f007b.js";import"./InputLabel-5d21ed4f.js";import"./PrimaryButton-de6079d3.js";import"./SecondaryButton-9b656bdb.js";import"./LarsDHPKlinis-967b285e.js";import"./LarsDHPNonKlinis-54fffa54.js";import"./use-resolve-button-type-78525b7b.js";import"./Form-d10b48aa.js";import"./InputError-dd21eadb.js";import"./RadioCard-341ed8c6.js";import"./use-tree-walker-f54895da.js";import"./use-controllable-d1c2f65c.js";import"./TextAreaInput-71393383.js";import"./TextInputWithError-34aac4f2.js";import"./Form-4435eb59.js";const h=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),g=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function J(l){const{data:c,meta:f,filtered:E,attributes:d}=l.riskRegisterKlinis;q().props;let b={riskCategories:l.riskCategories,identificationSources:l.identificationSources,locations:l.locations,riskVarieties:l.riskVarieties,riskTypes:l.riskTypes,pics:l.pics,impactValues:l.impactValues,probabilityValues:l.probabilityValues,controlValues:l.controlValues,indikatorFitur04s:l.indikatorFitur04s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}]};const[C,D]=r.useState([]),[i,w]=r.useState(E),[_,j]=r.useState(!0),P=r.useCallback(N.debounce(t=>{K.get(route("requeststatus"),{...N.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);r.useEffect(()=>{_?j(!1):P(i)},[i]),r.useEffect(()=>{let t=[];for(let s=d.per_page;s<d.total/d.per_page;s=s+d.per_page)t.push(s);D(t)},[]);const x=t=>{const s={...i,[t.target.name]:t.target.value,page:1};w(s)},m=t=>{w({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},O=t=>{k(t),u(!0)},V=t=>{k(t),B(t),p(!0)};r.useState(!1);const[v,u]=r.useState(!1);r.useState(!1);const[y,p]=r.useState(!1),[S,k]=r.useState([]),[n,T]=r.useState(null),[W,B]=r.useState(null),M=t=>{T(n===t?null:t)};return o(U,{children:[e(z,{title:"Verifikasi Risiko"}),e(R,{isOpenEditDialog:v,setIsOpenEditDialog:u,size:"max-w-4xl",title:"Update Status",children:e(F,{model:S,ShouldMap:b,isOpenEditDialog:v,setIsOpenEditDialog:u})}),e(R,{isOpenEditDialog:y,setIsOpenEditDialog:p,size:"max-w-6xl",title:"Update Status",children:e($,{model:S,ShouldMap:b,isOpenEditDialog:y,setIsOpenEditDialog:p})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:o("div",{className:"mx-auto sm:px-6 lg:px-8",children:[e("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:"VERIFIKASI ADMIN (RISIKO PRIORITAS)"}),o("div",{className:"flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg",children:[e("div",{className:"w-3/4",children:o("div",{className:"flex items-center justify-start py-2 mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-2",children:[e(I,{color:n===null?"gray":"teal",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=c[n];O(t)}},disabled:n===null,children:"Lihat History"}),e(I,{color:n===null?"gray":"cyan",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=c[n];V(t)}},disabled:n===null,children:"Update Status"})]})}),e("div",{className:"w-1/4",children:o("div",{className:"flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap",children:[e("select",{name:"load",id:"load",onChange:x,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:C.map((t,s)=>e("option",{children:t},s))}),o("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:x,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col",children:e("div",{className:"-my-2 overflow-x-auto rounded ",children:o("div",{className:"inline-block min-w-full py-2 align-middle ",children:[o(a,{children:[e(a.Thead,{children:o(a.Tr,{children:[e(a.Th,{children:"#"}),e(a.Th,{children:"Tanggal Kejadian"}),e(a.Th,{children:"Tanggal Perbaikan"}),o(a.Th,{width:"w-96",onClick:()=>m("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(h,{}),i.field=="sebab"&&i.direction=="desc"&&e(g,{})]}),o(a.Th,{onClick:()=>m("pic_id"),children:["Penanggung Jawab",i.field=="pic_id"&&i.direction=="asc"&&e(h,{}),i.field=="pic_id"&&i.direction=="desc"&&e(g,{})]}),o(a.Th,{onClick:()=>m("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(h,{}),i.field=="user_id"&&i.direction=="desc"&&e(g,{})]})]})}),e(a.Tbody,{children:c.map((t,s)=>o("tr",{className:n===s?"bg-sky-100  cursor-pointer":"cursor-pointer text-red-500 bg-red-50",onClick:()=>M(s),children:[e(a.Td,{children:e(L,{children:f.from+s})}),e(a.Td,{children:H(t.created_at).format("YYYY-MM-DD")}),e(a.Td,{children:t.requestupdate?t.requestupdate.tgl_perbaikan:"Belum Perbaikan"}),e(a.Td,{children:t.sebab}),e(a.Td,{children:t.pic.name}),e(a.Td,{children:t.user.name})]},s))})]}),e(Y,{meta:f})]})})})]})})]})}J.layout=l=>e(A,{children:l});export{J as default};
