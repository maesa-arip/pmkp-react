import{K as a,a as e}from"./app-deaba12f.js";import p from"./Form-1b4925c8.js";import"./InputError-69d219ea.js";import"./InputLabel-c23c89f4.js";import"./PrimaryButton-4345420b.js";import"./SecondaryButton-0599126b.js";import"./TextAreaInput-f974cf67.js";import"./TextInput-4dda37a4.js";function j({setIsOpenAddDialog:t}){const{data:o,setData:s,post:i,reset:m,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),i(route("riskVarieties.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(p,{errors:n,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{j as default};
