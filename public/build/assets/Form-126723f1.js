import{r as g,j as s,F as N,a as e}from"./app-39b28b75.js";import{I as r}from"./InputError-1bf95e0a.js";import{I as i}from"./InputLabel-3431cd86.js";import{L as x}from"./ListBoxPage-c7d96f08.js";import{P as y}from"./PrimaryButton-14bd2f2a.js";import{S as I}from"./SecondaryButton-0234b844.js";import{T as c}from"./TextInput-0232117d.js";import"./render-c0db6c63.js";import"./keyboard-2676573b.js";import"./use-tracked-pointer-be5d0ab3.js";import"./transition-f985c522.js";import"./use-resolve-button-type-6de0b13d.js";import"./use-outside-click-973caf8c.js";import"./use-controllable-90b8c745.js";function z({errors:m,submit:p,data:l,setData:t,ShouldMap:n,model:o,closeButton:u}){const d=a=>{t({...l,type:a.id})},v=[{name:"Pilih"}],[f,h]=g.useState(()=>o?n[o.type-1]:v[0]);return s(N,{children:[e("div",{className:"px-4 py-5 bg-white sm:p-6",children:s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-12",children:[e(i,{for:"value",value:"Nilai"}),e(c,{id:"value",value:l.value,handleChange:a=>t("value",a.target.value),type:"number",className:"block w-full mt-1"}),e(r,{message:m.value,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[e(i,{for:"name",value:"Nama"}),e(c,{id:"name",value:l.name,handleChange:a=>t("name",a.target.value),type:"text",className:"block w-full mt-1"}),e(r,{message:m.name,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[e(i,{for:"type",value:"Tipe"}),e(x,{ShouldMap:n,selected:f,onChange:a=>{d(a),h(a)}}),e(r,{message:m.type,className:"mt-2"})]})]})}),s("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[e(y,{children:p}),e(I,{className:"mx-2",onClick:u,children:"Batal"})]})]})}export{z as default};
