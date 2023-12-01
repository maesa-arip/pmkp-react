import{K as I,r,_ as p,j as o,a as e}from"./app-e63dc518.js";import{I as d}from"./InputLabel-85eaffe7.js";import{P as E}from"./PrimaryButton-0019f275.js";import{S as M}from"./SecondaryButton-eba774a1.js";import"./TextInput-6ffa0885.js";import{t as f}from"./index-0d401196.js";/* empty css                         */import{C as j}from"./ComboboxMultipleWithOutSemuaUnit-d8710cf1.js";import"./defineProperty-8250cd14.js";import"./clsx-bc91b332.js";function q({setIsOpenAddDialog:c}){const{data:m,setData:s,post:U,reset:B,errors:P,processing:K}=I({name:""}),g=t=>c(!1),[h,x]=r.useState(""),[b,y]=r.useState(""),[w,v]=r.useState(null),[k,i]=r.useState(!1),D=t=>{t.preventDefault();const a="/ikpdatainsiden",C={startDate:h,endDate:b,userId:w};i(!0),axios.post(a,C,{responseType:"blob"}).then(l=>{const L=window.URL.createObjectURL(new Blob([l.data])),n=document.createElement("a");n.href=L,n.setAttribute("download","Form IKP Data Insiden.xlsx"),document.body.appendChild(n),n.click(),n.remove(),c(!1),i(!1)}).catch(l=>{console.error(l),i(!1)})},{users:N}=p().props,{auth:T,permissionNames:u}=p().props,S=u?u.map(t=>t.name):"null";return o("form",{onSubmit:D,children:[e("div",{className:"px-4 py-5 bg-white sm:p-6",children:o("div",{className:"grid grid-cols-12 gap-6",children:[o("div",{className:"col-span-12 px-3 py-4 text-base font-semibold text-gray-700 rounded shadow",children:[o("svg",{xmlns:"http://www.w3.org/2000/svg",className:"justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("circle",{cx:12,cy:12,r:9}),e("line",{x1:12,y1:8,x2:"12.01",y2:8}),e("polyline",{points:"11 12 12 12 12 16 13 16"})]}),"Kosongkan Tanggal dan Langsung Tekan Export Jika Ingin Export Data Dari Awal Sampai Sekarang."]}),o("div",{className:"col-span-6",children:[e(d,{className:"text-base font-semibold",for:"startDate",value:"Start Date"}),e(f,{dateFormat:"dd-MM-yyyy",value:m.startDate,id:"startDate",name:"startDate",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:t=>{x(t);const a=new Date(t).toLocaleDateString("en-CA");s("startDate",a)}})]}),o("div",{className:"col-span-6",children:[e(d,{className:"text-base font-semibold",for:"endDate",value:"End Date"}),e(f,{dateFormat:"dd-MM-yyyy",value:m.endDate,id:"endDate",name:"endDate",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:t=>{y(t);const a=new Date(t).toLocaleDateString("en-CA");s("endDate",a)}})]}),S.indexOf("lihat semua data ikp")>-1&&o("div",{className:"col-span-12",children:[e(d,{className:"text-base font-semibold",for:"Pilih Unit",value:"Pilih Unit"}),o("div",{className:"col-span-12 px-3 py-4 mb-2 text-base font-semibold text-gray-700 border rounded",children:[o("svg",{xmlns:"http://www.w3.org/2000/svg",className:"justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("circle",{cx:12,cy:12,r:9}),e("line",{x1:12,y1:8,x2:"12.01",y2:8}),e("polyline",{points:"11 12 12 12 12 16 13 16"})]}),"Kosongkan dan Langsung Tekan Export Jika Ingin Menarik Semua Unit."]}),e(j,{ShouldMap:N,name:"userId",onChange:t=>{v(t),s("userId",t)},defaultValues:[]})]})]})}),o("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[k?e("button",{className:"inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md cursor-not-allowed hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",disabled:!0,children:"Exporting..."}):e(E,{children:"Export"}),e(M,{className:"mx-2",onClick:g,children:"Close"})]})]})}export{q as default};