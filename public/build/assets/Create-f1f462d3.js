import{K as a,a as e}from"./app-e63dc518.js";import p from"./Form-96a290c9.js";import"./InputError-47496446.js";import"./InputLabel-85eaffe7.js";import"./PrimaryButton-0019f275.js";import"./SecondaryButton-eba774a1.js";import"./TextInput-6ffa0885.js";function h({setIsOpenAddDialog:t}){const{data:o,setData:s,post:n,reset:m,errors:i}=a({name:""});return e("form",{onSubmit:r=>{r.preventDefault(),n(route("IkpJenisInsidens.store"),{data:o,onSuccess:()=>{m(),t(!1)}})},children:e(p,{errors:i,data:o,setData:s,submit:"Simpan",closeButton:r=>t(!1)})})}export{h as default};