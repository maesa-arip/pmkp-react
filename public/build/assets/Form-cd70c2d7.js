import{r,j as u,F as o,a as i}from"./app-5ba167e0.js";import{S as x}from"./SecondaryButton-23fdfd20.js";import"./TextAreaInput-f4f961bc.js";import"./TextInput-d5866385.js";/* empty css                         */function _({errors:m,submit:b,data:a,setData:d,ShouldMap:s,model:t,closeButton:l}){var c;const n=[{name:""}];return r.useState(()=>t?s.proses.find(e=>e.id===t.proses_id):n[0]),r.useState(()=>t?s.currently.find(e=>e.id===t.currently_id):n[0]),r.useState(()=>t?s.riskCategories.find(e=>e.id===t.risk_category_id):n[0]),r.useState(()=>t?s.identificationSources.find(e=>e.id===t.identification_source_id):n[0]),r.useState(()=>t?s.locations.find(e=>e.id===t.location_id):n[0]),r.useState(()=>t?s.riskVarieties.find(e=>e.id===t.risk_variety_id):n[0]),r.useState(()=>t?s.riskTypes.find(e=>e.id===t.risk_type_id):n[0]),r.useState(()=>t?s.impactValues.find(e=>e.id===t.osd1_dampak):n[0]),r.useState(()=>t?s.probabilityValues.find(e=>e.id===t.osd1_probabilitas):n[0]),r.useState(()=>t?s.controlValues.find(e=>e.id===t.osd1_controllability):n[0]),r.useState(()=>t?s.impactValues.find(e=>e.id===t.osd2_dampak):n[0]),r.useState(()=>t?s.probabilityValues.find(e=>e.id===t.osd2_probabilitas):n[0]),r.useState(()=>t?s.controlValues.find(e=>e.id===t.osd2_controllability):n[0]),r.useState(()=>t?s.pics.find(e=>e.id===t.pic_id):n[0]),r.useState(()=>t?s.indikatorFitur04s.find(e=>e.id===t.indikator_fitur04_id):n[0]),r.useState(()=>t?s.pengawasan.find(e=>e.id===t.pengawasan_id):n[0]),r.useEffect(()=>{d({...a,pernyataan_risiko:"Karena "+a.sebab+" Kemungkinan "+a.resiko+" Sehingga "+a.dampak})},[a.sebab,a.resiko,a.dampak]),r.useState(null),r.useState(null),u(o,{children:[i("div",{className:"px-4 py-5 bg-white sm:p-6",children:i("div",{className:"px-2 py-12 bg-white border rounded-xl",children:i("div",{className:"mx-auto sm:px-6 lg:px-8",children:u("div",{children:[i("h3",{className:"mb-6 ml-3 text-2xl font-bold text-gray-700",children:"History"}),u("ol",{children:[(c=a.risk_register_histories)==null?void 0:c.map((e,f)=>i("li",{className:"border-l-2 border-sky-600",children:u("div",{className:"md:flex flex-start",children:[i("div",{className:"bg-sky-600 w-6 h-6 flex items-center justify-center rounded-full -ml-3.5",children:i("svg",{"aria-hidden":"true",focusable:"false","data-prefix":"fas",className:"w-3 h-3 text-white",role:"img",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 448 512",children:i("path",{fill:"currentColor",d:"M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm64-192c0-8.8 7.2-16 16-16h288c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16v-64zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"})})}),u("div",{className:"block max-w-xl p-6 mb-10 ml-6 bg-white rounded-lg shadow-lg",children:[u("div",{className:"flex justify-between mb-4",children:[i("a",{href:"#!",className:"text-sm font-medium transition duration-300 ease-in-out text-sky-600 hover:text-sky-700 focus:text-sky-800",children:e.currently_id==1?u("span",{className:"px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-red-500 bg-red-50 rounded-full",children:["KEJADIAN di ",a.user_name]}):i("span",{className:"px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-green-500 bg-green-50 rounded-full",children:e.created_at==a.created_at?"RISIKO BARU DIBUAT":"SELESAI PERBAIKAN di"+a.user_name})}),i("a",{href:"#!",className:"text-sm font-medium transition duration-300 ease-in-out text-sky-600 hover:text-sky-700 focus:text-sky-800",children:new Date(e.created_at).toLocaleString("id","ID")})]}),i("p",{className:"mb-6 text-gray-700",children:a.pernyataan_risiko}),u("button",{type:"button",className:"inline-block text-justify px-4 py-1.5 bg-sky-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-sky-700 hover:shadow-lg focus:bg-sky-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-sky-800 active:shadow-lg transition duration-150 ease-in-out","data-mdb-ripple":"true",children:["SEBAB : ",a.sebab]})]})]})},f)),i("li",{className:"border-l-2 border-emerald-600",children:i("div",{className:"md:flex flex-start",children:i("div",{className:"bg-emerald-600 w-6 h-6 flex items-center justify-center rounded-full -ml-3.5"})})})]})]})})})}),i("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:i(x,{className:"mx-2",onClick:l,children:"Close"})})]})}export{_ as default};
