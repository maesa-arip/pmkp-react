import{r as g,j as s,F as N,a as e}from"./app-4dc7e864.js";import{I as r}from"./InputError-e6c099ae.js";import{I as i}from"./InputLabel-858bf6c7.js";import{L as x}from"./ListBoxPage-b610ff7f.js";import{P as y}from"./PrimaryButton-188fc25a.js";import{S as I}from"./SecondaryButton-616e52dd.js";import{T as c}from"./TextInput-6a3dc504.js";import"./render-ea42b304.js";import"./keyboard-84303bfc.js";import"./use-tracked-pointer-ac86867a.js";import"./transition-53d35c05.js";import"./use-outside-click-a2e1bd03.js";import"./use-controllable-d514a8f4.js";function q({errors:l,submit:p,data:m,setData:t,ShouldMap:n,model:o,closeButton:u}){const d=a=>{t({...m,type:a.id})},v=[{name:"Pilih"}],[f,h]=g.useState(()=>o?n[o.type-1]:v[0]);return s(N,{children:[e("div",{className:"px-4 py-5 bg-white sm:p-6",children:s("div",{className:"grid grid-cols-12 gap-6",children:[s("div",{className:"col-span-12",children:[e(i,{for:"value",value:"Nilai"}),e(c,{id:"value",value:m.value,handleChange:a=>t("value",a.target.value),type:"number",className:"block w-full mt-1"}),e(r,{message:l.value,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[e(i,{for:"name",value:"Nama"}),e(c,{id:"name",value:m.name,handleChange:a=>t("name",a.target.value),type:"text",className:"block w-full mt-1"}),e(r,{message:l.name,className:"mt-2"})]}),s("div",{className:"col-span-12",children:[e(i,{for:"type",value:"Tipe"}),e(x,{ShouldMap:n,selected:f,onChange:a=>{d(a),h(a)}}),e(r,{message:l.type,className:"mt-2"})]})]})}),s("div",{className:"px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse",children:[e(y,{children:p}),e(I,{className:"mx-2",onClick:u,children:"Batal"})]})]})}export{q as default};