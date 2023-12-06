import{K as P,r,_ as g,j as o,a as e}from"./app-57abeb7f.js";import{I as s}from"./InputLabel-3abb9057.js";import{P as K}from"./PrimaryButton-d928be8d.js";import{S as T}from"./SecondaryButton-fc8ffef9.js";import"./TextInput-ca6ef7c6.js";import{t as f}from"./index-1726395c.js";import"./ComboboxMultiple-6a1ccb7b.js";import{C as U}from"./ComboboxMultipleWithOutSemuaUnit-eab95b1f.js";import{C as B}from"./ComboboxPage-94a3c038.js";import"./defineProperty-8250cd14.js";import"./clsx-0d537405.js";import"./index-096dd8d1.js";import"./use-tracked-pointer-49162435.js";import"./render-03fd2506.js";import"./keyboard-fa766a3d.js";import"./use-outside-click-442a3422.js";import"./use-tree-walker-df042132.js";import"./use-controllable-d69111b2.js";import"./transition-93ae57c5.js";import"./use-watch-403218a7.js";function se({setIsOpenAddDialog:m}){const{data:l,setData:i,post:I,reset:H,errors:R,processing:_}=P({name:""}),h=t=>m(!1),[x,b]=r.useState(""),[y,w]=r.useState(""),[k,v]=r.useState(null),[D,d]=r.useState(!1),[u,N]=r.useState([]),S=t=>{t.preventDefault();const n="/riskregisternonklinislarsdhp",M={startDate:x,endDate:y,userId:k,currently_id:u};d(!0),axios.post(n,M,{responseType:"blob"}).then(c=>{const E=window.URL.createObjectURL(new Blob([c.data])),a=document.createElement("a");a.href=E,a.setAttribute("download","Form Manajemen Risiko Non Klinis LARS DHP.xlsx"),document.body.appendChild(a),a.click(),a.remove(),m(!1),d(!1)}).catch(c=>{console.error(c),d(!1)})};let C={currently:[{id:1,name:"Sedang Terjadi"},{id:2,name:"Tidak Sedang Terjadi"},{id:3,name:"Risiko Prioritas"}]};const{users:L}=g().props,{auth:A,permissionNames:p}=g().props,j=p?p.map(t=>t.name):"null";return o("form",{onSubmit:S,children:[e("div",{className:"px-4 py-5 bg-white sm:p-6",children:o("div",{className:"grid grid-cols-12 gap-6",children:[o("div",{className:"col-span-12 px-3 py-4 text-base font-semibold text-gray-700 border rounded",children:[o("svg",{xmlns:"http://www.w3.org/2000/svg",className:"justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("circle",{cx:12,cy:12,r:9}),e("line",{x1:12,y1:8,x2:"12.01",y2:8}),e("polyline",{points:"11 12 12 12 12 16 13 16"})]}),"Kosongkan Tanggal dan Langsung Tekan Export Jika Ingin Export Data Dari Awal Sampai Sekarang."]}),o("div",{className:"col-span-6",children:[e(s,{className:"text-base font-semibold",for:"Start Date",value:"Start Date"}),e(f,{dateFormat:"dd-MM-yyyy",value:l.startDate,id:"startDate",name:"startDate",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:t=>{b(t);const n=new Date(t).toLocaleDateString("en-CA");i("startDate",n)}})]}),o("div",{className:"col-span-6",children:[e(s,{className:"text-base font-semibold",for:"End Date",value:"End Date"}),e(f,{dateFormat:"dd-MM-yyyy",value:l.endDate,id:"endDate",name:"endDate",autoComplete:"off",className:"block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500",onChange:t=>{w(t);const n=new Date(t).toLocaleDateString("en-CA");i("endDate",n)}})]}),o("div",{className:"col-span-12",children:[e(s,{className:"text-base font-semibold",for:"Pilih Kejadian",value:"Pilih Kejadian"}),o("div",{className:"col-span-12 px-3 py-4 mb-2 text-base font-semibold text-gray-700 border rounded",children:[o("svg",{xmlns:"http://www.w3.org/2000/svg",className:"justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("circle",{cx:12,cy:12,r:9}),e("line",{x1:12,y1:8,x2:"12.01",y2:8}),e("polyline",{points:"11 12 12 12 12 16 13 16"})]}),"Kosongkan dan Langsung Tekan Export Jika Ingin Menarik Semua Kejadian."]}),e(B,{ShouldMap:C.currently,selected:u,onChange:t=>{i({...l,currently_id:t.id}),N(t)}})]}),j.indexOf("lihat data semua risk register")>-1&&o("div",{className:"col-span-12",children:[e(s,{className:"text-base font-semibold",for:"Pilih Unit",value:"Pilih Unit"}),o("div",{className:"col-span-12 px-3 py-4 mb-2 text-base font-semibold text-gray-700 border rounded",children:[o("svg",{xmlns:"http://www.w3.org/2000/svg",className:"justify-center inline w-6 h-6 mr-3 -mt-1 text-center text-white rounded-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 icon icon-tabler icon-tabler-info-circle",width:24,height:24,viewBox:"0 0 24 24",strokeWidth:2,stroke:"currentColor",fill:"none",strokeLinecap:"round",strokeLinejoin:"round",children:[e("path",{stroke:"none",d:"M0 0h24v24H0z",fill:"none"}),e("circle",{cx:12,cy:12,r:9}),e("line",{x1:12,y1:8,x2:"12.01",y2:8}),e("polyline",{points:"11 12 12 12 12 16 13 16"})]}),"Kosongkan dan Langsung Tekan Export Jika Ingin Menarik Semua Unit."]}),e(U,{ShouldMap:L,name:"userId",onChange:t=>{v(t),i("userId",t)},defaultValues:[]})]})]})}),o("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[D?e("button",{className:"inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md cursor-not-allowed hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",disabled:!0,children:"Exporting..."}):e(K,{children:"Export"}),e(T,{className:"mx-2",onClick:h,children:"Close"})]})]})}export{se as default};
