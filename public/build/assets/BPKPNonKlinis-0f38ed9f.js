import{K as D,r as i,j as o,a as e}from"./app-99bb4a53.js";import{I as m}from"./InputLabel-48032b59.js";import{P as v}from"./PrimaryButton-548e7e96.js";import{S as k}from"./SecondaryButton-9528e751.js";import"./TextInput-92e9744a.js";import{H as u}from"./index-4b5dfbe4.js";function F({setIsOpenAddDialog:l}){const{data:d,setData:c,post:N,reset:S,errors:L,processing:C}=D({name:""}),f=t=>l(!1),[g,p]=i.useState(""),[b,h]=i.useState(""),[x,r]=i.useState(!1);return o("form",{onSubmit:t=>{t.preventDefault();const a="/riskregisternonklinisbpkp",y={startDate:g,endDate:b};r(!0),axios.post(a,y,{responseType:"blob"}).then(s=>{const w=window.URL.createObjectURL(new Blob([s.data])),n=document.createElement("a");n.href=w,n.setAttribute("download","Form Manajemen Risiko BPKP Non Klinis.xlsx"),document.body.appendChild(n),n.click(),n.remove(),l(!1),r(!1)}).catch(s=>{console.error(s),r(!1)})},children:[e("div",{className:"px-4 py-5 bg-white sm:p-6",children:o("div",{className:"grid grid-cols-12 gap-6",children:[o("div",{className:"col-span-12 px-3 py-4 text-base font-semibold text-gray-700 rounded shadow",children:[o("svg",{xmlns:"http://www.w3.org/2000/svg",className:"justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("circle",{cx:12,cy:12,r:9}),e("line",{x1:12,y1:8,x2:"12.01",y2:8}),e("polyline",{points:"11 12 12 12 12 16 13 16"})]}),"Kosongkan Tanggal dan Langsung Tekan Export Jika Ingin Export Data Dari Awal Sampai Sekarang."]}),o("div",{className:"col-span-6",children:[e(m,{className:"text-base font-semibold",for:"startDate",value:"Start Date"}),e(u,{dateFormat:"dd-MM-yyyy",value:d.startDate,id:"startDate",name:"startDate",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:t=>{p(t);const a=new Date(t).toLocaleDateString("en-CA");c("startDate",a)}})]}),o("div",{className:"col-span-6",children:[e(m,{className:"text-base font-semibold",for:"endDate",value:"End Date"}),e(u,{dateFormat:"dd-MM-yyyy",value:d.endDate,id:"endDate",name:"endDate",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:t=>{h(t);const a=new Date(t).toLocaleDateString("en-CA");c("endDate",a)}})]})]})}),o("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[x?e("button",{className:"inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md cursor-not-allowed hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",disabled:!0,children:"Exporting..."}):e(v,{children:"Export"}),e(k,{className:"mx-2",onClick:f,children:"Close"})]})]})}export{F as default};
