import{r as d,a as t,K as U,_ as D,j as a}from"./app-a515daf2.js";import{I as f}from"./InputLabel-2a3bf0b1.js";import{P as B}from"./PrimaryButton-8cbe1ff8.js";import{S as P}from"./SecondaryButton-f2acca44.js";import"./TextInput-673b07f1.js";import{H as C}from"./index-b144b202.js";import{S as R,c as L,i as F}from"./ComboboxMultiple-d7c6d3b8.js";const A=F(),h={base:"border rounded-md bg-white hover:cursor-pointer",focus:"border-primary-600 ring-1 ring-primary-500",nonFocus:"border-gray-300 hover:border-gray-400"},T="text-gray-500 pl-1 py-0.5",K="pl-1 py-0.5",W="p-1 gap-1",z="leading-7 ml-1",J="bg-gray-200 rounded items-center py-0.5 pl-2 pr-1 px-0.5",_="leading-6 py-0.5",$="border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md",q="p-1 gap-1",G="text-gray-500 p-1 rounded-md hover:bg-red-50 hover:text-red-800",Q="bg-gray-300",X="p-1 mt-2 border border-gray-200 bg-white rounded-lg",Y="ml-3 mt-2 mb-1 text-gray-500 text-sm",x={base:"hover:cursor-pointer px-3 py-2 rounded",focus:"bg-yellow-100 active:bg-yellow-200",selected:"after:content-['✔'] after:ml-2 after:text-green-500 text-gray-500"},Z="text-gray-500 p-2 bg-gray-50 border border-dashed border-gray-200 rounded-sm";function ee({ShouldMap:c,name:u,onChange:s,defaultValues:v}){const[m,w]=d.useState([...c.map(e=>({value:e.id.toString(),label:e.name,isDisabled:!1}))]),S=e=>{const r=m.map(n=>n.value===0|n.value==="0"?{...n,isDisabled:!1}:{...n,isDisabled:e.some(p=>p.value===0|p.value==="0")});w(r),s(e.map(n=>n.value).join(","))},g=v.map(e=>m.find(r=>r.value===e));return t(R,{closeMenuOnSelect:!1,components:A,isMulti:!0,options:m,defaultValue:g,onChange:S,name:u,unstyled:!0,styles:{input:e=>({...e,"input:focus":{boxShadow:"none"}}),multiValueLabel:e=>({...e,textOverflow:"clip"}),control:e=>({...e,transition:"none"})},classNames:{control:({isFocused:e})=>L(e?h.focus:h.nonFocus,h.base),placeholder:()=>T,input:()=>K,valueContainer:()=>W,singleValue:()=>z,multiValue:()=>J,multiValueLabel:()=>_,multiValueRemove:()=>$,indicatorsContainer:()=>q,clearIndicator:()=>G,indicatorSeparator:()=>Q,menu:()=>X,groupHeading:()=>Y,option:({isFocused:e,isSelected:r})=>L(e&&x.focus,r&&x.selected,x.base),noOptionsMessage:()=>Z}})}function de({setIsOpenAddDialog:c}){const{data:u,setData:s,post:v,reset:m,errors:w,processing:S}=U({name:""}),g=o=>c(!1),[e,r]=d.useState(""),[n,p]=d.useState(""),[N,M]=d.useState(null),[V,b]=d.useState(!1),j=o=>{o.preventDefault();const l="/riskregisterklinislarsdhp",H={startDate:e,endDate:n,userId:N};b(!0),axios.post(l,H,{responseType:"blob"}).then(y=>{const O=window.URL.createObjectURL(new Blob([y.data])),i=document.createElement("a");i.href=O,i.setAttribute("download","Form Manajemen Risiko LARS DHP.xlsx"),document.body.appendChild(i),i.click(),i.remove(),c(!1),b(!1)}).catch(y=>{console.error(y),b(!1)})},{users:E}=D().props,{auth:te,permissionNames:k}=D().props,I=k?k.map(o=>o.name):"null";return a("form",{onSubmit:j,children:[t("div",{className:"px-4 py-5 bg-white sm:p-6",children:a("div",{className:"grid grid-cols-12 gap-6",children:[a("div",{className:"col-span-12 px-3 py-4 text-base font-semibold text-gray-700 border rounded",children:[a("svg",{xmlns:"http://www.w3.org/2000/svg",className:"justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[t("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),t("circle",{cx:12,cy:12,r:9}),t("line",{x1:12,y1:8,x2:"12.01",y2:8}),t("polyline",{points:"11 12 12 12 12 16 13 16"})]}),"Kosongkan Tanggal dan Langsung Tekan Export Jika Ingin Export Data Dari Awal Sampai Sekarang."]}),a("div",{className:"col-span-6",children:[t(f,{className:"text-base font-semibold",for:"Start Date",value:"Start Date"}),t(C,{dateFormat:"dd-MM-yyyy",value:u.startDate,id:"startDate",name:"startDate",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:o=>{r(o);const l=new Date(o).toLocaleDateString("en-CA");s("startDate",l)}})]}),a("div",{className:"col-span-6",children:[t(f,{className:"text-base font-semibold",for:"End Date",value:"End Date"}),t(C,{dateFormat:"dd-MM-yyyy",value:u.endDate,id:"endDate",name:"endDate",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:o=>{p(o);const l=new Date(o).toLocaleDateString("en-CA");s("endDate",l)}})]}),I.indexOf("lihat data semua risk register")>-1&&a("div",{className:"col-span-12",children:[t(f,{className:"text-base font-semibold",for:"Pilih Unit",value:"Pilih Unit"}),a("div",{className:"col-span-12 px-3 py-4 mb-2 text-base font-semibold text-gray-700 border rounded",children:[a("svg",{xmlns:"http://www.w3.org/2000/svg",className:"justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[t("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),t("circle",{cx:12,cy:12,r:9}),t("line",{x1:12,y1:8,x2:"12.01",y2:8}),t("polyline",{points:"11 12 12 12 12 16 13 16"})]}),"Kosongkan dan Langsung Tekan Export Jika Ingin Menarik Semua Unit."]}),t(ee,{ShouldMap:E,name:"userId",onChange:o=>{M(o),s("userId",o)},defaultValues:[]})]})]})}),a("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[V?t("button",{className:"inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md cursor-not-allowed hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",disabled:!0,children:"Exporting..."}):t(B,{children:"Export"}),t(P,{className:"mx-2",onClick:g,children:"Close"})]})]})}export{de as default};
