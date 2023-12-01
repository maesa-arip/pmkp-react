import{_ as A,r as s,l as N,g as K,j as r,F as L,a as e,n as z}from"./app-e63dc518.js";import{E as R}from"./EditModal-a959fc45.js";import{A as F}from"./App-afbcf89a.js";import E from"./Edit-3b69321a.js";import{T as a,B as U,P as Y}from"./Badge-865d37ba.js";import{T as I}from"./ThirdButton-32e16864.js";import{h as J}from"./moment-fbc5633a.js";import"./transition-f8d58bb7.js";import"./render-d70bc49e.js";import"./dialog-3ba0b33d.js";import"./keyboard-447131b1.js";import"./use-watch-8712103b.js";import"./description-6f3949db.js";import"./use-outside-click-bb6a6fc0.js";import"./ApplicationLogo-c72a81f7.js";import"./ComboboxPage-b6ce5bc8.js";import"./use-tracked-pointer-b056eebf.js";import"./use-tree-walker-217dc56f.js";import"./use-controllable-a3dfb2af.js";import"./TextInput-6ffa0885.js";import"./ComboboxMultiple-660ff063.js";import"./clsx-bc91b332.js";import"./defineProperty-8250cd14.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-d8710cf1.js";import"./BPKP-041152ca.js";import"./InputLabel-85eaffe7.js";import"./PrimaryButton-0019f275.js";import"./SecondaryButton-eba774a1.js";import"./index-0d401196.js";import"./LarsDHPKlinis-30c9926d.js";import"./LarsDHPNonKlinis-7063fc49.js";import"./SedangTerjadi-8bf0218b.js";import"./IKPDataInsiden-a57acde5.js";import"./IKPDataEvaluasi-550ea74a.js";import"./Form-0c593194.js";import"./InputError-47496446.js";import"./TextAreaInput-67513412.js";import"./TextInputWithError-df44a59b.js";const m=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),u=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function H(n){const{data:p,meta:f,filtered:C,attributes:d}=n.riskRegisterKlinis;A().props;let b={riskCategories:n.riskCategories,identificationSources:n.identificationSources,locations:n.locations,riskVarieties:n.riskVarieties,riskTypes:n.riskTypes,pics:n.pics,impactValues:n.impactValues,probabilityValues:n.probabilityValues,controlValues:n.controlValues,indikatorFitur04s:n.indikatorFitur04s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}]};const[D,j]=s.useState([]),[t,w]=s.useState(C),[V,_]=s.useState(!0),M=s.useCallback(N.debounce(i=>{K.get(route(route().current()),{...N.pickBy(i),page:i.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{V?_(!1):M(t)},[t]),s.useEffect(()=>{let i=[];for(let l=d.per_page;l<d.total/d.per_page;l=l+d.per_page)i.push(l);j(i)},[]);const x=i=>{const l={...t,[i.target.name]:i.target.value,page:1};w(l)},c=i=>{w({...t,field:i,direction:t.direction=="asc"?"desc":"asc"})},B=i=>{S(i),h(!0)},P=i=>{S(i),q(i),g(!0)};s.useState(!1);const[k,h]=s.useState(!1);s.useState(!1);const[v,g]=s.useState(!1),[y,S]=s.useState([]),[o,T]=s.useState(null),[$,q]=s.useState(null),O=i=>{T(o===i?null:i)};return r(L,{children:[e(z,{title:"Verifikasi Risiko"}),e(R,{isOpenEditDialog:k,setIsOpenEditDialog:h,size:"max-w-4xl",title:"Lihat History",children:e(E,{model:y,ShouldMap:b,isOpenEditDialog:k,setIsOpenEditDialog:h})}),e(R,{isOpenEditDialog:v,setIsOpenEditDialog:g,size:"max-w-6xl",title:"Verifikasi Admin Risiko Sedang Terjadi",children:e(E,{model:y,ShouldMap:b,isOpenEditDialog:v,setIsOpenEditDialog:g})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:r("div",{className:"mx-auto sm:px-6 lg:px-8",children:[e("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:"VERIFIKASI MANAJEMEN (RISIKO SEDANG TERJADI)"}),r("div",{className:"flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg",children:[e("div",{className:"w-3/4",children:r("div",{className:"flex items-center justify-start py-2 mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-2",children:[e(I,{color:o===null?"gray":"teal",type:"button",className:`${o===null?"cursor-not-allowed":""}`,onClick:()=>{if(o!==null){const i=p[o];B(i)}},disabled:o===null,children:"Lihat History"}),e(I,{color:o===null?"gray":"cyan",type:"button",className:`${o===null?"cursor-not-allowed":""}`,onClick:()=>{if(o!==null){const i=p[o];P(i)}},disabled:o===null,children:"Update Status"})]})}),e("div",{className:"w-1/4",children:r("div",{className:"flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap",children:[e("select",{name:"load",id:"load",onChange:x,value:t.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:D.map((i,l)=>e("option",{children:i},l))}),r("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:x,value:t.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col",children:e("div",{className:"-my-2 overflow-x-auto rounded ",children:r("div",{className:"inline-block min-w-full py-2 align-middle ",children:[r(a,{children:[e(a.Thead,{children:r(a.Tr,{children:[e(a.Th,{children:"#"}),e(a.Th,{children:"Tanggal Kejadian"}),e(a.Th,{children:"Tanggal Perbaikan"}),r(a.Th,{width:"w-96",onClick:()=>c("keterangan"),children:["Keterangan Manajer Risiko",t.field=="keterangan"&&t.direction=="asc"&&e(m,{}),t.field=="keterangan"&&t.direction=="desc"&&e(u,{})]}),r(a.Th,{width:"w-96",onClick:()=>c("sebab"),children:["Sebab",t.field=="sebab"&&t.direction=="asc"&&e(m,{}),t.field=="sebab"&&t.direction=="desc"&&e(u,{})]}),r(a.Th,{onClick:()=>c("pic_id"),children:["Penanggung Jawab",t.field=="pic_id"&&t.direction=="asc"&&e(m,{}),t.field=="pic_id"&&t.direction=="desc"&&e(u,{})]}),r(a.Th,{onClick:()=>c("user_id"),children:["Pemilik Risiko",t.field=="user_id"&&t.direction=="asc"&&e(m,{}),t.field=="user_id"&&t.direction=="desc"&&e(u,{})]})]})}),e(a.Tbody,{children:p.map((i,l)=>r("tr",{className:o===l?"bg-sky-100  cursor-pointer":"cursor-pointer text-red-500 bg-red-50",onClick:()=>O(l),children:[e(a.Td,{children:e(U,{children:f.from+l})}),e(a.Td,{children:J(i.created_at).format("YYYY-MM-DD")}),e(a.Td,{children:i.requestupdate?i.requestupdate.tgl_perbaikan:"Belum Perbaikan"}),e(a.Td,{children:i.requestupdateverificationmanagement?i.requestupdateverificationmanagement.keterangan:"Belum Verifikasi"}),e(a.Td,{children:i.sebab}),e(a.Td,{children:i.pic.name}),e(a.Td,{children:i.user.name})]},l))})]}),e(Y,{meta:f})]})})})]})})]})}H.layout=n=>e(F,{children:n});export{H as default};