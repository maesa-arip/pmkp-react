import{K as a,a as e}from"./app-de05624d.js";import p from"./Form-ef474961.js";import"./InputError-8e313441.js";import"./InputLabel-2355428e.js";import"./PrimaryButton-cd02b555.js";import"./SecondaryButton-f2f829ff.js";import"./TextAreaInput-c4e566b5.js";import"./TextInput-5a9d338d.js";function j({setIsOpenAddDialog:t}){const{data:o,setData:s,post:i,reset:m,errors:n}=a({name:"",description:""});return e("form",{onSubmit:r=>{r.preventDefault(),i(route("riskVarieties.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(p,{errors:n,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{j as default};