import{K as a,a as e}from"./app-c16facc7.js";import p from"./Form-e1ed66e9.js";import"./InputError-76bbb453.js";import"./InputLabel-512383bf.js";import"./PrimaryButton-8f5509fc.js";import"./SecondaryButton-91e71e10.js";import"./TextAreaInput-f89a6e84.js";import"./TextInput-13418c97.js";function j({setIsOpenAddDialog:t}){const{data:o,setData:s,post:i,reset:m,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),i(route("riskVarieties.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(p,{errors:n,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{j as default};