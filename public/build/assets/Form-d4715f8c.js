import{j as e,F as o,a}from"./app-0da779d6.js";import{I as i}from"./InputError-634add90.js";import{I as c}from"./InputLabel-d00fdff0.js";import{P as p}from"./PrimaryButton-a3bfa6c9.js";import{S as d}from"./SecondaryButton-29c22d18.js";import{T as f}from"./TextInput-69f4b767.js";function y({errors:m,submit:r,data:s,setData:l,closeButton:t}){return e(o,{children:[a("div",{className:"px-4 py-5 bg-white sm:p-6",children:a("div",{className:"grid grid-cols-12 gap-6",children:e("div",{className:"col-span-12 sm:col-span-12",children:[a(c,{for:"name",value:"Nama"}),a(f,{id:"name",value:s.name,handleChange:n=>l("name",n.target.value),type:"text",className:"block w-full mt-1"}),a(i,{message:m.name,className:"mt-2"})]})})}),e("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[a(p,{children:r}),a(d,{className:"mx-2",onClick:t,children:"Batal"})]})]})}export{y as default};
