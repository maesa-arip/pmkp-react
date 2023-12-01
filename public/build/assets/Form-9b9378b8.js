import{r as i,j as l,F as S,a}from"./app-43246a29.js";import{I as p}from"./InputError-8479d924.js";import{I as n}from"./InputLabel-7159db58.js";import{P as k}from"./PrimaryButton-ab57cc3d.js";import{S as C}from"./SecondaryButton-d32e9bed.js";import{T as f}from"./TextInput-e2264539.js";import{T as I}from"./TextInputCheckbox-89547f78.js";function P({errors:d,roles:h,submit:x,data:r,setData:t,model:o,closeButton:v}){const N=h;let g=o?o.roles.map(e=>e.id):[];const[c,u]=i.useState([]);i.useEffect(()=>{const e=g,m=N.map(s=>e.includes(s.id)?{...s,isSelected:!0}:s);u(m)},[]);const b=e=>{u(m=>m.map(s=>s.id===e?{...s,isSelected:!s.isSelected}:s))},y=c.filter(e=>e.isSelected).map(e=>e.id);return i.useEffect(()=>{t({...r,roles:y})},[c]),l(S,{children:[a("div",{className:"px-4 py-5 bg-white sm:p-6",children:l("div",{className:"grid grid-cols-12 gap-6",children:[l("div",{className:"col-span-6",children:[a(n,{for:"name",value:"Nama"}),a(f,{id:"name",value:r.name,handleChange:e=>t("name",e.target.value),type:"text",className:"block w-full mt-1"}),a(p,{message:d.name,className:"mt-2"})]}),l("div",{className:"col-span-6",children:[a(n,{for:"email",value:"Email"}),a(f,{id:"email",value:r.email,handleChange:e=>t("email",e.target.value),type:"text",className:"block w-full mt-1"}),a(p,{message:d.email,className:"mt-2"})]}),a("div",{className:"col-span-12 mt-2",children:a("p",{className:"text-lg font-semibold text-gray-700",children:"Pilih Roles"})}),c.map(e=>l("div",{className:"flex justify-between col-span-4 px-3 py-4 border rounded-md",children:[a(n,{for:e.name,value:e.name,className:"uppercase"}),a("div",{className:"flex flex-col items-start",children:a(I,{id:e.name,value:e.id,name:e.name,checked:e.isSelected,onChange:m=>{b(e.id)},className:"block w-full"},e.id)})]},e.id))]})}),l("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[a(k,{children:x}),a(C,{className:"mx-2",onClick:v,children:"Batal"})]})]})}export{P as default};