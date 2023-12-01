import{K,r,_ as g,j as o,a as e}from"./app-e63dc518.js";import{I as s}from"./InputLabel-85eaffe7.js";import{P}from"./PrimaryButton-0019f275.js";import{S as T}from"./SecondaryButton-eba774a1.js";import"./TextInput-6ffa0885.js";import{t as f}from"./index-0d401196.js";import"./ComboboxMultiple-660ff063.js";/* empty css                         */import{C as U}from"./ComboboxMultipleWithOutSemuaUnit-d8710cf1.js";import{C as B}from"./ComboboxPage-b6ce5bc8.js";import"./defineProperty-8250cd14.js";import"./clsx-bc91b332.js";import"./use-tracked-pointer-b056eebf.js";import"./render-d70bc49e.js";import"./keyboard-447131b1.js";import"./use-outside-click-bb6a6fc0.js";import"./use-tree-walker-217dc56f.js";import"./use-controllable-a3dfb2af.js";import"./transition-f8d58bb7.js";import"./use-watch-8712103b.js";function se({setIsOpenAddDialog:m}){const{data:l,setData:i,post:I,reset:H,errors:_,processing:A}=K({name:""}),h=t=>m(!1),[x,b]=r.useState(""),[y,w]=r.useState(""),[k,v]=r.useState(null),[D,d]=r.useState(!1),[u,S]=r.useState([]),N=t=>{t.preventDefault();const n="/riskregisterklinislarsdhp",M={startDate:x,endDate:y,userId:k,currently_id:u};d(!0),axios.post(n,M,{responseType:"blob"}).then(c=>{const E=window.URL.createObjectURL(new Blob([c.data])),a=document.createElement("a");a.href=E,a.setAttribute("download","Form Manajemen Risiko Klinis LARS DHP.xlsx"),document.body.appendChild(a),a.click(),a.remove(),m(!1),d(!1)}).catch(c=>{console.error(c),d(!1)})};let C={currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"}]};const{users:L}=g().props,{auth:R,permissionNames:p}=g().props,j=p?p.map(t=>t.name):"null";return o("form",{onSubmit:N,children:[e("div",{className:"px-4 py-5 bg-white sm:p-6",children:o("div",{className:"grid grid-cols-12 gap-6",children:[o("div",{className:"col-span-12 px-3 py-4 text-base font-semibold text-gray-700 border rounded",children:[o("svg",{xmlns:"http://www.w3.org/2000/svg",className:"justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("circle",{cx:12,cy:12,r:9}),e("line",{x1:12,y1:8,x2:"12.01",y2:8}),e("polyline",{points:"11 12 12 12 12 16 13 16"})]}),"Kosongkan Tanggal dan Langsung Tekan Export Jika Ingin Export Data Dari Awal Sampai Sekarang."]}),o("div",{className:"col-span-6",children:[e(s,{className:"text-base font-semibold",for:"Start Date",value:"Start Date"}),e(f,{dateFormat:"dd-MM-yyyy",value:l.startDate,id:"startDate",name:"startDate",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:t=>{b(t);const n=new Date(t).toLocaleDateString("en-CA");i("startDate",n)}})]}),o("div",{className:"col-span-6",children:[e(s,{className:"text-base font-semibold",for:"End Date",value:"End Date"}),e(f,{dateFormat:"dd-MM-yyyy",value:l.endDate,id:"endDate",name:"endDate",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:t=>{w(t);const n=new Date(t).toLocaleDateString("en-CA");i("endDate",n)}})]}),o("div",{className:"col-span-12",children:[e(s,{className:"text-base font-semibold",for:"Pilih Kejadian",value:"Pilih Kejadian"}),o("div",{className:"col-span-12 px-3 py-4 mb-2 text-base font-semibold text-gray-700 border rounded",children:[o("svg",{xmlns:"http://www.w3.org/2000/svg",className:"justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("circle",{cx:12,cy:12,r:9}),e("line",{x1:12,y1:8,x2:"12.01",y2:8}),e("polyline",{points:"11 12 12 12 12 16 13 16"})]}),"Kosongkan dan Langsung Tekan Export Jika Ingin Menarik Semua Kejadian."]}),e(B,{ShouldMap:C.currently,selected:u,onChange:t=>{i({...l,currently_id:t.id}),S(t)}})]}),j.indexOf("lihat data semua risk register")>-1&&o("div",{className:"col-span-12",children:[e(s,{className:"text-base font-semibold",for:"Pilih Unit",value:"Pilih Unit"}),o("div",{className:"col-span-12 px-3 py-4 mb-2 text-base font-semibold text-gray-700 border rounded",children:[o("svg",{xmlns:"http://www.w3.org/2000/svg",className:"justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("circle",{cx:12,cy:12,r:9}),e("line",{x1:12,y1:8,x2:"12.01",y2:8}),e("polyline",{points:"11 12 12 12 12 16 13 16"})]}),"Kosongkan dan Langsung Tekan Export Jika Ingin Menarik Semua Unit."]}),e(U,{ShouldMap:L,name:"userId",onChange:t=>{v(t),i("userId",t)},defaultValues:[]})]})]})}),o("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[D?e("button",{className:"inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md cursor-not-allowed hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",disabled:!0,children:"Exporting..."}):e(P,{children:"Export"}),e(T,{className:"mx-2",onClick:h,children:"Close"})]})]})}export{se as default};