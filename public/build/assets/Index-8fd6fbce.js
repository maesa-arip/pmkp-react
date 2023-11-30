import{_ as V,r as s,l as R,g as K,j as o,F as U,a as e,n as z}from"./app-4dc7e864.js";import{A as L}from"./App-c64f2658.js";import{E as N}from"./EditModal-e16a21ab.js";import Y from"./Edit-627b363d.js";import{T as a,B as F,P as H}from"./Badge-a2e7ae85.js";import{T as E}from"./ThirdButton-5efe1378.js";import $ from"./Edit-6fdf64f8.js";import{h as A}from"./moment-fbc5633a.js";import"./ApplicationLogo-abc09b78.js";import"./transition-53d35c05.js";import"./render-ea42b304.js";import"./ComboboxPage-ebb481cb.js";import"./use-tracked-pointer-ac86867a.js";import"./keyboard-84303bfc.js";import"./use-outside-click-a2e1bd03.js";import"./use-tree-walker-f4949a02.js";import"./use-controllable-d514a8f4.js";import"./use-watch-579ebb77.js";import"./dialog-231e50f1.js";import"./description-72675574.js";import"./TextInput-6a3dc504.js";import"./ComboboxMultiple-52cd8efc.js";import"./clsx-8d99dcf0.js";import"./defineProperty-8250cd14.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-76d2b20b.js";import"./BPKP-fa411aad.js";import"./InputLabel-858bf6c7.js";import"./PrimaryButton-188fc25a.js";import"./SecondaryButton-616e52dd.js";import"./index-68480d34.js";import"./LarsDHPKlinis-f4e5310f.js";import"./LarsDHPNonKlinis-d814e89e.js";import"./SedangTerjadi-5a340cc3.js";import"./IKPDataInsiden-779584f5.js";import"./IKPDataEvaluasi-01c6741b.js";import"./Form-0cff5679.js";import"./TextAreaInput-36efdc5d.js";import"./Form-e3a6091e.js";import"./InputError-e6c099ae.js";import"./TextInputWithError-cb45040b.js";const h=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),g=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function G(l){const{data:c,meta:f,filtered:C,attributes:d}=l.riskRegisterKlinis;V().props;let b={riskCategories:l.riskCategories,identificationSources:l.identificationSources,locations:l.locations,riskVarieties:l.riskVarieties,riskTypes:l.riskTypes,pics:l.pics,impactValues:l.impactValues,probabilityValues:l.probabilityValues,controlValues:l.controlValues,indikatorFitur04s:l.indikatorFitur04s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}]};const[I,D]=s.useState([]),[i,w]=s.useState(C),[_,j]=s.useState(!0),P=s.useCallback(R.debounce(t=>{K.get(route("notifications"),{...R.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{_?j(!1):P(i)},[i]),s.useEffect(()=>{let t=[];for(let r=d.per_page;r<d.total/d.per_page;r=r+d.per_page)t.push(r);D(t)},[]);const x=t=>{const r={...i,[t.target.name]:t.target.value,page:1};w(r)},m=t=>{w({...i,field:t,direction:i.direction=="asc"?"desc":"asc"})},q=t=>{k(t),u(!0)},B=t=>{k(t),O(t),p(!0)};s.useState(!1);const[y,u]=s.useState(!1);s.useState(!1);const[v,p]=s.useState(!1),[S,k]=s.useState([]),[n,T]=s.useState(null),[J,O]=s.useState(null),M=t=>{T(n===t?null:t)};return o(U,{children:[e(z,{title:"Notifications"}),e(N,{isOpenEditDialog:y,setIsOpenEditDialog:u,size:"max-w-4xl",title:"History Risk Register",children:e(Y,{model:S,ShouldMap:b,isOpenEditDialog:y,setIsOpenEditDialog:u})}),e(N,{isOpenEditDialog:v,setIsOpenEditDialog:p,size:"max-w-6xl",title:"Request Update Status",children:e($,{model:S,ShouldMap:b,isOpenEditDialog:v,setIsOpenEditDialog:p})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:o("div",{className:"mx-auto sm:px-6 lg:px-8",children:[e("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:"HISTORY RISK REGISTER"}),o("div",{className:"flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg",children:[e("div",{className:"w-3/4",children:o("div",{className:"flex items-center justify-start py-2 mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-2",children:[e(E,{color:n===null?"gray":"teal",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=c[n];q(t)}},disabled:n===null,children:"Lihat History"}),e(E,{color:n===null?"gray":"cyan",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=c[n];B(t)}},disabled:n===null,children:"Request Update Status"})]})}),e("div",{className:"w-1/4",children:o("div",{className:"flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap",children:[e("select",{name:"load",id:"load",onChange:x,value:i.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:I.map((t,r)=>e("option",{children:t},r))}),o("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:x,value:i.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col",children:e("div",{className:"-my-2 overflow-x-auto rounded ",children:o("div",{className:"inline-block min-w-full py-2 align-middle ",children:[o(a,{children:[e(a.Thead,{children:o(a.Tr,{children:[e(a.Th,{children:"#"}),e(a.Th,{children:"Tanggal Kejadian"}),e(a.Th,{children:"Tanggal Perbaikan"}),o(a.Th,{width:"w-96",onClick:()=>m("sebab"),children:["Sebab",i.field=="sebab"&&i.direction=="asc"&&e(h,{}),i.field=="sebab"&&i.direction=="desc"&&e(g,{})]}),o(a.Th,{onClick:()=>m("pic_id"),children:["Penanggung Jawab",i.field=="pic_id"&&i.direction=="asc"&&e(h,{}),i.field=="pic_id"&&i.direction=="desc"&&e(g,{})]}),o(a.Th,{onClick:()=>m("user_id"),children:["Pemilik Risiko",i.field=="user_id"&&i.direction=="asc"&&e(h,{}),i.field=="user_id"&&i.direction=="desc"&&e(g,{})]})]})}),e(a.Tbody,{children:c.map((t,r)=>o("tr",{className:n===r?"bg-sky-100  cursor-pointer":"cursor-pointer text-red-500 bg-red-50",onClick:()=>M(r),children:[e(a.Td,{children:e(F,{children:f.from+r})}),e(a.Td,{children:A(t.created_at).format("YYYY-MM-DD")}),e(a.Td,{children:t.requestupdate?t.requestupdate.tgl_perbaikan:"Belum Perbaikan"}),e(a.Td,{children:t.sebab}),e(a.Td,{children:t.pic.name}),e(a.Td,{children:t.user.name})]},r))})]}),e(H,{meta:f})]})})})]})})]})}G.layout=l=>e(L,{children:l});export{G as default};
