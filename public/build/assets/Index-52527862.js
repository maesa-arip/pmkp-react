import{_ as V,r,l as k,g as z,j as n,F as K,a as e,n as L}from"./app-1038bb6b.js";import{A}from"./App-07f7af8f.js";import{E as R}from"./EditModal-b7b65fc3.js";import E from"./Edit-ac9b44cd.js";import{T as i,B as F,P as Y}from"./Badge-8f95f918.js";import{T as _}from"./ThirdButton-e322090a.js";import{h as $}from"./moment-fbc5633a.js";import"./ApplicationLogo-fc6cdd5c.js";import"./transition-2b01b312.js";import"./render-b9239f49.js";import"./index-10befd76.js";import"./dialog-595f33a1.js";import"./keyboard-35feee05.js";import"./use-watch-f2621019.js";import"./description-5d937243.js";import"./use-outside-click-e43918be.js";import"./TextInput-a9e4401d.js";import"./ComboboxMultiple-afe5462f.js";import"./clsx-7dec7295.js";import"./index-05532e36.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-29b3ebc1.js";import"./BPKP-dff8a388.js";import"./InputLabel-02f5d61f.js";import"./PrimaryButton-cf4a4968.js";import"./SecondaryButton-34683c81.js";import"./LarsDHPKlinis-79362102.js";import"./LarsDHPNonKlinis-46a8f810.js";import"./use-resolve-button-type-3fab24d6.js";import"./Form-0c327bb0.js";import"./InputError-d08426c8.js";import"./RadioCard-3315a01b.js";import"./use-tree-walker-b7423e69.js";import"./use-controllable-a34d8bb0.js";import"./TextAreaInput-0b26f18f.js";import"./TextInputWithError-d4c558b6.js";const h=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),g=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function H(l){const{data:c,meta:f,filtered:C,attributes:d}=l.riskRegisterKlinis;V().props;let b={riskCategories:l.riskCategories,identificationSources:l.identificationSources,locations:l.locations,riskVarieties:l.riskVarieties,riskTypes:l.riskTypes,pics:l.pics,impactValues:l.impactValues,probabilityValues:l.probabilityValues,controlValues:l.controlValues,indikatorFitur04s:l.indikatorFitur04s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}]};const[D,U]=r.useState([]),[a,w]=r.useState(C),[j,q]=r.useState(!0),B=r.useCallback(k.debounce(t=>{z.get(route("requeststatus"),{...k.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);r.useEffect(()=>{j?q(!1):B(a)},[a]),r.useEffect(()=>{let t=[];for(let s=d.per_page;s<d.total/d.per_page;s=s+d.per_page)t.push(s);U(t)},[]);const x=t=>{const s={...a,[t.target.name]:t.target.value,page:1};w(s)},u=t=>{w({...a,field:t,direction:a.direction=="asc"?"desc":"asc"})},P=t=>{y(t),m(!0)},I=t=>{y(t),M(t),p(!0)};r.useState(!1);const[S,m]=r.useState(!1);r.useState(!1);const[v,p]=r.useState(!1),[T,y]=r.useState([]),[o,N]=r.useState(null),[J,M]=r.useState(null),O=t=>{N(o===t?null:t)};return n(K,{children:[e(L,{title:"Update Status"}),e(R,{isOpenEditDialog:S,setIsOpenEditDialog:m,size:"max-w-4xl",title:"Update Status",children:e(E,{model:T,ShouldMap:b,isOpenEditDialog:S,setIsOpenEditDialog:m})}),e(R,{isOpenEditDialog:v,setIsOpenEditDialog:p,size:"max-w-6xl",title:"Update Status",children:e(E,{model:T,ShouldMap:b,isOpenEditDialog:v,setIsOpenEditDialog:p})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:n("div",{className:"mx-auto sm:px-6 lg:px-8",children:[e("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:"UPDATE STATUS"}),n("div",{className:"flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg",children:[e("div",{className:"w-3/4",children:n("div",{className:"flex items-center justify-start py-2 mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-2",children:[e(_,{color:o===null?"gray":"teal",type:"button",className:`${o===null?"cursor-not-allowed":""}`,onClick:()=>{if(o!==null){const t=c[o];P(t)}},disabled:o===null,children:"Lihat History"}),e(_,{color:o===null?"gray":"cyan",type:"button",className:`${o===null?"cursor-not-allowed":""}`,onClick:()=>{if(o!==null){const t=c[o];I(t)}},disabled:o===null,children:"Update Status"})]})}),e("div",{className:"w-1/4",children:n("div",{className:"flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap",children:[e("select",{name:"load",id:"load",onChange:x,value:a.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:D.map((t,s)=>e("option",{children:t},s))}),n("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:x,value:a.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col",children:e("div",{className:"-my-2 overflow-x-auto rounded ",children:n("div",{className:"inline-block min-w-full py-2 align-middle ",children:[n(i,{children:[e(i.Thead,{children:n(i.Tr,{children:[e(i.Th,{children:"#"}),e(i.Th,{children:"Tanggal Kejadian"}),e(i.Th,{children:"Tanggal Perbaikan"}),e(i.Th,{children:"Tanggal Update Status"}),n(i.Th,{width:"w-96",onClick:()=>u("sebab"),children:["Sebab",a.field=="sebab"&&a.direction=="asc"&&e(h,{}),a.field=="sebab"&&a.direction=="desc"&&e(g,{})]}),n(i.Th,{onClick:()=>u("pic_id"),children:["Penanggung Jawab",a.field=="pic_id"&&a.direction=="asc"&&e(h,{}),a.field=="pic_id"&&a.direction=="desc"&&e(g,{})]}),n(i.Th,{onClick:()=>u("user_id"),children:["Pemilik Risiko",a.field=="user_id"&&a.direction=="asc"&&e(h,{}),a.field=="user_id"&&a.direction=="desc"&&e(g,{})]})]})}),e(i.Tbody,{children:c.map((t,s)=>n("tr",{className:o===s?"bg-sky-100  cursor-pointer":"cursor-pointer text-red-500 bg-red-50",onClick:()=>O(s),children:[e(i.Td,{children:e(F,{children:f.from+s})}),e(i.Td,{children:$(t.created_at).format("YYYY-MM-DD")}),e(i.Td,{children:t.requestupdate?t.requestupdate.tgl_perbaikan:"Belum Perbaikan"}),e(i.Td,{children:t.requestupdate&&t.requestupdate.is_approved==1?t.requestupdate.tgl_update_status:"Belum Update Status"}),e(i.Td,{children:t.sebab}),e(i.Td,{children:t.pic.name}),e(i.Td,{children:t.user.name})]},s))})]}),e(Y,{meta:f})]})})})]})})]})}H.layout=l=>e(A,{children:l});export{H as default};
