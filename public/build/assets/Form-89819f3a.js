import{j as e,F as o,a}from"./app-40227382.js";import{I as i}from"./InputError-0cf9554f.js";import{I as c}from"./InputLabel-4fdd6287.js";import{P as p}from"./PrimaryButton-ce8a4982.js";import{S as d}from"./SecondaryButton-e376ea20.js";import{T as f}from"./TextInput-70d63fd3.js";function y({errors:m,submit:r,data:s,setData:l,closeButton:t}){return e(o,{children:[a("div",{className:"px-4 py-5 bg-white sm:p-6",children:a("div",{className:"grid grid-cols-12 gap-6",children:e("div",{className:"col-span-12 sm:col-span-12",children:[a(c,{for:"name",value:"Nama"}),a(f,{id:"name",value:s.name,handleChange:n=>l("name",n.target.value),type:"text",className:"block w-full mt-1"}),a(i,{message:m.name,className:"mt-2"})]})})}),e("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[a(p,{children:r}),a(d,{className:"mx-2",onClick:t,children:"Batal"})]})]})}export{y as default};