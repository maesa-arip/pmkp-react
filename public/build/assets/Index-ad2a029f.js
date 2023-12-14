import{_ as V,r as s,l as k,g as z,j as o,F as K,a as e,n as L}from"./app-c54a562f.js";import{A}from"./App-8f5b7328.js";import{E as R}from"./EditModal-b0bd5f28.js";import E from"./Edit-0724b36f.js";import{T as i,B as F,P as Y}from"./Badge-ab71176c.js";import{T as _}from"./ThirdButton-af9e526b.js";import{h as $}from"./moment-fbc5633a.js";import"./ApplicationLogo-d2655cb8.js";import"./transition-9c757782.js";import"./render-66fc26f7.js";import"./index-888b2fed.js";import"./use-tracked-pointer-301018c3.js";import"./keyboard-70b1741c.js";import"./use-outside-click-eb6d816f.js";import"./use-tree-walker-30f59ca8.js";import"./use-controllable-650a6236.js";import"./use-watch-b3d15d4e.js";import"./dialog-cfbecf4e.js";import"./description-d5b73d4c.js";import"./TextInput-0606da2e.js";import"./ComboboxMultiple-272d2f73.js";import"./clsx-0be47f47.js";import"./inheritsLoose-c4a937f7.js";import"./createClass-1dd8160f.js";import"./defineProperty-741a9c8e.js";/* empty css                         */import"./ComboboxMultipleWithOutSemuaUnit-f23b6ea5.js";import"./BPKP-e8cbf9bc.js";import"./InputLabel-c3873a4b.js";import"./PrimaryButton-24baa18d.js";import"./SecondaryButton-155c8c96.js";import"./index-04bdfb58.js";import"./ComboboxMultiple copy-f32a3ef7.js";import"./ComboboxPage-44137921.js";import"./LarsDHPKlinis-f483660a.js";import"./LarsDHPNonKlinis-ddac879a.js";import"./SedangTerjadi-0540810f.js";import"./IKPDataInsiden-72b6f67d.js";import"./IKPDataEvaluasi-a8cf3186.js";import"./Form-ff996e39.js";import"./InputError-80a9159c.js";import"./RadioCard-d6ccf2e0.js";import"./TextAreaInput-2720a1db.js";import"./TextInputWithError-4013c962.js";const h=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",clipRule:"evenodd"})}),g=()=>e("svg",{className:"w-5 h-5 text-gray-500",fill:"currentColor",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",children:e("path",{fillRule:"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",clipRule:"evenodd"})});function H(l){const{data:c,meta:f,filtered:C,attributes:d}=l.riskRegisterKlinis;V().props;let b={riskCategories:l.riskCategories,identificationSources:l.identificationSources,locations:l.locations,riskVarieties:l.riskVarieties,riskTypes:l.riskTypes,pics:l.pics,impactValues:l.impactValues,probabilityValues:l.probabilityValues,controlValues:l.controlValues,indikatorFitur04s:l.indikatorFitur04s,proses:[{id:1,name:"Mulai"},{id:2,name:"Dalam Proses"},{id:3,name:"Selesai"},{id:4,name:"Ditangani"}],type:[{id:1,name:"Klinis"},{id:2,name:"Non Klinis"}],currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}],pengawasan:[{id:1,name:"Sudah dilaksanakan"},{id:2,name:"Belum dilaksanakan"}]};const[D,U]=s.useState([]),[a,w]=s.useState(C),[j,q]=s.useState(!0),B=s.useCallback(k.debounce(t=>{z.get(route("requeststatus"),{...k.pickBy(t),page:t.page},{preserveState:!0,preserveScroll:!0})},150),[]);s.useEffect(()=>{j?q(!1):B(a)},[a]),s.useEffect(()=>{let t=[];for(let r=d.per_page;r<d.total/d.per_page;r=r+d.per_page)t.push(r);U(t)},[]);const x=t=>{const r={...a,[t.target.name]:t.target.value,page:1};w(r)},u=t=>{w({...a,field:t,direction:a.direction=="asc"?"desc":"asc"})},P=t=>{y(t),m(!0)},I=t=>{y(t),M(t),p(!0)};s.useState(!1);const[S,m]=s.useState(!1);s.useState(!1);const[v,p]=s.useState(!1),[T,y]=s.useState([]),[n,N]=s.useState(null),[J,M]=s.useState(null),O=t=>{N(n===t?null:t)};return o(K,{children:[e(L,{title:"Update Status"}),e(R,{isOpenEditDialog:S,setIsOpenEditDialog:m,size:"max-w-4xl",title:"Update Status",children:e(E,{model:T,ShouldMap:b,isOpenEditDialog:S,setIsOpenEditDialog:m})}),e(R,{isOpenEditDialog:v,setIsOpenEditDialog:p,size:"max-w-6xl",title:"Update Status",children:e(E,{model:T,ShouldMap:b,isOpenEditDialog:v,setIsOpenEditDialog:p})}),e("div",{className:"px-2 py-12 bg-white border rounded-xl",children:o("div",{className:"mx-auto sm:px-6 lg:px-8",children:[e("p",{className:"flex items-center justify-center py-3 font-semibold text-gray-500 bg-white border rounded-lg",children:"UPDATE STATUS"}),o("div",{className:"flex items-center justify-between pb-1.5 mt-2 mb-2 rounded-lg",children:[e("div",{className:"w-3/4",children:o("div",{className:"flex items-center justify-start py-2 mt-2 mb-0 mr-4 overflow-auto whitespace-nowrap gap-x-2",children:[e(_,{color:n===null?"gray":"teal",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=c[n];P(t)}},disabled:n===null,children:"Lihat History"}),e(_,{color:n===null?"gray":"cyan",type:"button",className:`${n===null?"cursor-not-allowed":""}`,onClick:()=>{if(n!==null){const t=c[n];I(t)}},disabled:n===null,children:"Update Status"})]})}),e("div",{className:"w-1/4",children:o("div",{className:"flex items-center justify-end mt-2 mb-0 overflow-auto gap-x-1 whitespace-nowrap",children:[e("select",{name:"load",id:"load",onChange:x,value:a.load,className:"transition duration-150 ease-in-out border-gray-300 rounded-lg focus:ring-blue-200 focus:ring form-select",children:D.map((t,r)=>e("option",{children:t},r))}),o("div",{className:"flex items-center px-2 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-lg gap-x-2 focus-within:border-blue-400 focus-within:ring-blue-200 focus-within:ring",children:[e("svg",{className:"inline w-5 h-5 text-gray-500",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:e("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),e("input",{type:"text",autoComplete:"off",name:"q",id:"q",onChange:x,value:a.q,className:"w-full border-0 focus:ring-0 form-text"})]})]})})]}),e("div",{className:"flex flex-col",children:e("div",{className:"-my-2 overflow-x-auto rounded ",children:o("div",{className:"inline-block min-w-full py-2 align-middle ",children:[o(i,{children:[e(i.Thead,{children:o(i.Tr,{children:[e(i.Th,{children:"#"}),e(i.Th,{children:"Tanggal Kejadian"}),e(i.Th,{children:"Tanggal Perbaikan"}),e(i.Th,{children:"Tanggal Update Status"}),o(i.Th,{width:"w-96",onClick:()=>u("sebab"),children:["Sebab",a.field=="sebab"&&a.direction=="asc"&&e(h,{}),a.field=="sebab"&&a.direction=="desc"&&e(g,{})]}),o(i.Th,{onClick:()=>u("pic_id"),children:["Penanggung Jawab",a.field=="pic_id"&&a.direction=="asc"&&e(h,{}),a.field=="pic_id"&&a.direction=="desc"&&e(g,{})]}),o(i.Th,{onClick:()=>u("user_id"),children:["Pemilik Risiko",a.field=="user_id"&&a.direction=="asc"&&e(h,{}),a.field=="user_id"&&a.direction=="desc"&&e(g,{})]})]})}),e(i.Tbody,{children:c.map((t,r)=>o("tr",{className:n===r?"bg-sky-100  cursor-pointer":"cursor-pointer text-red-500 bg-red-50",onClick:()=>O(r),children:[e(i.Td,{children:e(F,{children:f.from+r})}),e(i.Td,{children:$(t.created_at).format("YYYY-MM-DD")}),e(i.Td,{children:t.requestupdate?t.requestupdate.tgl_perbaikan:"Belum Perbaikan"}),e(i.Td,{children:t.requestupdate&&t.requestupdate.is_approved==1?t.requestupdate.tgl_update_status:"Belum Update Status"}),e(i.Td,{children:t.sebab}),e(i.Td,{children:t.pic.name}),e(i.Td,{children:t.user.name})]},r))})]}),e(Y,{meta:f})]})})})]})})]})}H.layout=l=>e(A,{children:l});export{H as default};